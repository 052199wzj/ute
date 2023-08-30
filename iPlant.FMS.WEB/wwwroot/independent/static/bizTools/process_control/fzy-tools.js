var fzyTools = {
    vue: {
        filters: {
            // 百分号
            percent: function (e) {
                return (e * 100).toFixed(2) + '%';
            },
            // 设备状态 -- DMSDeviceStatus
            deviceStatus: function (e) {
                if (e === 0) return '关机';
                if (e & 1) return '开机';
                if (e & 2) return '运行';
                if (e & 4) return '停止';
                if (e & 8) return '急停';
                if (e & 16) return '报警';
                if (e & 32) return '手动';
                if (e & 64) return '自动';
                if (e & 128) return '预留';
            },
            // ms 转时分秒
            toDHMS: function (ms) {
                var days = parseInt(ms / (60 * 60 * 24));
                var hours = parseInt((ms % (60 * 60 * 24)) / (60 * 60));
                var minutes = parseInt((ms % (60 * 60)) / ( 60));
                var seconds = parseInt(ms % (60));
                var str = '';
                days && (str += days + " 天 ");
                hours && (str += hours + " 小时 ");
                minutes && (str += minutes + " 分钟 ");
                str += (seconds + " 秒 ");
                return str;
            },
        },
        methods: {
            // 获取机器状态 -- DMSDeviceStatus
            getStatus(statusObj) {
                var status = {
                    off: 0, // 关机
                    on: 0,// 开机
                    operation: 0, // 运行
                    stop: 0, // 停止
                    jerk: 0, // 急停
                    alarm: 0, // 报警 - 故障
                    manual: 0, // 手动
                    auto: 0, // 自动
                    reserved: 0, // 预留
                };
                for (var item in statusObj) {
                    if (item === 0) status.off += statusObj[item];
                    else if (item & 1) status.on += statusObj[item];
                    else if (item & 2) status.operation += statusObj[item];
                    else if (item & 4) status.stop += statusObj[item];
                    else if (item & 8) status.jerk += statusObj[item];
                    else if (item & 16) status.alarm += statusObj[item];
                    else if (item & 32) status.manual += statusObj[item];
                    else if (item & 64) status.auto += statusObj[item];
                    else if (item & 128) status.reserved += statusObj[item];
                }
                return status;
            },
        }
    },
    html: {
        // 获取节点
        getDom: function (name) {
            dom = this[name];
            return Array.isArray(dom) ? dom.join('') : dom;
        },
        // 下拉框
        selectOptions: '<option value="{{value}}" data-value = {{code}} >{{name}}</option>',
    }
};