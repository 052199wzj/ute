using iPlant.Common.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    public class IPTItem
    {
        public int ID { get; set; } = 0;

        /// <summary>
        /// 产线ID
        /// </summary>
        public int LineID { get; set; } = 0;

        /// <summary>
        /// 产线名称
        /// </summary>

        public String LineName { get; set; } = "";



        /// <summary>
        /// 首巡检中为工序 点检为设备 维护为设备型号 
        /// </summary>
        public int MainID { get; set; } = 0;
        /// <summary>
        /// 首巡检中为工序 点检为设备 维保为设备型号  
        /// </summary>
        public String MainName { get; set; } = "";
        /// <summary>
        /// 首巡检中为工序 点检为设备 维保为设备型号  
        /// </summary>
        public String MainCode { get; set; } = "";


        /// <summary>
        /// 检验项点类型  1首巡检 2点检 3维护 4 维修（没有）
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
        /// 检验模式类型   （点检： 1日常  2专业 ）
        /// </summary>
        public int ModeType { get; set; } = 0;

        public String ModeTypeName
        {
            get
            {
                return EnumTool.GetEnumDesc<IPTModelTypes>(this.ModeType);

            }
            private set { }
        }

        /// <summary>
        /// 检验项目   点检维护中没有  
        /// </summary>
        public String GroupName { get; set; } = "";

        /// <summary>
        /// 项目明细   点检项目   维护明细
        /// </summary>
        public String ItemName { get; set; } = "";

        /// <summary>
        /// 描述
        /// </summary>
        public String Description { get; set; } = "";

        /// <summary>
        /// 产品ID    首巡检使用
        /// </summary>
        public int ProductID { get; set; } = 0;
        public String ProductNo { get; set; } = "";
        public String ProductName { get; set; } = "";


        /// <summary>
        /// 维护周期H
        /// </summary>
        public int IntervalTime { get; set; } = 0;

        /// <summary>
        /// 维护提前期H
        /// </summary>
        public int AlarmIntervalTime { get; set; } = 0;



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


        /// <summary>
        /// 是否激活： 1为激活 2为禁用
        /// </summary>

        public int Active { get; set; } = 0;


    }
}
