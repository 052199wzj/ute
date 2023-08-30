using System.ComponentModel;

namespace iPlant.FMS.Models
{
    public enum QMSParameterTypes : int
    {
        [Description("默认")]
        Default = 0,
        [Description("三坐标")]
        ThreeDimensional = 1,
        [Description("抽检")]
        SpotCheck = 2, 

    }
}
