using System.ComponentModel;

namespace iPlant.FMS.Models
{
    public enum DMSStatTypes : int
    {
        [Description("默认")]
        Default = 0,
        [Description("日")]
        Day = 1,
        [Description("周")]
        Week = 2,
        [Description("月")]
        Month = 3,
        [Description("季")]
        Quarter = 4,
        [Description("年")]
        Year = 5,
    }
}
