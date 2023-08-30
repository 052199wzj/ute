require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview', ], function ($zace, $com, $tree) {
    var dataTree,
        DataTable,
        DataUser,
        treeID=0,
        mFormID,
        AllType,
        mCurrentData,
        tableShow,
        ClientType=0,
        $tree_val;

    var KEYWORD_BillItem_LIST,
        KEYWORD_BillItem,
        FORMATTRT_BillItem,
        TypeSource_BillItem,
        DEFAULT_VALUE_Bill,

        KEYWORD_Item_LIST_url,
        KEYWORD_Item_url,
        FORMATTRT_Item_url,
        TypeSource_Item_url,
        DEFAULT_VALUE_url,

        KEYWORD_WIDGET_LIST,
        KEYWORD_WIDGET,
        FORMATTRT_WIDGET,
        TypeSource_WIDGET,
        DEFAULT_VALUE;

    
    var HTML = {
        TableBillItemMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="Type" data-value="{{Type}}" >{{Type}}</td>',
            '<td data-title="Url" data-value="{{Url}}" >{{Url}}</td>',
            '<td data-title="StartTime" data-value="{{StartTime}}" >{{StartTime}}</td>',
            '<td style="min-width: 30px;max-width: 100px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-delete-bill" >删除</span><span class="td-contain-list" id="cby-edit-bill">修改</span><span class="td-contain-list" id="cby-show-bill" >浏览</span><span class="td-contain-list" id="cby-show-button">控件配置</span></div> </td>  ',
            '</tr>',
        ].join(""),

        TreeItemNode: [
            '<li data-titie="{{ID}}"  data-value="{{ID}}" >',
            '<span style="vertical-align:top;" data-value="{{ID}}"}" >{{Name}}</span> ',
            '<ul>{{Items}}',
            '</ul>',
            '</li>',
        ].join(""),

        TableWidget: [
         '<tr>',
         '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
         '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
         '<td data-title="ButtonId" data-value="{{ButtonId}}" >{{ButtonId}}</td>',
         '<td data-title="ButtonName" data-value="{{ButtonName}}" >{{ButtonName}}</td>',
         '<td data-title="WidgetTypeName" data-value="{{WidgetTypeName}}" >{{WidgetTypeName}}</td>',
         '<td data-title="Remark" data-value="{{Remark}}" >{{Remark}}</td>',
         '<td style="min-width: 30px;max-width: 100px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-delete-widget">删除</span><span class="td-contain-list" id="cby-deit-widget">修改</span></div></td>  ',
         '</tr>',
        ].join(""),
        TableType: [
        '<tr>',
        '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
        '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
        '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
        '<td style="min-width: 30px;max-width: 60px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-delete-type">删除</span><span class="td-contain-list" id="cby-deit-type">修改</span></div></td>  ',
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
            // ID:0,
            // Key:"",
            // Type:0,
            // Status:0,
            // Version:0,
            // Url:"",
            // FarID:0
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
        KEYWORD_Item_LIST_url = [
            "ID|编号",
            "Type|类型|ArrayOne",
            "Name|单据名称",
            "Key|标识",
            "Status|状态",
            "Version|版本",
            "Url|地址",
            "FarID|树ID",     
        ];
        KEYWORD_Item_url = {};
        FORMATTRT_Item_url = {};
        DEFAULT_VALUE_url = {
            Name:"",
            Url:"",
            // ID:0,
            // Key:"",
            // Type:0,
            // Status:0,
            // Version:0,
            // FarID:0
        }

        TypeSource_Item_url = {
            Name:[
                {
                    name: "",
                    value: 1
                },
            ],
            Url:[
                {
                    name: "",
                    value: 1
                },
            ],
            Type: [
                {
                    name: "网页端",
                    value: 0
                },
                {
                    name: "移动端",
                    value: 1
                },
                //{
                //    name: "客户端",
                //    value: 2
                //},
            ]
        };

        $.each(KEYWORD_Item_LIST_url, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Item_url[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Item_url[detail[0]] = $com.util.getFormatter(TypeSource_Item_url, detail[0], detail[2]);
            }
        });
    });
    $(function () {
        KEYWORD_WIDGET_LIST = [
            "ButtonId|控件标识",
            "ButtonName|控件名称",
            "WidgetTypeID|控件类型|ArrayOne",
            "Remark|备注",
        ];
        KEYWORD_WIDGET = {};
        FORMATTRT_WIDGET = {};
        DEFAULT_VALUE = {
            WidgetTypeID:0,
            ButtonId: "",
            ButtonName: "",
            Remark: "",
        }

        TypeSource_WIDGET = {
            WidgetTypeID: [
                {
                    name: "无",
                    value:0
                }
            ]
        };

        $.each(KEYWORD_WIDGET_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_WIDGET[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_WIDGET[detail[0]] = $com.util.getFormatter(TypeSource_WIDGET, detail[0], detail[2]);
            }
        });
        $(function () {
            KEYWORD_type_LIST = [
               
                "Name|名称",
            ];
            KEYWORD_type = {};
            FORMATTRT_type = {};
            DEFAULT_type = {
               
                Name: "",
            }

            TypeSource_type = {
              
            };

            $.each(KEYWORD_type_LIST, function (i, item) {
                var detail = item.split("|");
                KEYWORD_type[detail[0]] = {
                    index: i,
                    name: detail[1],
                    type: detail.length > 2 ? detail[2] : undefined,
                    control: detail.length > 3 ? detail[3] : undefined
                };
                if (detail.length > 2) {
                    FORMATTRT_type[detail[0]] = $com.util.getFormatter(TypeSource_type, detail[0], detail[2]);
                }
            });
        });
    });
    model = $com.Model.create({
        name: '单据管理',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },
        run: function () {
           
            $("#routeTree").bind("contextmenu", function(){
                return false;
            });
            $com.app.loading("正在加载配置！");
            model.com.getItemTree({}, function (resT) {
                dataTree = resT.list;
                model.com.refreshTree();

                // model.com.getItemTable({}, function (res) {
                //     DataTable = res.list;
                    DataUser = window.parent._UserAll;
                    model.com.refreshAllData();
                    model.com.getWidgetType({}, function (res) {
                        if (res && res.list) {
                            for (var i = 0; i < res.list.length; i++) {
                                TypeSource_WIDGET.WidgetTypeID.push({ name: res.list[i].Name, value: res.list[i].ID });
                            }
                        }
                        $com.app.loaded();
                    });
                // });
            });
        },
        events: function () {
            //web视图 
            $("body").delegate("#lmvt-web", "click", function () {
                $(".lmvt-changeOption").text("PC端");
                ClientType = 0;
                if (typeof (treeID) == "undefined") {
                    model.com.refreshAllData();
                } else {
                    model.com.refreshTable(treeID);
                }

            });
            //app视图 
            $("body").delegate("#lmvt-app", "click", function () {
                $(".lmvt-changeOption").text("移动端");
                ClientType = 1;
                if (typeof (treeID) == "undefined") {
                    model.com.refreshAllData();
                } else {
                    model.com.refreshTable(treeID);
                }
            });


            //隐藏通用控件femi-hide-property1
            $("body").delegate("#lmvt-all", "click", function () {
                model.com.getItemTable({}, function (res) {
                    DataTable = res.list;
                    model.com.refreshAllData();
                    $("#routeTree").children("li").each(function (i, item) {
                        $item = $(item);
                        if ($item.find("li").length > 0) {
                            $item.find("li").each(function (j, jtem) {
                                $(jtem).children("span").css("color", "black");
                            });
                        }

                        $item.children("span").css("color", "black");
                    });
                    treeID = undefined;
                });
            });

            //隐藏通用控件femi-hide-property1
            $("body").delegate("#femi-hide-property1", "click", function () {
                $(".iplant-tool-right").css("width", "0px");
                $(".iplant-tool-right").hide();
                $(".lmvt-container-supplier").hide();
                $(".lmvt-container-type").hide();
                $(".iplant-tool-center").css("margin-right", "0px");
            });
            //点击通用控件
            $("body").delegate("#cby-show-button", "click", function () {
                $(".iplant-tool-right").css("width", "500px");
                $(".iplant-tool-right").show();
                $(".lmvt-container-type").hide();
                $(".lmvt-container-supplier").show();
                $(".iplant-tool-center").css("margin-right", "500px");
                var $id,
                    $tdList = $(this).closest("td").parent("tr").children("td");
           
                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        $id = $tdList.eq(i).next().attr("data-value");
                    }
                }
                mFormID = $id;
                model.com.refreshWidget($id);
                for (var i = 0; i < tableShow.length; i++) {
                    if (tableShow[i].ID == mFormID) {
                        var _thisData = tableShow[i];
                    }
                }
                $("#lmvt-header-title").html("控件(" + _thisData.Name+")");
            });
            //控件类型
            $("body").delegate("#cby-add-type", "click", function () {
                $(".iplant-tool-right").css("width", "400px");
                $(".iplant-tool-right").show();
                $(".lmvt-container-type").show();
                $(".lmvt-container-supplier").hide();
                $(".iplant-tool-center").css("margin-right", "400px");
                model.com.refreshType();
            });
            //新增
            $("body").delegate("#femi-add-type", "click", function () {

                $("body").append($com.modal.show(DEFAULT_type, KEYWORD_type, "新增", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var _data = {
                        ID: 0,
                        Name: rst.Name,
                    }
                    model.com.addWidgetType({
                        data: _data
                    }, function (res) {
                        if (res)
                            model.com.refreshType();
                        alert("新增成功");
                    });
                }, TypeSource_type));
            });
            //修改控件类型
            $("body").delegate("#cby-deit-type", "click", function () {
                var _id,
                    $tdList = $(this).closest("td").parent("tr").children("td");
           
                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        _id = $tdList.eq(i).next().attr("data-value");
                    }
                }
                for (var i = 0; i < AllType.length; i++) {
                    if (AllType[i].ID == _id) {
                        var _thisData = AllType[i];
                    }
                }
                $("body").append($com.modal.show(_thisData, KEYWORD_type, "修改", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var _data = {
                        ID: _thisData.ID,
                        Name: rst.Name,
                       
                    }
                    model.com.addWidgetType({
                        data: _data
                    }, function (res) {
                        if (res)
                            model.com.refreshType();
                        alert("新增成功");
                    });
                }, TypeSource_type));
            });
            // 删除控件类型
            $("body").delegate("#cby-delete-type", "click", function () {
                var _id,
                    $tdList = $(this).closest("td").parent("tr").children("td");
           
                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        _id = $tdList.eq(i).next().attr("data-value");
                    }
                }
                //for (var i = 0; i < mCurrentData.length; i++) {
                //    if (mCurrentData[i].ID == _id) {
                //        var _thisData = mCurrentData[i];
                //    }
                //}
                model.com.deleteWidgetType({
                    ID: _id
                }, function (res) {
                    if (res)
                        model.com.refreshType();
                    alert("删除成功");
                });
            });
            //新增控件
            $("body").delegate("#femi-add-property1", "click", function () {
               
                $("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_WIDGET, "新增", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
              
                   var _data = {
                       ID: 0,
                       FormID:mFormID,
                       ButtonId: rst.ButtonId,
                       ButtonName: rst.ButtonName,
                       WidgetTypeID:rst.WidgetTypeID,
                       Remark: rst.Remark
                    }
                   model.com.addWidget({
                       data: _data
                   }, function (res) {
                       if (res)
                           model.com.refreshWidget(mFormID);
                       alert("新增成功");
                    });
                }, TypeSource_WIDGET));
            });
            //修改控件
            $("body").delegate("#cby-deit-widget", "click", function () {
                var _id,
                    $tdList = $(this).closest("td").parent("tr").children("td");
           
                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        _id = $tdList.eq(i).next().attr("data-value");
                    }
                }
                for (var i = 0; i < mCurrentData.length; i++) {
                    if (mCurrentData[i].ID == _id) {
                        var _thisData = mCurrentData[i];
                    }
                }
                $("body").append($com.modal.show(_thisData, KEYWORD_WIDGET, "修改", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    var _data = {
                        ID:_thisData.ID,
                        FormID:mFormID,
                        ButtonId: rst.ButtonId,
                        ButtonName: rst.ButtonName,
                        WidgetTypeID: rst.WidgetTypeID,
                        Remark: rst.Remark
                    }
                    model.com.addWidget({
                        data: _data
                    }, function (res) {
                        if (res)
                            model.com.refreshWidget(mFormID);
                        alert("修改成功");
                    });
                }, TypeSource_WIDGET));
            });
            // 删除控件
            $("body").delegate("#cby-delete-widget", "click", function () {
                var _id,
                    $tdList = $(this).closest("td").parent("tr").children("td");
               
                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        _id = $tdList.eq(i).next().attr("data-value");
                    }
                }
                //for (var i = 0; i < mCurrentData.length; i++) {
                //    if (mCurrentData[i].ID == _id) {
                //        var _thisData = mCurrentData[i];
                //    }
                //}
                model.com.addWidgetDelete({
                    ID: _id
                }, function (res) {
                    if (res)
                        model.com.refreshWidget(mFormID);
                    alert("删除成功");
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
                        model.com.refreshAllData();
                        $("#cby-tree-tooltip").remove();
                    }else{
                        model.com.addItemTable({
                            data: newObj
                        }, function (res) {
                            model.com.getItemTree({}, function (resT) {
                                dataTree = resT.list;
                                alert("新增成功");
                                model.com.refreshTree();
                                model.com.refreshAllData();
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
                        model.com.refreshAllData();
                        $("#cby-tree-tooltip").remove();
                    }else{
                        model.com.addItemTable({
                            data: newObj
                        }, function (res) {
                            model.com.getItemTree({}, function (resT) {
                                dataTree = resT.list;
                                alert("修改成功");
                                model.com.refreshTree();
                                model.com.refreshAllData();
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
                    
                    model.com.getItemTree({}, function (resT) {
                        dataTree = resT.list;
                        alert("删除成功");
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
                        
                        model.com.getItemTree({}, function (resT) {
                            dataTree = resT.list;
                            alert("新增成功");
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

                model.com.refreshTable(id);
                return false;
            });           
            //模糊查询
            $("body").delegate("#cby-searchBill-table", "change", function () {
                var $this = $(this),
                    value = $(this).val();
                
                if (value == undefined || value == "" || value.trim().length < 1) {
                    $("#cby-tbody-bliiTable").children("tr").show();
                }
                else
                    $com.table.filterByLikeString($("#cby-tbody-bliiTable"), tableShow, value, "OrderID");
            });
            //新增表单
            $("body").delegate("#cby-add-billTable", "click", function () {
                DEFAULT_VALUE_url = {
                    Name: "",
                    Url: "",
                    Type: 0,
                }
                $("body").append($com.modal.show(DEFAULT_VALUE_url, KEYWORD_Item_url, "新增", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var newObj = {};
                    newObj = {
                        Name: rst.Name,
                        ID: 0,
                        Key: "",
                        Type: Number(rst.Type),
                        Status: 0,
                        Version: 0,
                        Url: rst.Url,
                        FarID: typeof (treeID) == "undefined" ? 0 : Number(treeID),
                    }
                    model.com.addItemTable({
                        data: newObj
                    }, function (res) {
                        alert("新增成功");
                        model.com.getItemTable({},function(res){
                            DataTable=res.list;
                            model.com.refreshTable(treeID);
                        })
                    });

                }, TypeSource_Item_url));
            });
            // 修改
            $("body").delegate("#cby-edit-bill","click",function(){
                var $id,
                    $tdList = $(this).closest("td").parent("tr").children("td");
               
                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        $id = $tdList.eq(i).next().attr("data-value");
                    }
                }
                $.each(DataTable,function(i,item){
                    if(item.ID==$id){
                        DEFAULT_VALUE_url={
                            Name:item.Name,
                            Url: item.Url,
                            Type: item.Type
                        }
                        return false;
                    }
                })
                
                $("body").append($com.modal.show(DEFAULT_VALUE_url, KEYWORD_Item_url, "修改", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var newObj={},
                        _obj;
                    $.each(DataTable,function(i,item){
                        if(item.ID==$id){
                            _obj=item;
                        }
                    })

                    newObj={
                        Name:rst.Name,
                        ID:_obj.ID,
                        Key:_obj.Key,
                        Type: Number(rst.Type),
                        Status:_obj.Status,
                        Version:_obj.Version,
                        Url:rst.Url,
                        FarID:Number(treeID),
                    }

                    model.com.addItemTable({
                        data: newObj
                    }, function (res) {
                        alert("修改成功");
                        model.com.getItemTable({},function(res){
                            DataTable=res.list;
                            if(treeID!=0){

                                model.com.refreshTable(treeID);
                            }else{
                                model.com.refreshAllData();
                            }
                        })
                    });

                }, TypeSource_Item_url));
            });
            //删除
            $("body").delegate("#cby-delete-bill","click",function(){
                var tid,
                    $tdList = $(this).closest("td").parent("tr").children("td");
               
                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        tid = $tdList.eq(i).next().attr("data-value");
                    }
                }
                if (!confirm("确定删除？")) {
                    return;
                }
                model.com.deleteItemTable({id:tid},function(){
                    alert("删除成功")
                    model.com.getItemTable({},function(res){
                        DataTable = res.list;
                        if(treeID!=0){

                            model.com.refreshTable(treeID);
                        }else{
                            model.com.refreshAllData();
                        }
                    })
                });
            })
            //浏览
            $("body").delegate("#cby-show-bill", "click", function () {
                var $id,
                    $tdList = $(this).closest("td").parent("tr").children("td"),
                    $url;
           
                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        $id = $tdList.eq(i).next().attr("data-value");
                    }
                }
                    
                $.each(DataTable, function (i, item) {
                    if (item.ID == $id) {
                        $url = item.Url + "?type=" + 0;
                        return false;
                    }
                })
                var vdata = { 'header': '单据', 'href': $url, 'id': 'FPCRoutePart', 'src': './static/images/menu/newfactoryModel/techniquePart.png' };
                window.parent.iframeHeaderSet(vdata);
            })

        },
        com: {
            //渲染类型
            refreshType:function(){
                model.com.getWidgetType({}, function (res) {
                    if (res && res.list) {
                        TypeSource_WIDGET.WidgetTypeID = [];
                        AllType = res.list;
                        for (var i = 0; i < AllType.length; i++) {
                            TypeSource_WIDGET.WidgetTypeID.push({ name: AllType[i].Name, value: AllType[i].ID });
                        }
                        $(".lmvt-supplier-type").html($com.util.template(AllType, HTML.TableType));
                    }
                });
            },
            //渲染控件
            refreshWidget:function(FormID){
                model.com.getWidgetByFormID({
                    FormID: FormID
                }, function (res) {
                    if (res.list && res) {
                        var _data = res.list;
                        mCurrentData = _data;
                        $(".lmvt-supplier-body").html($com.util.template(_data, HTML.TableWidget));
                    }
                });
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
            //渲染表格所有数据
            refreshAllData:function(){
                model.com.getItemTable({}, function (res) {
                    DataTable = res.list;
                    var _dataTable=$com.util.Clone(DataTable),
                    newArr=[];
                    if(ClientType==0){
                        $.each(_dataTable,function(i,item){
                            item.OrderID=i+1;
                            item.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.StartTime);
                            if (item.Type == 0) {
                                item.Type = "网页端";
                                newArr.push(item);
                            } 
                        });
                    }else if(ClientType==1){
                        $.each(_dataTable,function(i,item){
                            item.OrderID=i+1;
                            item.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.StartTime);
                            if (item.Type == 1) {
                                item.Type = "移动端";
                                newArr.push(item);
                            } 
                        });
                    }
                    $.each(newArr,function(i,item){
                        item.OrderID=i+1;
                        item.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.StartTime);
                    });
                    tableShow=newArr;
                    $("#cby-tbody-bliiTable").html($com.util.template(tableShow, HTML.TableBillItemMode));
                })
                
            },
            //渲染表格
            refreshTable:function(TreeID){
                var _dataTable=$com.util.Clone(DataTable),
                    showList = [],
                    newArr=[];
                
                $.each(_dataTable, function (i, item) {
                    if (item.FarID == TreeID) {
                        showList.push(item);
                    }
                })


                if (ClientType==0) {
                    $.each(showList,function(i,item){
                        if (item.Type == 0) {
                            item.Type = "网页端";
                            newArr.push(item);
                        }
                    });
                } else if(ClientType==1){
                    $.each(showList,function(i,item){
                        if (item.Type == 1) {
                            item.Type = "移动端";
                            newArr.push(item);
                        }
                    });
                }
                
                $.each(newArr,function(i,item){
                    item.OrderID=i+1;
                    item.StartTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.StartTime);
                });
                tableShow=newArr;
                $("#cby-tbody-bliiTable").html($com.util.template(tableShow, HTML.TableBillItemMode));
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
                    $URI: "/Tree_form/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //添加表格数据
            addItemTable: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Tree_form/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除表格数据
            deleteItemTable: function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/Tree_form/Delete",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询类型
            getWidgetType: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/WidgetType/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //新增类型
            addWidgetType: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/WidgetType/Update",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除类型
            deleteWidgetType: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/WidgetType/Delete",
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
            //新增/修改
            addWidget: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/ProcessdefinWidget/Update",
                    $TYPE: "post"
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除
            addWidgetDelete: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/ProcessdefinWidget/Delete",
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
        },
       
    });
    model.init();
});