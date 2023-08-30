using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 设备型号
    /// </summary> 
    public class DMSDeviceModel
    {
        public int ID { get; set; }= 0;
        /// <summary>
        /// 设备型号编码
        /// </summary>
        public String Code { get; set; }= "";

        /// <summary>
        /// 名称
        /// </summary>
        public String Name { get; set; }= "";
         
        /// <summary>
        /// 设备类型ID
        /// </summary>
        public int DeviceType { get; set; }= 0;

        /// <summary>
        /// 设备类型名称
        /// </summary>
        public String DeviceTypeName { get; set; }= "";
        /// <summary>
        /// 设备类型编码
        /// </summary>
        public String DeviceTypeCode { get; set; } = "";


        public String Remark { get; set; } = "";
      
        /// <summary>
        /// 录入人
        /// </summary>
        public int OperatorID { get; set; }= 0;


        public String OperatorName { get; set; }= "";
        /// <summary>
        /// 录入时刻
        /// </summary>
        public DateTime OperateTime { get; set; }= DateTime.Now;
         
        /// <summary>
        /// 是否激活： 1为激活 2为禁用
        /// </summary>
        public int Active { get; set; }= 0;
    }
}
