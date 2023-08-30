using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class FMCLineUnit
    { 
        public FMCLineUnit()
        {
        }

        public int ID { get; set; } = 0;

        public String UnitCode { get; set; } = "";

        public int ProductID { get; set; } = 0;

        public int CustomerID { get; set; } = 0;

        public int LineID { get; set; } = 0; // 产线

        public String LineName { get; set; } = "";// 产线
        public String LineCode { get; set; } = ""; // 产线

        public int UnitID { get; set; } = 0; // 工序、工步、工位

        public int Type { get; set; } = 0;

        public int OrderID { get; set; } = 0; // 次序

        public int LevelID { get; set; } = 0; // 层级（工序、工步、工位）

        public String LevelName { get; set; } = ""; // 层级文本

        public DateTime CreateTime { get; set; } = DateTime.Now;

        public int CreatorID { get; set; } = 0;

        public DateTime EditTime { get; set; } = DateTime.Now;

        public int EditorID { get; set; } = 0;
            
        public String Creator { get; set; } = ""; 

        public String Editor { get; set; } = "";
          
        public int Active { get; set; }=0; // 状态

        public String Name { get; set; } = "";

        /**
         * 唯一标识
         */
        public String Code { get; set; } = "";

        public int ParentUnitID { get; set; } = 0;


        public List<FMCLineUnit> UnitList { get; set; } = new List<FMCLineUnit>(); // 工位

        public int WorkHour { get; set; } = 0; // 标准工时

        public int ShiftDays { get; set; } = 0; // 工段：工段间的排班间隔;

        public int QTPeriod { get; set; } = 0; // 工序：质量巡检周期;

        public int TechPeriod { get; set; } = 0; // 工序：工艺巡检周期;
    }
}
