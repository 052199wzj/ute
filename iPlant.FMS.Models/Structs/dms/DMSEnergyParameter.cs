using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 设备实时记录值  统计完就删除
    /// </summary> 
    public class DMSEnergyParameter
    {
        /// <summary>
        /// 设备ID
        /// </summary>
        public int DeviceID { get; set; } = 0;

        /// <summary>
        /// 统计消耗
        /// </summary>
        public double RealValue { get; set; } = 0.0;

        /// <summary>
        /// 能源类型
        /// </summary>
        public int EnergyType { get; set; } = 0;
        /// <summary>
        /// 修改时间
        /// </summary>

        public DateTime UpdateTime { get; set; } = DateTime.Now;

    }
}
