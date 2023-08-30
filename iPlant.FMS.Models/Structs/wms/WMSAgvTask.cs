using iPlant.Common.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    public class WMSAgvTask
    {
        public int ID { get; set; } = 0;


        //与AGV对接任务编号  对接后才有值 调度任务确认后开始对接
        public String Code { get; set; } = "";

        public int LineID { get; set; } = 0;
        public String LineName { get; set; } = "";
        public int DeviceID { get; set; } = 0;
        public String DeviceNo { get; set; } = "";
        public String DeviceName { get; set; } = "";

        /// <summary>
        /// 任务类型  1成品下料  2废料下料  3 原料上料
        /// </summary>
        public int TaskType { get; set; } = 0;

        public String TaskTypeText
        {
            get
            {
                 
                return EnumTool.GetEnumDesc<WMSAgvTaskTypes>(TaskType);

            }
            private set { }
        }
        /// <summary>
        /// 起始位置设备ID  
        /// </summary>
        public int SourcePositionID { get; set; } = 0;


        /// <summary>
        /// 起始位置点位编号
        /// </summary>
       
        public String SourcePositionCode { get; set; } = "";
        /// <summary>
        /// 起始位置设备名称
        /// </summary>
        public String SourcePositionName { get; set; } = "";

        /// <summary>
        /// 目标位置编码
        /// </summary>
        public String TargetPositionCode { get; set; } = "";
        /// <summary>
        /// 目标位置名称 根据任务类型生成
        /// </summary> 
        public String TargetPositionName
        {
            get
            {
                if (!String.IsNullOrWhiteSpace(TargetPositionCode))
                {
                    return TargetPositionCode;
                }
                return EnumTool.GetEnumDesc<WMSTargetPosition>(TaskType);

            }
            private set { }
        }

        /// <summary>
        /// 载物批量
        /// </summary>
        public double DeliveryNum { get; set; } = 0;

        /// <summary>
        /// 任务创建时刻
        /// </summary>
        public DateTime CreateTime { get; set; } = DateTime.Now;

        /// <summary>
        /// 到达起点时刻
        /// </summary>
        public DateTime StartTime { get; set; } = new DateTime(2000, 1, 1);

        /// <summary>
        /// 到达目标地点时刻
        /// </summary>
        public DateTime ArriveTime { get; set; } = new DateTime(2000, 1, 1);

        /// <summary>
        /// 任务结束时刻
        /// </summary>
        public DateTime EndTime { get; set; } = new DateTime(2000, 1, 1);

        /// <summary>
        /// 任务状态
        /// </summary>
        public int Status { get; set; } = 0;


        /// <summary>
        /// 确认人
        /// </summary>
        public int ConfirmerID { get; set; } = 0;
        public String ConfirmerName { get; set; } = "";


        /// <summary>
        /// 任务确认时刻
        /// </summary>
        public DateTime ConfirmTime { get; set; } = new DateTime(2000, 1, 1);

        /// <summary>
        /// 更新时刻
        /// </summary>
        public DateTime EditTime { get; set; } = DateTime.Now;

        /// <summary>
        /// 备注
        /// </summary>
        public String Remark { get; set; } = "";
    }



}
