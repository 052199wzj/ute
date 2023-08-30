require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview','../static/utils/js/base/paging' ], function ($zace, $com, $tree,$page) {
    var dataTree,
        DataTable,
        DataUser,
        treeID,
        tableShow,
        dataExample,
        recordArr,
        dataRecordShow,
        dataFinishedBill,
        $tree_val,
        firstResult=0,
        maxResults,
        counts,
        onePages=15;

    var KEYWORD_BillItem_LIST,
        KEYWORD_BillItem,
        FORMATTRT_BillItem,
        TypeSource_BillItem,
        DEFAULT_VALUE_Bill;

    
    var HTML = {
        TableExampleItemMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            // '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="ProcessInstanceID" data-value="{{ProcessInstanceID}}" >{{ProcessInstanceID}}</td>',
            '<td data-title="ProcessDefinitionName" data-value="{{ProcessDefinitionName}}" >{{ProcessDefinitionName}}</td>',
            // '<td data-title="ActivitiName" data-value="{{ActivitiName}}" >{{ActivitiName}}</td>',
            // '<td data-title="ActivityID" data-value="{{ActivityID}}" >{{ActivityID}}</td>',
            '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            // '<td data-title="Description" data-value="{{Description}}" >{{Description}}</td>',
            '<td data-title="Assignee" data-value="{{Assignee}}" >{{Assignee}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td data-title="Description" data-value="{{Description}}" >{{Description}}</td>',
            '<td style="min-width: 30px;max-width: 200px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-show-charf" >流程图</span><span class="td-contain-list" id="cby-show-record">历史记录</span><span class="td-contain-list" id="cby-on-exa">激活</span><span class="td-contain-list" id="cby-stop-exa">挂起</span><span class="td-contain-list" id="cby-delete-exa">删除</span><span class="td-contain-list" id="cby-show-recordGy">干预记录</span><span class="td-contain-list" id="cby-example-object">执行实例</span></div> </td>  ',
            '</tr>',
        ].join(""),
        TableRecordItemMode: [
            '<tr>',
            // '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="id" data-value="{{id}}" >{{id}}</td>',
            '<td data-title="processDefinitionName" data-value="{{processDefinitionName}}" >{{processDefinitionName}}</td>',
            '<td data-title="name" data-value="{{name}}" >{{name}}</td>',
            '<td data-title="assignee" data-value="{{assignee}}" >{{assignee}}</td>',
            '<td data-title="taskDefinitionKey" data-value="{{taskDefinitionKey}}" >{{taskDefinitionKey}}</td>',
            '<td data-title="createTime" data-value="{{createTime}}" >{{createTime}}</td>',
            '<td data-title="endTime" data-value="{{endTime}}" >{{endTime}}</td>',
            '</tr>',
        ].join(""),

        TreeItemNode: [
            '<li data-titie="{{ID}}"  data-value="{{ID}}" >',
            '<span style="vertical-align:top;" data-value="{{ID}}"}" >{{Name}}</span> ',
            '<ul>{{Items}}',
            '</ul>',
            '</li>',
        ].join(""),
        RecordItemNode: [
            '<tr>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="InitialPeople" data-value="{{InitialPeople}}" >{{InitialPeople}}</td>',
            '<td data-title="IntervenePeople" data-value="{{IntervenePeople}}" >{{IntervenePeople}}</td>',
            '<td data-title="InterveneTime" data-value="{{InterveneTime}}" >{{InterveneTime}}</td>',
            '<td data-title="Remark" data-value="{{Remark}}" >{{Remark}}</td>',
            '</tr>',
        ].join(""),
        TableFinishedMode: [
            '<tr>',
            //   '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            // '<td style="min-width: 30px;max-width: 70px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-charf-showApply">流程图</span><span class="td-contain-list" id="cby-record-showApply">历史记录</span></div> </td>  ',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="ProcessDefinitionId" data-value="{{ProcessDefinitionId}}" >{{ProcessDefinitionId}}</td>',
            '<td data-title="StartTime" data-value="{{StartTime}}" >{{StartTime}}</td>',
            '<td data-title="EndTime" data-value="{{EndTime}}" >{{EndTime}}</td>',
            '<td data-title="DurationInMillis" data-value="{{DurationInMillis}}" >{{DurationInMillis}}</td>',
            '<td data-title="ApplyName" data-value="{{ApplyName}}" >{{ApplyName}}</td>',
            '</tr>',
        ].join(""),
        TableExampleObjectMode: [
            '<tr>',
            //   '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            // '<td style="min-width: 30px;max-width: 70px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-charf-showApply">流程图</span><span class="td-contain-list" id="cby-record-showApply">历史记录</span></div> </td>  ',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="ProcessInstanceID" data-value="{{ProcessInstanceID}}" >{{ProcessInstanceID}}</td>',
            //'<td data-title="ProcessDefinitionName" data-value="{{ProcessDefinitionName}}" >{{ProcessDefinitionName}}</td>',
            '<td data-title="ActivitiName" data-value="{{ActivitiName}}" >{{ActivitiName}}</td>',
            '<td class="cby-userlist" data-title="Assignee" data-value="{{Assignee}}" >{{Assignee}}</td>',
            '<td data-title="IsUnFinished" data-value="{{IsUnFinished}}" >{{IsUnFinished}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '</tr>',
        ].join(""),
    }
    $(function () {
        KEYWORD_BillItem_LIST = [
            "ID|编号",
            "Name|单据名称",
            "Key|标识",
            "Type|类型",
            "Status|状态",
            "Version|版本",
            "Url|地址",
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

    model = $com.Model.create({
        name: '实例监控',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },
        run:function(){
            $("#routeTree").bind("contextmenu", function(){
                return false;
            })
            $com.app.loading("正在加载配置！");
            model.com.getItemTree({}, function (resT) {
                DataUser = window.parent._UserAll
                dataTree=resT.list;
                model.com.refreshTree();
                // model.com.getExample({}, function (res) {
                //     DataTable = res.list;
                    model.com.refreshTableAll();
                    model.com.getFinishedBill({},function(res){
                        dataFinishedBill = res.list;
                        model.com.refreshFinishedAll();
                        $com.app.loaded();
                    })
                // })
            });
            
            $("#cby-route-charf").hide();
            $("#cby-table").show();
            $("#cby-record-table").hide();
            $("#cby-recordGy-table").hide();
            $("#cby-finished-table").hide();
        },
        events:function(){
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
                        model.com.refreshTableAll();
                        $("#cby-tree-tooltip").remove();
                    }else{
                        model.com.addItemTable({
                            data: newObj
                        }, function (res) {
                            model.com.getItemTree({}, function (resT) {
                                dataTree = resT.list;
                                alert("新增成功");
                                model.com.refreshTree();
                                model.com.refreshTableAll();
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
                        model.com.refreshTableAll();
                    }else{
                        model.com.addItemTable({
                            data: newObj
                        }, function (res) {
                            model.com.getItemTree({}, function (resT) {
                                dataTree = resT.list;
                                alert("修改成功");
                                model.com.refreshTree();
                                model.com.refreshTableAll();
                                $("#cby-tree-tooltip").remove();
                            });
                        });
                    }
                }, TypeSource_BillItem));
            });
            //右键删除事件
            $("body").delegate("#cby-delete-class","click",function(){
                if (!confirm("确定删除？")) {
                    $("#cby-tree-tooltip").remove();
                    return;
                }
                model.com.deleteTreeItemTable({
                    id: $farID
                }, function (res) {
                    alert("删除成功");
                    model.com.getItemTree({}, function (resT) {
                        dataTree = resT.list;
                        model.com.refreshTree();
                    });
                });
                $("#cby-tree-tooltip").remove();
            });
            //刷新树
            $("body").delegate("#cby-refresh-treeItem","click",function(){
                model.com.getItemTree({},function(resT){
                    dataTree=resT.list;
                    model.com.refreshTree();
                });
            });
            //新增树的根节点
            $("body").delegate("#cby-add-treeItem","click",function(){
                // var $farID=$(this).attr("data-value");
                $("body").append($com.modal.show(DEFAULT_VALUE_Bill, KEYWORD_BillItem, "新增", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var 
                        newObj={};
                    newObj={
                        ID_:0,
                        Name:rst.Name,
                        FarID:0
                    }                    
                    model.com.addTreeItemTable({
                        data: newObj
                    }, function (res) {
                        alert("新增成功");
                        model.com.getItemTree({}, function (resT) {
                            dataTree = resT.list;
                            model.com.refreshTree();
                        });
                    });
                    $("#cby-tree-tooltip").remove();
                }, TypeSource_BillItem));
            });



            //获取表格
            $("body").delegate("#routeTree li","click",function(){
                var id=$(this).attr("data-titie");
                treeID = id;

                $("#routeTree").children("li").each(function (i, item) {
                    $item = $(item);
                    if ($item.find("li").length > 0) {
                        $item.find("li").each(function (j, jtem) {
                            $(jtem).children("span").css("color", "black");
                        });
                    }

                    $item.children("span").css("color", "black");
                });
                $(this).children("span").css("color", "red");

                // model.com.getItemTable({},function(res){
                //     DataTable=res.list;
                    
                    model.com.refreshTable(id);
                // });
                return false;
            });
            //模糊查询
            $("body").delegate("#cby-searchExample-table", "change", function () {
                var $this = $(this),
                    value = $(this).val();
                
                if (value == undefined || value == "" || value.trim().length < 1) {
                    $("#cby-tbody-exampleTable").children("tr").show();
                }
                else
                    $com.table.filterByLikeString($("#cby-tbody-exampleTable"), tableShow, value, "OrderID");
            });
            //查看流程图
            $("body").delegate("#cby-show-charf","click",function(){
                $com.app.loading("正在加载配置！");
                var ProcessInstanceID,
                    $tdList = $(this).closest("td").parent("tr").children("td");

                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ProcessInstanceID") {
                        ProcessInstanceID= $tdList.eq(i).next().attr("data-value");
                    }
                }
                // var $src = $com.imageUrl+ "/MESBPM/api/Leave/Image?processInstanceId=" + ProcessInstanceID;
                var $src = $com.imageUrl+ "/MESBPM/api/Repository/getRealFlowChart?processInstanceId=" + ProcessInstanceID;
                $("#cby-route-charf img").attr("src",$src);
                $("#cby-route-charf").show();
                $("#cby-table").hide();
                $com.app.loaded();
            });
            //返回到表格
            $("body").delegate("#cby-return-table", "click", function () {
                if (typeof(treeID)== "undefined") {
                    model.com.refreshTableAll();
                } else {
                    model.com.refreshTable(treeID);
                }
                $("#cby-route-charf").hide();
                $("#cby-record-table").hide();
                $("#cby-table").show();
            });
            //查看历史纪录
            $("body").delegate("#cby-show-record","click",function(){
                $("#cby-route-charf").hide();
                $("#cby-record-table").show();
                $("#cby-table").hide();
                var ProcessInstanceID,
                    $tdList = $(this).closest("td").parent("tr").children("td");

                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ProcessInstanceID") {
                        ProcessInstanceID= $tdList.eq(i).next().attr("data-value");
                    }
                }
                 model.com.refreshRecord(ProcessInstanceID);
                             
            });
            //模糊查询
            $("body").delegate("#cby-tbody-recordTable", "change", function () {
                var $this = $(this),
                    value = $(this).val();
                
                if (value == undefined || value == "" || value.trim().length < 1) {
                    $("#cby-tbody-recordTable").children("tr").show();
                }
                else
                    $com.table.filterByLikeString($("#cby-tbody-recordTable"), recordArr, value, "OrderID");
            });
            //激活实例
            $("body").delegate("#cby-on-exa","click",function(){
                var ProcessInstanceID,_status,
                    $tdList = $(this).closest("td").parent("tr").children("td");

                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ProcessInstanceID") {
                        ProcessInstanceID= $tdList.eq(i).next().attr("data-value");
                    }
                }
                $.each(dataExample,function(i,item){
                    if(item.ID==ProcessInstanceID){
                        _status=item.Status;
                    }
                });
                if(_status==1){
                    alert("该实例已被激活！！！");
                }else{
                    model.com.onExample({processInstanceId:ProcessInstanceID},function(){
                        alert("激活成功！！！");
                        if (treeID == 0) {

                            model.com.refreshTableAll();
                        } else {
                            model.com.refreshTable(treeID);
                        }
                    });
                }
            });
            //挂起实例
            $("body").delegate("#cby-stop-exa","click",function(){
                var ProcessInstanceID,_status,
                    $tdList = $(this).closest("td").parent("tr").children("td");

                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ProcessInstanceID") {
                        ProcessInstanceID= $tdList.eq(i).next().attr("data-value");
                    }
                }
                $.each(dataExample,function(i,item){
                    if(item.ID==ProcessInstanceID){
                        _status=item.Status;
                    }
                });
                if(_status==2){
                    alert("该实例已被挂起！！！");
                }else{
                    model.com.stopExample({processInstanceId:ProcessInstanceID},function(){
                        alert("挂起成功！！！");
                        if (treeID == 0) {

                            model.com.refreshTableAll();
                        } else {
                            model.com.refreshTable(treeID);
                        }
                    });
                }
               
            });
            //删除实例
            $("body").delegate("#cby-delete-exa","click",function(){
                var ProcessInstanceID,
                    $tdList = $(this).closest("td").parent("tr").children("td");

                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ProcessInstanceID") {
                        ProcessInstanceID= $tdList.eq(i).next().attr("data-value");
                    }
                }
                if (!confirm("确定删除？")) {
                    return;
                }
                model.com.deleteExample({ processInstanceId: ProcessInstanceID, deleteReason: "close" }, function () {
                    alert("实例删除成功");
                    if (treeID == 0) {

                        model.com.refreshTableAll();
                    } else {
                        model.com.refreshTable(treeID);
                    }
                });
            });
            //查看干预记录
            $("body").delegate("#cby-show-recordGy","click",function(){
                var ProcessInstanceID,
                    $tdList = $(this).closest("td").parent("tr").children("td");

                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ProcessInstanceID") {
                        ProcessInstanceID= $tdList.eq(i).next().attr("data-value");
                    }
                }
                model.com.getRecord({ProcessInstanceID:ProcessInstanceID},function(res){
                    var dataRecord=res.list;
                    var _moveTaskData=$com.util.Clone(dataRecord);
                    if(_moveTaskData.length==0){
                        dataRecordShow=[];
                    }else{
                        $.each(_moveTaskData,function(i,item) {
                            $.each(DataUser,function(u_i,u_item) {
                                if(item.InitialPeople==u_item.ID){
                                    item.InitialPeople=u_item.Name;
                                } 
                                if(item.IntervenePeople==u_item.ID){
                                    item.IntervenePeople=u_item.Name;
                                }
                                item.InterveneTime=$com.util.format('yyyy-MM-dd hh:mm:ss', item.InterveneTime);
                                item.OrderID=i+1;
                            });
                        });
                        dataRecordShow=_moveTaskData;
                    }
                    $("#cby-tbody-moveRecordTable").html($com.util.template(_moveTaskData, HTML.RecordItemNode));
                    $("#cby-table").hide();
                    $("#cby-record-table").hide();
                    $("#cby-recordGy-table").show();

                });
            });
            //模糊查询干预
            $("body").delegate("#cby-aroundSearch-recordTable", "change", function () {
                var $this = $(this),
                    value = $(this).val();
                
                if (value == undefined || value == "" || value.trim().length < 1) {
                    $("#cby-tbody-moveRecordTable").children("tr").show();
                }
                else
                    $com.table.filterByLikeString($("#cby-tbody-moveRecordTable"), dataRecordShow, value, "OrderID");
            });
            //返回列表
            $("body").delegate("#cby-return-recordTable","click",function(){
                $("#cby-table").show();
                $("#cby-recordGy-table").hide();
                
            });

            //显示已完成实例
            $("body").delegate("#cby-show-finished","click",function(){
                $("#cby-finished-table").show();
                $("#cby-table").hide();
            });
            //返回
            $("body").delegate("#cby-return-finishingTable","click",function(){
                $("#cby-finished-table").hide();
                $("#cby-table").show();
                // model.com.refreshTableAll();
            });

            //显示实例对象
            $("body").delegate("#cby-example-object", "click", function () {
                $(".iplant-tool-right").show();
                $(".lmvt-container-supplier").show();
                //$(".lmvt-container-widget").hide();
                $(".iplant-tool-right").css("width", "500px");
                $(".iplant-tool-center").css("margin-right", "500px");

                var ProcessInstanceID,_status,
                    $tdList = $(this).closest("td").parent("tr").children("td");

                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ProcessInstanceID") {
                        ProcessInstanceID= $tdList.eq(i).next().attr("data-value");
                    }
                }
                $.each(dataExample,function(i,item){
                    if(item.ID==ProcessInstanceID){
                        _status=item.Status;
                    }
                });
                model.com.getExampleObject({processInstanceId: ProcessInstanceID }, function (res) {
                    var dataExampleObject = res.list;

                    var _dataExampleObject = $com.util.Clone(dataExampleObject);
                    $.each(_dataExampleObject, function (i, item) {
                        if (item.IsUnFinished == true) {
                            item.IsUnFinished="否"
                        } else if (item.IsUnFinished == false) {
                            item.IsUnFinished = "是"
                        }
                        item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                        item.OrderID = i + 1;
                    })
                    $.each(_dataExampleObject, function (i, item) {
                        if (item.Assignee!="-100") {
                            var userList=model.com.getArray(item.Assignee),
                            _userList=[];
                            $.each(userList,function(u_i,u_item){
                                $.each(DataUser, function (b_i, b_item) {
                                    if (u_item == b_item.ID) {
                                        _userList.push(b_item.Name);
                                    }
                                })
                            })
                            item.Assignee=_userList;
                        }else if(item.Assignee=="-100"){
                            item.Assignee="系统"
                        }
                        
                    })
                    // $(".lmvt-header-text").text(_dataExampleObject[0].ProcessDefinitionName);

                    $(".cby-tbody-exampleObject").html($com.util.template(_dataExampleObject, HTML.TableExampleObjectMode));
                })


            })
            //隐藏实例对象
            $("body").delegate("#femi-hide-property1", "click", function () {
                $(".iplant-tool-right").hide();
                $(".lmvt-container-supplier").hide();
                //$(".lmvt-container-widget").hide();
                $(".iplant-tool-right").css("width", "0px");
                $(".iplant-tool-center").css("margin-right", "0px");
            });
        },
        com: {
            //获取实例对象
            getExampleObject: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Runtime/getExecutionSubByPI",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            refreshTree:function(){
                // 渲染树形图
                var showTreeData=model.com.getTreeList();
                model.com.renderTree(showTreeData);
            },
            //获取树形结构
            getTreeList:function(){
                var reList = [],
                    allList=$com.util.Clone(dataTree);
                for (var i = 0; i < allList.length; i++) {
                    if (allList[i].FarID == 0) {
                        var _obj = { ID: allList[i].ID, Name: allList[i].Name, sonList: [] };
                       model.com.findSonTree(_obj, allList);
                       reList.push(_obj);
                        //判断是否有子集
                    }
                }
                return reList;
            },
            //获得树子结构
            findSonTree:function (_obj, allList) {
                for (var i = 0; i < allList.length; i++) {
                    if (_obj.ID == allList[i].FarID) {
                        var thisObj = { ID: allList[i].ID, Name: allList[i].Name, sonList: [] };
                        _obj.sonList.push(thisObj);
                        model.com.findSonTree(thisObj, allList);
                    }
                }
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
            refreshTableAll: function () {
                maxResults=firstResult+onePages;
                model.com.getDefineCount({},function(resC){
                    counts=resC.info;
                    if(resC.info<=onePages){
                        maxResults=resC.info-1;
                    }else{
                        // 渲染分页
                        $page.getPage(counts,onePages,function(res){
                            var r_data=res;
                            firstResult=r_data.OnePageConut*(r_data.NOWPAGE-1);
                            maxResults=r_data.OnePageConut;
                            // 渲染表格
                            $com.app.loading("正在加载！");
                            model.com.getCountDefineTable({firstResult:firstResult,maxResults:maxResults},function(res){
                                dataExample = res.list;
                                var _dataExample = $com.util.Clone(dataExample);
                                $.each(_dataExample, function (i, item) {
                                   
                                    item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                                    $.each(DataUser, function (_i, _item) {
                                        if (_item.ID == item.AppayID) {
                                            item.Assignee = _item.Name;
                                        }
                                    })
                                    if (item.Status == 1) {
                                        item.Status = "激活";
                                    } else if (item.Status == 2) {
                                        item.Status = "挂起";
                                    }
        
                                });
                                _dataExample = _dataExample.sort(function (a, b) {
                                    return a.CreateTime < b.CreateTime ? 1 : -1
                                });
                                $.each(_dataExample,function(i,item){
                                    item.OrderID=i+1;
                                })
                                tableShow = _dataExample;
                                $("#cby-tbody-exampleTable").html($com.util.template(tableShow, HTML.TableExampleItemMode));
                                $com.app.loaded();
                            })
                        })
                    }
                    model.com.getCountDefineTable({firstResult:firstResult,maxResults:maxResults},function(res){
                        dataExample = res.list;
                        var _dataExample = $com.util.Clone(dataExample);
                        $.each(_dataExample, function (i, item) {
                            item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                            $.each(DataUser, function (_i, _item) {
                                if (_item.ID == item.AppayID) {
                                    item.Assignee = _item.Name;
                                }
                            })
                            if (item.Status == 1) {
                                item.Status = "激活";
                            } else if (item.Status == 2) {
                                item.Status = "挂起";
                            }

                        });
                        _dataExample = _dataExample.sort(function (a, b) {
                            return a.CreateTime < b.CreateTime ? 1 : -1
                        });
                        $.each(_dataExample,function(i,item){
                            item.OrderID=i+1;
                        })
                        tableShow = _dataExample;
                        $("#cby-tbody-exampleTable").html($com.util.template(tableShow, HTML.TableExampleItemMode));
                    })
                })
            },
            refreshFinishedAll: function () {
                var _dataFinishedBill = $com.util.Clone(dataFinishedBill);
                if(treeID==0){
                    $.each(_dataFinishedBill, function (i, item) {
                        item.OrderID = i + 1;
                        item.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.StartTime);
                        item.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.EndTime);
                        item.DurationInMillis = model.com.getLongTime(item.DurationInMillis);
                        $.each(DataUser, function (u_i, u_item) {
                            if (item.AppayID == u_item.ID) {
                                item.ApplyName = u_item.Name;
                            }
                        });
                    });
                }else{
                    
                }
               
                $("#cby-tbody-finishedTable").html($com.util.template(_dataFinishedBill, HTML.TableFinishedMode));
            },
            //渲染表格
            refreshTable:function(TreeID){
                // var _dataTable=$com.util.Clone(DataTable),
                //     showList=[],
                //     billList=[],
                //     exampleID;
                // $.each(_dataTable,function(i,item){
                //     if(item.tree_ID==TreeID){
                //         billList.push(item);
                //     }
                // });
                // var _dataExample=[];
                // model.com.getExample({},function(res){
                //     dataExample=res.list;
                //     $.each(dataExample,function(i,item){
                //         if(item.Category==TreeID){
                //             _dataExample.push(item);
                //         }
                //     });
                //     // 分页
                //     if(_dataExample.length<=onePages){
                //         maxResults=resC.info-1;
                //     }else{
                //         // 渲染分页
                //         $page.getPage(counts,onePages,function(res){
                //             var r_data=res;
                //         })
                //     }
                //     $.each(_dataExample,function(i,item){
                //         // item.OrderID = i + 1;
                //         item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                //         if(item.Status==1){
                //             item.Status="激活";
                //         }else if(item.Status==2){
                //             item.Status="挂起";
                //         }
                //         $.each(DataUser, function (_i, _item) {
                //             if (_item.ID == item.AppayID) {
                //                 item.Assignee = _item.Name;
                //             }
                //         })
                //     });
                //     _dataExample = _dataExample.sort(function (a, b) {
                //         return a.CreateTime < b.CreateTime ? 1 : -1
                //     });
                //     $.each(_dataExample,function(i,item){
                //         item.OrderID=i+1;
                //     })
                    
                //     tableShow=_dataExample;
                //     $("#cby-tbody-exampleTable").html($com.util.template(tableShow, HTML.TableExampleItemMode));
                // 进行中的实例
                maxResults=firstResult+onePages;
                model.com.getDefineCountByCategory({category:TreeID},function(resC){
                    counts=resC.info;
                    if(resC.info<=onePages){
                        firstResult=0;
                        maxResults=resC.info-1;
                    }else{
                        // 渲染分页
                        $page.getPage(counts,onePages,function(res){
                            var r_data=res;
                            firstResult=r_data.OnePageConut*(r_data.NOWPAGE-1);
                            maxResults=r_data.OnePageConut;
                            // 渲染表格
                            $com.app.loading("正在加载！");
                            model.com.getCountDefineTableByCategory({category:TreeID,firstResult:firstResult,maxResults:maxResults},function(res){
                                dataExample = res.list;
                                var _dataExample = $com.util.Clone(dataExample);
                                $.each(_dataExample, function (i, item) {
                                
                                    item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                                    $.each(DataUser, function (_i, _item) {
                                        if (_item.ID == item.AppayID) {
                                            item.Assignee = _item.Name;
                                        }
                                    })
                                    if (item.Status == 1) {
                                        item.Status = "激活";
                                    } else if (item.Status == 2) {
                                        item.Status = "挂起";
                                    }
        
                                });
                                _dataExample = _dataExample.sort(function (a, b) {
                                    return a.CreateTime < b.CreateTime ? 1 : -1
                                });
                                $.each(_dataExample,function(i,item){
                                    item.OrderID=i+1;
                                })
                                tableShow = _dataExample;
                                $("#cby-tbody-exampleTable").html($com.util.template(tableShow, HTML.TableExampleItemMode));
                                $com.app.loaded();
                            })
                        })
                    }
                    model.com.getCountDefineTableByCategory({category:TreeID,firstResult:firstResult,maxResults:maxResults},function(res){
                        dataExample = res.list;
                        var _dataExample = $com.util.Clone(dataExample);
                        $.each(_dataExample, function (i, item) {
                            item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                            $.each(DataUser, function (_i, _item) {
                                if (_item.ID == item.AppayID) {
                                    item.Assignee = _item.Name;
                                }
                            })
                            if (item.Status == 1) {
                                item.Status = "激活";
                            } else if (item.Status == 2) {
                                item.Status = "挂起";
                            }

                        });
                        _dataExample = _dataExample.sort(function (a, b) {
                            return a.CreateTime < b.CreateTime ? 1 : -1
                        });
                        $.each(_dataExample,function(i,item){
                            item.OrderID=i+1;
                        })
                        tableShow = _dataExample;
                        $("#cby-tbody-exampleTable").html($com.util.template(tableShow, HTML.TableExampleItemMode));
                    })
                })


                //渲染已完成的
                // var _dataExample=[];
                // model.com.getExample({},function(res){
                //     dataExample=res.list;
                //     $.each(dataExample,function(i,item){
                //         if(item.Category==TreeID){
                //             _dataExample.push(item);
                //         }
                //     });
                //     var _finishedData=[];
                //     $.each(_dataExample,function(d_i,d_item){
                //         $.each(dataFinishedBill,function(e_i,e_item){
                //             if(d_item.ProcessDefinitionID==e_item.ProcessDefinitionId){
                //                 _finishedData.push(e_item);
                //             }
                //         });
                //     });

                    
                //     $.each(_finishedData,function(i,item){
                //         item.OrderID=i+1;
                //         item.StartTime=$com.util.format('yyyy-MM-dd hh:mm:ss', item.StartTime);
                //         item.EndTime=$com.util.format('yyyy-MM-dd hh:mm:ss', item.EndTime);
                //         item.DurationInMillis=model.com.getLongTime(item.DurationInMillis);
                //         $.each(DataUser,function(u_i,u_item){
                //             if(item.AppayID==u_item.ID){
                //                 item.ApplyName=u_item.Name;
                //             }
                //         });
                //     });
                //     $("#cby-tbody-finishedTable").html($com.util.template(_finishedData, HTML.TableFinishedMode));
                // })
            },
            //渲染历史记录
            refreshRecord:function(tid){
                var showArr = [],
                    ProcessInstanceID;
                $.each(dataExample, function (i, item) {
                    if (item.ID == tid) {
                        ProcessInstanceID = item.ProcessInstanceID;
                    }
                })
                model.com.getExampleRecord({ processInstanceId: ProcessInstanceID }, function (res) {
                    dataRecord=res.list;
                    recordArr=$com.util.Clone(dataRecord);
                    $.each(recordArr,function(i,item){
                        $.each(DataTable,function(d_i,d_item){
                            if(item.processDefinitionId==d_item.id_){
                                item.processDefinitionName=d_item.name_;
                            }
                        });
                    });
                    $.each(recordArr,function(i,item){
                        item.createTime=$com.util.format('yyyy-MM-dd hh:mm:ss', item.createTime);
                        if(item.persistentState.endTime!=null){
                            item.endTime=$com.util.format('yyyy-MM-dd hh:mm:ss', item.persistentState.endTime);
                        }else{
                            item.endTime="";
                        }
                    });
                    $.each(recordArr,function(s_i,s_item){
                        $.each(DataUser,function(u_i,u_item){
                            if(s_item.assignee==u_item.ID){
                                s_item.assignee=u_item.Name;
                            }
                        });
                        s_item.OrderID=s_i+1;
                    });
                    showArr=recordArr;
                    $("#cby-tbody-recordTable").html($com.util.template(showArr, HTML.TableRecordItemMode));
                });
                
            },
            getLongTime:function(mss){
                var days = parseInt(mss / (1000 * 60 * 60 * 24));
                var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = (mss % (1000 * 60)) / 1000;
                var _time=days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 ";
                return _time;
            
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
            addTreeItemTable: function (data, fn, context) {
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
            deleteTreeItemTable: function (data, fn, context) {
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
            //获得表单数据
            // getItemTable: function (data, fn, context) {
            //     var d = {
            //         $SERVER:"/MESBPM",
            //         $URI: "/Leave/AllDefinitions",
            //         $TYPE: "get"
            //     };

            //     function err() {
            //         $com.app.tip('获取失败，请检查网络');
            //     }

            //     $com.app.ajax($.extend(d, data), fn, err, context);
            // },
            // getItemTable: function (data, fn, context) {
            //     var d = {
            //         $SERVER:"/MESBPM",
            //         $URI: "/Leave/GetExecution",
            //         $TYPE: "get"
            //     };

            //     function err() {
            //         $com.app.tip('获取失败，请检查网络');
            //     }

            //     $com.app.ajax($.extend(d, data), fn, err, context);
            // },
            //获得实例
            getExample: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Leave/GetExecution",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获得流程图
            getExampleCharf: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Leave/Image",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获得历史记录
            getExampleRecord: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Leave/GetHistoryByActiviti",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //激活实例
            onExample: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Leave/ActiveRouteExample",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //挂起实例
            stopExample: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Leave/StopRouteExample",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除
            deleteExample: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Leave/RemoveRouteExample",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //根据实例查询干预记录
            getRecord:function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Task_intervene/AllByProcessInstanceID",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取已完成实例
            //getFinishedBill:function (data, fn, context) {
            //    var d = {
            //        $SERVER:"/MESBPM",
            //        $URI: "/Leave/GetFinishedExample",
            //        $TYPE: "get"
            //    };

            //    function err() {
            //        $com.app.tip('获取失败，请检查网络');
            //    }

            //    $com.app.ajax($.extend(d, data), fn, err, context);
            //},
            getFinishedBill: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/History/getFinishedProcessInstance",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // 获得实例数量
            getDefineCount:function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Runtime/getExecutionCount",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // 获得分页实例
            getCountDefineTable:function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Runtime/getExecutionlistPage",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
             // 根据分类获得实例数量
             getDefineCountByCategory:function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Runtime/getExecutionCountByCategory",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // 根据分类获得分页实例
            getCountDefineTableByCategory:function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Runtime/getExecutionListPageByCategory",
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
        },
       
    });
    model.init();
});