using System.ComponentModel;

namespace iPlant.FMS.Models
{
    public enum DMSRecordTypes : int
    {
        [Description("默认")]
        Default = 0,
        /// <summary>
        /// 加工
        /// </summary>
        [Description("加工")]
        Product = 1,
        /// <summary>
        /// 检测
        /// </summary>
        [Description("检测")]
        Check = 2,
        /// <summary>
        /// 抽检
        /// </summary>
        [Description("抽检")]
        SpotCheck = 3,
        /// <summary>
        /// 返修
        /// </summary>
        [Description("返修")]
        Repair = 4

    }
}
