using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum FMCShiftLevel : int
    {
        [Description("默认")]
        Default = 0, 
        [Description("白班")]
        Day = 1,
        [Description("中班")]
        Middle = 2,
        [Description("晚班")]
        Night = 3
    }
}
