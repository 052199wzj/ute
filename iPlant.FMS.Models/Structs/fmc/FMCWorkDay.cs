using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class FMCWorkDay
    {


        public FMCWorkDay()
        {
        }

        public int ID { get; set; } = 0; // 1--8;

        public String Name { get; set; } = ""; // 班次名称

        public DateTime StartTime { get; set; } = new DateTime(2000,1,1,0,0,0); // 开始时刻

        public int Minutes { get; set; } = 0; // 总时长;

        public int WorkMinutes { get; set; } = 0; // 工作时长;

        public int IdleMinutes { get; set; } = 0; // 休息时长;

        public DateTime EndTime { get; set; } = DateTime.Now; // 结束时刻

        public List<FMCShift> ShiftList { get; set; } = new List<FMCShift>();

        public int Active { get; set; } = 0;
         

        public DateTime CreateTime { get; set; } = DateTime.Now;

        public int CreatorID { get; set; } = 0;

        public DateTime EditTime { get; set; } = DateTime.Now;

        public int EditorID { get; set; } = 0;  

        public int FactoryID { get; set; } = 0;

        public int WorkShopID { get; set; } = 0;

        public String WorkShopName { get; set; } = "";

        public String Factory { get; set; } = "";

        public String Creator { get; set; } = "";
         

        public String Editor { get; set; } = "";
         
    }
}
