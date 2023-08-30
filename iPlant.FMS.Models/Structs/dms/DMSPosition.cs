using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 位置信息
    /// </summary> 
    public class DMSPosition
    {
        /// <summary>
        /// 位置信息ID
        /// </summary>
        public int ID { get; set; } = 0;

        /// <summary>
        /// 位置信息编码
        /// </summary>
        public String Code { get; set; } = "";
        /// <summary>
        /// 位置信息名称
        /// </summary>
        public String Name { get; set; } = "";

        /// <summary>
        /// 产线ID
        /// </summary>
        public int LineID { get; set; } = 0;

        /// <summary>
        /// 产线名称
        /// </summary>
        public String LineName { get; set; } = "";
        /// <summary>

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
