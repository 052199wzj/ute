require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/paging', '../static/utils/js/base/base', '../static/utils/js/cross2.js', '../static/utils/js/charf.js', '../static/utils/js/pickPeopleWeb', '../static/utils/js/pickDate', '../static/utils/js/jquery.easyDrag'
], function ($lin,$page, $com, $cross, $charf, $pick, $pickDate) {
    // window.parent.User_Info
    var KEYWORD_Level_LIST,
        KEYWORD_Level,
        FORMATTRT_Level,
        DEFAULT_VALUE_Level,
        TypeSource_Level,
        HTML;
    var wDataUnDone = [];
    var wData = [];
    var DeviceListClone = [];
    var mNameList = [];
    var wDataDone = [];
    var wMode = 1;
    var mUser = {};
    var mTime = {
        forceParse: 0,//设置为0，时间不会跳转1899，会显示当前时间。
        language: 'zh-CN',//显示中文
        format: 'yyyy-mm-dd',//显示格式
        minView: 2,//设置只显示到月份
        initialDate: new Date(),//初始化当前日期
        autoclose: true,//选中自动关闭
        todayBtn: true,//显示今日按钮
    };
    var mPreserveData = {}//详情页设备数据
    var mRepairsImageList = [];
    var mReconditionImageList = [];
    StatusArray = ["默认", "已报修", "已检修"];
    AlarmLevelArray = ["默认", "A级", "B级", "C级", "D级"];
    AlarmTypeArray = ["默认", "状态", "报警", "参数"];
    HTML = {
        SelectLI: [
            '<li>',
            '<label style="width: 100%;border-bottom: 1px solid gainsboro;padding: 10px 0px 10px 0px;" class="Label" data-id={{ID}}>',
            '<div class="clearfix SelectDIV" style="width: 95%;margin-left: 10px;display: inline-block;vertical-align: middle;" data-value={{ID}}>',
            '<img src="../static/images/checkbox/uncheck.png" style="width:25px;height:25px;float: left;" class="uncheck">',
            '<img src="../static/images/checkbox/checked.png" style="width:25px;height:25px;display: none;float: left;" class="checked">',
            '<span style="margin-left: 10px;float: left;font-size: 16px;">{{NameText}}</span>',
            '</div>',
            '</label>',
            '</li>',
        ].join(""),
        IMG: '<li class="upload-img"><img src="{{Src}}" data-id="{{Id}}" data-source="{{Src}}" class="image-show"> <span data-src="{{Src}}" class="glyphicon glyphicon-remove remove-image"></span></li>',
        IMGrepairs: '<li class="upload-img"><img src="{{Src}}" data-id="{{Id}}" data-source="{{Src}}" class="image-show"> <span data-src="{{Src}}" class="glyphicon glyphicon-remove remove-image fxy-img-repairs"></span></li>',
        Photo: [
            '<div class="lmvt-show-photo" style="position: fixed;z-index: 2001;top: 0;right: 0;left: 0;bottom: 0;background: rgba(0, 0, 0, 0.5);text-align: center">',
            '<svg t="1562913698052" class="lmvt-remove-photo" style="position:absolute;top:10;right:10" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2620" width="50" height="50"><path d="M684.642617 277.598412l-1.436722-1.467421c-12.489452-12.461823-32.730449-12.461823-45.159526 0L479.700991 434.510138l-158.286026-158.315702c-12.555967-12.524245-32.793894-12.524245-45.225017 0-12.555967 12.462846-12.555967 32.701796 0 45.223994l158.348448 158.317749L276.129573 638.049834c-12.495592 12.429077-12.495592 32.671097 0 45.163619l1.49812 1.434675c12.429077 12.494569 32.66905 12.494569 45.221948 0l158.287049-158.286026 158.283979 158.286026c12.491499 12.494569 32.731472 12.494569 45.220924 0 12.495592-12.493545 12.495592-32.731472 0-45.222971l-158.285003-158.285003 158.285003-158.314679C697.138209 310.299185 697.138209 290.060235 684.642617 277.598412" p-id="2621" fill="#e6e6e6"></path><path d="M818.88197 140.522454c-187.332573-187.363272-491.033479-187.363272-678.364005 0-187.329503 187.329503-187.329503 491.032456 0 678.362982 187.330526 187.392948 491.031433 187.392948 678.364005 0C1006.274918 631.55491 1006.274918 327.851956 818.88197 140.522454M773.656953 773.660418c-162.344458 162.343435-425.569512 162.407903-587.914994 0-162.40688-162.344458-162.40688-425.602258 0-587.914994 162.344458-162.40688 425.569512-162.40688 587.914994 0C936.063833 348.059184 936.000388 611.31596 773.656953 773.660418" p-id="2622" fill="#e6e6e6"></path></svg>',
            '<div data-index="0" class="lmvt-change-photo" style="position: fixed;top: 60px;right: 60px;left: 60px;bottom: 60px;background-size:100% 100%;width: auto;height: auto;">',
            // '<img class="zacelmvt-img" style="position: fixed;top: 60px;right: 60px;left: 60px;bottom: 60px;background-size:auto 100%;width: auto;height: auto;" />',
            '</div>',
            '<div class="lmvt-bottom">',
            '<div class="lmvt-bottom-left">',
            '<svg t="1562913570901" class="icon" style="float:left;margin-left:10px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1103" width="30" height="30">',
            '<path d="M512 0a512 512 0 1 0 512 512 512 512 0 0 0-512-512z m0 896a384 384 0 1 1 384-384 384 384 0 0 1-384 384z" fill="#e6e6e6" p-id="1104"></path>',
            '<path d="M493.44 247.04a64 64 0 0 0-90.88 90.88L576 512l-173.44 174.08a64 64 0 0 0 90.88 90.88l219.52-219.52a64 64 0 0 0 0-90.88z" fill="#e6e6e6" p-id="1105"></path></svg>',
            '</div>',
            '<div class="lmvt-bottom-right">',
            '<svg t="1562912869524" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ',
            ' p-id="1469" width="30" style="float:right;margin-right:10px" height="30"><path d="M512 0a512 512 0 1 0 512 512 512 512 0 0 0-512-512z m0 896a384 384 0 1 1 384-384 384 384 0 0 1-384 384z" ',
            ' fill="#e6e6e6" p-id="1470"></path><path d="M616.96 272.64a58.24 58.24 0 0 0-81.92 0l-198.4 198.4a58.88 58.88 0 0 0 0 81.92l198.4 198.4a58.24 58.24 0 1 0 81.92-81.92L459.52 512l157.44-157.44a58.24 58.24 0 0 0 0-81.92z" fill="#e6e6e6" p-id="1471"></path></svg>',
            '</div>',
            '</div>',
            '</div>',
        ].join(""),
        IMGLIST: '<img src= "{{SrcList}}" data-source="{{SrcList}}" style="width:25px;height:25px;"/>',
        TableModeCommit: [
            '<tr>',
            '<td  style="min-width: 50px;display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="DeviceNo" data-value="{{DeviceNo}}" >{{DeviceNo}}</td>',
            '<td data-title="DeviceName" data-value="{{DeviceName}}" >{{DeviceName}}</td>',
            '<td data-title="AlarmType" data-value="{{AlarmType}}" >{{AlarmTypeText}}</td>',
            '<td data-title="AlarmCode" data-value="{{AlarmCode}}" >{{AlarmCode}}</td>',
            '<td data-title="AlarmName" data-value="{{AlarmName}}" >{{AlarmName}}</td>',
            '<td data-title="AlarmRemark" data-value="{{AlarmRemark}}" >{{AlarmRemark}}</td>',
            '<td data-title="AlarmLevel" data-value="{{AlarmLevel}}" >{{AlarmLevelText}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td data-title="Repairer" data-value="{{Repairer}}" >{{Repairer}}</td>',
            '<td data-title="RepairTime" data-value="{{RepairTime}}" >{{RepairTime}}</td>',
            '<td data-title="RepairRemark" data-value="{{RepairRemark}}" >{{RepairRemark}}</td>',
            '<td data-title="RepairStartTime" data-value="{{RepairStartTime}}" >{{RepairStartTime}}</td>',
            '<td data-title="RepairEndTime" data-value="{{RepairEndTime}}" >{{RepairEndTime}}</td>',
            '<td data-title="StatusText" data-value="{{StatusText}}" >{{StatusText}}</td>',
            '<td style="max-width: 80px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-6 lmvt-do-info lmvt-Repairs-particulars"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span>详情</div>',
            '<div class="col-md-6 lmvt-do-info lmvt-delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>删除</div>',
            '</div></td>',
            '</tr>',
        ].join(""),
        TableModeCommitDetail: [
            '<tr>',
            '<td  style="min-width: 50px;display:none" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="min-width: 50px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
            '<td data-title="DeviceNo" data-value="{{DeviceNo}}" >{{DeviceNo}}</td>',
            '<td data-title="DeviceName" data-value="{{DeviceName}}" >{{DeviceName}}</td>',
            '<td data-title="AlarmType" data-value="{{AlarmType}}" >{{AlarmTypeText}}</td>',
            '<td data-title="AlarmCode" data-value="{{AlarmCode}}" >{{AlarmCode}}</td>',
            '<td data-title="AlarmName" data-value="{{AlarmName}}" >{{AlarmName}}</td>',
            '<td data-title="AlarmRemark" data-value="{{AlarmRemark}}" >{{AlarmRemark}}</td>',
            '<td data-title="AlarmLevel" data-value="{{AlarmLevel}}" >{{AlarmLevelText}}</td>',
            '<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',
            '<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
            '<td data-title="Repairer" data-value="{{Repairer}}" >{{Repairer}}</td>',
            '<td data-title="RepairTime" data-value="{{RepairTime}}" >{{RepairTime}}</td>',
            '<td data-title="RepairRemark" data-value="{{RepairRemark}}" >{{RepairRemark}}</td>',
            '<td data-title="RepairStartTime" data-value="{{RepairStartTime}}" >{{RepairStartTime}}</td>',
            '<td data-title="RepairEndTime" data-value="{{RepairEndTime}}" >{{RepairEndTime}}</td>',
            '<td data-title="StatusText" data-value="{{StatusText}}" >{{StatusText}}</td>',
            '<td style="max-width: 130px" data-title="Handle" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-6 lmvt-do-info lmvt-recondition"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span>检修</div>',
            // '<div class="col-md-4 lmvt-do-info lmvt-resetPencil"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>编辑</div>',
            '<div class="col-md-6 lmvt-do-info lmvt-particulars"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span>详情</div>',
            '</div></td>',
            '</tr>',
        ].join(""),
        //检修详情
        TableModeParticulars:[
            '<div class="fxy-repairs ">' +
            '<div class="fxy-head" style="width: 960px"> 报修信息 </div>' +
            '<div class="fxy-message">' +
            '<div><span class="parameter-name fxy-br-b-none">报修类型</span><span class="fxy-value  fxy-br-b-none fxy-br-r-none">{{AlarmTypeText}}</span></div>' +
            '<div><span class="parameter-name fxy-br-b-none">异常编码</span><span class="fxy-value fxy-br-b-none fxy-br-r-none">{{AlarmCode}}</span></div>' +
            '<div><span class="parameter-name  fxy-br-b-none">报修名称</span><span class="fxy-value  fxy-br-b-none">{{AlarmName}}</span></div>' +
            '<div><span class="parameter-name">检修等級</span><span class="fxy-value  fxy-br-r-none">{{AlarmLevelText}}</span></div>' +
            '<div><span class="parameter-name">报修人</span> <span class="fxy-value  fxy-br-r-none">{{Creator}}</span></div>' +
            '<div><span class="parameter-name">报修时间</span><span class="fxy-value">{{CreateTime}}</span></div>' +
            '<div  class="fxy-Remark"><span class="parameter-name  fxy-br-t-none  fxy-br-b-none">报修备注</span><span class="fxy-value  fxy-br-t-none  fxy-br-b-none" style="word-wrap:break-word;text-align: left; display: inline-block;padding: 12px 12px 0 12px;">{{AlarmRemark}}</span></div>' +
            '<div  class="last-image"><span class="parameter-name">报修图片</span><span class="fxy-value ImageItem">{{ImageItem}}</span></div>' +
            '</div>' +
            '</div>' +
            '<div class="fxy-recondition">' +
            '<div class="fxy-head" style="width: 960px"> 检修信息 </div>' +
            '<div class="fxy-message">' +
            '<div ><span class="parameter-name fxy-br-b-none">检修人</span><span class="fxy-value fxy-br-b-none fxy-br-r-none">{{Repairer}}</span></div>' +
            '<div><span class="parameter-name  fxy-br-b-none">开始时间</span><span class="fxy-value  fxy-br-b-none  fxy-br-r-none">{{RepairStartTime}}</span></div>' +
            '<div><span class="parameter-name  fxy-br-b-none">结束时间</span><span class="fxy-value  fxy-br-b-none">{{RepairEndTime}}</span></div>' +
            '<div class="fxy-Remark " style="width: 960px"><span class="parameter-name  fxy-br-b-none">检修备注</span><span class="fxy-value  fxy-br-b-none" style="word-wrap:break-word; text-align: left;display: inline-block;padding: 12px 12px 0 12px;">{{RepairRemark}}</span></div>' +
            '<div class="last-image"><span class="parameter-name">检修图片</span><span class="fxy-value ImageItem">{{ImageItemRepair}}</span></div>' +
            '</div>'+
            '</div>'+
            '<div class="fxy-redact-module">' +
            '<div class="fxy-head" style="width:  960px; padding-top: 0;margin-bottom: 0"> 编辑 </div>' +
            '<div class="fxy-message">' +
            '<div class="overflow-none"><span class="parameter-name fxy-br-b-none">检修人</span><span class="fxy-value fxy-maintenance-men fxy-br-b-none fxy-br-r-none"><select style="width: 100px;" class="selectpicker show-tick search-content-Status" data-actions-box="true" data-live-search="true" id="fxy-maintenance-men" multiple data-size="3"></select></span></div>' +
            '<div><span class="parameter-name fxy-br-b-none">开始时间</span><span class="fxy-value fxy-br-b-none fxy-br-r-none"><input type="text" name="StartingTime" value="" placeholder="查询年月" class="form-control date fill"></span></div>' +
            '<div><span class="parameter-name fxy-br-b-none">结束时间</span><span class="fxy-value fxy-br-b-none"><input type="text" name="EndTime" value="" placeholder="查询年月" class="form-control date fill"></span></div>' +
            '<div class="fxy-Remark"><span class="parameter-name fxy-br-b-none" >检修备注</span><span class="fxy-value fxy-br-b-none"><textarea rows="3" class="fill"  id="fxy-remark"  placeholder="请输入" /></span></div>' +
            '<div class="last-image" style="width: 100%"><span class="parameter-name">检修图片</span><span class="fxy-value RepairImageList" ></span></div>' +
            '</div>'+
            '</div>'
        ].join(""),
        //报修详情
        TableModeParticularsRepairs:[
            '<div class="fxy-repairs ">' +
            '<div class="fxy-head" style="width: 960px"> 报修信息 </div>' +
            '<div class="fxy-message">' +
            '<div><span class="parameter-name fxy-br-b-none">报修类型</span><span class="fxy-value  fxy-br-b-none fxy-br-r-none">{{AlarmTypeText}}</span></div>' +
            '<div><span class="parameter-name fxy-br-b-none">异常编码</span><span class="fxy-value fxy-br-b-none fxy-br-r-none">{{AlarmCode}}</span></div>' +
            '<div><span class="parameter-name  fxy-br-b-none">报修名称</span><span class="fxy-value  fxy-br-b-none">{{AlarmName}}</span></div>' +
            '<div><span class="parameter-name">检修等級</span><span class="fxy-value  fxy-br-r-none">{{AlarmLevelText}}</span></div>' +
            '<div><span class="parameter-name">报修人</span> <span class="fxy-value  fxy-br-r-none">{{Creator}}</span></div>' +
            '<div><span class="parameter-name">报修时间</span><span class="fxy-value">{{CreateTime}}</span></div>' +
            '<div  class="fxy-Remark"><span class="parameter-name  fxy-br-t-none  fxy-br-b-none">报修备注</span><span class="fxy-value  fxy-br-t-none  fxy-br-b-none" style="word-wrap:break-word;text-align: left; display: inline-block;padding: 12px 12px 0 12px;">{{AlarmRemark}}</span></div>' +
            '<div  class="last-image"><span class="parameter-name">报修图片</span><span class="fxy-value ImageItem">{{ImageItem}}</span></div>' +
            '</div>' +
            '</div>' +
            '<div class="fxy-recondition">' +
            '<div class="fxy-head" style="width: 960px"> 检修信息 </div>' +
            '<div class="fxy-message">' +
            '<div ><span class="parameter-name fxy-br-b-none">检修人</span><span class="fxy-value fxy-br-b-none fxy-br-r-none">{{Repairer}}</span></div>' +
            '<div><span class="parameter-name  fxy-br-b-none">开始时间</span><span class="fxy-value  fxy-br-b-none  fxy-br-r-none">{{RepairStartTime}}</span></div>' +
            '<div><span class="parameter-name  fxy-br-b-none">结束时间</span><span class="fxy-value  fxy-br-b-none">{{RepairEndTime}}</span></div>' +
            '<div class="fxy-Remark " style="width: 960px"><span class="parameter-name  fxy-br-b-none">检修备注</span><span class="fxy-value  fxy-br-b-none" style="word-wrap:break-word; text-align: left;display: inline-block;padding: 12px 12px 0 12px;">{{RepairRemark}}</span></div>' +
            '<div class="last-image"><span class="parameter-name">检修图片</span><span class="fxy-value ImageItem">{{ImageItemRepair}}</span></div>' +
            '</div>'+
            '</div>'+
            '<div class="fxy-redact-module">' +
            '<div class="fxy-head" style="width:  960px; padding-top: 0;margin-bottom: 0"> 编辑 </div>' +
            '<div class="fxy-message">' +
            '<div><span class="parameter-name">异常编码</span><span class="fxy-value  fxy-br-r-none"><select class="selectpicker selectpicke-repairs AlarmCode" data-live-search="true"  data-size="3" ></select></span></div>'+
            '<div><span class="parameter-name">检修等级</span><span class="fxy-value  fxy-br-r-none"><select class="selectpicker selectpicke-repairs AlarmLevel" data-live-search="true" data-size="3" ></select></span></div>'+
            '<div><span class="parameter-name ">报修类型</span><span class="fxy-value"><select class="selectpicker selectpicke-repairs AlarmType" data-live-search="true" data-size="3" ></select></span></div>'+
            '<div style="width: 960px"><span class="parameter-name  fxy-br-t-none fxy-br-b-none">报修名称</span><span class="fxy-value  fxy-br-b-none  fxy-br-t-none"><input  class="fill fxy-AlarmName" type="text" value="{{AlarmName}}"></span></div>' +
            '<div  class="fxy-Remark "><span class="parameter-name  fxy-br-b-none">报修备注</span><span class="fxy-value  fxy-br-b-none"><textarea  rows="3" class="fill" placeholder="请输入" id="fxy-AlarmRemark" /></span></div>'+
            '<div  class="last-image"><span class="parameter-name">报修图片</span><span class="fxy-value AlarmImageList" style="justify-content: left"></span></div>' +
            '</div>'+

            '</div>'
        ].join(""),
        //检修人选择项
        MaintenanceName: [
            '<option value="{{value}}" data-value = {{value}} >{{name}}</option>'
        ].join(""),
        ReadOnlyTableModeParticulars:[
            '<div class="fxy-repairs ">' +
            '<div class="fxy-head" style="width: 960px"> 报修信息 </div>' +
            '<div class="fxy-message">' +
            '<div><span class="parameter-name fxy-br-b-none">报修类型</span><span class="fxy-value  fxy-br-b-none fxy-br-r-none">{{AlarmTypeText}}</span></div>' +
            '<div><span class="parameter-name fxy-br-b-none">异常编码</span><span class="fxy-value fxy-br-b-none fxy-br-r-none">{{AlarmCode}}</span></div>' +
            '<div><span class="parameter-name  fxy-br-b-none">报修名称</span><span class="fxy-value  fxy-br-b-none">{{AlarmName}}</span></div>' +
            '<div><span class="parameter-name">检修等級</span><span class="fxy-value  fxy-br-r-none">{{AlarmLevelText}}</span></div>' +
            '<div><span class="parameter-name">报修人</span> <span class="fxy-value  fxy-br-r-none">{{Creator}}</span></div>' +
            '<div><span class="parameter-name">报修时间</span><span class="fxy-value">{{CreateTime}}</span></div>' +
            '<div  class="fxy-Remark"><span class="parameter-name  fxy-br-t-none  fxy-br-b-none">报修备注</span><span class="fxy-value  fxy-br-t-none  fxy-br-b-none" style="word-wrap:break-word;text-align: left; display: inline-block;padding: 12px 12px 0 12px;">{{AlarmRemark}}</span></div>' +
            '<div  class="last-image"><span class="parameter-name">报修图片</span><span class="fxy-value ImageItem">{{ImageItem}}</span></div>' +
            '</div>' +
            '</div>' +
            '<div class="fxy-recondition">' +
            '<div class="fxy-head" style="width: 960px"> 检修信息 </div>' +
            '<div class="fxy-message">' +
            '<div ><span class="parameter-name fxy-br-b-none">检修人</span><span class="fxy-value fxy-br-b-none fxy-br-r-none">{{Repairer}}</span></div>' +
            '<div><span class="parameter-name  fxy-br-b-none">开始时间</span><span class="fxy-value  fxy-br-b-none  fxy-br-r-none">{{RepairStartTime}}</span></div>' +
            '<div><span class="parameter-name  fxy-br-b-none">结束时间</span><span class="fxy-value  fxy-br-b-none">{{RepairEndTime}}</span></div>' +
            '<div class="fxy-Remark " style="width: 960px"><span class="parameter-name  fxy-br-b-none">检修备注</span><span class="fxy-value  fxy-br-b-none" style="word-wrap:break-word; text-align: left;display: inline-block;padding: 12px 12px 0 12px;">{{RepairRemark}}</span></div>' +
            '<div class="last-image"><span class="parameter-name">检修图片</span><span class="fxy-value ImageItem">{{ImageItemRepair}}</span></div>' +
            '</div>'+
            '</div>'
        ].join(""),
    };

    (function () {
        KEYWORD_Level_LIST = [
            "DeviceID|设备*|ArrayOne",
            "AlarmCode|报警编码",
            "AlarmName|报警名称*",
            "AlarmRemark|报警备注",
            "AlarmImageList|报警图片|FileArray",
            "AlarmLevel|报警等级*|ArrayOne",
            "AlarmType|报警类型|ArrayOne",
            "RepairerIDList|检修人*|Array",
            "RepairRemark|检修备注",
            "RepairImageList|检修图片|FileArray",
            "RepairStartTime|检修开始时间|DateTime",
            "RepairEndTime|检修结束时间|DateTime",
        ];
        KEYWORD_Level = {};
        FORMATTRT_Level = {};

        DEFAULT_VALUE_Level = {};

        TypeSource_Level = {
            DeviceID: [{
                name: "无",
                value: 0,
            }],
            RepairerIDList: [],
            AlarmLevel: [{
                name: "A级",
                value: 1,
            }, {
                name: "B级",
                value: 2,
            }, {
                name: "C级",
                value: 3,
            }, {
                name: "D级",
                value: 4,
            }],
            AlarmType: [{
                name: "无",
                value: 0,
            }, {
                name: "状态",
                value: 1,
            }, {
                name: "报警",
                value: 2,
            }, {
                name: "参数",
                value: 3,
            }]
        };

        $.each(KEYWORD_Level_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD_Level[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT_Level[detail[0]] = $com.util.getFormatter(TypeSource_Level, detail[0], detail[2]);
            }
        });
    })();
    model = $com.Model.create({
        name: ' 设备报检修',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {
            //报修
            $("body").delegate("#zace-AddRepair", "click", function () {

                //将Json数据中的数据值改成对应默认值，然后传入进去
                DEFAULT_VALUE_Level = {
                    ID: 0,
                    DeviceID: 0,
                    AlarmCode: "",
                    AlarmName: "",
                    AlarmRemark: "",
                    AlarmImageList: 0,
                    AlarmLevel: 0,
                    AlarmType: 0,
                };
                $(".femi-modal-body .femi-modal-item  input[data-name=AlarmCode]").attr("data-toggle", "modal");
                $(".femi-modal-body .femi-modal-item  input[data-name=AlarmCode]").attr("data-target", "#myModalSelectDate");
                $("body").append($com.modal.show(DEFAULT_VALUE_Level, KEYWORD_Level, "新增报修", function (rst) {
                    //调用插入函数然后用load刷新数据源

                    if (!rst || $.isEmptyObject(rst))
                        return false;
                    var _data = {
                        ID: 0,
                        DeviceID: rst.DeviceID,
                        AlarmCode: rst.AlarmCode,
                        AlarmName: rst.AlarmName,
                        AlarmRemark: rst.AlarmRemark,
                        AlarmImageList: rst.AlarmImageList,
                        AlarmLevel: rst.AlarmLevel,
                        AlarmType: rst.AlarmType,
                        Status: 1,
                    };

                    $com.util.deleteLowerProperty(_data);
                    model.com.UpdateDMSDeviceRepair({
                        data: _data
                    }, function (res) {
                        alert("新增成功！！");
                        model.com.refreshUnDone(mZCommitStartTime, mZCommitEndTime);
                    });
                }, TypeSource_Level));
            });
            //报修修改
            $("body").delegate(".lmvt-resetPencilUnDone", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = wDataUnDone.filter((item) => {
                    return item.ID == wID
                });

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData[0].Status != 1) {
                    alert("检修中无法修改！")
                    return;
                }

                var default_value = {
                    DeviceID: SelectData[0].DeviceID,
                    AlarmCode: SelectData[0].AlarmCode,
                    AlarmName: SelectData[0].AlarmName,
                    AlarmRemark: SelectData[0].AlarmRemark,
                    AlarmImageList: SelectData[0].AlarmImageList,
                    AlarmLevel: SelectData[0].AlarmLevel,
                    AlarmType: SelectData[0].AlarmType,
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "报修修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    SelectData[0].DeviceID = rst.DeviceID;
                    SelectData[0].AlarmCode = rst.AlarmCode;
                    SelectData[0].AlarmName = rst.AlarmName;
                    SelectData[0].AlarmRemark = rst.AlarmRemark;
                    SelectData[0].AlarmImageList = rst.AlarmImageList;
                    SelectData[0].AlarmLevel = rst.AlarmLevel;
                    SelectData[0].AlarmType = rst.AlarmType;
                    model.com.UpdateDMSDeviceRepair({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功！！");
                        model.com.refreshUnDone(mZCommitStartTime, mZCommitEndTime);
                    });

                }, TypeSource_Level));
            });
            //报修删除
            $("body").delegate(".lmvt-delete", "click", function () {
                // var SelectData = $com.table.getSelectionData($(".l-containe-canvas-table .l-department-body"), "ID", AllDepartment);
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = wDataUnDone.filter((item) => {
                    return item.ID == wID
                });

                if (!SelectData || !SelectData.length) {
                    alert("至少选择一行数据再试！")
                    return;
                }
                if (SelectData[0].Status == 2) {
                    alert("数据检修中无法删除")
                    return;
                }
                if (!confirm("已选择" + SelectData.length + "条数据，确定将其删除？")) {
                    return;
                }
                model.com.DeleteDMSDeviceRepair({
                    data: SelectData
                }, function (res) {
                    alert("删除成功！！");
                    model.com.refreshUnDone(mZCommitStartTime, mZCommitEndTime);
                });
            });
            // 报修
            $("body").delegate("#zace-undone", "click", function () {
                $this = $(this);
                $(".ds-tab-menu li").each(function (i, item) {
                    $(item).removeClass("active");
                });
                $this.addClass("active");
                $('.zzzc').show();
                $('.zzze-repairs').hide();
                $('.searchShow-repairs').show();
                $('.particulars-head-repairs').hide();
                $('.zacePlanCommitDone').hide();
                $('.zacePlanCommit').show();
                mTypeDone = 1;
                mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000);
                mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
                model.com.refreshUnDone(mZCommitStartTime, mZCommitEndTime);
            });
            // 检修
            $("body").delegate("#zace-done", "click", function () {
                $this = $(this);
                $(".ds-tab-menu li").each(function (i, item) {
                    $(item).removeClass("active");
                });
                $this.addClass("active");
                $('.zzze').hide();
                $('.zacePlanCommitDone').show();
                $('.zacePlanCommit').hide();
                $('.zzzd').show();
                $('.particulars-head').hide();
                $('.searchShow').show();
                mTypeDone = 2;
                mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000);
                mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
                $('#lmvt-startTime-Overhaul').val(mZCommitStartTime);
                $('#lmvt-endTime-Overhaul').val(mZCommitEndTime);
                model.com.refreshDone(mZCommitStartTime, mZCommitEndTime);
            });
            //检修编辑
            $("body").delegate(".lmvt-resetPencil", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = wDataDone.filter((item) => {
                    return item.ID == wID
                });

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }

                var default_value = {
                    RepairerIDList: SelectData[0].RepairerIDList,
                    RepairRemark: SelectData[0].RepairRemark,
                    RepairImageList: SelectData[0].RepairImageList,
                    RepairStartTime: $com.util.format('yyyy-MM-dd hh:mm', new Date()),
                    RepairEndTime: $com.util.format('yyyy-MM-dd hh:mm', new Date()),
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "报检修改", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    if ($com.util.format('yyyy-MM-dd hh:mm', rst.RepairStartTime) > $com.util.format('yyyy-MM-dd hh:mm', rst.RepairEndTime)) {
                        alert("开始时间大于结束时间");
                        return false;
                    }

                    SelectData[0].RepairerIDList = rst.RepairerIDList;
                    SelectData[0].RepairRemark = rst.RepairRemark;
                    SelectData[0].RepairStartTime = $com.util.format('yyyy-MM-dd hh:mm', rst.RepairStartTime);
                    SelectData[0].RepairEndTime = $com.util.format('yyyy-MM-dd hh:mm', rst.RepairEndTime);
                    SelectData[0].RepairTime = $com.util.format('yyyy-MM-dd hh:mm', new Date());
                    SelectData[0].RepairImageList = rst.RepairImageList;

                    model.com.UpdateDMSDeviceRepair({
                        data: SelectData[0]
                    }, function (res) {
                        alert("修改成功！！");
                        model.com.refreshDone(mZCommitStartTime, mZCommitEndTime);
                    });
                }, TypeSource_Level));
            });
            //检修
            $("body").delegate(".lmvt-recondition", "click", function () {

                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));

                var SelectData = wDataDone.filter((item) => {
                    return item.ID == wID
                });

                if (!SelectData || !SelectData.length) {
                    alert("请先选择一行数据再试！")
                    return;
                }
                if (SelectData.length != 1) {
                    alert("只能同时对一行数据修改！")
                    return;
                }

                var default_value = {
                    RepairerIDList: SelectData[0].RepairerIDList,
                    RepairRemark: SelectData[0].RepairRemark,
                    // RepairImageList: SelectData[0].RepairImageList,
                    RepairStartTime: $com.util.format('yyyy-MM-dd hh:mm', new Date()),
                    RepairEndTime: $com.util.format('yyyy-MM-dd hh:mm', new Date()),
                };
                $("body").append($com.modal.show(default_value, KEYWORD_Level, "检修", function (rst) {
                    //调用修改函数
                    if (!rst || $.isEmptyObject(rst))
                        return;

                    if ($com.util.format('yyyy-MM-dd hh:mm', rst.RepairStartTime) > $com.util.format('yyyy-MM-dd hh:mm', rst.RepairEndTime)) {
                        alert("开始时间大于结束时间");
                        return false;
                    }
                    SelectData[0].RepairerIDList = rst.RepairerIDList;
                    SelectData[0].RepairRemark = rst.RepairRemark;
                    SelectData[0].RepairStartTime = $com.util.format('yyyy-MM-dd hh:mm', rst.RepairStartTime);
                    SelectData[0].RepairEndTime = $com.util.format('yyyy-MM-dd hh:mm', rst.RepairEndTime);
                    SelectData[0].RepairTime = $com.util.format('yyyy-MM-dd hh:mm', new Date());
                    SelectData[0].Status = 2;
                    // SelectData[0].RepairImageList = rst.RepairImageList;
                    if (SelectData[0].RepairerIDList.length==0){
                        alert("请输入检修人");
                        return false;
                    }
                    model.com.UpdateDMSDeviceRepair({
                        data: SelectData[0]
                    }, function (res) {
                        alert("检修成功！！");
                        model.com.refreshDone(mZCommitStartTime, mZCommitEndTime);
                    });

                }, TypeSource_Level));
            });
            //报修详情
            $("body").delegate(".lmvt-Repairs-particulars","click",function () {
                var wJurisdiction = false;
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));
                var SelectData = wDataUnDone.filter((item) => {
                    return item.ID == wID
                });

                mPreserveData = SelectData[0]
                 $('.zzzc').hide();
                 $('.zzze-repairs').show();
                 $('.searchShow-repairs').hide();
                $('.particulars-head-repairs').show();
                $('#fxy-preserve-repairs').show();
                model.com.DeviceParticulars(SelectData)
                if (mPreserveData.CreatorID!=Number(mUser.LoginName)||mPreserveData.Status==2 ||!$com.app.checkRole(201001)){
                        wJurisdiction = true;
                   }


                if (wJurisdiction){

                    $('#fxy-preserve-repairs').hide();
                    $(".repairs-particulars").html($com.util.template(wData, HTML.ReadOnlyTableModeParticulars));
                    return
                }

                $(".repairs-particulars").html($com.util.template(wData, HTML.TableModeParticularsRepairs));
                //下拉框赋值
                $(".AlarmLevel").html($com.util.template( TypeSource_Level.AlarmLevel, HTML.MaintenanceName));
                $('.AlarmLevel').selectpicker('refresh');
                $(".AlarmLevel").selectpicker ("val",mPreserveData.AlarmLevel).trigger("change");
                $('.AlarmType').html($com.util.template( TypeSource_Level.AlarmType, HTML.MaintenanceName));
                $('.AlarmType').selectpicker('refresh');
                $(".AlarmType").selectpicker ("val",mPreserveData.AlarmType).trigger("change");
                model.com.getDMSDeviceParameter({
                    Active: 1,
                    Name: "",
                    VariableName: "",
                    DeviceID: mPreserveData.DeviceID,
                    DeviceNo: "",
                    DeviceName: "",
                    Protocol: "",
                    OPCClass: "",
                    DataType: -1,
                    DataClass: "",
                },function (res) {
                    var AlarmCodeList = [];
                    var n = 0;
                    if (res.list.length>0){
                        res.list.forEach(function (item,index) {
                            if (item.DataClass == 2){
                                AlarmCodeList.push({
                                    name:`${item.Name}(${item.Code})`,
                                    value:Number(item.Code),
                                })
                            }
                               n++;
                        })
                        $(".AlarmCode").html($com.util.template( AlarmCodeList, HTML.MaintenanceName));
                        $('.AlarmCode').selectpicker('refresh');
                        for (var i =0;i<AlarmCodeList.length;i++){
                            if (AlarmCodeList[i].code==mPreserveData.AlarmCode){
                                $(".AlarmCode").selectpicker ("val",i).trigger("change");
                                break;
                            }
                        }
                    }

                })
                //添加图片
                $(".AlarmImageList").append('<div class="m-c-panel" id="imagesUpload"><div class="m-c-body m-c-upload clearfix"><ul class="upload-list"><li class="upload-btn"><input type="file" class="uploadImageZac"></li></ul></div></div>');
                $(".AlarmImageList  #imagesUpload .m-c-body ul.upload-list").html('<li class="upload-btn"><input type="file" class="uploadImageZac"></li>');
                for (var m = 0; m < wData[0].AlarmImageList.length; m++) {
                    $(".AlarmImageList  #imagesUpload .m-c-body ul.upload-list .upload-btn").before($com.util.template({ Src: wData[0].AlarmImageList[m], Id: wData[0].AlarmImageList[m] }, HTML.IMGrepairs));
                }
                $("#fxy-AlarmRemark").val(`${mPreserveData.AlarmRemark}`)
            })
            //报修返回
            $("body").delegate("#go-back-repairs","click",function () {
                $('.zzzc').show();
                $('.zzze-repairs').hide();
                $('.searchShow-repairs').show();
                $('.particulars-head-repairs').hide();
                model.com.refreshUnDone(mZCommitStartTime, mZCommitEndTime);
            })
            //检修详情
            $("body").delegate(".lmvt-particulars", "click", function () {
                var wJurisdiction = false;
                var $this = $(this),
                    wID = Number($this.closest("td").attr("data-value"));
                var SelectData = wDataDone.filter((item) => {
                    return item.ID == wID
                });
                $('.zzzd').hide();
                $('.zzze').show();
                $('.searchShow').hide();
                $('.particulars-head').show();
               model.com.DeviceParticulars(SelectData)
                mPreserveData.RepairerIDList.forEach(function (item) {
                    if (item==Number(mUser.LoginName)){
                        wJurisdiction = true;
                    }
                })
                if (wJurisdiction && $com.app.checkRole(201002)&&mPreserveData.Status==2){
                    $(".recondition-particulars").html($com.util.template(wData, HTML.TableModeParticulars));
                    $(".RepairImageList").append('<div class="m-c-panel" id="imagesUpload"><div class="m-c-body m-c-upload clearfix"><ul class="upload-list"><li class="upload-btn"><input type="file" class="uploadImageZac"></li></ul></div></div>');
                    $(".RepairImageList  #imagesUpload .m-c-body ul.upload-list").html('<li class="upload-btn"><input type="file" class="uploadImageZac fxy-input-repair"></li>');
                    for (var m = 0; m < wData[0].RepairImageList.length; m++) {
                        $(".RepairImageList  #imagesUpload .m-c-body ul.upload-list .upload-btn").before($com.util.template({ Src: wData[0].RepairImageList[m], Id: wData[0].RepairImageList[m] }, HTML.IMG));
                    }
                    $("#textnull").hide();
                    $("#fxy-preserve").show();
                    //检修人下拉框
                    $("#fxy-maintenance-men").html($com.util.template( TypeSource_Level.RepairerIDList, HTML.MaintenanceName));
                    $('#fxy-maintenance-men').selectpicker('refresh');
                    $("#fxy-maintenance-men").selectpicker ("val",mPreserveData.RepairerIDList).trigger("change");
                    $('#fxy-maintenance-men').selectpicker('refresh');
                    //时间组件
                    model.com.getDate();
                    //时间组件赋值
                    $(" input[ name='StartingTime' ] ").val(mPreserveData.RepairStartTime);
                    $(" input[ name='EndTime' ] ").val(mPreserveData.RepairEndTime);
                    //输入框赋值
                    $("#fxy-remark").val(`${mPreserveData.RepairRemark}`)
                }else {
                    $("#fxy-preserve").hide();
                    $("#textnull").show()
                    $(".recondition-particulars").html($com.util.template(wData, HTML.ReadOnlyTableModeParticulars));
                }
            });
            //修复select 样式
            // $("body").delegate(".fxy-maintenance-men", "click",function () {
            //
            //     $($(".fxy-maintenance-men .caret")[0]).css("top","-24px");
            // })
            //返回按钮
            $("body").delegate("#go-back", "click", function () {
                $('.zzzd').show();
                $('.zzze').hide();
                $('.searchShow').show();
                $('.particulars-head').hide();
                model.com.refreshDone(mZCommitStartTime, mZCommitEndTime);
            });
            // 上传图片
            $("body").delegate(".uploadImageZac", "change", function () {
                var self = this,
                    _data = self.files[0];
                if (_data) {
                    if (_data.size <= 0) {
                        alert("文件大小不能为空！");
                        clearFiles();
                        return;
                    }
                    if (_data.size > (1024 * 1024 * 10)) {
                        alert("请上传小于10M的文件！");
                        clearFiles();
                        return;
                    }
                    if (!extLimit(['jpg', 'png', 'gif', 'bmp', 'jpeg']).has(_data.name)) {
                        alert("请上传正确的文件！");
                        clearFiles();
                        return;
                    }

                    var form = new FormData();
                    var wbool = false;
                    self.classList.forEach(function (item) {
                        if (item == "fxy-input-repair"){
                            wbool = true;
                        }
                    })
                    form.append("file", _data);



                    //alert(_data.name);
                    $.ajax({ //
                        url: "/iPlantSCADA/api/Upload/Submit",
                        type: "POST",
                        data: form,
                        processData: false,
                        contentType: false,
                        dataType: "JSON"
                    }).done(function (data) {
                        if (data.resultCode === 1000) {
                           if (wbool){
                               mPreserveData.RepairImageList.push(data.returnObject.file_url);
                           }else {
                               mPreserveData.AlarmImageList.push(data.returnObject.file_url);
                           }
                            var $p = $(self).parent();
                            //  $p.before('.upload-btn').remove();
                            if (data.returnObject.file_id.indexOf("jpg") != -1 || data.returnObject.file_id.indexOf("jpeg") != -1 || data.returnObject.file_id.indexOf("png") != -1 || data.returnObject.file_id.indexOf("gif") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                    Id: data.returnObject.file_id
                                }, HTML.IMG));
                            } else if (data.returnObject.file_id.indexOf("txt") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                }, HTML.OtherSrcTxt));
                            } else if (data.returnObject.file_id.indexOf("doc") != -1 || data.returnObject.file_id.indexOf("docx") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                }, HTML.OtherSrcDoc));
                            } else if (data.returnObject.file_id.indexOf("xlsx") != -1 || data.returnObject.file_id.indexOf("xls") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                }, HTML.OtherSrcExcel));
                            } else if (data.returnObject.file_id.indexOf("pdf") != -1) {
                                $p.before($com.util.template({
                                    Src: data.returnObject.file_id,
                                }, HTML.OtherSrcPdf));
                            }

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
            //保存检修详情页
            $("body").delegate("#fxy-preserve", "click", function () {
                if ($com.util.toDate($(" input[ name='StartingTime' ] ").val()) > $com.util.toDate($(" input[ name='EndTime' ] ").val())) {
                    alert("起始时间不能大于结束时间")
                    return
                }
                mPreserveData.RepairerIDList = $('#fxy-maintenance-men').val();
                mPreserveData.RepairRemark = $("#fxy-remark").val();
                mPreserveData.RepairStartTime =  $(" input[ name='StartingTime' ] ").val();
                mPreserveData.RepairEndTime =  $(" input[ name='EndTime' ] ").val();
                if (mPreserveData.RepairerIDList.length==0){
                    alert("请输入检修人");
                    return false;
                }
                model.com.UpdateDMSDeviceRepair({
                    data: mPreserveData
                }, function (res) {
                    alert("修改成功！！");
                    $this.addClass("active");
                    $('.zzze').hide();
                    $('.zacePlanCommitDone').show();
                    $('.zacePlanCommit').hide();
                    $('.zzzd').show();
                    $('.particulars-head').hide();
                    $('.searchShow').show();
                    model.com.refreshDone(mZCommitStartTime, mZCommitEndTime);
                });
            });
            //报修保存按钮
            $("body").delegate("#fxy-preserve-repairs", "click", function () {
                mPreserveData.AlarmCode =model.com.getParenthesesStr($(".AlarmCode")[1].innerText);
                mPreserveData.AlarmLevel = $($(".AlarmLevel")[0]).val();
                mPreserveData.AlarmType = $($(".AlarmType")[0]).val();
                mPreserveData.AlarmName = $($(".fxy-AlarmName")[0]).val();
                mPreserveData.AlarmRemark = $('#fxy-AlarmRemark').val();
                model.com.UpdateDMSDeviceRepair({
                    data: mPreserveData
                }, function (res) {
                    alert("修改成功！！");
                    $('.zzzc').show();
                    $('.zzze-repairs').hide();
                    $('.searchShow-repairs').show();
                    $('.particulars-head-repairs').hide();
                    $('.zacePlanCommitDone').hide();
                    $('.zacePlanCommit').show();
                    model.com.refreshUnDone(mZCommitStartTime, mZCommitEndTime);
                });
            });

            //放大图片
            model.com.LookImg(".ImageItem img");
            model.com.LookImg("td[data-title=AlarmImageList] img");
            model.com.LookImg("td[data-title=RepairImageList] img");

            //移除photo
            $("body").delegate(".lmvt-remove-photo", "click", function () {
                $(".lmvt-show-photo").remove();
            });

            //右看图片
            $("body").delegate(".lmvt-bottom-left", "click", function () {
                var index = Number($(".lmvt-change-photo").attr("data-index"));
                if (PhotoList) {
                    if (index == PhotoList.length - 1) {
                        alert("这是最后一张图片！");
                        return false;
                    } else {
                        $(".lmvt-change-photo").css("background", "url(" + PhotoList[index + 1] + ") " + "no-repeat center");
                        $(".lmvt-change-photo").attr("data-index", index + 1);
                    }
                }
            });
            //左看图片
            $("body").delegate(".lmvt-bottom-right", "click", function () {
                var index = Number($(".lmvt-change-photo").attr("data-index"));
                if (PhotoList) {
                    if (index == 0) {
                        alert("这是第一张图片！");
                        return false;
                    } else {
                        $(".lmvt-change-photo").css("background", "url(" + PhotoList[index - 1] + ") " + "no-repeat center");
                        $(".lmvt-change-photo").attr("data-index", index - 1);
                    }
                }
            });


            // $("#lmvt-startTime-ReportRepair").datetimepicker(mTime).on('changeDate', function (ev) {
            //     var startTime = $("#lmvt-startTime-ReportRepair").val();
            //     $("#lmvt-endTime-ReportRepair").datetimepicker("setStartDate", startTime);
            // });
            // $("#lmvt-endTime-ReportRepair").datetimepicker(mTime).on('changeDate', function (ev) {
            //     var endTime = $("#lmvt-endTime-ReportRepair").val();
            //     $("#lmvt-startTime-ReportRepair").datetimepicker("setEndDate", endTime.toString("yyyy-MM-dd"));
            // });
            $("#lmvt-startTime-Overhaul").datetimepicker(mTime).on('changeDate', function (ev) {
                var startTime = $("#lmvt-startTime-Overhaul").val();
                $("#lmvt-endTime-Overhaul").datetimepicker("setStartDate", startTime);
            });
            $("#lmvt-endTime-Overhaul").datetimepicker(mTime).on('changeDate', function (ev) {
                var endTime = $("#lmvt-endTime-Overhaul").val();
                $("#lmvt-startTime-Overhaul").datetimepicker("setEndDate", endTime.toString("yyyy-MM-dd"));
            });
            //报修 查询
            $("body").delegate("#lmvt-search-ReportRepair", "click", function () {
                var wAlarmLevel = $($('.fxy-search-AlarmLevel')[0]).val();
                var wAlarmType = $($('.fxy-search-AlarmType')[0]).val();
                var wStatus = $($('.fxy-search-Status')[0]).val();
                mZCommitStartTime = $(" input[ name='datetimepicker1' ] ").val();
                mZCommitEndTime = $(" input[ name='datetimepicker2' ] ").val();
                if ($com.util.format('yyyy-MM-dd hh:mm', mZCommitStartTime) > $com.util.format('yyyy-MM-dd hh:mm', mZCommitEndTime)) {
                    alert("开始时间大于结束时间");
                    return false;
                }

                if (mZCommitStartTime == "" || mZCommitEndTime == "") {
                    mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000);
                    mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
                }
                model.com.refreshUnDone(mZCommitStartTime, mZCommitEndTime,wAlarmLevel,wAlarmType,wStatus);

            });
            //报修 重置
            $("body").delegate("#lmvt-reset-ReportRepair", "click", function () {
                mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000);
                mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
                $(" input[ name='datetimepicker1' ] ").val(mZCommitStartTime);
                $(" input[ name='datetimepicker2' ] ").val(mZCommitEndTime);
                $($('.fxy-search-AlarmLevel')[0]).val();
                $($('.fxy-search-AlarmLevel')[0]).val("-1");
                $($('.fxy-search-AlarmType')[0]).val("-1");
                $($('.fxy-search-Status')[0]).val("-1");
                $(".selectpicker").selectpicker('refresh');
            });

            //检修 查询
            $("body").delegate("#lmvt-search-Overhaul", "click", function () {
                var wAlarmLevel = $($('.fxy-search-AlarmLevel-recondition')[0]).val();
                var wAlarmType = $($('.fxy-search-AlarmType-recondition')[0]).val();
                var wStatus = $($('.fxy-search-Status-recondition')[0]).val();
                mZCommitStartTime = $(" input[ name='datetimepicker3' ] ").val();
                mZCommitEndTime = $(" input[ name='datetimepicker4' ] ").val();

                if ($com.util.format('yyyy-MM-dd hh:mm', mZCommitStartTime) > $com.util.format('yyyy-MM-dd hh:mm', mZCommitEndTime)) {
                    alert("开始时间大于结束时间");
                    return false;
                }

                if (mZCommitStartTime == "" || mZCommitEndTime == "") {
                    mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000);
                    mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
                }
                model.com.refreshDone(mZCommitStartTime, mZCommitEndTime,wAlarmLevel,wAlarmType,wStatus);

            });
            //检修 重置
            $("body").delegate("#lmvt-reset-Overhaul", "click", function () {
                mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000);
                mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
                $($('.fxy-search-AlarmLevel-recondition')[0]).val("-1");
                $($('.fxy-search-AlarmType-recondition')[0]).val("-1");
                $($('.fxy-search-Status-recondition')[0]).val("-1");
                $(" input[ name='datetimepicker3' ] ").val(mZCommitStartTime);
                $(" input[ name='datetimepicker4' ] ").val(mZCommitEndTime);
                $(".selectpicker").selectpicker('refresh');
            });
            $("body").delegate(".m-left-area", "click", function () {
                $(".ds-TempAlarm").hide();
                $("#femi-modal-contain").show()
            });

            $("body").delegate(".femi-modal-body .femi-modal-item  input[data-name=AlarmCode]", "click", function () {
                wDateValue = [];
                $(".ds-select-input  input.femi-search-content").val("");
                var DeviceID = $(".femi-modal-body .femi-modal-item  #modal_select_DeviceID").val();
                if (DeviceID == 0) {
                    alert("请选择设备！")
                } else {
                    $(".ds-TempAlarm").show();
                    $("#femi-modal-contain").hide();
                    model.com.getDMSDeviceParameter({
                        Active: 1,
                        Name: "",
                        VariableName: "",
                        DeviceID: DeviceID,
                        DeviceNo: "",
                        DeviceName: "",
                        Protocol: "",
                        OPCClass: "",
                        DataType: -1,
                        DataClass: "",
                    }, function (res) {
                        var wlist = [];
                        res.list.forEach(function (item){
                            if (item.DataClass==2){
                                wlist.push(item);
                            }
                        })
                        DeviceList = wlist;
                        DeviceListClone = $com.util.Clone(wlist);
                        wlist = [];
                        for (var i = 0; i < DeviceList.length; i++) {
                            DeviceList[i].NameText = DeviceList[i].Name + "(" + DeviceList[i].Code + ")";
                        }
                        $("body").find(".SelectDate").html($com.util.template(DeviceList, HTML.SelectLI));
                    });
                }
            });

            //模糊查询数据
            $("body").delegate("input.femi-search-content", "input", function () {
                TopSearchData = [];
                //模糊查询
                var $this = $(this),
                    value = $this.val();
                DeviceList.forEach(element => {
                    if (element.Name.indexOf(value) >= 0 && value != "") {
                        TopSearchData.push(element);
                    }
                });
                if (TopSearchData.length > 0) {
                    $("body").find(".SelectDate").html($com.util.template(TopSearchData, HTML.SelectLI));
                } else {
                    model.com.render(DeviceList);
                }
            });
            //选择数据
            $("body").delegate(".SelectDIV", "click", function () {
                var $this = $(this);
                //单选
                if (wMode == 1) {
                    DepartmentValue = [];
                    var mID = Number($this.attr("data-value"));
                    wDateValue = [];
                    wDateValue.push(mID);
                    wDateValue = arryOnea(wDateValue);

                    var img_uncheck = $this.find("img")[0];
                    var img_checked = $this.find("img")[1];
                    var show_uncheck = $(img_uncheck).css('display');
                    if (show_uncheck == 'block') {
                        $(img_uncheck).css('display', 'none');
                    }
                    if (show_uncheck == 'none') {
                        $(img_uncheck).css('display', 'block');
                    }
                    var show_checked = $(img_checked).css('display');
                    if (show_checked == 'block') {
                        $(img_checked).css('display', 'none');
                        wDateValue = [];
                    }
                    if (show_checked == 'none') {
                        $(img_checked).css('display', 'block');
                        $this.parents("li").siblings().find(".Label .SelectDIV .uncheck").show();
                        $this.parents("li").siblings().find(".Label .SelectDIV .checked").hide();
                    }
                }

                function arryOnea(data) {
                    var temp = {};
                    var arr = [];
                    var len = data.length;
                    for (var i = 0; i < len; i++) {
                        if (!temp[data[i]]) {
                            temp[data[i]] = "abc";
                            arr.push(data[i]);
                        }
                    }
                    return arr;
                }
            });
            //提交渲染的数据
            $("body").delegate(".m-right-area", "click", function () {
                $("#femi-modal-contain").show();
                $(".ds-TempAlarm").hide();
                var type = 1;
                mNameList = [];
                var structure = {
                    ID: 0,
                    Name: "",
                    Code: "",
                }
                if (wDateValue.length > 0) {
                    for (var i = 0; i < DeviceListClone.length; i++) {
                        if (wDateValue[0] == DeviceListClone[i].ID) {
                            mNameList.push({
                                ID: DeviceListClone[i].ID,
                                Name: DeviceListClone[i].Name,
                                Code: DeviceListClone[i].Code,
                            });
                        }
                    }
                    $(".femi-modal-body .femi-modal-item  input[data-name=AlarmCode]").val(mNameList[0].Code);
                    $(".femi-modal-body .femi-modal-item  input[data-name=AlarmName]").val(mNameList[0].Name);
                } else {
                    if (type == 1) {
                        var inputValue = $(".ds-select-input  input.femi-search-content").val();
                        if (inputValue && inputValue.length <= 0) {
                            alert("请选择数据！");
                            return false;
                        } else {
                            mNameList.push({
                                ID: 0,
                                Code: inputValue,
                                Name: "",
                            });
                        }
                        $(".femi-modal-body .femi-modal-item  input[data-name=AlarmCode]").val(inputValue)
                        $(".femi-modal-body .femi-modal-item  input[data-name=AlarmName]").val("");
                    } else {
                        alert("请选择数据！");
                        return false;
                    }
                }


            });

            //删除图片按钮显示
            $("body").delegate(".upload-img","mouseenter",function () {
                $($(this)[0].childNodes[2]).show();
            })
            //删除图片按钮隐藏
            $("body").delegate(".upload-img","mouseleave",function () {
               $($(this)[0].childNodes[2]).hide();
            })
            $("body").delegate(".remove-image","click",function () {
                var $this = $(this),
                    src =$this.attr("data-src");
                var wArr = [];
                var wImgBool = true;
                $this[0].classList.forEach(function (item) {
                    if (item=="fxy-img-repairs"){
                        wImgBool=false;
                    }
                })
                if (wImgBool){
                    mPreserveData.RepairImageList.forEach(function (item) {
                        if (item!==src){
                            wArr.push(item);
                        }
                    })
                    mPreserveData.RepairImageList = wArr;
                    $(".upload-img").remove()
                    for (var m = 0; m < wArr.length; m++) {
                        $(".RepairImageList  #imagesUpload .m-c-body ul.upload-list .upload-btn").before($com.util.template({ Src: wArr[m], Id: wArr[m] }, HTML.IMG));
                    }
                }else {
                    mPreserveData.AlarmImageList.forEach(function (item) {
                        if (item!==src){
                            wArr.push(item);
                        }
                    })
                    mPreserveData.AlarmImageList = wArr;
                    $(".upload-img").remove()
                    for (var m = 0; m < wArr.length; m++) {
                        $(".AlarmImageList  #imagesUpload .m-c-body ul.upload-list .upload-btn").before($com.util.template({ Src: wArr[m], Id: wArr[m] }, HTML.IMG));
                    }
                }


                wArr=[];
            })
        },

        run: function () {
            //时间组件
            model.com.getDate1();

            $(".selectpicker").selectpicker('refresh');
            $('.particulars-head').hide();
            $('.particulars-head-repairs').hide();
            $('.zzze-repairs').hide();
            $com.app.loading();
            mUser = window.parent.User_Info
            mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 30 * 24 * 3600 * 1000);
            mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);

            $(" input[ name='datetimepicker1' ] ").val(mZCommitStartTime);
            $(" input[ name='datetimepicker2' ] ").val(mZCommitEndTime);
            $(" input[ name='datetimepicker3' ] ").val(mZCommitStartTime);
            $(" input[ name='datetimepicker4' ] ").val(mZCommitEndTime);
            $('#lmvt-startTime-Overhaul').val(mZCommitStartTime);
            $('#lmvt-endTime-Overhaul').val(mZCommitEndTime);
            model.com.getUser({
                Active: 1
            }, function (resU) {
                $.each(resU.list, function (i, item) {
                    TypeSource_Level.RepairerIDList.push({
                        name: `${item.Name}(${item.ID})`,
                        value: item.ID,
                    })
                });
                $(".fxy-search-RepairerID-recondition").html($com.util.template( TypeSource_Level.RepairerIDList, HTML.MaintenanceName));


                $('.fxy-search-RepairerID-recondition').selectpicker('refresh');
                model.com.getDMSDeviceLedger({
                    Active: 1
                }, function (resP) {
                    $.each(resP.list, function (i, item) {
                        TypeSource_Level.DeviceID.push({
                            name: item.Name,
                            value: item.ID,
                        })
                    });
                    model.com.refreshUnDone(mZCommitStartTime, mZCommitEndTime);
                });
            });



        },
        com: {
            //查看图片
            LookImg:function(className){
                $("body").delegate(className, "click", function () {
                    var farImg = $(this).parent(),
                        imgObj = {},
                        imgList = [];
                    $.each(farImg.children(), function (i, item) {
                        imgObj = $(item).attr("data-source");
                        imgList.push(imgObj);
                    });
                    PhotoList = imgList;
                    $("body").append(HTML.Photo);
                    var imgSrc = $(this).attr("src")
                    $.each(PhotoList, function (p_i, p_item) {
                        var pImg = p_item;
                        if (pImg == imgSrc) {
                            $(".lmvt-change-photo").attr("data-index", p_i);
                            return false;
                        }
                    })
                    $(".lmvt-change-photo").css("background", "url(" + imgSrc + ") " + "no-repeat center");
                });
            },
            //选择时间组件
            getDate: function () {
                $('.date').datetimepicker({
                    forceParse: 0,//设置为0，时间不会跳转1899，会显示当前时间。
                    language: 'zh-CN',//显示中文
                    format: 'yyyy-mm-dd hh:ii',//显示格式
                    minView: "0",//设置只显示到月份
                    initialDate: new Date(),//初始化当前日期
                    autoclose: true,//选中自动关闭
                    todayBtn: true,//显示今日按钮
                    pickerPosition:'top-right'
                })
            },
            //选择时间组件
            getDate1: function () {
                $('.date1').datetimepicker({
                    forceParse: 0,//设置为0，时间不会跳转1899，会显示当前时间。
                    language: 'zh-CN',//显示中文
                    format: 'yyyy-mm-dd hh:ii',//显示格式
                    minView: "0",//设置只显示到月份
                    initialDate: new Date(),//初始化当前日期
                    autoclose: true,//选中自动关闭
                    todayBtn: true,//显示今日按钮
                })
            },
            render: function (wData) {
                $("body").find(".SelectDate").html($com.util.template(wData, HTML.SelectLI));
            },
            arryOnea: function (data) {
                var temp = {};
                var arr = [];
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    if (!temp[data[i].ID]) {
                        temp[data[i].ID] = "abc";
                        arr.push(data[i]);
                    }
                }
                return arr;
            },
            //获取设备参数字典
            getDMSDeviceParameter: function (data, fn, context) {
                var d = {
                    $URI: "/DMSDeviceParameter/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取人员
            getUser: function (data, fn, context) {
                var d = {
                    $URI: "/User/All",
                    $TYPE: "get",
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取设备
            getDMSDeviceLedger: function (data, fn, context) {
                var d = {
                    $URI: "/DMSDeviceLedger/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            getDMSDeviceRepair: function (data, fn, context) {
                var d = {
                    $URI: "/DMSDeviceRepair/All",
                    $TYPE: "get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //删除报修
            DeleteDMSDeviceRepair: function (data, fn, context) {
                var d = {
                    $URI: "/DMSDeviceRepair/Delete",
                    $TYPE: "post",
                };
                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //新增报修
            UpdateDMSDeviceRepair: function (data, fn, context) {
                var d = {
                    $URI: "/DMSDeviceRepair/Update",
                    $TYPE: "post",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //刷新报修
            refreshUnDone: function (StartTime, EndTime,AlarmLevel=-1,AlarmType=-1,Status=-1,) {
                $com.app.loading();
                $page.init($("#femi-zacePlanCommit-tbody").closest("table"), null, {
                    $URI: "/DMSDeviceRepair/All", 
                    $TYPE: "Get",
                    PageCountProp: "info",   //   服务器返回总页数的属性名称
                    DataListProp: "list",    //  服务器返回数据列表的属性名称
                    PageSize: 10,
                    DeviceNo: "",
                    DeviceID: -1,
                    Status: Status,
                    StartTime: StartTime,
                    EndTime: EndTime,
                    AlarmLevel:AlarmLevel,
                    AlarmType:AlarmType,
                },function(res){
                    wDataUnDone = $com.util.Clone(res);
                    wData = $com.util.Clone(res);

                    for (var k = 0; k < wData.length; k++) {
                        wData[k].CreateTime = $com.util.format('yyyy-MM-dd hh:mm', wData[k].CreateTime);
                        wData[k].RepairTime = $com.util.format('yyyy-MM-dd hh:mm', wData[k].RepairTime);
                        wData[k].StatusText = StatusArray[wData[k].Status];
                        wData[k].AlarmLevelText = AlarmLevelArray[wData[k].AlarmLevel];
                        wData[k].AlarmTypeText = AlarmTypeArray[wData[k].AlarmType];
                    }
                    wData.forEach(element => {
                        ImagePathArray = [];
                        if (element.AlarmImageList.length > 0) {
                            element.AlarmImageList.forEach(element1 => {
                                SrcListObj = {
                                    SrcList: element1
                                }
                                if (SrcListObj.SrcList != "") {
                                    ImagePathArray.push(SrcListObj);
                                }
                            });
                            if (ImagePathArray.length > 0) {
                                element.ImageItem = $com.util.template(ImagePathArray, HTML.IMGLIST);
                            } else {
                                element.ImageItem = "";
                            }
                        }

                    });
                    $("#femi-zacePlanCommit-tbody").html($com.util.template(wData, HTML.TableModeCommit));
                    //判断是否有删除权限
                    model.com.BtnStyleJurisdiction(".lmvt-delete",201001);
                    model.com.BtnStyleID(".lmvt-delete", wData,"CreatorID")
                    $(window).resize();
                    $com.app.loaded();
                });
            },
            refreshDone: function (StartTime, EndTime,wAlarmLevel=-1,AlarmType=-1,Status=-1,RepairerIDList=[]) {
                $com.app.loading();
                $page.init($("#femi-zacePlanCommitDone-tbody").closest("table"), null, {
                    $URI: "/DMSDeviceRepair/All", 
                    $TYPE: "Get",
                    PageCountProp: "info",   //   服务器返回总页数的属性名称
                    DataListProp: "list",    //  服务器返回数据列表的属性名称
                    PageSize: 10,
                    DeviceNo: "",
                    DeviceID: -1,
                    Status: Status,
                    StartTime: StartTime,
                    EndTime: EndTime,
                    AlarmLevel:wAlarmLevel,
                    AlarmType:AlarmType,
                    RepairerIDList:RepairerIDList
                },function(res){
                    wDataDone = $com.util.Clone(res);
                    wData = $com.util.Clone(res);
                    for (var k = 0; k < wData.length; k++) {
                        if ($com.util.format('yyyy-MM-dd hh:mm', wData[k].CreateTime) < $com.util.format('yyyy-MM-dd hh:mm', "2010-1-1")) {
                            wData[k].CreateTime = "-";
                        }
                        if ($com.util.format('yyyy-MM-dd hh:mm', wData[k].RepairTime) < $com.util.format('yyyy-MM-dd hh:mm', "2010-1-1")) {
                            wData[k].RepairTime = "-";
                        }
                        if ($com.util.format('yyyy-MM-dd hh:mm', wData[k].RepairStartTime) < $com.util.format('yyyy-MM-dd hh:mm', "2010-1-1")) {
                            wData[k].RepairStartTime = "-";
                        }
                        if ($com.util.format('yyyy-MM-dd hh:mm', wData[k].RepairEndTime) < $com.util.format('yyyy-MM-dd hh:mm', "2010-1-1")) {
                            wData[k].RepairEndTime = "-";
                        }
                        wData[k].StatusText = StatusArray[wData[k].Status];
                        wData[k].AlarmLevelText = AlarmLevelArray[wData[k].AlarmLevel];
                        wData[k].AlarmTypeText = AlarmTypeArray[wData[k].AlarmType];
                    }
                    wData.forEach(element => {
                        ImagePathArray = [];
                        if (element.AlarmImageList.length > 0) {
                            element.AlarmImageList.forEach(element1 => {
                                SrcListObj = {
                                    SrcList: element1
                                }
                                if (SrcListObj.SrcList != "") {
                                    ImagePathArray.push(SrcListObj);
                                }
                            });
                            if (ImagePathArray.length > 0) {
                                element.ImageItem = $com.util.template(ImagePathArray, HTML.IMGLIST);
                            } else {
                                element.ImageItem = "";
                            }
                        }
                        ImagePathArrayRepair = [];
                        if (element.RepairImageList.length > 0) {
                            element.RepairImageList.forEach(element1 => {
                                SrcListObj = {
                                    SrcList: element1
                                }
                                if (SrcListObj.SrcList != "") {
                                    ImagePathArrayRepair.push(SrcListObj);
                                }
                            });
                            if (ImagePathArrayRepair.length > 0) {
                                element.ImageItemRepair = $com.util.template(ImagePathArrayRepair, HTML.IMGLIST);
                            } else {
                                element.ImageItemRepair = "";
                            }
                        }
                    });
                    $("#femi-zacePlanCommitDone-tbody").html($com.util.template(wData, HTML.TableModeCommitDetail));
                    //判断是否有检修权限
                    model.com.BtnStyleJurisdiction(".lmvt-recondition",201002);
                    model.com.BtnStyleID(".lmvt-recondition", wData,"RepairerIDList")
                    $(window).resize();
                    $com.app.loaded();
                });
            },
            //只有自己报修的才能删除
            BtnStyleID: function (name, data, TypeID) {
                var ID = Number(mUser.LoginName);
                var n = 0;
                if (TypeID == "CreatorID") {
                    data.forEach((element, index) => {
                        if (element.Status==2 || element[TypeID] != ID){
                            $($(name)[index]).css({"cursor": "not-allowed", "color": "RGB(204, 204, 204)"});
                            $(name)[index].onclick = function (event) {
                                event.stopPropagation();
                            }
                        }
                    });
                } else if (TypeID == "RepairerIDList") {
                    data.forEach(function (item,index) {
                        item[TypeID].forEach(function (item) {
                            if (item == ID) {
                                n++;
                            }
                        })
                        if (item[TypeID].length==0){
                            n++;
                        }
                        if (n == 0) {
                            $($(name)[index]).css({"cursor": "not-allowed", "color": "RGB(204, 204, 204)"});
                            $(name)[index].onclick = function (event) {
                                event.stopPropagation();
                            }
                        }
                        if (item.Status==2){
                            if (name==".lmvt-recondition"){
                                $($(name)[index]).css({"cursor": "not-allowed", "color": "RGB(204, 204, 204)"});
                                $(name)[index].onclick = function (event) {
                                    event.stopPropagation();
                                }
                            }
                        }
                        n = 0
                    })
                }
            },
            //通过权限判断按钮样式
            BtnStyleJurisdiction:function (name,ID) {
                // $(name).each(function (item){
                //     console.log(item);
                //     console.log(this)
                // })
                if (!$com.app.checkRole(ID)){
                    $(name).css({"cursor": "not-allowed", "color": "RGB(204, 204, 204)"});
                    $(name).onclick = function (event) {
                        event.stopPropagation();
                    }
                }
            },
            //设备详情
            DeviceParticulars:function (SelectData) {
                $(".fxy-DeviceName").text(`${SelectData[0].DeviceName}${SelectData[0].DeviceNo}`);
                $(".fxy-StatusText").text(`${SelectData[0].Status==1?"已报修":"已检修"}`).css("color",`${SelectData[0].Status==1?"rgb(90, 175, 238)":"rgb(26, 250, 41)"}`);
                mPreserveData = SelectData[0];
                wData = $com.util.Clone(SelectData);
                for (var k = 0; k < wData.length; k++) {
                    if ($com.util.format('yyyy-MM-dd hh:mm', wData[k].CreateTime) < $com.util.format('yyyy-MM-dd hh:mm', "2010-1-1")) {
                        wData[k].CreateTime = "-";
                    }
                    if ($com.util.format('yyyy-MM-dd hh:mm', wData[k].RepairTime) < $com.util.format('yyyy-MM-dd hh:mm', "2010-1-1")) {
                        wData[k].RepairTime = "-";
                    }
                    if ($com.util.format('yyyy-MM-dd hh:mm', wData[k].RepairStartTime) < $com.util.format('yyyy-MM-dd hh:mm', "2010-1-1")) {
                        wData[k].RepairStartTime = "-";
                    }
                    if ($com.util.format('yyyy-MM-dd hh:mm', wData[k].RepairEndTime) < $com.util.format('yyyy-MM-dd hh:mm', "2010-1-1")) {
                        wData[k].RepairEndTime = "-";
                    }
                    wData[k].StatusText = StatusArray[wData[k].Status];
                    wData[k].AlarmLevelText = AlarmLevelArray[wData[k].AlarmLevel];
                    wData[k].AlarmTypeText = AlarmTypeArray[wData[k].AlarmType];
                }

                wData.forEach(element => {
                    ImagePathArray = [];
                    if (element.AlarmImageList.length > 0) {
                        element.AlarmImageList.forEach(element1 => {
                            SrcListObj = {
                                SrcList: element1
                            }
                            if (SrcListObj.SrcList != "") {
                                ImagePathArray.push(SrcListObj);
                            }
                        });
                        if (ImagePathArray.length > 0) {
                            element.ImageItem = $com.util.template(ImagePathArray, HTML.IMGLIST);
                        } else {
                            element.ImageItem = "";
                        }
                    }
                    ImagePathArrayRepair = [];
                    if (element.RepairImageList.length > 0) {
                        element.RepairImageList.forEach(element1 => {
                            SrcListObj = {
                                SrcList: element1
                            }
                            if (SrcListObj.SrcList != "") {
                                ImagePathArrayRepair.push(SrcListObj);
                            }
                        });
                        if (ImagePathArrayRepair.length > 0) {
                            element.ImageItemRepair = $com.util.template(ImagePathArrayRepair, HTML.IMGLIST);
                        } else {
                            element.ImageItemRepair = "";
                        }
                    }

                });

            },
            //提取小括号中的值
            getParenthesesStr:function (text) {
                let result = ''
                if ($.isEmptyObject(text))
                    return result
                let regex = /\((.+?)\)/g;
                let options = text.match(regex)
                if (!$.isEmptyObject(options)) {
                    let option = options[0]
                    if (!$.isEmptyObject(option)) {
                        result = option.substring(1, option.length - 1)
                    }
                }
                return result
            }
        }
    }),

        model.init();


});
