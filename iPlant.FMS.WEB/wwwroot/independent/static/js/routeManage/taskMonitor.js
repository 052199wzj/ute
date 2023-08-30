require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview','../static/utils/js/base/paging' ], function ($zace, $com, $tree,$page) {
    var dataTree,
        DataUser,
        treeID,
        $farID,
        dataAllTask,
        TableData,
        dataTableShow,
        dataAllDefine,
        dataRecordShow,
        dataExample,
        ACTIVE,
        $tree_val,
        firstResult=0,
        maxResults,
        counts,
        onePages=15;

    ACTIVE = ["非委托任务", "委托任务待办", "委托任务已办"];
    var HTML = {
        TableTaskItemMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            
            '<td data-title="OrderID" data-value="{{OrderID}}">{{OrderID}}</td>',
            '<td data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td data-title="ProcessInstanceId" data-value="{{ProcessInstanceId}}">{{ProcessInstanceId}}</td>',
            '<td data-title="processInstanceCode" data-value="{{processInstanceCode}}">{{processInstanceCode}}</td>',
            '<td data-title="Status" data-value="{{Status}}">{{Status}}</td>',
            '<td data-title="Name" data-value="{{Name}}">{{Name}}</td>',
            '<td data-toggle="tooltip" title="{{AssigneeName}}" class="cby-limit-length" data-title="AssigneeName" data-value="{{AssigneeName}}">{{AssigneeName}}</td>',
            '<td class="cby-limit-length" data-title="CREATERName" data-value="{{CREATERName}}">{{CREATERName}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}">{{CreateTime}}</td>',
            '<td style="min-width: 30px;max-width: 120px;" data-title="#" data-value="#">',
            '<div class="td-contain"><span class="td-contain-list" id="cby-move-task">干预任务</span>',
            '<span class="td-contain-list cby-downRoute-lists" id="cby-move-list">干预记录</span>',
            '<span class="td-contain-list cby-downRoute-lists" id="cby-finish-task">完成任务</span>',
            '</div>',
            '</td>',
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
            '<td data-title="OrderID" data-value="{{OrderID}}">{{OrderID}}</td>',
            '<td data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td data-title="InitialPeople" data-value="{{InitialPeople}}" >{{InitialPeople}}</td>',
            '<td data-title="IntervenePeople" data-value="{{IntervenePeople}}">{{IntervenePeople}}</td>',
            '<td data-title="InterveneTime" data-value="{{InterveneTime}}">{{InterveneTime}}</td>',
            '<td data-title="Remark" data-value="{{Remark}}">{{Remark}}</td>',
            '</tr>',
        ].join(""),
        pageTemplate: [
            '<div class="cby-paging-body">',
            '<ul class="cby-paging">',
            '<li class="cby-first-page"><img src="../static/images/pageTest/first.png" alt="" /></li>',
            '<li class="cby-front-page"><button class="">上一页</button></li>',
            '<li class="">|</li>',
            '<li class="cby-all-list">共<input type="text" name="" value="{{COUNTS}}" disabled="disabled" />条数据</li>',
            '<li class="cby-now-page">第<input type="text" name="" value="{{NOWPAGE}}" disabled="disabled" />页</li>',
            '<li class="cby-all-page">共<input type="text" name="" value="{{PAGES}}" disabled="disabled" />页</li>',
            '<li ><span class="cby-change-page">跳转到</span><input class="change-input" type="text" name="" value="{{TURNPAGE}}" style="padding-top:1px;" />页</li>',
            '<li ><span class="cby-change-onepage">当前数据</span><input class="nowpage-input" type="text" name="" value="{{OnePageConut}}" style="padding-top:1px;"/>条</li>',
            '<li class="">|</li>',
            '<li class="cby-next-page"><button class="">下一页</button></li>',
            '<li class="cby-last-page"><img src="../static/images/pageTest/last.png" alt="" /></li>',
            '</ul>',
            '</div>'
        ].join(""),
    

    }
    var KEYWORD_BillItem_LIST,
    KEYWORD_BillItem,
    FORMATTRT_BillItem,
    TypeSource_BillItem,
    DEFAULT_VALUE_Bill;

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


    var KEYWORD_Item_LIST,
    KEYWORD_Item,
    FORMATTRT_Item,
    TypeSource_Item,
    DEFAULT_VALUE;

    $(function () {
        KEYWORD_Item_LIST = [
            "Name|指派给|ArrayOne",
            "Remark|备注"    
        ];
        KEYWORD_Item = {};
        FORMATTRT_Item = {};
        DEFAULT_VALUE={
            Name:"",
            Remark:""
        }

        TypeSource_Item = {
            Name:[
                {
                    name: "",
                    value: 1
                },
            ],
            
        };

        $.each(KEYWORD_Item_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Item[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Item[detail[0]] = $com.util.getFormatter(TypeSource_Item, detail[0], detail[2]);
            }
        });
    });


    model = $com.Model.create({
        name: '任务监控',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },
        run:function(){
            $("#routeTree").bind("contextmenu", function(){
                return false;
            });
            $com.app.loading("正在加载配置！");
            model.com.getItemTree({},function(resT){
                dataTree=resT.list;
                model.com.refreshTree();
            });
            // model.com.getTaskTable({},function(res){
            DataUser=window.parent._UserAll;
            // model.com.getExample({},function(res){
            //     dataExample=res.list;
                model.com.refreshTaskTable();
                $com.app.loaded();
            // });
                        
            
            // });
            
            model.com.getAllDefine({},function(res){
                dataAllDefine=res.list;
            });
            $("#cby-record-table").hide();
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
                    var newObj={};
                    newObj={
                        ID:0,
                        Name:rst.Name,
                        FarID:$farID
                    }
                    if(newObj.Name==""){
                        alert("分类名不可为空！！")
                        model.com.refreshTaskTable();
                        $("#cby-tree-tooltip").remove();
                    }else{
                        model.com.addItemTable({
                            data: newObj
                        }, function (res) {
                            model.com.getItemTree({}, function (resT) {
                                dataTree = resT.list;
                                alert("新增成功");
                                model.com.refreshTree();
                                model.com.refreshTaskTable();
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
                        model.com.refreshTaskTable();
                        $("#cby-tree-tooltip").remove();
                    }else{
                        model.com.addItemTable({
                            data: newObj
                        }, function (res) {
                            model.com.getItemTree({}, function (resT) {
                                dataTree = resT.list;
                                alert("修改成功");
                                model.com.refreshTree();
                                model.com.refreshTaskTable();
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
                model.com.deleteItemTable({
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
                    model.com.addItemTable({
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

                model.com.refreshItemTable(id);
                return false;
            });
            //模糊查询任务表
            $("body").delegate("#cby-aroundSearch-table", "change", function () {
                var $this = $(this),
                    value = $(this).val();
                
                if (value == undefined || value == "" || value.trim().length < 1) {
                    $("#cby-tbody-taskTable").children("tr").show();
                }
                else
                    $com.table.filterByLikeString($("#cby-tbody-taskTable"), TableData, value, "ID");
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
            //干预指派任务
            $("body").delegate("#cby-move-task","click",function(){
                var taskId,
                    $tdList = $(this).closest("td").parent("tr").children("td");
           
                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        taskId = $tdList.eq(i).next().attr("data-value");
                    }
                }

                // var taskId=$(this).closest("td").next().next().attr("data-value");
                $.each(DataUser,function(i,item){
                    TypeSource_Item.Name.push({
                        name: item.Name,
                        value: item.ID,
                    });
                });

                var defaultValue={
                    taskName:"",
                    processDefinitionId:""
                }
                $.each(dataAllTask,function(i,item){
                    if(item.ID==taskId){
                        defaultValue.taskName=item.Name;
                        defaultValue.processDefinitionId=item.ProcessInstanceId;
                        return false;
                    }
                });
                $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_Item, "新增", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var recordData={
                        // ID:0,
                        TaskID:taskId,
                        InitialPeople:0,
                        IntervenePeople:rst.Name,
                        // InterveneTime:"",
                        Remark:rst.Remark,
                        TaskName:defaultValue.taskName,
                        ProcessInstanceID:defaultValue.processDefinitionId
                    }    
                    
                     
                    model.com.moveTask({taskId:taskId,userId:rst.Name}, function (res) {
                        $.each(dataAllTask,function(i,item) {
                            if(item.ID==taskId){
                                recordData.InitialPeople=item.Assignee;
                                return false;
                            }
                        });
                        model.com.addMoveRecord({data:recordData},function() {
                            
                            alert("指派成功");
                        })
                    });
                }, TypeSource_Item));
            });
            //干预记录
            $("body").delegate("#cby-move-list","click",function(){
                var taskId,
                    $tdList = $(this).closest("td").parent("tr").children("td");
           
                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        taskId = $tdList.eq(i).next().attr("data-value");
                    }
                }
                // var taskId=$(this).closest("td").next().next().attr("data-value");
                var moveTaskData;
                // 查询当前任务的干预记录
                model.com.getMoveRecord({TaskID:taskId},function(res) {
                    moveTaskData=res.list;
                    var _moveTaskData=$com.util.Clone(moveTaskData);
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
                    $("#cby-tbody-moveRecordTable").html($com.util.template(_moveTaskData, HTML.RecordItemNode));
                    $("#cby-task-table").hide();
                    $("#cby-record-table").show();
                }); 
            });
            //返回列表
            $("body").delegate("#cby-return-recordTable","click",function(){
                $("#cby-task-table").show();
                $("#cby-record-table").hide();
            });
            //完成任务
            $("body").delegate("#cby-finish-task","click",function(){
                var taskId,
                    $tdList = $(this).closest("td").parent("tr").children("td");
           
                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        taskId = $tdList.eq(i).next().attr("data-value");
                    }
                }
                // var taskId=$(this).closest("td").next().next().attr("data-value");
                model.com.finishTask({taskId:taskId},function(){
                    var ProdefinID,ActivitID,ProdefinVersion;
                    $.each(dataAllTask,function(i,item){
                        if(item.ID==taskId){
                            ProdefinID=item.ProcessDefinitionId;
                            ActivitID=item.ActivitiID;
                            return false;
                        }
                    });
                    $.each(dataAllDefine,function(i,item){
                        if(item.id_==ProdefinID){
                            ProdefinVersion=Number(item.version_);
                            return false;
                        }
                    });
                    model.com.searchBill({processDefinitionId:ProdefinID,ActivitID:ActivitID,ClientType:0},function(res){
                        var data=res.info,
                            url=data.FormUrl;
                            
                        if (url == null) {
                            return false;
                        }

                        $href=url+"?taskID="+taskId;

                        vdata = { 'header': '任务模板', 'id': 'LeaveInfo', 'href': $href, 'src': './static/images/menu/deviceManage/deviceInformation.png' };
                        window.parent.iframeHeaderSet(vdata);
                    });
                });
            });

            //人员悬浮显示
            $(".cby-limit-length").hover(function(e){
                var otitle = $(this).attr("data-value");
                this.title = "";
                var ndiv = "<div id='leo'>" + otitle + "</div>";
                $("body").append(ndiv);
                $("#leo").css({
                    "top" : (e.pageY + y) + "px",
                    "left" : (e.pageX + x) + "px"
                }).show(2000);
                $(this).mousemove(function(e) {
                    $("#leo").css({
                        "top" : (e.pageY + y) + "px",
                        "left" : (e.pageX + x) + "px"
                    }).show(1000);
                });
            }, function() {
                this.title = otitle;
                $("#leo").remove();
            })
        },
        com:{
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
            //根据treeID的得到对应任务
            refreshItemTable:function(TreeID){
                model.com.getTaskCountByCategory({category:TreeID},function(resC){
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
                            model.com.getTaskTableByCategory({category:TreeID,firstResult:firstResult,maxResults:maxResults},function(resT){
                                var _dataTaskAll = $com.util.Clone(resT.list);
                                $.each(_dataTaskAll, function (i, item) {
                                    item.OrderID = i + 1;
                                    item.Status = ACTIVE[item.delegationState];
                                    item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                                    $.each(DataUser,function(u_i,u_item){
                                        if(item.Assignee==u_item.ID){
                                            //item.CREATERName=u_item.Name;
                                            item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                                            item.AssigneeName = u_item.Name;
                                        }
                                        if (item.CreateID == u_item.ID) {
                                            item.CREATERName=u_item.Name;
                                            //item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                                            //item.AssigneeName = u_item.Name;
                                        } 
                                    });
                                });
                                TableData = _dataTaskAll;
                                $("#cby-tbody-taskTable").html($com.util.template(_dataTaskAll, HTML.TableTaskItemMode));
                                $com.app.loaded();
                            })
                        })
                    }
                    model.com.getTaskTableByCategory({category:TreeID,firstResult:firstResult,maxResults:maxResults},function(resT){
                        var _dataTaskAll = $com.util.Clone(resT.list);
                        $.each(_dataTaskAll, function (i, item) {
                            item.OrderID = i + 1;
                            item.Status = ACTIVE[item.delegationState];
                            item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                            $.each(DataUser,function(u_i,u_item){
                                if(item.Assignee==u_item.ID){
                                    //item.CREATERName=u_item.Name;
                                    item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                                    item.AssigneeName = u_item.Name;
                                }
                                if (item.CreateID == u_item.ID) {
                                    item.CREATERName=u_item.Name;
                                    //item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                                    //item.AssigneeName = u_item.Name;
                                } 
                            });
                        });
                        TableData = _dataTaskAll;
                        $("#cby-tbody-taskTable").html($com.util.template(_dataTaskAll, HTML.TableTaskItemMode));
                        $com.app.loaded();
                    })
                })
            },
            //渲染所有任务表
            refreshTaskTable:function(){
                maxResults=firstResult+onePages;
                model.com.getTaskCount({},function(resC){
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
                            model.com.getCountTaskTable({firstResult:firstResult,maxResults:maxResults},function(res){
                                dataAllTask=res.list;
                                var _dataTaskAll=$com.util.Clone(dataAllTask);
                                $.each(_dataTaskAll, function (i, item) {
                                    item.OrderID = i + 1;
                                    item.Status = ACTIVE[item.delegationState];
                                    item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                                    $.each(DataUser,function(u_i,u_item){
                                        if(item.Assignee==u_item.ID){
                                            //item.CREATERName=u_item.Name;
                                            item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                                            item.AssigneeName = u_item.Name;
                                        }
                                        if (item.CreateID == u_item.ID) {
                                            item.CREATERName=u_item.Name;
                                            //item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                                            //item.AssigneeName = u_item.Name;
                                        } 
                                    });
                                });
                                TableData = _dataTaskAll;
                                $("#cby-tbody-taskTable").html($com.util.template(_dataTaskAll, HTML.TableTaskItemMode));
                                $com.app.loaded();
                            })
                        
                        })
                    }
                    model.com.getCountTaskTable({firstResult:firstResult,maxResults:maxResults},function(res){
                        dataAllTask=res.list;
                        var _dataTaskAll=$com.util.Clone(dataAllTask);
                        $.each(_dataTaskAll, function (i, item) {
                            item.OrderID = i + 1;
                            item.Status = ACTIVE[item.delegationState];
                            item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                            $.each(DataUser,function(u_i,u_item){
                                if (item.CreateID == u_item.ID) {
                                    item.CREATERName=u_item.Name;
                                    //item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                                    //item.AssigneeName = u_item.Name;
                                } 
                            });
                        });
                        $.each(_dataTaskAll, function (i, item) {
                            var AssigneeNameList=model.com.getArray(item.Assignee),
                                // CREATERNameList=model.com.getArray(item.CreateID),
                                _AssigneeNameList=[];
                            $.each(AssigneeNameList,function(u_i,u_item){
                                $.each(DataUser, function (b_i, b_item) {
                                    if (u_item == b_item.ID) {
                                        _AssigneeNameList.push(b_item.Name);
                                    }
                                })
                            })
                            // $.each(CREATERNameList,function(u_i,u_item){
                            //     $.each(DataUser, function (b_i, b_item) {
                            //         if (u_item == b_item.ID) {
                            //             _CREATERNameList.push(b_item.Name);
                            //         }
                            //     })
                            // })
                            item.AssigneeName=_AssigneeNameList;
                            // item.CREATERName=_CREATERNameList;
                        })
                        TableData = _dataTaskAll;
                        $("#cby-tbody-taskTable").html($com.util.template(_dataTaskAll, HTML.TableTaskItemMode));
                    })
                })
                
                
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
            //获得所有任务
            getTaskTable: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Leave/AllTask",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获得分页所有任务
            getCountTaskTable: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Runtime/getUnfinishedTaskListPage",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // 获得任务总数
            getTaskCount: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Runtime/getUnfinishedTaskCount",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // 根据分类获取任务
            getTaskTableByCategory: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Runtime/getUnfinishedTaskListPageByCategory",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // 根据分类获取任务总数
            getTaskCountByCategory: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Runtime/getUnfinishedTaskCountByCategory",
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
            //获得所有流程定义
            // getAllDefine: function (data, fn, context) {
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
            getAllDefine: function (data, fn, context) {
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
            //获得单个任务
            getItemTask: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Leave/AllTask2definID",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //干预任务
            moveTask:function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Leave/MoveTask",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //新增干预记录
            addMoveRecord:function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Task_intervene/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询干预记录
            getMoveRecord:function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Task_intervene/AllByTaskID",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
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
            //完成任务
            finishTask: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Leave/MoveTaskMyself",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //完成我的任务
            completeMyPersonalTask: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Leave/CompleteMyPersonalTask",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询单条
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
            //
            getResultList: function (list, fn) {
                model.com.getItemTask({ data: list }, function (res) {
                    dataItemTask = res.list;
                    fn(res.list);
                });
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