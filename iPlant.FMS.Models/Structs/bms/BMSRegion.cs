using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 区域
    /// </summary> 
    public class BMSRegion
    {
        /// <summary>
        /// 设备（备件）工作类型ID
        /// </summary>
        public int ID { get; set; } = 0;

        /// <summary>
        /// 内部编码
        /// </summary>
        public String Code { get; set; } = "";
        /// <summary>
        /// 设备类型名称
        /// </summary>
        public String Name { get; set; } = "";


        public int ParentID = 0;
        public String ParentName { get; set; } = "";
        public String ParentCode { get; set; } = "";
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
