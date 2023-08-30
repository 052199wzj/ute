require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview', ], function ($zace, $com, $tree) {

    var model,
    DATATree,
    mID,
    mdata,
    mName,
    DownLoadArray,
    DeleteArray,
    DATATree_info,
    KEYWORD_BOMItem_LIST,
    KEYWORD_BOMItem,
    FORMATTRT_BOMItem,
    TypeSource_BOMItem,
    mTempID,
    Folderfile,
        HTML;
    HTML = {
        TreeItemNode: [
            '<li data-titie="{{CatalogID}}"  data-value="{{CatalogID}}" >',
            '<span style="vertical-align:top;" data-value="{{CatalogID}}"><img src="{{Icon}}" style="width:20px;height:20px" ><div data-value="{{CatalogID}}" data-Name="{{CatalogName}}"  style="display:inline">{{CatalogName}}</div></span>',
            '<ul>{{Items}}',
            '</ul>',
            '</li>',
        ].join(""),

        TreeItemNodeDelete: [
            '<li data-titie="{{CatalogID}}"  data-value="{{CatalogID}}" >',
            '<span style="vertical-align:top;" data-value="{{CatalogID}}"><input type="checkbox" class="femi-tree-checkbox" style="margin: 1px 0px 1px"  value="{{CatalogID}}" data-file="{{FilePath}}"/><img src="{{Icon}}" style="width:20px;height:20px" ><div data-value="{{CatalogID}}" data-Name="{{CatalogName}}"  style="display:inline" >{{CatalogName}}</div></span>',
            '<ul>{{Items}}',
            '</ul>',
            '</li>',
        ].join(""),
        // TreeItemNode : [ '<li style="font-size:15px" class="range-role-li" data-value = "{{Active}}" data-type = 1 data-key = "{{ID}}">',
        // '<span id="ItemNode" style="vertical-align:top;"><img src="{{Icon}}" style="width:20px;height:20px" >{{Name}}</span> ',
        // '<ul>{{Items}}</ul>',
        // '</li> ', ].join(""),
    };
    // Item
    (function () {
        KEYWORD_BOMItem_LIST = [];
        KEYWORD_BOMItem = {};
        FORMATTRT_BOMItem = {};
        TypeSource_BOMItem = {};

        $.each(KEYWORD_BOMItem_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_BOMItem[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_BOMItem[detail[0]] = $com.util.getFormatter(TypeSource_BOMItem, detail[0], detail[2]);
            }
        });
    })();

    model = $com.Model.create({
        name: 'logs日志',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            //打开文件夹
            $("body").delegate("#mFolder","click",function(){
                var FolderfileArray=[];
                $("#areaTree input[type=checkbox].femi-tree-checkbox").each(function(i, item) {
                    if($(item).prop("checked")){
                        var $this = $(this);
                        var FolderfileID=Number($(this).val());
                         Folderfile=$(this).attr("data-file");
                        FolderfileArray.push(FolderfileID);
                    }
                }); 
                if(FolderfileArray.length>1){
                    alert("请勾选一条数据！");
                    return false;
                 }
                model.com.File(Folderfile);
            })
           //进入删除模式
           $("body").delegate("#mDeletePattern_in","click",function(){
               $("#mDelete").show();
               $("#mDownLoad").show();
               $("#mDeletePattern_out").show();
            //    $("#mFolder").show();
               $("#mDeletePattern_in").hide();
               model.com.refresh_delete();
            $("#showLog").html("");
           });
           //退出删除模式
           $("body").delegate("#mDeletePattern_out","click",function(){
            $("#mDelete").hide();
            $("#mDownLoad").hide();
            // $("#mFolder").hide();
            $("#mDeletePattern_in").show();
            $("#mDeletePattern_out").hide();
            model.com.refresh();
            $("#showLog").html("");
           });

           //单击树
            $("body").delegate("#areaTree li span div", "click", function () {
                var $this = $(this);
                mID = Number($this.attr("data-value"));
                mName =$this.attr("data-Name");
                
                model.com.getList_info({ID:mID},function(res){
                    if(res&&res.info){
                        DATATree_info = $com.util.Clone(res.info);
                        // $("#showLog").html(DATATree_info);
                        $("#showLog").html("");
                        $("#Name").text(mName);
                        for(var i=0;i<DATATree_info.length;i++){
                            if(DATATree_info[i].indexOf("ERROR")==-1){
                                $("#showLog").append('<p style="white-space: pre-line;word-wrap: break-word;word-break: break-all;">'+DATATree_info[i]+'</p>');
                            }else{
                                var mystr = DATATree_info[i].fontcolor('red');
                                $("#showLog").append('<p style="white-space: pre-line;word-wrap: break-word;word-break: break-all;">'+mystr+'</p>');
                            }                          
                        }
                    }
                 });             
            });
            //下载
            $("body").delegate("#mDownLoad", "click", function () {
                DownLoadArray=[];
                $("#areaTree input[type=checkbox].femi-tree-checkbox").each(function(i, item) {
                    if($(item).prop("checked")){
                        var $this = $(this);
                        var DownLoadID=$(this).val();
                        DownLoadArray.push(DownLoadID);
                    }
                }); 
                if(DownLoadArray.length==0){
                    alert("请勾选数据！");
                    return false;
                  }else if(DownLoadArray.length>1){
                    alert("请选择一条数据！");
                    return false;
                  } 
                   mdata=Number(DownLoadArray[0]); 
                model.com.getList_info({ID:mdata},function(res){
                    if(res&&res.info){
                        window.location.href="http://localhost:8088/MESCore/api/ELG/FileDownload?ID="+mdata;
                        alert("下载成功！");          
                    }else{
                        alert("请选择文件！");
                        return false;
                    }
                 });            
            });
            //删除多条
            $("body").delegate("#mDelete", "click", function () {
                DeleteArray=[];
                // window.location.href="http://localhost:8088/MESCore/api/ELG/DeleteInfo?ID="+mID; 
                $("#areaTree input[type=checkbox].femi-tree-checkbox").each(function(i, item) {
                    if($(item).prop("checked")){
                        var $this = $(this);
                        var DeleteID=Number($(this).val());
                        DeleteArray.push(DeleteID);
                    }
                }); 
                model.com.deleteList_All({
                    data:DeleteArray
                },function(res){
                    if(res&&res.info.length==0){
                        alert("删除成功！");
                        model.com.refresh_delete();
                        $("#showLog").html("");
                    }else{
                        alert(res.info);
                        return false;
                    }
                }); 
           });
           //全选，全不选
        //    $("body").delegate("#areaTree .femi-tree-checkbox", "change", function () {

        //     var $this = $(this);


        //     var $own_check = $this.parent('span').next('ul').find(".femi-tree-checkbox");

        //     $own_check.prop("indeterminate", false);

        //     var $Siblings = $this.parent('span').parent('li').parent('ul').children('li').children('span').children(".femi-tree-checkbox")

        //     var $parent_check = $this.parent('span').parent('li').parent('ul').prev('span').children(".femi-tree-checkbox");

        //     if ($this[0].checked) {
        //         $own_check.prop("checked", true);
        //         var Is_all = true;
        //         $Siblings.each(function (i, item) {
        //             if (!item.checked)
        //                 Is_all = false;
        //         });
        //         if (Is_all) {
        //             $parent_check.prop("checked", true);
        //             $parent_check.prop("indeterminate", false);
        //         } else {
        //             $parent_check.prop("checked", false);
        //             $parent_check.prop("indeterminate", true);
        //         }
        //     } else {
        //         $own_check.prop("checked", false);
        //         var Is_all = true;
        //         $Siblings.each(function (i, item) {
        //             if (item.checked || $(item).prop("indeterminate"))
        //                 Is_all = false;
        //         });
        //         $parent_check.prop("checked", false);
        //         if (Is_all) {
        //             $parent_check.prop("indeterminate", false);
        //         } else {
        //             $parent_check.prop("indeterminate", true);
        //         }
        //     }

        //     if ($parent_check[0])
        //         model.com.CheckTree($parent_check);
        //   });
        },

        run: function () {
            model.com.getList_log({ }, function (resTree) {
                if (resTree && resTree.list) {
                    DATATree = $com.util.Clone(resTree.list);
                    var ItemList = $com.util.Clone(resTree.list);
                    model.com.renderTree(ItemList);
                }
            });
            // model.com.getList_homPage({ProjectName:"",StartTime:"",EndTime:""}, function (res) {
            //     if (res && res.list) {
            //         DATA= $com.util.Clone(res.list);
            //         var Item = $com.util.Clone(res.list);
               
            //     }
            // });
            // model.com.getList_FunctionLog({ProjectName:""}, function (res) {
            //     if (res && res.list) {
            //         DATA= $com.util.Clone(res.list);
            //         var Item = $com.util.Clone(res.list);
               
            //     }
            // });
      },

        com: {
            // hoverClass : function(className) {
			// 	className = className || "hover";
			// 	return this.hover(function() {
			// 		$(this).addClass(className);
			// 	}, function() {
			// 		$(this).removeClass(className);
			// 	});
            // },
            CheckTree: function($this) {
                var $Siblings = $this.parent('span').parent('li').parent('ul').children('li').children('span').children(".femi-tree-checkbox")

                var $parent_check = $this.parent('span').parent('li').parent('ul').prev('span').children(".femi-tree-checkbox");

                if ($this[0].checked) {

                    var Is_all = true;
                    $Siblings.each(function (i, item) {
                        if (!item.checked)
                            Is_all = false;
                    });
                    if (Is_all) {
                        $parent_check.prop("checked", true);
                        $parent_check.prop("indeterminate", false);
                    } else {
                        $parent_check.prop("checked", false);
                        $parent_check.prop("indeterminate", true);
                    }
                } else {

                    var Is_all = true;
                    $Siblings.each(function (i, item) {
                        if (item.checked || $(item).prop("indeterminate"))
                            Is_all = false;
                    });
                    $parent_check.prop("checked", false);
                    if (Is_all) {
                        $parent_check.prop("indeterminate", false);
                    } else {
                        $parent_check.prop("indeterminate", true);
                    }
                }

                if ($parent_check[0])
                    model.com.CheckTree($parent_check);
            },
            File:function(filename){
                try{         
                    var obj=new ActiveXObject("wscript.shell");                        
                         if(obj){                            
                       obj.Run("\""+filename+"\"", 1, false );                       
                            //obj.run("osk");/*打开屏幕键盘*/                      
                            //obj.Run('"'+filename+'"');                          
                           obj=null;                        
                        }                         
                   }catch(e){                         
                      alert("请确定是否存在该盘符或文件");                   
                        }               
            },
            refresh: function () {
                model.com.getList_log({ }, function (resTree) {
                    if (resTree && resTree.list) {
                        DATATree = $com.util.Clone(resTree.list);
                        var ItemList = $com.util.Clone(resTree.list);
                        model.com.renderTree(ItemList);
                    }
                });           
            },
            refresh_delete: function () {
                model.com.getList_log({ }, function (resTree) {
                    if (resTree && resTree.list) {
                        DATATree_delete = $com.util.Clone(resTree.list);
                        var ItemList_delete = $com.util.Clone(resTree.list);
                        model.com.renderTree_delete(ItemList_delete);
                    }
                });           
            },
            renderTree: function (list) {
                model.com.fullItems(list);

                $("#areaTree").html($com.util.template(list, HTML.TreeItemNode));
                $("#areaTree").treeview();
            },
            fullItems: function (list) {

                $.each(list, function (i, item) {

                    model.com.fullItems(item.SubCatalogList);
                    item.Items = $com.util.template(item.SubCatalogList, HTML.TreeItemNode);
                    if(item.IsCatalog==true){
                        item.Icon="../static/images/logs/Folder.png";
                    }else{
                        item.Icon="../static/images/logs/text.png";
                    }
                });
            },
            renderTree_delete: function (list) {
                model.com.fullItems_delete(list);

                $("#areaTree").html($com.util.template(list, HTML.TreeItemNodeDelete));
                $("#areaTree").treeview();
            },
            fullItems_delete: function (list) {

                $.each(list, function (i, item) {

                    model.com.fullItems_delete(item.SubCatalogList);
                    item.Items = $com.util.template(item.SubCatalogList, HTML.TreeItemNodeDelete);
                    if(item.IsCatalog==true){
                        item.Icon="../static/images/logs/Folder.png";
                    }else{
                        item.Icon="../static/images/logs/text.png";
                    }
                });
            },
              //获取接口日志
            //   getList_homPage: function (data, fn, context) {
            //     var d = {
            //         $URI: "/HomePage/GetApiLog",
            //         $TYPE: "get",
            //     };

            //     function err() {
            //         $com.app.tip('获取失败，请检查网络');
            //     }

            //     $com.app.ajax($.extend(d, data), fn, err, context);
            // },
            //获取性能日志
            // getList_FunctionLog: function (data, fn, context) {
            //     var d = {
            //         $URI: "/HomePage/GetFunctionLog",
            //         $TYPE: "get",
            //     };

            //     function err() {
            //         $com.app.tip('获取失败，请检查网络');
            //     }

            //     $com.app.ajax($.extend(d, data), fn, err, context);
            // },
            //获取异常列表
            getList_log: function (data, fn, context) {
                var d = {
                    $URI: "/ELG/LogList",
                    $TYPE: "get",
                    $SERVER: "/MESCore"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查单条
            getList_info: function (data, fn, context) {
                var d = {
                    $URI: "/ELG/LogInfo",
                    $TYPE: "get",
                    $SERVER: "/MESCore"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
             //删除多条
             deleteList_All: function (data, fn, context) {
                var d = {
                    $URI: "/ELG/DeleteList",
                    $TYPE: "post",
                    $SERVER: "/MESCore"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
             //下载日志
             getList_FileDownload: function (data, fn, context) {
                var d = {
                    $URI: "/ELG/FileDownload",
                    $TYPE: "get",
                    $SERVER: "/MESCore"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
             //下载日志
             getList_Delete: function (data, fn, context) {
                var d = {
                    $URI: "/ELG/DeleteInfo",
                    $TYPE: "get",
                    $SERVER: "/MESCore"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        }
    });

    model.init();


});