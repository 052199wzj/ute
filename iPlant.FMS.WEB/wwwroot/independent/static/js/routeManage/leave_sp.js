require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview', ], function ($zace, $com, $tree) {
    var dataUser,
        dataMyTask,
        dataNextTask,
        taskIDObj,
        dataCurrent,
        DataUp;

    var HTML = {
        optionItemTemplate:[
            '<option value="{{Name}}">{{Name}}</option>'
        ].join(""),
        TableRecordItemMode: [
            '<tr>',
            // '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
            '<td data-title="OrderID" data-value="{{OrderID}}" >{{OrderID}}</td>',
            '<td data-title="id" data-value="{{id}}" >{{id}}</td>',
            '<td data-title="name" data-value="{{name}}" >{{name}}</td>',
            '<td data-title="assignee" data-value="{{assignee}}" >{{assignee}}</td>',
            '<td data-title="taskDefinitionKey" data-value="{{taskDefinitionKey}}" >{{taskDefinitionKey}}</td>',
            '<td data-title="createTime" data-value="{{createTime}}" >{{createTime}}</td>',
            '<td data-title="endTime" data-value="{{endTime}}" >{{endTime}}</td>',
            '</tr>',
        ].join(""),
    }
    

    model = $com.Model.create({
        name: '请假模板',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },
        run:function(){
            dataUser=window.parent._UserAll;     
            
            model.com.getMyTask({},function(res){
                dataMyTask=res.list;
                model.com.refresh();
            });
        },
        events:function(){
            //提交数据
            $("body").delegate("#cby-submit","click",function(){
                var result=$(".cby-leave-result").val(),
                    remark=$(".cby-leave-remark").val(),
                    userName= $("#cby-option-user").val();
                var _data={
                    result:result,
                    remark:remark
                },
                processInstanceId,
                userId,
                nextTaskID;
                $.each(dataUser,function(i,item){
                    if(item.Name==userName){
                        userId=(item.ID).toString();
                        return false;
                    }
                });
                var _TaskID=taskIDObj.taskID;
                model.com.postTask({TaskID:_TaskID,data:_data},function(){
                    $.each(dataMyTask,function(i,item){
                        if(item.ID==_TaskID){
                            processInstanceId=item.ProcessInstanceId;
                            return false;
                        }
                    });
                    model.com.getCurrentData({processInstanceId:processInstanceId},function(res){
                        dataCurrent=res;
                        nextTaskID=dataCurrent.info;
                        model.com.postNextTask({taskId:nextTaskID,userId:userId},function(){
                            alert("提交成功");
                        });
                    });
                });
                
            });
        },
        com:{
            completeMyPersonalTask:function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/leave/completeMyPersonalTask",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            
            //查询我的任务
            getMyTask:function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/leave/findMyPersonalTask",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //查询下一个任务
            getNextTask:function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/leave/nextTask",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //提交我的任务
            postTask:function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/leave/completeMyPersonalTask",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取current
            getCurrentData:function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/leave/currentTask",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //提交下个任务
            postNextTask:function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/leave/moveTask",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取历史记录
            getHistoryRecord:function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/leave/gethistory2ExecutionID",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getUpList:function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/leave/getVarinst",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //截取字符串
            GetRequest: function () {
                var url = window.location.search; //获取url中"?"符后的字串
                var theRequest = new Object();
                if (url.indexOf("?") != -1) {
                    var str = url.substr(1);
                    strs = str.split("&");
                    for (var i = 0; i < strs.length; i++) {
                        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                    }
                }
                return theRequest;
            },
            
            refresh:function(){
                //获取taskID
                taskIDObj=model.com.GetRequest();
                var taskID=Number(taskIDObj.taskID),
                    definitionId,
                    activitiId,
                    $executionId;
                //获取definitionId,activitiId
                $.each(dataMyTask,function(i,item){
                    if(item.ID==taskID){
                        definitionId=item.ProcessDefinitionId;
                        activitiId=item.ActivitiID;
                        $executionId=item.ExecutionId;
                        return false;
                    }
                });
                model.com.getNextTask({definitionId:definitionId,activitiId:activitiId},function(res){
                    dataNextTask=res.list[0];
                    showObj={
                        Name:dataNextTask.Name
                    };
                    $.each(dataUser,function(i,item){
                        if(dataNextTask.AssigneeID==item.ID){
                            showObj.user=item.Name;
                            return false;
                        }
                    });
                   
                    $("#cby-option-user").html($com.util.template(dataUser, HTML.optionItemTemplate));
                    $("#cby-input-value").attr("value",showObj.Name);
                    $("#cby-option-user").val(showObj.user);
                });
                //渲染历史记录
                var executionId,
                    dataUp;
                $.each(dataMyTask,function(i,item){
                    if(item.ID==taskID){
                        executionId=item.ExecutionId;
                        return false;
                    }
                });
                model.com.getHistoryRecord({executionId:executionId},function(res){
                    dataRecord=res.list;
                    dataUp=dataRecord[0];

                    var recordArr=$com.util.Clone(dataRecord);
                    var showObj={},showArr=[];
                    $.each(recordArr,function(i,item){
                        showObj.id=item.id;
                        showObj.name=item.name;
                        showObj.assignee=item.assignee;
                        showObj.taskDefinitionKey=item.taskDefinitionKey;
                        showObj.createTime=$com.util.format('yyyy-MM-dd hh:mm:ss', item.createTime);
                        if(item.persistentState.endTime!=null){
                            showObj.endTime=$com.util.format('yyyy-MM-dd hh:mm:ss', item.persistentState.endTime);
                        }else{
                            showObj.endTime="";
                        } 
                        showArr.push(showObj);
                        showObj={};
                    });
                    $.each(showArr,function(s_i,s_item){
                        $.each(dataUser,function(u_i,u_item){
                            if(s_item.assignee==u_item.ID){
                                s_item.assignee=u_item.Name;
                                s_item.OrderID=s_i+1;
                            }
                        });
                    });
                    $("#cby-tbody-recordTable").html($com.util.template(showArr, HTML.TableRecordItemMode));
               
                    //渲染请假信息
                    var dataUpArr=[],
                    dataUpObj={};
                    model.com.getUpList({executionId:$executionId},function(res){
                        DataUp=res.list;
                        $.each(DataUp,function(i,item){
                            if(item.taskId==dataUp.id){
                                dataUpObj.name=item.name;
                                dataUpObj.value=item.textValue;
                                dataUpArr.push(dataUpObj);
                                dataUpObj={};
                            }
                        });
                        $.each(dataUpArr,function(i,item){
                            if(item.name=="days"){
                                $("#cby-leave-days").val(item.value);
                            }else if(item.name=="reason"){
                                $("#cby-leave-reason").val(item.value);
                            }
                        });
                    });
                });
                //渲染流程图
                var ProcessInstanceID;
                $.each(dataMyTask,function(i,item){
                    if(item.ID==taskIDObj.taskID){
                        ProcessInstanceID=item.ProcessInstanceId;
                        return false;
                    }
                });
                var $src="http://192.168.1.108:8088/MESBPM/api/leave/image?processInstanceId="+ProcessInstanceID;
                $("#cby-show-charf img").attr("src",$src);
            }
        },
       
    });
    model.init();
});