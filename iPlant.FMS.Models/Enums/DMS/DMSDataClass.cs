using System.ComponentModel;

namespace iPlant.FMS.Models
{
    public enum DMSDataClass : int
    {
        [Description("默认")]
        Default = 0,
        [Description("实时状态")]
        Status = 1,
        [Description("实时报警")]
        Alarm = 2,
        [Description("实时参数")]
        Params = 3,
        /// <summary>
        /// 包含作业信息 订单信息 工件信息  请求信号为作业完成信号
        /// </summary>
        [Description("作业参数")]
        WorkParams = 4,
        [Description("能源参数")]
        PowerParams = 5,

        [Description("质量参数")]
        QualityParams = 6,

        /// <summary>
        /// 订单请求 /  上料请求信号
        /// </summary>
        [Description("控制参数")]
        ControlData = 7,
        /// <summary>
        /// 工艺参数,用于向指定设备下发的生产配方  请求信号为上料完成信号
        /// </summary>
        [Description("工艺参数")]
        TechnologyData = 8,

        /// <summary>
        /// 位置参数
        /// </summary>
        [Description("位置参数")]
        PositionData = 9,

    }

    public enum DMSDataActions : int
    {
        [Description("默认")]
        Default = 0,
        [Description("可读")]
        ReadOnly = 1,
        [Description("可写")]
        WriteOnly = 2,
        [Description("可读可写")]
        ReadWrite = 3,
        [Description("实时监听")]
        Monitor = 4,
        [Description("轮询采集")]
        Sample = 5,

    }
}
