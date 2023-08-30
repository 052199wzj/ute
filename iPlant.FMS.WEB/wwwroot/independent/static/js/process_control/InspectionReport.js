require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/paging'
], function ($zace, $com, $page) {
    var mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 24 * 3600 * 1000);
    var mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 10);
    var DeviceID = 0;
    var HTML;
    var mCurrentArea;
    HTML = {
        TableNode_item: [
            '<tr data-color="">',
            '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="DeviceNo" data-value="{{DeviceNo}}" >{{DeviceNo}}</td>',
            '<td data-title="DeviceName" data-value="{{DeviceName}}" >{{DeviceName}}</td>',
            '<td data-title="PositionText" data-value="{{PositionText}}" >{{PositionText}}</td>',
            '<td data-title="TeamName" data-value="{{TeamName}}" >{{TeamName}}</td>',

            '<td data-title="StatusText" data-value="{{StatusText}}" ><span class="badge lmvt-badge {{IsUsedBadge}}">{{Badge}}</span>{{StatusText}}</td>',
            '<td data-title="Remark" data-value="{{Remark}}">{{Remark}}</td>',
            '<td data-title="StatusTime" data-value="{{StatusTime}}">{{StatusTime}}</td>',
            '<td data-title="SumTime" data-value="{{SumTime}}">{{SumTime}}</td>',
            '<td data-title="OpenRa" data-value="{{OpenRa}}">{{OpenRa}}</td>',
            '</tr>',
        ].join(""),
        /* 设备头部模版 */
        TopTemp:
            ` <div class="app-top-mode flex-itemContain flex-column flex-justify">
          <div class="font-max">万顷沙检修库设备状态总览：</div>
      </div>
      <div class="app-top-sed  flex-row left-mar">

          <div class="app-sed-switch flex-row DefaultText">
              <div class="">设备数量:
                  <span class="DeviceNum">（{{DeviceCountAll}}）</span>
              </div>
          </div>
          <div class="app-sed-switch flex-row ActiveText">
              <div class="">开机:
                  <span class="OpenNum">（{{OpenNumAll}}）</span>
              </div>
          </div>
          <div class="app-sed-switch flex-row">
              <div class="">关机:
                  <span class="CloseNum">（{{CloseNumAll}}）</span>
              </div>
          </div>
          <div class="app-sed-switch flex-row ForbiddenText">
              <div class="">故障:
                  <span class="DefaultNum">（{{FaultNumAll}}）</span>
              </div>
          </div>

      </div>
      <div class="app-top-sld  flex-row left-mar">

          <div class="app-sed-switch flex-row ActiveText">
              <div class="">开机率:
                  <span class="OpenRa">（{{OpenRate}}）</span>
              </div>
          </div>
          <div class="app-sed-switch flex-row DefaultText">
              <div class="">关机率:
                  <span class="CloseRa">（{{CloseRate}}）</span>
              </div>
          </div>
          <div class="app-sed-switch flex-row ForbiddenText">
              <div class="">故障率:
                  <span class="DefaultRa">（{{FaultRate}}）</span>
              </div>
          </div>
      </div>
`,

        /* 车模版 */
        MetroContainTem:
            `<div class="MetroInspectionOne flex-column"  data-value="{{AreaID}}">
                <div class="MetroInspectionArea flex-row flex-itemContain">
                    {{AreaNo}}
                </div>
                <div class="MetroInspectionAreaText flex-row flex-itemContain">
                    {{AreaName}}
                </div>
                <div class="MetroInspectionDevice flex-row flex-itemContain">
                    设备数（<span class="DeviceCount">{{DeviceCount}}</span>）
                </div>
                <div class="MetroInspectionSatus flex-row">
                    <div class="Open flex-itemText flex-justify">
                        开机:<span class="OpenNum">{{OpenNum}}</span>
                    </div>
                    <div class="Close flex-itemText flex-justify">
                        关机:<span class="CloseNum">{{CloseNum}}</span>
                    </div>
                    <div class="Fault flex-itemText flex-justify">
                        故障:<span class="FaultNum">{{FaultNum}}</span>
                    </div>
                </div>
            </div>`,

        DeviceBody: [
            '<tr>',
            '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="DeviceNo" data-value="{{DeviceNo}}" >{{DeviceNo}}</td>',
            '<td data-title="DeviceName" data-value="{{DeviceName}}" >{{DeviceName}}</td>',
            '<td data-title="PositionText" data-value="{{PositionText}}" >{{PositionText}}</td>',
            '<td data-title="TeamName" data-value="{{TeamName}}" >{{TeamName}}</td>',

            '<td data-title="StatusText" data-value="{{StatusText}}" ><span class="badge lmvt-badge {{IsUsedBadge}}">{{Badge}}</span>{{StatusText}}</td>',
            '<td data-title="Remark" data-value="{{Remark}}">{{Remark}}</td>',
            '<td data-title="StatusTime" data-value="{{StatusTime}}">{{StatusTime}}</td>',
            '<td data-title="SumTime" data-value="{{SumTime}}">{{SumTime}}</td>',
            '<td data-title="OpenRa" data-value="{{OpenRa}}">{{OpenRa}}</td>',

            '<td style="min-width: 80px;color:#C7001A" ><div class="row" data-value="{{DeviceID}}" data-devicetypeName="{{DeviceTypeName}}" >',
            '<div class="col-md-6 lmvt-do-info  lmvt-CarWashingMachine">详情</div>',
            '<div class="col-md-6 lmvt-do-info  lmvt-history">查看历史</div>',
            '</td>',
            '</tr>',
        ].join(""),
    };

    model = $com.Model.create({
        name: '检修库',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {
            $("body").delegate(".MetroInspectionOne", "click", function () {
                $this = $(this);
                DeviceID = $this.attr("data-value");
            })


            $("body").delegate("#alfie-add-level-back", "click", function () {
                $("#contain").show();
                $(".zace-leftContain").hide();
                $(window).resize();
            });
            // window.setFunctionTrigger("PartPreCheckSegmentO", function (res) {

            //     mOrderID = res.ID;
            //     mPartNo = res.PartNo;

            //     mProductNo = res.Name;


            //     mPartNo=mProductNo+'#'+mPartNo;


            //     model.com.refresh();

            // });

            $("body").delegate(".lmvt-CarWashingMachine", "click", function () {
                $this = $(this);
                DeviceID = $this.parent(".row").attr("data-value");
                var list = {ID:DeviceID};
                var vdata = {
                    'header': "设备详情",
                    'id':"DeviceParticulars",
                    'href': './process_control/DeviceParticulars.html?'+ $com.uri.setUrlQuery(list),
                    'src': './static/images/logpng/车辆.png'
                };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("DeviceParticulars",list);

            });


            $("body").delegate(".lmvt-history", "click", function () {
                $this = $(this);
                DeviceID = $this.parent(".row").attr("data-value");

                model.com.refreshDeviceInfo(DeviceID);
            });

            //重置
            $("body").delegate("#lmvt-reset", "click", function () {
                mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 24 * 3600 * 1000);
                mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
                $("#lmvt-startTime-Send").val(mZCommitStartTime);
                $("#lmvt-endTime-Send").val(mZCommitEndTime);
            });
            //查询
            $("body").delegate("#lmvt-search", "click", function () {
                //查询开始时间
                mZCommitStartTime = $("#lmvt-startTime-Send").val();
                //查询结束时间
                mZCommitEndTime = $("#lmvt-endTime-Send").val();

                if (mZCommitStartTime == "" || mZCommitEndTime == "") {
                    mZCommitStartTime = $com.util.format("yyyy-MM-dd", new Date().getTime() - 7 * 24 * 3600 * 1000);
                    mZCommitEndTime = $com.util.format("yyyy-MM-dd", new Date().getTime() + 24 * 3600 * 1000);
                }

                model.com.refreshDeviceInfo(DeviceID);
            });
            $("#lmvt-startTime-Send").datetimepicker({
                format: 'yyyy-mm-dd',//显示格式
                startView: 'year',
                maxView: 'year',
                minView: 'month',
                language: 'zh-CN',
                autoclose: true,//选择后自动关闭
                clearBtn: true,//清除按钮
                todayBtn: true,
                showClear: true,
            }).on('changeDate', function (ev) {
                var startTime = $("#lmvt-startTime-Send").val();
                $("#lmvt-endTime-Send").datetimepicker("setStartDate", startTime);
            });
            $("#lmvt-endTime-Send").datetimepicker({
                format: 'yyyy-mm-dd',//显示格式
                startView: 'year',
                maxView: 'year',
                minView: 'month',
                language: 'zh-CN',
                autoclose: true,//选择后自动关闭
                clearBtn: true,//清除按钮
                todayBtn: true,
                showClear: true,
            }).on('changeDate', function (ev) {
                var endTime = $("#lmvt-endTime-Send").val();
                $("#lmvt-startTime-Send").datetimepicker("setEndDate", endTime.toString("yyyy-MM-dd"));
            });
            $("body").delegate(".MetroInspectionOne", "click", function () {
                var $this = $(this),
                    wAreaID = Number($this.closest("div").attr("data-value"));
                var list =""
                mCurrentArea.forEach(function (item) {
                    if (item.AreaID == wAreaID){
                        list =item;
                    }
                });
                var vdata = {
                    'header': '临线区监视',
                    'href': './process_control/CarLiftingJackReport2.html?'+ $com.uri.setUrlQuery(list),
                    'id': 'CarLiftingJackReport',
                    'src': './static/images/logpng/监控.png'
                };
                console.log(list);
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger("CarLiftingJackReport",list);
            });

        },

        run: function () {
            $(".selectpicker").selectpicker({
                noneSelectedText: '请选择',//默认显示内容
                deselectAllText: '全不选',
                selectAllText: '全选',
            });
            $("#lmvt-startTime-Send").val(mZCommitStartTime);
            $("#lmvt-endTime-Send").val(mZCommitEndTime);
            model.com.getCurrentArea({
                Name: "",
                AssetNo: "",
                DeviceType: -1,
                ModelID: -1,
                FactoryID: -1,
                WorkShopID: -1,
                LineID: -1,
                TeamID: -1,
                AreaID: -1
            }, function (res) {
                mCurrentArea = res.list;
                mCurrentDeviceStatus = {
                    DeviceCountAll: 0,
                    CloseNumAll: 0,
                    OpenNumAll: 0,
                    FaultNumAll: 0,
                    OpenRate: 0,
                    CloseRate: 0,
                    FaultRate: 0,
                };

                for (var i = 0; i < mCurrentArea.length; i++) {
                    mCurrentDeviceStatus.DeviceCountAll = mCurrentDeviceStatus.DeviceCountAll + mCurrentArea[i].DeviceCount;
                    for (x in mCurrentArea[i].StatusCount) {
                        if (x == 1) {
                            //开机
                            mCurrentArea[i].OpenNum = mCurrentArea[i].StatusCount[x];
                            mCurrentDeviceStatus.OpenNumAll = mCurrentDeviceStatus.OpenNumAll + mCurrentArea[i].OpenNum;
                            //关机
                            mCurrentArea[i].CloseNum = mCurrentArea[i].DeviceCount - mCurrentArea[i].StatusCount[x];
                            mCurrentDeviceStatus.CloseNumAll = mCurrentDeviceStatus.CloseNumAll + mCurrentArea[i].CloseNum;
                        }
                        //故障
                        if (x == 16) {
                            mCurrentArea[i].FaultNum = mCurrentArea[i].StatusCount[x];
                            mCurrentDeviceStatus.FaultNumAll = mCurrentDeviceStatus.FaultNumAll + mCurrentArea[i].FaultNum;
                        }
                    }
                }
                mCurrentDeviceStatus.OpenRate = Number((mCurrentDeviceStatus.OpenNumAll / mCurrentDeviceStatus.DeviceCountAll).toFixed(2)) * 100 + "%";
                mCurrentDeviceStatus.CloseRate = Number((mCurrentDeviceStatus.CloseNumAll / mCurrentDeviceStatus.DeviceCountAll).toFixed(2))* 100 + "%";
                mCurrentDeviceStatus.FaultRate = Number((mCurrentDeviceStatus.FaultNumAll / mCurrentDeviceStatus.DeviceCountAll).toFixed(2)) * 100 + "%";
                $(".MetroInspection").html($com.util.template(mCurrentArea, HTML.MetroContainTem));
                $(".DeviceTop").html($com.util.template(mCurrentDeviceStatus, HTML.TopTemp));
            });
            model.com.getStatusTime({
                DeviceIDList: "",
                DeviceNo: "",
                AssetNo: "",
                Name: "",
                DeviceType: -1,
                ModelID: -1,
                FactoryID: -1,
                WorkShopID: -1,
                LineID: -1,
                TeamID: -1,
                AreaID: -1,
                StartTime: "2000-1-1",
                wEndTime: "2000-1-1"
            }, function (resT) {
                mStatusTime = resT.info;
                model.com.getDeviceAllCurrent({}, function (res) {
                    mDeviceAll = res.list;
                    for (var i = 0; i < mDeviceAll.length; i++) {
                        mDeviceAll[i].StatusText = "";
                        mDeviceAll[i].SumTime = 0;
                        mDeviceAll[i].WID = i + 1;
                        var Num = Number(mDeviceAll[i].Status);
                        if (Num > 0) {
                            if ((Num & 1) > 0) {
                                if (mDeviceAll[i].StatusText.length > 0) {
                                    mDeviceAll[i].StatusText = mDeviceAll[i].StatusText + "," + "开机";
                                } else {
                                    mDeviceAll[i].StatusText = "开机";
                                }
                                mDeviceAll[i].SumTime = mDeviceAll[i].SumTime + model.com.DeviceSumTime(mStatusTime, mDeviceAll[i].DeviceID, 1);
                            }

                            if ((Num & 2) > 0) {
                                if (mDeviceAll[i].StatusText.length > 0) {
                                    mDeviceAll[i].StatusText = mDeviceAll[i].StatusText + "," + "运行";
                                } else {
                                    mDeviceAll[i].StatusText = "运行";
                                }
                                mDeviceAll[i].SumTime = mDeviceAll[i].SumTime + model.com.DeviceSumTime(mStatusTime, mDeviceAll[i].DeviceID, 2);
                            }

                            if ((Num & 4) > 0) {
                                if (mDeviceAll[i].StatusText.length > 0) {
                                    mDeviceAll[i].StatusText = mDeviceAll[i].StatusText + "," + "停止";
                                } else {
                                    mDeviceAll[i].StatusText = "停止";
                                }
                                mDeviceAll[i].SumTime = mDeviceAll[i].SumTime + model.com.DeviceSumTime(mStatusTime, mDeviceAll[i].DeviceID, 4);
                            }
                            if ((Num & 8) > 0) {
                                if (mDeviceAll[i].StatusText.length > 0) {
                                    mDeviceAll[i].StatusText = mDeviceAll[i].StatusText + "," + "急停";
                                } else {
                                    mDeviceAll[i].StatusText = "急停";
                                }
                                mDeviceAll[i].SumTime = mDeviceAll[i].SumTime + model.com.DeviceSumTime(mStatusTime, mDeviceAll[i].DeviceID, 8);
                            }
                            if ((Num & 16) > 0) {
                                if (mDeviceAll[i].StatusText.length > 0) {
                                    mDeviceAll[i].StatusText = mDeviceAll[i].StatusText + "," + "报警";
                                } else {
                                    mDeviceAll[i].StatusText = "报警";
                                }
                                mDeviceAll[i].SumTime = mDeviceAll[i].SumTime + model.com.DeviceSumTime(mStatusTime, mDeviceAll[i].DeviceID, 16);
                            }
                            if ((Num & 32) > 0) {
                                if (mDeviceAll[i].StatusText.length > 0) {
                                    mDeviceAll[i].StatusText = mDeviceAll[i].StatusText + "," + "手动";
                                } else {
                                    mDeviceAll[i].StatusText = "手动";
                                }
                                mDeviceAll[i].SumTime = mDeviceAll[i].SumTime + model.com.DeviceSumTime(mStatusTime, mDeviceAll[i].DeviceID, 32);
                            }
                            if ((Num & 64) > 0) {
                                if (mDeviceAll[i].StatusText.length > 0) {
                                    mDeviceAll[i].StatusText = mDeviceAll[i].StatusText + "," + "自动";
                                } else {
                                    mDeviceAll[i].StatusText = "自动";
                                }
                                mDeviceAll[i].SumTime = mDeviceAll[i].SumTime + model.com.DeviceSumTime(mStatusTime, mDeviceAll[i].DeviceID, 64);
                            }
                            if ((Num & 128) > 0) {
                                if (mDeviceAll[i].StatusText.length > 0) {
                                    mDeviceAll[i].StatusText = mDeviceAll[i].StatusText + "," + "预留";
                                } else {
                                    mDeviceAll[i].StatusText = "预留";
                                }
                                mDeviceAll[i].SumTime = mDeviceAll[i].SumTime + model.com.DeviceSumTime(mStatusTime, mDeviceAll[i].DeviceID, 128);
                            }
                        } else {
                            mDeviceAll[i].StatusText = "关机";
                        }
                        mDeviceAll[i].SumTime = model.com.timeStamp(mDeviceAll[i].SumTime);
                    }
                    $(".lmvt-device-body").html($com.util.template(mDeviceAll, HTML.DeviceBody));
                });
            });

        },


        com: {
            refreshDeviceInfo: function (DeviceID) {
                $com.app.loading('数据加载中...');
                model.com.getDeviceInfo({
                    DeviceID: DeviceID,
                    DeviceNo: "",
                    AssetNo: "",
                    StartTime: mZCommitStartTime,
                    wEndTime: mZCommitEndTime
                }, function (res) {
                    DeviceInfoHistory = res.list;
                    $("#contain").hide();
                    $(".zace-leftContain").show();
                    mData = $com.util.Clone(DeviceInfoHistory);
                    mDeviceAll = $com.util.Clone(DeviceInfoHistory);
                    for (var i = 0; i < mDeviceAll.length; i++) {
                        mDeviceAll[i].StatusText = "";
                        mDeviceAll[i].SumTime = 0;
                        mDeviceAll[i].WID = i + 1;
                        var Num = Number(mDeviceAll[i].Status);
                        if (Num > 0) {
                            if ((Num & 1) > 0) {
                                if (mDeviceAll[i].StatusText.length > 0) {
                                    mDeviceAll[i].StatusText = mDeviceAll[i].StatusText + "," + "开机";
                                } else {
                                    mDeviceAll[i].StatusText = "开机";
                                }
                                mDeviceAll[i].SumTime = mDeviceAll[i].SumTime + model.com.DeviceSumTime(mStatusTime, mDeviceAll[i].DeviceID, 1);
                            }

                            if ((Num & 2) > 0) {
                                if (mDeviceAll[i].StatusText.length > 0) {
                                    mDeviceAll[i].StatusText = mDeviceAll[i].StatusText + "," + "运行";
                                } else {
                                    mDeviceAll[i].StatusText = "运行";
                                }
                                mDeviceAll[i].SumTime = mDeviceAll[i].SumTime + model.com.DeviceSumTime(mStatusTime, mDeviceAll[i].DeviceID, 2);
                            }

                            if ((Num & 4) > 0) {
                                if (mDeviceAll[i].StatusText.length > 0) {
                                    mDeviceAll[i].StatusText = mDeviceAll[i].StatusText + "," + "停止";
                                } else {
                                    mDeviceAll[i].StatusText = "停止";
                                }
                                mDeviceAll[i].SumTime = mDeviceAll[i].SumTime + model.com.DeviceSumTime(mStatusTime, mDeviceAll[i].DeviceID, 4);
                            }
                            if ((Num & 8) > 0) {
                                if (mDeviceAll[i].StatusText.length > 0) {
                                    mDeviceAll[i].StatusText = mDeviceAll[i].StatusText + "," + "急停";
                                } else {
                                    mDeviceAll[i].StatusText = "急停";
                                }
                                mDeviceAll[i].SumTime = mDeviceAll[i].SumTime + model.com.DeviceSumTime(mStatusTime, mDeviceAll[i].DeviceID, 8);
                            }
                            if ((Num & 16) > 0) {
                                if (mDeviceAll[i].StatusText.length > 0) {
                                    mDeviceAll[i].StatusText = mDeviceAll[i].StatusText + "," + "报警";
                                } else {
                                    mDeviceAll[i].StatusText = "报警";
                                }
                                mDeviceAll[i].SumTime = mDeviceAll[i].SumTime + model.com.DeviceSumTime(mStatusTime, mDeviceAll[i].DeviceID, 16);
                            }
                            if ((Num & 32) > 0) {
                                if (mDeviceAll[i].StatusText.length > 0) {
                                    mDeviceAll[i].StatusText = mDeviceAll[i].StatusText + "," + "手动";
                                } else {
                                    mDeviceAll[i].StatusText = "手动";
                                }
                                mDeviceAll[i].SumTime = mDeviceAll[i].SumTime + model.com.DeviceSumTime(mStatusTime, mDeviceAll[i].DeviceID, 32);
                            }
                            if ((Num & 64) > 0) {
                                if (mDeviceAll[i].StatusText.length > 0) {
                                    mDeviceAll[i].StatusText = mDeviceAll[i].StatusText + "," + "自动";
                                } else {
                                    mDeviceAll[i].StatusText = "自动";
                                }
                                mDeviceAll[i].SumTime = mDeviceAll[i].SumTime + model.com.DeviceSumTime(mStatusTime, mDeviceAll[i].DeviceID, 64);
                            }
                            if ((Num & 128) > 0) {
                                if (mDeviceAll[i].StatusText.length > 0) {
                                    mDeviceAll[i].StatusText = mDeviceAll[i].StatusText + "," + "预留";
                                } else {
                                    mDeviceAll[i].StatusText = "预留";
                                }
                                mDeviceAll[i].SumTime = mDeviceAll[i].SumTime + model.com.DeviceSumTime(mStatusTime, mDeviceAll[i].DeviceID, 128);
                            }
                        } else {
                            mDeviceAll[i].StatusText = "关机";
                        }
                        mDeviceAll[i].SumTime = model.com.timeStamp(mDeviceAll[i].SumTime);
                    }
                    //数据源字段模板转换
                    var wItem = $com.util.Clone(mDeviceAll);

                    $.each(wItem, function (i, item) {
                        if (item.Active == 1) {
                            item.Switch = "switchTrue";
                        } else {
                            item.Switch = "switchFalse";
                        }
                        item.WID = i + 1;
                    });
                    mCloneData = $com.util.Clone(wItem);
                    $("#femi-Device-tbody-item").html($com.util.template(wItem, HTML.TableNode_item));
                    $(window).resize();
                    $com.app.loaded();
                });
            },
            DeviceSumTime: function (mStatusTime, DeviceID, DeviceStatus) {
                var SumTime = 0;
                for (x in mStatusTime) {
                    if (DeviceID == x) {
                        for (y in mStatusTime[x]) {
                            if (y == DeviceStatus) {
                                SumTime = mStatusTime[x][y];
                            }
                        }
                    }
                }
                return SumTime
            },
            timeStamp: function (second_time) {
                var time = parseInt(second_time) + "秒";
                if (parseInt(second_time) > 60) {

                    var second = parseInt(second_time) % 60;
                    var min = parseInt(second_time / 60);
                    time = min + "分" + second + "秒";

                    if (min > 60) {
                        min = parseInt(second_time / 60) % 60;
                        var hour = parseInt(parseInt(second_time / 60) / 60);
                        time = hour + "小时" + min + "分" + second + "秒";

                        if (hour > 24) {
                            hour = parseInt(parseInt(second_time / 60) / 60) % 24;
                            var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
                            time = day + "天" + hour + "小时" + min + "分" + second + "秒";
                        }
                    }
                }

                return time;
            },

            IsActive($this, Temp) {
                $this.find("figure").removeClass("circle-Active");
                $this.find("figure").removeClass("circle-forbidden");
                if (Temp == 1) {
                    $this.find("figure").addClass("circle-Active");
                } else {
                    $this.find("figure").addClass("circle-forbidden");
                }
            },
            //获取当前区域
            getCurrentArea: function (data, fn, context) {
                var d = {
                    $URI: "/DMSDeviceStatus/CurrentArea",
                    $TYPE: "Get",
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取所有设备
            getDeviceAllCurrent: function (data, fn, context) {
                var d = {
                    $URI: "/DMSDeviceStatus/Current",
                    $TYPE: "Get",

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取所有设备时长
            getStatusTime: function (data, fn, context) {
                var d = {
                    $URI: "/DMSDeviceStatus/StatusTime",
                    $TYPE: "Get",

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            //获取单条设备
            getDeviceInfo: function (data, fn, context) {
                var d = {
                    $URI: "/DMSDeviceStatus/DeviceInfo",
                    $TYPE: "Get",

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        }
    }),

        model.init();


});