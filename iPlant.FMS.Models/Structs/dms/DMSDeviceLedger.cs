using iPlant.Common.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 设备台账
    /// </summary> 

    public class DMSDeviceLedger
    {
        public int ID { get; set; } = 0;
        /// <summary>
        /// 设备编码
        /// </summary>

        public String Code { get; set; } = "";

        /// <summary>
        ///  设备名称
        /// </summary>

        public String Name { get; set; } = "";


        /// <summary>
        /// 采集编号  
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

        /// <summary>
        /// 设备参数组编号
        /// </summary>
        public String DeviceGroupCode { get; set; } = "";
         
        /// <summary>
        /// 加工工序 ADD
        /// </summary>
        public String WorkPartPointCode { get; set; } = "";

        /// <summary>
        /// 加工工序名称   ADD
        /// </summary>
        public String WorkPartPointName { get; set; } = "";

        /// <summary>
        /// 厂家名称  控制厂家
        /// </summary> 

        public String ManufactorName { get; set; } = "";
        /// <summary>
        /// 厂家编号  控制器型号
        /// </summary> 

        public String ManufactorCode { get; set; } = "";
        /// <summary>
        /// 厂家联系方式
        /// </summary>

        public String ManufactorContactInfo { get; set; } = "";

        /// <summary>
        /// 供应商名称  机床厂家
        /// </summary>

        public String SupplierName { get; set; } = "";
        /// <summary>
        /// 供应商编号  加工圈别
        /// </summary>

        public String SupplierCode { get; set; } = "";
        /// <summary>
        /// 供应商联系方式
        /// </summary>

        public String SupplierContactInfo { get; set; } = "";

        public DateTime AcceptanceDate { get; set; } = DateTime.Now;

        /// <summary>
        /// 保质期
        /// </summary>

        public int WarrantyPeriod { get; set; } = 0;

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
        public int IsPlan { get; set; } = 0;
        public String AreaNo { get; set; } = "";
        /// <summary>
        /// 位置信息
        /// </summary>
        public String PositionText { get; set; } = "";

        /// <summary>
        /// 备注
        /// </summary>

        public String Remark { get; set; } = "";

        /// <summary>
        /// 设备IP
        /// </summary> 
        public String DeviceIP { get; set; } = "";


        public int TeamID { get; set; } = 0;

        public String TeamNo { get; set; } = "";

        public String TeamName { get; set; } = "";


        public List<int> StationIDList { get; set; } = new List<int>();
        public String StationNo { get; set; } = "";

        public String StationName { get; set; } = "";

        /// <summary>
        /// 维护人员ID
        /// </summary>
        public List<Int32> MaintainerIDList { get; set; } = new List<int>();
        /// <summary>
        /// 维护人员名称
        /// </summary>

        public String MaintainerName { get; set; } = "";

        public String MaintainerCode { get; set; } = "";
        /// <summary>
        /// 维护日期
        /// </summary>

        public DateTime MaintainDate { get; set; } = DateTime.Now.Date;

        /// <summary>
        /// 预计下次维护日期
        /// </summary>

        public DateTime NextMaintainDate { get; set; } = DateTime.Now.Date;



        /// <summary>
        /// 状态采集启用
        /// </summary>
        public int StatusEnable { get; set; }
        /// <summary>
        /// 报警采集启用
        /// </summary>
        public int AlarmEnable { get; set; }

        /// <summary>
        /// 参数采集启用
        /// </summary>
        public int ParmaterEnable { get; set; }

        /// <summary>
        /// 工作参数采集启用
        /// </summary>
        public int WorkParmaterEnable { get; set; }



        /// <summary>
        /// 刀具管理启用
        /// </summary>
        public int ToolEnable { get; set; }


        /// <summary>
        /// 加工程序启用
        /// </summary>
        public int NCEnable { get; set; }


        /// <summary>
        /// 工装启用
        /// </summary>
        public int FixturesEnable { get; set; }

        /// <summary>
        /// 理论节拍
        /// </summary>
        public double PartInterval { get; set; } = 35 * 60;


        /// <summary>
        /// 录入人
        /// </summary>
        public int CreatorID { get; set; } = 0;

        public String CreatorName { get; set; } = "";
        /// <summary>
        /// 录入时刻
        /// </summary>
        public DateTime CreateTime { get; set; } = DateTime.Now;

        /// <summary>
        /// 编辑人
        /// </summary>
        public int EditorID { get; set; } = 0;

        public String EditorName { get; set; } = "";
        /// <summary>
        /// 编辑时刻
        /// </summary>
        public DateTime EditTime { get; set; } = DateTime.Now;

        public String ImageIcon { get; set; } = "";

        /// <summary>
        /// 是否激活： 1为激活 2为禁用
        /// </summary>

        public int Active { get; set; } = 0;
    }
}
