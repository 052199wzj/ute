define(["../jquery-3.1.1", "./base"], function ($yang, $com) {

    var Options = {
        TypeSource: [],
        KEYWORD_LIST: [],
        DATA: [],
        DefaultSelect: [],
        IndexTitle: "ID",
        multiple: false,
        splitChar:",",
        changed: function () { }
    };

    var DataTemp = {
        PrevID: 0,
        NextID: 0,
        ID: 0,
        Text: ""
    };

    var DataArray = [
        {
            PrevID: 0,
            NextID: 0,
            ID: 0,
            Text: ""
        },
        {
            PrevID: 0,
            NextID: 0,
            ID: 0,
            Text: ""
        },
        {
            PrevID: 0,
            NextID: 0,
            ID: 0,
            Text: ""
        }, {
            PrevID: 0,
            NextID: 0,
            ID: 0,
            Text: ""
        }
    ]; 


    var HTML = (function () {
        return {
            Table: ['<div class="femi-tb-scroll">',
                '<table class="table   table-hover table-bordered"> ',
                '<thead> <tr> <th style="width: 3px"><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /> </th>{{th_Items}}</tr>',
                '</thead><tbody>{{tr_Items}}</tbody>  </table> </div>'
            ].join(""),

            Th: ['<th style="min-width: 50px" data-title="{{name}}">{{title}}</th>'
            ].join(""),
            Tr: ['<tr ><td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>{{td_Items}}</tr>'
            ].join(""),
            Td: ['<td data-title="{{name}}" data-value="{{value}}" >{{value}}</td>'
            ].join(""),

            TableSelect: ['<div class="table-select">{{value}}</div>'
            ].join(""),

            Select: [
                '<div class="table-select">',
                     '<div class="table-select-drop">',
                        '<div class="table-select-drop-in">',
                            '<input  type="text" class="femi-rt"   />',
                            '<span  class="table-select-drop-right femi-rt glyphicon glyphicon-triangle-bottom"  />',
                         '</div>',
                     '</div>',
                     '<div class="table-select-view" style="display:none">',
                        '<div class="femi-tb-scroll">',
                            '<table class="table   table-hover table-bordered"> ',
                                '<thead> <tr> <th style="width: 3px"><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /> </th>{{th_Items}}</tr>',
                                '</thead><tbody>{{tr_Items}}</tbody>',
                            '</table>',
                        '</div>',
                     '</div>',
                '</div>'
            ].join(""),
        };
    })();

    $.fn.tableselect = function (Options) {
        var $this = $(this);
        if (!Options)
            return;

        var _tableView = CreateTableData(Options);

        $this.html($com.util.template(_tableView.table, HTML.Select));

        if (!Options.multiple) {
            $this.find(".table-select .table-select-view table.table thead tr input[type=checkbox].femi-tb-checkbox").remove();
        }
 


        $this.find(".table-select-drop .table-select-drop-in input").focus();

        $this.blur(function () {
            //失去焦点隐藏此表格
            var $table = $this.find("table"),
                $tableView = $this.find(".table-select-view");

            $tableView.hide();
        });

        $this.find(".table-select .table-select-drop .table-select-drop-in .table-select-drop-right,input").click(function () {
            //显示表格 
            var $this = $(this),
                $table = $this.closest(".table-select").find("table"),
                  $tableView = $this.closest(".table-select").find(".table-select-view");

            if ($tableView.is(":hidden")) {

                $tableView.show();


                if (!Options.multiple)
                    $table.find("tbody tr td:first input[type=checkbox].femi-tb-checkbox").attr("checked", false);
            } else {

                $tableView.hide();
                if (!Options.multiple) {
                    _Selected.splice(0, _Selected.length);
                    $table.find("tbody tr td:first input[type=checkbox].femi-tb-checkbox").attr("checked", false); 
                }
                   
            }
                

        });

        $this.find(".table-select .table-select-drop .table-select-drop-in input").change(function () {
            //显示的表格模糊查询 
            var $this = $(this),
                value = $this.val(),
                $table = $this.closest(".table-select").find("table");
            var valueArray = value ? value.split(" " + Options.splitChar + " ") : [""];
            value = valueArray[valueArray.length - 1];

            $com.table.filterByLikeString($table.find("tbody"), Options.DATA, value, Options.IndexTitle, _tableView.FORMATTRT);
        });
 
        var _Selected = [];
     
        var selectTimer = window.setInterval(function () {
            var $input = $this.find(".table-select-drop .table-select-drop-in input"),
               value = $input.val(),
               $table = $this.find("table"),
               $tableView = $this.find(".table-select-view");

            if ($tableView.is(":hidden"))
                return;

            var titles = $com.table.getSelectionTitle($table.find("tbody"), Options.IndexTitle);
            var wIsSame = true;
            if (_Selected.length == titles.length) {
                for (var i = 0; i < titles.length; i++) {
                    if (titles[i] == _Selected[i])
                        continue;

                    wIsSame = false;
                    break;
                }
            } else {
                wIsSame = false;
            }
            if (wIsSame) {
                return;
            }
            _Selected = titles;

            $input.val(_Selected.join(" " + Options.splitChar + " "));

            if (Options.changed)
                Options.changed(_Selected);

            if (!Options.multiple) {
                $tableView.hide();
                _Selected.splice(0, _Selected.length);
                $tableView.find("table.table  tr input[type=checkbox].femi-tb-checkbox").prop("checked", false);
            }


        }, 100);
         
    };



    $.fn.tableshow = function (Options) {

        var $this = $(this);
        if (!Options)
            return;

        var _tableView = CreateTableData(Options);

        $this.html($com.util.template(_tableView.table, HTML.Table));
    };



    var CreateTableData = function (Options) {

        var KEYWORD_LIST = Options.KEYWORD_LIST,
            DATA = Options.DATA,
            TypeSource = Options.TypeSource,
            Result = {
                table: {
                    th_Items: "",
                    tr_Items: ""
                },
                FORMATTRT: {}
            };



        if (!DATA)
            return Result;

        var KEYWORD = {},
            FORMATTRT = {},
            TH_Title = [],
            TR_Contain = [];


        $.each(KEYWORD_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            TH_Title.push({ name: detail[0], title: detail[1] });
            if (detail.length > 2) {
                FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource, detail[0], detail[2]);
            }
        });

        var _list = $com.util.Clone(DATA);

        $.each(_list, function (i, item) {
            var TD_Title = [];
            for (var p in item) {
                var _itemTitle = { name: p, value: item[p] };
                TD_Title.push(_itemTitle);

                if (!FORMATTRT[p])
                    continue;
                item[p] = FORMATTRT[p](item[p]);
                _itemTitle.value = item[p];
            }
            TR_Contain.push({ td_Items: $com.util.template(TD_Title, HTML.Td) });
        });
        Result.table = {
            th_Items: $com.util.template(TH_Title, HTML.Th),
            tr_Items: $com.util.template(TR_Contain, HTML.Tr)
        };
        Result.FORMATTRT = FORMATTRT;
        return Result;
    }







});