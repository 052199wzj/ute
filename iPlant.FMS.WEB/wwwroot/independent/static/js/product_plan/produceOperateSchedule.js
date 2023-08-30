require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($lin, $com) {

        var HTML,
            PartList_Basic,
            PartList_Basic_message,
            PartList_Basic_messagepart,
            DEFAULT_VALUE_Arrange,
            KETWROD_LIST_Arrange,
            KETWROD_Template_Arrange,
            Formattrt_Arrange,
            TypeSource_Arrange,

            KEYWORD_LIST_message,
            DataAll_message,
            FORMATTRT_message,
            KEYWORD_message,
            TypeSource_message,

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
            DataMessageTemp,
            res_Position_Basicz,     //模板
            res_Position_BasiczList, //排班列表
            res_Position_Basic1001,
            res_Position_Basic8001,
            res_Position_Basic5001,
            res_Position_Basic5002,
            res_Position_Basic6001,
            res_Position_Basic7001,
            res_Position_Basic4001,
            res_Position_Basic7002,
            res_Position_Basic7004,

            res_Position_Basic1001zz,//按岗排班
            res_Position_Basic8001zz,
            res_Position_Basic5001zz,
            res_Position_Basic5002zz,
            res_Position_Basic6001zz,
            res_Position_Basic7001zz,
            res_Position_Basic4001zz,
            res_Position_Basic7002zz,
            res_Position_Basic7004zz,
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
        PartList_Basic_message = [];
        DataMessageTemp = {
            Grade: 0,
            ID: 0,
            Message: "",
            ModuleID: 0,
            Operator: "admin",
            OperatorID: 1,
            ShiftID: 0,
            Sponsor: "admin",
            SponsorID: 1,
            Status: 0,
            SubmitTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
            Type: 0,
        };
        PartList_Basic = [];
        mValue = 0;
        mGroupID = 1;
        Time = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
        ShiftID = 0;
        HTML = {
            ArrangeList: [
                '<tr data-color="">',
                '<td style="min-width: 3px"><input type="checkbox"class="femi-tb-checkbox" style="margin: 1px 0px 1px"value="{{functionID}}" /></th>',
                //'<td style="min-width: 50px" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                '<td  style="min-width: 50px" data-title="WorkShopID" data-value="{{WorkShopID}}" >{{ WorkShopID}}</td>',
                '<td style="min-width: 50px" data-title="LineID" data-value="{{LineID}}" >{{ LineID}}</td>',
                '<td style="min-width: 50px" data-title="PartID" data-value="{{PartID}}" >{{ PartID}}</td>',
                '<td style="min-width: 50px" data-title="ProductNo" data-value="{{ProductNo}}" >{{ ProductNo}}</td>',
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
                '<tr>'
            ].join(""),

            TableUserItemNode: [
                      '<tr data-color="">',
                      '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                      '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
                      '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
                      '<td data-title="DepartmentID" data-value="{{DepartmentID}}" >{{DepartmentID}}</td>',
                      '<td data-title="Position" data-value="{{Position}}" >{{Position}}</td>',
                      '<td data-title="DutyID" data-value="{{DutyID}}" >{{DutyID}}</td>',
                      '</tr>',
            ].join(""),
            TableMessageNode: [
                    '<tr data-color="">',
                    '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
                    '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
                    '<td data-title="ModuleID" data-value="{{ModuleID}}" >{{ModuleID}}</td>',
                    '<td data-title="Message" data-value="{{Message}}" >{{Message}}</td>',
                    '<td data-title="Grade" data-value="{{Grade}}" >{{Grade}}</td>',
                    '<td data-title="Type" data-value="{{Type}}" >{{Type}}</td>',
                    '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
                    '<td data-title="Operator" data-value="{{Operator}}" >{{Operator}}</td>',
                    '<td data-title="SubmitTime" data-value="{{SubmitTime}}" >{{SubmitTime}}</td>',

                    '</tr>',
            ].join(""),
        }

        //排班列表  
        $(function () {
            KETWROD_LIST_Arrange = [
                "WorkShopID|车间|ArrayOneControl",
                "LineID|产线|ArrayOneControl|WorkShopID",
                "PartID|工序段|ArrayOne",
                "PartPointID|工序|ArrayOne",
                 "Time|日期|Date",
            ];
            KETWROD_Template_Arrange = {};

            Formattrt_Arrange = {};

            TypeSource_Arrange = {
                WorkShopID: [{
                    name: "磨加工车间",
                    value: 1
                },
                ],
                LineID: [{
                    name: "全部",
                    value: 0,
                    far: 0,
                }
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
                    control: detail.length > 3 ? detail[3] : undefined
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
                    value: 0
                }],
                Position: [{
                    name: "无",
                    value: 0,
                    far: 0
                }],
                DutyID: [{
                    name: "全部",
                    value: 0
                }, {
                    name: "生产员",
                    value: 1001
                }, {
                    name: "电修工",
                    value: 2001
                }, {
                    name: "机修工",
                    value: 3001
                }, {
                    name: "计量员",
                    value: 4001
                }, {
                    name: "巡检员",
                    value: 5001
                }, {
                    name: "入库检验员",
                    value: 5002
                }, {
                    name: "工艺员",
                    value: 6001
                }, {
                    name: "配料员",
                    value: 7001
                }, {
                    name: "收料员",
                    value: 7002
                }, {
                    name: "辅料员",
                    value: 7004
                }, {
                    name: "操作员",
                    value: 8001
                }, {
                    name: "管理",
                    value: 10001
                }],
            };

            $.each(KEYWORD_LIST_user, function (i, item) {
                var detail = item.split("|");
                KEYWORD_user[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };
                if (detail.length > 2) {
                    FORMATTRT_user[detail[0]] = $com.util.getFormatter(TypeSource_user, detail[0], detail[2]);
                }
            });
        });



        //消息通知
        $(function () {

            KEYWORD_LIST_message = [
                "ModuleID|消息类型|ArrayOne",
                "Grade|级别|ArrayOne",
                "Type|类型|ArrayOne",
                "Status|状态|ArrayOne",

            ];
            DataAll_message = [];
            FORMATTRT_message = {};
            KEYWORD_message = {};

            TypeSource_message = {

                ModuleID: [{
                    name: "系统消息",
                    value: 0
                },
                {
                    name: "排班消息",
                    value: 1
                }],
                Grade: [{
                    name: "0",
                    value: 0,
                },
                {
                    name: "一级报警",
                    value: 1,
                },
                {
                    name: "二级报警",
                    value: 2,
                },
                {
                    name: "三级报警",
                    value: 3,
                }, {
                    name: "四级报警",
                    value: 4,
                }
                ],
                Type: [{
                    name: "0",
                    value: 0
                },
                {
                    name: "一人多岗",
                    value: 1
                },
                 {
                     name: "超过最大任务数",
                     value: 2
                 },
                {
                    name: "关键工序选人错误",
                    value: 3
                }],
                Status: [
                {
                    name: "0",
                    value: 0
                },
                 {
                     name: "未检查",
                     value: 1
                 },
                ],
            };

            $.each(KEYWORD_LIST_message, function (i, item) {
                var detail = item.split("|");
                KEYWORD_message[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };
                if (detail.length > 2) {
                    FORMATTRT_message[detail[0]] = $com.util.getFormatter(TypeSource_message, detail[0], detail[2]);
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
                    var WID = parseInt($this.find('td[data-title=ID]').attr('data-value'));
                    var WName = $this.find('td[data-title=Name]').attr('data-value');

                    switch (mZaceValue) {
                        case 8001:

                            res_Position_Basic8001[mID - 1].MemberID = WID;
                            res_Position_Basic8001[mID - 1].MemberName = WName;

                            var res_Position1 = [];
                            res_Position1.push(res_Position_Basic8001[mID - 1]);//具体修改的哪一个员工

                            var WList = model.com.AddText(res_Position_Basicz);   //模块

                            var WNum = model.com.getNum(res_Position1, res_Position_BasiczList);//得到修改人员所在的排班的位置


                            res_Position_BasiczList[WNum].MemberID = res_Position1[0].MemberID;
                            res_Position_BasiczList[WNum].MemberName = res_Position1[0].MemberName;

                            var WModelList = model.com.createModeList(WList, res_Position_BasiczList);   //模块与排班数据的结合
                            $.each(WModelList, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_Arrange[p])
                                        continue;
                                    item[p] = Formattrt_Arrange[p](item[p]);
                                }
                            });


                            $("#femi-schedule-tbody").html($com.util.template(WModelList, HTML.ArrangeList));
                            $("#femi-schedule-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                            $(".zace-message").hide();
                            $(".zace-left").show();
                            $(".zace-right").hide();

                            break;
                        case 1001:
                            res_Position_Basic1001[mID - 1].MemberID = WID;
                            res_Position_Basic1001[mID - 1].MemberName = WName;

                            var res_Position21 = [];
                            res_Position212 = [];
                            res_Position21.push(res_Position_Basic1001[mID - 1]);

                            var WList = model.com.AddText(res_Position_Basicz);

                            var WNum = model.com.getNum(res_Position21, res_Position_BasiczList);//得到修改人员所在的排班的位置


                            res_Position_BasiczList[WNum].MemberID = res_Position21[0].MemberID;
                            res_Position_BasiczList[WNum].MemberName = res_Position21[0].MemberName;

                            var WModelList = model.com.createModeList(WList, res_Position_BasiczList);
                            $.each(WModelList, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_Arrange[p])
                                        continue;
                                    item[p] = Formattrt_Arrange[p](item[p]);
                                }
                            });


                            $("#femi-schedule-tbody").html($com.util.template(WModelList, HTML.ArrangeList));
                            $("#femi-schedule-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                            $(".zace-message").hide();
                            $(".zace-left").show();
                            $(".zace-right").hide();


                            break;
                        case 5001:
                            res_Position_Basic5001[mID - 1].MemberID = WID;
                            res_Position_Basic5001[mID - 1].MemberName = WName;

                            var res_Position = [];
                            res_Position.push(res_Position_Basic5001[mID - 1]);

                            var WList = model.com.AddText(res_Position_Basicz);

                            var WNum = model.com.getNum(res_Position, res_Position_BasiczList);//得到修改人员所在的排班的位置


                            res_Position_BasiczList[WNum].MemberID = res_Position[0].MemberID;
                            res_Position_BasiczList[WNum].MemberName = res_Position[0].MemberName;

                            var WModelList = model.com.createModeList(WList, res_Position_BasiczList);
                            $.each(WModelList, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_Arrange[p])
                                        continue;
                                    item[p] = Formattrt_Arrange[p](item[p]);
                                }
                            });


                            $("#femi-schedule-tbody").html($com.util.template(WModelList, HTML.ArrangeList));
                            $("#femi-schedule-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                            $(".zace-message").hide();
                            $(".zace-left").show();
                            $(".zace-right").hide();

                            break;
                        case 5002:
                            res_Position_Basic5002[mID - 1].MemberID = WID;
                            res_Position_Basic5002[mID - 1].MemberName = WName;

                            var res_Position = [];
                            res_Position.push(res_Position_Basic5002[mID - 1]);

                            var WList = model.com.AddText(res_Position_Basicz);

                            var WNum = model.com.getNum(res_Position, res_Position_BasiczList);//得到修改人员所在的排班的位置


                            res_Position_BasiczList[WNum].MemberID = res_Position[0].MemberID;
                            res_Position_BasiczList[WNum].MemberName = res_Position[0].MemberName;

                            var WModelList = model.com.createModeList(WList, res_Position_BasiczList);
                            $.each(WModelList, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_Arrange[p])
                                        continue;
                                    item[p] = Formattrt_Arrange[p](item[p]);
                                }
                            });


                            $("#femi-schedule-tbody").html($com.util.template(WModelList, HTML.ArrangeList));
                            $("#femi-schedule-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                            $(".zace-message").hide();
                            $(".zace-left").show();
                            $(".zace-right").hide();

                            break;
                        case 6001:
                            res_Position_Basic6001[mID - 1].MemberID = WID;
                            res_Position_Basic6001[mID - 1].MemberName = WName;

                            var res_Position = [];
                            res_Position.push(res_Position_Basic6001[mID - 1]);

                            var WList = model.com.AddText(res_Position_Basicz);

                            var WNum = model.com.getNum(res_Position, res_Position_BasiczList);//得到修改人员所在的排班的位置


                            res_Position_BasiczList[WNum].MemberID = res_Position[0].MemberID;
                            res_Position_BasiczList[WNum].MemberName = res_Position[0].MemberName;

                            var WModelList = model.com.createModeList(WList, res_Position_BasiczList);
                            $.each(WModelList, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_Arrange[p])
                                        continue;
                                    item[p] = Formattrt_Arrange[p](item[p]);
                                }
                            });


                            $("#femi-schedule-tbody").html($com.util.template(WModelList, HTML.ArrangeList));
                            $("#femi-schedule-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                            $(".zace-message").hide();
                            $(".zace-left").show();
                            $(".zace-right").hide();

                            break;
                        case 7001:

                            res_Position_Basic7001[mID - 1].MemberID = WID;
                            res_Position_Basic7001[mID - 1].MemberName = WName;

                            var res_Position = [];
                            res_Position.push(res_Position_Basic7001[mID - 1]);

                            var WList = model.com.AddText(res_Position_Basicz);

                            var WNum = model.com.getNum(res_Position, res_Position_BasiczList);//得到修改人员所在的排班的位置


                            res_Position_BasiczList[WNum].MemberID = res_Position[0].MemberID;
                            res_Position_BasiczList[WNum].MemberName = res_Position[0].MemberName;

                            var WModelList = model.com.createModeList(WList, res_Position_BasiczList);
                            $.each(WModelList, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_Arrange[p])
                                        continue;
                                    item[p] = Formattrt_Arrange[p](item[p]);
                                }
                            });


                            $("#femi-schedule-tbody").html($com.util.template(WModelList, HTML.ArrangeList));
                            $("#femi-schedule-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                            $(".zace-message").hide();
                            $(".zace-left").show();
                            $(".zace-right").hide();

                            break;
                        case 4001:
                            res_Position_Basic4001[mID - 1].MemberID = WID;
                            res_Position_Basic4001[mID - 1].MemberName = WName;

                            var res_Position = [];
                            res_Position.push(res_Position_Basic4001[mID - 1]);

                            var WList = model.com.AddText(res_Position_Basicz);

                            var WNum = model.com.getNum(res_Position, res_Position_BasiczList);//得到修改人员所在的排班的位置


                            res_Position_BasiczList[WNum].MemberID = res_Position[0].MemberID;
                            res_Position_BasiczList[WNum].MemberName = res_Position[0].MemberName;

                            var WModelList = model.com.createModeList(WList, res_Position_BasiczList);
                            $.each(WModelList, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_Arrange[p])
                                        continue;
                                    item[p] = Formattrt_Arrange[p](item[p]);
                                }
                            });


                            $("#femi-schedule-tbody").html($com.util.template(WModelList, HTML.ArrangeList));
                            $("#femi-schedule-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                            $(".zace-message").hide();
                            $(".zace-left").show();
                            $(".zace-right").hide();


                            break;
                        case 7002:
                            res_Position_Basic7002[mID - 1].MemberID = WID;
                            res_Position_Basic7002[mID - 1].MemberName = WName;

                            var res_Position = [];
                            res_Position.push(res_Position_Basic7002[mID - 1]);

                            var WList = model.com.AddText(res_Position_Basicz);

                            var WNum = model.com.getNum(res_Position, res_Position_BasiczList);//得到修改人员所在的排班的位置


                            res_Position_BasiczList[WNum].MemberID = res_Position[0].MemberID;
                            res_Position_BasiczList[WNum].MemberName = res_Position[0].MemberName;

                            var WModelList = model.com.createModeList(WList, res_Position_BasiczList);
                            $.each(WModelList, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_Arrange[p])
                                        continue;
                                    item[p] = Formattrt_Arrange[p](item[p]);
                                }
                            });


                            $("#femi-schedule-tbody").html($com.util.template(WModelList, HTML.ArrangeList));
                            $("#femi-schedule-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                            $(".zace-message").hide();
                            $(".zace-left").show();
                            $(".zace-right").hide();


                            break;
                        case 7004: //没改
                            res_Position_Basic7004[mID - 1].MemberID = WID;
                            res_Position_Basic7004[mID - 1].MemberName = WName;

                            var res_Position = [];
                            res_Position.push(res_Position_Basic7004[mID - 1]);

                            var WList = model.com.AddText(res_Position_Basicz);

                            var WNum = model.com.getNum(res_Position, res_Position_BasiczList);//得到修改人员所在的排班的位置


                            res_Position_BasiczList[WNum].MemberID = res_Position[0].MemberID;
                            res_Position_BasiczList[WNum].MemberName = res_Position[0].MemberName;

                            var WModelList = model.com.createModeList(WList, res_Position_BasiczList);
                            $.each(WModelList, function (i, item) {
                                for (var p in item) {
                                    if (!Formattrt_Arrange[p])
                                        continue;
                                    item[p] = Formattrt_Arrange[p](item[p]);
                                }
                            });


                            $("#femi-schedule-tbody").html($com.util.template(WModelList, HTML.ArrangeList));
                            $("#femi-schedule-tbody tr").each(function (i, item) {
                                var $this = $(this);
                                var colorName = $this.css("background-color");
                                $this.attr("data-color", colorName);



                            });
                            $(".zace-message").hide();
                            $(".zace-left").show();
                            $(".zace-right").hide();

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

                            model.com.postScheduleWorker({
                                shift_id: ShiftID,
                                data: res_Position2,
                            }, function (res) {
                                alert("将操作员 " + mName + " 清除");
                                model.com.refresh();
                            })
                            break;
                        case 1001:
                            res_Position_Basic1001[mID - 1].MemberID = 0;
                            res_Position_Basic1001[mID - 1].MemberName = "";


                            var res_Position22 = [];
                            res_Position22.push(res_Position_Basic1001[mID - 1]);

                            model.com.postScheduleWorker({
                                shift_id: ShiftID,
                                data: res_Position22,
                            }, function (res) {
                                alert("将生产员 " + mName + " 清除");
                                model.com.refresh();
                            })
                            break;
                        case 5001:
                            res_Position_Basic5001[mID - 1].MemberID = 0;
                            res_Position_Basic5001[mID - 1].MemberName = "";

                            var res_Position = [];
                            res_Position.push(res_Position_Basic5001[mID - 1]);

                            model.com.postScheduleWorker({
                                shift_id: ShiftID,
                                data: res_Position,
                            }, function (res) {
                                alert("将巡检员 " + mName + " 清除");
                                model.com.refresh();
                            })
                            break;
                        case 5002:
                            res_Position_Basic5002[mID - 1].MemberID = 0;
                            res_Position_Basic5002[mID - 1].MemberName = "";

                            var res_Position = [];
                            res_Position.push(res_Position_Basic5002[mID - 1]);

                            model.com.postScheduleWorker({
                                shift_id: ShiftID,
                                data: res_Position,
                            }, function (res) {
                                alert("将入库检验员 " + mName + " 清除");
                                model.com.refresh();
                            })
                            break;
                        case 6001:
                            res_Position_Basic6001[mID - 1].MemberID = 0;
                            res_Position_Basic6001[mID - 1].MemberName = "";

                            var res_Position = [];
                            res_Position.push(res_Position_Basic6001[mID - 1]);

                            model.com.postScheduleWorker({
                                shift_id: ShiftID,
                                data: res_Position,
                            }, function (res) {
                                alert("将工艺员 " + mName + " 清除");
                                model.com.refresh();
                            })
                            break;
                        case 7001:
                            res_Position_Basic7001[mID - 1].MemberID = 0;
                            res_Position_Basic7001[mID - 1].MemberName = "";

                            var res_Position = [];
                            res_Position.push(res_Position_Basic7001[mID - 1]);

                            model.com.postScheduleWorker({
                                shift_id: ShiftID,
                                data: res_Position,
                            }, function (res) {
                                alert("将配料员 " + mName + " 清除");
                                model.com.refresh();
                            })
                            break;
                        case 4001:
                            res_Position_Basic4001[mID - 1].MemberID = 0;
                            res_Position_Basic4001[mID - 1].MemberName = "";

                            var res_Position = [];
                            res_Position.push(res_Position_Basic4001[mID - 1]);

                            model.com.postScheduleWorker({
                                shift_id: ShiftID,
                                data: res_Position,
                            }, function (res) {
                                alert("将计量员 " + mName + " 清除");
                                model.com.refresh();
                            })

                            break;
                        case 7002:
                            res_Position_Basic7002[mID - 1].MemberID = 0;
                            res_Position_Basic7002[mID - 1].MemberName = "";

                            var res_Position = [];
                            res_Position.push(res_Position_Basic7002[mID - 1]);

                            model.com.postScheduleWorker({
                                shift_id: ShiftID,
                                data: res_Position,
                            }, function (res) {
                                alert("将收料员 " + mName + " 清除");
                                model.com.refresh();
                            })

                            break;
                        case 7004:
                            res_Position_Basic7004[mID - 1].MemberID = 0;
                            res_Position_Basic7004[mID - 1].MemberName = "";

                            var res_Position = [];
                            res_Position.push(res_Position_Basic7004[mID - 1]);

                            model.com.postScheduleWorker({
                                shift_id: ShiftID,
                                data: res_Position,
                            }, function (res) {
                                alert("将辅料员 " + mName + " 清除");
                                model.com.refresh();
                            })

                            break;
                    }




                });
                //操作员 双击
                $("body").delegate("#femi-schedule-tbody td[data-title=MemberName8001]", "dblclick", function () {
                    $(".zace-message").hide();
                    $(".zace-left").hide();
                    $(".zace-right").show();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = parseInt($this.parent().find("td[data-title=WID]").attr("data-value"));
                    mZaceValue = 8001;
                    mName = name;

                });
                //生产员
                $("body").delegate("#femi-schedule-tbody td[data-title=MemberName1001]", "dblclick", function () {
                    $(".zace-message").hide();
                    $(".zace-left").hide();
                    $(".zace-right").show();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = parseInt($this.parent().find("td[data-title=WID]").attr("data-value"));
                    mZaceValue = 1001;
                    mName = name;



                });

                //巡检员
                $("body").delegate("#femi-schedule-tbody td[data-title=MemberName5001]", "dblclick", function () {
                    $(".zace-message").hide();
                    $(".zace-left").hide();
                    $(".zace-right").show();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = parseInt($this.parent().find("td[data-title=WID]").attr("data-value"));
                    mZaceValue = 5001;
                    mName = name;


                });
                //入库检验员
                $("body").delegate("#femi-schedule-tbody td[data-title=MemberName5002]", "dblclick", function () {
                    $(".zace-message").hide();
                    $(".zace-left").hide();
                    $(".zace-right").show();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = parseInt($this.parent().find("td[data-title=WID]").attr("data-value"));
                    mZaceValue = 5002;
                    mName = name;



                });
                //工艺员
                $("body").delegate("#femi-schedule-tbody td[data-title=MemberName6001]", "dblclick", function () {
                    $(".zace-message").hide();
                    $(".zace-left").hide();
                    $(".zace-right").show();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = parseInt($this.parent().find("td[data-title=WID]").attr("data-value"));
                    mZaceValue = 6001;
                    mName = name;


                });
                //配料员
                $("body").delegate("#femi-schedule-tbody td[data-title=MemberName7001]", "dblclick", function () {
                    $(".zace-message").hide();
                    $(".zace-left").hide();
                    $(".zace-right").show();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = parseInt($this.parent().find("td[data-title=WID]").attr("data-value"));
                    mZaceValue = 7001;
                    mName = name;

                });
                //计量员
                $("body").delegate("#femi-schedule-tbody td[data-title=MemberName4001]", "dblclick", function () {
                    $(".zace-message").hide();
                    $(".zace-left").hide();
                    $(".zace-right").show();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = parseInt($this.parent().find("td[data-title=WID]").attr("data-value"));
                    mZaceValue = 4001;
                    mName = name;

                });
                //收料员
                $("body").delegate("#femi-schedule-tbody td[data-title=MemberName7002]", "dblclick", function () {
                    $(".zace-message").hide();
                    $(".zace-left").hide();
                    $(".zace-right").show();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = parseInt($this.parent().find("td[data-title=WID]").attr("data-value"));
                    mZaceValue = 7002;
                    mName = name;



                });
                //辅料员
                $("body").delegate("#femi-schedule-tbody td[data-title=MemberName7004]", "dblclick", function () {
                    $(".zace-message").hide();
                    $(".zace-left").hide();
                    $(".zace-right").show();

                    var $this = $(this);
                    var name = $this.attr('data-value');
                    mID = parseInt($this.parent().find("td[data-title=WID]").attr("data-value"));
                    mZaceValue = 7004;
                    mName = name;
                });

                //导出
                $("body").delegate("#zace-down-schedule", "click", function () {
                    var $table = $(".zace-table-export"),
                      fileName = "操作排班.xls",
                      Title = "操作排班";
                    var params = $com.table.getExportParams($table, fileName, Title);

                    model.com.getExportExcel(params, function (res) {
                        var src = res.info.path;
                        window.open(src);
                    });


                });


                ////岗位选择
                //$(".zace-position").change(function () {
                //    var value = $(".zace-position").val();
                //    mValue = value;
                //    model.com.getMode(value);
                //});
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


                //查询  zace-search-shiftmode
                $("body").delegate("#zace-search-shiftmode", "click", function () {
                    var default_value = {
                        Time: $com.util.format('yyyy-MM-dd ', new Date()),
                    };
                    $("body").append($com.modal.show(default_value, KETWROD_Template_Arrange, "查询", function (rst) {
                        if (!rst || $.isEmptyObject(rst))
                            return;

                        default_value.Time = $com.util.format('yyyy-MM-dd hh:mm:ss', rst.Time);
                        Time = default_value.Time;
                        model.com.refresh();

                    }));

                });

                //按岗排班    数据与模块中的相对应
                $("body").delegate("#zace-position-order", "click", function () {
                    // res_Position_BasiczList  //排班数据
                    //res_Position_Basic1001zz  1001排班模板中的数据

                    if (res_Position_BasiczList.length < 1) {
                        return;
                    }
                    for (var i = 0; i < res_Position_BasiczList.length; i++) {
                        switch (res_Position_BasiczList[i].ScheduleMode) {
                            case 1001:
                                for (var n = 0; n < res_Position_Basic1001zz.length; n++) {
                                    if (res_Position_BasiczList[i].WorkShopID == res_Position_Basic1001zz[n].PartPoint.WorkShopID &&
                                        res_Position_BasiczList[i].LineID == res_Position_Basic1001zz[n].PartPoint.LineID &&
                                        res_Position_BasiczList[i].PartPointID == res_Position_Basic1001zz[n].PartPoint.PartPointID &&
                                        res_Position_BasiczList[i].PartID == res_Position_Basic1001zz[n].PartPoint.PartID
                                        ) {
                                        res_Position_BasiczList[i].MemberID = res_Position_Basic1001zz[n].MemberID;
                                        res_Position_BasiczList[i].MemberName = res_Position_Basic1001zz[n].MemberName;
                                    }

                                }
                                break;

                            case 8001:
                                for (var m = 0; m < res_Position_Basic8001zz.length; m++) {
                                    if (res_Position_BasiczList[i].WorkShopID == res_Position_Basic8001zz[m].PartPoint.WorkShopID &&
                                        res_Position_BasiczList[i].LineID == res_Position_Basic8001zz[m].PartPoint.LineID &&
                                        res_Position_BasiczList[i].PartPointID == res_Position_Basic8001zz[m].PartPoint.PartPointID &&
                                        res_Position_BasiczList[i].PartID == res_Position_Basic8001zz[m].PartPoint.PartID
                                        ) {
                                        res_Position_BasiczList[i].MemberID = res_Position_Basic8001zz[m].MemberID;
                                        res_Position_BasiczList[i].MemberName = res_Position_Basic8001zz[m].MemberName;
                                    }

                                }
                                break;
                            case 5001:
                                //var W5001list = model.com.schedulePosition(res_Position_BasiczList, res_Position_Basic5001zz);
                                //$("#femi-schedule-tbody").html($com.util.template(W5001list, HTML.ArrangeList));
                                for (var n = 0; n < res_Position_Basic5001zz.length; n++) {
                                    if (res_Position_BasiczList[i].WorkShopID == res_Position_Basic5001zz[n].PartPoint.WorkShopID &&
                                        res_Position_BasiczList[i].LineID == res_Position_Basic5001zz[n].PartPoint.LineID &&
                                        res_Position_BasiczList[i].PartPointID == res_Position_Basic5001zz[n].PartPoint.PartPointID &&
                                        res_Position_BasiczList[i].PartID == res_Position_Basic5001zz[n].PartPoint.PartID
                                        ) {
                                        res_Position_BasiczList[i].MemberID = res_Position_Basic5001zz[n].MemberID;
                                        res_Position_BasiczList[i].MemberName = res_Position_Basic5001zz[n].MemberName;
                                    }

                                }

                                break;
                            case 5002:
                                for (var n = 0; n < res_Position_Basic5002zz.length; n++) {
                                    if (res_Position_BasiczList[i].WorkShopID == res_Position_Basic5002zz[n].PartPoint.WorkShopID &&
                                        res_Position_BasiczList[i].LineID == res_Position_Basic5002zz[n].PartPoint.LineID &&
                                        res_Position_BasiczList[i].PartPointID == res_Position_Basic5002zz[n].PartPoint.PartPointID &&
                                        res_Position_BasiczList[i].PartID == res_Position_Basic5002zz[n].PartPoint.PartID
                                        ) {
                                        res_Position_BasiczList[i].MemberID = res_Position_Basic5002zz[n].MemberID;
                                        res_Position_BasiczList[i].MemberName = res_Position_Basic5002zz[n].MemberName;
                                    }

                                }
                                break;
                            case 6001:
                                for (var n = 0; n < res_Position_Basic6001zz.length; n++) {
                                    if (res_Position_BasiczList[i].WorkShopID == res_Position_Basic6001zz[n].PartPoint.WorkShopID &&
                                        res_Position_BasiczList[i].LineID == res_Position_Basic6001zz[n].PartPoint.LineID &&
                                        res_Position_BasiczList[i].PartPointID == res_Position_Basic6001zz[n].PartPoint.PartPointID &&
                                        res_Position_BasiczList[i].PartID == res_Position_Basic6001zz[n].PartPoint.PartID
                                        ) {
                                        res_Position_BasiczList[i].MemberID = res_Position_Basic6001zz[n].MemberID;
                                        res_Position_BasiczList[i].MemberName = res_Position_Basic6001zz[n].MemberName;
                                    }

                                }
                                break;
                            case 7001:
                                for (var n = 0; n < res_Position_Basic7001zz.length; n++) {
                                    if (res_Position_BasiczList[i].WorkShopID == res_Position_Basic7001zz[n].PartPoint.WorkShopID &&
                                        res_Position_BasiczList[i].LineID == res_Position_Basic7001zz[n].PartPoint.LineID &&
                                        res_Position_BasiczList[i].PartPointID == res_Position_Basic7001zz[n].PartPoint.PartPointID &&
                                        res_Position_BasiczList[i].PartID == res_Position_Basic7001zz[n].PartPoint.PartID
                                        ) {
                                        res_Position_BasiczList[i].MemberID = res_Position_Basic7001zz[n].MemberID;
                                        res_Position_BasiczList[i].MemberName = res_Position_Basic7001zz[n].MemberName;
                                    }

                                }
                                break;
                            case 4001:
                                for (var n = 0; n < res_Position_Basic4001zz.length; n++) {
                                    if (res_Position_BasiczList[i].WorkShopID == res_Position_Basic4001zz[n].PartPoint.WorkShopID &&
                                        res_Position_BasiczList[i].LineID == res_Position_Basic4001zz[n].PartPoint.LineID &&
                                        res_Position_BasiczList[i].PartPointID == res_Position_Basic4001zz[n].PartPoint.PartPointID &&
                                        res_Position_BasiczList[i].PartID == res_Position_Basic4001zz[n].PartPoint.PartID
                                        ) {
                                        res_Position_BasiczList[i].MemberID = res_Position_Basic4001zz[n].MemberID;
                                        res_Position_BasiczList[i].MemberName = res_Position_Basic4001zz[n].MemberName;
                                    }

                                }
                                break;
                            case 7002:
                                for (var n = 0; n < res_Position_Basic7002zz.length; n++) {
                                    if (res_Position_BasiczList[i].WorkShopID == res_Position_Basic7002zz[n].PartPoint.WorkShopID &&
                                        res_Position_BasiczList[i].LineID == res_Position_Basic7002zz[n].PartPoint.LineID &&
                                        res_Position_BasiczList[i].PartPointID == res_Position_Basic7002zz[n].PartPoint.PartPointID &&
                                        res_Position_BasiczList[i].PartID == res_Position_Basic7002zz[n].PartPoint.PartID
                                        ) {
                                        res_Position_BasiczList[i].MemberID = res_Position_Basic7002zz[n].MemberID;
                                        res_Position_BasiczList[i].MemberName = res_Position_Basic7002zz[n].MemberName;
                                    }

                                }
                                break;
                            case 7004:
                                for (var n = 0; n < res_Position_Basic7004zz.length; n++) {
                                    if (res_Position_BasiczList[i].WorkShopID == res_Position_Basic7004zz[n].PartPoint.WorkShopID &&
                                        res_Position_BasiczList[i].LineID == res_Position_Basic7004zz[n].PartPoint.LineID &&
                                        res_Position_BasiczList[i].PartPointID == res_Position_Basic7004zz[n].PartPoint.PartPointID &&
                                        res_Position_BasiczList[i].PartID == res_Position_Basic7004zz[n].PartPoint.PartID
                                        ) {
                                        res_Position_BasiczList[i].MemberID = res_Position_Basic7004zz[n].MemberID;
                                        res_Position_BasiczList[i].MemberName = res_Position_Basic7004zz[n].MemberName;
                                    }

                                }

                                break;
                        }

                    }
                    var WListAll = model.com.AddText(res_Position_Basicz);   //模块
                    var WModelListALL = model.com.createModeList(WListAll, res_Position_BasiczList);   //模块与排班数据的结合
                    $.each(WModelListALL, function (i, item) {
                        for (var p in item) {
                            if (!Formattrt_Arrange[p])
                                continue;
                            item[p] = Formattrt_Arrange[p](item[p]);
                        }
                    });


                    $("#femi-schedule-tbody").html($com.util.template(WModelListALL, HTML.ArrangeList));
                    $("#femi-schedule-tbody tr").each(function (i, item) {
                        var $this = $(this);
                        var colorName = $this.css("background-color");
                        $this.attr("data-color", colorName);



                    });
                });





                //保存   排班界面的保存 按钮  跳转下一个界面
                $("body").delegate("#zace-produce-save", "click", function () {
                    $(".zace-message").show();
                    $(".zace-left").hide();
                    $(".zace-right").hide();

                });

                //返回到排班列表
                $("body").delegate("#zace-exit-shiftandmessage", "click", function () {
                    $(".zace-message").hide();
                    $(".zace-left").show();
                    $(".zace-right").hide();

                });
                //保存排班    所有数据（消息  排班）
                $("body").delegate("#zace-save-shiftandmessage", "click", function () {
                    //model.com.postScheduleWorker({
                    //    shift_id: ShiftID,
                    //    data: res_Position,
                    //}, function (res) {
                    //    $(".zace-message").hide();
                    //    $(".zace-left").show();
                    //    $(".zace-right").hide();
                    //    model.com.refresh();
                    //})
                    model.com.postScheduleWorker({
                        shift_id: ShiftID,
                        data: res_Position_BasiczList,
                    }, function (res) {
                        $(".zace-message").hide();
                        $(".zace-left").show();
                        $(".zace-right").hide();
                        model.com.refresh();
                    })

                });

            },
            run: function () {
                $(".zace-right").hide();
                $(".zace-mode").hide();
                $(".zace-message").hide();
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
                                $("#femi-user-tbody tr").each(function (i, item) {
                                    var $this = $(this);
                                    var colorName = $this.css("background-color");
                                    $this.attr("data-color", colorName);



                                });
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
                            far: null
                        })
                        $.each(item.LineList, function (l_i, l_item) {
                            TypeSource_Arrange.LineID.push({
                                name: l_item.ItemName,
                                value: l_item.ID,
                                far: item.ID
                            })
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

                            model.com.getGroup({}, function (resGroup) {
                                DataAll_group = resGroup.list;
                                $("#zace-modelist").empty();
                                for (var i = 0; i < DataAll_group.length; i++) {
                                    DataAll_group[i].ID = i + 1;

                                    $("#zace-modelist").append("<option value='" + DataAll_group[i].GroupID + "'>" + DataAll_group[i].GroupName + "</option>");

                                }
                                model.com.refresh();
                            });

                        }

                    });
                });


                //为了按岗排班  获取排班模板中的数据
                model.com.getSchedulePosition({ WorkShopID: 1, LineID: 0, Module: 1001, GroupID: 1 }, function (res_position1001z) {
                    res_Position_Basic1001zz = res_position1001z.list;
                    //console.log(res_Position_Basic1001zz[0].PartPoint.PartID);
                    model.com.getSchedulePosition({ WorkShopID: 1, LineID: 0, Module: 8001, GroupID: 1 }, function (res_position8001z) {
                        res_Position_Basic8001zz = res_position8001z.list;

                        model.com.getSchedulePosition({ WorkShopID: 1, LineID: 0, Module: 5001, GroupID: 1 }, function (res_position5001z) {
                            res_Position_Basic5001zz = res_position5001z.list;

                            model.com.getSchedulePosition({ WorkShopID: 1, LineID: 0, Module: 5002, GroupID: 1 }, function (res_position5002z) {
                                res_Position_Basic5002zz = res_position5002z.list;

                                model.com.getSchedulePosition({ WorkShopID: 1, LineID: 0, Module: 6001, GroupID: 1 }, function (res_position6001z) {
                                    res_Position_Basic6001zz = res_position6001z.list;

                                    model.com.getSchedulePosition({ WorkShopID: 1, LineID: 0, Module: 7001, GroupID: 1 }, function (res_position7001z) {
                                        res_Position_Basic7001zz = res_position7001z.list;

                                        model.com.getSchedulePosition({ WorkShopID: 1, LineID: 0, Module: 4001, GroupID: 1 }, function (res_position4001z) {
                                            res_Position_Basic4001zz = res_position4001z.list;

                                            model.com.getSchedulePosition({ WorkShopID: 1, LineID: 0, Module: 7002, GroupID: 1 }, function (res_position7002z) {
                                                res_Position_Basic7002zz = res_position7002z.list;

                                                model.com.getSchedulePosition({ WorkShopID: 1, LineID: 0, Module: 7004, GroupID: 1 }, function (res_position7004z) {
                                                    res_Position_Basic7004zz = res_position7004z.list;




                                                });
                                            });
                                        });
                                    });
                                });

                            });
                        });
                    });

                });


                model.com.getScheduleWorkerPosition({ TaskPartPointID: 36408, Position: 1001 }, function (resw) {
                    var ss = resw.info;
                });


            },
            com: {
                //用户
                getUser: function (data, fn, context) {
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
                getExportExcel: function (data, fn, context) {
                    var d = {
                        $URI: "/Upload/ExportExcel",
                        $TYPE: "post"
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
                        $TYPE: "get"
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
                        $TYPE: "get"
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
                        $TYPE: "get"
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
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //获取排班模板组
                getGroup: function (data, fn, context) {
                    var d = {
                        $URI: "/SchedulePosition/ScheduleGroupAll",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //获取系统消息
                getMessage: function (data, fn, context) {
                    var d = {
                        $URI: "/APSMessage/System",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //消息查询
                getMessageAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSMessage/All",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //添加消息
                postMessage: function (data, fn, context) {
                    var d = {
                        $URI: "/APSMessage/Save",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //获取消息类型
                getMessageType: function (data, fn, context) {
                    var d = {
                        $URI: "/APSMessageManager/TypeAll",
                        $TYPE: "get"
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
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },


                //保存排班排班
                postScheduleWorker: function (data, fn, context) {
                    var d = {
                        $URI: "/ScheduleWorker/Save",
                        $TYPE: "post"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //根据班次获取排班列表
                getScheduleWorkerShift: function (data, fn, context) {
                    var d = {
                        $URI: "/ScheduleWorker/GetByShfit",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //根据岗位和工序任务获取排班列表
                getScheduleWorkerPosition: function (data, fn, context) {
                    var d = {
                        $URI: "/ScheduleWorker/GetByPosition",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //根据人员获取排班列表
                getScheduleWorkerOperator: function (data, fn, context) {
                    var d = {
                        $URI: "/ScheduleWorker/GetByOperator",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取时间段内班次列表
                getScheduleWorkerShiftAll: function (data, fn, context) {
                    var d = {
                        $URI: "/ScheduleWorker/GetShfitAll",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //获取当前班次  
                getScheduleWorkerShiftCur: function (data, fn, context) {
                    var d = {
                        $URI: "/ScheduleWorker/GetShfitCur",
                        $TYPE: "get"
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //根据班次获取工序任务列表  
                getTaskPartPointAll: function (data, fn, context) {
                    var d = {
                        $URI: "/APSTask/PartPointAll",
                        $TYPE: "get"
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

                    //排班全部
                    //根据人员获取排班列表  得到shift_id
                    model.com.getScheduleWorkerOperator({ OperatorID: 52, shift_id: ShiftID, Time: Time }, function (res2) {
                        var zz = res2.list;
                        if (zz.length > 0) {
                            ShiftID = zz[0].ShiftID;
                        }


                        //根据班次获取工序任务列表    模板
                        model.com.getTaskPartPointAll({ WorkShopID: 0, LineID: 0, shift_id: ShiftID }, function (res5) {
                            var zList = res5.list;
                            res_Position_Basicz = $com.util.Clone(res5.list);

                            var _list = model.com.AddText(zList);

                            //根据班次获取排班列表
                            model.com.getScheduleWorkerShift({ WorkShopID: 1, LineID: 0, Time: Time }, function (res) {
                                var zz = res.list;

                                var modelList = model.com.createModeList(_list, zz);

                                $.each(modelList, function (i, item) {
                                    for (var p in item) {
                                        if (!Formattrt_Arrange[p])
                                            continue;
                                        item[p] = Formattrt_Arrange[p](item[p]);
                                    }
                                });

                                res_Position_BasiczList = $com.util.Clone(res.list);
                                $("#femi-schedule-tbody").html($com.util.template(modelList, HTML.ArrangeList));
                                $("#femi-schedule-tbody tr").each(function (i, item) {
                                    var $this = $(this);
                                    var colorName = $this.css("background-color");
                                    $this.attr("data-color", colorName);



                                });


                                model.com.getMessageAll({ shift_id: ShiftID }, function (reszzz) {
                                    if (!reszzz)
                                        return;
                                    PartListmessagepart = reszzz.list;
                                    PartList_Basic_messagepart = $com.util.Clone(reszzz.list);
                                    //  var messageList = model.com.createMessage(PartList_Basic_messagepart);
                                    $.each(PartList_Basic_messagepart, function (i, item) {
                                        for (var p in item) {
                                            if (!FORMATTRT_message[p])
                                                continue;
                                            item[p] = FORMATTRT_message[p](item[p]);
                                        }
                                    });
                                    for (var i = 0; i < PartList_Basic_messagepart.length; i++) {
                                        PartList_Basic_messagepart[i].WID = i + 1;
                                    }
                                    $("#femi-schedule-message").html($com.util.template(PartList_Basic_messagepart, HTML.TableMessageNode));
                                    $("#femi-schedule-message tr").each(function (i, item) {
                                        var $this = $(this);
                                        var colorName = $this.css("background-color");
                                        $this.attr("data-color", colorName);



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

                        _arr = item.PartPointList
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

                //暂缓
                createMessage: function (list) {
                    var _list = [];    //多参数吧     级别   类型
                    $.each(list, function (i, item) {

                        var _temp = $com.util.Clone(DataMessageTemp);
                        _temp.ModuleID = 1;
                        _temp.Message = item.Message;
                        _temp.Grade = 4;
                        _temp.Type = 3;
                        _temp.Status = 1;

                        _list.push(_temp);


                    });
                    return _list;
                },

                //工序表 和 排班 合二为一
                createModeList: function (_list, zList) {
                    res_Position_Basic1001 = [];
                    res_Position_Basic8001 = [];
                    res_Position_Basic5001 = [];
                    res_Position_Basic5002 = [];
                    res_Position_Basic6001 = [];
                    res_Position_Basic7001 = [];
                    res_Position_Basic4001 = [];
                    res_Position_Basic7002 = [];
                    res_Position_Basic7004 = [];
                    for (var j = 0; j < _list.length; j++) {
                        for (var i = 0; i < zList.length; i++) {
                            switch (zList[i].ScheduleMode) {
                                case 1001:
                                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {
                                        _list[j].MemberName1001 = zList[i].MemberName;
                                        res_Position_Basic1001.push(zList[i]);

                                    }
                                    break;
                                case 8001:
                                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {

                                        _list[j].MemberName8001 = zList[i].MemberName;
                                        res_Position_Basic8001.push(zList[i]);

                                    }
                                    break;
                                case 5001:
                                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {

                                        _list[j].MemberName5001 = zList[i].MemberName;
                                        res_Position_Basic5001.push(zList[i]);

                                    }
                                    break;
                                case 5002:
                                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {

                                        _list[j].MemberName5002 = zList[i].MemberName;
                                        res_Position_Basic5002.push(zList[i]);

                                    }
                                    break;
                                case 6001:
                                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {

                                        _list[j].MemberName6001 = zList[i].MemberName;
                                        res_Position_Basic6001.push(zList[i]);

                                    }
                                    break;
                                case 7001:
                                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {

                                        _list[j].MemberName7001 = zList[i].MemberName;
                                        res_Position_Basic7001.push(zList[i]);

                                    }
                                    break;
                                case 4001:
                                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {

                                        _list[j].MemberName4001 = zList[i].MemberName;
                                        res_Position_Basic4001.push(zList[i]);

                                    }
                                    break;
                                case 7002:
                                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {

                                        _list[j].MemberName7002 = zList[i].MemberName;
                                        res_Position_Basic7002.push(zList[i]);

                                    }
                                    break;
                                case 7004:
                                    if (_list[j].WorkShopID == zList[i].WorkShopID && _list[j].LineID == zList[i].LineID && _list[j].PartID == zList[i].PartID && _list[j].PartPointID == zList[i].PartPointID) {

                                        _list[j].MemberName7004 = zList[i].MemberName;
                                        res_Position_Basic7004.push(zList[i]);

                                    }
                                    break;

                            }


                        }
                    }
                    return _list;

                },
                getNum: function (res_Position1, res_Position2) {
                    for (var i = 0; i < res_Position2.length; i++) {

                        if (res_Position1[0].WorkShopID == res_Position2[i].WorkShopID &&
                            res_Position1[0].LineID == res_Position2[i].LineID &&
                            res_Position1[0].PartID == res_Position2[i].PartID &&
                            res_Position1[0].PartPointID == res_Position2[i].PartPointID &&
                            res_Position1[0].ScheduleMode == res_Position2[i].ScheduleMode
                            ) {
                            return i;
                        }
                    }
                },

                AddText: function (list) {
                    var _list = $com.util.Clone(list);
                    for (var i = 0; i < _list.length; i++) {
                        _list[i].WID = i + 1;
                        _list[i].MemberName8001 = "";
                        _list[i].MemberName1001 = "";
                        _list[i].MemberName5001 = "";
                        _list[i].MemberName5002 = "";
                        _list[i].MemberName6001 = "";
                        _list[i].MemberName7001 = "";
                        _list[i].MemberName4001 = "";
                        _list[i].MemberName7002 = "";
                        _list[i].MemberName7004 = "";
                    }
                    return _list;
                },

                //default
                schedulePosition: function (res_Position_BasiczList, resw) {
                    for (var i = 0; i < res_Position_BasiczList.length; i++) {
                        for (var m = 0; m < resw.length; m++) {
                            if (res_Position_BasiczList[i].WorkShopID == resw[m].PartPoint.WorkShopID &&
                                res_Position_BasiczList[i].LineID == resw[m].PartPoint.LineID &&
                                res_Position_BasiczList[i].PartPointID == resw[m].PartPoint.PartPointID &&
                                res_Position_BasiczList[i].PartID == resw[m].PartPoint.PartID
                                ) {
                                res_Position_BasiczList[i].MemberID = resw[m].MemberID;
                                res_Position_BasiczList[i].MemberName = resw[m].MemberName;
                            }

                        }
                    }
                    var WList = model.com.AddText(res_Position_Basicz);   //模块
                    var WModelList = model.com.createModeList(WList, res_Position_BasiczList);   //模块与排班数据的结合
                    $.each(WModelList, function (i, item) {
                        for (var p in item) {
                            if (!Formattrt_Arrange[p])
                                continue;
                            item[p] = Formattrt_Arrange[p](item[p]);
                        }
                    });
                    return WModelList;
                },
            },
        });
        model.init();
    });