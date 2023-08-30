using System;
using System.Collections.Generic;
using iPlant.Common.Tools;

namespace iPlant.FMS.Models
{
    public class IPTRecordItem
    {
        public int ID { get; set; } = 0;

        /// <summary>
        /// 项目ID  保存  维修为0
        /// </summary>
        public int ItemID { get; set; } = 0;

        /// <summary>
        /// 产线ID  保存
        /// </summary>
        public int LineID { get; set; } = 0;
        /// <summary>
        /// 产线名称
        /// </summary>

        public String LineName { get; set; } = "";

        /// <summary>
        /// 首巡检中为工序 点检为设备 维护为设备   保存
        /// </summary>
        public int MainID { get; set; } = 0;
        /// <summary>
        /// 首巡检中为工序 点检为设备 维保为设备    保存
        /// </summary>
        public String MainName { get; set; } = "";
        /// <summary>
        /// 首巡检中为工序 点检为设备 维保为设备型号  
        /// </summary>
        public String MainCode { get; set; } = "";

        /// <summary>
        /// 检验项点类型  1首巡检 2点检 3维护   保存
        /// </summary>
        public int IPTType { get; set; } = 0;
        public String IPTTypeName
        {
            get
            {
                return EnumTool.GetEnumDesc<IPTTypes>(this.IPTType);

            }
            private set { }
        }
        /// <summary>
        /// 检验模式类型   （点检： 1日常  2专业 ）   保存
        /// </summary>
        public int ModeType { get; set; } = 0;
        public String ModeTypeName
        {
            get
            {
                if (IPTType == ((int)IPTTypes.PointCheck))
                    return EnumTool.GetEnumDesc<IPTModelTypes>(this.ModeType);
                return "";
            }
            private set { }
        }
        /// <summary>
        /// 检验项目   保存    （维修中 维修人数）
        /// </summary>
        public String GroupName { get; set; } = "";

        /// <summary>
        /// 项目明细   保存  （维修中 更换硬件）
        /// </summary>
        public String ItemName { get; set; } = "";

        /// <summary>
        /// 描述      保存
        /// </summary>
        public String Description { get; set; } = "";

        /// <summary>
        /// 产品ID  保存
        /// </summary>
        public int ProductID { get; set; } = 0;
        public String ProductNo { get; set; } = "";
        public String ProductName { get; set; } = "";



        public List<int> Repairmans { get; set; } = new List<int>();


        public String RepairmanNames { get; set; } = "";


        /// <summary>
        /// 订单ID 首巡检需要赋值
        /// </summary>
        public int OrderID { get; set; } = 0;

        public String OrderNo { get; set; } = "";


        /// <summary>
        /// 计划日期  在维护中生效
        /// </summary>
        public DateTime PlanTime { get; set; } = DateTime.Now;



        /// <summary>
        /// 录入人
        /// </summary>
        public int CreatorID { get; set; } = 0;
        public String CreatorName { get; set; } = "";

        /// <summary>
        /// 创建时刻
        /// </summary>
        public DateTime CreateTime { get; set; } = DateTime.Now;

        /// <summary>
        /// 执行人
        /// </summary>
        public int EditorID { get; set; } = 0;

        public String EditorName { get; set; } = "";

        /// <summary>
        /// 执行时刻
        /// </summary>
        public DateTime EditTime { get; set; } = DateTime.Now;


        /// <summary>
        /// 任务状态  1为待执行  2为已关闭
        /// </summary> 
        public int Status { get; set; } = 1;


        public List<IPTRecordItemValue> ItemResult { get; set; } = new List<IPTRecordItemValue>();


        public IPTRecordItem() { }
        public IPTRecordItem(IPTItem wIPTItem)
        {
            this.ItemID = wIPTItem.ID;
            this.LineID = wIPTItem.LineID;
            this.LineName = wIPTItem.LineName;
            this.MainID = wIPTItem.MainID;
            this.IPTType = wIPTItem.IPTType;
            this.ModeType = wIPTItem.ModeType;

            this.GroupName = wIPTItem.GroupName;
            this.ItemName = wIPTItem.ItemName;
            this.Description = wIPTItem.Description;
            this.ProductID = wIPTItem.ProductID;
            this.ProductName = wIPTItem.ProductName;
            this.ProductNo = wIPTItem.ProductNo;

            this.CreateTime = DateTime.Now.Date;
            this.EditTime = DateTime.Now;
            this.MainName = wIPTItem.MainName;
            this.MainCode = wIPTItem.MainCode;
            this.Status = 1;

            this.ItemResult.Add(new IPTRecordItemValue());

        }
    }

    public class IPTRecordItemValue
    {

        public int ID { get; set; } = 0;

        public int RecordID { get; set; } = 0;
        public int WorkpieceID { get; set; } = 0;
        public String WorkpieceNo { get; set; } = "";
        public String Remark { get; set; } = "";

        public int Result { get; set; } = 0;

    }

    /// <summary>
    /// 维保统计
    /// </summary>
    public class IPTRecordItemStatistics
    {
        /// <summary>
        /// 设备ID     
        /// </summary>
        public int DeviceID { get; set; } = 0;


        public String DeviceName { get; set; } = "";
        /// <summary>
        /// 采集编码   
        /// </summary>
        public String AssetNo { get; set; } = "";

        /// <summary>
        /// 检验项点类型  1首巡检 2点检 3维护   保存
        /// </summary>
        public int IPTType { get; set; } = 0;
        public String IPTTypeName
        {
            get
            {
                return EnumTool.GetEnumDesc<IPTTypes>(this.IPTType);

            }
            private set { }
        }

        /// <summary>
        /// 维护/维修时间
        /// </summary>
        public DateTime AlarmTime { get; set; }

        /// <summary>
        ///  维护/维修时长
        /// </summary>
        public double AlarmDuration { get; set; }

        /// <summary>
        /// 维护/维修次数
        /// </summary>
        public int AlarmCount { get; set; }

    }
}
