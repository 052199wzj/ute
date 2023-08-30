using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum BMSGrads : int
    {
        [Description("用户")]
        Default = 0, 
        [Description("管理员")]
        Admin = 1,
        [Description("工程师")]
        Engineer = 999,
        [Description("系统")]
        System = 1000
    }
}
