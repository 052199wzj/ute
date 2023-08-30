using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class FMCWorkShop
    {


        public FMCWorkShop()
        {
        }

        public int ID { get; set; } = 0;

        public String Name { get; set; } = "";

        public String Code { get; set; } = "";

        public DateTime CreateTime { get; set; } = DateTime.Now;

        public int CreatorID { get; set; } = 0;

        public DateTime EditTime { get; set; } = DateTime.Now;

        public int EditorID { get; set; } = 0; 
         

        public int FactoryID { get; set; } = 0;

        public int BusinessUnitID { get; set; } = 0;

        public String Factory { get; set; } = "";

        public String BusinessUnit { get; set; } = "";

        public String Creator { get; set; } = "";
         

        public String Editor { get; set; } = "";
         

        public int Active { get; set; } = 0;           //状态

        public String BusinessCode { get; set; } = "";

        public String FactoryCode { get; set; } = "";

        public int Shifts { get; set; } = 0;              //默认一天几班：1:早；2中；3：晚

        public int ShiftID { get; set; } = 0;             //班次模板

        public String ShiftName { get; set; } = "";           //班次模板名称

        public int SCPeriod { get; set; } = 0;

        public int ERPID { get; set; } = 0;
    }
}
