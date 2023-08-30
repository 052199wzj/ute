require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview',], function ($zace, $com, $tree) {
    var dataTree,
        DataTable,
        DataUser,
        treeID = 0,
        tableShow,
        $farID,
        defineID,
        $flag = false,
        $tree_val,
        _modelID;

    var HTML = {
        TableDesignItemMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',

            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="id" data-value="{{id}}" >{{id}}</td>',
            '<td data-title="name" data-value="{{name}}" >{{name}}</td>',
            // '<td data-title="KEY_" data-value="{{KEY_}}" >{{KEY_}}</td>',
            //'<td data-title="VERSION_" data-value="{{VERSION_}}" >{{VERSION_}}</td>',
            '<td data-title="TreeName" data-value="{{TreeName}}" >{{TreeName}}</td>',
            '<td data-title="createTime" data-value="{{createTime}}" >{{createTime}}</td>',
            // '<td data-title="ISUSE" data-value="{{ISUSE}}" >{{ISUSE}}</td>',
            '<td data-title="lastUpdateTime" data-value="{{lastUpdateTime}}" >{{lastUpdateTime}}</td>',
            '<td data-title="description" data-value="{{description}}" >{{description}}</td>',
            '<td style="min-width: 30px;max-width: 90px;" data-title="#" data-value="#">',
            '<div class="td-contain"><span class="td-contain-list" id="cby-route-design">设计</span>',
            '<span class="td-contain-list cby-downRoute-lists" id="cby-route-publish" data-toggle="modal" data-target="#myModal">部署</span>',
            '<span class="td-contain-list cby-downRoute-lists" id="cby-route-delte">删除</span>',
            '<span class="td-contain-list cby-downRoute-lists" id="cby-route-devide">分类</span>',
            '<span class="td-contain-list cby-downRoute-lists" id="cby-route-download">下载</span>',
            // '<span class="td-contain-list cby-downRoute-lists" id="cby-route-charf">流程图</span>',
            '</div>',
            '</td>  ',
            '</tr>',
        ].join(""),

        TreeItemNode: [
            '<li data-titie="{{ID}}"  data-value="{{ID}}" >',
            '<span style="vertical-align:top;" data-value="{{ID}}"}" >{{Name}}</span> ',
            '<ul>{{Items}}',
            '</ul>',
            '</li>',
        ].join(""),
        TableDetailDefineMode: [
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
        TableDetailUpdateMode: [
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
        DEFAULT_VALUE_tree,

        KEYWORD_PublishItem_LIST,
        KEYWORD_PublishItem,
        FORMATTRT_PublishItem,
        TypeSource_PublishItem,
        DEFAULT_VALUE_Publish;

    $(function () {
        KEYWORD_BillItem_LIST = [
            "ID|编号",
            "Name|名称",
            "FarID|树ID",
        ];
        KEYWORD_BillItem = {};
        FORMATTRT_BillItem = {};
        DEFAULT_VALUE_Bill = {
            Name: "",
        }

        TypeSource_BillItem = {
            Name: [
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
    })

    $(function () {
        KEYWORD_PublishItem_LIST = [
            "IsMaxVision|是否设为最高版本|ArrayOne",
        ];
        KEYWORD_PublishItem = {};
        FORMATTRT_PublishItem = {};
        DEFAULT_VALUE_Publish = {
            IsMaxVision: 1,
        }

        TypeSource_PublishItem = {
            IsMaxVision: [
                {
                    name: "是",
                    value: 1
                },
                {
                    name: "否",
                    value: 0
                },
            ],
        };

        $.each(KEYWORD_PublishItem_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_PublishItem[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_PublishItem[detail[0]] = $com.util.getFormatter(TypeSource_PublishItem, detail[0], detail[2]);
            }
        });
    });

    model = $com.Model.create({
        name: '流程建模',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },
        run: function () {
            $("#routeTree").bind("contextmenu", function () {
                return false;
            });
            model.com.getItemTree({}, function (resT) {
                $com.app.loading("正在加载配置！");
                dataTree = resT.list;
                model.com.refreshTree();
                // model.com.getItemTable({}, function (res) {
                //     DataTable = res.list;
                DataUser = window.parent._UserAll;
                model.com.refreshAllList();
                $com.app.loaded();
                // });
            });
            $("#cby-route-charf").hide();
            $("#cby-route-detail").hide();

            $(".cby-downRoute-list").hide();

        },
        events: function () {
            //右键事件
            $("body").delegate("#routeTree li", "mousedown", function (e) {
                if (3 == e.which) {
                    // console.log("你点了右键");
                    if ($("#cby-tree-tooltip").length > 0) {
                        $("#cby-tree-tooltip").remove();
                    }
                    var tooltipHtml = '<ul class="cby-tree-tooltip"id="cby-tree-tooltip"><li class="cby-border-class" id="cby-add-class"><span>新增</span></li><li class="cby-border-class" id="cby-edit-class"><span>修改</span></li><li class="cby-delete-class"id="cby-delete-class"><span>删除</span></li></ul>';
                    $(this).children(":first").prepend(tooltipHtml);
                    $farID = $(this).attr("data-value");
                    $tree_val = $(this).children("span").text();
                    return false;
                }
            });
            $("body").delegate(".cby-tree-remove", "click", function () {
                if ($("#cby-tree-tooltip").length > 0) {
                    $("#cby-tree-tooltip").remove();
                }
            });
            //右键新增事件
            $("body").delegate("#cby-add-class", "click", function () {
                // var $farID=$(this).attr("data-value");
                DEFAULT_VALUE_Bill = {
                    Name: ""
                }
                $("body").append($com.modal.show(DEFAULT_VALUE_Bill, KEYWORD_BillItem, "新增", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var
                        newObj = {};
                    newObj = {
                        ID: 0,
                        Name: rst.Name,
                        FarID: $farID
                    }
                    if (newObj.Name == "") {
                        alert("分类名不可为空！！")
                        model.com.refreshAllList();
                        $("#cby-tree-tooltip").remove();
                    } else {
                        model.com.addItemTable({
                            data: newObj
                        }, function (res) {
                            model.com.getItemTree({}, function (resT) {
                                dataTree = resT.list;
                                alert("新增成功");
                                model.com.refreshTree();
                                model.com.refreshAllList();
                                $("#cby-tree-tooltip").remove();
                            });
                        });
                    }

                }, TypeSource_BillItem));
            });
            //右键修改事件
            $("body").delegate("#cby-edit-class", "click", function () {

                DEFAULT_VALUE_Bill = {
                    Name: $tree_val
                }
                $("body").append($com.modal.show(DEFAULT_VALUE_Bill, KEYWORD_BillItem, "修改", function (rst) {
                    var _$ID, _$farID;
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    $.each(dataTree, function (i, item) {
                        if (item.ID == $farID) {
                            _$ID = item.ID,
                                _$farID = item.FarID;
                            return false;
                        }
                    });

                    var newObj = {};
                    newObj = {
                        ID: _$ID,
                        Name: rst.Name,
                        FarID: _$farID
                    }
                    if (newObj.Name == "") {
                        alert("分类名不可为空！！")
                        model.com.refreshAllList();
                        $("#cby-tree-tooltip").remove();
                    } else {
                        model.com.addItemTable({
                            data: newObj
                        }, function (res) {
                            model.com.getItemTree({}, function (resT) {
                                dataTree = resT.list;
                                alert("修改成功");
                                model.com.refreshTree();
                                model.com.refreshAllList();
                                $("#cby-tree-tooltip").remove();
                            });
                        });
                    }

                    $("#cby-tree-tooltip").remove();
                }, TypeSource_BillItem));
            });
            //右键删除事件
            $("body").delegate("#cby-delete-class", "click", function () {
                if (!confirm("确定删除？")) {
                    $("#cby-tree-tooltip").remove();
                    return;
                }
                model.com.deleteItemTable({
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
            $("body").delegate("#cby-refresh-treeItem", "click", function () {
                model.com.getItemTree({}, function (resT) {
                    dataTree = resT.list;
                    model.com.refreshTree();
                });
            });
            //新增树的根节点
            $("body").delegate("#cby-add-treeItem", "click", function () {
                // var $farID=$(this).attr("data-value");
                $("body").append($com.modal.show(DEFAULT_VALUE_Bill, KEYWORD_BillItem, "新增", function (rst) {
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    var
                        newObj = {};
                    newObj = {
                        ID_: 0,
                        Name: rst.Name,
                        FarID: 0
                    }
                    model.com.addItemTable({
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
            $("body").delegate("#routeTree li", "click", function () {
                var id = $(this).attr("data-titie");
                treeID = id;
                //$(this).css("color", "red");

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
            //新增模型
            $("body").delegate("#cby-add-table", "click", function () {
                if (treeID == 0) {
                    alert("请选择流程分类");
                } else {
                    model.com.addTableItem({ tid: treeID }, function (res) {
                        var data_TableItem = res,
                            modelID = res.info,
                            $href = $com.routeUrl + "/MESBPM/modeler.html?modelId=" + modelID,
                            vdata = { 'header': '流程引擎', 'id': 'DeviceInfo', 'href': $href, 'src': './static/images/menu/deviceManage/deviceInformation.png' };
                        window.parent.iframeHeaderSet(vdata);
                    });
                }
            });
            //查看全部流程模型
            $("body").delegate("#cby-show-all-table", "click", function () {
                model.com.getItemTable({}, function (res) {
                    DataTable = res.list;
                    DataUser = window.parent._UserAll;
                    treeID = 0;
                    model.com.refreshAllList();
                });
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
            //设计
            $("body").delegate("#cby-route-design", "click", function () {
                var modelID,
                    $tdList = $(this).closest("td").parent("tr").children("td");

                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "id") {
                        modelID = $tdList.eq(i).next().attr("data-value");
                    }
                }

                //http://192.168.1.108:8088/MESBPM/modeler.html?modelId=127514
                var $href = $com.routeUrl + "/MESBPM/modeler.html?modelId=" + modelID,
                    vdata = { 'header': '设计', 'id': 'DeviceInfoAA', 'href': $href, 'src': './static/images/menu/deviceManage/deviceInformation.png' };
                window.parent.iframeHeaderSet(vdata);
            });
            // 部署
            $("body").delegate("#cby-route-publish", "click", function () {
                var modelID,
                    $tdList = $(this).closest("td").parent("tr").children("td");

                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "id") {
                        modelID = $tdList.eq(i).next().attr("data-value");
                    }
                }
                _modelID = modelID;
                $(':radio[name="killOrder"]').eq(0).prop("checked", true);
            })
            // $("body").delegate("#cby-cancer-publish","click",function(){
            //     $('input:radio[name="killOrder"]').removeAttr('checked');

            // })
            $("body").delegate("#cby-sure-publish", "click", function () {
                modelID = _modelID,
                    IsMaxVision = $("input[type='radio']:checked").val();
                model.com.publishModel({ modelId: modelID }, function (_res) {
                    var definitionId = _res.info,
                        vision = definitionId.substring(definitionId.indexOf(":") + 1, definitionId.lastIndexOf(":"));
                    if (IsMaxVision == 1) {
                        model.com.activateModel({ processDefinitionId: definitionId }, function () {
                            model.com.SetCandidateUsers({ definitionId: definitionId }, function () {
                                $("#myModal").modal('hide')
                                $('input:radio[name="killOrder"]').removeAttr('checked');
                                $('input:radio:first').attr('checked', 'checked');
                                alert("部署成功");

                            })
                        })
                    } else {
                        if (Number(vision) > 1) {
                            model.com.suspendProcess({ processDefinitionId: definitionId }, function () {
                                model.com.SetCandidateUsers({ definitionId: definitionId }, function () {
                                    $("#myModal").modal('hide')
                                    $('input:radio[name="killOrder"]').removeAttr('checked');
                                    alert("部署成功");
                                })
                            })
                        } else {
                            model.com.SetCandidateUsers({ definitionId: definitionId }, function () {
                                $("#myModal").modal('hide')
                                $('input:radio[name="killOrder"]').removeAttr('checked');
                                alert("部署成功");
                            })
                        }
                    }
                    $com.app.loaded();
                })
                // $("body").append($com.modal.show(DEFAULT_VALUE_Publish, KEYWORD_PublishItem, "是否设为激活版本", function (rst) {
                //     if (!rst || $.isEmptyObject(rst))
                //         return;
                //     $com.app.loading("正在部署！");


                // }, TypeSource_TaskItem));


            })
            //删除模型
            $("body").delegate("#cby-route-delte", "click", function () {
                var tid,
                    $tdList = $(this).closest("td").parent("tr").children("td");

                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "id") {
                        tid = $tdList.eq(i).next().attr("data-value");
                    }
                }
                if (!confirm("确定删除？")) {
                    return;
                }
                model.com.deleteTableItem({ modelId: tid }, function () {
                    alert("删除成功")
                    model.com.getItemTable({}, function (res) {
                        DataTable = res.list;
                        if (treeID == 0) {
                            model.com.refreshAllList();
                        } else {
                            model.com.refreshTable(treeID);
                        }
                    })
                });
            });
            //表格数据分类事件
            $("body").delegate("#cby-route-devide", "click", function () {
                TypeSource_treeItem = {
                    TreeID: [
                        {
                            name: "",
                            value: 1
                        },
                    ],
                };
                var $id,
                    $tdList = $(this).closest("td").parent("tr").children("td");

                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "id") {
                        $id = $tdList.eq(i).next().attr("data-value");
                    }
                }

                // var $id = $(this).closest("td").next().next().attr("data-value");
                $.each(dataTree, function (i, item) {
                    TypeSource_treeItem.TreeID.push({
                        name: model.com.getDivideTreeName(item),
                        value: item.ID
                    })
                })
                $("body").append($com.modal.show(DEFAULT_VALUE_tree, KEYWORD_treeItem, "修改", function (rst) {
                    var _$ID, _$farID;
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    model.com.updateTreeOwn({
                        modelId: $id,
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
            //查看流程图
            $("body").delegate("#cby-show-route", "click", function () {
                var tid, processDefinitionId;
                tid = $(this).closest("td").next().next().attr("data-value");
                model.com.getProcessDefinitionIdByModel({}, function (res) {
                    processDefinitionId = res.info;
                    var $src = $com.imageUrl + "/MESBPM/api/Leave/Image2defin?processDefinitionId=" + processDefinitionId;
                    $("#cby-route-charf img").attr("src", $src);
                    model.com.imgShow("#outerdiv", "#innerdiv", "#bigimg", $("#cby-route-charf img"));
                })
            })

            $("body").delegate("#cby-cby-input", "click", function () {
                $("#input-file").val("");
                $("#input-file").click();
            });
            $("body").delegate("#input-file", "input", function () {

                var self = this,
                    _data = self.files[0];
                if (_data) {
                    if (!extLimit(['zbpm']).has(_data.name)) {
                        alert("请上传正确的文件格式！");
                        clearFiles();
                        return;
                    }

                    var form = new FormData();
                    form.append("file", _data);

                    //alert(_data.name);
                    $.ajax({ //
                        url: "/MESBPM/api/Repository/UploadModelFile?file=",
                        type: "POST",
                        data: form,
                        processData: false,
                        contentType: false,
                        dataType: "JSON"
                    }).done(function (data) {

                        if (data.resultCode === 1000) {
                            alert("上传成功！");
                            model.com.getItemTable({}, function (res) {
                                DataTable = res.list;
                                model.com.refreshAllList();
                            })
                            // var $p = $(self).parent();
                            //  $p.before('.upload-btn').remove();
                            // $p.before($com.util.template({
                            //     Src: data.returnObject.file_id,
                            //     Id: data.returnObject.file_id
                            // }, HTML.IMG));
                            // $p.append(HTML.File);
                            /*if (!window.FileReader) {
                                var CSS = {
                                    background : "background:url("+ data.returnObject.url +") no-repeat center;",
                                    size : "background-size:cover;"
                                };
                                myData.head_img = data.returnObject.url;
                                $("#upload-img").attr("style", CSS.background + CSS.size);
                                $(".btn-upload").remove();
                            } else {
                                var reader = new FileReader();
                                //将文件以Data URL形式读入页面，解决ios图片不显示bug
                                reader.readAsDataURL(_data);
                                reader.onload = function (e) {
                                    var CSS = {
                                        background : "background:url("+ this.result +") no-repeat center;",
                                        size : "background-size:cover;"
                                    };
                                    myData.head_img = data.returnObject.url;
                                    $("#upload-img").attr("style", CSS.background + CSS.size);
                                    $(".btn-upload").remove();
                                };
                            }*/

                        } else {
                            alert("上传失败，请重新再试");
                        }

                        clearFiles();
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

            // 上传文件
            // $("body").delegate(".change-photo-btn", "change", function () {
            //     var self = this,
            //         _data = self.files[0];
            //     if (_data) {
            //         if (!extLimit(['zbpm']).has(_data.name)) {
            //             alert("请上传正确的文件格式！");
            //             clearFiles();
            //             return;
            //         }

            //         var form = new FormData();
            //         form.append("file", _data);

            //         //alert(_data.name);
            //         $.ajax({ //
            //             url: "/MESBPM/api/Repository/UploadModelFile?file=",
            //             type: "POST",
            //             data: form,
            //             processData: false,
            //             contentType: false,
            //             dataType: "JSON"
            //         }).done(function (data) {

            //             if (data.resultCode === 1000) {
            //                 alert("上传成功！");
            //                 model.com.getItemTable({}, function (res) {
            //                     DataTable = res.list;
            //                     model.com.refreshAllList();
            //                 })
            //                 // var $p = $(self).parent();
            //                 //  $p.before('.upload-btn').remove();
            //                 // $p.before($com.util.template({
            //                 //     Src: data.returnObject.file_id,
            //                 //     Id: data.returnObject.file_id
            //                 // }, HTML.IMG));
            //                 // $p.append(HTML.File);
            //                 /*if (!window.FileReader) {
            //                     var CSS = {
            //                         background : "background:url("+ data.returnObject.url +") no-repeat center;",
            //                         size : "background-size:cover;"
            //                     };
            //                     myData.head_img = data.returnObject.url;
            //                     $("#upload-img").attr("style", CSS.background + CSS.size);
            //                     $(".btn-upload").remove();
            //                 } else {
            //                     var reader = new FileReader();
            //                     //将文件以Data URL形式读入页面，解决ios图片不显示bug
            //                     reader.readAsDataURL(_data);
            //                     reader.onload = function (e) {
            //                         var CSS = {
            //                             background : "background:url("+ this.result +") no-repeat center;",
            //                             size : "background-size:cover;"
            //                         };
            //                         myData.head_img = data.returnObject.url;
            //                         $("#upload-img").attr("style", CSS.background + CSS.size);
            //                         $(".btn-upload").remove();
            //                     };
            //                 }*/

            //             } else {
            //                 alert("上传失败，请重新再试");
            //             }

            //             clearFiles();
            //         });
            //     }

            //     function clearFiles() {
            //         self.value = "";
            //     }

            //     function extLimit(exts) {
            //         return {
            //             has: function (file) {
            //                 var arr = file.split("."),
            //                     ext = arr[arr.length - 1].toLowerCase();

            //                 return exts.indexOf(ext) > -1 ? true : false;
            //             }
            //         };
            //     }
            // });
            // 下载文件
            $("body").delegate("#cby-route-download", "click", function () {
                var tid,
                    $tdList = $(this).closest("td").parent("tr").children("td");

                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "id") {
                        tid = $tdList.eq(i).next().attr("data-value");
                    }
                }
                // var tid=$(this).closest("td").next().next().attr("data-value");
                var url = "/MESBPM/api/Repository/downloadModel?modelId=" + tid;
                window.open(url);
                // model.com.downLoadModel({
                //     modelId: tid,
                // }, function (res) {
                //     alert("下载成功"); 
                // });
            })
        },
        com: {
            refreshTree: function () {
                // 渲染树形图
                var showTreeData = model.com.getTreeList();
                model.com.renderTree(showTreeData);
            },
            //获取树形结构
            getTreeList: function () {
                var reList = [],
                    allList = $com.util.Clone(dataTree);
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
            findSonTree: function (_obj, allList) {
                for (var i = 0; i < allList.length; i++) {
                    if (_obj.ID == allList[i].FarID) {
                        var thisObj = { ID: allList[i].ID, Name: allList[i].Name, sonList: [] };
                        _obj.sonList.push(thisObj);
                        model.com.findSonTree(thisObj, allList);
                    }
                }
            },
            renderTree: function (list) {

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
            refreshAllList: function () {
                model.com.getItemTable({}, function (res) {
                    DataTable = res.list;
                    var _dataTable = $com.util.Clone(DataTable);
                    $.each(_dataTable, function (i, item) {
                        // $.each(DataUser,function(u_i,u_item){
                        //     if(item.CREATERID==u_item.ID){
                        //         item.CREATERName=u_item.Name;
                        //     }
                        // });
                        item.OrderID = i + 1;
                        item.createTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.createTime);
                        item.lastUpdateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.lastUpdateTime);
                        item.description = jQuery.parseJSON(item.metaInfo).description;
                    });
                    //获得流程定义名称
                    for (var i = 0; i < _dataTable.length; i++) {
                        for (var j = 0; j < dataTree.length; j++) {
                            if (_dataTable[i].category == dataTree[j].ID) {
                                if (dataTree[j].FarID == 0) {
                                    _dataTable[i].TreeName = dataTree[j].Name;
                                } else {
                                    _dataTable[i].TreeName = model.com.getFarTreeName(dataTree[j], dataTree[j].Name);
                                }
                            }
                        }
                    }
                    tableShow = _dataTable;
                    $("#cby-tbody-designTable").html($com.util.template(tableShow, HTML.TableDesignItemMode));
                    $("#cby-downRoute-list").css("display", "none");
                })
            },
            refreshTable: function (TreeID) {
                model.com.getItemTable({}, function (res) {
                    DataTable = res.list;
                    var _dataTable = $com.util.Clone(DataTable),
                        showList = [];
                    $.each(_dataTable, function (i, item) {
                        if (item.category == TreeID) {
                            showList.push(item);
                        }
                    })
                    $.each(showList, function (i, item) {
                        // $.each(DataUser, function (u_i, u_item) {
                        //     if (item.CREATERID == u_item.ID) {
                        //         item.CREATERName = u_item.Name;
                        //     }
                        // });
                        item.description = jQuery.parseJSON(item.metaInfo).description;
                        item.OrderID = i + 1;
                        item.createTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.createTime);
                        item.lastUpdateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.lastUpdateTime);
                    });
                    //获得流程定义名称
                    //$.each(showList, function (i, item) {
                    //    $.each(dataTree, function (t_i, t_item) {
                    //        if (item.TREE_ID == t_item.ID) {
                    //            var sonName = t_item.Name;
                    //            item.TreeName = model.com.getFarTreeName(t_item, sonName);
                    //        }
                    //    })
                    //})
                    for (var i = 0; i < showList.length; i++) {
                        for (var j = 0; j < dataTree.length; j++) {
                            if (showList[i].category == dataTree[j].ID) {
                                if (dataTree[j].FarID == 0) {
                                    showList[i].TreeName = dataTree[j].Name;
                                } else {
                                    showList[i].TreeName = model.com.getFarTreeName(dataTree[j], dataTree[j].Name);
                                }
                            }
                        }
                    }
                    tableShow = showList;
                    $("#cby-tbody-designTable").html($com.util.template(tableShow, HTML.TableDesignItemMode));
                    $("#cby-downRoute-list").css("display", "none");
                })
            },
            getDivideTreeName: function (item) {
                if (item.FarID == 0) {
                    return item.Name;
                } else {
                    var a = model.com.getFarTreeName(item, item.Name);
                    return a;
                }
            },
            //根据树ID查询所有上级，并且进行叠加
            getFarTreeName: function (ThisTree, TreeName) {
                for (var i = 0; i < dataTree.length; i++) {
                    if (ThisTree.FarID == dataTree[i].ID) {
                        TreeName = dataTree[i].Name + "/" + TreeName;
                        //判断他的上级ID是否为0
                        if (dataTree[i].FarID == 0) {
                            return TreeName;
                        } else {
                            model.com.getFarTreeName(dataTree[i], TreeName);
                        }
                    }
                }

            },

            // 根据流程modelID获得defindeID
            getProcessDefinitionIdByModel: function (data, fn, context) {
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
            // 部署模型
            publishModel: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Repository/deployModel",
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
                    $SERVER: "/MESBPM",
                    $URI: "/Repository/deleteModel",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //更新流程定义所属分类
            updateTreeOwn: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Repository/updateModelCategory",
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
                    $SERVER: "/MESBPM",
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
                    $SERVER: "/MESBPM",
                    $URI: "/Repository/getModelList",
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
                    $SERVER: "/MESBPM",
                    $URI: "/Model/Create",
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
                    $SERVER: "/MESBPM",
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
                    $SERVER: "/MESBPM",
                    $URI: "/Tree_menu/Delete",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // 设置候选人
            SetCandidateUsers: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Repository/SetCandidateUsersByConf",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // 激活版本
            activateModel: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Repository/activateProcessDefinitionById",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // 挂起
            suspendProcess: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Repository/suspendProcessDefinitionById",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //下载模型
            // downLoadModel: function (data, fn, context) {
            //     var d = {
            //         $SERVER:"/MESBPM",
            //         $URI: "/Repository/downloadModel",
            //         $TYPE: "get"
            //     };

            //     function err() {
            //         $com.app.tip('获取失败，请检查网络');
            //     }

            //     $com.app.ajax($.extend(d, data), fn, err, context);
            // },


            imgShow: function (outerdiv, innerdiv, bigimg, _this) {
                var src = _this.attr("src");//获取当前点击的pimg元素中的src属性
                $(bigimg).attr("src", src);//设置#bigimg元素的src属性

                /*获取当前点击图片的真实大小，并显示弹出层及大图*/
                $("<img/>").attr("src", src).on('load', function () {
                    var windowW = $(window).width();//获取当前窗口宽度
                    var windowH = $(window).height();//获取当前窗口高度
                    var realWidth = this.width;//获取图片真实宽度
                    var realHeight = this.height;//获取图片真实高度
                    var imgWidth, imgHeight;
                    var scale = 1;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放

                    if (realHeight > windowH * scale) {//判断图片高度
                        imgHeight = windowH * scale;//如大于窗口高度，图片高度进行缩放
                        imgWidth = imgHeight / realHeight * realWidth;//等比例缩放宽度
                        if (imgWidth > windowW * scale) {//如宽度扔大于窗口宽度
                            imgWidth = windowW * scale;//再对宽度进行缩放
                        }
                    } else if (realWidth > windowW * scale) {//如图片高度合适，判断图片宽度
                        imgWidth = windowW * scale;//如大于窗口宽度，图片宽度进行缩放
                        imgHeight = imgWidth / realWidth * realHeight;//等比例缩放高度
                    } else {//如果图片真实高度和宽度都符合要求，高宽不变
                        imgWidth = realWidth;
                        imgHeight = realHeight;
                    }
                    $(bigimg).css("width", imgWidth);//以最终的宽度对图片缩放

                    var w = (windowW - imgWidth) / 2;//计算图片与窗口左边距
                    var h = (windowH - imgHeight) / 2;//计算图片与窗口上边距
                    $(innerdiv).css({ "top": h, "left": w });//设置#innerdiv的top和left属性
                    $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.pimg
                });

                $(outerdiv).click(function () {//再次点击淡出消失弹出层
                    $(this).fadeOut("fast");
                });
            }
        },

    });
    model.init();
});