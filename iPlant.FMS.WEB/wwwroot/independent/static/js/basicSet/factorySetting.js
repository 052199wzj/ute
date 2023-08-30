require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($yang, $com) {

        var Factory_Data = [],
            KEYWORD,
            KEYWORD_factory,
            KEYWORD_shift,
            KEYWORD_detail,
            Columns_factory,
            Columns_shift,
            Columns_detail,
            KEYWORD_shift_LIST,
            KEYWORD_factory_LIST,
            KEYWORD_detail_LIST,

            model,
            DEFAULT_VALUE_factory,
            DEFAULT_VALUE_shift,
            DEFAULT_VALUE_detail,
            TypeSource_factory,
            TypeSource_shift,
            TypeSource_detail,
            DEFAULT_VALUE_shift_Own;

        DEFAULT_VALUE_factory = {
            name: "",
            maxTaskRatio: 0,
            normalTaskRatio: 0,
            workDays: 0,
            active: true,
        };
        DEFAULT_VALUE_shift = {
            shiftName: "",
            startTime: new Date("2000-01-01 00:00"),
        };
        DEFAULT_VALUE_shift_Own = {
            shiftName: "",
        };
        DEFAULT_VALUE_detail = {
            zoneName: "",

            minutes: 0,
            idleOrWork: true,
        };


        (function () {
            KEYWORD_factory_LIST = [
                "iD|编号",
                "name|名称",
                "maxTaskRatio|最大排班率",
                "normalTaskRatio|正常排班率",
                "workDays|每周工作天数",
                "dayHours|日工作时长",
                "shift|班次数",
                "active|状态|ArrayOne",
            ];

            KEYWORD_factory = {};
            Columns_factory = [];

            TypeSource_factory = {
                active: [{
                    name: "激活",
                    value: true,
                }, {
                    name: "禁用",
                    value: false,
                }],
                parentID: [{
                    name: "无",
                    value: 0,
                }],
            };

            Columns_factory.push({
                checkbox: true,
                formatter: function (value, row, index) {
                    return index + 1;
                },
            });

            $.each(KEYWORD_factory_LIST, function (i, item) {
                var detail = item.split("|");
                KEYWORD_factory[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                };
                var _column = {
                    field: detail[0],
                    title: detail[1],
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                };
                if (detail.length > 2) {
                    _column.formatter = $com.modal.getFormatter(TypeSource_factory, detail[0], detail[2]);
                }
                Columns_factory.push(_column);
            });
        })();


        (function () {

            KEYWORD_shift_LIST = [
                "iD|编号",
                "shiftName|名称",
                "startTime|开始时间|Time",
                "minutes|总时长",
                "workMinutes|工作时长",
                "idleMinutes|休息时长",
            ];

            KEYWORD_shift = {};

            Columns_shift = [];


            TypeSource_shift = {
                active: [{
                    name: "激活",
                    value: 1,
                }, {
                    name: "禁用",
                    value: 0,
                }],
                parentID: [{
                    name: "无",
                    value: 0,
                }],
            };

            Columns_shift.push({
                checkbox: true,
                formatter: function (value, row, index) {
                    return index + 1;
                },
            });

            $.each(KEYWORD_shift_LIST, function (i, item) {
                var detail = item.split("|");
                KEYWORD_shift[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                };
                var _column = {
                    field: detail[0],
                    title: detail[1],
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                };
                if (detail.length > 2) {
                    _column.formatter = $com.modal.getFormatter(TypeSource_shift, detail[0], detail[2]);

                }
                Columns_shift.push(_column);
            });

        })();


        (function () {

            KEYWORD_detail_LIST = [
                "iD|编号",
                "zoneName|名称",
                "minutes|时长",
                "startTime|开始时间|Time",
                "idleOrWork|是否工作|ArrayOne",
            ];

            KEYWORD_detail = {};

            Columns_detail = [];


            TypeSource_detail = {
                idleOrWork: [{
                    name: "是",
                    value: true,
                }, {
                    name: "否",
                    value: false,
                }],
            };

            Columns_detail.push({
                checkbox: true,
                formatter: function (value, row, index) {
                    return index + 1;
                },
            });

            $.each(KEYWORD_detail_LIST, function (i, item) {
                var detail = item.split("|");
                KEYWORD_detail[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                };
                var _column = {
                    field: detail[0],
                    title: detail[1],
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                };
                if (detail.length > 2) {
                    _column.formatter = $com.modal.getFormatter(TypeSource_detail, detail[0], detail[2]);
                }
                Columns_detail.push(_column);
            });

        })();

        model = $com.Model.create({
            name: 'iPlant.MES',

            type: $com.Model.MAIN,

            configure: function () {
                $("#zsq_hidden").hide();
                this.run();

            },

            events: function () {
                $("body").delegate("#femi-save", "click", function () {
                    $com.app.loading("保存中，请稍后。。。");
                    model.com.saveData(Factory_Data);
                });

                (function () {
                    $("body").delegate(".toolbar-shift .btn_add", "click", function () {
                        //获取btn所在的table对象和row.name
                        var factory_name;
                        var factory_ID;
                        var $this_table;
                        $(this).closest(".bootstrap-table").find("table.tb_sub").each(function (i, item) {
                            if ($(item).attr("data-name") == null)
                                return true;
                            $this_table = $(item);
                            factory_name = $(item).attr("data-name");
                            factory_ID = Number($(item).attr("data-id"));

                        });
                        if (!factory_name || isNaN(factory_ID)) {
                            alert("找不到该表！");
                            return false;
                        }
                        var _in_default = DEFAULT_VALUE_shift;

                        var _factory_data = $com.util.find(Factory_Data, function (p) {
                            return p.iD == factory_ID;
                        });
                        var _IsOwn = (_factory_data && _factory_data.shiftList.bMSFactoryShift.length);

                        if (_IsOwn) {
                            _in_default = DEFAULT_VALUE_shift_Own;
                        } else {
                            _in_default.startTime = new Date("2000-01-01");
                        }

                        //将Json数据中的数据值改成对应默认值，然后传入进去
                        $("body").append($com.modal.show(_in_default, KEYWORD_shift, "新增" + factory_name + "的班次", function (rst) {
                            //调用插入函数然后用load刷新数据源
                            if (!rst || $.isEmptyObject(rst))
                                return false;
                            var _data = {
                                iD: GetMaxShift(factory_ID),
                                shiftName: rst.shiftName,
                                minutes: 0,
                                idleMinutes: 0,
                                workMinutes: 0,
                                idleZoneList: {
                                    bMSShiftZone: [],
                                },
                            };

                            $.each(Factory_Data, function (i, item) {
                                if (item.iD != factory_ID)
                                    return true;

                                if (_IsOwn) {
                                    var _last_shift_data = item.shiftList.bMSFactoryShift[item.shiftList.bMSFactoryShift.length - 1];

                                    _data.startTime = new Date(_last_shift_data.startTime + 60000 * (_last_shift_data.minutes)).getTime();
                                } else {
                                    _data.startTime = rst.startTime.getTime();
                                }
                                item.shiftList.bMSFactoryShift.push(_data);
                                $this_table.bootstrapTable('load', item);
                                $this_table.find(":checkbox").prop("checked", false);
                                return false;
                            });

                        }, TypeSource_shift));
                    });
                    $("body").delegate(".toolbar-shift .btn_edit", "click", function () {
                        //获取btn所在的table对象和row.name
                        var factory_name;
                        var factory_ID;
                        var $this_table;
                        $(this).closest(".bootstrap-table").find("table.tb_sub").each(function (i, item) {
                            if ($(item).attr("data-name") == null)
                                return true;

                            $this_table = $(item);
                            factory_name = $(item).attr("data-name");
                            factory_ID = Number($(item).attr("data-id"));

                        });
                        if (!factory_name || isNaN(factory_ID)) {
                            alert("找不到该表！");
                            return false;
                        }


                        var SelectData = $this_table.bootstrapTable('getSelections');
                        if (!SelectData || !SelectData.length) {
                            alert("请先选择一行数据再试！");
                            return;
                        }
                        if (SelectData.length != 1) {
                            alert("只能同时对一行数据修改！");
                            return;
                        }
                        var mSelect = {
                            shiftName: SelectData[0].shiftName,
                        };

                        var _factory_data = $com.util.find(Factory_Data, function (p) {
                            return p.iD == factory_ID;
                        });

                        var _IsOwn = (_factory_data && _factory_data.shiftList.bMSFactoryShift.length > 1);

                        if (_IsOwn) {
                            var _s_index = $com.util.findIndex(_factory_data.shiftList.bMSFactoryShift, function (p) {
                                return p.iD == SelectData[0].iD;
                            });
                            _IsOwn = _s_index > 0;
                        }
                        //判断是否有子并且不是最开始的那个子

                        if (!_IsOwn) {

                            //无子项或这是子项第一项
                            mSelect.startTime = SelectData[0].startTime;
                        }


                        $("body").append($com.modal.show(mSelect, KEYWORD_shift, "修改" + factory_name + "的班次", function (rst) {

                            if (!rst || $.isEmptyObject(rst))
                                return false;
                            //调用更新函数然后用load刷新数据源
                            $.each(Factory_Data, function (i, item) {
                                if (item.iD != factory_ID)
                                    return true;

                                var _in_i = 0;
                                $.each(item.shiftList.bMSFactoryShift, function (s_i, s_item) {
                                    if (s_item.iD != SelectData[0].iD) {
                                        if (s_i < 1 || s_i <= _in_i) {
                                            return true;
                                        }
                                        var _prev_s_data = item.shiftList.bMSFactoryShift[s_i - 1];
                                        s_item.startTime = new Date(_prev_s_data.startTime + 60000 * _prev_s_data.minutes).getTime();
                                        orderTimeZone(s_item);

                                        return true;
                                    }

                                    _in_i = s_i;

                                    s_item.shiftName = rst.shiftName;

                                    if (!_IsOwn) {
                                        s_item.startTime = rst.startTime.getTime();
                                    }
                                    orderTimeZone(s_item);

                                });
                                $this_table.bootstrapTable('load', item.shiftList.bMSFactoryShift);
                                $this_table.find(":checkbox").prop("checked", false);
                                return false;

                            });


                        }), TypeSource_shift);
                    });
                    $("body").delegate(".toolbar-shift .btn_delete", "click", function () {

                        var factory_name;
                        var factory_ID;
                        var $this_table;
                        $(this).closest(".bootstrap-table").find("table.tb_sub").each(function (i, item) {
                            if ($(item).attr("data-name") == null)
                                return true;

                            $this_table = $(item);
                            factory_name = $(item).attr("data-name");
                            factory_ID = Number($(item).attr("data-id"));

                        });
                        if (!factory_name || isNaN(factory_ID)) {
                            alert("找不到该表！");
                            return false;
                        }


                        var SelectData = $this_table.bootstrapTable('getAllSelections');
                        if (!SelectData || !SelectData.length) {
                            alert("至少选择一行数据再试！");
                            return;
                        }
                        if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {

                            return;
                        }


                        $.each(Factory_Data, function (i, item) {
                            if (item.iD != factory_ID)
                                return true;

                            $.each(SelectData, function (s_i, s_item) {
                                var _s_index = $com.util.findIndex(item.shiftList.bMSFactoryShift, function (p) {
                                    return p.iD == s_item.iD;
                                });

                                if (_s_index < 0)
                                    return true;
                                item.shiftList.bMSFactoryShift.splice(_s_index, 1);

                            });
                            item.shift = item.shiftList.bMSFactoryShift.length;
                            item.dayHours = 0;

                            $.each(item.shiftList.bMSFactoryShift, function (s_i, s_item) {
                                item.dayHours += s_item.workMinutes;
                                if (s_i > 0) {
                                    var _prev_s_data = item.shiftList.bMSFactoryShift[s_i - 1];
                                    s_item.startTime = new Date(_prev_s_data.startTime + 60000 * (_prev_s_data.minutes)).getTime();

                                    orderTimeZone(s_item);

                                }

                            });

                            $this_table.bootstrapTable('load', item.shiftList.bMSFactoryShift);
                            $this_table.find(":checkbox").prop("checked", false);
                            return false;

                        });

                    });


                })();


                function orderData(_in_data, factory_ID, shift_ID) {
                    if (s_id) {
                        $.each(_in_data, function (m_i, m_item) {
                            if (m_item.iD != factory_ID)
                                return true;

                            $.each(m_item.shiftList.bMSFactoryShift, function (s_i, s_item) {

                                if (s_item.iD != shift_ID)
                                    return true;

                                $.each(s_item.idleZoneList.bMSShiftZone, function (z_i, z_item) {
                                });

                                return false;

                            });
                            return false;
                        });

                    } else {
                        $.each(_in_data, function (m_i, m_item) {
                            if (m_item.iD != factory_ID)
                                return true;

                            $.each(m_item.shiftList.bMSFactoryShift, function (s_i, s_item) {
                            });
                            return false;
                        });
                    }
                }


                function GetMaxFactory() {
                    var _rst = 0;
                    $.each(Factory_Data, function (i, item) {

                        if (item.iD > _rst)
                            _rst = item.iD;
                    });
                    return _rst + 1;
                }

                function GetMaxShift(factory_ID) {
                    var _rst = 0;
                    $.each(Factory_Data, function (i, item) {

                        if (item.iD != factory_ID)
                            return true;
                        $.each(item.shiftList.bMSFactoryShift, function (s_i, s_item) {
                            if (s_item.iD > _rst)
                                _rst = s_item.iD;
                        });

                    });
                    return _rst + 1;
                }

                function GetMaxZone(factory_ID, shift_id) {
                    var _rst = 0;
                    $.each(Factory_Data, function (i, item) {

                        if (item.iD != factory_ID)
                            return true;
                        $.each(item.shiftList.bMSFactoryShift, function (s_i, s_item) {

                            if (s_item.iD != shift_id)
                                return true;
                            $.each(s_item.idleZoneList.bMSShiftZone, function (z_i, z_item) {

                                if (z_item.iD > _rst)
                                    _rst = z_item.iD;
                            });

                        });
                    });
                    return _rst + 1;
                }


                function orderTimeZone(shift_data) {
                    $.each(shift_data.idleZoneList.bMSShiftZone, function (z_i, z_item) {
                        if (z_i == 0) {
                            z_item.startTime = shift_data.startTime;
                        } else {
                            var _prev_z_data = shift_data.idleZoneList.bMSShiftZone[z_i - 1];

                            z_item.startTime = new Date(_prev_z_data.startTime + 60000 * _prev_z_data.minutes).getTime();
                        }
                    });
                }

                (function () {
                    /*$("body").delegate(".toolbar-factory .btn_add", "click", function() {

                        //将Json数据中的数据值改成对应默认值，然后传入进去
                        $("body").append($com.modal.show(DEFAULT_VALUE_factory, KEYWORD_factory, "新增", function(rst) {
                            //调用插入函数然后用load刷新数据源
                            if (!rst || $.isEmptyObject(rst))
                                return false;
                            var _data = {
                                iD : GetMaxFactory(),
                                name : rst.name,
                                maxTaskRatio : Number(rst.maxTaskRatio),
                                normalTaskRatio : Number(rst.normalTaskRatio),
                                workDays : Number(rst.workDays),
                                dayHours : 0,
                                shift : 0,
                                active : $com.util.boolean(rst.active),
                                shiftList : {
                                    bMSFactoryShift : [],
                                },
                            };
                            Factory_Data.push(_data);
                            $(".tb_factory").bootstrapTable('load', Factory_Data);
                            $(".tb_factory").find(":checkbox").prop("checked", false);
                        }, TypeSource_factory));

                    });*/
                    $("body").delegate(".toolbar-factory .btn_edit", "click", function () {

                        var SelectData = $('.tb_factory').bootstrapTable('getSelections');
                        if (!SelectData || !SelectData.length) {
                            alert("请先选择一行数据再试！");
                            return;
                        }
                        if (SelectData.length != 1) {
                            alert("只能同时对一行数据修改！");
                            return;
                        }
                        var mSelect = {
                            name: SelectData[0].name,
                            maxTaskRatio: Number(SelectData[0].maxTaskRatio),
                            normalTaskRatio: Number(SelectData[0].normalTaskRatio),
                            workDays: Number(SelectData[0].workDays),
                        };
                        $("body").append($com.modal.show(mSelect, KEYWORD_factory, "修改", function (rst) {

                            //调用更新函数然后用load刷新数据源
                            if (!rst || $.isEmptyObject(rst))
                                return false;
                            $.each(Factory_Data, function (i, item) {
                                if (item.iD != SelectData[0].iD)
                                    return true;
                                item.name = rst.name;
                                item.maxTaskRatio = Number(rst.maxTaskRatio);
                                item.normalTaskRatio = Number(rst.normalTaskRatio);
                                item.workDays = Number(rst.workDays);

                                return false;

                            });
                            $(".tb_factory").find(":checkbox").prop("checked", false);
                            $(".tb_factory").bootstrapTable('load', Factory_Data);

                        }), TypeSource_factory);
                    });
                    /*$("body").delegate(".toolbar-factory .btn_delete", "click", function() {

                        var SelectData = $('.tb_factory').bootstrapTable('getAllSelections');
                        if (!SelectData || !SelectData.length) {
                            alert("至少选择一行数据再试！")
                            return;
                        }
                        if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                            return;
                        }
                        $.each(SelectData,function(i, item) {
                            var _f_index = $com.util.findIndex(Factory_Data,function(p) {
                                return p.iD == item.iD
                            });

                            if (_f_index < 0) {

                                return true;
                            }
                            Factory_Data.splice(_f_index, 1);
                        })

                        $(".tb_factory").bootstrapTable('load', Factory_Data);
                    });*/
                    $("body").delegate(".toolbar-factory .btn_refresh", "click", function () {


                        $(".tb_factory").bootstrapTable('load', Factory_Data);

                        $(".tb_factory").find(":checkbox").prop("checked", false);
                        //调用删除函数然后用load刷新数据源

                    });
                    /*$("body").delegate(".toolbar-factory .btn_disable", "click", function() {

                        var SelectData = $('.tb_factory').bootstrapTable('getSelections');
                        if (!SelectData || !SelectData.length) {
                            alert("请先选择一行数据再试！")
                            return;
                        }
                        if (!confirm("已选择" + SelectData.length + "条数据，确定将其禁用？")) {
                            return;
                        }


                        $.each(SelectData,function(i, item) {
                            var _f_index = $com.util.findIndex(Factory_Data,function(p) {
                                return p.iD == item.iD
                            });

                            if (_f_index < 0) {

                                return true;
                            }
                            Factory_Data[_f_index].active = false;
                        })

                        $(".tb_factory").bootstrapTable('load', Factory_Data);

                        $(".tb_factory").find(":checkbox").prop("checked", false);

                    });
                    $("body").delegate(".toolbar-factory .btn_active", "click", function() {

                        var SelectData = $('.tb_factory').bootstrapTable('getSelections');
                        if (!SelectData || !SelectData.length) {
                            alert("请先选择一行数据再试！")
                            return;
                        }
                        if (!confirm("已选择" + SelectData.length + "条数据，确定将其激活？")) {
                            return;
                        }


                        $.each(SelectData,function(i, item) {
                            var _f_index = $com.util.findIndex(Factory_Data,function(p) {
                                return p.iD == item.iD
                            });

                            if (_f_index < 0) {

                                return true;
                            }
                            Factory_Data[_f_index].active = true;
                        })
                        $(".tb_factory").bootstrapTable('load', Factory_Data);

                        $(".tb_factory").find(":checkbox").prop("checked", false);

                    });*/

                })();


                (function () {
                    $("body").delegate(".toolbar-detail .btn_add", "click", function () {
                        var $this = $(this);
                        var shift_name;
                        var shift_ID;
                        var factory_name;
                        var factory_ID;
                        var $this_table;
                        $this.closest(".bootstrap-table").find("table.tb_subItem").each(function (i, item) {
                            if ($(item).attr("data-name") == null)
                                return true;

                            $this_table = $(item);
                            shift_name = $(item).attr("data-name");
                            shift_ID = Number($(item).attr("data-id"));

                        });
                        if (!shift_name || isNaN(shift_ID)) {
                            alert("此表未找到父表标识");
                            return false;
                        }
                        var $shift_table = $this.closest(".bootstrap-table").find("table.tb_subItem").closest("table.tb_sub");

                        if (!$shift_table[0]) {
                            alert("此表未找到父表");
                            return false;
                        }
                        factory_name = $shift_table.attr("data-name");
                        factory_ID = Number($shift_table.attr("data-id"));


                        var _factory_data = $com.util.find(Factory_Data, function (p) {
                            return p.iD == factory_ID;
                        });


                        var _shift_data = $com.util.find(_factory_data.shiftList.bMSFactoryShift, function (p) {
                            return p.iD == shift_ID;
                        });
                        var _IsOwn = (_shift_data && _shift_data.idleZoneList.bMSShiftZone.length > 0);


                        //将Json数据中的数据值改成对应默认值，然后传入进去
                        $("body").append($com.modal.show(DEFAULT_VALUE_detail, KEYWORD_detail, "新增" + factory_name + "." + shift_name + "的详情", function (rst) {
                            //调用插入函数然后用load刷新数据源
                            if (!rst || $.isEmptyObject(rst))
                                return false;
                            var _data = {
                                iD: GetMaxZone(factory_ID, shift_ID),
                                zoneName: rst.zoneName,
                                startTime: _shift_data.startTime,
                                minutes: Number(rst.minutes),
                                idleOrWork: $com.util.boolean(rst.idleOrWork),
                            };
                            if (_IsOwn) {
                                var _last_zone_data = _shift_data.idleZoneList.bMSShiftZone[_shift_data.idleZoneList.bMSShiftZone.length - 1];

                                _data.startTime = new Date(_last_zone_data.startTime + 60000 * (_last_zone_data.minutes)).getTime();

                            }


                            $.each(Factory_Data, function (m_i, m_item) {
                                if (m_item.iD != factory_ID)
                                    return true;
                                var _in_i = 0;
                                m_item.dayHours = 0;
                                $.each(m_item.shiftList.bMSFactoryShift, function (s_i, s_item) {

                                    if (s_item.iD != shift_ID) {
                                        m_item.dayHours += s_item.workMinutes;
                                        if (s_i < 1 || s_i <= _in_i) {
                                            return true;
                                        }
                                        var _prev_s_data = m_item.shiftList.bMSFactoryShift[s_i - 1];
                                        s_item.startTime = new Date(_prev_s_data.startTime + 60000 * _prev_s_data.minutes).getTime();

                                        orderTimeZone(s_item);


                                        return true;
                                    }
                                    _in_i = s_i;

                                    s_item.idleZoneList.bMSShiftZone.push(_data);
                                    s_item.minutes += _data.minutes;
                                    if (_data.idleOrWork) {
                                        s_item.workMinutes += _data.minutes;
                                    } else {
                                        s_item.idleMinutes += _data.minutes;
                                    }
                                    m_item.dayHours += s_item.workMinutes;
                                    $this_table.bootstrapTable('load', s_item.idleZoneList.bMSShiftZone);

                                    $this_table.find(":checkbox").prop("checked", false);

                                });

                                return false;

                            });


                        }, TypeSource_detail));

                    });
                    $("body").delegate(".toolbar-detail .btn_edit", "click", function () {
                        //获取btn所在的table对象和row.name
                        var $this = $(this);
                        var shift_name;
                        var shift_ID;
                        var factory_name;
                        var factory_ID;
                        var $this_table;
                        $this.closest(".bootstrap-table").find("table.tb_subItem").each(function (i, item) {
                            if ($(item).attr("data-name") == null)
                                return true;

                            $this_table = $(item);
                            shift_name = $(item).attr("data-name");
                            shift_ID = Number($(item).attr("data-id"));

                        });
                        if (!shift_name || isNaN(shift_ID)) {
                            alert("此表未找到父表标识");
                            return false;
                        }
                        var $shift_table = $this.closest(".bootstrap-table").find("table.tb_subItem").closest("table.tb_sub");

                        if (!$shift_table[0]) {
                            alert("此表未找到父表");
                            return false;
                        }
                        factory_name = $shift_table.attr("data-name");
                        factory_ID = Number($shift_table.attr("data-id"));

                        var SelectData = $this_table.bootstrapTable('getSelections');
                        if (!SelectData || !SelectData.length) {
                            alert("请先选择一行数据再试！");
                            return;
                        }
                        if (SelectData.length != 1) {
                            alert("只能同时对一行数据修改！");
                            return;
                        }

                        var mSelect = {
                            zoneName: SelectData[0].zoneName,

                            minutes: SelectData[0].minutes,
                            idleOrWork: SelectData[0].idleOrWork,
                        };
                        var _factory_data = $com.util.find(Factory_Data, function (p) {
                            return p.iD == factory_ID;
                        });

                        var _shift_data = $com.util.find(_factory_data.shiftList.bMSFactoryShift, function (p) {
                            return p.iD == shift_ID;
                        });
                        var _IsOwn = (_shift_data && _shift_data.idleZoneList.bMSShiftZone.length > 1);


                        $("body").append($com.modal.show(mSelect, KEYWORD_detail, "修改" + factory_name + "." + shift_name + "的详情", function (rst) {
                            //调用更新函数然后用load刷新数据源

                            $.each(Factory_Data, function (m_i, m_item) {
                                if (m_item.iD != factory_ID)
                                    return true;
                                var _in_i = 0;
                                m_item.dayHours = 0;
                                $.each(m_item.shiftList.bMSFactoryShift, function (s_i, s_item) {

                                    if (s_item.iD != shift_ID) {
                                        m_item.dayHours += s_item.workMinutes;
                                        if (s_i < 1 || s_i <= _in_i) {
                                            return true;
                                        }
                                        var _prev_s_data = m_item.shiftList.bMSFactoryShift[s_i - 1];
                                        s_item.startTime = new Date(_prev_s_data.startTime + 60000 * _prev_s_data.minutes).getTime();
                                        orderTimeZone(s_item);
                                        /*$.each(s_item.idleZoneList.bMSShiftZone, function(z_i, z_item) {
                                            if (z_i == 0) {
                                                z_item.startTime == s_item.startTime;
                                            } else {
                                                var _prev_z_data = s_item.idleZoneList.bMSShiftZone[z_i - 1];

                                                z_item.startTime = new Date(_prev_z_data.startTime.getTime() + 60000 * _prev_z_data.minutes);
                                            }
                                        });*/

                                        return true;
                                    }

                                    var _z_index = $com.util.findIndex(s_item.idleZoneList.bMSShiftZone, function (p) {
                                        return p.iD == SelectData[0].iD;
                                    });
                                    if (_z_index < 0)
                                        return true;

                                    _in_i = s_i;

                                    if (s_item.idleZoneList.bMSShiftZone[_z_index].idleOrWork) {
                                        if ($com.util.boolean(rst.idleOrWork)) {
                                            s_item.workMinutes -= (s_item.idleZoneList.bMSShiftZone[_z_index].minutes - Number(rst.minutes));
                                        } else {
                                            s_item.workMinutes -= s_item.idleZoneList.bMSShiftZone[_z_index].minutes;
                                            s_item.idleMinutes += Number(rst.minutes);
                                        }
                                    } else {
                                        if ($com.util.boolean(rst.idleOrWork)) {
                                            s_item.workMinutes += Number(rst.minutes);
                                            s_item.idleMinutes -= s_item.idleZoneList.bMSShiftZone[_z_index].minutes;
                                        } else {
                                            s_item.idleMinutes -= (s_item.idleZoneList.bMSShiftZone[_z_index].minutes - Number(rst.minutes));
                                        }
                                    }
                                    s_item.minutes = s_item.idleMinutes + s_item.workMinutes;

                                    s_item.idleZoneList.bMSShiftZone[_z_index].zoneName = rst.zoneName;
                                    s_item.idleZoneList.bMSShiftZone[_z_index].minutes = Number(rst.minutes);
                                    s_item.idleZoneList.bMSShiftZone[_z_index].idleOrWork = $com.util.boolean(rst.idleOrWork);

                                    m_item.dayHours += s_item.workMinutes;

                                    orderTimeZone(s_item);

                                    $this_table.bootstrapTable('load', s_item.idleZoneList.bMSShiftZone);
                                    $this_table.find(":checkbox").prop("checked", false);

                                });
                                return false;
                            });

                        }, TypeSource_detail));
                    });
                    $("body").delegate(".toolbar-detail .btn_delete", "click", function () {

                        var $this = $(this);
                        var shift_name;
                        var shift_ID;
                        var factory_name;
                        var factory_ID;
                        var $this_table;
                        $this.closest(".bootstrap-table").find("table.tb_subItem").each(function (i, item) {
                            if ($(item).attr("data-name") == null)
                                return true;

                            $this_table = $(item);
                            shift_name = $(item).attr("data-name");
                            shift_ID = Number($(item).attr("data-id"));

                        });
                        if (!shift_name || isNaN(shift_ID)) {
                            alert("此表未找到父表标识");
                            return false;
                        }
                        var $shift_table = $this.closest(".bootstrap-table").find("table.tb_subItem").closest("table.tb_sub");

                        if (!$shift_table[0]) {
                            alert("此表未找到父表");
                            return false;
                        }
                        factory_name = $shift_table.attr("data-name");
                        factory_ID = Number($shift_table.attr("data-id"));

                        var SelectData = $this_table.bootstrapTable('getAllSelections');
                        if (!SelectData || !SelectData.length) {
                            alert("至少选择一行数据再试！");
                            return;
                        }
                        if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                            return;
                        }

                        $.each(Factory_Data, function (m_i, m_item) {
                            if (m_item.iD != factory_ID)
                                return true;
                            var _in_i = 0;
                            m_item.dayHours = 0;
                            $.each(m_item.shiftList.bMSFactoryShift, function (s_i, s_item) {

                                if (s_item.iD != shift_ID) {
                                    m_item.dayHours += s_item.workMinutes;
                                    if (s_i < 1 || s_i <= _in_i) {
                                        return true;
                                    }
                                    var _prev_s_data = m_item.shiftList.bMSFactoryShift[s_i - 1];
                                    s_item.startTime = new Date(_prev_s_data.startTime + 60000 * _prev_s_data.minutes).getTime();
                                    orderTimeZone(s_item);
                                    /*	$.each(s_item.idleZoneList.bMSShiftZone, function(z_i, z_item) {
                                            if (z_i == 0) {
                                                z_item.startTime == s_item.startTime;
                                            } else {
                                                var _prev_z_data = s_item.idleZoneList.bMSShiftZone[z_i - 1];

                                                z_item.startTime = new Date(_prev_z_data.startTime.getTime() + 60000 * _prev_z_data.minutes);
                                            }
                                        });*/

                                    return true;
                                }


                                $.each(SelectData, function (z_i, z_item) {

                                    var _z_index = $com.util.findIndex(s_item.idleZoneList.bMSShiftZone, function (p) {
                                        return p.iD == z_item.iD;
                                    });
                                    if (_z_index < 0)
                                        return true;
                                    s_item.idleZoneList.bMSShiftZone.splice(_z_index, 1);

                                });

                                orderTimeZone(s_item);
                                s_item.workMinutes = 0;
                                s_item.idleMinutes = 0;

                                $.each(s_item.idleZoneList.bMSShiftZone, function (z_i, z_item) {
                                    if (z_item.idleOrWork) {
                                        s_item.workMinutes += z_item.minutes;
                                    } else {
                                        s_item.idleMinutes += z_item.minutes;
                                    }
                                });
                                s_item.minutes = s_item.workMinutes + s_item.idleMinutes;
                                m_item.dayHours += s_item.workMinutes;
                                $this_table.bootstrapTable('load', s_item.idleZoneList.bMSShiftZone);
                                $this_table.find(":checkbox").prop("checked", false);


                            });
                            return false;

                        });

                    });

                })();


            },

            run: function () {

                //调用部门岗位所有信息
                $(function () {
                    model._data = {};
                    var $table = $('.tb_factory');
                    $table.html("");
                    var $toolbars = $(".femi-table .femi-table-toolbar");
                    model.com.render($table, Columns_factory, Columns_shift,
                        Columns_detail, $toolbars, "getFactory");
                    model.com.get({}, function (res) {
                        if (res && res.list) {

                            Factory_Data = res.list;
                            $table.bootstrapTable('load', Factory_Data);
                        }
                    });


                    /*	$(".femi-table-shift").remove();
                        $(".femi-table-detail").remove();*/

                    /*
                                $(".toolbar-shift .btn_refresh").remove();
                                $(".toolbar-detail .btn_refresh").remove();*/
                    $(".femi-table-toolbar").find(".femi-excel-dropdown,.btn_active,.btn_disable,.btn_search").remove();

                    $(".toolbar-factory").find(".btn_add,.btn_delete,.btn_search").remove();
                    /*	$(".toolbar-shift .btn_active").remove();
                        $(".toolbar-detail .btn_active").remove();
                        $(".toolbar-shift .btn_disable").remove();
                        $(".toolbar-detail .btn_disable").remove();
                        */
                    $(".femi-table-toolbar:not(.toolbar-factory)").find(".btn_refresh").remove();

                });
            },

            com: {
                get: function (data, fn, context) {
                    var d = {
                        $URI: "/factory/all",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                refresh: function () {
                    model.com.get({}, function (res) {
                        if (res && res.list)
                            $table.bootstrapTable('load', res.list);
                        Factory_Data = res.list;
                    });
                },
                saveData: function (datalsit) {
                    model.com.post({
                        data: datalsit,
                    }, function (res) {
                        alert("数据保存成功");
                    });
                },

                post: function (data, fn, context) {
                    var d = {
                        $URI: "/factory/update",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },


                render: function ($table, Columns1, Columns2, Columns3, $toolbar, fnNmae) {


                    var responseHandler = function (res) {
                        //远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
                        //在ajax后我们可以在这里进行一些事件的处理
                        var list = res.list,
                            rst = [];

                        switch (fnNmae) {
                            case "getFactory":

                                if (list) {
                                    $.each(list, function () {
                                    });
                                }
                                model._data.source_deps = list;
                                model._data.deps = rst;
                                break;
                            case "getShift":
                                if (list) {
                                    $.each(list, function () {
                                    });
                                }
                                model._data.source_posn = list;
                                model._data.posn = rst;
                                break;
                            case "getDetail":
                                if (list) {
                                    $.each(list, function () {
                                    });
                                }
                                model._data.source_posn = list;
                                model._data.posn = rst;
                                break;
                            default:
                                break;
                        }

                        return rst;
                    };

                    var TableInit = function () {
                        var oTableInit = new Object();
                        //初始化Table
                        oTableInit.Init = function () {
                            $table.bootstrapTable({
                                toolbar: $($toolbar[0]), //工具按钮用哪个容器
                                striped: true, //是否显示行间隔色
                                cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                                pagination: true, //是否显示分页（*）
                                sortable: false, //是否启用排序
                                sortOrder: "asc", //排序方式
                                sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                                search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
                                strictSearch: false, //全匹配
                                searchTimeOut: 5000, //搜索超时时间
                                searchOnEnterKey: true, //	设置为 true时，按回车触发搜索方法，否则自动触发搜索方法
                                trimOnSearch: false, //设置为 true 将允许空字符搜索
                                showColumns: false, //是否显示 内容列下拉框
                                showPaginationSwitch: true, //是否显示 数据条数选择框
                                pageSize: 20,
                                pageList: [20, 50, 100, "All"],
                                undefinedText: "",
                                showColumns: true, //是否显示所有的列
                                showRefresh: false, //是否显示刷新按钮
                                minimumCountColumns: 2, //最少允许的列数
                                clickToSelect: true, //是否启用点击选中行
                                height: "auto", //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                                showToggle: false, //是否显示详细视图和列表视图的切换按钮
                                detailView: true, //是否显示父子表
                                maintainSelected: true, //设置为 true 在点击分页按钮或搜索按钮时，将记住checkbox的选择项
                                columns: Columns1,
                                //注册加载子表的事件。注意下这里的三个参数！
                                onExpandRow: function (index, row, $detail) {
                                    row.shiftList = row.shiftList ? row.shiftList : {};
                                    if (!row.shiftList.bMSFactoryShift) {
                                        row.shiftList.bMSFactoryShift = [];
                                    }
                                    oTableInit.InitSubTable(index, row, $detail);
                                    $detail.find('table.tb_sub').bootstrapTable("load", row.shiftList.bMSFactoryShift);

                                },
                            });

                            //子表1
                            oTableInit.InitSubTable = function (index, row, $detail) {
                                var payNo = row.payNo;
                                var cur_table = $detail.html('<table class="tb_sub"  data-id=' + row.iD + ' data-name=' + row.name + '></table>').find('table');
                                $(cur_table).bootstrapTable({
                                    toolbar: $($toolbar[1]).clone(true), //工具按钮用哪个容器
                                    striped: true, //是否显示行间隔色
                                    cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                                    pagination: false, //是否显示分页（*）
                                    sortable: false, //是否启用排序
                                    sortOrder: "asc", //排序方式
                                    sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                                    search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
                                    strictSearch: false, //全匹配
                                    searchTimeOut: 5000, //搜索超时时间
                                    searchOnEnterKey: true, //	设置为 true时，按回车触发搜索方法，否则自动触发搜索方法
                                    trimOnSearch: false, //设置为 true 将允许空字符搜索
                                    showColumns: false, //是否显示 内容列下拉框
                                    showPaginationSwitch: false, //是否显示 数据条数选择框
                                    pageSize: 20,
                                    pageList: [20, 50, 100, "All"],
                                    undefinedText: "",
                                    showColumns: true, //是否显示所有的列
                                    showRefresh: false, //是否显示刷新按钮
                                    minimumCountColumns: 2, //最少允许的列数
                                    clickToSelect: true, //是否启用点击选中行
                                    height: "auto", //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                                    showToggle: false, //是否显示详细视图和列表视图的切换按钮
                                    detailView: true, //是否显示父子表
                                    maintainSelected: true, //设置为 true 在点击分页按钮或搜索按钮时，将记住checkbox的选择项
                                    columns: Columns2,
                                    onExpandRow: function (index, row, $Subdetail) {
                                        row.idleZoneList = row.idleZoneList ? row.idleZoneList : {};

                                        if (!row.idleZoneList.bMSShiftZone) {
                                            row.idleZoneList.bMSShiftZone = [];
                                        }
                                        oTableInit.InitSubTable1(index, row, $Subdetail);
                                        $Subdetail.find('table.tb_subItem').bootstrapTable("load", row.idleZoneList.bMSShiftZone);

                                    },
                                });

                                //load子表数据
                                //					               $(".tb_sub").bootstrapTable('load',[{iD:1,shiftName :"zsq",startTime:8,minutes:8,workMinutes :8,idleMinutes :2,idleZoneList:1},{iD:1,name:"qqq",startTime:8,minutes:8,workMinutes :8,IdleMinutes :2,IdleZoneList:1},{iD:1,name:"www",startTime:8,minutes:8,workMinutes :8,IdleMinutes :2,IdleZoneList:1}]);
                                //子表2
                                oTableInit.InitSubTable1 = function (index, row, $detail) {
                                    var payNo = row.payNo;
                                    var cur_table = $detail.html('<table class="tb_subItem"  data-id=' + row.iD + '  data-name=' + row.shiftName + '></table>').find('table');
                                    $(cur_table).bootstrapTable({
                                        toolbar: $($toolbar[2]).clone(true), //工具按钮用哪个容器
                                        striped: true, //是否显示行间隔色
                                        cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                                        pagination: false, //是否显示分页（*）
                                        sortable: false, //是否启用排序
                                        sortOrder: "asc", //排序方式
                                        sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                                        search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
                                        strictSearch: false, //全匹配
                                        searchTimeOut: 5000, //搜索超时时间
                                        searchOnEnterKey: true, //	设置为 true时，按回车触发搜索方法，否则自动触发搜索方法
                                        trimOnSearch: false, //设置为 true 将允许空字符搜索
                                        showColumns: false, //是否显示 内容列下拉框
                                        showPaginationSwitch: false, //是否显示 数据条数选择框
                                        pageSize: 20,
                                        pageList: [20, 50, 100, "All"],
                                        undefinedText: "",
                                        showColumns: true, //是否显示所有的列
                                        showRefresh: false, //是否显示刷新按钮
                                        minimumCountColumns: 2, //最少允许的列数
                                        clickToSelect: true, //是否启用点击选中行
                                        height: "auto", //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                                        showToggle: false, //是否显示详细视图和列表视图的切换按钮
                                        detailView: false, //是否显示父子表
                                        maintainSelected: true, //设置为 true 在点击分页按钮或搜索按钮时，将记住checkbox的选择项

                                        columns: Columns3,
                                    });
                                    //load子表数据
                                    //							               $(".tb_subItem").bootstrapTable('load',[{iD:1,zoneName :"zsq",startTime:8,minutes:8,idleOrWork:true},{iD:1,zoneName :"qqq",startTime:8,minutes:8,idleOrWork:true},{iD:1,zoneName :"www",startTime:8,minutes:8,idleOrWork:true}]);
                                    return oTableInit;
                                };
                            };
                        };


                        return oTableInit;
                    };

                    var ButtonInit = function () {
                        var oInit = new Object();
                        var postdata = {};

                        oInit.Init = function () {
                            //初始化页面上面的按钮事件
                        };

                        return oInit;
                    };

                    //1.初始化Table
                    var oTable = new TableInit();
                    oTable.Init();

                    //2.初始化Button的点击事件
                    var oButtonInit = new ButtonInit();
                    oButtonInit.Init();
                },
            },
        });

        model.init();


    });