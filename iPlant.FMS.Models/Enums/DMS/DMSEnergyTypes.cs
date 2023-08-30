using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum DMSEnergyTypes : int
    {
        [Description("默认")]
        Default = 0, 
        [Description("电")]
        Electric = 1,
        [Description("气")]
        Gas = 2,
        [Description("水")]
        Water = 3,
        [Description("油")]
        Oil = 4 
    }
}
