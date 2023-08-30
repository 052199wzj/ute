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

    public class DMSDeviceStatus
    {
        public int ID { get; set; } = 0;
        /// <summary>
        /// 设备编码
        /// </summary>

        public String DeviceNo { get; set; } = "";


        public int DeviceID { get; set; } = 0;
        public string DeviceIP { get; set; } = "";
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


        public int TeamID { get; set; } = 0;

        public String TeamNo { get; set; } = "";

        public String TeamName { get; set; } = "";

        public String Remark { get; set; } = "";

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
        /// 当前状态
        /// </summary>

        public int Status { get; set; } = 0;
        public int IsPlan { get; set; } = 0;
        /// <summary>
        /// 历史状态的显示状态
        /// </summary>
        public int ActStatus
        {
            get
            {

                if ((Status & ((int)DMSDeviceStatusEnum.TurnOn)) == 0)
                {
                    return 0;
                }
                else if ((Status & ((int)DMSDeviceStatusEnum.Run)) > 0)
                {
                    return (int)DMSDeviceStatusEnum.Run;
                }
                else if ((Status & ((int)DMSDeviceStatusEnum.EmergencyStop)) > 0)
                {
                    return (int)DMSDeviceStatusEnum.EmergencyStop;
                }
                else if ((Status & ((int)DMSDeviceStatusEnum.Alarm)) > 0)
                {
                    return (int)DMSDeviceStatusEnum.Alarm;
                }
                else if ((Status & ((int)DMSDeviceStatusEnum.Stop)) > 0)
                {
                    return (int)DMSDeviceStatusEnum.Stop; 
                }
                else if ((Status & ((int)DMSDeviceStatusEnum.Manual)) > 0)
                {
                    return (int)DMSDeviceStatusEnum.Manual;
                }
                else if ((Status & ((int)DMSDeviceStatusEnum.Auto)) > 0)
                {
                    return (int)DMSDeviceStatusEnum.Auto;
                }
                else if ((Status & ((int)DMSDeviceStatusEnum.Wait)) > 0)
                {
                    return (int)DMSDeviceStatusEnum.Wait;
                }
                else if ((Status & ((int)DMSDeviceStatusEnum.TurnOn)) > 0)
                {
                    return ((int)DMSDeviceStatusEnum.TurnOn);
                }
                else
                {
                    return 0;
                }

            }
            set { }
        }

        /// <summary>
        /// 历史状态
        /// </summary>

        public int StatusHistory { get; set; } = 0;

        /// <summary>
        /// 状态改变时刻
        /// </summary>

        public DateTime StatusTime { get; set; } = new DateTime(2000, 1, 1);

        /// <summary>
        /// 状态持续时长
        /// </summary>

        public int Duration { get; set; } = 0;

        /// <summary>
        /// 状态结束时刻
        /// </summary>

        public DateTime StatusTimeEnd { get; set; } = new DateTime(2000, 1, 1);

        public int AlarmCount { get; set; } = 0;

        /// <summary>
        /// 是否当前状态
        /// </summary> 
        public int Active { get; set; } = 0;


        public List<String> WorkpieceNoList { get; set; } = new List<string>();


        public DMSDeviceStatus() { }

        public DMSDeviceStatus(DMSDeviceStatus wDMSDeviceStatus)
        {
            DeviceNo = wDMSDeviceStatus.DeviceNo;



            DeviceID = wDMSDeviceStatus.DeviceID;

            DeviceName = wDMSDeviceStatus.DeviceName;





            AssetNo = wDMSDeviceStatus.AssetNo;

            ModelID = wDMSDeviceStatus.ModelID;
            ModelName = wDMSDeviceStatus.ModelName;




            ModelNo = wDMSDeviceStatus.ModelName;


            TeamID = wDMSDeviceStatus.TeamID;

            TeamNo = wDMSDeviceStatus.TeamNo;

            TeamName = wDMSDeviceStatus.TeamName;

            Remark = wDMSDeviceStatus.Remark;

            DeviceType = wDMSDeviceStatus.DeviceType;

            DeviceTypeName = wDMSDeviceStatus.DeviceTypeName;
            DeviceTypeCode = wDMSDeviceStatus.DeviceTypeCode;


            FactoryID = wDMSDeviceStatus.FactoryID;

            FactoryName = wDMSDeviceStatus.FactoryName;
            FactoryCode = wDMSDeviceStatus.FactoryCode;




            WorkShopID = wDMSDeviceStatus.WorkShopID;

            WorkShopName = wDMSDeviceStatus.WorkShopName;
            WorkShopCode = wDMSDeviceStatus.WorkShopCode;



            LineID = wDMSDeviceStatus.LineID;

            LineName = wDMSDeviceStatus.LineName;
            LineCode = wDMSDeviceStatus.LineCode;

            AreaID = wDMSDeviceStatus.AreaID;

            AreaNo = wDMSDeviceStatus.AreaNo;



            PositionText = wDMSDeviceStatus.PositionText;

            ImageIcon = wDMSDeviceStatus.ImageIcon;




            Status = wDMSDeviceStatus.Status;

            StatusHistory = wDMSDeviceStatus.StatusHistory;

            StatusTime = wDMSDeviceStatus.StatusTime;

            Duration = wDMSDeviceStatus.Duration;

            StatusTimeEnd = wDMSDeviceStatus.StatusTimeEnd;

            AlarmCount = wDMSDeviceStatus.AlarmCount;



        }
        public DMSDeviceStatus Clone()
        {
            DMSDeviceStatus wDMSDeviceStatus = new DMSDeviceStatus();
            wDMSDeviceStatus.DeviceNo = this.DeviceNo;
            wDMSDeviceStatus.DeviceID = this.DeviceID;
            wDMSDeviceStatus.DeviceName = this.DeviceName;
            wDMSDeviceStatus.AssetNo = this.AssetNo;
            wDMSDeviceStatus.ModelID = this.ModelID;
            wDMSDeviceStatus.ModelName = this.ModelName;
            wDMSDeviceStatus.ModelNo = this.ModelName;
            wDMSDeviceStatus.TeamID = this.TeamID;
            wDMSDeviceStatus.TeamNo = this.TeamNo;
            wDMSDeviceStatus.TeamName = this.TeamName;
            wDMSDeviceStatus.Remark = this.Remark;
            wDMSDeviceStatus.DeviceType = this.DeviceType;
            wDMSDeviceStatus.DeviceTypeName = this.DeviceTypeName;
            wDMSDeviceStatus.DeviceTypeCode = this.DeviceTypeCode;
            wDMSDeviceStatus.FactoryID = this.FactoryID;
            wDMSDeviceStatus.FactoryName = this.FactoryName;
            wDMSDeviceStatus.FactoryCode = this.FactoryCode;
            wDMSDeviceStatus.WorkShopID = this.WorkShopID;
            wDMSDeviceStatus.WorkShopName = this.WorkShopName;
            wDMSDeviceStatus.WorkShopCode = this.WorkShopCode;
            wDMSDeviceStatus.LineID = this.LineID;
            wDMSDeviceStatus.LineName = this.LineName;
            wDMSDeviceStatus.LineCode = this.LineCode;
            wDMSDeviceStatus.AreaID = this.AreaID;
            wDMSDeviceStatus.AreaNo = this.AreaNo;
            wDMSDeviceStatus.PositionText = this.PositionText;
            wDMSDeviceStatus.ImageIcon = this.ImageIcon;
            wDMSDeviceStatus.Status = this.Status;
            wDMSDeviceStatus.StatusHistory = this.StatusHistory;
            wDMSDeviceStatus.StatusTime = this.StatusTime;
            wDMSDeviceStatus.Duration = this.Duration;
            wDMSDeviceStatus.StatusTimeEnd = this.StatusTimeEnd;
            wDMSDeviceStatus.AlarmCount = this.AlarmCount;

            return wDMSDeviceStatus;

        }
    }
}
