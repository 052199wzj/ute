using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum DMSProgramRecordTypes : int
    {
        [Description("默认")]
        Default = 0, 
        [Description("初次上传")]
        Upload = 1,
        [Description("版本变更")]
        VersionChange = 2,
        [Description("程序下载")]
        Download = 3
    }
 
}
