require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview', ], function ($zace, $com, $tree) {
    var dataTree,
        DataTable,
        DataUser,
        treeID,
        tableShow,
        dataRouteDefine,
        dataFinishedTask,
        data,
        recordArr,

        //不进行多次注册函数
        temp = true,
        dataFinishedBill;

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


    var HTML = {
        iFrameNode: [
            '<div class="hw-overlay" id="hw-layer">',
            '<div class="lmvt-header">',
                '<span class="glyphicon glyphicon-remove hwLayer-close"></span>',
            '</div>',
            '<iframe class="lmvt-iframe" id=""></iframe>',
            '</div>'
        ].join(""),
        DivNode: [
            '<div class="hw-overlay" id="hw-layer">',
            '<div class="lmvt-header">',
                '<span class="glyphicon glyphicon-remove hwLayer-close"></span>',
            '</div>',
            '<div class="lmvt-top" id=""></div>',
            '</div>'
        ].join(""),
        TableTaskItemMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="ProcessDefinitionName" data-value="{{ProcessDefinitionName}}" >{{ProcessDefinitionName}}</td>',
            //'<td data-title="TaskType" data-value="{{TaskType}}" >{{TaskType}}</td>',
            //'<td data-title="assignee" data-value="{{assignee}}" >{{assignee}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td style="min-width: 30px;max-width: 70px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-edit-task">办理任务</span><span class="td-contain-list" id="cby-onTask-charf">流程图</span></div> </td>  ',
            
            '</tr>',
        ].join(""),

        TreeItemNode: [
            '<li data-titie="{{ID}}"  data-value="{{ID}}" >',
            '<span style="vertical-align:top;" data-value="{{ID}}"}" >{{Name}}</span> ',
            '<ul>{{Items}}',
            '</ul>',
            '</li>',
        ].join(""),
        TableTaskFinishedMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="id" data-value="{{id}}" >{{id}}</td>',
            '<td data-title="name" data-value="{{name}}" >{{name}}</td>',
            '<td data-title="processDefinitionId" data-value="{{processDefinitionId}}" >{{processDefinitionId}}</td>',
            '<td data-title="assignee" data-value="{{assignee}}" >{{assignee}}</td>',
            '<td data-title="startTime" data-value="{{startTime}}" >{{startTime}}</td>',
            '<td data-title="endTime" data-value="{{endTime}}" >{{endTime}}</td>',
            '<td style="min-width: 30px;max-width: 70px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-detail-show">详情</span><span class="td-contain-list" id="cby-record-show">跟踪</span></div> </td>  ',
            
            '</tr>',
        ].join(""),
        TableTaskApplyMode: [
            '<tr>',
            '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="ProcessDefinitionName" data-value="{{ProcessDefinitionName}}" >{{ProcessDefinitionName}}</td>',
            '<td data-title="Status" data-value="{{Status}}" >{{Status}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td data-title="Description" data-value="{{Description}}" >{{Description}}</td>',
            '<td style="min-width: 30px;max-width: 70px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-charf-showApply">流程图</span><span class="td-contain-list" id="cby-record-showApply">详情</span></div> </td>  ',
            
            '</tr>',
        ].join(""),
        TableTaskRecoedMode: [
            '<tr>',
            //   '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            // '<td style="min-width: 30px;max-width: 70px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-charf-showApply">流程图</span><span class="td-contain-list" id="cby-record-showApply">历史记录</span></div> </td>  ',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="id" data-value="{{id}}" >{{id}}</td>',
            '<td data-title="name" data-value="{{name}}" >{{name}}</td>',
            '<td data-title="assignee" data-value="{{assignee}}" >{{assignee}}</td>',
            '<td data-title="taskDefinitionKey" data-value="{{taskDefinitionKey}}" >{{taskDefinitionKey}}</td>',
            '<td data-title="createTime" data-value="{{createTime}}" >{{createTime}}</td>',
            '<td data-title="endTime" data-value="{{endTime}}" >{{endTime}}</td>',
            '</tr>',
        ].join(""),
        TableFinishedMode: [
            '<tr>',
            //   '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
             //'<td style="min-width: 30px;max-width: 70px;" data-title="#" data-value="#"><div class="td-contain"><span class="td-contain-list" id="cby-charf-showApply">流程图</span><span class="td-contain-list" id="cby-record-showApply">历史记录</span></div> </td>  ',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="ProcessDefinitionId" data-value="{{ProcessDefinitionId}}" >{{ProcessDefinitionId}}</td>',
            '<td data-title="StartTime" data-value="{{StartTime}}" >{{StartTime}}</td>',
            '<td data-title="EndTime" data-value="{{EndTime}}" >{{EndTime}}</td>',
            '<td data-title="DurationInMillis" data-value="{{DurationInMillis}}" >{{DurationInMillis}}</td>',
            //'<td data-title="ApplyName" data-value="{{ApplyName}}" >{{ApplyName}}</td>',
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
        DEFAULT_VALUE_Bill = {
            Name: "",
            // ID:0,
            // Key:"",
            // Type:0,
            // Status:0,
            // Version:0,
            // Url:"",
            // FarID:0
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
        KEYWORD_TaskItem_LIST = [
            // "FormID|表单|",
            "Name|表单名称|ArrayOne",
        ];
        KEYWORD_TaskItem = {};
        FORMATTRT_TaskItem = {};
        DEFAULT_VALUE_Task = {
            Name: "",
        }

        TypeSource_TaskItem = {
            Name: [
                {
                    name: "",
                    value: 1
                },
            ],
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
        name: '单据管理',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },
        run: function () {
            $("#routeTree").bind("contextmenu", function () {
                return false;
            });
            model.com.getItemTree({}, function (resT) {
                dataTree = resT.list;
                model.com.refreshTree();
            });
            model.com.getItemTable({}, function (res) {
                DataTable = res.list;
                DataUser = window.parent._UserAll;
                model.com.refreshTable();
            });
            model.com.getRouteDefine({}, function (res) {
                dataRouteDefine = res.list;
            });
            model.com.getFinishedTask({}, function (res) {
                dataFinishedTask = res.list;
                model.com.refreshFinishedTask();
            });
            model.com.getApplyTask({}, function (res) {
                dataApplyTask = res.list;
                model.com.refreshAppliedTask();
            });
            model.com.getFinishedBill({}, function (res) {
                dataFinishedBill = res.list;
            });


            $("#cby-route-charf-finish").hide();
            $("#cby-route-charf-apply").hide();
            $(".cby-task-record").hide();
            $("#cby-finished-record").hide();
            $("#cby-apply-record").hide();
            $("#cby-finished-apply").hide();

            var $wrapper = $('.tab-wrapper'),
                $allTabs = $wrapper.find('.tab-content > div'),
                $tabMenu = $wrapper.find('.tab-menu li'),
                $line = $('<div class="line"></div>').appendTo($tabMenu);

            $allTabs.not(':first-of-type').hide();
            //$tabMenu.filter(':first-of-type').find(':first').width('100%')

            $tabMenu.each(function (i) {
                $(this).attr('data-tab', 'tab' + i);
            });

            $allTabs.each(function (i) {
                $(this).attr('data-tab', 'tab' + i);
            });

            $tabMenu.on('click', function () {

                var dataTab = $(this).data('tab'),
                    $getWrapper = $(this).closest($wrapper);

                $getWrapper.find($tabMenu).removeClass('active');
                $(this).addClass('active');

                $getWrapper.find('.line').width(0);
                $(this).find($line).animate({ 'width': '100%' }, 'fast');
                $getWrapper.find($allTabs).hide();
                $getWrapper.find($allTabs).filter('[data-tab=' + dataTab + ']').show();
            });
        },
        events: function () {
            // $("body").delegate("#cby-finishing-task","click",function(){
            //     $("#cby-finishing-task").css("display","block");
            //     $("#cby-finished-task").css("display","none");
            //     $("#cby-own-apply").css("display","none");
            // });
            // $("body").delegate("#cby-finished-task","click",function(){
            //     $("#cby-finishing-task").css("display","none");
            //     $("#cby-finished-task").css("display","block");
            //     $("#cby-own-apply").css("display","none");
            // });
            // $("body").delegate("#cby-own-apply","click",function(){
            //     $("#cby-finishing-task").css("display","none");
            //     $("#cby-finished-task").css("display","none");
            //     $("#cby-own-apply").css("display","block");
            // });

            //在window中注册一个刷新函数
            window.parent.refreshTablekey = function () {
                model.com.getItemTable({}, function (res) {
                    DataTable = res.list;
                    DataUser = window.parent._UserAll;
                    model.com.refreshTable();
                });
            };

            $("body").delegate("#lmvt-imgclick", "click", function () {
                model.com.imgShow("#outerdiv", "#innerdiv", "#bigimg", $(this));
            });

            $("body").delegate(".hwLayer-close", "click", function () {
                $(".lmvt-TableAndImg").hide();
            });

            //模糊查询
            $("body").delegate("#cby-tbody-taskTable", "change", function () {
                var $this = $(this),
                    value = $(this).val();

                if (value == undefined || value == "" || value.trim().length < 1) {
                    $("#cby-tbody-taskTable").children("tr").show();
                }
                else
                    $com.table.filterByLikeString($("#cby-tbody-taskTable"), tableShow, value, "OrderID");
            });
            //查看已办流程图
            $("body").delegate("#cby-charf-show", "click", function () {
                var $Id = $(this).closest("td").next().next().attr("data-value"),
                    processDefinitionId;
                $.each(dataFinishedTask, function (i, item) {
                    if (item.id == $Id) {
                        processDefinitionId = item.processDefinitionId;
                        processInstanceId = item.processInstanceId;
                    }
                });
                //var $src=$com.imageUrl+"/MESBPM/api/Leave/Image2defin?processDefinitionId="+processDefinitionId;
                var $src = $com.imageUrl + "/MESBPM/api/Leave/Image2defin?processDefinitionId=" + processDefinitionId;
                $("#cby-route-charf-finish img").attr("src", $src);
                $("#cby-uplist-finish").css("height", "50%");
                $("#cby-route-charf-finish").show();
            });
            //查看发起流程图
            $("body").delegate("#cby-charf-showApply", "click", function () {
                var $Id,processDefinitionId, ProcessInstanceID;
                    $tdList = $(this).closest("td").parent("tr").children("td");
           
                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        $Id = $tdList.eq(i).next().attr("data-value");
                    }
                }

                $.each(dataApplyTask, function (i, item) {
                    if (item.ID == $Id) {
                        ProcessInstanceID = item.ID;
                        processDefinitionId = item.ProcessDefinitionId;
                    }
                });
                var $src = $com.imageUrl + "/MESBPM/api/Repository/getRealFlowChart?processInstanceId=" + ProcessInstanceID;
                $("#cby-route-charf-apply img").attr("src", $src);
                //$("#cby-route-charf-apply").show();
                model.com.imgShow("#outerdiv", "#innerdiv", "#bigimg", $("#cby-route-charf-apply img"));
            });
            //返回到表格
            $("body").delegate("#cby-return-table", "click", function () {
                $(".cby-route-charf").hide();
            });
            //查看已办历史记录
            $("body").delegate("#cby-record-show", "click", function () {
                var $Id,executionId, finishRecord, processInstanceId,
                    $tdList = $(this).closest("td").parent("tr").children("td");
           
                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "id") {
                        $Id = $tdList.eq(i).next().attr("data-value");
                    }
                }
                $.each(dataFinishedTask, function (i, item) {
                    if (item.id == $Id) {
                        //executionId = item.executionId;
                        processInstanceId = item.processInstanceId;
                    }
                });
                var $bodyid = "#cby-tbody-recordTable-finish";
                var $showId = "#cby-finished-record";
                var $hideId = "#cby-uplist-finish";
                model.com.refreshRecord(processInstanceId, $bodyid, $showId, $hideId);

                var processDefinitionId;
                $.each(dataFinishedTask, function (i, item) {
                    if (item.id == $Id) {
                        processDefinitionId = item.processDefinitionId;
                        processInstanceId = item.processInstanceId;
                    }
                });
                //var $src=$com.imageUrl+"/MESBPM/api/Leave/Image2defin?processDefinitionId="+processDefinitionId;
                var $src = $com.imageUrl + "/MESBPM/api/Leave/Image2defin?processDefinitionId=" + processDefinitionId;
                $("#cby-route-charf-finish img").attr("src", $src);
                $("#cby-uplist-finish").css("height", "50%");
                $("#cby-route-charf-finish").show();

                $(".lmvt-TableAndImg").show();

            });
            //查看发起历史记录
            $("body").delegate("#cby-record-showApply", "click", function () {
                var $Id,executionId, applyRecord, processInstanceId;
                    $tdList = $(this).closest("td").parent("tr").children("td");
           
                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        $Id = $tdList.eq(i).next().attr("data-value");
                    }
                }
                    
                //$.each(dataApplyTask,function(i,item){
                //    if(item.ID==$Id){
                //        //executionId = item.ProcessInstanceID;
                //        processInstanceId = item.ProcessInstanceID;
                //    }
                //});
                var $bodyid = "#cby-tbody-recordTable-apply";
                var $showId = "#cby-apply-record";
                var $hideId = "#cby-uplist-apply";
                model.com.refreshRecord($Id, $bodyid, $showId, $hideId);
            });
            //已完成历史记录模糊查询
            $("body").delegate("#cby-searchRecord-table-finish", "change", function () {
                var $this = $(this),
                    value = $(this).val();

                if (value == undefined || value == "" || value.trim().length < 1) {
                    $("#cby-tbody-recordTable-finish").children("tr").show();
                }
                else
                    $com.table.filterByLikeString($("#cby-tbody-recordTable-finish"), recordArr, value, "OrderID");
            });
            //发起历史记录模糊查询
            $("body").delegate("#cby-searchRecord-table-apply", "change", function () {
                var $this = $(this),
                    value = $(this).val();

                if (value == undefined || value == "" || value.trim().length < 1) {
                    $("#cby-tbody-recordTable-apply").children("tr").show();
                }
                else
                    $com.table.filterByLikeString($("#cby-tbody-recordTable-apply"), recordArr, value, "OrderID");
            });
            //返回已完成任务
            $("body").delegate("#cby-return-table-finish", "click", function () {
                $("#cby-finished-record").hide();
                $("#cby-uplist-finish").show();
            });
            //返回发起任务
            $("body").delegate("#cby-return-table-apply", "click", function () {
                $("#cby-apply-record").hide();
                $("#cby-uplist-apply").show();
            });
            //获取已完成的发起
            $("body").delegate("#cby-show-finishBill", "click", function () {
                var _dataFinishedBill = $com.util.Clone(dataFinishedBill);
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
                $("#cby-tbody-taskApplyFinishedTable").html($com.util.template(_dataFinishedBill, HTML.TableFinishedMode));
                $("#cby-finished-apply").show();
                $("#cby-uplist-apply").hide();
            });
            //返回
            $("body").delegate("#cby-return-finishingBill", "click", function () {
                $("#cby-finished-apply").hide();
                $("#cby-uplist-apply").show();
            })
            //办理任务
            $("body").delegate("#cby-edit-task", "click", function () {
                var taskID,
                    $tdList = $(this).closest("td").parent("tr").children("td");
           
                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        taskID = $tdList.eq(i).next().attr("data-value");
                    }
                }
                var ActivitiID,
                    ProdefinID,
                    ProdefinVersion;
                $.each(DataTable, function (i, item) {
                    if (item.ID == taskID) {
                        ActivitiID = item.ActivitiID;
                        ProdefinID = item.ProcessDefinitionId;
                        return false;
                    }
                });
                $.each(dataRouteDefine, function (i, item) {
                    if (item.id_ == ProdefinID) {
                        ProdefinVersion = Number(item.version_);
                        return false;
                    }
                })

                model.com.searchBill({ processDefinitionId: ProdefinID, ActivitID: ActivitiID,ClientType:0 }, function (res) {
                    var data = res.info,
                        url = data.FormUrl;
                    if (url != null) {
                        if (url.indexOf("/MESCore") > 0) {
                            url = url.substring(url.indexOf("/MESCore"));
                        }

                        $href = url + "?taskID=" + taskID + "&type=" + 2;

                        vdata = { 'header': '任务', 'id': 'LeaveInfo', 'href': $href, 'src': './static/images/menu/deviceManage/deviceInformation.png' };


                        //window.parent.iframeHeaderSet(vdata);
                        //显示容器
                        $contain = $(window.top.document.getElementsByClassName("body-all")[0]);
                        if (temp) {
                            $contain.append(HTML.iFrameNode);
                            $iFrameContain = $(window.top.document.getElementsByClassName("hw-overlay")[0]);
                            $iFrame = $(window.top.document.getElementsByClassName("lmvt-iframe")[0]);
                            $iFrame.attr("src", $href);
                            $iFrameContain.show();
                            $contain.delegate(".hwLayer-close", "click", function () {
                                $iFrameContain.hide();
                            });

                            temp = false;
                        }
                        else {
                            $iFrameContain = $(window.top.document.getElementsByClassName("hw-overlay")[0]);
                            $iFrame = $(window.top.document.getElementsByClassName("lmvt-iframe")[0]);
                            $iFrame.attr("src", $href);
                            $iFrameContain.show();
                        }
                    } else {
                        console.info("Form_activtientity_ship/Info:返回数据为NULL");
                    }
                });

            });
            //查询已办详情
            $("body").delegate("#cby-detail-show", "click", function () {
                var $Id,
                    ActivitiID,
                    ProdefinID,
                    ProdefinVersion;
                    $tdList = $(this).closest("td").parent("tr").children("td");
           
                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "id") {
                        $Id = $tdList.eq(i).next().attr("data-value");
                    }
                }
                var taskID = $Id

                //executionId = item.executionId;
                $.each(dataFinishedTask, function (i, item) {
                    if (item.id == $Id) {
                        ActivitiID = item.taskDefinitionKey;
                        ProdefinID = item.processDefinitionId;
                        return false;
                    }
                });
                $.each(dataRouteDefine, function (i, item) {
                    if (item.id_ == ProdefinID) {
                        ProdefinVersion = Number(item.version_);
                        return false;
                    }
                })

                model.com.searchBill({ processDefinitionId: ProdefinID, ActivitID: ActivitiID, ClientType:0}, function (res) {
                    var data = res.info,
                        url = data.FormUrl;
                    if (url != null) {
                        if (url.indexOf("/MESCore") > 0) {
                            url = url.substring(url.indexOf("/MESCore"));
                        }
                        if (url.indexOf("/monthly_plan") > 0) {
                            url = url.replace("/monthly_plan_finish", "/monthly_plan");
                        }
                        $href = url + "?taskID=" + taskID + "&type=" + 1;
                        vdata = { 'header': '任务', 'id': 'LeaveInfo', 'href': $href, 'src': './static/images/menu/deviceManage/deviceInformation.png' };
                        //显示容器
                        $contain = $(window.top.document.getElementsByClassName("body-all")[0]);
                        if (temp) {
                            $contain.append(HTML.iFrameNode);
                            $iFrameContain = $(window.top.document.getElementsByClassName("hw-overlay")[0]);
                            $iFrame = $(window.top.document.getElementsByClassName("lmvt-iframe")[0]);
                            $iFrame.attr("src", $href);
                            $iFrameContain.show();
                            $contain.delegate(".hwLayer-close", "click", function () {
                                $iFrameContain.hide();
                            });

                            temp = false;
                        }
                        else {
                            $iFrameContain = $(window.top.document.getElementsByClassName("hw-overlay")[0]);
                            $iFrame = $(window.top.document.getElementsByClassName("lmvt-iframe")[0]);
                            $iFrame.attr("src", $href);
                            $iFrameContain.show();
                        }
                    }

                    else {
                        console.info("Form_activtientity_ship/Info:返回数据为NULL");
                    }
                })
            })

            //待办实时流程图
            $("body").delegate("#cby-onTask-charf", "click", function () {
                var tid,ProcessInstanceID,
                    $tdList = $(this).closest("td").parent("tr").children("td");
           
                for (var i = 0; i < $tdList.length; i++) {
                    if ($tdList.eq(i).next().attr("data-title") == "ID") {
                        tid = $tdList.eq(i).next().attr("data-value");
                    }
                }
                $.each(DataTable, function (i, item) {
                    if (item.ID == tid) {
                        ProcessInstanceID = item.ProcessInstanceId;
                    }
                });
                var $src = $com.imageUrl + "/MESBPM/api/Repository/getRealFlowChart?processInstanceId=" + ProcessInstanceID;
                $("#cby-route-charf-ontask img").attr("src", $src);
                //$("#cby-route-charf-ontask").show();

                model.com.imgShow("#outerdiv", "#innerdiv", "#bigimg", $("#cby-route-charf-ontask img"));

                //$("#cby-table").hide();
            });
            //返回待办任务
            $("body").delegate("#cby-return-ontask", "click", function () {
                $("#cby-route-charf-ontask").hide();
            });
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
                        //判断是否有子集
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
            //渲染表格
            refreshTable: function () {
                var _dataTable = $com.util.Clone(DataTable);
                //获得任务状态，激活则可显示办理
                var newDataTable = [];
                $.each(_dataTable, function (i, item) {
                    dataTaskStatus = item.Status;
                    if (dataTaskStatus == 1) {
                        newDataTable.push(item);
                        item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                    }
                });
                $.each(newDataTable, function (i, item) {
                    $.each(DataUser, function (u_i, u_item) {
                        if (Number(item.Assignee) == u_item.ID) {
                            item.assignee = u_item.Name;

                        }
                    })
                    item.OrderID = i + 1;
                })

                tableShow = newDataTable;
                if (tableShow.length > 0) {

                    $("#cby-messageFinishing-count").text(tableShow.length);
                    $("#cby-messageFinishing-count").show();
                } else {
                    $("#cby-messageFinishing-count").hide();
                }
                $("#cby-tbody-taskTable").html($com.util.template(tableShow, HTML.TableTaskItemMode));
            },
            //渲染已办理任务
            refreshFinishedTask: function () {
                var showArr = [],
                    showObj = {};
                $.each(dataFinishedTask, function (i, item) {
                    showObj.id = item.id;
                    showObj.name = item.name;
                    showObj.processDefinitionId = item.processDefinitionId;
                    showObj.startTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.createTime);
                    showObj.endTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.endTime);
                    $.each(DataUser, function (u_i, u_item) {
                        if (u_item.ID == Number(item.assignee)) {
                            showObj.assignee = item.Name;

                            return false;
                        }
                    });
                    showArr.push(showObj);
                    showObj = {};
                });
                showArr = showArr.sort(function (a, b) {
                    return a.startTime < b.startTime ? 1 : -1
                });
                $.each(showArr, function (i, item) {
                    item.OrderID = i + 1;
                });
                $("#cby-tbody-taskFinishedTable").html($com.util.template(showArr, HTML.TableTaskFinishedMode));
            },
            //渲染发起的任务
            refreshAppliedTask: function () {
                var _dataApplyTask = $com.util.Clone(dataApplyTask);
                $.each(_dataApplyTask, function (i, item) {
                   
                    item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.StartTime);

                    if (item.StartTime == null) {
                        item.Status = "草稿";
                        return true;
                    }
                    if (item.EndTime == null || item.DurationInMillis == null) {
                        item.Status = "运行中";
                        return true;
                    }
                    if (item.DurationInMillis != null && item.EndTime != null) {
                        item.Status = "完成";
                    }
                    //$.each(DataUser,function(u_i,u_item){
                    //    if(item.AppayID==u_item.ID){
                    //        item.ApplyName=u_item.Name;
                    //    }
                    //});
                });
                var showArr = [];
                showArr = _dataApplyTask;
                showArr = showArr.sort(function (a, b) {
                    return a.CreateTime < b.CreateTime ? 1 : -1
                });
                if (showArr.length > 0) {

                    $("#cby-messageApply-count").text(showArr.length);
                    $("#cby-messageApply-count").show();
                } else {
                    $("#cby-messageApply-count").hide();
                }
                $.each(showArr, function (i, item) {
                    item.OrderID = i + 1;
                })

                $("#cby-tbody-taskApplyTable").html($com.util.template(showArr, HTML.TableTaskApplyMode));
            },
            //渲染历史记录
            refreshRecord: function (tid, $bodyid, $showId, $hideId) {
                var showObj = {},
                    showArr = [];
                model.com.getRecord({ processInstanceId: tid }, function (res) {
                    dataRecord = res.list;
                    $.each(dataRecord, function (i, item) {
                        showObj.id = item.id;
                        showObj.name = item.name;
                        showObj.assignee = item.assignee;
                        showObj.taskDefinitionKey = item.taskDefinitionKey;
                        showObj.createTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.createTime);
                        if (item.persistentState.endTime != null) {
                            showObj.endTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.persistentState.endTime);
                        } else {
                            showObj.endTime = "";
                        }
                        showArr.push(showObj);
                        showObj = {};
                    });
                    $.each(showArr, function (s_i, s_item) {
                        $.each(DataUser, function (u_i, u_item) {
                            if (Number(s_item.assignee) == u_item.ID) {
                                s_item.assignee = u_item.Name;
                            }
                        });
                    });
                    $.each(showArr, function (s_i, s_item) {
                        s_item.OrderID = s_i + 1;
                    })
                    recordArr = $com.util.Clone(showArr);
                    $($hideId).hide();
                    $($bodyid).html($com.util.template(showArr, HTML.TableTaskRecoedMode));
                    $($showId).show();
                });
            },

            getLongTime: function (mss) {
                var days = parseInt(mss / (1000 * 60 * 60 * 24));
                var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = (mss % (1000 * 60)) / 1000;
                var _time = days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 ";
                return _time;

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
                    $URI: "/Leave/FindMyPersonalTask",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获得流程定义
            // getRouteDefine: function (data, fn, context) {
            //     var d = {
            //         $SERVER: "/MESBPM",
            //         $URI: "/Leave/AllDefinitions",
            //         $TYPE: "get"
            //     };

            //     function err() {
            //         $com.app.tip('获取失败，请检查网络');
            //     }

            //     $com.app.ajax($.extend(d, data), fn, err, context);
            // },
            getRouteDefine: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Repository/getProcessDefinitionList",
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
            deleteTreeItemTable: function (data, fn, context) {
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

            //查询单条
            searchBill: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
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
                    $SERVER: "/MESBPM",
                    $URI: "/Tree_form/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询已办任务
            //getFinishedTask: function (data, fn, context) {
            //    var d = {
            //        $SERVER: "/MESBPM",
            //        $URI: "/Leave/GetCompleted",
            //        $TYPE: "get"
            //    };

            //    function err() {
            //        $com.app.tip('获取失败，请检查网络');
            //    }

            //    $com.app.ajax($.extend(d, data), fn, err, context);
            //},
            getFinishedTask: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/History/getMyHisTaskIns",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询发起任务
            getApplyTask: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Leave/MyApply",
                    $TYPE: "get"
                }

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getStatus: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Leave/GetExecutionStatus",
                    $TYPE: "get"
                }

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取历史记录
            getRecord: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Leave/GetHistoryByActiviti",
                    $TYPE: "get"
                }

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取已完成的任务
            getFinishedBill: function (data, fn, context) {
                var d = {
                    $SERVER: "/MESBPM",
                    $URI: "/Leave/MyApplyFinished",
                    $TYPE: "get"
                }

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
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