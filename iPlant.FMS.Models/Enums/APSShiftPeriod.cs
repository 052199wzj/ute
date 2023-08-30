using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum APSShiftPeriod : int
    {
        [Description("默认")]
        Default = 0, 
        [Description("天")]
        Day = 4,
        [Description("周")]
        Week = 5,
        [Description("月")]
        Month = 6,
        [Description("年")]
        Year = 7
    }
}
