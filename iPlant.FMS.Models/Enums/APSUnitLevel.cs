using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum APSUnitLevel : int
    {
        [Description("默认")]
        Default = 0, 
        [Description("产线")]
        Line = 1,
        [Description("工段")]
        Part = 2,
        [Description("工序")]
        Step = 3,
        [Description("工位")]
        Station = 4, 
    }
}
