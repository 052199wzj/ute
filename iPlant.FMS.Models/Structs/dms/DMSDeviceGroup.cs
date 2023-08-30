using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 设备组
    /// </summary> 
    public class DMSDeviceGroup
    {
        /// <summary>
        /// 设备组ID
        /// </summary>
        public int ID { get; set; } = 0;

        /// <summary>
        /// 设备组编码
        /// </summary>
        public String Code { get; set; } = "";
        /// <summary>
        /// 设备组名称
        /// </summary>
        public String Name { get; set; } = "";

          
        /// <summary>
        /// 操作人
        /// </summary>
        public int OperatorID { get; set; } = 0;

        public String OperatorName { get; set; } = "";


        public String Remark { get; set; } = "";

        /// <summary>
        /// 操作时间
        /// </summary>
        public DateTime OperateTime { get; set; } = DateTime.Now;

        /// <summary>
        /// 是否激活： 1为激活 2为禁用
        /// </summary>
        public int Active { get; set; } = 0;
    }
}
