using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum BMSRange : int
    {
        [Description("默认")]
        Default = 0, 
        [Description("工厂")]
        Factory = 1,
        [Description("事业部")]
        Business = 2,
        [Description("车间")]
        Workshop = 3,
        [Description("产线")]
        Line = 4
    }
}
