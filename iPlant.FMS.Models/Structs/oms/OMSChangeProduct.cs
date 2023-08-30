using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iPlant.Common.Tools;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 产线更换产品确认单
    /// </summary>

    [Table("oms_changeproduct")]
    public class OMSChangeProduct : BasePo
    {


        public String Code { get; set; } = "";

        [Required]
        public int LineID { get; set; } = 0;
        [NotMapped]
        public String LineName { get; set; } = "";


        [Required]
        public int OldOrderID { get; set; } = 0;

        [Required]
        public int ChangeOrderID { get; set; } = 0;
        [NotMapped]
        public String OldOrderNo { get; set; } = "";
        [NotMapped]
        public String ChangeOrderNo { get; set; } = "";
        [NotMapped]
        public String OldProductNo { get; set; } = "";
        [NotMapped]
        public String OldDrawingNo { get; set; } = "";
        [NotMapped]
        public String OldDrawingNoFile { get; set; } = "";
        [NotMapped]
        public String ChangeProductNo { get; set; } = "";
        [NotMapped]
        public int ChangeProductID { get; set; } = 0;
        [NotMapped]
        public String ChangeDrawingNo { get; set; } = "";
        [NotMapped]
        public String ChangeDrawingNoFile { get; set; } = "";


        /// <summary>
        /// 物料ID  必填 来料物料
        /// </summary>

        [Required]
        public int MaterialID { get; set; } = 0;
        [NotMapped]
        public String MaterialNo { get; set; } = "";
        [NotMapped]
        public String MaterialName { get; set; } = "";


        /// <summary>
        /// 1 未确认  2已确认
        /// </summary>
        public int Status { get; set; } = 1;

        public int Active { get; set; } = 1;
        public String Remark { get; set; } = "";

        /// <summary>
        /// 本产线所有设备列表
        /// </summary>
        [NotMapped]
        public List<OMSChangeProductDevice> DeviceList { get; set; } = new List<OMSChangeProductDevice>();
    }

    /// <summary>
    /// 设备更换产品确认单
    /// </summary> 
    [Table("oms_changeproductdevice")]
    public class OMSChangeProductDevice : BasePo
    {

        /// <summary> 
        /// 主单据ID （产线更换产品确认单）
        /// </summary> 

        public int MainID { get; set; } = 0;


        [NotMapped]
        public String ChangeOrderNo { get; set; } = "";


        [NotMapped]
        public int ChangeProductID { get; set; } = 0;
        /// <summary>
        /// 设备ID
        /// </summary>
        public int DeviceID { get; set; } = 0;
        [NotMapped]
        public String AssetNo { get; set; } = "";
        [NotMapped]
        public String DeviceNo { get; set; } = "";
        [NotMapped]
        public String DeviceName { get; set; } = "";
        [NotMapped]

        public int NCEnable { get; set; } = 0;

        [NotMapped]

        public int ToolEnable { get; set; } = 0;

        [NotMapped]
        public int FixturesEnable { get; set; }

        /// <summary>
        /// 刀具确认
        /// </summary>

        public int ToolConfirm { get; set; } = 0;

        /// <summary>
        /// 刀具清单列表  多个使用;隔开
        /// </summary>
        [NotMapped]
        public String ToolCode { get; set; } = "";
        /// <summary>
        /// 刀具清单列表  多个使用;隔开
        /// </summary>
        [NotMapped]
        public List<String> ToolCodeList
        {
            get
            {
                if (StringUtils.isEmpty(ToolCode))
                    return new List<String>();

                return StringUtils.splitList(ToolCode, ";");
            }
            set
            {
                if (value == null)
                    return;
                ToolCode = StringUtils.Join(";", value);
            }
        }


        /// <summary>
        /// 刀具更换说明
        /// </summary>
        [NotMapped]
        public String ToolDescription { get; set; } = "";


        /// <summary>
        /// 刀具更换指导文件
        /// </summary>
        [NotMapped]
        public String ToolFile { get; set; } = "";

        public String ToolConfirmRemark { get; set; } = "";

        /// <summary>
        /// 程序
        /// </summary>

        public int NCConfirm { get; set; } = 0;
        [NotMapped]
        public String NCCode { get; set; } = "";
        /// <summary>
        /// 需要程序说明
        /// </summary>
        [NotMapped]
        public String NCDescription { get; set; } = "";

        public String NCConfirmRemark { get; set; } = "";

        /// <summary>
        /// 工装夹具
        /// </summary>

        public int FixturesConfirm { get; set; } = 0;

        [NotMapped]
        public String FixturesCode { get; set; } = "";
        /// <summary>
        /// 需要工装夹具说明
        /// </summary>
        [NotMapped]
        public String FixturesDescription { get; set; } = "";

        /// <summary>
        /// 工装更换指导文件
        /// </summary>
        [NotMapped]
        public String FixturesFile { get; set; } = "";


        public String FixturesConfirmRemark { get; set; } = "";


        /// <summary>
        /// 1 未确认  2已确认
        /// </summary>
        public int Status { get; set; } = 1;

        /// <summary>
        /// 备注
        /// </summary>
        public String Remark { get; set; } = "";


        public OMSChangeProductDevice() { }

        public OMSChangeProductDevice(DMSDeviceLedger wDMSDeviceLedger)
        {
            DeviceID = wDMSDeviceLedger.ID;
            AssetNo = wDMSDeviceLedger.AssetNo;
            DeviceNo = wDMSDeviceLedger.Code;
            NCEnable = wDMSDeviceLedger.NCEnable;
            ToolEnable = wDMSDeviceLedger.ToolEnable;
            FixturesEnable = wDMSDeviceLedger.FixturesEnable;
        }

        public void SetDeviceFixtures(DMSFixtures wDMSFixtures)
        {
            ToolCode = wDMSFixtures.ToolCode;
            ToolDescription = wDMSFixtures.ToolDescription;
            ToolFile = wDMSFixtures.ToolFile;
            NCCode = wDMSFixtures.NCCode;
            NCDescription = wDMSFixtures.NCDescription;
            FixturesCode = wDMSFixtures.FixturesCode;
            FixturesDescription = wDMSFixtures.FixturesDescription;
            FixturesFile = wDMSFixtures.FixturesFile;
        }

    }
}
