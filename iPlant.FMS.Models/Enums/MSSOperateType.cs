using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum MSSOperateType : int
    {
        [Description("默认")]
        Default = 0, 
        [Description("入库")]
        InStock = 1,
        [Description("出库")]
        OutStock = 2,
        [Description("盘盈")]
        Surplus = 3,
        [Description("盘亏")]
        Loss = 4,
        
    }
     
}
