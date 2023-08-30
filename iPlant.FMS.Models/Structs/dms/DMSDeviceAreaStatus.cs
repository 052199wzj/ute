using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 设备型号
    /// </summary> 
    public class DMSDeviceAreaStatus
    {
        public int AreaID { get; set; } = 0;
        /// <summary>
        /// 设备编码
        /// </summary>
        public String AreaNo { get; set; } = "";
          
        /// <summary>
        ///  设备名称
        /// </summary>
        public String AreaName { get; set; } = "";

        public int DeviceCount { get; set; } = 0;

        public Dictionary<String, int> StatusCount { get; set; } = new Dictionary<string, int>();
         
    }
     
}
