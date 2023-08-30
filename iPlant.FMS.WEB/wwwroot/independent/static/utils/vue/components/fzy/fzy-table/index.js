/**
 * 基础表格组件
 * @param {Array} tableHead     表头
 * @param {Array} tableData     数据
 *
 * @slot
 *      index 默认显示序号
 *      其他插槽需在table-head中定义slot
 *          @slot.param index    当前行下标
 *          @slot.param row      当前行数据   tableData
 *          @slot.param column   当前列数据   tableHead
 *
 */

/*
示例：
label   必传  表头显示的文字
key     必传  data中对应的变量名
type    需要特殊处理的数据
    index:  序号
    time:   转换为时间格式
slot    插槽名称
width   当前列宽度,单位px  默认auto

var tableHead = [
    { label: '序号', type: 'index' },
    { label: '车号', key: 'PartNo' },
    { label: '时间', key: 'PlanReceiveDate' ,type:'time'},
    { label: '订单状态', slot: 'status' },
    { label: '操作', slot: 'operation' },
];

ar tableData =[...];


<fzy-table
        :table-data="tableData"
        :table-head="tableHead"
        class="fzy-table"
    >
    <template #operation="data">
        <div
            @click="editClick(data.row,data.index)"
        >
            编辑
        </div>
    </template>
</fzy-table>
 */

define([
    '../../../../js/base/base',
], function ($com) {
    var minTime = new Date('2020-01-01 00:00:00');

    function effectiveDate(e, defaultStr) {
        if (!e) {
            return defaultStr;
        }
        var now = new Date(e);
        return now > minTime ? e : defaultStr;
    }

    var http = {
        // 通用导出接口
        postExportExcel: function (data, fn, context) {
            var d = {$URI: '/Upload/ExportExcel', $TYPE: 'post'};

            function err() {
                $com.app.tip('提交失败，请检查网络');
            }

            $com.app.ajax($.extend(d, data), fn, err, context);
        },
        //通用导入接口
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
    };

    var template = `
        <table class="fzy-table">
            <thead>
                <tr>
                    <template
                      v-for="(column,index) in tableHead"
                      :key="index"
                    >
                        <th
                            :width="column.width | width"
                        > 
                            {{ column.label }} 
                        </th>
                    </template>
                </tr>
            </thead>
            <tbody v-if="tableData.length">
                <tr v-for="(row,index) in tableData" :key="index">
                    <template
                     v-for="(column,index_) in tableHead"
                     :key="index_"
                    >
                        <td>  
                            <!-- 序号 -->
                            <template v-if="column.type==='index'">
                                {{ index + 1 }}
                            </template>
                            
                            <!-- 时间 -->
                            <template v-else-if="column.type==='time'">
                                {{ row[column.key] | time }}
                            </template>
                            
                            <!-- 自定义插槽 -->
                            <slot v-else :name="column.slot" :row="row" :column="column" :index="index" >
                                {{ row[column.key] }}
                            </slot>
                            
                        </td>
                  </template>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td :colspan="tableHead.length">暂无数据</td>
                </tr>
            </tbody>
        </table>
    `;
    return {
        name: 'fzyTable',
        template: template,
        props: {
            tableHead: {type: Array},
            tableData: {type: Array},
        },
        filters: {
            width: function (e) {
                var n = Number(e);
                return isNaN(n) ? 'auto' : n + 'px';
            },
            time: function (e) {
                return effectiveDate(e, '-');
            },
        },
        methods: {
            // 将表单数据转换为导出excel需要的数据
            // 除了index未作其他特殊处理
            getExcelParams: function (title, fileName) {
                var that = this;

                if (!that.tableData.length) alert('当前表格无数据！');

                var head = {}, order = [], data = $com.util.Clone(that.tableData);

                that.tableHead.forEach(function (item) {
                    // order and head
                    if (item.key) {
                        head[item.key] = item.label;
                        order.push(item.key);
                    } else if (item.type === 'index') {
                        head.sequence = '序号';
                        order.push('sequence');
                    }
                    // time
                    if (item.type === 'time') {
                        data.forEach(function (row) {
                            row[item.key] = effectiveDate(row[item.key], '');
                        });
                    }
                });

                if (head.sequence === '序号') {
                    data.forEach(function (item, index) {
                        item.sequence = index + 1;
                    });
                }

                return {
                    AssetNoString: '',
                    Title: title,
                    fileName: fileName,
                    head: head,
                    order: order,
                    data: data,
                };
            },
            // 下标转换 只能转换string  数组及对象需自行处理
            transformation: function (data, rule) {
                data.forEach(function (row) {
                    for (let rowKey in row) {
                        var rowItem = row[rowKey];
                        ruleFor:for (let ruleKey in rule) {
                            var ruleItem = rule[ruleKey];
                            if (rowKey === ruleKey) {
                                if (typeof ruleItem[0] === 'string') {
                                    var indexOf = ruleItem.indexOf(rowItem);
                                    if (indexOf > -1) {
                                        row[rowKey] = indexOf;
                                        break ruleFor;
                                    } else {
                                        row[rowKey] = ruleItem[rowItem];
                                        break ruleFor;
                                    }
                                } else {
                                    for (let ruleElementKey in ruleItem) {
                                        var item = ruleItem[ruleElementKey];
                                        if (rowItem === item.ID) {
                                            row[rowKey] = item.Name;
                                            break ruleFor;
                                        } else if (rowItem === item.Name) {
                                            row[rowKey] = item.ID;
                                            break ruleFor;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            },
            // 导出excel
            exportExcel: function (excelParams) {
                http.postExportExcel(excelParams, function (res) {
                    var src = res.info.path;
                    if (src.indexOf('iPlantSCADA') !== -1) {
                        window.open(src);
                        alert('导出成功');
                    } else {
                        window.open('/iPlantSCADA' + src);
                    }
                });
            },
            // 导入excel 将excel转换为JSON后续自行处理
            importExcel: function (callback) {
                var that = this;
                var fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.value = '';
                fileInput.oninput = fileOninput;
                fileInput.click();

                function fileOninput() {

                    if (this.files.length === 0) return false;

                    if (!extLimit(['xlsx', 'xls']).has(this.files[0].name)) {
                        alert('请上传正确的Excel文件！');
                        return;
                    }
                    var form = new FormData();
                    form.append('file', this.files[0]);

                    http.postImportExcel(form, function (res) {
                        var list = res.list,
                            head = that.tableHead;
                        if (!list.length) return false;
                        var newData = [];
                        list.forEach(function (row) {
                            var newRow = {};
                            head.forEach(function (item, index) {
                                if (item.key) {
                                    newRow[item.key] = row[item.label];
                                }

                            });
                            newData.push(newRow);
                        });

                        callback(newData);

                    });


                }

                function extLimit(exts) {
                    return {
                        has: function (file) {
                            var arr = file.split('.'),
                                ext = arr[arr.length - 1].toLowerCase();

                            return exts.indexOf(ext) > -1;
                        },
                    };
                }


            },
        },
    };
});
