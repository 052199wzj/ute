using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum BMMFunctionModule : int
    {
        [Description("默认")]
        Default = 0, 
        [Description("生产")]
        Production = 1,
        [Description("质量")]
        Quality = 2,
        [Description("工艺")]
        Technology = 3,
       

        [Description("设备")]
        Equipment  = 4,
        [Description("仓库")]
        Warehouse=5,
        [Description("计量")]
        JL = 6,
    }

}
