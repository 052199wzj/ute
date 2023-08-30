define(['../jquery-3.1.1', './base', './paging'], function ($jq, $com, $page) {

    var BackGround = [
        '<div class="modal fade in lmvt-backdrop" style="display:block">',
        '<div class="modal-dialog" style="min-width:1000px;display:block">',
        '<div class="modal-content">',
        '<div class="modal-header">',
        '<button type="button" style="margin-left:10px" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
        '<div class="row form-inline">',
        '<div>',
        '<label class="form-inline" />物料名称：',
        '<input style="margin: 0 5px 0 5px;" type="text" class="form-control lmvt-MaterialName" /></label>',
        '<label class="form-inline" />物料编码：',
        '<input style="margin: 0 5px 0 5px;" type="text" class="form-control lmvt-MaterialNo" /></label>',
        '<label class="form-inline" />',
        '<div class="btn-group" role="group">',

        '<button type="button" class="btn lmvt-danger-btn lmvt-search">查询</button>',
        '<button type="button" class="btn lmvt-def-btn lmvt-empty">清空</button>',
        '</div>',
        '<div class="columns columns-right btn-group pull-right">',
        '<div class="btn-group femi-lf pull-left" role="group">',

        '</div>',
        '<button type="button" class="btn lmvt-def-btn" style="padding: 0">',
        '<input v-on:keyup.enter="searchLevel" type="text" id="zace-search"',
        'style="border:none; border-radius:4px; margin: 0;padding: 6px 12px; outline: none;"',
        'placeholder="请输入筛选字符" />',
        '</button>',
        '<button @click="searchlevelProGrade" type="button" id="zace-search-levelPro"',
        'class="btn lmvt-def-btn">',
        '<span class="glyphicon " aria-hidden="true"></span>筛选',
        '</button>',
        '</div>',
        '</div>',
        '</div>',
        '</div>',
        '<div class="modal-body">',
        '<div class="femi-tb-scroll table-part">',
        '<table class="table table-hover table-bordered lmvt-Material">',
        '<thead class="cby-thead-style">',
        '<tr>',
        // '<th style="width: 3px">',
        // '<input type="checkbox"',
        // 'class="femi-tb-checkbox" style="margin: 1px 0px 1px"',
        // 'value="{{functionID}}" />',
        // '</th>',
        // '<th style="min-width: 50px" data-order="WID">序号</th>',
        '<th style="max-width: 150px;display:none" data-order="ID">编号</th>',
        '<th style="max-width: 150px" data-order="MaterialName">物料名称</th>',
        '<th style="max-width: 150px" data-order="MaterialNo">物料编码</th>',
        '<th style="min-width: 80px" data-order="Groes">规格型号</th>',
        '<th style="min-width: 80px" data-order="CYUnitID">常用计量单位</th>',
        '<th style="max-width: 150px" data-order="">操作</th>',
        '</tr>',
        '</thead>',
        '<tbody class="lmvt-table"></tbody>',
        '</table>',
        '</div>',
        '</div>',
        '<div class="modal-footer"></div>',
        '</div>',
        '</div>',
        '</div>',
        '<div class="modal-backdrop fade in lmvt-backdrop">',
        '</div>'
    ].join("");

    var TableTemplate = [
        '<tr>',
        // '<td style="min-width: 80px" data-title="WID" data-value="{{WID}}">{{WID}}</td>',
        '<td style="min-width: 80px;display:none" data-title="ID" data-value="{{ID}}">{{ID}}</td>',
        '<td style="min-width: 80px" data-title="MaterialName" data-value="{{MaterialName}}">{{MaterialName}}</td>',
        '<td style="min-width: 80px" data-title="MaterialNo" data-value="{{MaterialNo}}">{{MaterialNo}}</td>',
        '<td style="min-width: 80px" data-title="Groes" data-value="{{Groes}}">{{Groes}}</td>',
        '<td style="min-width: 80px" data-title="CYUnitID" data-value="{{CYUnitID}}">{{CYUnitID}}</td>',
        '<td style="min-width: 50px;color:#C7001A" data-title="ID" data-value="{{ID}}"><div class="row">',
        '<div class="col-md-12 lmvt-code-edit lmvt-do-info">选择</div>',
        '</td>',
        '</tr>'
    ].join("");
    //所有数据
    var DataAll;

    //渲染表格数据
    var TableSource;

    var getSource = function (data) {
        if (CompleteFn) {
            CompleteFn(data);
        }
    };

    var CompleteFn = function (res) { };

    var init = function (data, fn) {

        if (!data)
            return;

        if (!fn)
            return;

        CompleteFn = fn;

        DataAll = data;

        if (!$(".lmvt-backdrop") || $(".lmvt-backdrop").length <= 0) {
            $("body").append(BackGround);

            var randerTableSource = function (Data) {
                $page.init($(".lmvt-Material"), Data, "", function (res) {
                    $(".lmvt-backdrop .lmvt-table").html($com.util.template(res, TableTemplate));
                });
                TableSource = Data;
            }

            randerTableSource(DataAll);

            var BackSource = function (data) {

            }

            //选择
            $("body").delegate(".lmvt-code-edit", "click", function () {
                var $this = $(this),
                    wDBID = Number($this.parents("td").attr("data-value"));

                const SelectObj = DataAll.filter(item => item.ID == wDBID)[0];

                BackSource = getSource(SelectObj);

                $(".lmvt-backdrop").hide();
            });

            //查询
            $("body").delegate(".lmvt-search", "click", function () {

                var MaterialNo = $(".lmvt-MaterialNo").val(),
                    MaterialName = $(".lmvt-MaterialName").val();

                getmaterialRecord({ material_no: MaterialNo, material_name: MaterialName, type_id: 0, status: 0, PageSize: 0 }, function (res) {
                    if (!res)
                        return;
                    if (res && res.list) {

                        randerTableSource(res.list);

                    }
                });


            });

            //查询所有物料
            var getmaterialRecord = function (data, fn, context) {
                var d = {
                    $URI: "/Material/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            };

            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    var $this = $(this),
                        value = $("#zace-search").val();
                    if (value == undefined || value == "" || value.trim().length < 1)
                        $(".lmvt-backdrop .lmvt-table").children("tr").show();
                    else
                        $com.table.filterByLikeString($(".lmvt-backdrop .lmvt-table"), TableSource, value, "ID");
                }
            });
            //查询
            $("body").delegate("#zace-search-levelPro", "click", function () {

                var $this = $(this),
                    value = $("#zace-search").val();
                if (value == undefined || value == "" || value.trim().length < 1)
                    $(".lmvt-backdrop .lmvt-table").children("tr").show();
                else
                    $com.table.filterByLikeString($(".lmvt-backdrop .lmvt-table"), TableSource, value, "ID");
            });
            //清空
            $("body").delegate(".lmvt-empty", "click", function () {

                $(".lmvt-MaterialNo").val("");
                $(".lmvt-MaterialName").val("");

                randerTableSource(DataAll);

            });
            //关闭
            $("body").delegate(".close", "click", function () {
                $(".lmvt-backdrop").hide();
            });
        } else {
            $(".lmvt-backdrop").show();
        }
    };

    return {
        init: init,
    }
}); 