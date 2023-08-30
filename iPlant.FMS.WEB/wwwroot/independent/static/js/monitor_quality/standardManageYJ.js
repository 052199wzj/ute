require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview', '../static/utils/js/base/table-select'],
    function ($lin, $com, $treeview) {

        var HTML,
            arry,
            wSelectID,//修程   产线。
            lSelectID,//工位  
            pSelectID,
            pSelectIDPro,//规格ID
            iSelectID,//类型
            dSelectID,  //深度
            StandardID,
            sharpenerID,
            ChangeData,
            SelectList,
            Data_WorkSourc,

            Count,
            ID,  //工步ID
            SonNumber,
            SinID,
            Data_PartPointList,
            number,
            num,
            Options,

            Data_Source_Buzzer,
            Buzzer_List,
            UserID,
            UserName,
            UserList,

            MaterialList,

            Defaul_Value_Standard,
            KETWROD_LIST_Standard,
            KETWROD_Standard,
            Formattrt_Standard,
            TypeSource_Standard,

            Defaul_Value_Item,
            KETWROD_LIST_Item,
            KETWROD_Item,
            Formattrt_Item,
            TypeSource_Item,
            //配置参数
            KeepDayMin,
            TOPNumMax,
            TOPNumMin,
            KeepDayNow,
            TopNumNow,

            standardInfoData,
            standardInfoList,
            //产线对应的工段
            partSource;
        zaceStandardList = [];

        var zaceType = 1;//默认显示车型树
        var zaceProduct = [];//车型
        var mZaceStandard = 0;//版本ID

        var mSonID = 0;//工序
        HTML = {
            BuzzerList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td style="min-width: 80px" data-title="Type" data-value="{{Type}}">{{Type}}</td>',
                '<td style="min-width: 80px" data-title="SharpenerNo" data-value="{{SharpenerNo}}">{{ SharpenerNo}}</td>',
                '<td style="min-width: 50px" data-title="Material" data-value="{{Material}}" >{{ Material}}</td>',
                '<td style="min-width: 50px" data-title="Granularity" data-value="{{Granularity}}" >{{ Granularity}}</td>',
                '<td style="min-width: 80px" data-title="Hardness" data-value="{{Hardness}}" >{{ Hardness}}</td>',
                '<td style="min-width: 100px" data-title="WJORLength" data-value="{{WJORLength}}" >{{ WJORLength}}</td>',
                '<td style="min-width: 100px" data-title="NKORWidth" data-value="{{NKORWidth}}" >{{ NKORWidth}}</td>',
                '<td style="min-width: 80px" data-title="Height" data-value="{{Height}}" >{{ Height}}</td>',
                '<td style="min-width: 60px" data-title="OpreatorID" data-value="{{OpreatorID}}" >{{ OpreatorID}}</td>',
                '<td style="min-width: 80px" data-title="CreateTime" data-value="{{CreateTime}}" >{{ CreateTime}}</td>',
                '<td style="min-width: 80px" data-title="UpdateTime" data-value="{{UpdateTime}}" >{{ UpdateTime}}</td>',
                '<td style="min-width: 50px" data-title="Status" data-value="{{Status}}" >{{ Status}}</td>',
                '<tr>'
            ].join(""),

            StandardList: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="ShowID" data-value="{{ShowID}}" >{{ShowID}}</td>',
                '<td data-title="Text" data-value="{{Text}}" >{{Text}}</td>',
                '<td data-title="Standard" data-value="{{Standard}}" >{{Standard}}</td>',            
                '<td data-title="ItemType" data-value="{{ItemType}}" >{{ItemType}}</td>',

                // '<td data-title="TechStandard" data-value="{{TechStandard}}" >{{TechStandard}}</td>',
                '<td data-title="DefaultManufactor" data-value="{{DefaultManufactor}}" >{{DefaultManufactor}}</td>',
                // '<td data-title="Text" data-value="{{Text}}" >{{Text}}</td>',
                '<td data-title="DefaultModal" data-value="{{DefaultModal}}" >{{DefaultModal}}</td>',
                // '<td data-title="DefaultValue" data-value="{{DefaultValue}}" >{{DefaultValue}}</td>',
                '<td data-title="IsManufactorFill" data-value="{{IsManufactorFill}}" >{{IsManufactorFill}}</td>',
                // '<td data-title="StandardBaisc" data-value="{{StandardBaisc}}" >{{StandardBaisc}}</td>',
                '<td data-title="IsModalFill" data-value="{{IsModalFill}}" >{{IsModalFill}}</td>',
                '<td data-title="IsNumberFill" data-value="{{IsNumberFill}}" >{{IsNumberFill}}</td>',
                '<td data-title="StandardType" data-value="{{StandardType}}" >{{StandardType}}</td>',
                '<td data-title="Unit" data-value="{{Unit}}" >{{Unit}}</td>',
                   '<td data-title="IsWriteFill" data-value="{{IsWriteFill}}" >{{IsWriteFill}}</td>',
                 '<td data-title="ManufactorOptionText" data-value="{{ManufactorOptionText}}" >{{ManufactorOptionText}}</td>',
                 '<td data-title="ModalOptionText" data-value="{{ModalOptionText}}" >{{ModalOptionText}}</td>',
                 '<td data-title="DefaultStationID" data-value="{{DefaultStationID}}" >{{DefaultStationID}}</td>',
                 '<td data-title="IsPeriodChange" data-value="{{IsPeriodChange}}" >{{IsPeriodChange}}</td>',
                 '<td data-title="IsPictureFill" data-value="{{IsPictureFill}}" >{{IsPictureFill}}</td>',
                // '<td data-title="Standard" data-value="{{Standard}}" >{{Standard}}</td>',
                '<td data-title="OptionsItem" data-value="{{OptionsItem}}" >{{OptionsItem}}</td>',

                '</tr>',
            ].join(""),

            TreePartItemNode: [
                '<li data-value="{{UnitID}}"  class="click-delegate part">',
                '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px;display:none"  value="{{FunctionID}}"  />{{Name}}</span> ',
                '<ul>{{Items}}</ul>',
                '</li> ',
            ].join(""),
            TreePartPointItemNode: [
                '<li data-value="{{UnitID}}"  class="click-delegate part">',
                '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px;display:none"  value="{{FunctionID}}"  />{{Name}}</span> ',
                '<ul>{{Items}}</ul>',
                '</li> ',
            ].join(""),
            TreeMaterialNode: [
                '<li data-value="{{MaterialNo}}"  class="click-delegate part">',
                '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px;display:none"  value="{{FunctionID}}"  />{{MaterialName}}</span> ',
                '<ul>{{Items}}</ul>',
                '</li> ',
            ].join(""),

            TreeProductlNode: [
                '<li data-value="{{ID}}"  class="click-delegate part">',
                '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px;display:none"  value="{{ID}}"  />{{ProductNo}}</span> ',
                '<ul>{{Items}}</ul>',
                '</li> ',
            ].join(""),

            TreeStandardItemNode: [
                '<li data-titie="{{ID}}"  data-value="{{ID}}" style="background-color:{{BGColor}}" >',
                '<span style="vertical-align:top;"   data-value="{{ID}}"}" >{{Text}}</span> ',
                '<ul>{{Items}}',
                '</ul>',
                '</li>',
            ].join(""),
            TreeTextItemNode: [
                '<li data-titie="{{ID}}"  data-value="{{ID}}" style="background-color:{{BGColor}}" >',
                '<span style="vertical-align:top;color:{{TextColor}}" data-value="{{ID}}" }"   data-line="{{LineID}}">{{Remark}}</span> ',
                '<ul>{{Items}}',
                '</ul>',
                '</li>',
            ].join(""),
            //TreePartPointItemNode: [
            //    '<li data-value="{{UnitID}}"  class="click-delegate partpoint" >',
            //    '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{Name}}</span> ',
            //    '</li> ',
            //].join(""),

            //TreePartPointItemDepth: [
            //    '<li data-value="{{ID}}"  class="click-delegate partpoint" >',
            //    '<span style="vertical-align:top;"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{FunctionID}}"  />{{Name}}</span> ',
            //    '</li> ',
            //].join(""),
        };
        Count = 0;
        num = 0;
        //新增版本项
        Defaul_Value_Item = {
            Text:'',
            Standard:'',
            ItemType: 4,
            DefaultManufactor:'', 
            DefaultModal:'',
            // TechStandard: '',
            IsManufactorFill:false,
            IsModalFill:false,
            IsNumberFill:false,
            StandardType:15,
            UnitID:0,
            IsWriteFill:false,
            ManufactorOption:'',
            ModalOption:'',
            DefaultStationID:0,
            IsPeriodChange:false,
            IsPictureFill:false,
            ValueSource:0,



        };
        (function () {

            KETWROD_LIST_Item = [
                "Text|项名称",
                "Standard|标准",
                "ItemType|类型|ArrayOne",
                
                "DefaultManufactor|预设厂家",
                "DefaultModal|预设型号",
                "IsManufactorFill|厂家|ArrayOne",
                "IsModalFill|型号|ArrayOne",
                "IsNumberFill|编号|ArrayOne",
                "StandardType|值类型|ArrayOne",
                "UnitID|单位|ArrayOne",
                "IsWriteFill|填写值必填|ArrayOne",
                "ManufactorOption|厂家选项|InputArray",
                "ModalOption|型号选项|InputArray",
                "ValueSource|数据源|InputArray",
                "DefaultStationID|默认工位|ArrayOne",
                "IsPeriodChange|段改项|ArrayOne",
                "IsPictureFill|图片必填|ArrayOne",
                "Unit|单位",
               
                "StandardValue|版本值",
                "DefaultValue|默认值",
             
                "StandardBaisc|基准值",
                "StandardLeft|下限",
                "StandardRight|上限",
                "Visiable|是否可见|ArrayOne",
                "ValueSource|数据源|InputArray"
            ];

            KETWROD_Item = {};

            Formattrt_Item = {};

            TypeSource_Item = {
                IsManufactorFill: [
                    {
                        name: "不显示",
                        value: 3
                    },
                    {
                        name: "否",
                        value: 2
                    },
                    {
                        name: "是",
                        value: 1
                    },
                ],
                IsModalFill: [
                    {
                        name: "不显示",
                        value: 3
                    },
                    {
                        name: "否",
                        value: 2
                    },
                    {
                        name: "是",
                        value: 1
                    },
                ],
                IsNumberFill: [
                    {
                        name: "不显示",
                        value: 3
                    },
                    {
                        name: "否",
                        value: 2
                    },
                    {
                        name: "是",
                        value: 1
                    },
                ],
                DefaultStationID:[
                    {
                        name: "无",
                        value: 0
                    },
                ],
                IsWriteFill: [
                    {
                        name: "不显示",
                        value: 3
                    },
                    {
                        name: "否",
                        value: 2
                    },
                    {
                        name: "是",
                        value: 1
                    },
                ],
                IsPeriodChange: [
                    {
                        name: "是",
                        value: true
                    },
                    {
                        name: "否",
                        value: false
                    }
                ],
                IsPictureFill: [
                    {
                        name: "不显示",
                        value: 3
                    },
                    {
                        name: "否",
                        value: 2
                    },
                    {
                        name: "是",
                        value: 1
                    },
                ],
                IsManufactorFill: [
                    {
                        name: "不显示",
                        value: 3
                    },
                    {
                        name: "否",
                        value: 2
                    },
                    {
                        name: "是",
                        value: 1
                    },
                ],
                // Unit: [
                //     {
                //         name: "无",
                //         value: ""
                //     }
                // ],
                UnitID: [{
                    name: "无",
                    value: 0
                }],
                ItemType: [
                    // {
                    //     name: "项",
                    //     value: 1
                    // },
                    {
                        name: "项",
                        value: 2
                    },
                    {
                        name: "组",
                        value: 4
                    }
                ],
                Visiable: [
                    {
                        name: "是",
                        value: true
                    },
                    {
                        name: "否",
                        value: false
                    }
                ],
                StandardType: [

                    {
                        name: "无",
                        value: 15
                    },
                    {
                        name: "文本",
                        value: 0
                    },
                    {
                        name: "单选",
                        value: 1
                    },
                    // {
                    //     name: "不包含",
                    //     value: 2
                    // },
                    // {
                    //     name: "包含",
                    //     value: 3
                    // },
                    // {
                    //     name: "右包含",
                    //     value: 4
                    // },
                    // {
                    //     name: "左包含",
                    //     value: 5
                    // }, {
                    //     name: "小于",
                    //     value: 6
                    // },
                    // {
                    //     name: "大于",
                    //     value: 7
                    // },
                    // {
                    //     name: "小于等于",
                    //     value: 8
                    // },
                    // {
                    //     name: "大于等于",
                    //     value: 9
                    // },
                    {
                        name: "数字",
                        value: 10
                    },
                    {
                        name: "多选",
                        value: 11
                    },
                    // {
                    //     name: "不合格原因",
                    //     value: 12
                    // },
                    // {
                    //     name: "多数字输入",
                    //     value: 13
                    // },
                    // {
                    //     name: "多文本输入",
                    //     value: 14
                    // }
                ],
                ValueSource: [
                    {
                        value: 0,
                        name: 0,
                        far: 1
                    }
                ]
            };
            $.each(KETWROD_LIST_Item, function (i, item) {
                var detail = item.split("|");
                KETWROD_Item[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Item[detail[0]] = $com.util.getFormatter(TypeSource_Item, detail[0], detail[2]);
                }
            });
        })();

        //新增版本
        Defaul_Value_Standard = {
            // ID: 0,
            Remark: "",
            // KeepDay: 36500,
            // TopNum: 100
        };
        (function () {

            KETWROD_LIST_Standard = [
                "ID|版本|Readonly",
                "Remark|名称",
                "KeepDay|持续时间",
                "TopNum|查询数量"
            ];

            KETWROD_Standard = {};

            Formattrt_Standard = {};

            TypeSource_Standard = {

            };

            $.each(KETWROD_LIST_Standard, function (i, item) {
                var detail = item.split("|");
                KETWROD_Standard[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };

                if (detail.length > 2) {
                    Formattrt_Standard[detail[0]] = $com.util.getFormatter(TypeSource_Standard, detail[0], detail[2]);
                }
            });
        })();

        model = $com.Model.create({
            name: '版本管理',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {

                //
                function extLimit(exts) {
                    return {
                        has: function (file) {
                            var arr = file.split("."),
                                ext = arr[arr.length - 1].toLowerCase();

                            return exts.indexOf(ext) > -1 ? true : false;
                        }
                    };
                }
                $("body").delegate("#lmvt-standardtable-import", "click", function () {
                    $("#input-file").val("");
                    $("#input-file").click();
                });

                $("body").delegate("#input-file", "change", function () {
                    //alert()
                    var $this = $(this);

                    if (this.files.length == 0)
                        return;

                    if (!extLimit(['xlsx','xls']).has(this.files[0].name)) {
                        alert("请上传正确的文件！");
                        clearFiles();
                        return;
                    }

                    var fileData = this.files[0];

                    var form = new FormData();
                    form.append("file", fileData);
                    form.append("IPTMode", 9);
                    form.append("ProductID", pSelectIDPro);
                    form.append("LineID", wSelectID);
                    model.com.postImportExcel(form, function (res) {
                        alert("导入成功！！");

                    });
                });

                $("body").delegate("#lmvt-grinding-back", "click", function () {
                    $(".zace-container").show();
                    $(".lmvt-container").hide();
                });


                $("body").delegate("#showPartPoint", "click", function () {
                    $(".partPointZace").hide();
                    $(".productZace").show();
                    zaceType = 2;
                    model.com.RanderSelect(wSelectID);
                });

                //车型
                $("body").delegate("#showProduct", "click", function () {
                    $(".partPointZace").show();
                    $(".productZace").hide();

                    zaceType = 1;
                    model.com.RanderSelect(wSelectID);
                });



                //新增版本
                $("body").delegate("#lmvt-standard-add", "click", function () {


                    if (!SinID || SinID == 0) {
                        alert("请选择工序！");
                        return false;
                    }
                    $("body").append($com.modal.show(Defaul_Value_Standard, KETWROD_Standard, "新增版本", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        if (!rst.Remark) {
                            alert("版本为空");
                            return false;
                        }
                        var inputDate;



                        if (dSelectID == 3)
                            inputDate = {
                                ID: 0,
                                CompanyID: 0,
                                BusinessUnitID: 0,
                                BaseID: 0,
                                FactoryID: 0,
                                WorkShopID: 0,
                                IPTMode: iSelectID,
                                IsCurrent: 0,
                                IsEnd: 0,
                                IsUseD: 0,
                                ItemList: [],
                                LineID: wSelectID,
                                PartID: lSelectID,
                                PartPointID: SinID,
                                StationID: 0,
                                ProductNo: pSelectID,
                                ProductID: pSelectIDPro,
                                Remark: rst.Remark,
                                TModify: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                                //UserID: window.parent.User_Info.ID,
                            };

                        $com.util.deleteLowerProperty(inputDate);
                        model.com.postSaveStandard({
                            data: inputDate,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refreshStandard(mSonID);
                            model.com.RanderSelect(wSelectID);
                        });

                    }, TypeSource_Standard));

                });
                //新增版本项
                $("body").delegate("#lmvt-standarditem-add", "click", function () {
                    var _standard = 0;
                    var _Itemtype = 0
                    var _boolStandard = true;
                    if (!ChangeData || ChangeData == 0) {
                        _boolStandard = false;
                    } else {
                        _boolStandard = true;
                        _standard = ChangeData;
                    }
                    var _boolStandardItem = true;
                    if (!GroupID || GroupID == 0) {
                        _boolStandardItem = false;
                    } else {
                        _boolStandardItem = true;
                        for (var i = 0; i < zaceStandardList.length; i++) {
                            if (GroupID == zaceStandardList[i].ID) {
                                _standard = zaceStandardList[i].VID;
                                _Itemtype = zaceStandardList[i].ItemType
                            };

                        }
                    }


                    if (_Itemtype != 4 && _Itemtype != 0) {
                        alert('请点击组或版本后新增！');
                        return false;
                    }
                    if (!_boolStandard && !_boolStandardItem) {
                        alert('请点击数据后，新增!');
                        return false;
                    }

                    var dataSource;

                    $.each(SelectList, function (i, item) {
                        if (item.ID == _standard)
                            dataSource = item;
                    });

                    if (dataSource.IsUsed == 1) {
                        alert("该版本已经被使用")
                        return;
                    }

                    $("body").append($com.modal.show(Defaul_Value_Item, KETWROD_Item, "新增版本项", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }
                        // if (!rst.Standard) {
                        //     rst.Standard = [];
                        // }

                        model.com.getStandardInfo({ ID: dataSource.ID }, function (res) {
                            if (!res)
                                return;
                            dataSource.ItemList = res.info.ItemList;
                            for (var i = 0; i < dataSource.ItemList.length; i++) {
                                $com.util.deleteLowerProperty(dataSource.ItemList[i]);
                            }

                           var _data = {
                                Text: rst.Text,
                                Standard: rst.Standard,
                                DefaultManufactor: rst.DefaultManufactor,

                                // TechStandard: rst.TechStandard,
                                ItemType: Number(rst.ItemType),
                                DefaultModal: rst.DefaultModal,
                                IsModalFill: rst.IsModalFill,
                                StandardType: Number(rst.StandardType),
                                IsManufactorFill: rst.IsManufactorFill,
                                IsNumberFill: rst.IsNumberFill,
                                IsWriteFill: rst.IsWriteFill,
                                UnitID: Number(rst.UnitID),
                                ManufactorOption:rst.ManufactorOption,
                                ModalOption:rst.ModalOption,
                                DefaultStationID:Number(rst.DefaultStationID),
                                IsPeriodChange:rst.IsPeriodChange,
                                IsPictureFill:rst.IsPictureFill,
                                Visiable: true,
                                Unit: Number(rst.UnitID) > 0 ? Formattrt_Item["UnitID"](Number(rst.UnitID)) : "",
                                ValueSource: rst.ValueSource,
                            };


                            if (_boolStandard) {
                                _data.GroupID = 0;
                            } if (_boolStandardItem) {
                                _data.GroupID = GroupID;
                            }
                           // _data.Standard = model.com.CountStandard(_data, Number(rst.StandardType))
                            dataSource.ItemList.push(_data);

                            delete dataSource.IsCurrentText;
                            delete dataSource.IsUsedText;


                            $com.util.deleteLowerProperty(dataSource);
                            model.com.postSaveStandard({
                                data: dataSource,
                            }, function (res) {
                                alert("新增项成功！！");
                                model.com.refreshStandard(mSonID);
                                model.com.RanderSelect(wSelectID);

                                model.com.StandardItem(_standard);

                            });
                        });
                    }, TypeSource_Item));

                });
                //删除版本项
                $("body").delegate("#lmvt-standarditem-delete", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".zace-type-body"), "ShowID", standardInfoData);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        return;
                    }
                    for (var i = 0; i < SelectData.length; i++) {
                        $com.util.deleteLowerProperty(SelectData[i]);
                    }

                    var _pencilID = SelectData[0].VID;
                    if (!_pencilID) {
                        alert("当前未选择版本");
                        return;
                    }

                    var dataSource;

                    $.each(SelectList, function (i, item) {
                        if (item.ID == _pencilID)
                            dataSource = item;
                    });

                    if (dataSource.IsUsed == 1) {
                        alert("该版本已经被使用")
                        return;
                    }

                    model.com.getStandardInfo({ ID: dataSource.ID }, function (res) {
                        if (!res)
                            return;
                        dataSource.ItemList = res.info.ItemList;

                        for (var i = 0; i < dataSource.ItemList.length; i++) {
                            $com.util.deleteLowerProperty(dataSource.ItemList[i]);
                        }
                        var iCount = 0;
                        for (var i = 0; i < dataSource.ItemList.length - iCount; i++) {
                            for (var j = 0; j < SelectData.length; j++) {
                                if (SelectData[j].ID == dataSource.ItemList[i].ID) {
                                    dataSource.ItemList.splice(i, 1);
                                    iCount++;
                                }
                            }
                        }

                        delete dataSource.IsCurrentText;
                        delete dataSource.IsUsedText;


                        $com.util.deleteLowerProperty(dataSource);
                        model.com.postSaveStandard({
                            data: dataSource,
                        }, function (res) {
                            alert("删除项成功！！");
                            model.com.refreshStandard(mSonID);
                            model.com.RanderSelect(wSelectID);

                            model.com.StandardItem(_pencilID);
                        });
                    });

                });
                //修改版本项
                $("body").delegate("#lmvt-standardtable-change", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".zace-type-body"), "ShowID", standardInfoData);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据！")
                        return;
                    }

                    if (SelectData.length != 1) {
                        alert("只能选择一行数据！")
                        return;
                    }

                    $com.util.deleteLowerProperty(SelectData[0]);
                    var _pencilID = SelectData[0].VID;
                    if (!_pencilID) {
                        alert("当前未选择版本");
                        return;
                    }

                    var dataSource;

                    $.each(SelectList, function (i, item) {
                        if (item.ID == _pencilID)
                            dataSource = item;
                    });

                    if (dataSource.IsUsed == 1) {
                        alert("该版本已经被使用")
                        return;
                    }

                    // if (!confirm("已选择" + SelectData.length + "条数据，确定将其修改？")) {
                    //     return;
                    // }

                  
                  
                 



                    var Defaul_Value = {
                        //Text: SelectData[0].Text,
                        Text: SelectData[0].Text,
                        Standard: SelectData[0].Standard,
                        DefaultManufactor: SelectData[0].DefaultManufactor,

                        IsModalFill: SelectData[0].IsModalFill,
                        IsNumberFill: SelectData[0].IsNumberFill,
                        IsWriteFill: SelectData[0].IsWriteFill,
                        StandardType: SelectData[0].StandardType,
                        ManufactorOption: SelectData[0].ManufactorOption,
                        ModalOption: SelectData[0].ModalOption,
                        DefaultStationID: SelectData[0].DefaultStationID,                     
                        UnitID: SelectData[0].UnitID,
                        //Visiable: SelectData[0].Visiable,
                        ValueSource: SelectData[0].ValueSource,
                    };

                    $("body").append($com.modal.show(Defaul_Value, KETWROD_Item, "修改版本项", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }
                        // if (!rst.Standard) {
                        //     rst.Standard = [];
                        // }

                        model.com.getStandardInfo({ ID: dataSource.ID }, function (res) {
                            if (!res)
                                return;
                            dataSource.ItemList = res.info.ItemList;


                            for (var i = 0; i < dataSource.ItemList.length; i++) {
                                $com.util.deleteLowerProperty(dataSource.ItemList[i]);
                            }

                            var _data = {
                                Text: rst.Text,
                                Standard: rst.Standard,
                                DefaultManufactor: rst.DefaultManufactor,

                                 IsModalFill: rst.IsModalFill,
                                IsNumberFill: rst.IsNumberFill,
                                IsWriteFill: rst.IsWriteFill,
                                ManufactorOption: rst.ManufactorOption,
                                StandardType: Number(rst.StandardType),
                                //StandardBaisc: rst.StandardBaisc,
                                ModalOption: rst.ModalOption,
                                DefaultStationID: Number(rst.DefaultStationID),

                                UnitID: Number(rst.UnitID),
                                Unit: Number(rst.UnitID) > 0 ? Formattrt_Item["UnitID"](Number(rst.UnitID)) : "",
                                //Visiable: rst.Visiable == "true" ? true : false,
                                ValueSource: rst.ValueSource,
                            };

                           // _data.Standard = model.com.CountStandard(_data, Number(rst.StandardType));

                            $.each(dataSource.ItemList, function (i, item) {
                                if (item.ID == SelectData[0].ID) {
                                    item.Text = _data.Text;
                                    item.Standard = _data.Standard;
                                    item.DefaultManufactor = _data.DefaultManufactor;

                                    item.IsModalFill = _data.IsModalFill;
                                    item.IsNumberFill = _data.IsNumberFill;
                                    item.IsWriteFill = _data.IsWriteFill;
                                    item.ManufactorOption = _data.ManufactorOption;
                                    item.StandardType = _data.StandardType;
                                    item.ModalOption = _data.ModalOption;
                                    item.DefaultStationID = _data.DefaultStationID;
                               
                                    item.Unit = _data.Unit;
                                    item.UnitID = _data.UnitID;
                                    //item.Visiable = _data.Visiable;
                                    item.ValueSource = _data.ValueSource;
                                 
                                }
                            });

                            delete dataSource.IsCurrentText;
                            delete dataSource.IsUsedText;

                            $com.util.deleteLowerProperty(dataSource);

                            model.com.postSaveStandard({
                                data: dataSource,
                            }, function (res) {
                                alert("修改项成功！！");
                                model.com.refreshStandard(mSonID);
                                model.com.RanderSelect(wSelectID);

                                model.com.StandardItem(_pencilID);

                            });
                        });
                    }, TypeSource_Item));

                });
                //另存为
                $("body").delegate("#lmvt-standard-saveOther", "click", function () {

                    var dataSource;


                    for (var i = 0; i < SelectList.length; i++) {
                        $com.util.deleteLowerProperty(SelectList[i]);
                    }

                    $.each(SelectList, function (i, item) {
                        if (item.ID == ChangeData)
                            dataSource = item;
                    });

                    //if (dataSource.IsCurrent == 1) {
                    //    alert("该版本已经被使用")
                    //    return;
                    //} `       

                    model.com.getStandardInfo({ ID: dataSource.ID }, function (res) {
                        if (!res)
                            return;
                        dataSource.ItemList = res.info.ItemList;
                        for (var i = 0; i < dataSource.ItemList.length; i++) {
                            $com.util.deleteLowerProperty(dataSource.ItemList[i]);
                        }


                        dataSource.IsUsed = 0;
                        dataSource.IsEnd = 0;
                        dataSource.ID = 0;

                        $.each(dataSource.ItemList, function (i, item) {
                            item.ID = 0;
                        });


                        $com.util.deleteLowerProperty(dataSource);
                        model.com.postSaveStandard({
                            data: dataSource,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refresh();
                            model.com.Romance(SinID, ID);
                            if (iSelectID != 5)
                                $.each(partSource, function (i, item) {
                                    if (item.UnitID == lSelectID) {
                                        model.com.renderTree(item.UnitList);
                                    }
                                });
                            else
                                model.com.renderTree(MaterialList);
                        });
                    });
                });

                //删除未使用版本
                $("body").delegate("#lmvt-standard-delete", "click", function () {
                    if (!ChangeData || ChangeData == 0) {
                        alert("当前未选择版本");
                        return;
                    }

                    var dataSource;


                    for (var i = 0; i < SelectList.length; i++) {
                        $com.util.deleteLowerProperty(SelectList[i]);
                    }

                    $.each(SelectList, function (i, item) {
                        if (item.ID == ChangeData)
                            dataSource = item;
                    });

                    if (dataSource.IsUsed == 1) {
                        alert("当前版本已使用，无法删除");
                        return;
                    }

                    if (!confirm("已选择版本" + dataSource.Remark + "，确定删除？")) {
                        return;
                    }

                    model.com.postDeleteStandard({
                        data: dataSource
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.refreshStandard(mSonID);
                        model.com.RanderSelect(wSelectID);
                    });
                });

                //设为当前
                $("body").delegate("#lmvt-set-current", "click", function () {
                    if (!ChangeData || ChangeData == 0) {
                        alert("当前未选择版本");
                        return;
                    }

                    var dataSource;

                    for (var i = 0; i < SelectList.length; i++) {
                        $com.util.deleteLowerProperty(SelectList[i]);
                    }

                    $.each(SelectList, function (i, item) {
                        if (item.ID == ChangeData)
                            dataSource = item;
                    });

                    delete dataSource.IsCurrentText;
                    delete dataSource.IsUsedText;

                    dataSource.IsCurrent = 1;

                    model.com.postStandardStatus({
                        data: dataSource,
                        IsEnd: 0,
                        IsCurrent: 1
                    }, function (res) {
                        alert("设置成功");
                        model.com.refreshStandard(mSonID);
                        model.com.RanderSelect(wSelectID);
                    });
                });
                //设为永久有效
                $("body").delegate("#lmvt-set-forever", "click", function () {

                    if (!ChangeData) {
                        alert("当前未选择版本");
                        return;
                    }

                    var dataSource;
                    for (var i = 0; i < SelectList.length; i++) {
                        $com.util.deleteLowerProperty(SelectList[i]);
                    }

                    $.each(SelectList, function (i, item) {
                        if (item.ID == ChangeData)
                            dataSource = item;
                    });

                    delete dataSource.IsCurrentText;
                    delete dataSource.IsUsedText;

                    dataSource.IsEnd = 1;

                    model.com.postStandardStatus({
                        data: dataSource,
                        IsEnd: 1,
                        IsCurrent: dataSource.IsCurrent
                    }, function (res) {
                        alert("设置成功");
                        model.com.refresh();
                        model.com.Romance(SinID, ID);
                        if (iSelectID != 5)
                            $.each(partSource, function (i, item) {
                                if (item.UnitID == lSelectID) {
                                    model.com.renderTree(item.UnitList);
                                }
                            });
                        else
                            model.com.renderTree(MaterialList);
                    });

                });
                //导出
                $("body").delegate("#lmvt-standardtable-out", "click", function () {
                    var $table = $(".standard-table"),
                        fileName = "过程检验项点.xls",
                        Title = "过程检验项点";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.postExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });

                });
                //取消永久有效
                $("body").delegate("#lmvt-remove-forever", "click", function () {

                    if (!ChangeData) {
                        alert("当前未选择版本");
                        return;
                    }

                    var dataSource;


                    for (var i = 0; i < SelectList.length; i++) {
                        $com.util.deleteLowerProperty(SelectList[i]);
                    }
                    $.each(SelectList, function (i, item) {
                        if (item.ID == ChangeData)
                            dataSource = item;
                    });

                    delete dataSource.cText;
                    delete dataSource.IsUsedText;

                    dataSource.IsEnd = 0;
                    $com.util.deleteLowerProperty(dataSource.dataSource);

                    model.com.postStandardStatus({
                        data: dataSource,
                        IsEnd: 0,
                        IsCurrent: dataSource.dataSource
                    }, function (res) {
                        alert("取消成功");
                        model.com.refresh();
                        model.com.Romance(SinID, ID);
                        $.each(partSource, function (i, item) {
                            if (item.UnitID == lSelectID) {
                                model.com.renderTree(item.UnitList);
                            }
                        });
                    });


                });
                //监听select事件 深度
                $("body").delegate("#lmvt-select-depth", "change", function () {
                    var $this = $(this);
                    dSelectID = Number($this.find("option:selected").attr("value"));
                    if (dSelectID == 1) {

                    }
                    model.com.RanderSelect(wSelectID);

                    lSelectID = Number($('#lmvt-select-line option:selected').attr("value"));

                    // $.each(partSource, function (i, item) {
                    //     if (item.UnitID == lSelectID) {
                    //         model.com.renderTree(item.UnitList);
                    //     }
                    // });

                });
                //监听select事件 产线
                $("body").delegate("#lmvt-select-workshop", "change", function () {
                    var $this = $(this);
                    wSelectID = Number($this.find("option:selected").attr("value"));
                    model.com.RanderSelect(wSelectID);
                    lSelectID = Number($('#lmvt-select-line option:selected').attr("value"));

                    // $.each(partSource, function (i, item) {
                    //     if (item.UnitID == lSelectID) {
                    //         model.com.renderTree(item.UnitList);
                    //     }
                    // });

                });
                //监听select事件  工段
                $("body").delegate("#lmvt-select-line", "change", function () {
                    var $this = $(this);
                    lSelectID = Number($this.find("option:selected").attr("value"));


                    if (zaceType == 1) {
                        model.com.renderTree(zaceProduct);
                    } else {
                        $.each(partSource, function (i, item) {
                            if (item.UnitID == lSelectID) {
                                model.com.renderTree(item.UnitList);
                            }
                        });
                    }

                });
                //监听select事件
                $("body").delegate("#lmvt-select-product", "change", function () {
                    var $this = $(this);
                    pSelectID = $this.find("option:selected").text();
                    pSelectIDPro = $this.find("option:selected").attr("value");

                    if (zaceType == 1) {
                        model.com.renderTree(zaceProduct);
                    } else {
                        $.each(partSource, function (i, item) {
                            if (item.UnitID == lSelectID) {
                                model.com.renderTree(item.UnitList);
                            }
                        });
                    }
                });
                //监听select事件
                $("body").delegate("#lmvt-select-IPTMode", "change", function () {
                    var $this = $(this);
                    iSelectID = Number($this.find("option:selected").attr("value"));

                    if (iSelectID != 5)
                        if (zaceType == 1) {
                            model.com.renderTree(zaceProduct);
                        } else {
                            $.each(partSource, function (i, item) {
                                if (item.UnitID == lSelectID) {
                                    model.com.renderTree(item.UnitList);
                                }
                            });
                        }
                    else {

                        model.com.renderTree(MaterialList);
                    }

                });


                //树的点击事件  两层树
                $("body").delegate(".lmvt-typeTree li ul li", "click", function () {
                    var $this = $(this),
                        $far = $this.closest("ul").closest("li"),
                        TreeID = $far.attr("data-value"),
                        SonID = $this.attr("data-value");

                    $(".lmvt-typeTree li ul li").css("color", "black");

                    $this.css("color", "blue");

                    ID = Number(TreeID);
                    SinID = Number(SonID);

                    model.com.Romance(SinID, ID);
                    model.com.refresh();
                });

                //树的点击事件 工步
                $("body").delegate(".lmvt-typeTree li", "click", function () {
                    var $this = $(this),
                        //$far = $this.closest("ul").closest("li"),
                        //TreeID = $far.attr("data-value"),
                        SonID = $this.attr("data-value");

                    // if (iSelectID == 5) {
                    //     pSelectID = SonID;
                    //     model.com.Romance(0, 0);
                    // }
                    // else {
                    //     if (dSelectID == 3) {
                    //         SinID = Number(SonID);
                    //         ID = Number(SonID);
                    //         model.com.Romance(SinID, ID);
                    //     }
                    //     if (dSelectID == 4) {
                    //         SinID = Number(model.com.GetStepID(lSelectID, dSelectID, Number(SonID)));
                    //         ID = Number(SonID);
                    //         model.com.Romance(SinID, ID);
                    //     }
                    // }

                    model.com.refreshStandard(SonID);
                    mSonID = SonID;
                    SinID = Number(SonID);
                    ChangeData = 0;
                    //右边版本
                    // SinID = Number(SonID);
                    // ID = Number(SonID);
                    // model.com.Romance(SinID, ID);
                    $(".lmvt-typeTree li ").css("color", "black");
                    $this.css("color", "blue");


                });

                //树的点击事件 版本  版本
                $("body").delegate("#standardItem li span", "click", function () {


                    var $this = $(this);
                    StandardID = Number($this.attr("data-value"));
                    ZaceLineID = Number($this.attr("data-line"));

                    //alert(StandardID);
                    var _list = [];
                    $("#standardItem li span").css("color", "black");
                    $this.css("color", "blue");

                    ChangeData = 0;
                    model.com.StandardItem(StandardID);
                });

            },
            run: function () {

                dSelectID = 3; //工序


                //工位数据
                model.com.getUnit({}, function (resPrice) {
                    $.each(resPrice.list, function (i, item) {
                        TypeSource_Item.UnitID.push({
                            name: item.Name,
                            value: item.ID,
                        });
                    });

                    //当前配置
                    model.com.getIPTConfig({}, function (res) {
                        if (!res.info)
                            return;
                        else {
                            $("#lmvt-KeepDay-Input").val(res.info.KeepDay);
                            $("#lmvt-TOPNum-Input").val(res.info.TOPNum);
                            KeepDayMin = res.info.KeepDayMin;
                            TOPNumMax = res.info.TOPNumMax;
                            TOPNumMin = res.info.TOPNumMin;
                            KeepDayNow = res.info.KeepDay;
                            TopNumNow = res.info.TOPNum;
                        }
                    });
                    //人员
                    model.com.getUserAll({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (res && res.list) {
                            UserList = res.list;
                        }

                    });
                    //多个input
                    model.com.getAPSProductTypeAll({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {

                            Data_WorkSourc = res.list;

                            var option;
                            arry = {};
                            var Line = [];
                            //$.each(res.list, function (i, item) {
                            //    if (!arry[item.WorkShopID])
                            //        arry[item.WorkShopID] = {};

                            //    arry[item.WorkShopID].WorkShopID = item.WorkShopID;
                            //    arry[item.WorkShopID].WorkShopName = item.WorkShopName;

                            //    if (!arry[item.WorkShopID].LineList)
                            //        arry[item.WorkShopID].LineList = [];
                            //    arry[item.WorkShopID].LineList.push({
                            //        LineID: item.LineID,
                            //        LineName: item.LineName
                            //    });

                            //});

                            var wkay = [];

                            $.each(Data_WorkSourc, function (i, item) {
                                wkay.push("<option value = ", item.ID, ">", item.Name, "</option>");
                            });


                            $('#lmvt-select-workshop').html(wkay.join(""));

                            iSelectID = 9;//预检
                            wSelectID = Number($('#lmvt-select-workshop option:selected').attr("value"));
                            // model.com.RanderSelect(wSelectID);

                            ////所有规格
                            model.com.getAPSProductAll({}, function (res) {
                                if (!res)
                                    return;
                                var list = res.list,
                                    rst = [];
                                if (list) {
                                    zaceProduct = [];
                                    zaceProductTest = $com.util.Clone(res.list);

                                    for (var index = 0; index < zaceProductTest.length; index++) {
                                        if (zaceProductTest[index].Active) {
                                            zaceProduct.push(zaceProductTest[index]);
                                        };

                                    }
                                    var ProductList = [];
                                    $.each(zaceProduct, function (j, jtem) {
                                        ProductList.push("<option value = '", jtem.ID, "'" + " >" + jtem.ProductNo + "</option>");
                                    });
                                    $('#lmvt-select-product').html(ProductList.join(""));
                                    pSelectID = $('#lmvt-select-product option:selected').text();

                                    //alert(pSelectID);
                                    pSelectIDPro = Number($('#lmvt-select-product option:selected').attr("value"));
                                    model.com.RanderSelect(wSelectID);

                                    var TOPNum = $("#lmvt-KeepDay-Input[type='text']").val();
                                }

                            });
                        }
                    });

                });



            },
            com: {
                //查询单位
                getUnit: function (data, fn, context) {
                    var d = {
                        $URI: "/Unit/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                postImportExcel: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/Import",
                        $TYPE: "post",
                        $SERVER: '/MESQMS',

                    };

                    function err() {
                        $com.app.tip('导入失败，请检查网络');
                    }

                    $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
                },


                //单位
                getUnitAll: function (data, fn, context) {
                    var d = {
                        $URI: "/Unit/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //物料
                getMaterialAll: function (data, fn, context) {
                    var d = {
                        $URI: "/Material/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //用户
                getUserAll: function (data, fn, context) {
                    var d = {
                        $URI: "/User/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //导出
                postExportExcel: function (data, fn, context) {
                    var d = {
                        $URI: "/Upload/ExportExcel",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //设为当前
                postStandardStatus: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/StandardStatus",
                        $TYPE: "post",
                        $SERVER: '/MESQMS',
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //删除未使用版本
                postDeleteStandard: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/DeleteStandard",
                        $TYPE: "post",
                        $SERVER: '/MESQMS',
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存版本
                postSaveStandard: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/SaveStandard",
                        $TYPE: "post",
                        $SERVER: '/MESQMS',
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //版本配置
                getIPTConfig: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/IPTConfig",
                        $TYPE: "get",
                        $SERVER: '/MESQMS',
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //当前版本项表
                getStandardInfo: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/StandardInfo",
                        $TYPE: "get",
                        $SERVER: '/MESQMS',
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getAPSProductAll: function (data, fn, context) {
                    var d = {
                        $URI: "/FPCProduct/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //类型
                getAPSProductTypeAll: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCLine/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getSharpenerAll: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTSharpener/All",
                        $TYPE: "get",
                        $SERVER: '/MESQMS',
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //产线版本
                getLineCurrent: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/LineCurrent",
                        $TYPE: "get",
                        $SERVER: '/MESQMS',
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //版本查询
                getStandardAll: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/StandardAll",
                        $TYPE: "get",
                        $SERVER: '/MESQMS',
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //当前版本
                getStandardCurrent: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/Current",
                        $TYPE: "get",
                        $SERVER: '/MESQMS',
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //修改版本配置
                postSaveConfig: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/SaveConfig",
                        $TYPE: "post",
                        $SERVER: '/MESQMS',

                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //产线信息
                getFMCLine: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCLine/All",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //产线工段信息
                getFMCLineUnit: function (data, fn, context) {
                    var d = {
                        $URI: "/FMCLineUnit/Tree",
                        $TYPE: "get"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                refresh: function () {

                    //当前配置
                    model.com.getIPTConfig({}, function (res) {
                        if (!res.info)
                            return;
                        else {
                            $("#lmvt-KeepDay-Input").val(res.info.KeepDay);
                            $("#lmvt-TOPNum-Input").val(res.info.TOPNum);
                            KeepDayMin = res.info.KeepDayMin;
                            TOPNumMax = res.info.TOPNumMax;
                            TOPNumMin = res.info.TOPNumMin;
                        }
                    });



                },

                GetSourceID: function (ID) {
                    var SelectID;
                    SelectID = ID[0];
                    return SelectID;
                },
                //渲染下拉框
                RanderSelect: function (wID) {
                    var wLine = [];
                    //得到产线
                    model.com.getFMCLineUnit({ LineID: wID, ID: 0 }, function (res) {
                        if (!res)
                            return;
                        var list = $com.util.Clone(res.list),
                            rst = [];
                         
                            TypeSource_Item.DefaultStationID.splice(1, TypeSource_Item.DefaultStationID.length - 1);
                            $.each(res.list, function (i, item) {
                                TypeSource_Item.DefaultStationID.push({
                                    name: item.Name,
                                    value: item.ID,
                                });
                            });

                        var _zaceList = [];
                        for (var m = 0; m < list.length; m++) {
                            if (list[m].UnitID == 26 && list[m].LevelID == 2) {
                                _zaceList.push(list[m]);
                            }

                        }
                        if (_zaceList) {
                            partSource = $com.util.Clone(_zaceList);



                            Data_capacityType_source = res.list;

                            partSource = $com.util.Clone(_zaceList);
                        }
                        //if (res.list.length == 0) {
                        //    alert("无相关工段信息");
                        //    return false;
                        //}
                        $.each(partSource, function (i, item) {
                            wLine.push("<option value = ", item.UnitID, ">", item.Name, "</option>");
                        });
                        $('#lmvt-select-line').html(wLine.join(""));
                        lSelectID = Number($('#lmvt-select-line option:selected').attr("value"));

                        if (iSelectID != 5) {

                            if (zaceType == 1) {
                                model.com.renderTree(zaceProduct);
                            } else {
                                $.each(partSource, function (i, item) {
                                    if (item.UnitID == lSelectID) {
                                        model.com.renderTree(item.UnitList);
                                    }
                                });
                            }


                            model.com.refresh();
                        }
                        else {
                            model.com.renderTree(MaterialList);
                        }
                    });

                },
                //删除
                Delete: function (_source, set_data) {
                    if (!_source)
                        _source = [];
                    if (!set_data)
                        set_data = [];

                    var rst = [];

                    $.each(_source, function (i, item) {
                        var temp = true;

                        $.each(set_data, function (m, item_m) {
                            if (item.ID == item_m.ID)
                                temp = false;
                        });

                        if (temp)
                            rst.push(item);
                    });

                    $.each(rst, function (i, item) {
                        item.ID = i + 1;
                    });

                    return rst;
                },

                //修改树
                renderTree: function (source) {
                    if (iSelectID == 5) {
                        $(".lmvt-typeTree").html($com.util.template(source, HTML.TreeMaterialNode));
                        $(".lmvt-typeTree").treeview();
                        if ($(".lmvt-typeTree li ul li")) {
                            model.com.getStandardAll({ IPTMode: iSelectID, BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: -1, PartID: -1, PartPointID: -1, StationID: -1, ProductID: -1 }, function (res) {
                                $(".lmvt-typeTree li").each(function (i, item) {
                                    var temp = false,
                                        flag = true;
                                    if (!res)
                                        return;
                                    var list = res.list,
                                        rst = [];
                                    if (res.list.length > 0) {
                                        $.each(res.list, function (j, item_j) {
                                            if (item_j.ProductNo == $(item).attr("data-value")) {

                                                //最大版本号
                                                if (item_j.ID > num)
                                                    num = item_j.ID;

                                                if (new Date().getTime() + 7 * 24 * 3600 * 1000 >= new Date(item_j.TModify).getTime() + KeepDayNow * 24 * 3600 * 1000) {
                                                    $(item).css("background-color", "indianred");
                                                    flag = false;
                                                    return false;
                                                }
                                                else {
                                                    if (item_j.IsCurrent == 1) {
                                                        $(item).css("background-color", "chartreuse");
                                                        flag = false;
                                                        temp = true;
                                                        return false;
                                                    }
                                                    else {
                                                        $(item).css("background-color", "#387cca3b");
                                                        flag = false;
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    else
                                        $(item).css("background-color", "#a9a9a942");
                                    if (flag) {
                                        $(item).css("background-color", "#a9a9a942");
                                    }
                                    if (temp) {
                                        return true;
                                    }
                                });
                            });

                        }
                    }
                    else {
                        if (dSelectID == 4) {
                            var arr = [];
                            $.each(source, function (i, item) {
                                $.each(item.UnitList, function (j, item_j) {
                                    arr.push(item_j);
                                });
                            });
                            $(".lmvt-typeTree").html($com.util.template(arr, HTML.TreePartPointItemNode));

                            $(".lmvt-typeTree").treeview();
                            if ($(".lmvt-typeTree li")) {
                                $(".lmvt-typeTree li").each(function (i, item) {
                                    model.com.getStandardAll({ IPTMode: iSelectID, BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: wSelectID, PartID: lSelectID, PartPointID: Number(model.com.GetStepID(lSelectID, dSelectID, Number($(item).attr("data-value")))), StationID: Number($(item).attr("data-value")), ProductID: pSelectIDPro }, function (res) {
                                        if (!res)
                                            return;
                                        var list = res.list,
                                            rst = [];
                                        if (res.list.length > 0) {

                                            $.each(res.list, function (j, item_j) {


                                                //最大版本号
                                                if (item_j.ID > num)
                                                    num = item_j.ID;

                                                if (new Date().getTime() + 7 * 24 * 3600 * 1000 >= new Date(item_j.TModify).getTime() + KeepDayNow * 24 * 3600 * 1000) {
                                                    $(item).css("background-color", "indianred");
                                                    return false;
                                                }
                                                else {
                                                    if (item_j.IsCurrent == 1) {
                                                        $(item).css("background-color", "chartreuse");
                                                        return false;
                                                    }
                                                    else
                                                        $(item).css("background-color", "#387cca3b");

                                                }
                                            });
                                        }
                                        else
                                            $(item).css("background-color", "#a9a9a942");
                                    });

                                });
                            }
                        }
                        if (dSelectID == 3) {

                            if (zaceType == 2) {
                                $(".lmvt-typeTree").html($com.util.template(source, HTML.TreePartItemNode));

                                $(".lmvt-typeTree").treeview();

                                model.com.getAllPointStandard({ LineID: wSelectID, PartID: lSelectID, ProductID: pSelectIDPro }, function (res) {

                                    if (!res)
                                        return;
                                    var _list = res.info,
                                        rst = [];
                                    $(".lmvt-typeTree li").each(function (i, item) {


                                        var _data = Number($(item).attr("data-value"));
                                        if (res.info[_data] == 1) {
                                            $(item).css("background-color", "#a9a9a942");


                                        } else if (res.info[_data] == 2) {
                                            $(item).css("background-color", "#387cca3b");

                                        } else {

                                            $(item).css("background-color", "chartreuse");

                                        }


                                    });



                                });

                            } else if (zaceType == 1) {
                                $(".lmvt-ProductTree").html($com.util.template(source, HTML.TreeProductlNode));

                                $(".lmvt-ProductTree").treeview();

                                model.com.getAllProductTree({ LineID: wSelectID, PartID: lSelectID }, function (res) {

                                    if (!res)
                                        return;
                                    var _list = res.info,
                                        rst = [];
                                    $(".lmvt-ProductTree li").each(function (i, item) {


                                        var _data = Number($(item).attr("data-value"));
                                        if (res.info[_data] == 1) {
                                            $(item).css("background-color", "#a9a9a942");


                                        } else if (res.info[_data] == 2) {
                                            $(item).css("background-color", "#387cca3b");

                                        } else {

                                            $(item).css("background-color", "chartreuse");

                                        }


                                    });



                                });
                            }



                            // if ($(".lmvt-typeTree li ul li")) {
                            //     $(".lmvt-typeTree li").each(function (i, item) {
                            //         model.com.getStandardAll({ IPTMode: iSelectID, BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: wSelectID, PartID: lSelectID, PartPointID: Number($(item).attr("data-value")), StationID: -1, ProductID: pSelectIDPro }, function (res) {
                            //             if (!res)
                            //                 return;
                            //             var list = res.list,
                            //                 rst = [];
                            //             if (res.list.length > 0) {

                            //                 $.each(res.list, function (j, item_j) {


                            //                     //最大版本号
                            //                     if (item_j.ID > num)
                            //                         num = item_j.ID;

                            //                     if (new Date().getTime() + 7 * 24 * 3600 * 1000 >= new Date(item_j.TModify).getTime() + KeepDayNow * 24 * 3600 * 1000) {
                            //                         $(item).css("background-color", "indianred");
                            //                         return false;
                            //                     }
                            //                     else {
                            //                         if (item_j.IsCurrent == 1) {
                            //                             $(item).css("background-color", "chartreuse");
                            //                             return false;
                            //                         }
                            //                         else
                            //                             $(item).css("background-color", "#387cca3b");

                            //                     }
                            //                 });
                            //             }
                            //             else
                            //                 $(item).css("background-color", "#a9a9a942");
                            //         });

                            //     });
                            // }
                        }
                    }

                },
                //查询所有版本
                getAllPointStandard: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/PointTree",
                        $TYPE: "get",
                        $SERVER: '/MESQMS',
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getAllProductTree: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/ProductTree",
                        $TYPE: "get",
                        $SERVER: '/MESQMS',
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                getStandardList: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/StandardList",
                        $TYPE: "get",
                        $SERVER: '/MESQMS',
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },


                refreshStandard: function (PointID) {



                    ChangeData = 0;
                    model.com.getStandardList({
                        LineID: wSelectID,
                        PartID: lSelectID,
                        PartPointID: PointID,
                        ProductID: pSelectIDPro
                    }, function (res) {
                        if (!res)
                            return;
                        var _list = $com.util.Clone(res.list);
                        var _listItem = $com.util.Clone(res.list);
                        zaceStandardList = [];  //项点数据

                        SelectList = $com.util.Clone(res.list);//版本

                        for (var k = 0; k < _list.length; k++) {
                            _list[k].ItemIPTList = model.com.buildTreePro(_list[k].ItemList);

                            if (_list[k].IsCurrent == 1) {
                                _list[k].BGColor = 'chartreuse';
                            }

                            else if (_list[k].IsCurrent != 1 && _list[k].IsUsed == 1) {
                                _list[k].BGColor = '#387cca3b';
                            } else {

                                _list[k].BGColor = 'white';
                            }


                            $.each(_list[k].ItemList, function (i, item) {

                                $com.util.deleteLowerProperty(item);
                                zaceStandardList.push(item);


                            });

                        }

                        _list.sort(function (a, b) { return Number(a.ID) - Number(b.ID) });

                        model.com.renderTreeStandard(_list);

                    });


                },
                renderTreeStandard: function (list) {
                    //list  ： Type List

                    model.com.fullItemsStandard(list);

                    $("#standardItem").html($com.util.template(list, HTML.TreeTextItemNode));
                    $("#standardItem").treeview({ collapsed: true });
                },
                fullItemsStandard: function (list) {

                    $.each(list, function (i, item) {

                        model.com.fullItemsStandard(item.ItemIPTList);

                        item.Items = $com.util.template(item.ItemIPTList, HTML.TreeStandardItemNode);


                    });
                },
                buildTreePro: function (list) {

                    var _Result = [];
                    $.each(list, function (i, item) {

                        if (item.ItemType == 4) {
                            item.BGColor = '#a9a9a942';
                        } else {

                            item.BGColor = '#a9a9a942';
                        }

                        if (item.GroupID == 0) {
                            _Result.push(item);
                            model.com.buildTreeProItem(item, list);
                        }
                    });


                    return _Result;
                },
                buildTreeProItem: function (_item, list) {

                    if (!_item.ItemIPTList) {
                        _item.ItemIPTList = [];
                    }
                    $.each(list, function (i, item) {
                        if (item.ItemType == 4) {
                            item.BGColor = '#a9a9a942';
                        } else {

                            item.BGColor = '#a9a9a942';
                        }

                        if (item.GroupID == _item.ID) {
                            _item.ItemIPTList.push(item);
                            model.com.buildTreeProItem(item, list);
                        }
                    });
                },

                //根据点击渲染子菜单
                Romance: function (ID, Number) {

                    if (iSelectID != 5)
                        model.com.getStandardAll({
                            IPTMode: iSelectID, BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: wSelectID, PartID: lSelectID, PartPointID: ID, StationID: -1, ProductID: pSelectIDPro
                        }, function (res) {
                            if (!res)
                                return;
                            var list = res.list,
                                rst = [];
                            if (list) {
                                SelectList = res.list;
                                var Options = {};

                                SelectList = $com.util.Clone(SelectList);

                                Options.DefaultSelect = {
                                    ID: 0,
                                    IsCurrent: "",
                                    Remark: "",
                                    UserID: 0,
                                    TModify: 0,
                                    IsUsedText: 0,
                                };
                                Options.KEYWORD_LIST = [
                                    "ID|版本号",
                                    "IsCurrentText|版本状态",
                                    "Remark|名称",
                                    "UserID|操作人",
                                    "TModify|时刻",
                                    "IsUsedText|当前状态",
                                ];
                                Options.IndexTitle = "ID";
                                Options.multiple = false;
                                Options.DATA = [];
                                $.each(SelectList, function (i, item) {
                                    if (item.IsUsed == 1)
                                        item.IsUsedText = "已使用";
                                    else
                                        item.IsUsedText = "未使用";

                                    if (item.IsCurrent == 1)
                                        item.IsCurrentText = "当前版本";
                                    else
                                        item.IsCurrentText = "历史版本";

                                    Options.DATA.push({
                                        ID: item.ID,
                                        IsCurrentText: item.IsCurrentText,
                                        Remark: item.Remark,
                                        UserID: model.com.Downperson(item.UserID),
                                        TModify: item.TModify,
                                        IsUsedText: item.IsUsedText
                                    });
                                });
                                //下拉框changed
                                Options.changed = function (data) {
                                    if (data.length > 0) {
                                        ChangeData = model.com.GetSourceID(data);
                                        $.each(Options.DATA, function (i, item) {
                                            if (item.ID == ChangeData) {
                                                $("#lmvt-ID-Input").val(item.IsCurrentText);
                                                $("#lmvt-remark-Input").val(item.Remark);
                                            }
                                        });
                                        model.com.StandardItem(ChangeData);
                                    }
                                    else {
                                        alert("请选择版本");
                                    }
                                };
                                $("#lmvt-table-select").tableselect(Options);
                            }

                        });
                    else
                        model.com.getStandardAll({
                            IPTMode: iSelectID, BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: -1, PartID: -1, PartPointID: -1, StationID: -1, ProductID: pSelectIDPro
                        }, function (res) {
                            if (!res)
                                return;
                            var list = res.list,
                                rst = [];
                            if (list) {
                                SelectList = res.list;
                                var Options = {};

                                SelectList = $com.util.Clone(SelectList);

                                Options.DefaultSelect = {
                                    ID: 0,
                                    IsCurrent: "",
                                    Remark: "",
                                    UserID: 0,
                                    TModify: 0,
                                    IsUsedText: 0,
                                };
                                Options.KEYWORD_LIST = [
                                    "ID|版本号",
                                    "IsCurrentText|版本状态",
                                    "Remark|名称",
                                    "UserID|操作人",
                                    "TModify|时刻",
                                    "IsUsedText|当前状态",
                                ];
                                Options.IndexTitle = "ID";
                                Options.multiple = false;
                                Options.DATA = [];
                                $.each(SelectList, function (i, item) {
                                    if (item.IsUsed == 1)
                                        item.IsUsedText = "已使用";
                                    else
                                        item.IsUsedText = "未使用";

                                    if (item.IsCurrent == 1)
                                        item.IsCurrentText = "当前版本";
                                    else
                                        item.IsCurrentText = "历史版本";

                                    Options.DATA.push({
                                        ID: item.ID,
                                        IsCurrentText: item.IsCurrentText,
                                        Remark: item.Remark,
                                        UserID: model.com.Downperson(item.UserID),
                                        TModify: item.TModify,
                                        IsUsedText: item.IsUsedText
                                    });
                                });
                                //下拉框changed
                                Options.changed = function (data) {
                                    if (data.length > 0) {
                                        ChangeData = model.com.GetSourceID(data);
                                        $.each(Options.DATA, function (i, item) {
                                            if (item.ID == ChangeData) {
                                                $("#lmvt-ID-Input").val(item.IsCurrentText);
                                                $("#lmvt-remark-Input").val(item.Remark);
                                            }
                                        });
                                        model.com.StandardItem(ChangeData);

                                    }
                                    else {
                                        alert("请选择版本");
                                    }
                                };
                                $("#lmvt-table-select").tableselect(Options);
                            }

                        });
                    //当前版本               
                    model.com.getStandardCurrent({
                        IPTMode: iSelectID, BusinessUnitID: -1, BaseID: -1, FactoryID: -1, WorkShopID: -1, LineID: wSelectID, PartID: lSelectID, PartPointID: ID, StationID: -1, ProductNo: pSelectID
                    }, function (res) {
                        if (res.info.ID == 0) {
                            $("#lmvt-ID-Input").val("");
                            $("#lmvt-remark-Input").val("");
                            return;
                        }
                        if (res) {
                            var List = res.info.ItemList;

                            currentData = res.info.ItemList;

                            List = $com.util.Clone(List);

                            $.each(List, function (i, item) {
                                item.ShowID = i + 1;
                                for (var p in item) {
                                    if (!Formattrt_Item[p])
                                        continue;
                                    if (p == "Unit")
                                        continue;
                                    item[p] = Formattrt_Item[p](item[p]);
                                }
                            });


                            $("#lmvt-ID-Input").val("当前版本");
                            $("#lmvt-remark-Input").val(res.info.Remark);

                            model.com.StandardItem(res.info.ID);
                            $(".zace-type-body").html($com.util.template(List, HTML.StandardList));
                        }

                    });
                },
                //生产树
                renderPartPoint: function (list) {
                    $.each(list, function (i, item) {
                        item.OrderID = i + 1;
                    })
                    var _list = $com.util.Clone(list);
                    $.each(_list, function (i, item) {
                        for (var p in item) {
                            if (!FORMATTRT[p])
                                continue;
                            item[p] = FORMATTRT[p](item[p]);
                        }
                    });
                    $("#cby-PartPoint-tbody").html($com.util.template(_list, HTML.PartItemNode));
                    PartPointSource = _list;
                },
                //运算
                CountStandard: function (StandardObject, number) {
                    var standardString;
                    // switch (number) {
                    //     case 0: standardString = StandardObject.StandardValue; break;
                    //     case 1: standardString = StandardObject.StandardValue; break;
                    //     case 2: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + StandardObject.StandardLeft + "＜" + " n " + "＜" + StandardObject.StandardRight; break;
                    //     case 3: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + StandardObject.StandardLeft + "≤" + " n " + "≤" + StandardObject.StandardRight; break;
                    //     case 4: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + StandardObject.StandardLeft + "＜" + " n " + "≤" + StandardObject.StandardRight; break;
                    //     case 5: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + StandardObject.StandardLeft + "≤" + " n " + "＜" + StandardObject.StandardRight; break;
                    //     case 6: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + " n " + "＜" + StandardObject.StandardRight; break;
                    //     case 7: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + " n " + "＞" + StandardObject.StandardLeft; break;
                    //     case 8: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + " n " + "≤" + StandardObject.StandardRight; break;
                    //     case 9: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + " n " + "≥" + StandardObject.StandardLeft; break;
                    //     case 10: standardString = " n " + "=" + StandardObject.StandardValue; break;
                    //     case 11:
                    //     case 12:
                    //     case 13:
                    //     case 14: standardString = StandardObject.StandardValue; break;
                    //     default: break;
                    // }
                    switch (number) {
                        case 0: standardString = StandardObject.StandardValue; break;
                        case 1: standardString = StandardObject.StandardValue; break;
                        case 2: standardString = "范围：" + StandardObject.StandardLeft + "＜" + " n " + "＜" + StandardObject.StandardRight; break;
                        case 3: standardString = "范围：" + StandardObject.StandardLeft + "≤" + " n " + "≤" + StandardObject.StandardRight; break;
                        case 4: standardString = "范围：" + StandardObject.StandardLeft + "＜" + " n " + "≤" + StandardObject.StandardRight; break;
                        case 5: standardString = "范围：" + StandardObject.StandardLeft + "≤" + " n " + "＜" + StandardObject.StandardRight; break;
                        case 6: standardString = "范围：" + " n " + "＜" + StandardObject.StandardRight; break;
                        case 7: standardString = "范围：" + " n " + "＞" + StandardObject.StandardLeft; break;
                        case 8: standardString = "范围：" + " n " + "≤" + StandardObject.StandardRight; break;
                        case 9: standardString = "范围：" + " n " + "≥" + StandardObject.StandardLeft; break;
                        case 10: standardString = " n " + "=" + StandardObject.StandardValue; break;
                        case 11:
                        case 12:
                        case 13:
                        case 14: standardString = StandardObject.StandardValue; break;
                        default: break;
                    }
                    return standardString;
                },
                //版本项列表
                StandardItem: function (wID) {
                    GroupID = 0;
                    ChangeData = 0;
                    // model.com.getStandardInfo({ ID: wID }, function (res) {
                    //     if (!res)
                    //         return;
                    //     standardInfoList = res.info.ItemList;

                    //     standardInfoData = $com.util.Clone(res.info.ItemList);
                    //     for (var index = 0; index < standardInfoData.length; index++) {
                    //         standardInfoData[index].ShowID = index + 1;;

                    //     }

                    //     standardInfoList = $com.util.Clone(standardInfoList);

                    //     $.each(standardInfoList, function (i, item) {
                    //         item.ShowID = i + 1;
                    //         item.OptionsItem = '';
                    //         for (var k = 0; k < item.ValueSource.length; k++) {
                    //             item.OptionsItem += item.ValueSource[k] + ";"

                    //         }
                    //         for (var p in item) {
                    //             if (!Formattrt_Item[p])
                    //                 continue;
                    //             if (p == "Unit")
                    //                 continue;
                    //             item[p] = Formattrt_Item[p](item[p]);
                    //         }
                    //     });

                    //     $(".zace-type-body").html($com.util.template(standardInfoList, HTML.StandardList));

                    // });


                    var _list = [];
                    mZaceStandard = 0;

                    if (zaceStandardList.length == 0) {
                        mZaceStandard = wID;
                        ChangeData = wID;
                    }
                    for (var m = 0; m < zaceStandardList.length; m++) {

                        //是版本ID  找出组
                        if (ZaceLineID && ZaceLineID >= 0) {

                            mZaceStandard = wID;
                            ChangeData = wID;
                            if (wID == zaceStandardList[m].VID && zaceStandardList[m].GroupID == 0) {
                                _list.push(zaceStandardList[m]);
                            }
                        } else {
                            //不是版本   项ID        
                            GroupID = wID;
                            if (wID == zaceStandardList[m].GroupID) {
                                _list.push(zaceStandardList[m]);
                            }
                        }


                    }

                    standardInfoList = $com.util.Clone(_list);

                    standardInfoData = $com.util.Clone(_list);
                    for (var index = 0; index < standardInfoData.length; index++) {
                        standardInfoData[index].ShowID = index + 1;;

                    }

                    standardInfoList = $com.util.Clone(standardInfoList);

                    $.each(standardInfoList, function (i, item) {
                        item.ShowID = i + 1;
                      
                        item.OptionsItem =  item.ValueSource.join("||");

                        item.ManufactorOptionText = item.ManufactorOption.join("||");
                       
                        item.ModalOptionText = item.ModalOption.join("||");
                      
                       
                        for (var p in item) {
                            if (!Formattrt_Item[p])
                                continue;
                            if (p == "Unit")
                                continue;
                            item[p] = Formattrt_Item[p](item[p]);
                        }
                    });

                    $(".zace-type-body").html($com.util.template(standardInfoList, HTML.StandardList));


                },
                //获取操作人
                Downperson: function (wid) {
                    var name;
                    $.each(UserList, function (i, item) {
                        if (item.ID == wid) {
                            name = item.Name;
                            return name;
                        }
                    });
                    return name;
                },
                //得到上部工步id
                GetStepID: function (lSelectID, dSelectID, stepID) {
                    var ID;
                    $.each(partSource, function (i, item) {
                        if (lSelectID == item.UnitID) {
                            $.each(item.UnitList, function (j, item_j) {
                                // $.each(item_j.UnitList, function (k, item_k) {
                                if (item_j.LevelID == dSelectID && stepID == item_j.UnitID) {
                                    ID = item_j.ParentUnitID;
                                    return ID;
                                }
                                // });
                            });
                        }
                    });
                    return ID;
                }
            },
        });
        model.init();
    });