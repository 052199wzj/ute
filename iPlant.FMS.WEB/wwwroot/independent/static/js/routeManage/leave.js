require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/jquery.treeview', ], function ($zace, $com, $tree) {
    var dataUser,
        dataMyTask,
        dataNextTask,
        taskIDObj,
        dataCurrent;

    var HTML = {
        optionItemTemplate:[
            '<option value="{{Name}}">{{Name}}</option>'
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
            // $("#cby-option-user").html($com.util.template(dataUser, HTML.optionItemTemplate));
            
            model.com.getMyTask({},function(res){
                dataMyTask=res.list;
                model.com.refresh();
            });
        },
        events:function(){
            //提交数据
            $("body").delegate("#cby-submit-data","click",function(){
                var days=$("#cby-leave-days input").val(),
                    reason=$("#cby-leave-reason input").val(),
                    userName= $("#cby-option-user").val();
                var _data={
                    days:Number(days),
                    reason:reason
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
                            //启动任务
                            // model.com.onTask({id:taskIDObj.defineID},function(){
                                alert("启动成功");
                            // });
                            
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
            //启动任务
            onTask:function (data, fn, context) {
                var d = {
                    $SERVER:"/MESBPM",
                    $URI: "/leave/startProcessInstance",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            
            refresh:function(){
                //获取taskID
                taskIDObj=model.com.GetRequest();
                var taskID=Number(taskIDObj.taskID),
                    definitionId,
                    activitiId;
                //获取definitionId,activitiId
                $.each(dataMyTask,function(i,item){
                    if(item.ID==taskID){
                        definitionId=item.ProcessDefinitionId;
                        activitiId=item.ActivitiID;
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

            }
        },
       
    });
    model.init();
});