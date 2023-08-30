require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview', ], function ($zace, $com, $tree) {
    var dataTree,
        DataTable,
        DataUser,
        treeID,
        tableShow,
        $farID,
        defineID
        $flag=false;

    var HTML = {
        TableDesignItemMode: [
            '<tr>',
            //   '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td style="min-width: 30px;max-width: 90px;" data-title="#" data-value="#">',
            '<div class="td-contain"><span class="td-contain-list" id="cby-update-table">分类</span>',
            //'<span class="td-contain-list cby-downRoute-lists" id="cby-update-table">分类</span>',
            '<span class="td-contain-list cby-downRoute-lists" id="cby-show-route">流程图</span></div>',
            '</td>  ',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="ID_" data-value="{{ID_}}" >{{ID_}}</td>',
            '<td data-title="NAME_" data-value="{{NAME_}}" >{{NAME_}}</td>',
            '<td data-title="KEY_" data-value="{{KEY_}}" >{{KEY_}}</td>',
            '<td data-title="VERSION_" data-value="{{VERSION_}}" >{{VERSION_}}</td>',
            '<td data-title="CodDESCRIPTION_e" data-value="{{CodDESCRIPTION_e}}" >{{CodDESCRIPTION_e}}</td>',
            '<td data-title="TreeName" data-value="{{TreeName}}" >{{TreeName}}</td>',
            // '<td data-title="ISUSE" data-value="{{ISUSE}}" >{{ISUSE}}</td>',
            '<td data-title="CREATERName" data-value="{{CREATERName}}" >{{CREATERName}}</td>',
            '<td data-title="TIME" data-value="{{TIME}}" >{{TIME}}</td>',
            '</tr>',
        ].join(""),

        TreeItemNode: [
            '<li data-titie="{{ID}}"  data-value="{{ID}}" >',
            '<span style="vertical-align:top;" data-value="{{ID}}"}" >{{Name}}</span> ',
            '<ul>{{Items}}',
            '</ul>',
            '</li>',
        ].join(""),

    }
    var KEYWORD_BillItem_LIST,
    KEYWORD_BillItem,
    FORMATTRT_BillItem,
    TypeSource_BillItem,
    DEFAULT_VALUE_Bill,
        
    KEYWORD_treeItem_LIST,
    KEYWORD_treeItem,
    FORMATTRT_treeItem,
    TypeSource_treeItem,
    DEFAULT_VALUE_tree;


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
        KEYWORD_treeItem_LIST = [
            "TreeID|流程分类树名|ArrayOne"
        ];
        KEYWORD_treeItem = {};
        FORMATTRT_treeItem = {};
        DEFAULT_VALUE_tree = {
            TreeID: "",
        }

        TypeSource_treeItem = {
            TreeID: [
                {
                    name: "",
                    value: 1
                },
            ],
        };

        $.each(KEYWORD_treeItem_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_treeItem[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_treeItem[detail[0]] = $com.util.getFormatter(TypeSource_treeItem, detail[0], detail[2]);
            }
        });
    });


    model = $com.Model.create({
        name: '流程设计',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },
        run:function(){
            $("#routeTree").bind("contextmenu", function(){
                return false;
            });
            model.com.getItemTree({},function(resT){
                dataTree=resT.list;
                model.com.refreshTree();
            });
            $("#cby-route-charf").hide();
            
            model.com.getItemTable({},function(res){
                DataTable=res.list;
                DataUser=window.parent._UserAll;
                model.com.refreshAllList();
            });
            $(".cby-downRoute-list").hide();
        },
        events:function(){
            //操作hover事件
            // $("#cby-more-lists").hover(function(){
            //     $("#cby-downRoute-list").css("display","block");
            //     },function(){
            //         $("#cby-downRoute-list").css("display","none");
            // });
           
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
            //右键修改事件
            $("body").delegate("#cby-edit-class","click",function(){
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
                    model.com.addItemTable({
                        data: newObj
                    }, function (res) {
                        alert("修改成功");
                        model.com.getItemTree({}, function (resT) {
                            dataTree = resT.list;
                            model.com.refreshTree();
                        });
                    });
                    $("#cby-tree-tooltip").remove();
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
                var id = $(this).attr("data-titie");
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

                model.com.refreshTable(id);
                return false;
            });
            //表格添加事件
            $("body").delegate("#cby-add-table","click",function(){
                model.com.addTableItem({tid:treeID},function(res){
                    var data_TableItem=res,
                        modelID=res.info,
                        $href=$com.routeUrl+"/MESBPM/modeler.html?modelId="+modelID,
                        vdata = { 'header': '流程引擎', 'id': 'DeviceInfo', 'href': $href, 'src': './static/images/menu/deviceManage/deviceInformation.png' };
                    window.parent.iframeHeaderSet(vdata);
                });
            });
            //表格数据修改事件
            $("body").delegate("#cby-update-table", "click", function () {
                var $id = $(this).closest("td").next().next().attr("data-value");
                $.each(dataTree, function (i, item) {
                    TypeSource_treeItem.TreeID.push({
                        name: item.Name,
                        value: item.ID
                    })
                })
                $("body").append($com.modal.show(DEFAULT_VALUE_tree, KEYWORD_treeItem, "修改", function (rst) {
                    var _$ID, _$farID;
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var newObj = {};
                    newObj = {
                        processDefinitionId: $id,
                        treeID:Number( rst.TreeID),
                    }
                    model.com.updateTreeOwn({
                        processDefinitionId: $id,
                        treeID: Number(rst.TreeID),
                    }, function (res) {
                        alert("修改成功");
                        model.com.getItemTree({}, function (resT) {
                            dataTree = resT.list;
                            model.com.refreshTree();
                            model.com.getItemTable({}, function (res) {
                                DataTable = res.list;
                                DataUser = window.parent._UserAll;
                                model.com.refreshAllList();
                            });
                        });
                        TypeSource_treeItem = {
                            TreeID: [
                                {
                                    name: "",
                                    value: 1
                                },
                            ],
                        };
                    });
                }, TypeSource_treeItem));
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
            //删除流程
            $("body").delegate("#cby-delete-route","click",function(){
                var tid=$(this).closest("td").next().next().attr("data-value");
                if (!confirm("确定删除？")) {
                    return;
                }
                model.com.deleteTableItem({id:tid},function(){

                    model.com.refreshTable(treeID);
                });
            });

             //启动流程
            // $("body").delegate("#cby-start-route","click",function(){
            //    var $id=$(this).closest("td").next().next().attr("data-value"),
            //        $key,
            //        $defineID,ProdefinVersion,ActivitiID;
            //    //获得版本号
            //    $.each(DataTable,function(i,item){
            //        if(item.ID_==$id){
            //            ProdefinVersion=item.VERSION_;
            //            return false;
            //        }
            //    });
            //    //获得活动ID
            //    model.com.getActivitiID({processDefinitionId:$id},function(res){
            //        // var _data=res.list[0];
            //        ActivitiID = "submitMonthPlan";
            //        //跳转页面
            //        model.com.searchBill({processDefinitionId:$id,ActivitID:ActivitiID,ProdefinVersion:ProdefinVersion},function(res){
            //            var data=res.info,
            //                url=data.FormUrl;
                            
            //                $href=url+"?defineID="+$id;
    
            //                vdata = { 'header': '任务模板', 'id': 'LeaveInfo', 'href': $href, 'src': './static/images/menu/deviceManage/deviceInformation.png' };
            //                window.parent.iframeHeaderSet(vdata);
            //        }); 
            //    });
            //    model.com.refreshTable(treeID);
            //});
            //查看流程图
            $("body").delegate("#cby-show-route","click",function(){
                var tid,DEPLOYMENT_ID_;
                    tid=$(this).closest("td").next().next().attr("data-value");
                $.each(DataTable,function(i,item){
                    if(item.ID_==tid){
                        DEPLOYMENT_ID_=item.ID_;
                    }
                });
                var $src=$com.imageUrl+"/MESBPM/api/Leave/Image2defin?processDefinitionId="+DEPLOYMENT_ID_;
                $("#cby-route-charf img").attr("src",$src);
                $("#cby-route-charf").show();
                // $("#cby-table").hide();
                $(".femi-full-bd").css("height","50%");
            });
            //返回到表格
            $("body").delegate("#cby-return-table","click",function(){
                model.com.refreshTable(treeID);
                $("#cby-route-charf").hide();
                $(".femi-full-bd").css("height","100%");
                $("#cby-table").show();
            });
            //更多功能
            $("body").delegate(".cby-more-lists","click",function(){
                defineID=$(this).closest("td").next().next().attr("data-value");
                if($flag==true){
                    // $(this).closest("#cby-downRoute-list").hide();
                    $(this).children("#cby-downRoute-list").hide();
                    $flag=false;
                }else{
                    $(this).children("#cby-downRoute-list").show();
                    $flag=true;
                }

            });
            //设计
            $("body").delegate("#cby-route-design","click",function(){
                $(this).closest("#cby-downRoute-list").hide();
                var modelID;
                $.each(DataTable,function(i,item){
                    if(item.ID_==defineID){
                        modelID=item.ModelID;
                        return false;
                    }
                });
                //http://192.168.1.108:8088/MESBPM/modeler.html?modelId=127514
                var $href=$com.routeUrl+"/MESBPM/modeler.html?modelId="+modelID,
                    vdata = { 'header': '设计', 'id': 'DeviceInfo', 'href': $href, 'src': './static/images/menu/deviceManage/deviceInformation.png' };
                    window.parent.iframeHeaderSet(vdata);
            });
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
            refreshAllList:function(){
                var _dataTable=$com.util.Clone(DataTable);
                $.each(_dataTable,function(i,item){
                    $.each(DataUser,function(u_i,u_item){
                        if(item.CREATERID==u_item.ID){
                            item.CREATERName=u_item.Name;
                        }
                    });
                    item.OrderID=i+1;
                    item.TIME=$com.util.format('yyyy-MM-dd hh:mm:ss', item.TIME);
                });
                $.each(_dataTable, function (i, item) {
                    $.each(dataTree, function (t_i, t_item) {
                        if (item.TREE_ID == t_item.ID) {
                            item.TreeName = t_item.Name
                        }
                    })
                })
                tableShow=_dataTable;
                $("#cby-tbody-designTable").html($com.util.template(_dataTable, HTML.TableDesignItemMode));
                $("#cby-downRoute-list").css("display","none");
            },
            refreshTable:function(TreeID){
                var _dataTable=$com.util.Clone(DataTable),
                    showList=[];
                $.each(_dataTable,function(i,item){
                    if(item.TREE_ID==TreeID){
                        showList.push(item);
                    }
                })
                $.each(showList,function(i,item){
                    $.each(DataUser,function(u_i,u_item){
                        if(item.CREATERID==u_item.ID){
                            item.CREATERName=u_item.Name;
                        }
                    });
                    // if(item.ISUSE==0){
                    //     item.ISUSE="不使用";
                    // }else{
                    //     item.ISUSE="使用";
                    // } 
                    item.OrderID=i+1;
                    item.TIME=$com.util.format('yyyy-MM-dd hh:mm:ss', item.TIME);
                });
                tableShow=showList;
                $("#cby-tbody-designTable").html($com.util.template(showList, HTML.TableDesignItemMode));
                $("#cby-downRoute-list").css("display","none");
            },
            //更新流程定义所属分类
            updateTreeOwn: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Leave/UpdateProceTree",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
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
            //获得表格数据
            getItemTable: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Leave/AllDefinitions",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //添加流程
            addTableItem: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Model/Create",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除流程
            deleteTableItem: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Leave/RemoveDefin",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // //启动流程1
            // startTableItem: function (data, fn, context) {
            //     var d = {
            //         $SERVER:"/MESBPM",
            //         $URI: "/leave/startProcessInstance2",
            //         $TYPE: "get"
            //     };

            //     function err() {
            //         $com.app.tip('获取失败，请检查网络');
            //     }

            //     $com.app.ajax($.extend(d, data), fn, err, context);
            // },

            //启动流程2
            startTableItem: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Leave/StartProcessInstance",
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
            getActivitiID: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Leave/QueryUserTask",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getOwnTask: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Leave/AllTask2definID",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        },
       
    });
    model.init();
});