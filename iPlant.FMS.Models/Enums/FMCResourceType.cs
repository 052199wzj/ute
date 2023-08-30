using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum FMCResourceType : int
    {
        [Description("默认")]
        Default = 0, 
        [Description("设备")]
        Device = 1,
        [Description("备件")]
        Spare = 2,
        [Description("工装")]
        Parts = 3,
        [Description("量具")]
        Measure = 4
    }
}
