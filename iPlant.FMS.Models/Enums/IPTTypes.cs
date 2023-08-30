using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum IPTTypes : int
    {
        [Description("默认")]
        Default = 0, 
        [Description("首巡检")]
        Patrol = 1,
        [Description("点检")]
        PointCheck = 2,
        [Description("维护")]
        Maintain = 3,
        [Description("维修")]
        Repair = 4,
        [Description("异常")]
        Exception = 5,

    }

    public enum IPTModelTypes : int
    {
        [Description("默认")]
        Default = 0,
        [Description("日常")]
        General = 1,
        [Description("专业")]
        Professional = 2,
        
    }
}
