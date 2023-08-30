using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum WMSAgvTaskTypes : int
    {
        [Description("默认")]
        Default = 0,
        [Description("废料下线")]
        Scrap = 1,
        [Description("成品下线")]
        Product = 2,

    }

    public enum WMSTargetPosition : int
    {
        [Description("默认")]
        Default = 0,
        [Description("废料库")]
        Scrap = 1,
        [Description("成品库")]
        Product = 2,

    }

    public enum WMSAgvTaskStatus : int
    {
        [Description("默认")]
        Default = 0,
        /// <summary>
        /// 待确认
        /// </summary>
        [Description("待确认")]
        WiatConfirm = 1,
        /// <summary>
        /// 待执行  已确认
        /// </summary>
        [Description("待执行")]
        WaitStart = 2,
        /// <summary>
        /// 执行中
        /// </summary>
        [Description("执行中")]
        Staring = 3,
        /// <summary>
        /// 已开始  到达起点开始执行任务
        /// </summary>
        [Description("已开始")]
        Started = 4,
        /// <summary>
        /// 已结束  到达终点任务等待结束
        /// </summary>
        [Description("已结束")]
        Arrived = 5,
        /// <summary>
        /// 任务结束  AGV回原位
        /// </summary>
        [Description("已完成")]
        End = 7,
        /// <summary>
        /// 任务取消  AGV回原位
        /// </summary>
        [Description("已撤销")]
        Cancle = 8,

    }
}
