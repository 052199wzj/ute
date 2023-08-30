using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum BFCMessageStatus : int
    {
        [Description("默认")]
        Default = 0,
        [Description("未读")]
        Sent = 1,
        [Description("已读")]
        Read = 2,
        [Description("已处理")]
        Finished = 3,
        [Description("已关闭")]
        Close = 4
    }
}
