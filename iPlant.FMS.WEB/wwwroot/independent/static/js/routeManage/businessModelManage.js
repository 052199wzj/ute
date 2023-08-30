require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview', ], function ($zace, $com, $tree) {
    var dataTree,
        DataTable,
        DataUser,
        treeID,
        tableShow,
        $farID,
        DataDefined,
        dataTask,
        dataBillAll,
        AllUser,
        defineID,
        //终端类型
        ClientType = 0,
        //节点
        lmvtActivitID,
        //流程定义
        lmvtprocessDefinitionId,

        mRoleID,
        dataAllTask,
        $tree_val,
        first_defineID;

    var HTML = {
        TableTaskItemMode: [
            '<tr>',
            // '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            // '<td data-title="FormName" data-value="{{FormName}}" >{{FormName}}</td>',
            // '<td data-title="RoleName" data-value="{{RoleName}}" >{{RoleName}}</td>',
            //'<td data-title="IsBind" data-value="{{IsBind}}" >{{IsBind}}</td>',
            '<td data-toggle="tooltip" title="{{UserList}}" class="cby-userlist" data-title="UserList" data-value="{{UserList}}" >{{UserList}}</td>',
            '<td data-toggle="tooltip" title="{{Recipients}}" class="cby-userlist" data-title="Recipients" data-value="{{Recipients}}" >{{Recipients}}</td>',
            '<td style="display:none" data-title="ProcessDefinitionId" data-value="{{ProcessDefinitionId}}" >{{ProcessDefinitionId}}</td>',
            '<td style="display:none" data-title="ProdefinVersion" data-value="{{ProdefinVersion}}" >{{ProdefinVersion}}</td>',
            //'<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td style="min-width: 30px;max-width: 120px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-add-bill" >属性配置</span> <span class="td-contain-list" id="cby-query-user" >人员列表</span><span class="td-contain-list" id="cby-route-charf-show" >流程图</span></div> </td>  ',
            '</tr>',
        ].join(""),

        TreeItemNode: [
             '<li data-titie="{{ID}}"  data-value="{{ID}}" data-key="{{Key}}">',
           '<span style="vertical-align:top;" data-value="{{ID}}"}" >{{Name}}</span> ',
           '<ul>{{Items}}',
           '</ul>',
           '</li>',
        ].join(""),
        UserList: [
            '<tr>',
              '<td style="width: 3px"><input type="checkbox"',
            'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            // '<td data-title="RoleName" data-value="{{RoleName}}" >{{RoleName}}</td>',
            '<td data-title="Type" data-value="{{Type}}" >{{Type}}</td>',
            '</tr>',
        ].join(""),
        WidgetList: [
           '<tr>',
             '<td style="width: 3px"><input type="checkbox"',
           'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
          '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
         '<td data-title="ButtonId" data-value="{{ButtonId}}" >{{ButtonId}}</td>',
         '<td data-title="ButtonName" data-value="{{ButtonName}}" >{{ButtonName}}</td>',
        '<td data-title="WidgetTypeName" data-value="{{WidgetTypeName}}" >{{WidgetTypeName}}</td>',
         '<td data-title="Remark" data-value="{{Remark}}" >{{Remark}}</td>',
          '<td data-title="IsHide" data-value="{{IsHide}}" >{{IsHide}}</td>',
           '</tr>',
        ].join(""),

    }
    var KEYWORD_BillItem_LIST,
        KEYWORD_BillItem,
        FORMATTRT_BillItem,
        TypeSource_BillItem,
        DEFAULT_VALUE_Bill,

        KEYWORD_TaskItem_LIST,
        KEYWORD_TaskItem,
        FORMATTRT_TaskItem,
        TypeSource_TaskItem,
        DEFAULT_VALUE_Task;

    $(function () {
        KEYWORD_BillItem_LIST = [
            "ID|编号",
            "Name|名称",
            "FarID|树ID",     
        ];
        KEYWORD_BillItem = {};
        FORMATTRT_BillItem = {};
        DEFAULT_VALUE_Bill={
            Name:"",
        }

        TypeSource_BillItem = {
            Name:[
                {
                    name: "",
                    value: 1
                },
            ],
        };

        $.each(KEYWORD_BillItem_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_BillItem[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_BillItem[detail[0]] = $com.util.getFormatter(TypeSource_BillItem, detail[0], detail[2]);
            }
        });
    });

    $(function () {
        KEYWORD_TaskItem_LIST = [
            // "ClientType|类型|ArrayOne",
            // "FormID|表单|ArrayOne",
            "RoleID|候选人角色|ArrayOne",
            "UserID|候选人列表|Array",
            "NoticeRoleID|通知人角色|ArrayOne",
            "NoticeUserID|通知人列表|Array",
            // "HideWidget|隐藏控件|Array",
            //"IsSyncUsers|人员信息同步到其他终端|ArrayOne",
            // "IsSyncControls|控件信息同步到其他终端|ArrayOne",
        ];
        KEYWORD_TaskItem = {};
        FORMATTRT_TaskItem = {};
        DEFAULT_VALUE_Task={}

        TypeSource_TaskItem = {
            //IsSyncUsers: [
            //    {
            //        name: "否",
            //        value: 0
            //    },
            //    {
            //        name: "是",
            //        value: 1
            //    },
            //],
            // IsSyncControls: [
            //     {
            //         name: "否",
            //         value: 0
            //     },
            //     {
            //         name: "是",
            //         value: 1
            //     },
            // ],
            // FormID: [
            //     {
            //         name: "无",
            //         value: 0
            //     },
            // ],
            RoleID: [
                 {
                    name: "无",
                    value: 0,
                 },
            ],
            UserID: [
                {
                    name: "无",
                    value: "",
                 },
            ],
            NoticeRoleID: [
                {
                    name: "无",
                    value: 0,
                 },
            ],
            NoticeUserID: [
                {
                    name: "无",
                    value: "",
                 },
            ],
            // HideWidget: [],
            // ClientType: [
            //     {
            //         name: "网页端",
            //         value: 0
            //     },
            //     {
            //         name: "移动端",
            //         value: 1
            //     },
            //     //{
            //     //    name: "客户端",
            //     //    value: 2
            //     //},
            // ]
        };

        $.each(KEYWORD_TaskItem_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_TaskItem[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_TaskItem[detail[0]] = $com.util.getFormatter(TypeSource_TaskItem, detail[0], detail[2]);
            }
        });
    });

    

    model = $com.Model.create({
        name: '流程设计',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },
        run: function () {
            $("#routeTree").bind("contextmenu", function () {
                return false;
            })
            $com.app.loading("正在加载配置！");
            model.com.getItemTree({}, function (resT) {
                model.com.getDefineList({}, function (res) {
                    DataDefined = res.list;
                    // DataDefined = model.com.getMaxVersion(res.list);
                    DataUser = window.parent._UserAll;
                    dataTree = resT.list;
                    model.com.refreshTree();
                    model.com.refreshColorTree();
                    model.com.getBillAll({}, function (res) {
                        dataBillAll = res.list;
                        // model.com.getAllTask({ ClientType: ClientType }, function (res) {
                        //     dataAllTask = res.list;
                         
                            //预加载人员
                            model.com.getUser({ active: 1 }, function (res) {
                            //     TypeSource_TaskItem.UserID=[
                            //         {
                            //             name: "无",
                            //             value: "",
                            //          },
                            //     ]
                                if (res && res.list) {
                                    AllUser = res.list
                                    // for (var j = 0; j < AllUser.length; j++) {
                                    //     TypeSource_TaskItem.UserID.push({ name: AllUser[j].Name, value: AllUser[j].ID });
                                    // }
                                }
                                model.com.refreshAllTask();
                                model.com.load();
                                $com.app.loaded();
                            });
                        // });
                    });
                });
            });
       


        },
        events: function () {
            //查看全部
            $("body").delegate("#lmvt-searchall", "click", function () {
                model.com.refreshAllTask();
            });
            //web视图 
            $("body").delegate("#lmvt-web", "click", function () {
                $(".lmvt-changeOption").text("PC端");
                ClientType = 0;
                if (typeof (treeID) == "undefined") {
                    model.com.refreshAllTask();
                } else {
                    model.com.getTask(treeID);
                }

            });
            //app视图 
            $("body").delegate("#lmvt-app", "click", function () {
                $(".lmvt-changeOption").text("移动端");
                ClientType = 1;
                if (typeof (treeID) == "undefined") {
                    model.com.refreshAllTask();
                } else {
                    model.com.getTask(treeID);
                }
            });
            //隐藏人员列表cby-query-widget
            $("body").delegate("#femi-hide-property1", "click", function () {
                $(".iplant-tool-right").hide(); 
                $(".lmvt-container-supplier").hide();
                $(".lmvt-container-widget").hide();
                $(".iplant-tool-right").css("width", "0px");
                $(".iplant-tool-center").css("margin-right", "0px");
            });
            $("body").delegate("#cby-query-widget", "click", function () {
                $(".iplant-tool-right").show();
                $(".lmvt-container-supplier").hide();
                $(".lmvt-container-widget").show();
                $(".lmvt-container-charf").hide();
                $(".iplant-tool-right").css("width", "500px");
                $(".iplant-tool-center").css("margin-right", "500px");

                var $tdList = $(this).closest("td").parent("tr").children("td");

                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ProdefinVersion") {
                        var ProdefinVersion = $tdList.eq(i).next().attr("data-value");
                    }
                    if ($tdList.eq(i).next().attr("data-title") == "ProcessDefinitionId") {
                        var ProcessDefinitionId = $tdList.eq(i).next().attr("data-value");
                    }
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        var taskID = $tdList.eq(i).next().attr("data-value");
                    }
                }
                $.each(dataAllTask, function (i, item) {
                    if (item.ID == taskID && item.ProdefinVersion == ProdefinVersion && item.ProcessDefinitionId == ProcessDefinitionId) {
                        var _currentData= item;
                    }
                });
                //添加表单选项
                model.com.searchBill({ processDefinitionId: ProcessDefinitionId, ActivitID: taskID, ClientType: ClientType }, function (res) {
                    var _thisData = res.info;
                    if (!_thisData.FormID) {
                        alert("未绑定单据，无法进行此操作！");
                        $(".iplant-tool-right").hide();
                        $(".lmvt-container-supplier").hide();
                        $(".lmvt-container-widget").hide();
                        $(".iplant-tool-right").css("width", "0px");
                        $(".iplant-tool-center").css("margin-right", "0px");
                        return false;
                    } else {
                        $("#lmvt-widget-title").html("控件列表（" + _thisData.Name + ")");
                        model.com.getWidgetByFormID({
                            FormID: _thisData.FormID
                        }, function (res) {
                            if (res.list && res) {
                                var _widgetList = res.list;
                                var _list= model.com.getArray(_thisData.HideWidget);
                                for (var i = 0; i < _widgetList.length; i++) {
                                    for (var j = 0; j < _list.length; j++) {
                                        if (_widgetList[i].ID == parseInt(_list[j])) {
                                            _widgetList[i].IsHide = "是";
                                        }
                                    }
                                }
                                for (var i = 0; i < _widgetList.length; i++) {
                                    if (!_widgetList[i].IsHide) {
                                        _widgetList[i].IsHide = "否";
                                    }
                                }
                                $(".lmvt-widget-body").html($com.util.template(_widgetList, HTML.WidgetList));
                            }
                        });
                    }

            });
           
            });
            //人员列表cby-query-user femi-hide-property1
            $("body").delegate("#cby-query-user", "click", function () {
                $(".iplant-tool-right").show();
                $(".lmvt-container-supplier").show();
                $(".lmvt-container-widget").hide();
                $(".lmvt-container-charf").hide();
                $(".iplant-tool-right").css("width", "500px");
                $(".iplant-tool-center").css("margin-right", "500px");
                var $tdList = $(this).closest("td").parent("tr").children("td");

                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ProdefinVersion") {
                        var ProdefinVersion = $tdList.eq(i).next().attr("data-value");
                    }
                    if ($tdList.eq(i).next().attr("data-title") == "ProcessDefinitionId") {
                        var ProcessDefinitionId = $tdList.eq(i).next().attr("data-value");
                    }
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        var taskID = $tdList.eq(i).next().attr("data-value");
                    }
                }
                $(".cby-show-user-title").html("角色人员（"+taskID+")");
                $.each(dataAllTask, function (i, item) {
                    if (item.ID == taskID && item.ProdefinVersion == ProdefinVersion && item.ProcessDefinitionId == ProcessDefinitionId) {
                        var _currentData= item;
                    }
                });
                // 添加表单选项
                model.com.searchBill({ processDefinitionId: ProcessDefinitionId, ActivitID: taskID, ClientType: ClientType }, function (res) {
                    var _thisData = res.info;
                    //if (!_thisData.FormID) {
                    //    alert("未绑定单据，无法进行此操作！");
                    //    return false;
                    //} else {
                    //    model.com.getWidgetByFormID({
                    //        FormID: _thisData.FormID
                    //    }, function (res) {
                    //        if (res.list && res) {
                    //            var _widgetList = res.list;
                    //            $(".lmvt-widget-body").html($com.util.template(_widgetList, HTML.WidgetList));
                    //        }
                    //    });
                    //}
                    // var _userList = model.com.getArray(_thisData.UserList);
                    var _userList ;
                    model.com.getUserList({processDefinitionId:ProcessDefinitionId},function(res){
                        var infoObj=res.info,
                            _userList=[],
                            assignee,
                            Recipients;
                        for(var key in infoObj){
                            if(key==taskID){
                                _userList=infoObj[key].CandidateUsers;
                                assignee=infoObj[key].Assignee;
                                Recipients=infoObj[key].Recipients;
                            }
                        }
                        var _templateData = [];
                        // 通知人
                        if(Recipients!=null){
                            for (var i = 0; i < Recipients.length; i++) {
                                for (var j = 0; j < AllUser.length; j++) {
                                    if (parseInt(Recipients[i]) == AllUser[j].ID) {
                                        _templateData.push({ 
                                            ID: AllUser[j].ID, 
                                            Name: AllUser[j].Name, 
                                            // RoleName: _thisData.RoleName, 
                                            Type: "通知人" 
                                        })
                                    }
                                }
                            }
                        }
                        // 代理人
                        if(assignee!=null){
                            if($.isNumeric(assignee)==true){
                                for (var j = 0; j < AllUser.length; j++) {
                                    if(AllUser[j].ID==parseInt(assignee)){
                                        _templateData.push({ 
                                            ID: assignee, 
                                            Name: AllUser[j].Name, 
                                            // RoleName: _thisData.RoleName, 
                                            Type: "代理人" 
                                        })
                                    }
                                }
                            }else if($.isNumeric(assignee)==false){
                                _templateData.push({ 
                                    ID: 0, 
                                    Name: assignee ,
                                    // RoleName: _thisData.RoleName, 
                                    Type: "代理人变量" 
                                })
                            }
                            
                            
                        }
                        // 候选人
                        if (_userList && _userList.length > 0) {
                            for (var i = 0; i < _userList.length; i++) {
                                if($.isNumeric(_userList[i])==true){
                                    for (var j = 0; j < AllUser.length; j++) {
                                        if (parseInt(_userList[i]) == AllUser[j].ID) {
                                            _templateData.push({ 
                                                ID: AllUser[j].ID, 
                                                Name: AllUser[j].Name, 
                                                // RoleName: _thisData.RoleName, 
                                                Type: "候选人" 
                                            })
                                        }
                                    }
                                }else if($.isNumeric(_userList[i])==false){
                                    _templateData.push({ 
                                        ID: "", 
                                        Name: _userList[i], 
                                        // RoleName: _thisData.RoleName, 
                                        Type: "候选人变量" 
                                    })
                                }
                                
                            }
                        }
                        $(".lmvt-supplier-body").html($com.util.template(_templateData, HTML.UserList));
                    });
                    
                });
            });
            //右键事件
            $("body").delegate("#routeTree li","mousedown",function(e){
                if (3 == e.which) {
                    // console.log("你点了右键");
                    if($("#cby-tree-tooltip").length > 0){
                        $("#cby-tree-tooltip").remove();
                    }
                    var tooltipHtml='<ul class="cby-tree-tooltip"id="cby-tree-tooltip"><li class="cby-border-class" id="cby-add-class"><span>新增</span></li><li class="cby-border-class" id="cby-edit-class"><span>修改</span></li><li class="cby-delete-class"id="cby-delete-class"><span>删除</span></li></ul>';
                    $(this).children(":first").prepend(tooltipHtml);
                    $farID=$(this).attr("data-value");
                    $tree_val=$(this).children("span").text();
                    return false;
                }
            });
            $("body").delegate(".cby-tree-remove","click",function(){
                if($("#cby-tree-tooltip").length > 0){
                    $("#cby-tree-tooltip").remove();   
                }
            })
            
            //右键新增事件
            $("body").delegate("#cby-add-class","click",function(){
                // var $farID=$(this).attr("data-value");
                DEFAULT_VALUE_Bill={
                    Name:""
                }
                $("body").append($com.modal.show(DEFAULT_VALUE_Bill, KEYWORD_BillItem, "新增", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var
                        newObj={};
                    newObj={
                        ID:0,
                        Name:rst.Name,
                        FarID:$farID
                    }
                    if(newObj.Name==""){
                        alert("分类名不可为空！！")
                        model.com.refreshAllTask();
                        $("#cby-tree-tooltip").remove();
                    }else{
                        model.com.addItemTable({
                            data: newObj
                        }, function (res) {
                            model.com.getItemTree({}, function (resT) {
                                dataTree = resT.list;
                                alert("新增成功");
                                model.com.refreshTree();
                                model.com.refreshAllTask();
                                $("#cby-tree-tooltip").remove();
                            });
                        });
                    }
                }, TypeSource_BillItem));
            });
            //右键修改事件
            $("body").delegate("#cby-edit-class","click",function(){

                DEFAULT_VALUE_Bill={
                    Name:$tree_val
                }
                $("body").append($com.modal.show(DEFAULT_VALUE_Bill, KEYWORD_BillItem, "修改", function (rst) {
                    var _$ID,_$farID;
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    $.each(dataTree,function(i,item){
                        if(item.ID==$farID){
                            _$ID=item.ID,
                            _$farID=item.FarID;
                            return false;
                        }
                    });

                    var newObj={};
                    newObj={
                        ID:_$ID,
                        Name:rst.Name,
                        FarID:_$farID
                    }
                    if(newObj.Name==""){
                        alert("分类名不可为空！！")
                        model.com.refreshAllTask();
                        $("#cby-tree-tooltip").remove();
                    }else{
                        model.com.addItemTable({
                            data: newObj
                        }, function (res) {
                            model.com.getItemTree({}, function (resT) {
                                dataTree = resT.list;
                                alert("修改成功");
                                model.com.refreshTree();
                                model.com.refreshAllTask();
                                $("#cby-tree-tooltip").remove();
                            });
                        });
                    }
                }, TypeSource_BillItem));
            });
            //刷新树
            $("body").delegate("#cby-refresh-treeItem","click",function(){
                model.com.getItemTree({},function(resT){
                    dataTree=resT.list;
                    model.com.refreshTree();
                });
            });
            //获取表格
            $("body").delegate("#routeTree li", "click", function () {
                $("#routeTree").find("li").each(function () {
                    if ($(this).attr("data-key") == "define") {

                        $(this).css("color", "#1BA926");
                        $(this).children("span").removeClass("current");
                    } else if ($(this).attr("data-key") == "tree") {
                        $(this).css("font-weight", "bold");
                        $(this).children("span").removeClass("current");
                    }
                })
            
                var $id = $(this).attr("data-titie"),
                $flag = $(this).attr("data-key");
                $(this).children("span").addClass("current");
                $("#tzj_title").html("流程节点（"+$(this).children("span").html()+")");
                defineID = $id;
                var $src = $com.imageUrl + "/MESBPM/api/Leave/Image2defin?processDefinitionId=" + defineID;
                $("#cby-route-charf img").attr("src", $src);
                if ($flag == "define") {
                    model.com.getTask($id);
                    var name=$(this).children("span").html(),
                        _name=name.substring(0,$(this).children("span").html().indexOf("("))
                    $("#tzj_title").html(_name+"("+defineID+")");
                    treeID = $id;
                    return false;
                }
            });
            //模糊查询
            $("body").delegate("#cby-aroundSearch-table", "change", function () {
                var $this = $(this),
                    value = $(this).val();
                
                if (value == undefined || value == "" || value.trim().length < 1) {
                    $("#cby-tbody-designTable").children("tr").show();
                }
                else
                    $com.table.filterByLikeString($("#cby-tbody-designTable"), tableShow, value, "OrderID");
            });
            //监听修程(角色)
            $("body").delegate(".modal .femi-modal-body .femi-modal-item select#modal_select_RoleID", "change", function (e) {

                var $this = $(this),
                    name = $this.attr("data-name"),
                    value = $this.val();
                mRoleID = value;

                var $MaterialSelect = $("#modal_select_UserID");
                var $MaterialUL_DIV = $MaterialSelect.closest(".femi-modal-item").find(".dropdown-menu.open ul.dropdown-menu.inner.selectpicker ");
                var SELECT_OPTION_HTML = '<option value="{{value}}" selected="selected">{{name}}</option>';
                var SELECT_LI_HTML = ['<li rel="{{value}}"><a tabindex="0" class="" style=""><span class="text">{{name}}</span><i class="glyphicon glyphicon-ok icon-ok check-mark"></i></a></li>'].join("");

                if (mRoleID != "0") {
                    model.com.getRoleUser({
                        role_id: mRoleID
                    }, function (res) {
                        if (res.list.length > 0) {
                            var _userList = res.list;
                            TypeSource_TaskItem.UserID = [];//清空数据
                            for (var j = 0; j < _userList.length; j++) {
                                TypeSource_TaskItem.UserID.push({ name: _userList[j].Text, value: _userList[j].FunctionID });
                            }
                        }
                        $MaterialSelect.empty();
                        $MaterialSelect.append($com.util.template(TypeSource_TaskItem.UserID, SELECT_OPTION_HTML));
                        $MaterialSelect.selectpicker('render');
                        $MaterialSelect.selectpicker('refresh');
                        $MaterialSelect.selectpicker();
                        //$MaterialSelect.html($com.util.template(TypeSource_TaskItem.UserID, SELECT_OPTION_HTML));
                        //$MaterialUL_DIV.html($com.util.template(TypeSource_TaskItem.UserID, SELECT_LI_HTML));

                        //$MaterialSelect.next().selectpicker('refresh');
                        ////render方法强制重新渲染引导程序 - 选择ui。
                        //$MaterialSelect.next().selectpicker('render');
                        //$MaterialSelect.next().selectpicker('val', ['noneSelectedText'])
                        //$MaterialSelect.next().selectpicker('refresh');
                    });
                } else {
                    TypeSource_TaskItem.UserID = [
                        {
                            name: "无",
                            value: "",
                         },
                    ];
                    //清空数据
                    $MaterialSelect.empty();
                    $MaterialSelect.append($com.util.template(TypeSource_TaskItem.UserID, SELECT_OPTION_HTML));
                    $MaterialSelect.selectpicker('render');
                    $MaterialSelect.selectpicker('refresh');
                    $MaterialSelect.selectpicker();
                    //$MaterialSelect.next().selectpicker('refresh');
                    ////render方法强制重新渲染引导程序 - 选择ui。
                    //$MaterialSelect.next().selectpicker('render');
                    //$MaterialSelect.next().selectpicker('val', ['noneSelectedText'])
                }
            });
            //监听修程(通知)
            $("body").delegate(".modal .femi-modal-body .femi-modal-item select#modal_select_NoticeRoleID", "change", function (e) {

                var $this = $(this),
                    name = $this.attr("data-name"),
                    value = $this.val();
                    mRoleID = value;

                var $MaterialSelect = $("#modal_select_NoticeUserID");
                var $MaterialUL_DIV = $MaterialSelect.closest(".femi-modal-item").find(".dropdown-menu.open ul.dropdown-menu.inner.selectpicker ");
                var SELECT_OPTION_HTML = '<option value="{{value}}" selected="selected"   >{{name}}</option>';
                var SELECT_LI_HTML = ['<li rel="{{value}}"><a tabindex="0" class="" style=""><span class="text">{{name}}</span><i class="glyphicon glyphicon-ok icon-ok check-mark"></i></a></li>'].join("");

                if (mRoleID != "0") {
                    model.com.getRoleUser({
                        role_id: mRoleID
                    }, function (res) {
                        if (res.list.length > 0) {
                            var _userList = res.list;
                            TypeSource_TaskItem.NoticeUserID = [];//清空数据
                            for (var j = 0; j < _userList.length; j++) {
                                TypeSource_TaskItem.NoticeUserID.push({ name: _userList[j].Text, value: _userList[j].FunctionID });
                            }
                        }
                        $MaterialSelect.empty();
                        $MaterialSelect.append($com.util.template(TypeSource_TaskItem.NoticeUserID, SELECT_OPTION_HTML));
                        $MaterialSelect.selectpicker('render');
                        $MaterialSelect.selectpicker('refresh');
                        $MaterialSelect.selectpicker();
                        //$MaterialSelect.html($com.util.template(TypeSource_TaskItem.UserID, SELECT_OPTION_HTML));
                        //$MaterialUL_DIV.html($com.util.template(TypeSource_TaskItem.UserID, SELECT_LI_HTML));

                        //$MaterialSelect.next().selectpicker('refresh');
                        ////render方法强制重新渲染引导程序 - 选择ui。
                        //$MaterialSelect.next().selectpicker('render');
                        //$MaterialSelect.next().selectpicker('val', ['noneSelectedText'])
                        //$MaterialSelect.next().selectpicker('refresh');
                    });
                } else {
                    var _userList = AllUser;
                    TypeSource_TaskItem.NoticeUserID = [
                        {
                            name: "无",
                            value: "",
                         },
                    ];
                    //清空数据
                    // for (var j = 0; j < _userList.length; j++) {
                    //     TypeSource_TaskItem.NoticeUserID.push({ name: _userList[j].Name, value: _userList[j].ID });
                    // }
                    $MaterialSelect.empty();
                    $MaterialSelect.append($com.util.template(TypeSource_TaskItem.NoticeUserID, SELECT_OPTION_HTML));
                    $MaterialSelect.selectpicker('render');
                    $MaterialSelect.selectpicker('refresh');
                    $MaterialSelect.selectpicker();
                    //$MaterialSelect.next().selectpicker('refresh');
                    ////render方法强制重新渲染引导程序 - 选择ui。
                    //$MaterialSelect.next().selectpicker('render');
                    //$MaterialSelect.next().selectpicker('val', ['noneSelectedText'])
                }
            });
            //监听客户端类型
            $("body").delegate(".modal .femi-modal-body .femi-modal-item select#modal_select_ClientType", "change", function (e) {
                var $this = $(this);
                ClientType = $this.val();

                var $MaterialSelectUserID = $("#modal_select_UserID"),
                    $MaterialSelectRoleID = $("#modal_select_RoleID"),
                    SELECT_OPTION_HTML_UserID1 = '<option value="{{value}}" selected="{{selected}}" >{{name}}</option>',
                    SELECT_OPTION_HTML_RoleID = '<option value="{{value}}"   >{{name}}</option>',
                    $MaterialSelectHideWidget = $("#modal_select_HideWidget"),
                    $MaterialSelectFormID = $("#modal_select_FormID");

                var FormList = [{ name: "无", value: 0 }];
                $.each(dataBillAll, function (i,item) {
                    if (item.Type == ClientType) {
                        FormList.push({
                            name: item.Name,
                            value: item.ID,
                        })
                    }
                });

                $MaterialSelectFormID.empty();
                $MaterialSelectFormID.append($com.util.template(FormList, SELECT_OPTION_HTML_UserID1));
                $MaterialSelectFormID.selectpicker('render');
                $MaterialSelectFormID.selectpicker('refresh');
                $MaterialSelectFormID.selectpicker();

                model.com.searchBill({ processDefinitionId: lmvtprocessDefinitionId, ActivitID: lmvtActivitID, ClientType: ClientType }, function (res) {
                    var _thisData = res.info;


                    modal_select_FormID
                    if (_thisData == null || _thisData.ID == 0) {
                        var RoleList = $com.util.Clone(TypeSource_TaskItem.RoleID);

                        $.each(RoleList, function (i, item) {
                            item.selected = "";
                        });
                        //修改角色
                        $MaterialSelectRoleID.empty();
                        $MaterialSelectRoleID.append($com.util.template(RoleList, SELECT_OPTION_HTML_RoleID));
                        $MaterialSelectRoleID.selectpicker('render');
                        $MaterialSelectRoleID.selectpicker('refresh');
                        $MaterialSelectRoleID.selectpicker();


                        $MaterialSelectUserID.empty();
                        $MaterialSelectUserID.append($com.util.template([], SELECT_OPTION_HTML_UserID1));
                        $MaterialSelectUserID.selectpicker('render');
                        $MaterialSelectUserID.selectpicker('refresh');
                        $MaterialSelectUserID.selectpicker();

                        $MaterialSelectHideWidget.empty();
                        $MaterialSelectHideWidget.append($com.util.template([], SELECT_OPTION_HTML_UserID1));
                        $MaterialSelectHideWidget.selectpicker('render');
                        $MaterialSelectHideWidget.selectpicker('refresh');
                        $MaterialSelectHideWidget.selectpicker();

                    }
                    else {

                        var RoleList = $com.util.Clone(TypeSource_TaskItem.RoleID);

                        $.each(RoleList, function (i, item) {
                            if (item.value == _thisData.RoleID) {
                                item.selected = "selected";
                            }
                        });
                        //修改角色
                        $MaterialSelectRoleID.empty();
                        $MaterialSelectRoleID.append($com.util.template(RoleList, SELECT_OPTION_HTML_RoleID));
                        $MaterialSelectRoleID.selectpicker('render');
                        $MaterialSelectRoleID.selectpicker('refresh');
                        $MaterialSelectRoleID.selectpicker();

                        var UserList = model.com.getArray(_thisData.UserList);

                        $("#modal_select_RoleID").val(_thisData.RoleID).trigger('change');

                        //model.com.getRoleUser({
                        //    role_id: _thisData.RoleID
                        //}, function (res) {
                        //    if (res.list.length > 0) {
                        //        var _userList = res.list;
                        //        TypeSource_TaskItem.UserID = [];//清空数据
                        //        for (var j = 0; j < _userList.length; j++) {
                        //            TypeSource_TaskItem.UserID.push({ name: _userList[j].Text, value: _userList[j].FunctionID });
                        //        }
                        //    }

                        //    var ChooseList = model.com.getArray(_thisData.UserList);

                        //    var UserList = $com.util.Clone(TypeSource_TaskItem.UserID);

                        //    $.each(UserList, function (i, item) {
                        //        if (ChooseList.indexOf(item.value) != -1) {
                        //            item.selected = "selected";
                        //        }
                        //    });

                        //    $MaterialSelectUserID.empty();
                        //    $MaterialSelectUserID.append($com.util.template(TypeSource_TaskItem.UserID, SELECT_OPTION_HTML_UserID1));
                        //    $MaterialSelectUserID.selectpicker('render');
                        //    $MaterialSelectUserID.selectpicker('refresh');
                        //    $MaterialSelectUserID.selectpicker();

                        $("#modal_select_FormID").val(_thisData.FormID).trigger('change');

                        model.com.getWidgetByFormID({
                            FormID: _thisData.FormID
                        }, function (res1) {
                            if (res1.list && res1) {
                                var _widgetList = res1.list;
                                TypeSource_TaskItem.HideWidget = [];//清空数据
                                for (var j = 0; j < _widgetList.length; j++) {
                                    TypeSource_TaskItem.HideWidget.push({ name: _widgetList[j].ButtonName + "(" + _widgetList[j].WidgetTypeName + ")", value: _widgetList[j].ID });
                                }

                                var ChooseHideWidget = model.com.getArray(_thisData.HideWidget);

                                var HideWidgetList = $com.util.Clone(TypeSource_TaskItem.HideWidget);

                                $.each(HideWidgetList, function (i, item) {
                                    if (ChooseHideWidget.indexOf(item.value) != -1) {
                                        item.selected = "selected";
                                    }
                                });

                                $MaterialSelectHideWidget.empty();
                                $MaterialSelectHideWidget.append($com.util.template(HideWidgetList, SELECT_OPTION_HTML_UserID1));
                                $MaterialSelectHideWidget.selectpicker('render');
                                $MaterialSelectHideWidget.selectpicker('refresh');
                                $MaterialSelectHideWidget.selectpicker();
                            }
                        });

                        //});
                    }
                });
            });
            //监听修程
            $("body").delegate(".modal .femi-modal-body .femi-modal-item select#modal_select_FormID", "change", function (e) {

                var $this = $(this),
                    name = $this.attr("data-name"),
                    value = $this.val();
                mRoleID = value;

                var $MaterialSelect = $("#modal_select_HideWidget");
                var $MaterialUL_DIV = $MaterialSelect.closest(".femi-modal-item").find(".dropdown-menu.open ul.dropdown-menu.inner.selectpicker ");
                var SELECT_OPTION_HTML = '<option value="{{value}}" >{{name}}</option>';
                var SELECT_LI_HTML = '<li rel="{{value}}"><a tabindex="0" class="" style=""><span class="text">{{name}}</span><i class="glyphicon glyphicon-ok icon-ok check-mark"></i></a></li>';

                model.com.getWidgetByFormID({
                    FormID: mRoleID
                }, function (res) {
                    if (res.list && res) {
                        var _widgetList = res.list;
                        TypeSource_TaskItem.HideWidget = [];//清空数据
                        for (var j = 0; j < _widgetList.length; j++) {
                            TypeSource_TaskItem.HideWidget.push({ name: _widgetList[j].ButtonName + "(" + _widgetList[j].WidgetTypeName + ")", value: _widgetList[j].ID });
                        }
                        //$MaterialSelect.html($com.util.template(TypeSource_TaskItem.HideWidget, SELECT_OPTION_HTML));
                        //$MaterialUL_DIV.html($com.util.template(TypeSource_TaskItem.HideWidget, SELECT_LI_HTML));
                        $MaterialSelect.empty();
                        $MaterialSelect.append($com.util.template(TypeSource_TaskItem.HideWidget, SELECT_OPTION_HTML));
                        $MaterialSelect.selectpicker('render');
                        $MaterialSelect.selectpicker('refresh');
                        $MaterialSelect.selectpicker();
                    }
                });
          
            });
            //绑定表单
            $("body").delegate("#cby-add-bill","click",function(){
                var defaultTask;
                var $tdList = $(this).closest("td").parent("tr").children("td");
               
                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ProdefinVersion") {
                        var ProdefinVersion = $tdList.eq(i).next().attr("data-value");
                    }
                    if ($tdList.eq(i).next().attr("data-title") == "ProcessDefinitionId") {
                        var ProcessDefinitionId = $tdList.eq(i).next().attr("data-value");
                    }
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        var taskID = $tdList.eq(i).next().attr("data-value");
                    }
                }


                lmvtActivitID = taskID;
                lmvtprocessDefinitionId = ProcessDefinitionId;
                var defaultTask;
                $.each(dataTask,function(i,item){
                    if(item.ID==taskID){
                        defaultTask=item;
                    }
                })

                //添加表单选项
                model.com.searchBill({ processDefinitionId:ProcessDefinitionId, ActivitID: lmvtActivitID, ClientType: ClientType }, function (res) {
                    var _thisData = res.info;
                    // TypeSource_TaskItem.FormID = [{ name: "无", value: 0 }];
                    // $.each(dataBillAll, function (b_i, b_item) {
                    //     if (b_item.Type == ClientType) {
                    //         TypeSource_TaskItem.FormID.push(
                    //             {
                    //                 name: b_item.Name,
                    //                 value: b_item.ID,
                    //                 //far: b_item.Type
                    //             }
                    //         )
                    //     }
                    // });
                    showBillData=dataBillAll;
                    if (_thisData.ID== 0) {
                        DEFAULT_VALUE_Task={
                            // FormID:0,
                            ID: 0,
                            RoleID:0,
                            UserID: 0,
                            NoticeRoleID: 0,
                            NoticeUserID: "",
                            // HideWidget: [],
                            //ClientType: 0,
                            // IsSyncUsers: 0,
                            // IsSyncControls: 0,
                        }
                    }
                    else {
                        DEFAULT_VALUE_Task = {
                            // FormID: _thisData.FormID,
                            ID: _thisData.ID,
                            RoleID: _thisData.RoleID,
                            UserID: model.com.getArray(_thisData.UserList),
                            HideWidget: model.com.getArray(_thisData.HideWidget),
                            NoticeRoleID: _thisData.RecipientsRoleID,
                            NoticeUserID: model.com.getArray(_thisData.Recipients),
                            //ClientType: 0,
                            // IsSyncUsers: 0,
                            // IsSyncControls: 0,
                        }
                    }
                    //填充隐藏列表
                    model.com.getWidgetByFormID({
                        FormID: _thisData.FormID
                    }, function (res) {
                        if (res.list && res) {
                            var _widgetList = res.list;
                            // TypeSource_TaskItem.HideWidget = [];//清空数据
                            for (var j = 0; j < _widgetList.length; j++) {
                                // TypeSource_TaskItem.HideWidget.push({ name: _widgetList[j].ButtonName + "(" + _widgetList[j].WidgetTypeName + ")", value: _widgetList[j].ID });
                            }
                        }

                        if (_thisData.RoleID) {
                            //填充相关的用户角色
                            TypeSource_TaskItem.UserID = [
                                {
                                    name: "无",
                                    value: "",
                                 },
                            ];
                            model.com.getRoleUser({
                                role_id: _thisData.RoleID
                            }, function (res) {
                                if (res.list.length > 0) {
                                    var _userList = res.list;
                                    for (var j = 0; j < _userList.length; j++) {
                                        TypeSource_TaskItem.UserID.push({ name: _userList[j].Text, value: _userList[j].FunctionID });
                                    }
                                }

                                //填充通知人员列表
                                TypeSource_TaskItem.NoticeUserID = [
                                    {
                                        name: "无",
                                        value: "",
                                     },
                                ];
                                model.com.getRoleUser({
                                    role_id: _thisData.RecipientsRoleID
                                }, function (res) {
                                    if (res.list.length > 0) {
                                        var _userList = res.list;
                                        for (var j = 0; j < _userList.length; j++) {
                                            TypeSource_TaskItem.NoticeUserID.push({ name: _userList[j].Text, value: _userList[j].FunctionID });
                                        }
                                    }
                                    $("body").append($com.modal.show(DEFAULT_VALUE_Task, KEYWORD_TaskItem, "配置", function (rst) {
                                        if (!rst || $.isEmptyObject(rst))
                                            return;

                                        var newObj = {
                                            ID: DEFAULT_VALUE_Task.ID,
                                            ProdefinID: defaultTask.ProcessDefinitionId,
                                            Name: defaultTask.Name,
                                            FormID: Number(rst.FormID),
                                            FormUrl: _thisData.FormUrl,
                                            ActivitID: defaultTask.ID,
                                            ProdefinVersion: defaultTask.ProdefinVersion,
                                            RoleID: Number(rst.RoleID),
                                            UserList: model.com.getString(rst.UserID),
                                            RecipientsRoleID: Number(rst.NoticeRoleID),
                                            Recipients: model.com.getString(rst.NoticeUserID),
                                            RoleName: "",
                                            // HideWidget: model.com.getString(rst.HideWidget),
                                            HideWidget: "",
                                            ClientType: ClientType,
                                        }
                                        if(newObj.RoleID!=0){
                                            for (var i = 0; i < TypeSource_TaskItem.RoleID.length; i++) {
                                                if (TypeSource_TaskItem.RoleID[i].value == rst.RoleID){
                                                    newObj.RoleName = TypeSource_TaskItem.RoleID[i].name;
                                                }
                                            }
                                        }
                                        
                                        model.com.postBillData({
                                            //IsSyncUsers: Number(rst.IsSyncUsers),
                                            IsSyncControls: Number(rst.IsSyncControls),
                                            data: newObj
                                        }, function (res) {
                                            alert("绑定成功");//treeID
                                            if (treeID)
                                                model.com.getTask(treeID);
                                            else
                                                model.com.refreshAllTask();
                                            //model.com.getUsers({
                                            //    definitionId: defaultTask.ProcessDefinitionId, activtientiId: defaultTask.ID
                                            //}, function (res) {
                                            //});
                                        });
                                    }, TypeSource_TaskItem));
                                })
                                
                            });
                        } else {
                            TypeSource_TaskItem = {
                                RoleID: [
                                     {
                                        name: "无",
                                        value: 0,
                                     },
                                ],
                                UserID: [
                                    {
                                        name: "无",
                                        value: "",
                                     },
                                ],
                                NoticeRoleID: [
                                    {
                                        name: "无",
                                        value: 0,
                                     },
                                ],
                                NoticeUserID: [
                                    {
                                        name: "无",
                                        value: "",
                                     },
                                ],
                            };
                            model.com.getRoleAll({}, function (res) {
                                if (res.list.length > 0) {
                                    var _roleList=res.list;
                                    for (var i = 0; i < _roleList.length; i++) {
                                        TypeSource_TaskItem.RoleID.push({ name: _roleList[i].Name, value: _roleList[i].ID });
                                        TypeSource_TaskItem.NoticeRoleID.push({ name: _roleList[i].Name, value: _roleList[i].ID });
                                    }
            
                                }
                                $("body").append($com.modal.show(DEFAULT_VALUE_Task, KEYWORD_TaskItem, "配置", function (rst) {
                                    if (!rst || $.isEmptyObject(rst))
                                        return;
    
                                    var newObj = {
                                        ID: DEFAULT_VALUE_Task.ID,
                                        ProdefinID: defaultTask.ProcessDefinitionId,
                                        Name: defaultTask.Name,
                                        FormID: Number(rst.FormID),
                                        FormUrl: _thisData.FormUrl,
                                        ActivitID: defaultTask.ID,
                                        ProdefinVersion: defaultTask.ProdefinVersion,
                                        RoleID: Number(rst.RoleID),
                                        UserList: model.com.getString(rst.UserID),
                                        RecipientsRoleID: Number(rst.NoticeRoleID),
                                        Recipients: model.com.getString(rst.NoticeUserID),
                                        RoleName: "",
                                        // HideWidget: model.com.getString(rst.HideWidget),
                                        HideWidget: "",
                                        ClientType: ClientType,
                                    }
                                    if(newObj.RoleID!=0){
                                        for (var i = 0; i < TypeSource_TaskItem.RoleID.length; i++) {
                                            if (TypeSource_TaskItem.RoleID[i].value == rst.RoleID)
                                                newObj.RoleName = TypeSource_TaskItem.RoleID[i].name;
                                        }
                                    }
                                    
                                    // for (var i = 0; i < dataBillAll.length; i++) {//TypeSource_TaskItem.FormID
                                    //     if (newObj.FormID == dataBillAll[i].ID) {
                                    //         newObj.FormUrl = dataBillAll[i].Url;
                                    //     }
                                    // }
                                    model.com.postBillData({
                                        //IsSyncUsers: Number(rst.IsSyncUsers),
                                        IsSyncControls: Number(rst.IsSyncControls),
                                        data: newObj
                                    }, function (res) {
                                        alert("绑定成功");
                                        if (treeID)
                                            model.com.getTask(treeID);
                                        else
                                            model.com.refreshAllTask();
                                        //model.com.getUsers({
                                        //    definitionId: defaultTask.ProcessDefinitionId, activtientiId: defaultTask.ID
                                        //}, function (res) {
                                        //});
                                    });
                                }, TypeSource_TaskItem));
                            });
                            
                        }
                    })
                    
                });
            });
            //流程图
            $("body").delegate("#cby-route-charf-show","click",function(){
                $(".iplant-tool-right").show();
                $(".lmvt-container-charf").show();
                $(".lmvt-container-widget").hide();
                $(".lmvt-container-supplier").hide();
                $(".iplant-tool-right").css("width", "500px");
                $(".iplant-tool-center").css("margin-right", "500px");
                var $tdList = $(this).closest("td").parent("tr").children("td");

                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ProdefinVersion") {
                        var ProdefinVersion = $tdList.eq(i).next().attr("data-value");
                    }
                    if ($tdList.eq(i).next().attr("data-title") == "ProcessDefinitionId") {
                        var ProcessDefinitionId = $tdList.eq(i).next().attr("data-value");
                    }
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        var taskID = $tdList.eq(i).next().attr("data-value");
                    }
                }
                $(".cby-show-user-title").html("流程图（"+taskID+")");
                var $src = $com.imageUrl + "/MESBPM/api/Repository/getPositionFlowChart?processDefinitionId=" + ProcessDefinitionId+"&activityId="+taskID;
                $("#cby-route-charf img").attr("src", $src);
                
            })
            
        },
        com: {
            getUsers: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Leave/GetUsers",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
               
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
    
            refreshTree:function(){
                // 渲染树形图
                var _showTreeData=model.com.getTreeList();
                //添加流程定义
                var showTreeData=model.com.getDefinedTree(_showTreeData);
                //渲染树
                model.com.renderTree(showTreeData);
                model.com.refreshColorTree();   
            },
            //获取树形结构
            getTreeList:function(){
                var reList = [],
                    allList=$com.util.Clone(dataTree);
                for (var i = 0; i < allList.length; i++) {
                    if (allList[i].FarID == 0) {
                        var _obj = { ID: allList[i].ID, Name: allList[i].Name, sonList: [],Key:"tree"};
                       model.com.findSonTree(_obj, allList);
                       reList.push(_obj);
                    }
                }
                return reList;
            },
            //获得树子结构
            findSonTree:function (_obj, allList) {
                for (var i = 0; i < allList.length; i++) {
                    if (_obj.ID == allList[i].FarID) {
                        var thisObj = { ID: allList[i].ID, Name: allList[i].Name, sonList: [],Key:"tree" };
                        _obj.sonList.push(thisObj);
                        model.com.findSonTree(thisObj, allList);
                    }
                }
            },
            //获得流程定义树
            getDefinedTree: function (TreeList) {
                //第一步，将流程定义与树进行比较
                for (var i = 0; i < DataDefined.length; i++) {
                    //第二步，与树结构进行对比
                    model.com.compareTreeData(DataDefined[i], TreeList)
                }
                return TreeList;
            },
            compareTreeData: function (DefinedData, TreeList) {
                for (var i = 0; i < TreeList.length; i++) {
                    //如果流程定义得treeID等于树得ID
                    if (DefinedData.category == TreeList[i].ID) {
                        TreeList[i].sonList.push({ ID: DefinedData.id_, Name: DefinedData.name_+"("+DefinedData.key_+")", sonList: [], Key: "define" })
                        if(typeof(first_defineID)=="undefined"){
                            first_defineID=DefinedData.id_
                        } 
                    } else {
                        //查询树的子集
                        if (TreeList[i].sonList.length > 0)
                            model.com.compareTreeData(DefinedData, TreeList[i].sonList);
                    }
                }
            },
            refreshColorTree:function(){
                $("#routeTree").find("li").each(function(){
                    if($(this).attr("data-key")=="define"){

                        $(this).css("color", "#1BA926");
                    } else if ($(this).attr("data-key") == "tree") {
                        $(this).css("font-weight", "bold");
                    }
                })
            },

            renderTree:function(list){

                model.com.fullItems(list);

                $("#routeTree").html($com.util.template(list, HTML.TreeItemNode));
                $("#routeTree").treeview();
            },

            fullItems: function (list) {

                $.each(list, function (i, item) {

                    model.com.fullItems(item.sonList);

                    item.Items = $com.util.template(item.sonList, HTML.TreeItemNode);

                });
            },

            refreshAllTask:function(){
                var defineId=DataDefined[0].id_;
                // var $src = $com.imageUrl + "/MESBPM/api/Leave/Image2defin?processDefinitionId=" + defineId;
                // $("#cby-route-charf img").attr("src", $src);
                model.com.getTaskList({processDefinitionId:defineId,ClientType: ClientType},function(res){
                    dataTask=res.list,
                    _dataTask=$com.util.Clone(dataTask);
                    $.each(_dataTask,function(i,item){
                        item.OrderID=i+1;
                        item.ID=item.ID;
                        item.Name=item.Name;
                        item.CreateTime="";
                    });
                    $.each(_dataTask, function (i, item) {
                        $.each(dataBillAll, function (b_i, b_item) {
                            if (item.FormID == b_item.ID) {
                                item.FormName = b_item.Name;
                                if (item.FormID == 0) {
                                    item.IsBind = "否"
                                } else {
                                    item.IsBind = "是"
                                }
                                if (item.RoleID == 0)
                                    RoleName = "无角色";
                            }
                        })
                    })
                    
                    $.each(_dataTask, function (i, item) {
                        var userList=model.com.getArray(item.UserList),
                            _userList=[],
                            Recipients=model.com.getArray(item.Recipients),
                            _Recipients=[];
                        $.each(userList,function(u_i,u_item){
                            $.each(AllUser, function (b_i, b_item) {
                                if (u_item == b_item.ID) {
                                    _userList.push(b_item.Name);
                                }
                            })
                        })
                        $.each(Recipients,function(u_i,u_item){
                            $.each(AllUser, function (b_i, b_item) {
                                if (u_item == b_item.ID) {
                                    _Recipients.push(b_item.Name);
                                }
                            })
                        })
                        item.UserList=_userList;
                        item.Recipients=_Recipients;
                    })
                    tableShow=_dataTask;
                    $("#cby-tbody-designTable").html($com.util.template(tableShow, HTML.TableTaskItemMode));
                    $("#routeTree").find("li").each(function () {
                        if ($(this).attr("data-key") == "define") {
                           if($(this).attr("data-value") == defineId){
                                $(this).children("span").addClass("current");
                            }
                            // else{
                            //     $(this).css("color", "#1BA926");
                            //     $(this).children("span").removeClass("current");
                            // }
                        } else if ($(this).attr("data-key") == "tree") {
                            $(this).css("font-weight", "bold");
                            $(this).children("span").removeClass("current");
                        }
                    })
                })

                // model.com.getAllTask({ ClientType: ClientType }, function (res) {
                //     dataAllTask = res.list;
                //     var _dataAllTask=[];
                //     $.each(dataAllTask,function(i,item){
                //         if(item.ProcessDefinitionId==first_defineID){
                //             _dataAllTask.push(item);
                //         }
                //     })
                //     // var _dataAllTask = $com.util.Clone(dataAllTask);
                //     $.each(_dataAllTask, function (i, item) {
                //         item.OrderID = i + 1;
                //         item.ID = item.ID;
                //         item.Name = item.Name;
                //         item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                //         if (item.FormID == 0) {
                //             item.IsBind = "否"
                //         } else {
                //             item.IsBind = "是"
                //         }
                //         if (item.RoleID == 0)
                //             RoleName = "无角色";
                //     });
                //     tableShow = _dataAllTask;
                //     $("#cby-tbody-designTable").html($com.util.template(tableShow, HTML.TableTaskItemMode));
                // });
            },
            refreshTask: function () {
                var _dataTask=$com.util.Clone(dataTask);
                $.each(_dataTask,function(i,item){
                    item.OrderID=i+1;
                    item.ID=item.ID;
                    item.Name=item.Name;
                    item.CreateTime="";
                });
                $.each(_dataTask, function (i, item) {
                    $.each(dataBillAll, function (b_i, b_item) {
                        if (item.FormID == b_item.ID) {
                            item.FormName = b_item.Name;
                            if (item.FormID == 0) {
                                item.IsBind = "否"
                            } else {
                                item.IsBind = "是"
                            }
                            if (item.RoleID == 0)
                                RoleName = "无角色";
                        }
                    })
                })
                $.each(_dataTask, function (i, item) {
                    var userList=model.com.getArray(item.UserList),
                        _userList=[],
                        Recipients=model.com.getArray(item.Recipients),
                        _Recipients=[];
                    $.each(userList,function(u_i,u_item){
                        $.each(AllUser, function (b_i, b_item) {
                            if (u_item == b_item.ID) {
                                _userList.push(b_item.Name);
                            }
                        })
                    })
                    $.each(Recipients,function(u_i,u_item){
                        $.each(AllUser, function (b_i, b_item) {
                            if (u_item == b_item.ID) {
                                _Recipients.push(b_item.Name);
                            }
                        })
                    })
                    item.UserList=_userList;
                    item.Recipients=_Recipients;
                })
                tableShow=_dataTask;
                $("#cby-tbody-designTable").html($com.util.template(tableShow, HTML.TableTaskItemMode));
            },
            getTask: function (id) {
                model.com.getTaskList({ processDefinitionId: id, ClientType: ClientType }, function (res) {
                    // console.log(id);
                    dataTask=res.list;
                    model.com.refreshTask();
                    return false;
                });
            },
            //获取树形
            getItemTree: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Tree_menu/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },           
            //添加菜单
            addItemTable: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Tree_menu/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除菜单
            deleteItemTable: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Tree_menu/Delete",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getDefineList: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Repository/getProcessDefinitionList",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获得任务
            getTaskList:function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Form_activtientity_ship/QueryUserTask",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询是否绑定单据
            searchBill: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Form_activtientity_ship/Info",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询所有单据
            getBillAll: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Tree_form/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //绑定单据
            postBillData: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Form_activtientity_ship/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取所有任务
            getAllTask: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Form_activtientity_ship/QueryAllUserTask",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getRoleAll: function (data, fn, context) {
                var d = {
                    $URI: "/Role/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getUserList: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Repository/getUserTaskInfo",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getRoleUser: function (data, fn, context) {
                var d = {
                    $URI: "/Role/UserAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //根据表单id获取通用控件列表
            getWidgetByFormID: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/ProcessdefinWidget/GetAllByFormID",
                    $TYPE: "get"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getArray: function (data) {
                if(data!=null){
                    if(data.indexOf(";") >= 0 ){
                        var reg = new RegExp(";","g");//g,表示全部替换。
    
                        data.replace(reg,",");
                    }
                    var _reList = [];
                    var _array = data.split(",");
                    for (var i = 0; i < _array.length; i++) {
                        _reList.push(parseInt(_array[i]));
                    }
                    return _reList;
                }
                
            },
            getString: function (data) {
                // data=data.replace(";",",");
                var _string = "";
                for (var i = 0; i < data.length; i++) {
                    if (i == data.length - 1) {
                        _string += data[i];
                    } else {
                        _string += data[i] + ",";
                    }
                   
                }
                return _string;
            },
            load: function () {
                model.com.getRoleAll({}, function (res) {
                    if (res.list.length > 0) {
                        var _roleList=res.list;
                        for (var i = 0; i < _roleList.length; i++) {
                            TypeSource_TaskItem.RoleID.push({ name: _roleList[i].Name, value: _roleList[i].ID });
                            TypeSource_TaskItem.NoticeRoleID.push({ name: _roleList[i].Name, value: _roleList[i].ID });
                        }

                    }
                    
                });
            },
            //查询最高版本
            // getMaxVersion:function(data){
            //     var _data = [];
            //     for (var i = 0; i < data.length; i++) {
            //         if (!model.com.getCheckRepeat(data[i], _data)) {
            //             var _maxVersionProcessdefin = model.com.getProcessdefinByKey(data[i].KEY_, data);
            //             _data.push(_maxVersionProcessdefin);
            //         }
            //     }
            //     return _data;
            // },
            //根据key查最高版本的流程定义
            getProcessdefinByKey: function (key, data) {
                var _data = [];
                var _maxVersionProcessdefin = {};
                for (var i = 0; i < data.length; i++) {
                    if (data[i].KEY_ == key) {
                        _data.push(data[i]);
                    }
                }
                //找出key最大的流程定义
                for (var i = 0; i < _data.length; i++) {
                    if (!i) {
                        _maxVersionProcessdefin = _data[i];
                    } else {
                        if (parseInt(_data[i].VERSION_) > parseInt(_maxVersionProcessdefin.VERSION_))
                            _maxVersionProcessdefin = _data[i];
                    }
                }
                return _maxVersionProcessdefin;
            },
            //判断数组中是否包含有相同的流程定义
            getCheckRepeat:function(thisData,data){
                for (var i = 0; i < data.length; i++) {
                    if (data[i].KEY_ == thisData.KEY_) {
                        return true;
                    }
                }
                return false;
            }
        },
       
    });
    model.init();
});