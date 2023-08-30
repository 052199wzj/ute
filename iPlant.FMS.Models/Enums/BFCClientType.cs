using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum BFCClientType : int
    {
        [Description("默认")]
        Default = 0, 
        [Description("网页端")]
        WEB = 1,
        [Description("客户端")]
        CLIENT = 2,
        [Description("移动端")]
        APP = 3
    }
}
