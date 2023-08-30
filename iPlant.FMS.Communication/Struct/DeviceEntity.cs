using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Communication
{

    
    public class DeviceEntity 
    {
         
        public int ID { get; set; }

        /// <summary>
        /// 设备编码  
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// 设备采集编码AssetNo
        /// </summary>
        public string AssetNo { get; set; }

        /// <summary>
        /// 设备名称
        /// </summary>
        public string Name { get; set; }


        /// <summary>
        /// 设备型号ID
        /// </summary>
        public int ModelID { get; set; } = 0; 

        /// <summary>
        /// 设备类型
        /// </summary>
        public int DeviceType { get; set; }
 
        /// <summary>
        /// 产线主键
        /// </summary>
        public int LineID { get; set; }
 

        /// <summary>
        /// 状态采集启用
        /// </summary>
        public bool StatusEnable { get; set; }
        /// <summary>
        /// 报警采集启用
        /// </summary>
        public bool AlarmEnable { get; set; }
         

        /// <summary>
        /// 参数采集启用
        /// </summary>
        public bool ParmaterEnable { get; set; }

        /// <summary>
        /// 工作参数采集启用
        /// </summary>
        public bool WorkParmaterEnable { get; set; }

        /// <summary>
        /// 刀具管理启用
        /// </summary>
        public bool ToolEnable { get; set; }

 
        /// <summary>
        /// 加工程序启用
        /// </summary>
        public bool NCEnable { get; set; }



        public DeviceEntity() { }

        public DeviceEntity(DMSDeviceLedger wDMSDeviceLedger) {
            this.ID = wDMSDeviceLedger.ID;
            this.Code = wDMSDeviceLedger.Code;
            this.Name = wDMSDeviceLedger.Name;
            this.AssetNo = wDMSDeviceLedger.AssetNo;
            this.ModelID = wDMSDeviceLedger.ModelID;
            this.DeviceType = wDMSDeviceLedger.DeviceType;
            this.LineID = wDMSDeviceLedger.LineID;
            this.StatusEnable = wDMSDeviceLedger.StatusEnable==1;
            this.AlarmEnable = wDMSDeviceLedger.AlarmEnable == 1;
            this.ParmaterEnable = wDMSDeviceLedger.ParmaterEnable == 1;
            this.WorkParmaterEnable = wDMSDeviceLedger.WorkParmaterEnable == 1; 
            this.ToolEnable = wDMSDeviceLedger.ToolEnable == 1;
            this.NCEnable = wDMSDeviceLedger.NCEnable == 1;


        }

    }
 

 
}
