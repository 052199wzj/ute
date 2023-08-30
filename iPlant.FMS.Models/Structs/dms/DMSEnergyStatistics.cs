using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 设备能源统计
    /// </summary> 
    public class DMSEnergyStatistics
    {
        /// <summary>
        /// 主键ID
        /// </summary>
        public int ID { get; set; } = 0;

        /// <summary>
        /// 设备ID
        /// </summary>
        public int DeviceID { get; set; } = 0;


        /// <summary>
        /// 设备编码
        /// </summary>
        public String DeviceNo { get; set; } = "";

        /// <summary>
        /// 采集编码
        /// </summary>
        public String AssetNo { get; set; } = "";

        /// <summary>
        /// 设备名称
        /// </summary>
        public String DeviceName { get; set; } = "";

        /// <summary>
        /// 统计类型
        /// </summary>
        public int StatType { get; set; } = 0;


        /// <summary>
        /// 能源类型
        /// </summary>
        public int EnergyType { get; set; } = 0;


        /// <summary>
        /// 统计消耗
        /// </summary>
        public double StatConsumption { get; set; } = 0.0;


        /// <summary>
        /// 存储/修改日期
        /// </summary>

        public DateTime UpdateTime { get; set; } = DateTime.Now;

        /// <summary>
        /// 统计周期日期
        /// </summary>

        public DateTime StatDate
        {
            get
            {
                return StatStartDate.Date;

            }
            set
            {
                return;
            }
        }

        public DateTime StatStartDate { get; set; } = DateTime.Now;


        public DateTime StatEndDate { get; set; } = DateTime.Now;


        public int Active { get; set; } = 1;
    }
}
