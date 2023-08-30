using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class FMCLine
    { 
        public FMCLine()
        {
        }

        public int ID { get; set; } = 0;

        public String Name { get; set; } = "";

        public String Code { get; set; } = "";

        public String PLMCode { get; set; } = "";

        public DateTime CreateTime { get; set; } = DateTime.Now;

        public int CreatorID { get; set; }=0;

        public DateTime EditTime { get; set; } = DateTime.Now;

        public int EditorID { get; set; } = 0;
          
        public int FactoryID { get; set; } = 1;

        public int BusinessUnitID { get; set; } = 0;

        public int WorkShopID { get; set; } = 1;

        public String Factory { get; set; } = "";

        public String BusinessUnit { get; set; } = "";

        public String WorkShop { get; set; } = "";

        public String Creator { get; set; } = "";
          
        public String Editor { get; set; } = "";
         
        public int Active { get; set; } = 0; // 状态

        public int Mode { get; set; } = 0; // 1:物理产线模式(物理产线同工艺路径);2.虚拟产线模式(产线自由组合)

        public String ModeText { get; set; } = ""; // 1:物理产线模式(物理产线同工艺路径);2.虚拟产线模式(产线自由组合)

        public int ERPID { get; set; } = 0; // ERP对象ID

        public List<FMCLineUnit> UnitList { get; set; } = new List<FMCLineUnit>(); // 工序、工位、工步、工位

        public String FactoryCode { get; set; } = "";

        public String BusinessCode { get; set; } = "";

        public String WorkShopCode { get; set; } = "";

        public int ShiftID { get; set; } = 0; // 班次模板

        public String ShiftName { get; set; } = ""; // 班次模板名称
    }
}
