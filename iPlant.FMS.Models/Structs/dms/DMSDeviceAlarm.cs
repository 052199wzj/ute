using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 设备型号
    /// </summary> 
    
    public class DMSDeviceAlarm
    {
        public int ID { get; set; } = 0;
        /// <summary>
        /// 设备编码
        /// </summary> 
        
        public String DeviceNo { get; set; } = "";


        public int DeviceID { get; set; } = 0;

        /// <summary>
        ///  设备名称
        /// </summary>
        
        public String DeviceName { get; set; } = "";

        /// <summary>
        /// 固定资产编码  采集编码
        /// </summary> 
        
        public String AssetNo { get; set; } = "";
        /// <summary>
        /// 设备型号ID
        /// </summary>
        public int ModelID { get; set; } = 0;
        /// <summary>
        /// 设备型号名称
        /// </summary>
        public String ModelName { get; set; } = "";
        /// <summary>
        /// 设备型号ID
        /// </summary>
        public String ModelNo { get; set; } = "";

        /// <summary>
        /// 设备类型编码
        /// </summary>
        public int DeviceType { get; set; } = 0;

        /// <summary>
        /// 设备类型名称
        /// </summary>
        public String DeviceTypeName { get; set; } = "";
        /// <summary>
        /// 设备类型编码
        /// </summary>
        public String DeviceTypeCode { get; set; } = "";


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

        public int AreaID { get; set; } = 0;

        public String AreaNo { get; set; } = "";
        /// <summary>
        /// 位置信息
        /// </summary>
        public String PositionText { get; set; } = "";

        public String ImageIcon { get; set; } = "";
        /// <summary>
        /// 报警编码
        /// </summary>
        
        public String AlarmCode { get; set; } = "";

        /// <summary>
        /// 报警名称
        /// </summary>
        
        public String AlarmName { get; set; } = "";

        /// <summary>
        /// 报警变量名称
        /// </summary>
        public String AlarmVariableName { get; set; } = "";
        /// <summary>
        /// 报警备注
        /// </summary>
        
        public String AlarmDesc { get; set; } = "";

        public int PositionID { get; set; } = 0;

        public String PositionName { get; set; } = "";

        /// <summary>
        /// 报警时刻
        /// </summary>

        public DateTime StatusTime { get; set; } = new DateTime(2000, 1, 1);

        /// <summary>
        /// 报警结束时刻
        /// </summary>
        
        public DateTime StatusTimeEnd { get; set; } = new DateTime(2000, 1, 1);

        
        public int EventType { get; set; } = 0;

    }


    public class DMSDeviceAlarmStatistics
    {
        /// <summary>
        /// 设备ID     
        /// </summary>
        public int DeviceID { get; set; } = 0;

        /// <summary>
        /// 采集编码   
        /// </summary>
        public String AssetNo { get; set; } = "";

        /// <summary>
        /// 报警时间
        /// </summary>
        public DateTime AlarmTime { get; set; }

        /// <summary>
        ///  报警时长
        /// </summary>
        public double AlarmDuration { get; set; }

        /// <summary>
        /// 报警次数
        /// </summary>
        public int AlarmCount { get; set; }

    }

    public class DMSDeviceAlarmFrequency
    {
        /// <summary>
        /// 报警代码     
        /// </summary>
        public String AlarmCode { get; set; } = "";

        /// <summary>
        /// 报警名称   
        /// </summary>
        public String AlarmName { get; set; } = "";

        /// <summary>
        /// 报警备注  
        /// </summary>
        public String AlarmDesc { get; set; } = "";

        /// <summary>
        /// 报警次数
        /// </summary>
        public int AlarmCount { get; set; }

    }
}
