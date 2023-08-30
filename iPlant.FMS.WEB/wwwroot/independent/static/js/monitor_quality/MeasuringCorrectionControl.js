require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/bootstrap-treeview.min', '../static/utils/js/base/table-select'],
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

            //点击的树的对象
            standardItemTreeObj,

            //NodeID
            NodeID = -1,

            //是设备 存放于StationID是设备
            wModelID = 0,

            mdataObj,

            wGroupID,

            IPTMode,

            Count,
            ID,  //工步ID
            SonNumber,
            SinID,
            Data_PartPointList,
            number,
            num,
            Options,

            //什么类型
            lmvtType = 0,

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
            UserList,
            //树结构Tree
            GruopAllTree,

            GroupID = 0,

            //产线对应的工段
            partSource;
        zaceStandardList = [];

        var zaceType = 1;//默认显示车型树
        var zaceProduct = [];//车型
        var mZaceStandard = 0;//版本ID

        var mSonID = 0;//工序
        HTML = {
            TreeItemNode: [
                '<li data-titie="{{ID}}"  data-value="{{ID}}"  >',
                '<div class="lmvt-tree" style="vertical-align:top;Color:{{ColorText}}" data-value="{{ID}}" data-core="{{ColorText}}">{{Code}}  ({{Name}})</div> ',
                '<ul>{{Items}}',
                '</ul>',
                '</li>',
            ].join(""),
            PartStandardList: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                // '<td data-title="LineName" data-value="{{LineName}}" >{{LineName}}</td>',
                // '<td data-title="ProductNo" data-value="{{ProductNo}}" >{{ProductNo}}</td>',
                // '<td data-title="PartName" data-value="{{PartName}}" >{{PartName}}</td>',
                // '<td data-title="PartPointName" data-value="{{PartPointName}}" >{{PartPointName}}</td>',
                '<td style="background:{{ColorText}}" data-title="Remark" data-value="{{Remark}}" >{{Remark}}</td>',
                // '<td style="background:{{ColorText}}" data-title="SamplingStandard" data-value="{{SamplingStandard}}" >{{SamplingStandard}}</td>',
                '<td data-title="IsCurrent" data-value="{{IsCurrent}}" ><span class="badge lmvt-badge {{IsUsedBadge}}">{{Badge}}</span>{{IsCurrent}}</td>',
                '<td data-title="IsUsed" data-value="{{IsUsed}}"><span class="badge lmvt-badge {{UserIDBadge}}">{{Badge}}</span>{{IsUsed}}</td>',
                '<td data-title="UserID" data-value="{{UserID}}">{{UserID}}</td>',
                '<td data-title="TModify" data-value="{{TModify}}">{{TModify}}</td>',

                '<td style="min-width: 80px;color:#C7001A" data-title="ID" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-4 lmvt-do-info">详情</div>',
                '<div class="col-md-4 {{ISAllowed}}">删除</div>',
                '<div class="col-md-4"><UL id="lmvt-nav">',
                '<LI>更多<UL>',
                '<LI data-value="{{ID}}" class="lmvt-version-copy">版本复制</LI>',
                '<LI data-value="{{ID}}" class="{{ISNow}}">设为当前</LI>',
                '<LI data-value="{{ID}}" class="lmvt-lookInfo">校正规则</LI>',
                '</UL></LI></UL></div>',
                '</div></td>',
                '</tr>',
            ].join(""),
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
                //'<td data-title="DefaultManufactor" data-value="{{DefaultManufactor}}" >{{DefaultManufactor}}</td>',
                // '<td data-title="Text" data-value="{{Text}}" >{{Text}}</td>',
                //'<td data-title="DefaultModal" data-value="{{DefaultModal}}" >{{DefaultModal}}</td>',
                // '<td data-title="DefaultValue" data-value="{{DefaultValue}}" >{{DefaultValue}}</td>',
                //'<td data-title="IsManufactorFill" data-value="{{IsManufactorFill}}" >{{IsManufactorFill}}</td>',
                // '<td data-title="StandardBaisc" data-value="{{StandardBaisc}}" >{{StandardBaisc}}</td>',
                //'<td data-title="IsModalFill" data-value="{{IsModalFill}}" >{{IsModalFill}}</td>',
                //'<td data-title="IsNumberFill" data-value="{{IsNumberFill}}" >{{IsNumberFill}}</td>',

                // '<td data-title="SamplingPlan" data-value="{{SamplingPlan}}" >{{SamplingPlan}}</td>',
                // '<td data-title="AQL" data-value="{{AQL}}" >{{AQL}}</td>',

                '<td data-title="StandardType" data-value="{{StandardType}}" >{{StandardType}}</td>',
                '<td data-title="StandardRight" data-value="{{StandardRight}}" >{{StandardRight}}</td>',
                '<td data-title="StandardValue" data-value="{{StandardValue}}" >{{StandardValue}}</td>',
                '<td data-title="StandardLeft" data-value="{{StandardLeft}}" >{{StandardLeft}}</td>',
                '<td data-title="Unit" data-value="{{Unit}}" >{{Unit}}</td>',
                '<td data-title="IsWriteFill" data-value="{{IsWriteFill}}" >{{IsWriteFill}}</td>',
                //'<td data-title="ManufactorOptionText" data-value="{{ManufactorOptionText}}" >{{ManufactorOptionText}}</td>',
                //'<td data-title="ModalOptionText" data-value="{{ModalOptionText}}" >{{ModalOptionText}}</td>',
                //'<td data-title="DefaultStationID" data-value="{{DefaultStationID}}" >{{DefaultStationID}}</td>',
                // '<td data-title="IsPeriodChange" data-value="{{IsPeriodChange}}" >{{IsPeriodChange}}</td>',
                '<td data-title="IsPictureFill" data-value="{{IsPictureFill}}" >{{IsPictureFill}}</td>',

                // '<td style="min-width: 50px" data-title="LendImages">{{LendImages}}</td>',

                // '<td data-title="Standard" data-value="{{Standard}}" >{{Standard}}</td>',
                '<td data-title="OptionsItem" data-value="{{OptionsItem}}" >{{OptionsItem}}</td>',
                //'<td data-title="Text" data-value="{{Text}}" >{{Text}}</td>',
                //'<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
                // '<td data-title="IsQuality" data-value="{{IsQuality}}" >{{IsQuality}}</td>',
                //'<td data-title="ConfigID" data-value="{{ConfigID}}" >{{ConfigID}}</td>',
                // '<td style="min-width: 80px;color:#C7001A" data-title="ID" data-value="{{ID}}"><div class="row">',
                // '<div class="col-md-4 {{ISReset}}">修改</div>',
                // '<div class="col-md-4 {{ISAllowed}}">删除</div>',
                // '<div class="col-md-4"><UL id="lmvt-nav">',
                // '<LI>更多<UL>',
                // '<LI data-value="{{ID}}" class="{{ISUpload}}">上传图片</LI>',
                // '</UL></LI></UL></div>',
                // '</div></td>',
                '<td style="min-width: 80px;color:#C7001A" data-title="ID" data-value="{{ID}}"><div class="row">',
                '<div class="col-md-6 {{ISReset}}">修改</div>',
                '<div class="col-md-6 {{ISAllowed}}">删除</div>',
                // '<div class="col-md-4"><UL id="lmvt-nav">',
                // '<LI>更多<UL>',
                // '<LI data-value="{{ID}}" class="{{ISUpload}}">上传图片</LI>',
                // '</UL></LI></UL></div>',
                '</div></td>',

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
                '<li data-titie="{{ID}}"  data-value="{{ID}}" style="" >',
                '<div style="vertical-align:top;"   data-value="{{ID}}" data-type="{{ItemType}}" >{{Text}}</div> ',
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
            IMGLIST: '<img src= "{{SrcList}}" style="width:25px;height:25px;"/>',
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

        UserAll = window.parent._UserAll;

        //新增版本项
        Defaul_Value_Item = {
            Text: '',
            Standard: '',
            // ItemType: 4,
            //DefaultManufactor: '',
            //DefaultModal: '',
            // TechStandard: '',
            //IsManufactorFill: 0,
            //IsModalFill: 0,
            //IsNumberFill: 0,
            StandardType: 0,
            UnitID: 0,
            IsWriteFill: 0,
            //ManufactorOption: '',
            //ModalOption: '',
            //DefaultStationID: 0,
            // IsPeriodChange: 0,
            IsPictureFill: 0,
            ValueSource: 0,
            StandardRight: 0,
            StandardValue: 0,
            StandardLeft: 0,

            // SamplingPlan: 0,
            // AQL: "",
        };
        (function () {

            KETWROD_LIST_Item = [
                "Text|项名称",
                "Standard|标准",

                "SamplingPlan|抽样方案|ArrayOne",
                "AQL|AQL",

                "ItemType|类型|ArrayOne",

                "IsQuality|质量项点|ArrayOne",
                "OrderID|顺序",
                "PartsCoding|部件编码",

                "DefaultManufactor|预设厂家",
                "DefaultModal|预设型号",
                "IsManufactorFill|厂家|ArrayOne",
                "IsModalFill|型号|ArrayOne",
                "IsNumberFill|编号|ArrayOne",
                "StandardType|值类型|ArrayOne",
                "StandardRight|上限值",
                "StandardValue|标准值",
                "StandardLeft|下限值",
                "UnitID|单位|ArrayOne",
                "IsWriteFill|填写值必填|ArrayOne",
                "ManufactorOption|厂家选项|InputArray",
                "ModalOption|型号选项|InputArray",
                "ValueSource|数据源|InputArray",
                "DefaultStationID|默认工位|ArrayOne",
                "IsPeriodChange|段改项|ArrayOne",
                "IsPictureFill|图片必填|ArrayOne",
                "IsCurrent|是否当前|ArrayOne",
                "IsUsed|是否已用|ArrayOne",
                "Unit|单位",
                "UserID|-|ArrayOne",
                "TModify|是否已用|DateTime",
                // "StandardValue|版本值",
                "DefaultValue|默认值",

                "StandardBaisc|基准值",
                // "StandardRight|下限",
                // "StandardLeft|上限",
                "Visiable|是否可见|ArrayOne",
                "ValueSource|数据源|InputArray",
                "ConfigID|部件编码|ArrayOne"
            ];

            KETWROD_Item = {};

            Formattrt_Item = {};

            TypeSource_Item = {

                SamplingPlan: [],

                UserID: [],
                ConfigID: [{
                    name: "-",
                    value: 0
                },],
                IsQuality: [

                    {
                        name: "否",
                        value: 0
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
                IsCurrent: [
                    {
                        name: "否",
                        value: 0
                    },
                    {
                        name: "是",
                        value: 1
                    },

                ],
                IsUsed: [
                    {
                        name: "否",
                        value: 0
                    },
                    {
                        name: "是",
                        value: 1
                    },

                ],
                DefaultStationID: [
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
                        value: 1
                    },
                    {
                        name: "否",
                        value: 0
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

                    // {
                    //     name: "无",
                    //     value: 15
                    // },
                    {
                        name: "文本",
                        value: 0
                    },
                    {
                        name: "单选",
                        value: 1
                    },
                    {
                        name: "全开区间",
                        value: 2
                    },
                    {
                        name: "全包区间",
                        value: 3
                    },
                    {
                        name: "右包区间",
                        value: 4
                    },
                    {
                        name: "左包区间",
                        value: 5
                    }, {
                        name: "小于",
                        value: 6
                    },
                    {
                        name: "大于",
                        value: 7
                    },
                    {
                        name: "小于等于",
                        value: 8
                    },
                    {
                        name: "大于等于",
                        value: 9
                    },
                    {
                        name: "等于",
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
                    //     name: "抽检测量",
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

            $.each(UserAll, function (i, item) {
                TypeSource_Item.UserID.push({
                    name: item.Name,
                    value: item.ID
                });
            });


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
            // SamplingID: 0
            // KeepDay: 36500,
            // TopNum: 100
        };
        (function () {

            KETWROD_LIST_Standard = [
                "ID|版本|Readonly",
                "Remark|名称*",
                "KeepDay|持续时间",
                "TopNum|查询数量",
                "SamplingID|抽样标准|ArrayOne"
            ];

            KETWROD_Standard = {};

            Formattrt_Standard = {};

            TypeSource_Standard = {
                SamplingID: []
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
            name: '设备维修',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {

                //折叠
                $("body").delegate("#lmvt-tree-open", "click", function () {

                    $("#standardList").treeview('expandAll', { silent: true });
                });

                $("body").delegate("#lmvt-tree-close", "click", function () {

                    $("#standardList").treeview('collapseAll', { silent: true });
                });

                $("body").delegate("#input-select-node", "input", function () {

                    var value = $(this).val();

                    $("#standardList").treeview('search', [value, {
                        ignoreCase: true,     // case insensitive
                        exactMatch: false,    // like or equals
                        revealResults: true,  // reveal matching nodes
                    }]);

                });

                //查看校正规则 
                $("body").delegate(".lmvt-lookInfo", "click", function () {

                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var vdata = { 'header': '量具校正规则', 'href': './device_manage/MeasuringCorrection-rule.html?ID=' + wDBID, 'id': 'MeasuringCorrection-rule', 'src': '/MESCore/upload/web/量具校正.svg' };

                    window.parent.iframeHeaderSet(vdata);

                    window.callFunctionTrigger("deviceMaintain", { ID: wDBID });

                });

                $("body").delegate("#lmvt-bopImport-inputErrorLog", "click", function () {

                    var vdata = { 'header': '导入日志', 'href': './factory_model/FPCErrorSetting.html?id=' + 3, 'id': 'FPCErrorSettingBop', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                    window.parent.iframeHeaderSet(vdata);
                    window.callFunctionTrigger("FPCErrorSettingBop", { ID: 3 });


                });

                $("body").delegate("#lmvt-set-download-alt", "click", function () {
                    window.open('/MESCore/upload/X修程-X车型-X工位.xlsx');
                });
                //
                //修改版本项
                $("body").delegate("#lmvt-standarditem-Quality", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".zace-type-body"), "ShowID", standardInfoData);

                    if (!SelectData || !SelectData.length) {
                        alert("请选择一行数据！")
                        return;
                    }

                    for (var k = 0; k < SelectData.length; k++) {
                        $com.util.deleteLowerProperty(SelectData[k]);
                    }

                    model.com.setQuality({
                        data: SelectData,
                        IsQuality: 1,
                    }, function (res) {
                        alert("设置成功！！");
                        model.com.refreshStandardInfo(StandardID);
                    });
                });
                $("body").delegate("#lmvt-standarditem-QualityClose", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".zace-type-body"), "ShowID", standardInfoData);

                    if (!SelectData || !SelectData.length) {
                        alert("请选择一行数据！")
                        return;
                    }

                    for (var k = 0; k < SelectData.length; k++) {
                        $com.util.deleteLowerProperty(SelectData[k]);

                    }
                    model.com.setQuality({
                        data: SelectData,
                        IsQuality: 0,
                    }, function (res) {
                        alert("设置成功！！");
                        model.com.refreshStandardInfo(StandardID);
                    });




                });

                $("body").delegate("#lmvt-standarditem-PartConfig", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".zace-type-body"), "ShowID", standardInfoData);

                    if (!SelectData || !SelectData.length) {
                        alert("请选择一行数据！")
                        return;
                    }

                    if (SelectData.length != 1) {
                        alert("只能选择一行数据！")
                        return;
                    }

                    $com.util.deleteLowerProperty(SelectData[0]);

                    var Defaul_Value = {
                        //Text: SelectData[0].Text,
                        ConfigID: SelectData[0].ConfigID,

                    };

                    $("body").append($com.modal.show(Defaul_Value, KETWROD_Item, "修改部件编码", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        SelectData[0].ConfigID = Number(rst.ConfigID);
                        SelectData[0].PartsCoding = CodeAllObj[SelectData[0].ConfigID].Code;




                        model.com.setPartCoding({
                            data: SelectData[0],
                            PartsCoding: SelectData[0].PartsCoding,
                            ConfigID: SelectData[0].ConfigID
                        }, function (res) {
                            alert("修改部件编码成功！");



                            //model.com.StandardItem(GroupID);
                            model.com.refreshStandardInfo(StandardID);
                        });

                    }, TypeSource_Item));

                });
                $("body").delegate("#lmvt-standarditem-Order", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".zace-type-body"), "ShowID", standardInfoData);

                    if (!SelectData || !SelectData.length) {
                        alert("请选择一行数据！")
                        return;
                    }

                    if (SelectData.length != 1) {
                        alert("只能选择一行数据！")
                        return;
                    }

                    $com.util.deleteLowerProperty(SelectData[0]);

                    var Defaul_Value = {
                        //Text: SelectData[0].Text,
                        OrderID: SelectData[0].OrderID,

                    };

                    $("body").append($com.modal.show(Defaul_Value, KETWROD_Item, "修改部件编码", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        SelectData[0].OrderID = Number(rst.OrderID);





                        model.com.setItemOrder({
                            data: SelectData[0],
                            OrderID: SelectData[0].OrderID
                        }, function (res) {
                            alert("修改顺序成功！");



                            //model.com.StandardItem(GroupID);
                            model.com.refreshStandardInfo(StandardID);
                        });

                    }, TypeSource_Item));




                });
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

                    if (!extLimit(['xlsx', 'xls']).has(this.files[0].name)) {
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
                    form.append("StationID", lSelectID);
                    form.append("CustomerID", 0);


                    // PartID: lSelectID
                    $com.app.loading('数据导入中...');
                    model.com.postImportExcel(form, [function (res) {
                        alert("导入成功！！");
                        $com.app.loaded();
                        model.com.refreshPartAll();

                    }, function (res2) {
                        $com.app.loaded();
                        if (!confirm("导入失败，是否查看详情？")) {
                            model.com.refreshPartAll();
                            return;
                        }
                        $("#lmvt-bopImport-inputErrorLog").click();
                    }]);
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

                    if (NodeID == -1) {
                        alert("未选择量具信息,请点击左侧树");
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


                        inputDate = {
                            ID: 0,
                            CompanyID: 0,
                            BusinessUnitID: 0,
                            BaseID: 0,
                            FactoryID: 0,
                            WorkShopID: 0,
                            IPTMode: IPTMode,
  
                            SamplingID: 0,

                            IsCurrent: 0,
                            IsEnd: 0,
                            IsUseD: 0,
                            ItemList: [],
                            LineID: wGroupID,
                            PartID: 0,
                            PartPointID: 0,
                            StationID: 0,
                            ProductNo: "",
                            ProductID: wModelID,
                            Remark: rst.Remark,

                            TModify: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        };

                        $com.util.deleteLowerProperty(inputDate);
                        model.com.postSaveStandard({
                            data: inputDate,
                        }, function (res) {
                            alert("新增成功！！");
                            model.com.refreshPartAll();
                        });

                    }, TypeSource_Standard));

                });
                //新增版本组
                $("body").delegate("#lmvt-standarditem-group", "click", function () {

                    var dataSource = $com.util.Clone(mdataObj);//版本

                    if (dataSource.IsUsed == 1) {
                        alert("该版本已经被使用")
                        return;
                    }

                    if (lmvtType != 0) {
                        if (lmvtType != 4) {
                            alert("该项点已经是最小单元了，无法新增！！！");
                            return;
                        }
                    }

                    var Defaul_Value_ItemGroup = {
                        Text: '',
                    }
                    $("body").append($com.modal.show(Defaul_Value_ItemGroup, KETWROD_Item, "新增组", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        for (var i = 0; i < dataSource.ItemList.length; i++) {
                            $com.util.deleteLowerProperty(dataSource.ItemList[i]);
                        }

                        var _data = {
                            Text: rst.Text,
                            ItemType: 4,
                        };
                        _data.GroupID = GroupID;

                        dataSource.ItemList.push(_data);

                        delete dataSource.IsCurrentText;
                        delete dataSource.IsUsedText;

                        $com.util.deleteLowerProperty(dataSource);
                        model.com.postSaveStandard({
                            data: dataSource,
                        }, function (res) {
                            alert("新增组成功！！");
                            //model.com.StandardItem(GroupID);
                            model.com.refreshStandardInfo(StandardID);
                        });

                    }, TypeSource_Item));

                });

                //新增版本项
                $("body").delegate("#lmvt-standarditem-add", "click", function () {

                    var dataSource = $com.util.Clone(mdataObj);//版本

                    if (dataSource.IsUsed == 1) {
                        alert("该版本已经被使用")
                        return;
                    }

                    if (lmvtType != 0) {
                        if (lmvtType != 4) {
                            alert("该项点已经是最小单元了，无法新增！！！");
                            return;
                        }
                    }

                    $("body").append($com.modal.show(Defaul_Value_Item, KETWROD_Item, "新增版本项", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        var _data = {
                            Text: rst.Text,
                            Standard: rst.Standard,
                            ItemType: 2,
                            //DefaultManufactor: rst.DefaultManufactor,

                            SamplingPlan: rst.SamplingPlan,
                            AQL: rst.AQL,

                            //ItemType: 2,
                            //DefaultModal: rst.DefaultModal,
                            //IsModalFill: rst.IsModalFill,
                            StandardType: Number(rst.StandardType),
                            //IsManufactorFill: rst.IsManufactorFill,
                            //IsNumberFill: rst.IsNumberFill,
                            IsWriteFill: rst.IsWriteFill,
                            UnitID: Number(rst.UnitID),
                            //ManufactorOption: rst.ManufactorOption,
                            //ModalOption: rst.ModalOption,
                            //DefaultStationID: Number(rst.DefaultStationID),
                            // IsPeriodChange: rst.IsPeriodChange,
                            IsPictureFill: rst.IsPictureFill,
                            //Visiable: true,
                            Unit: Number(rst.UnitID) > 0 ? Formattrt_Item["UnitID"](Number(rst.UnitID)) : "",
                            ValueSource: rst.ValueSource,
                            StandardRight: Number(rst.StandardRight),
                            StandardValue: Number(rst.StandardValue),
                            StandardLeft: Number(rst.StandardLeft),
                        };

                        _data.GroupID = GroupID;
                        // _data.Standard = model.com.CountStandard(_data, Number(rst.StandardType))
                        dataSource.ItemList.push(_data);

                        delete dataSource.IsCurrentText;
                        delete dataSource.IsUsedText;

                        $com.util.deleteLowerProperty(dataSource);
                        model.com.postSaveStandard({
                            data: dataSource,
                        }, function (res) {
                            alert("新增项成功！！");
                            //model.com.StandardItem(GroupID);
                            model.com.refreshStandardInfo(StandardID);
                        });

                    }, TypeSource_Item));

                });
                $("body").delegate(".modal-dialog .modal-body.femi-modal-body .femi-modal-item select#modal_select_StandardType", "change", function () {


                    var $this = $(this);
                    var value = Number($(this).val());
                    var $standardValue = $(this).closest(".femi-modal-item").siblings('.femi-modal-item').find("input[data-name=StandardValue]");

                    switch (value) {
                        case 6:
                        case 7:
                        case 8:
                        case 9:
                        case 10:
                            $standardValue.prop("type", "number");
                            break;

                        default:
                            $standardValue.prop("type", "text");
                            break;
                    }


                });
                //删除版本项
                $("body").delegate("#lmvt-standarditem-delete", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".zace-type-body"), "ShowID", standardInfoData);

                    if (!SelectData || !SelectData.length) {
                        alert("至少选择一行数据再试！")
                        return;
                    }


                    var _pencilID = SelectData[0].VID;
                    if (!_pencilID) {
                        alert("当前未选择版本");
                        return;
                    }

                    var dataSource = SelectList[0];
                    if (dataSource.IsUsed == 1) {
                        alert("该版本已经被使用")
                        return;
                    }

                    var GetSonItem = function (_item, list) {
                        var _result = [];
                        if (_item.ItemType == 4) {
                            $.each(list, function (i, item) {

                                if (item.GroupID == _item.ID) {
                                    _result = _result.concat(GetSonItem(item, list));
                                }
                            });
                        }
                        _result.push(_item);
                        return _result;
                    };
                    var _SelectData = [];
                    $.each(SelectData, function (i, item) {
                        _SelectData = _SelectData.concat(GetSonItem(item, dataSource.ItemList));
                    });
                    SelectData = _SelectData;
                    if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                        return;
                    }

                    $com.util.deleteLowerProperty(dataSource);

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

                        //model.com.StandardItem(GroupID);
                        model.com.refreshStandardInfo(StandardID);

                    });


                });

                //删除版本项 单条
                $("body").delegate(".partAllStandard .lmvt-allowed-delete", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.parents("td").attr("data-value"));

                    const SelectData = standardInfoData.filter(item => item.ID == wDBID);

                    if (!confirm("已选择 [" + SelectData[0].Text + "] 的数据，确定将其删除？")) {
                        return;
                    }

                    var dataSource = $com.util.Clone(mdataObj);

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
                        model.com.refreshStandardInfo(StandardID);
                    });


                });

                //修改版本项 单条
                $("body").delegate(".partAllStandard .lmvt-do-info", "click", function () {
                    var $this = $(this),
                        wDBID = Number($this.parents("td").attr("data-value"));

                    const SelectData = standardInfoData.filter(item => item.ID == wDBID);

                    $com.util.deleteLowerProperty(SelectData[0]);
                    var dataSource = $com.util.Clone(mdataObj);

                    var Defaul_Value = {
                        Text: SelectData[0].Text,
                        Standard: SelectData[0].Standard,
                        IsWriteFill: SelectData[0].IsWriteFill,
                        StandardType: SelectData[0].StandardType,
                        UnitID: SelectData[0].UnitID,
                        IsPictureFill: SelectData[0].IsPictureFill,
                        ValueSource: SelectData[0].ValueSource,
                        StandardRight: SelectData[0].StandardRight,
                        StandardValue: SelectData[0].StandardValue,
                        StandardLeft: SelectData[0].StandardLeft,
                    };

                    $("body").append($com.modal.show(Defaul_Value, KETWROD_Item, "修改版本项", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        for (var i = 0; i < dataSource.ItemList.length; i++) {
                            $com.util.deleteLowerProperty(dataSource.ItemList[i]);
                        }

                        var _data = {
                            Text: rst.Text,
                            Standard: rst.Standard,

                            IsPictureFill: rst.IsPictureFill,

                            IsWriteFill: rst.IsWriteFill,

                            StandardType: Number(rst.StandardType),
                            StandardRight: rst.StandardRight,
                            StandardValue: rst.StandardValue,
                            StandardLeft: rst.StandardLeft,
                            UnitID: Number(rst.UnitID),
                            Unit: Number(rst.UnitID) > 0 ? Formattrt_Item["UnitID"](Number(rst.UnitID)) : "",

                            ValueSource: rst.ValueSource,
                        };

                        $.each(dataSource.ItemList, function (i, item) {
                            if (item.ID == SelectData[0].ID) {
                                item.Text = _data.Text;
                                item.Standard = _data.Standard;
                                item.IsPictureFill = _data.IsPictureFill;
                                item.IsWriteFill = _data.IsWriteFill;
                                item.StandardType = _data.StandardType;
                                item.StandardRight = _data.StandardRight;
                                item.StandardValue = _data.StandardValue;
                                item.StandardLeft = _data.StandardLeft;
                                item.Unit = _data.Unit;
                                item.UnitID = _data.UnitID;
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
                            model.com.refreshStandardInfo(StandardID);
                        });

                    }, TypeSource_Item));
                });

                //修改版本项
                $("body").delegate("#lmvt-standardtable-change", "click", function () {
                    var SelectData = $com.table.getSelectionData($(".zace-type-body"), "ShowID", standardInfoData);

                    if (!SelectData || !SelectData.length) {
                        alert("请选择一行数据！")
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

                    var dataSource = SelectList[0];



                    if (dataSource.IsUsed == 1) {
                        alert("该版本已经被使用")
                        return;
                    }

                    if (SelectData[0].ItemType == 4) {

                        var Defaul_Value = {
                            //Text: SelectData[0].Text,
                            Text: SelectData[0].Text,

                        };

                        $("body").append($com.modal.show(Defaul_Value, KETWROD_Item, "修改版本项", function (rst) {
                            if (!rst || $.isEmptyObject(rst)) {
                                return false;
                            }


                            for (var i = 0; i < dataSource.ItemList.length; i++) {
                                $com.util.deleteLowerProperty(dataSource.ItemList[i]);
                            }

                            var _data = {
                                Text: rst.Text,

                            };
                            // _data.Standard = model.com.CountStandard(_data, Number(rst.StandardType));

                            $.each(dataSource.ItemList, function (i, item) {
                                if (item.ID == SelectData[0].ID) {
                                    item.Text = _data.Text;


                                }
                            });

                            delete dataSource.IsCurrentText;
                            delete dataSource.IsUsedText;

                            $com.util.deleteLowerProperty(dataSource);

                            model.com.postSaveStandard({
                                data: dataSource,
                            }, function (res) {
                                alert("修改组成功！！");



                                //model.com.StandardItem(GroupID);
                                model.com.refreshStandardInfo(StandardID);
                            });

                        }, TypeSource_Item));
                    } else {
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
                            IsPictureFill: SelectData[0].IsPictureFill,
                            //Visiable: SelectData[0].Visiable,
                            ValueSource: SelectData[0].ValueSource,

                            StandardRight: SelectData[0].StandardRight,
                            StandardValue: SelectData[0].StandardValue,
                            StandardLeft: SelectData[0].StandardLeft,

                        };

                        $("body").append($com.modal.show(Defaul_Value, KETWROD_Item, "修改版本项", function (rst) {
                            if (!rst || $.isEmptyObject(rst)) {
                                return false;
                            }
                            // if (!rst.Standard) {
                            //     rst.Standard = [];
                            // }




                            for (var i = 0; i < dataSource.ItemList.length; i++) {
                                $com.util.deleteLowerProperty(dataSource.ItemList[i]);
                            }

                            var _data = {
                                Text: rst.Text,
                                Standard: rst.Standard,
                                DefaultManufactor: rst.DefaultManufactor,
                                IsPictureFill: rst.IsPictureFill,
                                IsModalFill: rst.IsModalFill,
                                IsNumberFill: rst.IsNumberFill,
                                IsWriteFill: rst.IsWriteFill,
                                ManufactorOption: rst.ManufactorOption,
                                StandardType: Number(rst.StandardType),
                                //StandardBaisc: rst.StandardBaisc,
                                ModalOption: rst.ModalOption,
                                DefaultStationID: Number(rst.DefaultStationID),
                                StandardRight: rst.StandardRight,
                                StandardValue: rst.StandardValue,
                                StandardLeft: rst.StandardLeft,
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
                                    item.IsPictureFill = _data.IsPictureFill,
                                        item.IsModalFill = _data.IsModalFill;
                                    item.IsNumberFill = _data.IsNumberFill;
                                    item.IsWriteFill = _data.IsWriteFill;
                                    item.ManufactorOption = _data.ManufactorOption;
                                    item.StandardType = _data.StandardType;
                                    item.ModalOption = _data.ModalOption;
                                    item.DefaultStationID = _data.DefaultStationID;

                                    item.StandardRight = _data.StandardRight;
                                    item.StandardValue = _data.StandardValue;
                                    item.StandardLeft = _data.StandardLeft;
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

                                // model.com.StandardItem(GroupID);
                                model.com.refreshStandardInfo(StandardID);
                            });

                        }, TypeSource_Item));
                    }



                });

                //上传
                $("body").delegate("#lmvt-change-photo", "click", function () {


                    var SelectData = $com.table.getSelectionData($(".zace-type-body"), "ShowID", standardInfoData);

                    if (!SelectData || !SelectData.length) {
                        alert("请选择一行数据！")
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

                    var dataSource = SelectList[0];

                    NewdataSource = SelectList[0];


                    NewItemData = SelectData[0];


                    if (dataSource.IsUsed == 1) {
                        alert("该版本已经被使用")
                        return;
                    }

                    if (SelectData[0].ItemType == 4) {

                        return false;
                    } else {

                        $("#input-fileImage").val("");
                        $("#input-fileImage").click();
                    }

                });

                //上传组
                $("#input-fileImage").on("change", function () {
                    var self = this,
                        _data = self.files[0];

                    if (_data) {
                        if (_data.size > (1024 * 1024 * 10)) {
                            alert("请上传小于10M的图片！");
                            clearFiles();
                            return false;
                        }

                        if (!extLimit(['jpg', 'png', 'gif', 'bmp', 'jpeg']).has(_data.name)) {
                            alert("请上传正确的图片！");
                            clearFiles();
                            return false;
                        }

                        var form = new FormData();
                        form.append("file", _data);

                        $.ajax({ //
                            url: "/MESCore/api/Upload/Submit",
                            type: "POST",
                            data: form,
                            processData: false,
                            contentType: false,
                            dataType: "JSON"
                        }).done(function (data) {

                            if (data.resultCode === 1000) {



                                for (var i = 0; i < NewdataSource.ItemList.length; i++) {
                                    $com.util.deleteLowerProperty(NewdataSource.ItemList[i]);
                                }


                                // _data.Standard = model.com.CountStandard(_data, Number(rst.StandardType));

                                $.each(NewdataSource.ItemList, function (i, item) {
                                    if (item.ID == NewItemData.ID) {
                                        item.Legend = data.returnObject.file_url;


                                    }
                                });

                                delete NewdataSource.IsCurrentText;
                                delete NewdataSource.IsUsedText;

                                $com.util.deleteLowerProperty(NewdataSource);

                                model.com.postSaveStandard({
                                    data: NewdataSource,
                                }, function (res) {
                                    alert("上传成功！！");



                                    //model.com.StandardItem(GroupID);
                                    model.com.refreshStandardInfo(StandardID);
                                });

                            } else {
                                alert("上传失败，请重新再试");
                                clearFiles();
                            }

                        });
                    }

                    function clearFiles() {
                        self.value = "";
                    }

                    function extLimit(exts) {
                        return {
                            has: function (file) {
                                var arr = file.split("."),
                                    ext = arr[arr.length - 1].toLowerCase();

                                return exts.indexOf(ext) > -1 ? true : false;
                            }
                        };
                    }
                });

                //另存为
                $("body").delegate(".lmvt-version-copy", "click", function () {

                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var dataSource = partAllList.filter(item => item.ID == wDBID)[0];

                    var Defaul_Value = {
                        Remark: dataSource.Remark
                    };

                    $("body").append($com.modal.show(Defaul_Value_Standard, KETWROD_Standard, "版本", function (rst) {
                        if (!rst || $.isEmptyObject(rst)) {
                            return false;
                        }

                        dataSource.Remark = rst.Remark;

                        $com.util.deleteLowerProperty(dataSource);

                        model.com.postCopyStandard({
                            data: dataSource,
                        }, function (res) {
                            alert("复制成功！！");
                            model.com.refreshPartAll();
                        });


                    }, TypeSource_Standard));

                });

                //详情 单条
                $("body").delegate(".partPointStandard .lmvt-do-info", "click", function () {

                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectObj = partAllList.filter(item => item.ID == wDBID)[0];

                    $('.partAllStandard').show();
                    $('.partPointStandard').hide();

                    //获取抽样方案

                    model.com.getIPTSampleItemAll({
                        SampleID: SelectObj.SamplingID,
                    }, function (res) {

                        TypeSource_Item.SamplingPlan = [{
                            name: "无",
                            value: "无",
                        }];

                        var cat = {};
                        $.each(res.list, function (i, item) {

                            if (!cat[item.Name]) {
                                cat[item.Name] = item.Name;
                                TypeSource_Item.SamplingPlan.push({
                                    name: item.Name,
                                    value: item.Name
                                });
                                return true;
                            }
                        });

                        StandardID = SelectObj.ID;
                        mLineZace = SelectObj.LineID;

                        wGroupID = 0;

                        //版本信息
                        mdataObj = $com.util.Clone(SelectObj);
                        //var _Remark = SelectData[0].LineName + '-' + SelectData[0].ProductNo + '-' + SelectData[0].PartPointName

                        $('.zaceText').text(SelectObj.Remark + '-量具校正项点');
                        model.com.refreshStandardInfo(StandardID);
                    });


                });

                //详情
                $("body").delegate("#lmvt-set-currentDetail", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".zace-partAll-body"), "WID", partAllList);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据操作！")
                        return;
                    }
                    if (SelectData[0].ID == 0) {
                        alert('数据无版本！');
                        return false;

                    }


                    $('.partAllStandard').hide();
                    $('.partPointStandard').show();
                    StandardID = SelectData[0].ID;
                    mLineZace = SelectData[0].LineID;
                    GroupID = 0;

                    var _Remark = SelectData[0].LineName + '-' + SelectData[0].ProductNo + '-' + SelectData[0].PartPointName

                    $('.zaceText').text(_Remark + '-预检项点');
                    model.com.refreshStandardInfo(StandardID);
                });

                //lmvt-set-currentDetail

                $("body").delegate("#lmvt-standardtable-Close", "click", function () {

                    $('.partPointStandard').show();
                    $('.partAllStandard').hide();

                    // TreeObj.trigger('click');


                    $("#standardList").treeview('toggleNodeSelected', [NodeID, { silent: false }]);

                    lmvtType = 0;

                    //model.com.refreshPartAll();
                });

                $("body").delegate("#lmvt-standardtable-refresh", "click", function () {
                    GroupID = 0;
                    lmvtType = 0; model.com.refreshStandardInfo(StandardID);
                });

                //删除未使用版本 单条
                $("body").delegate(".partPointStandard .lmvt-allowed-delete", "click", function () {

                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectObj = partAllList.filter(item => item.ID == wDBID)[0];

                    if (!confirm("已选择版本 [" + SelectObj.Remark + "] ，确定删除？")) {
                        return;
                    }

                    model.com.postDeleteStandard({
                        data: SelectObj
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.refreshPartAll();
                    });
                });

                //删除未使用版本
                $("body").delegate("#lmvt-standard-delete", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".zace-partAll-body"), "WID", partAllList);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据操作！")
                        return;
                    }

                    if (SelectData[0].ID == 0) {
                        alert('该数据无版本!');
                        return false;
                    }
                    var dataSource = SelectData[0];




                    if (dataSource.IsUsed == 1) {
                        alert("当前版本已使用，无法删除");
                        return;
                    }

                    if (!confirm("已选择版本:" + dataSource.Remark + "，确定删除？")) {
                        return;
                    }

                    model.com.postDeleteStandard({
                        data: dataSource
                    }, function (res) {
                        alert("删除成功！！");
                        model.com.refreshPartAll();
                    });
                });

                //设为当前  单条
                $("body").delegate(".lmvt-do-active", "click", function () {

                    var $this = $(this),
                        wDBID = Number($this.closest("td").attr("data-value"));

                    var SelectObj = partAllList.filter(item => item.ID == wDBID)[0];

                    if (!confirm("是否将项点设置为当前？")) {
                        return;
                    }

                    delete SelectObj.IsCurrentText;
                    delete SelectObj.IsUsedText;

                    SelectObj.IsCurrent = 1;

                    model.com.postStandardStatus({
                        data: SelectObj,
                        IsEnd: 0,
                        IsCurrent: 1
                    }, function (res) {
                        alert("设置成功");
                        model.com.refreshPartAll();
                        // $('#lmvt-standardtable-Close').click();
                    });
                });
                //设为当前
                $("body").delegate("#lmvt-set-currentNew", "click", function () {

                    // var SelectData = $com.table.getSelectionData($(".zace-partAll-body"), "WID", partAllList);

                    // if (!SelectData || !SelectData.length) {
                    //     alert("请先选择一行数据再试！")
                    //     return;
                    // }
                    // if (SelectData.length != 1) {
                    //     alert("只能同时对一行数据操作！")
                    //     return;
                    // }
                    // var dataSource = SelectData[0];

                    // if (SelectData[0].ID == 0) {
                    //     alert('该数据无版本!');
                    //     return false;
                    // }
                    if (!confirm("是否将项点设置为当前？")) {
                        return;
                    }

                    delete mdataObj.IsCurrentText;
                    delete mdataObj.IsUsedText;

                    mdataObj.IsCurrent = 1;

                    model.com.postStandardStatus({
                        data: mdataObj,
                        IsEnd: 0,
                        IsCurrent: 1
                    }, function (res) {
                        alert("设置成功");
                        model.com.refreshPartAll();
                        $('#lmvt-standardtable-Close').click();

                    });
                });

                //设为当前
                $("body").delegate("#lmvt-set-current", "click", function () {

                    var SelectData = $com.table.getSelectionData($(".zace-partAll-body"), "WID", partAllList);

                    if (!SelectData || !SelectData.length) {
                        alert("请先选择一行数据再试！")
                        return;
                    }
                    if (SelectData.length != 1) {
                        alert("只能同时对一行数据操作！")
                        return;
                    }
                    var dataSource = SelectData[0];

                    if (SelectData[0].ID == 0) {
                        alert('该数据无版本!');
                        return false;
                    }

                    delete dataSource.IsCurrentText;
                    delete dataSource.IsUsedText;

                    dataSource.IsCurrent = 1;

                    model.com.postStandardStatus({
                        data: dataSource,
                        IsEnd: 0,
                        IsCurrent: 1
                    }, function (res) {
                        alert("设置成功");
                        model.com.refreshPartAll();
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


                    // if (zaceType == 1) {
                    //     model.com.renderTree(zaceProduct);
                    // } else {
                    //     $.each(partSource, function (i, item) {
                    //         if (item.UnitID == lSelectID) {
                    //             model.com.renderTree(item.UnitList);
                    //         }
                    //     });
                    // }

                });
                //监听select事件
                $("body").delegate("#lmvt-select-product", "change", function () {
                    var $this = $(this);
                    pSelectID = $this.find("option:selected").text();
                    pSelectIDPro = $this.find("option:selected").attr("value");
                    model.com.RanderSelect(wSelectID);
                    // if (zaceType == 1) {
                    //     model.com.renderTree(zaceProduct);
                    // } else {
                    //     $.each(partSource, function (i, item) {
                    //         if (item.UnitID == lSelectID) {
                    //             model.com.renderTree(item.UnitList);
                    //         }
                    //     });
                    // }
                });
                //监听select事件
                $("body").delegate("#lmvt-select-IPTMode", "change", function () {
                    var $this = $(this);
                    iSelectID = Number($this.find("option:selected").attr("value"));

                    // if (iSelectID != 5)
                    //     if (zaceType == 1) {
                    //         model.com.renderTree(zaceProduct);
                    //     } else {
                    //         $.each(partSource, function (i, item) {
                    //             if (item.UnitID == lSelectID) {
                    //                 model.com.renderTree(item.UnitList);
                    //             }
                    //         });
                    //     }
                    // else {

                    //     model.com.renderTree(MaterialList);
                    // }

                });

                $("body").delegate("#lmvt-standardtable-searchSubmit", "click", function () {
                    var $this = $(this);

                    model.com.refreshPartAll();

                });
                $("body").delegate("#lmvt-set-currentDetailRefresh", "click", function () {
                    var $this = $(this);
                    model.com.refreshPartAll();
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

                    model.com.refreshStandard();
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
                $("body").delegate("#standardItem li div:not(.hitarea)", "click", function () {

                    var $this = $(this);

                    standardItemTreeObj = $this;

                    //ZaceLineID = Number($this.attr("data-line"));
                    lmvtType = Number($this.attr("data-type"));

                    GroupID = Number($this.attr("data-value"));
                    ZaceLineID = 0;

                    //alert(StandardID);
                    var _list = [];

                    $("#standardItem div").css("background-color", "white");
                    //$this.css("background-color", "black");
                    $this.css("background-color", "cornflowerblue");
                    ChangeData = 0;
                    model.com.StandardItem(GroupID);
                });

                //树的点击事件 版本  版本
                $("body").delegate("#standardList li div:not(.hitarea)", "click", function () {

                    var $this = $(this);

                    //ZaceLineID = Number($this.attr("data-line"));
                    // var ZaType = Number($this.attr("data-type"));

                    // if (ZaType != 4) {
                    //     return false;
                    // }
                    wGroupID = Number($this.attr("data-value"));

                    ZaceLineID = 0;

                    TreeObj = $this;

                    model.com.refreshPartAll();

                    //alert(StandardID);
                    var _list = [];
                    $("#standardList div").css("background-color", "white");
                    //$this.css("background-color", "black");
                    $this.css("background-color", "cornflowerblue");
                    model.com.refreshStandard();
                    ChangeData = 0;
                    //model.com.StandardItem(GroupID);
                });

            },
            run: function () {

                //设备维修
                IPTMode = 20;
                wGroupID = 0;

                var SelectedNode = 0;

                model.com.getDeviceWorkTypeAll({
                    Type: 3,
                    Active: -1,
                    DSType: 1,
                }, function (res) {

                    if (!res)
                        return;

                    var WorkTypeList = res.list;

                    model.com.getDeviceModelAll({
                        Type: 3,
                        Active: -1
                    }, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];

                        var TreeList = [];

                        DeviceInfoAllList = $com.util.Clone(res.list);

                        $.each(WorkTypeList, function (i, item) {
                            item.nodes = [];

                            $.each(res.list, function (j, jtem) {


                                if (jtem.WorkType == item.ID) {
                                    item.nodes.push({
                                        text: jtem.ModelNo + "(" + jtem.ModelName + ")",
                                        Type: "Product",
                                        ID: jtem.ID,
                                        ISModel: false,
                                        ModelID: item.ID
                                    })
                                }

                            });

                            TreeList.push({
                                nodes: item.nodes,
                                text: item.Code + "(" + item.Name + ")",
                                tags: [item.nodes.length],
                                ID: item.ID,
                                Type: "Type",
                                ISModel: true,
                            })

                        });

                        $("#standardList").treeview({
                            // color: "#428bca",

                            // expandIcon: "glyphicon glyphicon-stop",
                            // collapseIcon: "glyphicon glyphicon-unchecked",
                            color: "black",
                            expandIcon: "glyphicon glyphicon-plus",
                            collapseIcon: "glyphicon glyphicon-minus",

                            preventUnselect: true,

                            levels: 0,

                            nodeIcon: "glyphicon glyphicon-tags",

                            showTags: true,
                            data: TreeList,

                            onNodeSelected: function (event, data) {

                                NodeID = data.nodeId;
                                SelectedNode = data.nodeId;
                                var sels = $('#standardList').treeview('getSelected');
                                for (var i = 0; i < sels.length; i++) {
                                    if (sels[i].nodeId == data.nodeId) {
                                        continue;
                                    }
                                    $('#standardList').treeview('unselectNode', [sels[i].nodeId, { silent: true }]);
                                }
                                $("#standardList").treeview('selectNode', [data.nodeId, { silent: true }]);

                                if (!data.ISModel) {
                                    wModelID = data.ID;
                                    wGroupID = data.ModelID;
                                } else {
                                    wModelID = 0;
                                    wGroupID = data.ID;
                                }

                                ZaceLineID = 0;

                                ChangeData = 0;

                                model.com.refreshPartAll();

                                model.com.refreshStandard();

                            },
                            onNodeUnselected: function (event, data) {

                                if (SelectedNode != data.nodeId)
                                    return false;

                                $('#standardList').treeview('toggleNodeSelected', [SelectedNode, { silent: true }]);
                            }

                            // TypeSource_Level_Order.ModelID = [];
                            // _this.OrderGrade = $com.util.Clone(res.list);

                        });
                        if (NodeID != -1)
                            $('#standardList').treeview('toggleNodeSelected', [_this.NodeID, { silent: false }]);
                        // _this.MeasuringTypeList = res.list;
                        $com.app.loaded();
                    });

                    // $.each(res.list, function (i, item) {

                    //     item.WID = i + 1;
                    //     item.Badge = " ";

                    //     for (var p in item) {

                    //         if (!FORMATTRT_Level[p])
                    //             continue;
                    //         item[p] = FORMATTRT_Level[p](item[p]);
                    //     }
                    // });
                    // model.com.getDeviceModelAll({ Active: -1, Type: 3 }, function (res) {

                    //     GruopAllTree = res.list;

                    //     model.com.getDeviceLedgerAll({ ModelID: 0, WorkShopID: 0, LineID: 0, BusinessUnitID: 0, BaseID: 0, FactoryID: 0, Active: -1, Type: 3 }, function (resD) {
                    //         var AllDeviceLedger = resD.list;

                    //         $.each(GruopAllTree, function (i, item) {

                    //             item.text = item.ModelNo;
                    //             item.nodes = [];

                    //             item.ISModel = true;

                    //             $.each(AllDeviceLedger, function (j, jtem) {
                    //                 if (jtem.ModelID == item.ID) {

                    //                     jtem.ISModel = false;

                    //                     jtem.text = jtem.Name;
                    //                     jtem.nodes = [];
                    //                     jtem.tags = [0];
                    //                     item.nodes.push(jtem);
                    //                 }
                    //             });

                    //             var Counts = item.nodes.length;
                    //             item.tags = [Counts];
                    //         });

                    //         $("#standardList").treeview({
                    //             // color: "#428bca",

                    //             // expandIcon: "glyphicon glyphicon-stop",
                    //             // collapseIcon: "glyphicon glyphicon-unchecked",
                    //             color: "black",
                    //             expandIcon: "glyphicon glyphicon-plus",
                    //             collapseIcon: "glyphicon glyphicon-minus",

                    //             preventUnselect: true,

                    //             levels: 0,

                    //             nodeIcon: "glyphicon glyphicon-tags",

                    //             showTags: true,
                    //             data: GruopAllTree,

                    //             onNodeSelected: function (event, data) {

                    //                 NodeID = data.nodeId;
                    //                 SelectedNode = data.nodeId;
                    //                 var sels = $('#standardList').treeview('getSelected');
                    //                 for (var i = 0; i < sels.length; i++) {
                    //                     if (sels[i].nodeId == data.nodeId) {
                    //                         continue;
                    //                     }
                    //                     $('#standardList').treeview('unselectNode', [sels[i].nodeId, { silent: true }]);
                    //                 }
                    //                 $("#standardList").treeview('selectNode', [data.nodeId, { silent: true }]);

                    //                 if (!data.ISModel) {
                    //                     wModelID = data.ID;
                    //                     wGroupID = data.ModelID;
                    //                 } else {
                    //                     wModelID = 0;
                    //                     wGroupID = data.ID;
                    //                 }

                    //                 ZaceLineID = 0;

                    //                 ChangeData = 0;

                    //                 model.com.refreshPartAll();

                    //                 model.com.refreshStandard();

                    //             },
                    //             onNodeUnselected: function (event, data) {

                    //                 if (SelectedNode != data.nodeId)
                    //                     return false;

                    //                 $('#standardList').treeview('toggleNodeSelected', [SelectedNode, { silent: true }]);
                    //             }

                    //         });
                    //     });

                    // });

                });
                model.com.getSolutionAll({}, function (res) {
                    $.each(res.list, function (i, item) {

                        TypeSource_Standard.SamplingID.push({
                            name: item.Name,
                            value: item.ID
                        })
                    });
                });

                model.com.getUnit({}, function (resPrice) {
                    $.each(resPrice.list, function (i, item) {
                        TypeSource_Item.UnitID.push({
                            name: item.Name,
                            value: item.ID,
                        });
                    });
                });
            },
            com: {
                //量具类型列表
                getDeviceWorkTypeAll: function (data, fn, context) {
                    var d = {
                        $URI: "/DeviceWorkType/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                BootstrapTreeBuild: function (list) {

                    if (list.length > 0)
                        $.each(list, function (i, item) {
                            if (item.SonList.length > 0) {
                                var Counts = item.SonList.length;
                                item.text = item.Code + "(" + item.Name + ")";
                                item.nodes = item.SonList;
                                item.tags = [Counts];
                                model.com.BootstrapTreeBuild(item.SonList);
                            } else {
                                item.text = item.Code + "(" + item.Name + ")";
                                item.nodes = [];
                                item.tags = [0];
                            }
                        });

                    return list;
                },

                //版本复制
                postCopyStandard: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/CopyStandard",
                        $TYPE: "post",
                        $SERVER: '/MESQMS',

                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                getIPTSampleItemAll: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTSample/ItemAll",
                        $TYPE: "get",
                        $SERVER: "/MESQMS"
                    };
                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getSolutionAll: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTSample/SolutionAll",
                        $TYPE: "get",
                        $SERVER: "/MESQMS"
                    };
                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }
                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                fullItems: function (list) {

                    $.each(list, function (i, item) {



                        model.com.fullItems(item.SonList);

                        item.Items = $com.util.template(item.SonList, HTML.TreeItemNode);
                    });
                },
                buildTree: function (list) {
                    var temp = {};
                    var tree = {};
                    var cat = [];
                    for (var i in list) {
                        temp[list[i].ID] = list[i];
                    }
                    for (var i in temp) {
                        if (!temp[i].SonList) {
                            temp[i].SonList = [];
                        }

                        if (temp[i].PrevID && temp[i].PrevID != 0) {
                            //if (!temp[temp[i].ParentID].children) {
                            //    temp[temp[i].ParentID].children = [];
                            //}
                            if (!temp[temp[i].PrevID].SonList) {
                                temp[temp[i].PrevID].SonList = [];
                            }
                            temp[temp[i].PrevID].SonList.push(temp[i]);

                            // temp[i].text = temp[i].Name;
                            // temp[i].nodes = temp[i].SonList;
                            // temp[i].tags = [Counts];

                            // var Counts = temp[temp[i].PrevID].SonList.length;
                            // temp[temp[i].PrevID].text = temp[temp[i].PrevID].Name;
                            // temp[temp[i].PrevID].nodes = temp[temp[i].PrevID].SonList;
                            // temp[temp[i].PrevID].tags = [Counts];


                        } else {
                            if (!temp[i].SonList) {
                                temp[i].SonList = [];
                            }

                            // var Counts = temp[i].SonList.length;
                            // temp[i].text = temp[i].Name;
                            // temp[i].nodes = temp[i].SonList;
                            // temp[i].tags = [Counts];

                            tree[temp[i].ID] = temp[i];
                        }
                    }
                    $.each(tree, function (i, item) {
                        cat.push(item);
                    });

                    return cat;
                },
                buildTreeNode: function (list) {
                    var temp = {};
                    var tree = {};
                    var cat = [];
                    for (var i in list) {
                        temp[list[i].ID] = list[i];
                    }
                    for (var i in temp) {
                        if (!temp[i].nodes) {
                            temp[i].nodes = [];
                        }

                        if (temp[i].PrevID && temp[i].PrevID != 0) {
                            //if (!temp[temp[i].ParentID].children) {
                            //    temp[temp[i].ParentID].children = [];
                            //}
                            if (!temp[temp[i].PrevID].nodes) {
                                temp[temp[i].PrevID].nodes = [];
                            }

                            temp[i].text = temp[i].Name;
                            temp[i].nodes = [];
                            temp[i].tags = [0];

                            temp[temp[i].PrevID].nodes.push(temp[i]);

                            var Counts = temp[temp[i].PrevID].SonList.length;
                            temp[temp[i].PrevID].text = temp[temp[i].PrevID].Name;
                            temp[temp[i].PrevID].nodes = temp[temp[i].PrevID].nodes;
                            temp[temp[i].PrevID].tags = [Counts];


                        } else {
                            if (!temp[i].nodes) {
                                temp[i].nodes = [];
                            }



                            var Counts = temp[i].nodes.length;
                            temp[i].text = temp[i].Name;
                            temp[i].tags = [Counts];

                            tree[temp[i].ID] = temp[i];
                        }
                    }
                    $.each(tree, function (i, item) {
                        cat.push(item);
                    });

                    return cat;
                },
                //查询台账
                getDeviceLedgerAll: function (data, fn, context) {
                    var d = {
                        $URI: "/DeviceLedger/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //查询设备型号
                getDeviceModelAll: function (data, fn, context) {
                    var d = {
                        $URI: "/DeviceModel/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //查询部件清单
                getConfigAll: function (data, fn, context) {
                    var d = {
                        $URI: "/MSSPart/ConfigAll",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                RanderVersionList: function () {


                },

                refreshPartAll: function () {
                    model.com.getStandardAll({ IPTMode: IPTMode, BusinessUnitID: -1, BaseID: -1, FactoryID: -1, 
                        WorkShopID: -1, LineID: wGroupID, PartID: -1, PartPointID: -1, StationID: -1, ProductID: wModelID }, function (res) {

                        partAllList = [];

                        $.each(res.list,function(i,item){
                            if(item.ProductID!=wModelID){
                                return true; 
                            }
                            partAllList.push(item);
                        });

                        

                        partAllSearch = $com.util.Clone(partAllList);

                        $.each(partAllSearch, function (i, item) {


                            item.WID = i + 1;

                            item.Badge = " ";

                            if (item.IsCurrent == 1 && item.IsUsed == 1) {
                                item.IsUsedBadge = "lmvt-activeBadge";
                                item.UserIDBadge = "lmvt-activeBadge";
                                item.ISNow = "lmvt-not-allowed-delete";
                                item.ISAllowed = "lmvt-not-allowed-delete";
                            }
                            else if (item.IsUsed == 1) {
                                item.IsUsedBadge = "lmvt-defBadge";
                                item.UserIDBadge = "lmvt-activeBadge";
                                item.ISNow = "lmvt-do-active";
                                item.ISAllowed = "lmvt-not-allowed-delete";
                            }
                            else {
                                item.IsUsedBadge = "lmvt-defBadge";
                                item.UserIDBadge = "lmvt-defBadge";
                                item.ISNow = "lmvt-do-active";
                                item.ISAllowed = "lmvt-allowed-delete";
                            }

                            for (var p in item) {
                                if (!Formattrt_Item[p])
                                    continue;
                                item[p] = Formattrt_Item[p](item[p]);

                                if (item.ID == 0 || item.Remark.length < 1) {
                                    item.Remark = '-';
                                }
                            }

                        });
                        $(".zace-partAll-body").html($com.util.template(partAllSearch, HTML.PartStandardList));

                    });
                },
                postCreateTest: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTPreCheckReport/Create",
                        $TYPE: "post",
                        $SERVER: '/MESQMS',
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
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
                setItemOrder: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/SetItemOrder",
                        $TYPE: "post",
                        $SERVER: '/MESQMS',
                    };

                    function err() {

                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                setPartCoding: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/SetPartCoding",
                        $TYPE: "post",
                        $SERVER: '/MESQMS',
                    };

                    function err() {

                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                setQuality: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/IsQuality",
                        $TYPE: "post",
                        $SERVER: '/MESQMS',
                    };

                    function err() {

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
                    model.com.getFMCLineUnit({ LineID: wID, ID: 0, ProductID: pSelectIDPro }, function (res) {
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
                            if (list[m].Type == 2 && list[m].LevelID == 2) {
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

                        // if (iSelectID != 5) {

                        //     if (zaceType == 1) {
                        //         model.com.renderTree(zaceProduct);
                        //     } else {
                        //         $.each(partSource, function (i, item) {
                        //             if (item.UnitID == lSelectID) {
                        //                 model.com.renderTree(item.UnitList);
                        //             }
                        //         });
                        //     }


                        //     model.com.refresh();
                        // }
                        // else {
                        //     model.com.renderTree(MaterialList);
                        // }

                        model.com.refreshPartAll();
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

                getStandardPartList: function (data, fn, context) {
                    var d = {
                        $URI: "/IPTStandard/StepVersionAll",
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

                refreshStandardInfo: function (mID) {
                    model.com.getStandardInfo({
                        ID: mID
                    }, function (res) {
                        if (!res)
                            return;
                        res.list = [];
                        res.list.push(res.info);
                        var _list = $com.util.Clone(res.info.ItemList);
                        var _listItem = $com.util.Clone(res.list);
                        zaceStandardList = $com.util.Clone(res.info.ItemList);;  //项点数据

                        SelectList = $com.util.Clone(res.list);//版本

                        //版本信息
                        mdataObj = $com.util.Clone(res.info);

                        _list = model.com.buildTreePro(_list);//分组

                        _list.sort(function (a, b) { return Number(a.ID) - Number(b.ID) });

                        model.com.renderTreeStandard(_list);

                        model.com.StandardItem(wGroupID);
                    });
                },

                refreshStandard: function () {

                    ChangeData = 0;
                    model.com.getStandardList({
                        LineID: wGroupID,
                        PartID: 0,
                        PartPointID: 0,
                        ProductID: wModelID
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

                StandardTreeBuild: function (list) {

                    if (list.length > 0)
                        $.each(list, function (i, item) {
                            if (item.ItemIPTList.length > 0) {
                                var Counts = item.ItemIPTList.length;
                                item.text = item.Text;
                                item.nodes = item.ItemIPTList;
                                item.tags = [Counts];
                                model.com.StandardTreeBuild(item.ItemIPTList);
                            } else {
                                item.text = item.Text;
                                // item.nodes = [];
                                // item.tags = [0];
                            }
                        });

                    return list;
                },

                renderTreeStandard: function (list) {
                    //list  ： Type List

                    list = model.com.StandardTreeBuild(list);

                    var ItemNode = 0;

                    $("#standardItem").treeview({

                        color: "black",
                        expandIcon: "glyphicon glyphicon-plus",
                        collapseIcon: "glyphicon glyphicon-minus",

                        preventUnselect: true,

                        levels: 0,

                        nodeIcon: "glyphicon glyphicon-tags",

                        showTags: true,
                        data: list,

                        onNodeSelected: function (event, data) {

                            StandardNodeID = data.nodeId;
                            ItemNode = data.nodeId;
                            var sels = $('#standardItem').treeview('getSelected');
                            for (var i = 0; i < sels.length; i++) {
                                if (sels[i].nodeId == data.nodeId) {
                                    continue;
                                }
                                $('#standardItem').treeview('unselectNode', [sels[i].nodeId, { silent: true }]);
                            }
                            $("#standardItem").treeview('selectNode', [data.nodeId, { silent: true }]);

                            // var $this = $(this);

                            // standardItemTreeObj = $this;

                            //ZaceLineID = Number($this.attr("data-line"));
                            lmvtType = data.ItemType;

                            GroupID = data.ID;
                            ZaceLineID = 0;
                            ChangeData = 0;
                            model.com.StandardItem(GroupID);

                        },
                        onNodeUnselected: function (event, data) {

                            if (ItemNode != data.nodeId)
                                return false;

                            $('#standardItem').treeview('toggleNodeSelected', [ItemNode, { silent: true }]);
                        }

                    });

                    // model.com.fullItemsStandard(list);

                    // $("#standardItem").html($com.util.template(list, HTML.TreeStandardItemNode));
                    // $("#standardItem").treeview({ collapsed: false });

                    // if (GroupID != 0)
                    //     $("#standardItem li div:not(.hitarea)").each(function (i, item) {
                    //         var $item = $(item);
                    //         if (Number($item.attr("data-value")) == GroupID) {
                    //             $item.trigger('click');
                    //             return false;
                    //         }
                    //     });
                    // else {
                    //     model.com.StandardItem(0);
                    // }
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
                    //     case 2: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + StandardObject.StandardRight + "＜" + " n " + "＜" + StandardObject.StandardLeft; break;
                    //     case 3: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + StandardObject.StandardRight + "≤" + " n " + "≤" + StandardObject.StandardLeft; break;
                    //     case 4: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + StandardObject.StandardRight + "＜" + " n " + "≤" + StandardObject.StandardLeft; break;
                    //     case 5: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + StandardObject.StandardRight + "≤" + " n " + "＜" + StandardObject.StandardLeft; break;
                    //     case 6: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + " n " + "＜" + StandardObject.StandardLeft; break;
                    //     case 7: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + " n " + "＞" + StandardObject.StandardRight; break;
                    //     case 8: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + " n " + "≤" + StandardObject.StandardLeft; break;
                    //     case 9: standardString = "基准值：" + StandardObject.StandardBaisc + "范围：" + " n " + "≥" + StandardObject.StandardRight; break;
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
                        case 2: standardString = "范围：" + StandardObject.StandardRight + "＜" + " n " + "＜" + StandardObject.StandardLeft; break;
                        case 3: standardString = "范围：" + StandardObject.StandardRight + "≤" + " n " + "≤" + StandardObject.StandardLeft; break;
                        case 4: standardString = "范围：" + StandardObject.StandardRight + "＜" + " n " + "≤" + StandardObject.StandardLeft; break;
                        case 5: standardString = "范围：" + StandardObject.StandardRight + "≤" + " n " + "＜" + StandardObject.StandardLeft; break;
                        case 6: standardString = "范围：" + " n " + "＜" + StandardObject.StandardLeft; break;
                        case 7: standardString = "范围：" + " n " + "＞" + StandardObject.StandardRight; break;
                        case 8: standardString = "范围：" + " n " + "≤" + StandardObject.StandardLeft; break;
                        case 9: standardString = "范围：" + " n " + "≥" + StandardObject.StandardRight; break;
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

                    ChangeData = 0;
                    GroupID = wID;
                    var _list = [];
                    mZaceStandard = 0;

                    if (zaceStandardList.length == 0) {
                        mZaceStandard = wID;
                        ChangeData = wID;
                    }

                    if (wID == 0) {
                        for (var m = 0; m < zaceStandardList.length; m++) {
                            if (wID == zaceStandardList[m].GroupID) {
                                zaceStandardList[m].PathList = zaceStandardList[m].Legend.split(";");
                                ImagePathArray = [];
                                for (var k = 0; k < zaceStandardList[m].PathList.length; k++) {
                                    SrcListObj = {
                                        ID: k + 1,
                                        SrcList: zaceStandardList[m].PathList[k]
                                    }
                                    if (SrcListObj.SrcList != "") {
                                        ImagePathArray.push(SrcListObj);
                                    }
                                }
                                if (ImagePathArray.length > 0) {
                                    zaceStandardList[m].LendImages = $com.util.template(ImagePathArray, HTML.IMGLIST);
                                } else {
                                    zaceStandardList[m].LendImages = "";
                                }
                                _list.push(zaceStandardList[m]);
                            }
                        }
                    } else {

                        var ISItem = zaceStandardList.filter((item) => { return item.ID == wID })[0];

                        if (ISItem.ItemType == 2) {
                            ISItem.PathList = ISItem.Legend.split(";");
                            ImagePathArray = [];
                            for (var k = 0; k < ISItem.PathList.length; k++) {
                                SrcListObj = {
                                    ID: k + 1,
                                    SrcList: ISItem.PathList[k]
                                }
                                if (SrcListObj.SrcList != "") {
                                    ImagePathArray.push(SrcListObj);
                                }
                            }
                            if (ImagePathArray.length > 0) {
                                ISItem.LendImages = $com.util.template(ImagePathArray, HTML.IMGLIST);
                            } else {
                                ISItem.LendImages = "";
                            }
                            _list.push(ISItem);
                        } else {
                            for (var m = 0; m < zaceStandardList.length; m++) {
                                if (wID == zaceStandardList[m].GroupID) {
                                    zaceStandardList[m].PathList = zaceStandardList[m].Legend.split(";");
                                    ImagePathArray = [];
                                    for (var k = 0; k < zaceStandardList[m].PathList.length; k++) {
                                        SrcListObj = {
                                            ID: k + 1,
                                            SrcList: zaceStandardList[m].PathList[k]
                                        }
                                        if (SrcListObj.SrcList != "") {
                                            ImagePathArray.push(SrcListObj);
                                        }
                                    }
                                    if (ImagePathArray.length > 0) {
                                        zaceStandardList[m].LendImages = $com.util.template(ImagePathArray, HTML.IMGLIST);
                                    } else {
                                        zaceStandardList[m].LendImages = "";
                                    }
                                    _list.push(zaceStandardList[m]);
                                }
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

                        if (mdataObj.IsUsed == 1) {
                            item.ISReset = "lmvt-not-allowed-delete";
                            item.ISAllowed = "lmvt-not-allowed-delete";
                            item.ISUpload = "lmvt-not-allowed-delete";
                        } else {
                            item.ISReset = "lmvt-do-info";
                            item.ISAllowed = "lmvt-allowed-delete";
                            item.ISUpload = "lmvt-pic-upload";
                        }


                        item.ShowID = i + 1;

                        item.OptionsItem = item.ValueSource.join("||");

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