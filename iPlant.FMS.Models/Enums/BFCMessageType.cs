using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum BFCMessageType : int
    {
        [Description("默认")]
        Default = 0, 
        [Description("通知")]
        Notify = 1,
        [Description("任务")]
        Task = 2, 
    }
}
