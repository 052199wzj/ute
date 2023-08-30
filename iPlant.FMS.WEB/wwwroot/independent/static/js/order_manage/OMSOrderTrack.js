require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/paging', '../static/utils/js/base/base'], function ($alfie, $page, $com) {
    var Formattrt_order; //字段格式化对象
    var KEYWORD_order; //查询关键字
    var KEYWORD_order_LIST; //定义字段格式(用于表格字段转换)
    var TypeSource_order; //枚举对象(用于字段转换)
    var mCloneData; //克隆的数据源(用于模糊查询)
    var HTML; //HTML模板
    var mStatus = [];
    var mID = -1;
    var mStationID = -1;
    var mWorkName = '';
    var mZCommitStartTime = $com.util.format('yyyy-MM-dd', new Date().getTime() - 30 * 24 * 3600 * 1000);
    var mZCommitEndTime = $com.util.format('yyyy-MM-dd', new Date().getTime() + 24 * 3600 * 10);
    var mCode = '';
    var mZCommitStartTime;
    var mData;
    var wUser = [];
    var mFMCStation = [];
    var mTeamManage = [];
    var MateArray = [];
    var NewDate = [];
    var FinishDate = [];
    var OrderCount = {};

    var TestArray = [{
        ID: 1,
        PartNo: '1BHC0026',
        CustomerName: '18号线',
        OrderNo: '202012809809809',
        AuditTime: '2021-04-28 15:02:43',
        WorkName: '作业名称',
        TeamName: '班组名称',
        WorkerName: '作业人员',
        PlanReceiveDate: '2021-04-28 15:02:43',
        PlanFinishDate: '2021-04-28 15:02:43',
        RealStartDate: '2021-04-28 15:02:43',
        RealFinishDate: '2021-04-28 15:02:43',
        Status: 1,
    }];
    var PartArray = [{
        ID: 1,
        Code: '201808196398345',
        StartTime: '2018-08-19 14:48:38',
        FinshTime: '2018-08-19 14:48:38',
        CreateName: '张三',
        WorkerName: '张三、赵小明',
        WorkTime: '30分钟',
        Picture: '图片',
        Parameter: '312938210',
    }];

    var StausTextArray = ['无', '已保存', '已制定', '已下达', '已开工', '已完工', '暂停中', '已入库', '已上传', '已关闭'];
    HTML = {

        TableNode_item: [
            '<tr data-color="">',
            // '<td style="width: 3px"><input type="checkbox"',
            // 'class="femi-tb-checkbox" style="margin: 1px 0px 1px;" /></td> ',
            '<td style="min-width: 50px;" data-title="ID" data-value="{{ID}}">{{WID}}</td>',
            '<td style="min-width: 50px" data-title="PartNo" data-value="{{PartNo}}">{{PartNo}}</td>',
            '<td style="min-width: 50px" data-title="Customer" data-value="{{Customer}}">{{Customer}}</td>',
            '<td style="min-width: 50px" data-title="OrderNo" data-value="{{OrderNo}}">{{OrderNo}}</td>',
            '<td style="min-width: 50px" data-title="AuditTime" data-value="{{AuditTime}}">{{AuditTime}}</td>',
            '<td style="min-width: 50px" data-title="StationName" data-value="{{StationName}}">{{StationName}}</td>',
            '<td style="min-width: 50px" data-title="WorkName" data-value="{{WorkName}}">{{WorkName}}</td>',
            '<td style="min-width: 50px" data-title="TeamName" data-value="{{TeamName}}">{{TeamName}}</td>',
            '<td style="min-width: 50px" data-title="WorkerName" data-value="{{WorkerName}}">{{WorkerName}}</td>',
            '<td style="min-width: 50px" data-title="PlanReceiveDate" data-value="{{PlanReceiveDate}}">{{PlanReceiveDate}}</td>',
            '<td style="min-width: 50px" data-title="PlanFinishDate" data-value="{{PlanFinishDate}}">{{PlanFinishDate}}</td>',
            '<td style="min-width: 50px" data-title="RealStartDate" data-value="{{RealStartDate}}">{{RealStartDate}}</td>',
            '<td style="min-width: 50px" data-title="RealFinishDate" data-value="{{RealFinishDate}}">{{RealFinishDate}}</td>',
            '<td style="min-width: 50px" data-title="OverTimeText" data-value="{{OverTimeText}}">{{OverTimeText}}</td>',
            '<td style="min-width: 50px" data-title="Status" data-value="{{Status}}">{{Status}}</td>',
            '<td style="width: 150px" data-title="Handle" data-value="{{ID}}"><div class="row">',

            '<div class="col-md-4 lmvt-do-info lmvt-delete"  data-value="{{ID}}" ><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>删除</div>',
            '<div class="col-md-4 lmvt-do-info lmvt-Status"  data-value="{{ID}}" ><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>状态</div>',
            '<div class="col-md-4 lmvt-do-info lmvt-resetDetail"  data-value="{{ID}}" ><span class="glyphicon glyphicon-list" aria-hidden="true"></span>详情</div>',
            // '<div class="col-md-4 lmvt-do-info lmvt-resetPencil"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>编辑</div>',
            // '<div class="col-md-4 lmvt-do-info lmvt-delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>删除</div>',
            /*'<div class="col-md-6 lmvt-do-info"><UL id="nav">',
            '<LI>更多<UL><LI data-value="{{ID}}" class="lmvt-delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>删除</LI>',
            '<LI data-value="{{ID}}" class="lmvt-resetPencil"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>编辑</LI>',
            '<LI data-value="{{ID}}" class="lmvt-Status"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>状态</LI>',
            '</UL></LI></UL></div>',
            '<div class="col-md-6 lmvt-do-info lmvt-resetDetail"  data-value="{{ID}}" ><span class="glyphicon glyphicon-list" aria-hidden="true"></span>详情</div>',*/
            '</div></td>',
            '</tr>',
        ].join(''),
        TableNode_parts: [
            '<tr data-color="">',
            '<td style="min-width: 50px;" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
            '<td style="min-width: 50px" data-title="Code" data-value="{{Code}}">{{Code}}</td>',
            '<td style="min-width: 50px" data-title="StartTime" data-value="{{StartTime}}">{{StartTime}}</td>',
            '<td style="min-width: 50px" data-title="FinshTime" data-value="{{FinshTime}}">{{FinshTime}}</td>',
            '<td style="min-width: 50px" data-title="CreateName" data-value="{{CreateName}}">{{CreateName}}</td>',
            '<td style="min-width: 50px" data-title="WorkerName" data-value="{{WorkerName}}">{{WorkerName}}</td>',
            '<td style="min-width: 50px" data-title="WorkTime" data-value="{{WorkTime}}">{{WorkTime}}</td>',
            '<td style="min-width: 50px" data-title="Picture" data-value="{{Picture}}">{{Picture}}</td>',
            '<td style="min-width: 50px" data-title="Parameter" data-value="{{Parameter}}">{{Parameter}}</td>',
            '</tr>',
        ].join(''),

        OrderDetailTemp: [
            '<div class="DetailFirst" style="text-align: center;width: 300px;height: 120px;padding: 25px;display: inline-block;">',
            '<div class="contentTop">',
            '<div class="contentTopleft" style="width: 50px;display: inline-block;">',
            '<img src="{{PictureOne_src}}"  style="width: 50px;height: 50px;">',
            '</div>',
            '<div class="contentTopright" style="width: 150px;display: inline-block;">',
            '<div style="height: 3px;width: 150px;background-color: {{PictureOne_color}}">',
            '</div>',
            '</div>',
            '</div>',
            '<div class="content" style="margin-top: 5px;">',
            '<div class="contentleft" style="width: 102px;">',
            '<p>工单导入</p>',
            '<p>{{PictureOne_time}}</p>',
            '</div>',
            '</div>',
            '</div>',

            '<div class="Detail" style="text-align: center;width: 300px;height: 120px;padding: 25px;display: inline-block;margin-left: -100px;">',
            '<div class="contentTop">',
            '<div class="contentTopleft" style="width: 50px;display: inline-block;">',
            '<img src="{{PictureTwo_src}}"  style="width: 50px;height: 50px;">',
            '</div>',
            '<div class="contentTopright" style="width: 150px;display: inline-block;">',
            '<div style="height: 3px;width: 150px;background-color: {{PictureTwo_color}}">',
            '</div>',
            '</div>',
            '</div>',
            '<div class="content" style="margin-top: 5px;">',
            '<div class="contentleft" style="width: 102px;">',
            '<p>工单开工</p>',
            '<p>{{PictureTwo_time}}</p>',
            '</div>',
            '</div>',
            '</div>',

            '<div class="Detail" style="text-align: center;width: 300px;height: 120px;padding: 25px;display: inline-block;margin-left: -100px;display:{{DISPlay_confirm}}">',
            '<div class="contentTop">',
            '<div class="contentTopleft" style="width: 50px;display: inline-block;">',
            '<img src="{{PictureThree_src}}"  style="width: 50px;height: 50px;">',
            '</div>',
            '<div class="contentTopright" style="width: 150px;display: inline-block;">',
            '<div style="height: 3px;width: 150px;background-color: {{PictureThree_color}}">',
            '</div>',
            '</div>',
            '</div>',
            '<div class="content" style="margin-top: 5px;">',
            '<div class="contentleft" style="width: 102px;">',
            '<p>完工确认</p>',
            '<p>{{PictureThree_time}}</p>',
            '</div>',
            '</div>',
            '</div>',

            '<div class="Detail"  style="text-align: center;width: 300px;height: 120px;padding: 25px;display: inline-block;margin-left: -100px;display:{{DISPlay_upload}}">',
            '<div class="contentTop">',
            '<div class="contentTopleft" style="width: 50px;display: inline-block;">',
            '<img src="{{PictureFour_src}}" style="width: 50px;height: 50px;">',
            '</div>',
            '<div class="contentTopright" style="width: 150px;display: inline-block;">',
            '</div>',
            '</div>',
            '<div class="content" style="margin-top: 5px;">',
            '<div class="contentleft" style="width: 102px;">',
            ' <p>信息上传</p>',
            '<p>{{PictureFour_time}}</p>',
            '</div>',
            '</div>',
            '</div>',


            '<div class="Detail"  style="text-align: center;width: 300px;height: 120px;padding: 25px;display: inline-block;margin-left: -100px;display:{{DISPlay_stop}}">',
            '<div class="contentTop">',
            '<div class="contentTopleft" style="width: 50px;display: inline-block;">',
            '<img src="{{PictureFive_src}}" style="width: 50px;height: 50px;">',
            '</div>',
            '<div class="contentTopright" style="width: 150px;display: inline-block;">',
            '</div>',
            '</div>',
            '<div class="content" style="margin-top: 5px;">',
            '<div class="contentleft" style="width: 102px;">',
            ' <p>工单暂停</p>',
            '<p>{{PictureFive_time}}</p>',
            '</div>',
            '</div>',
            '</div>',

            '<div class="Detail"  style="text-align: center;width: 300px;height: 120px;padding: 25px;display: inline-block;margin-left: -100px;display:{{DISPlay_close}}">',
            '<div class="contentTop">',
            '<div class="contentTopleft" style="width: 50px;display: inline-block;">',
            '<img src="{{PictureSix_src}}" style="width: 50px;height: 50px;">',
            '</div>',
            '<div class="contentTopright" style="width: 150px;display: inline-block;">',
            '</div>',
            '</div>',
            '<div class="content" style="margin-top: 5px;">',
            '<div class="contentleft" style="width: 102px;">',
            ' <p>工单关闭</p>',
            '<p>{{PictureSix_time}}</p>',
            '</div>',
            '</div>',
            '</div>',
        ].join(''),
        BasicTemp: [
            '<div class="BasicTable" style="clear: both;">',
            '<div class="TempTable"><div class="FieldName"><span class="ContentshowName">路线号</span></div><div class="FieldContentTwo"><span class="Contentshow">{{Customer}}</span></div></div>',
            '<div class="TempTable"><div class="FieldName"><span class="ContentshowName">车号</span></div><div class="FieldContentTwo"><span class="Contentshow">{{PartNo}}</span></div></div>',
            '<div class="TempTable"><div class="FieldName"><span class="ContentshowName">作业名称</span></div><div class="FieldContentTwo"><span class="Contentshow">{{WorkName}}</span></div></div>',
            '<div class="TempTable"><div class="FieldName"><span class="ContentshowName">作业工位</span></div><div class="FieldContentTwo"><span class="Contentshow">{{StationName}}</span></div></div>',
            '<div class="TempTable"><div class="FieldName"><span class="ContentshowName">作业班组</span></div><div class="FieldContentTwo"><span class="Contentshow">{{TeamName}}</span></div></div>',
            '<div class="TempTable"><div class="FieldName"><span class="ContentshowName">作业人员</span></div><div class="FieldContentTwo"><span class="Contentshow">{{WorkerName}}</span></div></div>',
            '<div class="TempTable"><div class="FieldName"><span class="ContentshowName">计划员</span> </div><div class="FieldContentTwo"><span class="Contentshow">{{Auditor}}</span></div></div>',
            '</div>',
            '<div class="BasicTable" style="clear: both;">',
            '<div class="TempTable"><div class="FieldName"><span class="ContentshowName">下达时间</span></div><div class="FieldContentTwo"><span class="Contentshow">{{AuditTime}}</span></div></div>',
            '<div class="TempTable"><div class="FieldName"><span class="ContentshowName">开工时间</span> </div><div class="FieldContentTwo"><span class="Contentshow">{{RealStartDate}}</span></div></div>',
            '<div class="TempTable"><div class="FieldName"><span class="ContentshowName">完工时间</span></div><div class="FieldContentTwo"><span class="Contentshow">{{RealFinishDate}}</span></div></div>',
            '<div class="TempTable"><div class="FieldName"><span class="ContentshowName">信息上传时间</span></div><div class="FieldContentTwo"><span class="Contentshow">{{RealSendDate}}</span></div></div>',
            // '<div class="TempTable"><div class="FieldName"><span class="ContentshowName">作业时长</span></div><div class="FieldContentTwo"><span class="Contentshow">{{-}}</span></div></div>',
            // '<div class="TempTable"><div class="FieldName"><span class="ContentshowName">标准工时</span></div><div class="FieldContentTwo"><span class="Contentshow">{{-}}</span></div></div>',
            // '<div class="TempTable"><div class="FieldName"><span class="ContentshowName">确认时间</span></div><div class="FieldContentTwo"><span class="Contentshow">{{-}}</span></div></div>',
            '</div>',
        ].join(''),
    };

    (function () {
        KEYWORD_order_LIST = [
            'OrderNo|订单编号',
            'WBSNo|WBS编号',
            'PartNo|车号',
            'StationID|工位|ArrayOne',
            'TeamID|班组|ArrayOneControl',
            'WorkerIDList|班组成员|ArrayControl|TeamID',
            'CustomerID|客户(18号线)',
            'FactoryID|基地(万倾沙)',
            'PlanReceiveDate|计划进厂|Date',
            'RealReceiveDate|实际进厂|Date',
            'PlanFinishDate|预计完工|Date',
            'RealStartDate|实际开工|DateTime',
            'RealFinishDate|实际完工|DateTime',
            'RealSendDate|交车日期|Date',
            'Remark|备注',
            'Status|状态|ArrayOne',
            'CreateTime|时间|DateTime',
            'EditTime|时间|DateTime',
        ];


        KEYWORD_order = {};
        Formattrt_order = {};
        TypeSource_order = {
            StationID: [{
                name: '无',
                value: 0,
            }],
            TeamID: [{
                name: '无',
                value: 0,
                far: 0,
            }],
            WorkerIDList: [{
                name: '无',
                value: 0,
                far: 0,
            }],
            Status: [
                {
                    name: '无',
                    value: 0,
                }, {
                    name: '已保存',
                    value: 1,
                }, {
                    name: '已制定',
                    value: 2,
                }, {
                    name: '已下达',
                    value: 3,
                }, {
                    name: '已开工',
                    value: 4,
                },
                {
                    name: '已完工',
                    value: 5,
                }, {
                    name: '暂停中',
                    value: 6,
                }, {
                    name: '已入库',
                    value: 7,
                }, {
                    name: '已上传',
                    value: 8,
                }, {
                    name: '已关闭',
                    value: 9,
                }],
        };

        $.each(KEYWORD_order_LIST, function (i, item) {
            var detail = item.split('|');
            KEYWORD_order[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined,
            };
            if (detail.length > 2) {
                Formattrt_order[detail[0]] = $com.util.getFormatter(TypeSource_order, detail[0], detail[2]);
            }
        });
    })();

    model = $com.Model.create({
        name: '工单跟踪',

        type: $com.Model.MAIN, //主方法

        configure: function () {
            this.run();
        },

        events: function () {

            //工单修改
            $('body').delegate('.lmvt-resetPencil', 'click', function () {

                // var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-order-body"), "ID", Allorder);

                var $this = $(this),
                    wID = Number($this.attr('data-value'));

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('请先选择一行数据再试！');
                    return;
                }
                if (SelectData.length != 1) {
                    alert('只能同时对一行数据修改！');
                    return;
                }

                var default_value = {
                    OrderNo: SelectData[0].OrderNo,
                    PartNo: SelectData[0].PartNo,
                    StationID: SelectData[0].StationID,
                    TeamID: SelectData[0].TeamID,
                    WorkerIDList: SelectData[0].WorkerIDList,
                };
                $('body').append($com.modal.show(default_value, KEYWORD_order, '修改', function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].OrderNo = rst.OrderNo;
                    SelectData[0].PartNo = rst.PartNo;
                    SelectData[0].StationID = Number(rst.StationID);
                    SelectData[0].TeamID = Number(rst.TeamID);
                    SelectData[0].WorkerIDList = rst.WorkerIDList;
                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.postOMSOrder({
                        data: SelectData[0],
                    }, function (res) {
                        alert('修改成功！！');
                        model.com.refresh();
                    });

                }, TypeSource_order));
            });
            //工单删除
            $('body').delegate('.lmvt-delete', 'click', function () {
                // var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-order-body"), "ID", Allorder);

                var $this = $(this),
                    wID = Number($this.attr('data-value'));

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('至少选择一行数据再试！');
                    return;
                }
                if (SelectData.Status >= 3) {
                    alert('该状态下禁止删除');
                    return;
                }
                if (!confirm('已选择' + SelectData.length + '条数据，确定将其删除？')) {
                    return;
                }

                model.com.DeleteOMSOrder({
                    data: SelectData,
                }, function (res) {
                    alert('删除成功！！');
                    model.com.refresh();
                });
            });
            //工单状态
            $('body').delegate('.lmvt-Status', 'click', function () {
                var $this = $(this),
                    wID = Number($this.attr('data-value'));

                var SelectData = mData.filter((item) => {
                    return item.ID == wID;
                });

                if (!SelectData || !SelectData.length) {
                    alert('请先选择一行数据再试！');
                    return;
                }


                var default_value = {
                    Status: SelectData[0].Status,
                };
                $('body').append($com.modal.show(default_value, KEYWORD_order, '修改', function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;
                    SelectData[0].Status = Number(rst.Status);
                    $com.util.deleteLowerProperty(SelectData[0]);
                    model.com.postAudit({
                        data: SelectData,
                    }, function (res) {
                        alert('修改成功！！');
                        model.com.refresh();
                    });

                }, TypeSource_order));
            });
            //重置
            $('body').delegate('#lmvt-reset', 'click', function () {
                mZCommitStartTime = $com.util.format('yyyy-MM-dd', new Date().getTime() - 30 * 24 * 3600 * 1000);
                mZCommitEndTime = $com.util.format('yyyy-MM-dd', new Date().getTime() + 24 * 3600 * 1000);
                $('#lmvt-startTime-Send').val(`${mZCommitStartTime}`);
                $('#lmvt-endTime-Send').val(`${mZCommitEndTime}`);
                $('select.selectpicker').each(function () {
                    $(this).selectpicker('val', $(this).find('option:first').val()).selectpicker('refresh');    //重置bootstrap-select显示
                    $(this).find('option').attr('selected', false);                    //重置原生select的值
                    $(this).find('option:first').attr('selected', true);
                });
                $('#alfie-query-Code').val('');
                $('#alfie-query-Code').attr('data-value', 0);

                $('#alfie-query-WorkName').val('');
                $('#alfie-query-WorkName').attr('data-value', 0);

                mCode = '';
                mWorkName = '';
                mStatus = [];
                mStationID = -1;
            });
            //查询
            $('body').delegate('#lmvt-search', 'click', function () {
                //查询开始时间
                mZCommitStartTime = $('#lmvt-startTime-Send').val();
                //查询结束时间
                mZCommitEndTime = $('#lmvt-endTime-Send').val();
                mStatus = $('.search-content-Status').val();

                if (mStatus && mStatus.length > 0) {
                    mStatus = mStatus.join(',');
                } else {
                    mStatus = '';
                }
                mCode = $('#alfie-query-Code').val().trim();
                mWorkName = $('#alfie-query-WorkName').val().trim();

                mStationID = -1;

                for (var i = 0; i < mFMCStation.length; i++) {
                    if (mFMCStation[i].WorkName == mWorkName) {
                        mStationID = mFMCStation[i].ID;
                    }
                }

                if (mZCommitStartTime == '' || mZCommitEndTime == '') {
                    mZCommitStartTime = $com.util.format('yyyy-MM-dd', new Date().getTime() - 30 * 24 * 3600 * 1000);
                    mZCommitEndTime = $com.util.format('yyyy-MM-dd', new Date().getTime() + 24 * 3600 * 1000);
                }

                model.com.refresh();
            });
            $('#lmvt-startTime-Send').datetimepicker({
                forceParse: 0,//设置为0，时间不会跳转1899，会显示当前时间。
                language: 'zh-CN',//显示中文
                format: 'yyyy-mm-dd',//显示格式
                minView: 'month',//设置只显示到月份
                initialDate: new Date(),//初始化当前日期
                autoclose: true,//选中自动关闭
                todayBtn: true,//显示今日按钮
            }).on('changeDate', function (ev) {
                var startTime = $('#lmvt-startTime-Send').val();
                $('#lmvt-endTime-Send').datetimepicker('setStartDate', startTime);
            });
            $('#lmvt-endTime-Send').datetimepicker({
                forceParse: 0,//设置为0，时间不会跳转1899，会显示当前时间。
                language: 'zh-CN',//显示中文
                format: 'yyyy-mm-dd',//显示格式
                minView: 'month',//设置只显示到月份
                initialDate: new Date(),//初始化当前日期
                autoclose: true,//选中自动关闭
                todayBtn: true,//显示今日按钮
            }).on('changeDate', function (ev) {
                var endTime = $('#lmvt-endTime-Send').val();
                $('#lmvt-startTime-Send').datetimepicker('setEndDate', endTime.toString('yyyy-MM-dd'));
            });
            //查看详情
            $('body').delegate('.lmvt-resetDetail', 'click', function () {
                var $this = $(this),
                    wID = Number($this.attr('data-value'));
                var vdata = {
                    'header': '工单详情',
                    'href': './order_manage/OMSOrderInfo.html?wID=' + wID,
                    'id': 'OMSOrderInfo',
                    'src': './static/images/logpng/监控.png',
                };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger('OMSOrderInfo', {wID: wID});


                return false;
                var $this = $(this),
                    wID = Number($this.attr('data-value'));
                model.com.OMSOrderInfo({
                    ID: wID,
                }, function (res) {
                    OMSOrderInfo = res.info;
                    $('.OrderAll').hide();
                    $('.zacePencilDone').show();
                    $('.zacePencilDone-Import').hide();
                    $('.zacePencilDone-Export').hide();
                    $('.StausText').text(StausTextArray[OMSOrderInfo.Status]);
                    if (OMSOrderInfo.Status == 0 || OMSOrderInfo.Status == 1 || OMSOrderInfo.Status == 2 || OMSOrderInfo.Status == 3) {
                        //工单导入 //f4ea2a 黄色
                        OMSOrderInfo.PictureOne_src = '../static/images/checkbox/Time_bule.png';
                        OMSOrderInfo.PictureOne_color = '#1296db';
                        OMSOrderInfo.PictureOne_time = OMSOrderInfo.CreateTime;

                        OMSOrderInfo.PictureTwo_src = '../static/images/checkbox/Time_yellow.png';
                        OMSOrderInfo.PictureTwo_color = '#ddd';
                        OMSOrderInfo.PictureTwo_time = '-';

                        OMSOrderInfo.PictureThree_src = '../static/images/checkbox/Time_gray.png';
                        OMSOrderInfo.PictureThree_color = '#ddd';
                        OMSOrderInfo.PictureThree_time = '-';

                        OMSOrderInfo.PictureFour_src = '../static/images/checkbox/Time_gray.png';
                        OMSOrderInfo.PictureFour_time = '-';

                        OMSOrderInfo.DISPlay_confirm = 'show';
                        OMSOrderInfo.DISPlay_upload = 'show';
                        OMSOrderInfo.DISPlay_stop = 'none';
                        OMSOrderInfo.DISPlay_close = 'none';

                    } else if (OMSOrderInfo.Status == 4) {
                        //工单开工

                        OMSOrderInfo.PictureOne_src = '../static/images/checkbox/Time_bule.png';
                        OMSOrderInfo.PictureOne_color = '#1296db';
                        OMSOrderInfo.PictureOne_time = OMSOrderInfo.CreateTime;

                        OMSOrderInfo.PictureTwo_src = '../static/images/checkbox/Time_bule.png';
                        OMSOrderInfo.PictureTwo_color = '#1296db';
                        OMSOrderInfo.PictureTwo_time = OMSOrderInfo.RealStartDate;

                        OMSOrderInfo.PictureThree_src = '../static/images/checkbox/Time_yellow.png';
                        OMSOrderInfo.PictureThree_color = '#ddd';
                        OMSOrderInfo.PictureThree_time = '-';

                        OMSOrderInfo.PictureFour_src = '../static/images/checkbox/Time_gray.png';
                        OMSOrderInfo.PictureFour_time = '-';

                        OMSOrderInfo.DISPlay_confirm = 'show';
                        OMSOrderInfo.DISPlay_upload = 'show';
                        OMSOrderInfo.DISPlay_stop = 'none';
                        OMSOrderInfo.DISPlay_close = 'none';

                    } else if (OMSOrderInfo.Status == 5 || OMSOrderInfo.Status == 7) {
                        //完工汇报
                        OMSOrderInfo.PictureOne_src = '../static/images/checkbox/Time_bule.png';
                        OMSOrderInfo.PictureOne_color = '#1296db';
                        OMSOrderInfo.PictureOne_time = OMSOrderInfo.CreateTime;

                        OMSOrderInfo.PictureTwo_src = '../static/images/checkbox/Time_bule.png';
                        OMSOrderInfo.PictureTwo_color = '#1296db';
                        OMSOrderInfo.PictureTwo_time = OMSOrderInfo.RealStartDate;

                        OMSOrderInfo.PictureThree_src = '../static/images/checkbox/Time_bule.png';
                        OMSOrderInfo.PictureThree_color = '#1296db';
                        OMSOrderInfo.PictureThree_time = OMSOrderInfo.RealFinishDate;

                        OMSOrderInfo.PictureFour_src = '../static/images/checkbox/Time_yellow.png';
                        OMSOrderInfo.PictureFour_time = '-';

                        OMSOrderInfo.DISPlay_confirm = 'show';
                        OMSOrderInfo.DISPlay_upload = 'show';
                        OMSOrderInfo.DISPlay_stop = 'none';
                        OMSOrderInfo.DISPlay_close = 'none';
                    } else if (OMSOrderInfo.Status == 6) {
                        //暂停
                        OMSOrderInfo.PictureOne_src = '../static/images/checkbox/Time_bule.png';
                        OMSOrderInfo.PictureOne_color = '#1296db';
                        OMSOrderInfo.PictureOne_time = OMSOrderInfo.CreateTime;

                        OMSOrderInfo.PictureTwo_src = '../static/images/checkbox/Time_bule.png';
                        OMSOrderInfo.PictureTwo_color = '#1296db';
                        OMSOrderInfo.PictureTwo_time = OMSOrderInfo.RealStartDate;


                        OMSOrderInfo.PictureFive_src = '../static/images/checkbox/Time_red.png';
                        OMSOrderInfo.PictureFive_time = OMSOrderInfo.RealFinishDate;

                        OMSOrderInfo.DISPlay_confirm = 'none';
                        OMSOrderInfo.DISPlay_upload = 'none';
                        OMSOrderInfo.DISPlay_stop = 'show';
                        OMSOrderInfo.DISPlay_close = 'none';
                    } else if (OMSOrderInfo.Status == 8) {
                        //信息已上传
                        OMSOrderInfo.PictureOne_src = '../static/images/checkbox/Time_bule.png';
                        OMSOrderInfo.PictureOne_color = '#1296db';
                        OMSOrderInfo.PictureOne_time = OMSOrderInfo.CreateTime;

                        OMSOrderInfo.PictureTwo_src = '../static/images/checkbox/Time_bule.png';
                        OMSOrderInfo.PictureTwo_color = '#1296db';
                        OMSOrderInfo.PictureTwo_time = OMSOrderInfo.RealStartDate;

                        OMSOrderInfo.PictureThree_src = '../static/images/checkbox/Time_bule.png';
                        OMSOrderInfo.PictureThree_color = '#1296db';
                        OMSOrderInfo.PictureThree_time = OMSOrderInfo.RealFinishDate;

                        OMSOrderInfo.PictureFour_src = '../static/images/checkbox/Time_bule.png';
                        OMSOrderInfo.PictureFour_time = OMSOrderInfo.RealSendDate;

                        OMSOrderInfo.DISPlay_confirm = 'show';
                        OMSOrderInfo.DISPlay_upload = 'show';
                        OMSOrderInfo.DISPlay_stop = 'none';
                        OMSOrderInfo.DISPlay_close = 'none';
                    } else if (OMSOrderInfo.Status == 9) {
                        //已关闭
                        OMSOrderInfo.PictureOne_src = '../static/images/checkbox/Time_bule.png';
                        OMSOrderInfo.PictureOne_color = '#1296db';
                        OMSOrderInfo.PictureOne_time = OMSOrderInfo.CreateTime;

                        OMSOrderInfo.PictureTwo_src = '../static/images/checkbox/Time_bule.png';
                        OMSOrderInfo.PictureTwo_color = '#1296db';
                        OMSOrderInfo.PictureTwo_time = OMSOrderInfo.RealStartDate;

                        OMSOrderInfo.PictureSix_src = '../static/images/checkbox/Time_red.png';
                        OMSOrderInfo.PictureSix_time = OMSOrderInfo.RealFinishDate;

                        OMSOrderInfo.DISPlay_confirm = 'none';
                        OMSOrderInfo.DISPlay_upload = 'none';
                        OMSOrderInfo.DISPlay_stop = 'none';
                        OMSOrderInfo.DISPlay_close = 'show';
                    }
                    $('.OrderDetail').html($com.util.template(OMSOrderInfo, HTML.OrderDetailTemp));
                    $('.middlefqContentTableBasic').html($com.util.template(OMSOrderInfo, HTML.BasicTemp));

                    $(window).resize();
                });


            });
            $('body').delegate('#commit_cancel', 'click', function () {
                alert('接口暂未开通，敬请期待！');
                return false;
            });
            $('body').delegate('#commit_upload', 'click', function () {
                alert('接口暂未开通，敬请期待！');
                return false;
            });
            //返回主界面
            $('body').delegate('#zace-exportApproval-commitReturn', 'click', function () {
                $('.OrderAll').show();
                $('.zacePencilDone').hide();
                $('.zacePencilDone-Import').hide();
                $('.zacePencilDone-Export').hide();
                $(window).resize();
            });
            $(window).scroll(function () {
                $(window).resize();
            });

            //返回主界面
            $('body').delegate('#commit_back', 'click', function () {
                $('.OrderAll').show();
                $('.zacePencilDone').hide();
                $('.zacePencilDone-Import').hide();
                $('.zacePencilDone-Export').hide();
                $(window).resize();
            });

            //点击完成返回主界面
            $('body').delegate('#commit_finsh', 'click', function () {
                $('.OrderAll').show();
                $('.zacePencilDone').hide();
                $('.zacePencilDone-Import').hide();
                $('.zacePencilDone-Export').hide();
                $(window).resize();
            });

        },

        run: function () {
            $('#lmvt-startTime-Send').val(`${mZCommitStartTime}`);
            $('#lmvt-endTime-Send').val(`${mZCommitEndTime}`);
            // 开关
            $('.selectpicker').selectpicker({
                noneSelectedText: '请选择',//默认显示内容
                deselectAllText: '全不选',
                selectAllText: '全选',
            });
            $com.app.loading('数据加载中...');
            model.com.getUser({Active: 1}, function (resU) {
                wUser = resU.list;
                model.com.getFMCStation({
                    Active: 1,
                }, function (res) {
                    mFMCStation = res.list;
                    $.each(res.list, function (i, item) {
                        TypeSource_order.StationID.push({
                            name: item.Name,
                            value: item.ID,
                        });
                    });
                    model.com.getTeamManage({
                        Active: 1,
                    }, function (res) {
                        MateArray = [];
                        mTeamManage = res.list;
                        $.each(res.list, function (i, item) {
                            TypeSource_order.TeamID.push({
                                name: item.Name,
                                value: item.ID,
                            });
                            if (item.MateID.length > 0) {
                                for (var m = 0; m < item.MateID.length; m++) {
                                    for (var n = 0; n < wUser.length; n++) {
                                        if (item.MateID[m] == wUser[n].ID) {
                                            MateArray.push({
                                                ID: wUser[n].ID,
                                                Name: wUser[n].Name,
                                                TeamID: item.ID,
                                            });
                                        }
                                    }
                                }
                            }
                        });
                        $.each(MateArray, function (i, item) {
                            TypeSource_order.WorkerIDList.push({
                                name: item.Name,
                                value: item.ID,
                                far: item.TeamID,
                            });
                        });

                    });
                });
            });

            model.com.StatusCount({
                CommandID: -1,
                FactoryID: -1,
                WorkShopID: -1,
                LineID: -1,
                StatusList: [-1],
                StationID: -1,
                OrderNo: '',
                ProductID: -1,
                CustomerID: -1,
                TeamID: -1,
                PartNo: '',
                PreStartTime: '2000-1-1',
                PreEndTime: '2000-1-1',
                RelStartTime: '2000-1-1',
                RelEndTime: '2000-1-1',
            }, function (res) {
                StatusCount = res.list;

                OrderCount = {
                    AllOrderNum: 0,//所有订单
                    SurplusOrderNum: 0,//剩余订单
                    TobeexecutedNum: 0,//待执行
                    ExecutingNum: 0,//执行中
                    CalledoffNum: 0,//被叫停
                    FinishNum: 0,//已完成
                    BeoverdueNum: 0,//已逾期
                };
                var TobeexecutedNumAdd = 0;
                var FinishNumAdd = 0;
                var SurplusOrderNumAdd = 0;
                for (x in StatusCount) {
                    switch (Number(x)) {
                        case -1:
                            OrderCount.AllOrderNum = StatusCount[x];
                            break;
                        case 0:
                            SurplusOrderNumAdd = StatusCount[x] + SurplusOrderNumAdd;
                            OrderCount.SurplusOrderNum = SurplusOrderNumAdd;

                            TobeexecutedNumAdd = StatusCount[x] + TobeexecutedNumAdd;
                            OrderCount.TobeexecutedNum = TobeexecutedNumAdd;
                            break;
                        case 1:
                            SurplusOrderNumAdd = StatusCount[x] + SurplusOrderNumAdd;
                            OrderCount.SurplusOrderNum = SurplusOrderNumAdd;

                            TobeexecutedNumAdd = StatusCount[x] + TobeexecutedNumAdd;
                            OrderCount.TobeexecutedNum = TobeexecutedNumAdd;
                            break;
                        case 2:
                            SurplusOrderNumAdd = StatusCount[x] + SurplusOrderNumAdd;
                            OrderCount.SurplusOrderNum = SurplusOrderNumAdd;

                            TobeexecutedNumAdd = StatusCount[x] + TobeexecutedNumAdd;
                            OrderCount.TobeexecutedNum = TobeexecutedNumAdd;
                            break;
                        case 3:
                            SurplusOrderNumAdd = StatusCount[x] + SurplusOrderNumAdd;
                            OrderCount.SurplusOrderNum = SurplusOrderNumAdd;

                            TobeexecutedNumAdd = StatusCount[x] + TobeexecutedNumAdd;
                            OrderCount.TobeexecutedNum = TobeexecutedNumAdd;
                            break;
                        case 4:
                            SurplusOrderNumAdd = StatusCount[x] + SurplusOrderNumAdd;
                            OrderCount.SurplusOrderNum = SurplusOrderNumAdd;
                            OrderCount.ExecutingNum = StatusCount[x];
                            break;
                        case 6:
                            SurplusOrderNumAdd = StatusCount[x] + SurplusOrderNumAdd;
                            OrderCount.SurplusOrderNum = SurplusOrderNumAdd;
                            OrderCount.CalledoffNum = StatusCount[x];
                            break;
                        case 9:
                            OrderCount.CloseNum = StatusCount[x];
                            break;
                        case 5:
                            FinishNumAdd = StatusCount[x] + FinishNumAdd;
                            OrderCount.FinishNum = FinishNumAdd;
                            break;
                        case 7:
                            FinishNumAdd = StatusCount[x] + FinishNumAdd;
                            OrderCount.FinishNum = FinishNumAdd;
                            break;
                        case 8:
                            FinishNumAdd = StatusCount[x] + FinishNumAdd;
                            OrderCount.FinishNum = FinishNumAdd;
                            break;
                        case 10:
                            OrderCount.BeoverdueNum = StatusCount[x];
                            break;
                        default:
                            break;
                    }
                }

                $('.AllOrderNum').text(OrderCount.AllOrderNum);
                $('.TobeexecutedNum').text(OrderCount.TobeexecutedNum);
                $('.ExecutingNum').text(OrderCount.ExecutingNum);
                $('.CalledoffNum').text(OrderCount.CalledoffNum);
                $('.FinishNum').text(OrderCount.FinishNum);
                $('.BeoverdueNum').text(OrderCount.BeoverdueNum);
                $('.SurplusOrderNum').text(OrderCount.SurplusOrderNum);
            });

            model.com.refresh();
            $('#femi-parts-tbody-item').html($com.util.template(PartArray, HTML.TableNode_parts));

            $(window).resize();
        },

        com: {
            getFMCStation: function (data, fn, context) {
                var d = {
                    $URI: '/FMCStation/All',
                    $TYPE: 'Get',

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getTeamManage: function (data, fn, context) {
                var d = {
                    $URI: '/TeamManage/All',
                    $TYPE: 'Get',

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getUser: function (data, fn, context) {
                var d = {
                    $URI: '/User/All',
                    $TYPE: 'Get',

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // 数量
            StatusCount: function (data, fn, context) {
                var d = {
                    $URI: '/OMSOrder/StatusCount',
                    $TYPE: 'get',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //订单查单条
            OMSOrderInfo: function (data, fn, context) {
                var d = {
                    $URI: '/OMSOrder/Info',
                    $TYPE: 'get',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //导入检查
            postCheckList: function (data, fn, context) {
                var d = {
                    $URI: '/OMSOrder/CheckList',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //导入
            postImportExcel: function (data, fn, context) {
                var d = {
                    $URI: '/Upload/ImportExcel',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax_load(data ? $.extend(data, d) : $.extend(d, data), fn, err, context);
            },
            //导出
            postExportExcel: function (data, fn, context) {
                var d = {
                    $URI: '/Upload/ExportExcel',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //刷新界面
            refresh: function () {
                $com.app.loading('数据加载中...');
                // model.com.getOMSOrder({
                //     CommandID: -1, FactoryID: -1, WorkShopID: -1, LineID: -1, StatusList: mStatus, StationID: mStationID, OrderNo: mCode,
                //     ProductID: -1, CustomerID: -1, TeamID: -1, PartNo: "", PreStartTime: mZCommitStartTime,
                //     PreEndTime: mZCommitEndTime, RelStartTime: "2000-1-1", RelEndTime: "2000-1-1",
                // }, function (res) {
                //     if (res && res.list) {
                //         mData = $com.util.Clone(res.list);
                //         //数据源字段模板转换
                //         var wItem = $com.util.Clone(mData);
                //
                //         $.each(wItem, function (i, item) {
                //
                //             if (item.Active == 1) {
                //                 item.Switch = "switchTrue";
                //             } else {
                //                 item.Switch = "switchFalse";
                //             }
                //             for (var p in item) {
                //                 if (!Formattrt_order[p])
                //                     continue;
                //                 item[p] = Formattrt_order[p](item[p]);
                //             }
                //             item.WID = i + 1;
                //             if ($com.util.format("yyyy-MM-dd", item.PlanReceiveDate) < $com.util.format("yyyy-MM-dd", "2010-1-1")) {
                //                 item.PlanReceiveDate = "-";
                //             }
                //             if ($com.util.format("yyyy-MM-dd", item.RealReceiveDate) < $com.util.format("yyyy-MM-dd", "2010-1-1")) {
                //                 item.RealReceiveDate = "-";
                //             }
                //             if ($com.util.format("yyyy-MM-dd", item.PlanFinishDate) < $com.util.format("yyyy-MM-dd", "2010-1-1")) {
                //                 item.PlanFinishDate = "-";
                //             }
                //             if ($com.util.format("yyyy-MM-dd hh:mm:ss", item.RealStartDate) < $com.util.format("yyyy-MM-dd", "2010-1-1")) {
                //                 item.RealStartDate = "-";
                //             }
                //             if ($com.util.format("yyyy-MM-dd hh:mm:ss", item.RealFinishDate) < $com.util.format("yyyy-MM-dd", "2010-1-1")) {
                //                 item.RealFinishDate = "-";
                //             }
                //             if ($com.util.format("yyyy-MM-dd", item.RealSendDate) < $com.util.format("yyyy-MM-dd", "2010-1-1")) {
                //                 item.RealSendDate = "-";
                //             }
                //             if ($com.util.format("yyyy-MM-dd", item.AuditTime) < $com.util.format("yyyy-MM-dd", "2010-1-1")) {
                //                 item.AuditTime = "-";
                //             }
                //         });
                //         mCloneData = $com.util.Clone(wItem);
                //         // $("#femi-Device-tbody-item").html($com.util.template(wItem, HTML.TableNode_item));
                //         $page.init($("#femi-Device-tbody-item").closest("table"), wItem, "", function (res) {
                //             $("#femi-Device-tbody-item").html($com.util.template(res, HTML.TableNode_item));
                //         }, 10);
                //
                //         $(window).resize();
                //         $com.app.loaded();
                //     }
                // });
                $page.init($('#femi-Device-tbody-item').closest('table'), null, {
                    $URI: '/OMSOrder/All', 
                    $TYPE: 'Get',
                    PageCountProp: 'info',   //   服务器返回总页数的属性名称
                    DataListProp: 'list',    //  服务器返回数据列表的属性名称
                    CommandID: -1,
                    FactoryID: -1,
                    WorkShopID: -1,
                    LineID: -1,
                    StatusList: mStatus,
                    StationID: mStationID,
                    OrderNo: mCode,
                    ProductID: -1,
                    CustomerID: -1,
                    TeamID: -1,
                    PartNo: '',
                    PreStartTime: mZCommitStartTime,
                    PreEndTime: mZCommitEndTime,
                    RelStartTime: '2000-1-1',
                    RelEndTime: '2000-1-1',
                    PageSize: 10,
                }, function (res, wPageSize, wPageIndex) {
                    if (res.length > 0) {
                        mData = $com.util.Clone(res);
                        //数据源字段模板转换
                        var wItem = $com.util.Clone(mData);

                        $.each(wItem, function (i, item) {

                            if (item.Active == 1) {
                                item.Switch = 'switchTrue';
                            } else {
                                item.Switch = 'switchFalse';
                            }
                            for (var p in item) {
                                if (!Formattrt_order[p])
                                    continue;
                                item[p] = Formattrt_order[p](item[p]);
                            }
                            item.WID = i + 1;
                            if ($com.util.format('yyyy-MM-dd', item.PlanReceiveDate) < $com.util.format('yyyy-MM-dd', '2010-1-1')) {
                                item.PlanReceiveDate = '-';
                            }
                            if ($com.util.format('yyyy-MM-dd', item.RealReceiveDate) < $com.util.format('yyyy-MM-dd', '2010-1-1')) {
                                item.RealReceiveDate = '-';
                            }
                            if ($com.util.format('yyyy-MM-dd', item.PlanFinishDate) < $com.util.format('yyyy-MM-dd', '2010-1-1')) {
                                item.PlanFinishDate = '-';
                            }
                            if ($com.util.format('yyyy-MM-dd hh:mm:ss', item.RealStartDate) < $com.util.format('yyyy-MM-dd', '2010-1-1')) {
                                item.RealStartDate = '-';
                            }
                            if ($com.util.format('yyyy-MM-dd hh:mm:ss', item.RealFinishDate) < $com.util.format('yyyy-MM-dd', '2010-1-1')) {
                                item.RealFinishDate = '-';
                            }
                            if ($com.util.format('yyyy-MM-dd', item.RealSendDate) < $com.util.format('yyyy-MM-dd', '2010-1-1')) {
                                item.RealSendDate = '-';
                            }
                            if ($com.util.format('yyyy-MM-dd', item.AuditTime) < $com.util.format('yyyy-MM-dd', '2010-1-1')) {
                                item.AuditTime = '-';
                            }
                        });
                        mCloneData = $com.util.Clone(wItem);
                        $('#femi-Device-tbody-item').html($com.util.template(wItem, HTML.TableNode_item));

                    } else {
                        $('#femi-Device-tbody-item').html($com.util.template([], HTML.TableNode_item));
                    }
                    $(window).resize();
                    $com.app.loaded();
                });
            },
            arryOnea: function (data) {
                var temp = {};
                var arr = [];
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    if (!temp[data[i].value]) {
                        temp[data[i].value] = 'abc';
                        arr.push(data[i]);
                    }
                }
                return arr;
            },
            //获取工单列表

            getOMSOrder: function (data, fn, context) {
                var d = {
                    $URI: '/OMSOrder/All',
                    $TYPE: 'get',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //一起提交
            OMSOrderUpdateList: function (data, fn, context) {
                var d = {
                    $URI: '/OMSOrder/UpdateList',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //新增修改工单
            postOMSOrder: function (data, fn, context) {
                var d = {
                    $URI: '/OMSOrder/Update',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //修改工单
            postAudit: function (data, fn, context) {
                var d = {
                    $URI: '/OMSOrder/Audit',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除工单
            DeleteOMSOrder: function (data, fn, context) {
                var d = {
                    $URI: '/OMSOrder/Delete',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            ActiveAudit: function (data, fn, context) {
                var d = {
                    $URI: '/OMSOrder/Audit',
                    $TYPE: 'post',
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        },
    }),
        model.init();
});
