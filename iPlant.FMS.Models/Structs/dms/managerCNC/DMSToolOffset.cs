using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 刀具补偿修改记录
    /// </summary> 
    
    public class DMSToolOffset
    {
        public int ID { get; set; } = 0;


        public int ToolID { get; set; } = 0;
        public int ToolIndex { get; set; } = 0;

        public int ToolHouseIndex { get; set; } = 0;


        public double ToolOffsetX { get; set; } = 0;
        public double ToolOffsetZ { get; set; } = 0;
        public double ToolOffsetR { get; set; } = 0;

    
        public int DeviceID { get; set; } = 0;
        /// <summary>
        /// 设备编码
        /// </summary>

        public String DeviceNo { get; set; } = "";

        /// <summary>
        ///  设备名称
        /// </summary>

        public String DeviceName { get; set; } = "";


        /// <summary>
        /// 采集编号  
        /// </summary> 
        public String AssetNo { get; set; } = "";
       


        public int FactoryID { get; set; } = 0;

        public String FactoryName { get; set; } = "";
        public String FactoryCode { get; set; } = "";

        /// <summary>
        /// 车间ID
        /// </summary>
        public int WorkShopID { get; set; } = 0;

        public String WorkShopName { get; set; } = "";
        public String WorkShopCode { get; set; } = "";
        /// <summary>
        /// 产线ID
        /// </summary>
        public int LineID { get; set; } = 0;

        public String LineName { get; set; } = "";
        public String LineCode { get; set; } = "";

      

        /// <summary>
        /// 刀具备注
        /// </summary>

        public String Description { get; set; } = "";

        /// <summary>
        /// 备注
        /// </summary>

        public String Remark { get; set; } = "";

        

        /// <summary>
        /// 编辑人
        /// </summary>
        public int EditorID { get; set; } = 0;

        public String EditorName { get; set; } = "";
        /// <summary>
        /// 编辑时刻
        /// </summary>
        public DateTime EditTime { get; set; } = DateTime.Now;

 
    }
}
