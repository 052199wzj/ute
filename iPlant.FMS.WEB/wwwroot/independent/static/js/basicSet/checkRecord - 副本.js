require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($yang, $com, $tree) {

        var HTML,
            KEYWORD_ROLE,
            KEYWORD_USER,
            KEYWORD_LIST_ROLE,
            KEYWORD_LIST_USER,
            FORMATTRT_ROLE,
            FORMATTRT_USER,
            model,
            sRoleID,
            DEFAULT_VALUE_ROLE,
            DEFAULT_VALUE_USER,
            TypeSource_ROLE,
            TypeSource_USER;


        HTML = {
            TableRoleItemNode: [
                '<tr data-color="">',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="ID" data-value="{{ID}}">{{ID}}</td>',
                '<td data-title="Name" data-value="{{Name}}">{{Name}}</td>',

                '<td data-title="OwnerID" data-value="{{OwnerID}}">{{OwnerName}}</td>',
                '<td data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTimeText}}</td>',
                '<td data-title="Explain" data-value="{{Explain}}">{{Explain}}</td>',
                '<td data-title="Active" data-value="{{Active}}">{{ActiveText}}</td>',
                '</tr>',
            ].join(""),
            TableRoleUserItemNode: [
                '<tr data-color="">',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="FunctionID" data-value="{{FunctionID}}">{{UserName}}</td>',
                '<td data-title="RoleID" data-value="{{RoleID}}">{{RoleName}}</td>',
                '</tr>',
            ].join(""),
        };


        (function () {
            KEYWORD_LIST_ROLE = [
                "Name|权限名",
                "Explain|说明",
                "Active|状态|ArrayOne",
            ];
            FORMATTRT_ROLE = {};
            KEYWORD_ROLE = {};
            DEFAULT_VALUE_ROLE = {
                Name: "",
                Explain: "",
                Active: true,
            };

            TypeSource_ROLE = {
                Active: [{
                    name: "激活",
                    value: true,
                }, {
                    name: "禁用",
                    value: false,
                }],
            };
            $.each(KEYWORD_LIST_ROLE, function (i, item) {
                var detail = item.split("|");
                KEYWORD_ROLE[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                };
                if (detail.length > 2) {
                    FORMATTRT_ROLE[detail[0]] = $com.util.getFormatter(TypeSource_ROLE, detail[0], detail[2]);
                }

            });


        })();


        model = $com.Model.create({
            name: 'iPlant.MES',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();

            },

            events: function () {

                $("body").delegate("#femi-add-refresOrder", "click", function () {

                    $(".orderAll").hide();
                    $(".stationAll").show();
                    $(".itemAll").hide();


                });

                $("body").delegate("#femi-add-refreshStation", "click", function () {

                    $(".orderAll").hide();
                    $(".stationAll").hide();
                    $(".itemAll").show();


                });


                $("body").delegate("#femi-add-role", "click", function () {
                    $("body").append($com.modal.show(DEFAULT_VALUE_ROLE, KEYWORD_ROLE, "新增权限", function (rst) {
                        //调用插入函数

                        if (!rst || $.isEmptyObject(rst))
                            return;
                        var _data = {
                            Name: rst.Name,
                            Explain: rst.Explain,
                            Active: $com.util.boolean(rst.Active),
                            ActiveText: "",
                            CreateTime: new Date(),
                        };
                        model.com.saveRole({
                            data: _data,
                        }, function (res) {
                            if (res.info) {
                                res.info.ActiveText = res.info.Active ? "激活" : "禁用";
                                res.info.CreateTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", res.info.CreateTime);

                                model._RoleData.push(res.info);

                                res.info.OwnerName = model.com.GetName(res.info.OwnerID);
                                model.com.getRoleAll({}, function (res) {
                                    model.com.renderRole(res.list);
                                    alert("新增成功！");
                                });
                            }
                        });

                    }, TypeSource_ROLE));

                });


                $("body").delegate("#femi-edit-role", "click", function () {

                    var _ids = $com.table.getSelectionTitle($("#femi-role-tbody"), "ID");

                    if (!_ids || !_ids.length) {
                        alert("请先选择一行数据再试！");
                        return;
                    }
                    if (_ids.length != 1) {
                        alert("只能同时对一行数据修改！");
                        return;
                    }
                    var _index = $com.util.findIndex(model._RoleData, function (p) {
                        return p.ID == _ids[0];
                    });
                    if (_index < 0) {
                        alert("待修改的数据不存在！");
                        return;
                    }

                    var in_data = {
                        Name: model._RoleData[_index].Name,
                        Explain: model._RoleData[_index].Explain,
                    };

                    $("body").append($com.modal.show(in_data, KEYWORD_ROLE, "修改权限", function (rst) {
                        //调用插入函数

                        if (!rst || $.isEmptyObject(rst))
                            return;

                        //model._RoleData[_index]
                        var _data = $com.util.Clone(model._RoleData[_index]);
                        _data.Name = rst.Name;
                        _data.Explain = rst.Explain;
                        $com.util.deleteLowerProperty(_data);
                        model.com.saveRole({
                            data: _data,
                        }, function (res) {
                            if (res.info && res.info.ID) {
                                res.info.ActiveText = res.info.Active ? "激活" : "禁用";
                                res.info.CreateTimeText = $com.util.format("yyyy-MM-dd hh:mm:ss", res.info.CreateTime);

                                model._RoleData[_index] = res.info;


                                var $td = $("#femi-role-tbody").children('tr').children('td[data-title=ID][data-value=' + res.info.ID + ']');

                                if ($td[0]) {
                                    //SetTR(res.info, $td.parent("tr"), FORMATTRT_ROLE);
                                    var $Tr = $td.parent("tr");
                                    $Tr.replaceWith($com.util.template(res.info, HTML.TableRoleItemNode));
                                }

                            }
                        });

                    }, TypeSource_ROLE));

                });


            },

            run: function () {


            },

            com: {},
        });

        model.init();
    });