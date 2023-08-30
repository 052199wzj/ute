require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($lin, $com) {

        var HTML,
            PartList_Basic_Son,
            DEFAULT_VALUE_Arrange,
            KETWROD_LIST_Arrange,
            KETWROD_Template_Arrange,
            Formattrt_Arrange,
            TypeSource_Arrange,


            KEYWORD_user,
            KEYWORD_LIST_user,
            DEFAULT_VALUE_user,
            TypeSource_user,
            DataAll_user,
            FORMATTRT_user,
            mGroupID,
            mValue,
            WorkLinePartList,
            DataAll_group,
            KEYWORD_group,
            DEFAULT_VALUE_group,
            TypeSource_group,
            FORMATTRT_group,

            mID,
            mZaceValue,
            mName,
            res_Position_Basic1001,
            res_Position_Basic8001,
            res_Position_Basic5001,
            res_Position_Basic5002,
            res_Position_Basic6001,
            res_Position_Basic7001,
            res_Position_Basic4001,
            res_Position_Basic7002,
            res_Position_Basic7004,
            HeadersPosition;

        HeadersPosition = {
            "8001": "操作员",
            "1001": "生产员",
            "5001": "巡检员",
            "5002": "入库检验员",
            "6001": "工艺员",
            "7001": "配料员",
            //"2001": "电修工",
            //"3001": "机修工",
            "4001": "计量算",
            "7002": "收料员",
            "7004": "辅料员",
        };

        mValue = 0;
        mGroupID = 1;
        HTML = {
            ArrangeList: [
                '<tr>',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                //'<td style="min-width: 50px" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                '<td  style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}" >{{ WorkShopID}}</td>',
                '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}" >{{ LineID}}</td>',
                '<td style="min-width: 50px" data-title="PartID" data-value="{{PartID}}" >{{ PartID}}</td>',
                '<td style="min-width: 50px" data-title="PartPointID" data-value="{{PartPointID}}" >{{ PartPointID}}</td>',
                '<td class="Duty8001" style="min-width: 50px" data-title="MemberName8001" data-value="{{MemberName8001}}" >{{ MemberName8001}}</td>',
                '<td class="Duty1001" style="min-width: 50px " data-title="MemberName1001" data-value="{{MemberName1001}}" >{{ MemberName1001}}</td>',
                '<td class="Duty5001" style="min-width: 50px" data-title="MemberName5001" data-value="{{MemberName5001}}" >{{ MemberName5001}}</td>',
                '<td class="Duty5002" style="min-width: 50px" data-title="MemberName5002" data-value="{{MemberName5002}}" >{{ MemberName5002}}</td>',
                '<td class="Duty6001" style="min-width: 50px" data-title="MemberName6001" data-value="{{MemberName6001}}" >{{ MemberName6001}}</td>',
                '<td class="Duty7001" style="min-width: 50px" data-title="MemberName7001" data-value="{{MemberName7001}}" >{{ MemberName7001}}</td>',
                '<td class="Duty4001" style="min-width: 50px" data-title="MemberName4001" data-value="{{MemberName4001}}" >{{ MemberName4001}}</td>',
                '<td class="Duty7002" style="min-width: 50px" data-title="MemberName7002" data-value="{{MemberName7002}}" >{{ MemberName7002}}</td>',
                '<td class="Duty7004" style="min-width: 50px" data-title="MemberName7004" data-value="{{MemberName7004}}" >{{ MemberName7004 }}</td>',
                '<tr>',
            ].join(""),

            TableUserItemNode: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
                '<td data-title="DepartmentID" data-value="{{DepartmentID}}" >{{DepartmentID}}</td>',
                '<td data-title="Position" data-value="{{Position}}" >{{Position}}</td>',
                '<td data-title="DutyID" data-value="{{DutyID}}" >{{DutyID}}</td>',
                '</tr>',
            ].join(""),
            TableGroupNode: [
                '<tr>',
                '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="GroupID" data-value="{{GroupID}}" >{{GroupID}}</td>',
                '<td data-title="GroupName" data-value="{{GroupName}}" >{{GroupName}}</td>',
                '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
                '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
                '</tr>',
            ].join(""),
        };

        //排版模板
        $(function () {
            KETWROD_LIST_Arrange = [
                "WorkShopID|车间|ArrayOneControl",
                "LineID|产线|ArrayOneControl|WorkShopID",
                "PartID|工序段|ArrayOne",
                "PartPointID|工序|ArrayOne",
            ];
            KETWROD_Template_Arrange = {};

            Formattrt_Arrange = {};

            TypeSource_Arrange = {
                WorkShopID: [{
                    name: "磨加工车间",
                    value: 1,
                },
                ],
                LineID: [{
                    name: "全部",
                    value: 0,
                    far: 0,
                },
                ],
                PartID: [{
                    name: "无",
                    value: 0,
                    far: undefined,
                },

                ],
                PartPointID: [{
                    name: "全部",
                    value: 0,
                    far: 0,
                },
                ],
            };

            $.each(KETWROD_LIST_Arrange, function (i, item) {
                var detail = item.split("|");
                KETWROD_Template_Arrange[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined,
                };

                if (detail.length > 2) {
                    Formattrt_Arrange[detail[0]] = $com.util.getFormatter(TypeSource_Arrange, detail[0], detail[2]);
                }
            });
        });


        //员工表
        $(function () {

            KEYWORD_LIST_user = [
                "Name|姓名",
                "DepartmentID|部门|ArrayOneControl",
                "Position|岗位|ArrayOneControl|DepartmentID",
                "DutyID|部门|ArrayOne",

            ];

            DataAll_user = [];
            FORMATTRT_user = {};
            KEYWORD_user = {};

            TypeSource_user = {

                DepartmentID: [{
                    name: "无",
                    value: 0,
                }],
                Position: [{
                    name: "无",
                    value: 0,
                    far: 0,
                }],
                DutyID: [{
                    name: "全部",
                    value: 0,
                }, {
                    name: "生产员",
                    value: 1001,
                }, {
                    name: "电修工",
                    value: 2001,
                }, {
                    name: "机修工",
                    value: 3001,
                }, {
                    name: "计量员",
                    value: 4001,
                }, {
                    name: "巡检员",
                    value: 5001,
                }, {
                    name: "入库检验员",
                    value: 5002,
                }, {
                    name: "工艺员",
                    value: 6001,
                }, {
                    name: "配料员",
                    value: 7001,
                }, {
                    name: "收料员",
                    value: 7002,
                }, {
                    name: "辅料员",
                    value: 7004,
                }, {
                    name: "操作员",
                    value: 8001,
                }, {
                    name: "管理",
                    value: 10001,
                }],
            };

            $.each(KEYWORD_LIST_user, function (i, item) {
                var detail = item.split("|");
                KEYWORD_user[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined,
                };
                if (detail.length > 2) {
                    FORMATTRT_user[detail[0]] = $com.util.getFormatter(TypeSource_user, detail[0], detail[2]);
                }
            });
        });

        //模板列表
        $(function () {

            KEYWORD_LIST_group = [
                "GroupID|组编号",
                "GroupName|组名称",
                "Creator|创建人",
                "CreateTime|修改时间|Date",

            ];
            DataAll_group = [];
            KEYWORD_group = {};
            FORMATTRT_group = {};
            DEFAULT_VALUE_group = {
                GroupName: "",
            };
            TypeSource_group = {};

            $.each(KEYWORD_LIST_group, function (i, item) {
                var detail = item.split("|");
                KEYWORD_group[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined,
                };
                if (detail.length > 2) {
                    FORMATTRT_group[detail[0]] = $com.util.getFormatter(TypeSource_group, detail[0], detail[2]);
                }
            });

        });


        model = $com.Model.create({
            name: '排班管理',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {
                //人员修改
                $("body").delegate("#femi-user-tbody tr", "dblclick", function () {
                    var $this = $(this);
                    var WID = $this.find('td[data-title=ID]').attr('data-value');
                    var WName = $this.find('td[data-title=Name]').attr('data-value');

                    switch (mZaceValue) {
                        case 8001:
                            res_Position_Basic8001[mID - 1].MemberID = WID;
                            res_Position_Basic8001[mID - 1].MemberName = WName;

                            var res_Position1 = [];
                            res_Position1.push(res_Position_Basic8001[mID - 1]);

                            model.com.postSchedulePosition({
                                Module: 8001,
                                data: res_Position1,
                            }, function (res) {
                                //alert("将操作员 " + mName + " 修改为 " + WName);
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                $(".zace-mode").hide();
                                model.com.refresh();
                            });
                            break;
                        case 1001:
                            res_Position_Basic1001[mID - 1].MemberID = WID;
                            res_Position_Basic1001[mID - 1].MemberName = WName;

                            var res_Position21 = [];
                            res_Position21.push(res_Position_Basic1001[mID - 1]);

                            model.com.postSchedulePosition({
                                Module: 1001,
                                data: res_Position21,
                            }, function (res) {
                                //alert("将生产员 " + mName + " 修改为 " + WName);
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                $(".zace-mode").hide();
                                model.com.refresh();
                            });
                            break;
                        case 5001:
                            res_Position_Basic5001[mID - 1].MemberID = WID;
                            res_Position_Basic5001[mID - 1].MemberName = WName;

                            var res_Position = [];
                            res_Position.push(res_Position_Basic5001[mID - 1]);

                            model.com.postSchedulePosition({
                                Module: 5001,
                                data: res_Position,
                            }, function (res) {
                                //alert("将巡检员 " + mName + " 修改为 " + WName);
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                $(".zace-mode").hide();
                                model.com.refresh();
                            });
                            break;
                        case 5002:
                            res_Position_Basic5002[mID - 1].MemberID = WID;
                            res_Position_Basic5002[mID - 1].MemberName = WName;

                            var res_Position = [];
                            res_Position.push(res_Position_Basic5002[mID - 1]);

                            model.com.postSchedulePosition({
                                Module: 5002,
                                data: res_Position,
                            }, function (res) {
                                //alert("将入库检验员 " + mName + " 修改为 " + WName);
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                $(".zace-mode").hide();
                                model.com.refresh();
                            });
                            break;
                        case 6001:
                            res_Position_Basic6001[mID - 1].MemberID = WID;
                            res_Position_Basic6001[mID - 1].MemberName = WName;

                            var res_Position = [];
                            res_Position.push(res_Position_Basic6001[mID - 1]);

                            model.com.postSchedulePosition({
                                Module: 6001,
                                data: res_Position,
                            }, function (res) {
                                //alert("将工艺员 " + mName + " 修改为 " + WName);
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                $(".zace-mode").hide();
                                model.com.refresh();
                            });
                            break;
                        case 7001:

                            res_Position_Basic7001[mID - 1].MemberID = WID;
                            res_Position_Basic7001[mID - 1].MemberName = WName;

                            var res_Position = [];
                            res_Position.push(res_Position_Basic7001[mID - 1]);

                            model.com.postSchedulePosition({
                                Module: 7001,
                                data: res_Position,
                            }, function (res) {
                                //alert("将配料员 " + mName + " 修改为 " + WName);
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                $(".zace-mode").hide();
                                model.com.refresh();
                            });

                            break;
                        case 4001:
                            res_Position_Basic4001[mID - 1].MemberID = WID;
                            res_Position_Basic4001[mID - 1].MemberName = WName;

                            var res_Position = [];
                            res_Position.push(res_Position_Basic4001[mID - 1]);

                            model.com.postSchedulePosition({
                                Module: 4001,
                                data: res_Position,
                            }, function (res) {
                                // alert("将计量员 " + mName + " 修改为 " + WName);
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                $(".zace-mode").hide();
                                model.com.refresh();
                            });

                            break;
                        case 7002:
                            res_Position_Basic7002[mID - 1].MemberID = WID;
                            res_Position_Basic7002[mID - 1].MemberName = WName;

                            var res_Position = [];
                            res_Position.push(res_Position_Basic7002[mID - 1]);

                            model.com.postSchedulePosition({
                                Module: 7002,
                                data: res_Position,
                            }, function (res) {
                                //alert("将收料员 " + mName + " 修改为 " + WName);
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                $(".zace-mode").hide();
                                model.com.refresh();
                            });

                            break;
                        case 7004:
                            res_Position_Basic7004[mID - 1].MemberID = WID;
                            res_Position_Basic7004[mID - 1].MemberName = WName;

                            var res_Position = [];
                            res_Position.push(res_Position_Basic7004[mID - 1]);

                            model.com.postSchedulePosition({
                                Module: 7004,
                                data: res_Position,
                            }, function (res) {
                                //alert("将辅料员 " + mName + " 修改为 " + WName);
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                $(".zace-mode").hide();
                                model.com.refresh();
                            });

                            break;
                    }
                });
                //人员清除
                $("body").delegate("#zace-del-schedule", "click", function () {
                    switch (mZaceValue) {
                        case 8001:
                            res_Position_Basic8001[mID - 1].MemberID = 0;
                            res_Position_Basic8001[mID - 1].MemberName = "";


                            var res_Position2 = [];
                            res_Position2.push(res_Position_Basic8001[mID - 1]);

                            model.com.postSchedulePosition({
                                Module: 8001,
                                data: res_Position2,
                            }, function (res) {
                                // alert("将操作员 " + mName + " 清除");
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                $(".zace-mode").hide();
                                model.com.refresh();
                            });
                            break;
                        case 1001:
                            res_Position_Basic1001[mID - 1].MemberID = 0;
                            res_Position_Basic1001[mID - 1].MemberName = "";


                            var res_Position22 = [];
                            res_Position22.push(res_Position_Basic1001[mID - 1]);

                            model.com.postSchedulePosition({
                                Module: 1001,
                                data: res_Position22,
                            }, function (res) {
                                //alert("将生产员 " + mName + " 清除");
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                $(".zace-mode").hide();
                                model.com.refresh();
                            });
                            break;
                        case 5001:
                            res_Position_Basic5001[mID - 1].MemberID = 0;
                            res_Position_Basic5001[mID - 1].MemberName = "";

                            var res_Position = [];
                            res_Position.push(res_Position_Basic5001[mID - 1]);

                            model.com.postSchedulePosition({
                                Module: 5001,
                                data: res_Position,
                            }, function (res) {
                                //alert("将巡检员 " + mName + " 清除");
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                $(".zace-mode").hide();
                                model.com.refresh();
                            });
                            break;
                        case 5002:
                            res_Position_Basic5002[mID - 1].MemberID = 0;
                            res_Position_Basic5002[mID - 1].MemberName = "";

                            var res_Position = [];
                            res_Position.push(res_Position_Basic5002[mID - 1]);

                            model.com.postSchedulePosition({
                                Module: 5002,
                                data: res_Position,
                            }, function (res) {
                                //alert("将入库检验员 " + mName + " 清除");
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                $(".zace-mode").hide();
                                model.com.refresh();
                            });
                            break;
                        case 6001:
                            res_Position_Basic6001[mID - 1].MemberID = 0;
                            res_Position_Basic6001[mID - 1].MemberName = "";

                            var res_Position = [];
                            res_Position.push(res_Position_Basic6001[mID - 1]);

                            model.com.postSchedulePosition({
                                Module: 6001,
                                data: res_Position,
                            }, function (res) {
                                //alert("将工艺员 " + mName + " 清除");
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                $(".zace-mode").hide();
                                model.com.refresh();
                            });
                            break;
                        case 7001:
                            res_Position_Basic7001[mID - 1].MemberID = 0;
                            res_Position_Basic7001[mID - 1].MemberName = "";

                            var res_Position = [];
                            res_Position.push(res_Position_Basic7001[mID - 1]);

                            model.com.postSchedulePosition({
                                Module: 7001,
                                data: res_Position,
                            }, function (res) {
                                // alert("将配料员 " + mName + " 清除");
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                $(".zace-mode").hide();
                                model.com.refresh();
                            });
                            break;
                        case 4001:
                            res_Position_Basic4001[mID - 1].MemberID = 0;
                            res_Position_Basic4001[mID - 1].MemberName = "";

                            var res_Position = [];
                            res_Position.push(res_Position_Basic4001[mID - 1]);

                            model.com.postSchedulePosition({
                                Module: 4001,
                                data: res_Position,
                            }, function (res) {
                                //alert("将计量员 " + mName + " 清除");
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                $(".zace-mode").hide();
                                model.com.refresh();
                            });

                            break;
                        case 7002:
                            res_Position_Basic7002[mID - 1].MemberID = 0;
                            res_Position_Basic7002[mID - 1].MemberName = "";

                            var res_Position = [];
                            res_Position.push(res_Position_Basic7002[mID - 1]);

                            model.com.postSchedulePosition({
                                Module: 7002,
                                data: res_Position,
                            }, function (res) {
                                //alert("将收料员 " + mName + " 清除");
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                $(".zace-mode").hide();
                                model.com.refresh();
                            });

                            break;
                        case 7004:
                            res_Position_Basic7004[mID - 1].MemberID = 0;
                            res_Position_Basic7004[mID - 1].MemberName = "";

                            var res_Position = [];
                            res_Position.push(res_Position_Basic7004[mID - 1]);

                            model.com.postSchedulePosition({
                                Module: 7004,
                                data: res_Position,
                            }, function (res) {
                                // alert("将辅料员 " + mName + " 清除");
                                $(".zace-left").show();
                                $(".zace-right").hide();
                                $(".zace-mode").hide();
                                model.com.refresh();
                            });

                            break;
                    }


                });
                //操作员 双击
                $("body").delegate("#femi-schedule-tbody td[data-title=MemberName8001]", "dblclick", function () {

                    $(".zace-left").hide();
                    $(".zace-right").show();
                    $(".zace-mode").hide();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = $this.parent().find("td[data-title=WID]").attr("data-value");
                    mZaceValue = 8001;
                    mName = name;

                });
                //生产员
                $("body").delegate("#femi-schedule-tbody td[data-title=MemberName1001]", "dblclick", function () {

                    $(".zace-left").hide();
                    $(".zace-right").show();
                    $(".zace-mode").hide();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = $this.parent().find("td[data-title=WID]").attr("data-value");
                    mZaceValue = 1001;
                    mName = name;


                });

                //巡检员
                $("body").delegate("#femi-schedule-tbody td[data-title=MemberName5001]", "dblclick", function () {

                    $(".zace-left").hide();
                    $(".zace-right").show();
                    $(".zace-mode").hide();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = $this.parent().find("td[data-title=WID]").attr("data-value");
                    mZaceValue = 5001;
                    mName = name;


                });
                //入库检验员
                $("body").delegate("#femi-schedule-tbody td[data-title=MemberName5002]", "dblclick", function () {

                    $(".zace-left").hide();
                    $(".zace-right").show();
                    $(".zace-mode").hide();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = $this.parent().find("td[data-title=WID]").attr("data-value");
                    mZaceValue = 5002;
                    mName = name;


                });
                //工艺员
                $("body").delegate("#femi-schedule-tbody td[data-title=MemberName6001]", "dblclick", function () {

                    $(".zace-left").hide();
                    $(".zace-right").show();
                    $(".zace-mode").hide();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = $this.parent().find("td[data-title=WID]").attr("data-value");
                    mZaceValue = 6001;
                    mName = name;


                });
                //配料员
                $("body").delegate("#femi-schedule-tbody td[data-title=MemberName7001]", "dblclick", function () {

                    $(".zace-left").hide();
                    $(".zace-right").show();
                    $(".zace-mode").hide();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = $this.parent().find("td[data-title=WID]").attr("data-value");
                    mZaceValue = 7001;
                    mName = name;

                });
                //计量员
                $("body").delegate("#femi-schedule-tbody td[data-title=MemberName4001]", "dblclick", function () {

                    $(".zace-left").hide();
                    $(".zace-right").show();
                    $(".zace-mode").hide();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = $this.parent().find("td[data-title=WID]").attr("data-value");
                    mZaceValue = 4001;
                    mName = name;

                });
                //收料员
                $("body").delegate("#femi-schedule-tbody td[data-title=MemberName7002]", "dblclick", function () {

                    $(".zace-left").hide();
                    $(".zace-right").show();
                    $(".zace-mode").hide();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = $this.parent().find("td[data-title=WID]").attr("data-value");
                    mZaceValue = 7002;
                    mName = name;


                });
                //辅料员
                $("body").delegate("#femi-schedule-tbody td[data-title=MemberName7004]", "dblclick", function () {

                    $(".zace-left").hide();
                    $(".zace-right").show();
                    $(".zace-mode").hide();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = $this.parent().find("td[data-title=WID]").attr("data-value");
                    mZaceValue = 7004;
                    mName = name;
                });

                //模板管理
                $("body").delegate("#zace-edit-mode", "click", function () {
                    $(".zace-left").hide();
                    $(".zace-right").hide();
                    $(".zace-mode").show();
                    var _list = $com.util.Clone(DataAll_group);
                    for (var i = 0; i < _list.length; i++) {
                        _list[i].CreateTime = $com.util.format("yyyy-MM-dd ", _list[i].CreateTime);

                    }
                    $("#femi-mode-tbody").html($com.util.template(_list, HTML.TableGroupNode));

                    //返回
                    $("body").delegate("#zace-exit-schedule", "click", function () {
                        $(".zace-mode").hide();
                        $(".zace-left").show();
                        $(".zace-right").show();
                    });
                    //新增  
                    $("body").delegate("#zace-add-schedule", "click", function () {
                        $("body").append($com.modal.show(DEFAULT_VALUE_group, KEYWORD_group, "新增", function (rst) {
                            //调用插入函数 

                            if (!rst || $.isEmptyObject(rst))
                                return;
                            var _data = {
                                // ID: model.com.getMaxGroupID(DataAll_group),
                                GroupID: model.com.getMaxGroupID(DataAll_group),
                                GroupName: rst.GroupName,
                                // Creator: "admin",
                                Creator: window.parent.User_Info.Name,
                                CreateTime: $com.util.format("yyyy-MM-dd ", new Date()),
                            };
                            DataAll_group.push(_data);
                            model.com.postGroup({
                                data: DataAll_group,
                            }, function (res) {
                                alert("新增成功");
                                model.com.refresh();

                                var _list = $com.util.Clone(DataAll_group);
                                for (var i = 0; i < _list.length; i++) {
                                    _list[i].CreateTime = $com.util.format("yyyy-MM-dd ", _list[i].CreateTime);
                                    _list[i].ID = i + 1;

                                }
                                $("#femi-mode-tbody").html($com.util.template(_list, HTML.TableGroupNode));
                            });

                        }, TypeSource_group));
                    });
                    //修改

                    $("body").delegate("#zace-edit-schedule", "click", function () {

                        var SelectData = $com.table.getSelectionData($("#femi-mode-tbody"), "ID", DataAll_group);
                        if (!SelectData || !SelectData.length) {
                            alert("请先选择一行数据再试！");
                            return;
                        }
                        if (SelectData.length != 1) {
                            alert("只能同时对一行数据修改！");
                            return;
                        }

                        var default_value = {
                            GroupName: SelectData[0].GroupName,
                        };
                        $("body").append($com.modal.show(default_value, KEYWORD_group, "修改", function (rst) {
                            if (!rst || $.isEmptyObject(rst))
                                return;

                            SelectData[0].GroupName = rst.GroupName;
                            SelectData[0].CreateTime = $com.util.format("yyyy-MM-dd  hh:mm:ss", new Date());


                            model.com.postGroup({
                                data: DataAll_group,
                            }, function (res) {
                                alert("修改成功");
                                model.com.refresh();
                                var _list = $com.util.Clone(DataAll_group);
                                for (var i = 0; i < _list.length; i++) {
                                    _list[i].CreateTime = $com.util.format("yyyy-MM-dd ", _list[i].CreateTime);

                                }
                                $("#femi-mode-tbody").html($com.util.template(_list, HTML.TableGroupNode));
                            });

                        }, TypeSource_group));
                    });
                });


                //导出
                $("body").delegate("#zace-down-schedule", "click", function () {
                    var $table = $(".zace-table-export"),
                        fileName = "操作排班模板.xls",
                        Title = "操作排班模板";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.getExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });


                });


                //岗位选择
                $(".zace-position").change(function () {
                    var value = $(".zace-position").val();
                    mValue = value;
                    model.com.getMode(value);
                });
                //模板选择
                $("#zace-modelist").change(function () {

                    mGroupID = $("#zace-modelist").val();

                    var sop = document.getElementById("zace-modelist");
                    var index = sop.selectedIndex;
                    var name = sop[index].text;
                    //$(".zace-input").val(name);
                    $('#zace-span-text').html(name);
                    $("#zace-modelist option[value=mGroupID]").selected = true;


                    //查询模板
                    $("body").delegate("#zace-search-mode", "click", function () {

                        model.com.refresh();


                    });
                });


                //用户表返回
                $("body").delegate("#zace-exit-user", "click", function () {
                    $(".zace-left").show();
                    $(".zace-right").hide();
                    $(".zace-mode").hide();


                });
                //用户查询
                $("#userSelect").change(function () {
                    var opt = $("#userSelect").val();
                    var default_value = {
                        DutyID: 0,
                    };
                    //alert(opt);
                    default_value.DutyID = opt;
                    $com.table.filterByConndition($("#femi-user-tbody"), DataAll_user, default_value, "ID");
                });


            },
            run: function () {
                $(".zace-right").hide();
                $(".zace-mode").hide();
                //得到部门  岗位   用户渲染员工表
                model.com.getDepartment({}, function (res) {
                    if (!res)
                        return;
                    var list = res.list,
                        rst = [];
                    if (list) {
                        rst = model.com.utils.getSon(list);
                    }

                    if (TypeSource_user.DepartmentID.length > 1)
                        TypeSource_user.DepartmentID.splice(1, TypeSource_user.DepartmentID.length - 1);
                    TypeSource_user.DepartmentID = TypeSource_user.DepartmentID.concat(model.com.utils.getSource(rst));

                    //得到岗位  用户
                    model.com.getPosition({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        if (list) {
                            rst = model.com.utils.getSon(list);
                        }

                        if (TypeSource_user.Position.length > 1)
                            TypeSource_user.Position.splice(1, TypeSource_user.Position.length - 1);
                        TypeSource_user.Position = TypeSource_user.Position.concat(model.com.utils.getSource(rst));

                        model.com.getUser({}, function (res) {
                            if (res && res.list) {
                                // $('.tb_users').bootstrapTable('load', res.list);    
                                DataAll_user = res.list;
                                var _list = $com.util.Clone(res.list);
                                $.each(_list, function (i, item) {
                                    for (var p in item) {
                                        if (!FORMATTRT_user[p])
                                            continue;
                                        item[p] = FORMATTRT_user[p](item[p]);
                                    }
                                });
                                $("#femi-user-tbody").html($com.util.template(_list, HTML.TableUserItemNode));
                            }
                        });
                    });

                });

                //车间产线
                model.com.getWorkShop({}, function (data) {

                    $.each(data.list, function (i, item) {
                        TypeSource_Arrange.WorkShopID.push({
                            name: item.WorkShopName,
                            value: item.ID,
                            far: null,
                        });
                        $.each(item.LineList, function (l_i, l_item) {
                            TypeSource_Arrange.LineID.push({
                                name: l_item.ItemName,
                                value: l_item.ID,
                                far: item.ID,
                            });
                        });

                    });

                    model.com.getConfigAll({}, function (res) {
                        if (!res)
                            return;
                        if (res && res.list) {
                            $.each(res.list, function (p_i, p_item) {
                                TypeSource_Arrange.PartID = TypeSource_Arrange.PartID.concat($com.table.getTypeSource(p_item.PartList, "PartID", "PartName"));

                                $.each(p_item.PartList, function (pp_i, pp_item) {

                                    TypeSource_Arrange.PartPointID = TypeSource_Arrange.PartPointID.concat($com.table.getTypeSource(pp_item.PartPointList, "PartPointID", "PartPointName", undefined, "PartID"));
                                });
                            });

                            PartList_Basic = res.list;
                            //工序列表
                            PartList_Basic_Son = model.com.getConactList(res.list);

                            PartList_Basic_Son = $com.util.Clone(PartList_Basic_Son);

                            WorkLinePartList = [];
                            for (var i = 0; i < PartList_Basic_Son.length; i++) {
                                PartList_Basic_Son[i].WID = i + 1;
                                PartList_Basic_Son[i].MemberName1001 = "";
                                PartList_Basic_Son[i].MemberName8001 = "";
                                PartList_Basic_Son[i].MemberName5001 = "";
                                PartList_Basic_Son[i].MemberName5002 = "";
                                PartList_Basic_Son[i].MemberName6001 = "";
                                PartList_Basic_Son[i].MemberName7001 = "";
                                PartList_Basic_Son[i].MemberName4001 = "";
                                PartList_Basic_Son[i].MemberName7002 = "";
                                PartList_Basic_Son[i].MemberName7004 = "";
                                if (PartList_Basic_Son[i].WorkShopID == 1) {
                                    WorkLinePartList.push(PartList_Basic_Son[i]);

                                }

                            }

                            model.com.refresh();


                        }

                    });
                });


            },
            com: {
                //用户
                getUser: function (data, fn, context) {
                    var d = {
                        $URI: "/User/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //导出
                getExportExcel: function (data, fn, context) {
                    var d = {
                        $URI: "/Upload/ExportExcel",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //部门
                getDepartment: function (data, fn, context) {
                    var d = {
                        $URI: "/Department/AllDepartment",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //岗位
                getPosition: function (data, fn, context) {
                    var d = {
                        $URI: "/Department/AllPosition",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //工序
                getConfigAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSLine/ConfigAll",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //车间产线
                getWorkShop: function (data, fn, context) {
                    var d = {
                        $URI: "/WorkShop/All",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //获取排版模板组
                getGroup: function (data, fn, context) {
                    var d = {
                        $URI: "/SchedulePosition/ScheduleGroupAll",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //提交排版模板组
                postGroup: function (data, fn, context) {
                    var d = {
                        $URI: "/SchedulePosition/ScheduleGroupSave",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //操作排班模板
                getSchedulePosition: function (data, fn, context) {
                    var d = {
                        $URI: "/SchedulePosition/GeneralAll",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //保存排班模板
                postSchedulePosition: function (data, fn, context) {
                    var d = {
                        $URI: "/SchedulePosition/Save",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getMaxGroupID: function (_source) {
                    var id = 0;
                    if (!_source)
                        _source = [];
                    $.each(_source, function (i, item) {
                        if (item.ID > id)
                            id = item.ID;
                    });
                    return id + 1;

                },
                refresh: function () {
                    //模板管理
                    model.com.getGroup({}, function (resGroup) {
                        DataAll_group = resGroup.list;
                        $("#zace-modelist").empty();
                        for (var i = 0; i < DataAll_group.length; i++) {
                            DataAll_group[i].ID = i + 1;

                            $("#zace-modelist").append("<option value='" + DataAll_group[i].GroupID + "'>" + DataAll_group[i].GroupName + "</option>");

                        }

                    });

                    //排班全部
                    model.com.getSchedulePosition({
                        WorkShopID: 1,
                        LineID: 0,
                        Module: 1001,
                        GroupID: mGroupID,
                    }, function (res_position1001) {
                        res_Position_Basic1001 = res_position1001.list;

                        model.com.getSchedulePosition({
                            WorkShopID: 1,
                            LineID: 0,
                            Module: 8001,
                            GroupID: mGroupID,
                        }, function (res_position8001) {
                            res_Position_Basic8001 = res_position8001.list;

                            model.com.getSchedulePosition({
                                WorkShopID: 1,
                                LineID: 0,
                                Module: 5001,
                                GroupID: mGroupID,
                            }, function (res_position5001) {
                                res_Position_Basic5001 = res_position5001.list;

                                model.com.getSchedulePosition({
                                    WorkShopID: 1,
                                    LineID: 0,
                                    Module: 5002,
                                    GroupID: mGroupID,
                                }, function (res_position5002) {
                                    res_Position_Basic5002 = res_position5002.list;

                                    model.com.getSchedulePosition({
                                        WorkShopID: 1,
                                        LineID: 0,
                                        Module: 6001,
                                        GroupID: mGroupID,
                                    }, function (res_position6001) {
                                        res_Position_Basic6001 = res_position6001.list;

                                        model.com.getSchedulePosition({
                                            WorkShopID: 1,
                                            LineID: 0,
                                            Module: 7001,
                                            GroupID: mGroupID,
                                        }, function (res_position7001) {
                                            res_Position_Basic7001 = res_position7001.list;

                                            model.com.getSchedulePosition({
                                                WorkShopID: 1,
                                                LineID: 0,
                                                Module: 4001,
                                                GroupID: mGroupID,
                                            }, function (res_position4001) {
                                                res_Position_Basic4001 = res_position4001.list;

                                                model.com.getSchedulePosition({
                                                    WorkShopID: 1,
                                                    LineID: 0,
                                                    Module: 7002,
                                                    GroupID: mGroupID,
                                                }, function (res_position7002) {
                                                    res_Position_Basic7002 = res_position7002.list;

                                                    model.com.getSchedulePosition({
                                                        WorkShopID: 1,
                                                        LineID: 0,
                                                        Module: 7004,
                                                        GroupID: mGroupID,
                                                    }, function (res_position7004) {
                                                        res_Position_Basic7004 = res_position7004.list;

                                                        var _list = $com.util.Clone(WorkLinePartList);
                                                        var zacelength = _list.length;
                                                        if (zacelength > res_position1001.list.length) {
                                                            zacelength = res_position1001.list.length;
                                                        }

                                                        for (var i = 0; i < zacelength; i++) {
                                                            //console.log(i);
                                                            _list[i].MemberName1001 = res_position1001.list[i].MemberName;
                                                            _list[i].MemberName8001 = res_position8001.list[i].MemberName;
                                                            _list[i].MemberName5001 = res_position5001.list[i].MemberName;
                                                            _list[i].MemberName5002 = res_position5002.list[i].MemberName;
                                                            _list[i].MemberName6001 = res_position6001.list[i].MemberName;
                                                            _list[i].MemberName7001 = res_position7001.list[i].MemberName;
                                                            _list[i].MemberName4001 = res_position4001.list[i].MemberName;
                                                            _list[i].MemberName7002 = res_position7002.list[i].MemberName;
                                                            _list[i].MemberName7004 = res_position7004.list[i].MemberName;
                                                        }
                                                        $.each(_list, function (i, item) {
                                                            for (var p in item) {
                                                                if (!Formattrt_Arrange[p])
                                                                    continue;
                                                                item[p] = Formattrt_Arrange[p](item[p]);
                                                            }
                                                        });

                                                        $("#femi-schedule-tbody").html($com.util.template(_list, HTML.ArrangeList));
                                                        model.com.getMode(mValue);
                                                    });
                                                });
                                            });
                                        });
                                    });

                                });
                            });
                        });

                    });


                },

                utils: {
                    getSon: function (list) {
                        var _rst = [];
                        $.each(list, function (i, item) {
                            _rst.push(item);
                            if (item.SonList) {
                                var _arr = model.com.utils.getSon(item.SonList);
                                _rst = _rst.concat(_arr);
                            }

                        });
                        return _rst;
                    },
                    getSource: function (list) {
                        var _rst = [];
                        $.each(list, function (i, item) {
                            if (item.Active)
                                _rst.push({
                                    far: item.DepartmentID,
                                    value: item.ID,
                                    name: item.Name,
                                });
                        });
                        return _rst;
                    },
                },

                getConactList: function (list) {
                    var _rst = [];
                    var _arr = [];
                    var _act = [];
                    $.each(list, function (i, item) {

                        _arr = item.PartPointList;
                        if (_arr && _arr.length > 0)
                            _rst = _rst.concat(_arr);

                        if (!item.PartList || item.PartList.length < 1)
                            return true;

                        $.each(item.PartList, function (j, otherItem) {

                            _act = otherItem.PartPointList;

                            if (_act && _act.length > 0)
                                _rst = _rst.concat(_act);

                        });
                    });
                    return _rst;
                },

                GetMaxID: function (_source) {
                    var id = 0;
                    if (!_source)
                        _source = [];
                    $.each(_source, function (i, item) {
                        if (item.ID > id)
                            id = item.ID;
                    });
                    return id + 1;
                },

                getSon: function (list) {
                    var _rst = list;
                    $.each(list, function (i, item) {

                        _arr = item.PartPoint;
                        _rst = _rst.concat(_arr);

                    });
                    return _rst;
                },
                getMode: function (value) {
                    switch (value) {
                        case '0':
                            $(".Duty1001").css('display', '');
                            $(".Duty8001").css('display', '');
                            $(".Duty7004").css('display', '');
                            $(".Duty5001").css('display', '');
                            $(".Duty5002").css('display', '');
                            $(".Duty6001").css('display', '');
                            $(".Duty7001").css('display', '');
                            $(".Duty4001").css('display', '');
                            $(".Duty7002").css('display', '');
                            break;
                        case '1001':
                            $(".Duty1001").css('display', '');
                            $(".Duty7004").css('display', 'none');
                            $(".Duty8001").css('display', 'none');
                            $(".Duty5001").css('display', 'none');
                            $(".Duty5002").css('display', 'none');
                            $(".Duty6001").css('display', 'none');
                            $(".Duty7001").css('display', 'none');
                            $(".Duty4001").css('display', 'none');
                            $(".Duty7002").css('display', 'none');

                            break;
                        case '8001':
                            $(".Duty8001").css('display', '');
                            $(".Duty7004").css('display', 'none');
                            $(".Duty1001").css('display', 'none');
                            $(".Duty5001").css('display', 'none');
                            $(".Duty5002").css('display', 'none');
                            $(".Duty6001").css('display', 'none');
                            $(".Duty7001").css('display', 'none');
                            $(".Duty4001").css('display', 'none');
                            $(".Duty7002").css('display', 'none');
                            break;
                        case '5001':
                            $(".Duty5001").css('display', '');
                            $(".Duty7004").css('display', 'none');
                            $(".Duty8001").css('display', 'none');
                            $(".Duty1001").css('display', 'none');
                            $(".Duty5002").css('display', 'none');
                            $(".Duty6001").css('display', 'none');
                            $(".Duty7001").css('display', 'none');
                            $(".Duty4001").css('display', 'none');
                            $(".Duty7002").css('display', 'none');
                            break;
                        case '5002':
                            $(".Duty5002").css('display', '');
                            $(".Duty7004").css('display', 'none');
                            $(".Duty8001").css('display', 'none');
                            $(".Duty5001").css('display', 'none');
                            $(".Duty1001").css('display', 'none');
                            $(".Duty6001").css('display', 'none');
                            $(".Duty7001").css('display', 'none');
                            $(".Duty4001").css('display', 'none');
                            $(".Duty7002").css('display', 'none');
                            break;
                        case '6001':
                            $(".Duty6001").css('display', '');
                            $(".Duty7004").css('display', 'none');
                            $(".Duty8001").css('display', 'none');
                            $(".Duty5001").css('display', 'none');
                            $(".Duty5002").css('display', 'none');
                            $(".Duty1001").css('display', 'none');
                            $(".Duty7001").css('display', 'none');
                            $(".Duty4001").css('display', 'none');
                            $(".Duty7002").css('display', 'none');
                            break;
                        case '7001':
                            $(".Duty7001").css('display', '');
                            $(".Duty7004").css('display', 'none');
                            $(".Duty8001").css('display', 'none');
                            $(".Duty5001").css('display', 'none');
                            $(".Duty5002").css('display', 'none');
                            $(".Duty6001").css('display', 'none');
                            $(".Duty1001").css('display', 'none');
                            $(".Duty4001").css('display', 'none');
                            $(".Duty7002").css('display', 'none');
                            break;
                        case '4001':
                            $(".Duty4001").css('display', '');
                            $(".Duty7004").css('display', 'none');
                            $(".Duty8001").css('display', 'none');
                            $(".Duty5001").css('display', 'none');
                            $(".Duty5002").css('display', 'none');
                            $(".Duty6001").css('display', 'none');
                            $(".Duty7001").css('display', 'none');
                            $(".Duty1001").css('display', 'none');
                            $(".Duty7002").css('display', 'none');
                            break;
                        case '7002':
                            $(".Duty7002").css('display', '');
                            $(".Duty7004").css('display', 'none');
                            $(".Duty8001").css('display', 'none');
                            $(".Duty5001").css('display', 'none');
                            $(".Duty5002").css('display', 'none');
                            $(".Duty6001").css('display', 'none');
                            $(".Duty7001").css('display', 'none');
                            $(".Duty4001").css('display', 'none');
                            $(".Duty1001").css('display', 'none');
                            break;
                        case '7004':
                            $(".Duty7004").css('display', '');
                            $(".Duty1001").css('display', 'none');
                            $(".Duty8001").css('display', 'none');
                            $(".Duty5001").css('display', 'none');
                            $(".Duty5002").css('display', 'none');
                            $(".Duty6001").css('display', 'none');
                            $(".Duty7001").css('display', 'none');
                            $(".Duty4001").css('display', 'none');
                            $(".Duty7002").css('display', 'none');
                            break;
                    }
                },

            },
        });
        model.init();
    });