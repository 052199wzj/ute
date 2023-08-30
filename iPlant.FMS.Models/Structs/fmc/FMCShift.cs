using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class FMCShift
    {  
        public FMCShift()
        {
        }

        public int ID { get; set; } = 0; // 1--8;

        public String Name { get; set; }=""; // 班次名称

        public DateTime StartTime { get; set; } = DateTime.Now; // 开始时刻

        public int Minutes { get; set; } = 0; // 总时长;

        public int WorkMinutes { get; set; } = 0; // 工作时长;

        public int IdleMinutes { get; set; } = 0; // 休息时长;

        public List<FMCTimeZone> IdleZoneList { get; set; } = new List<FMCTimeZone>();

        public DateTime EndTime { get; set; } = DateTime.Now; // 结束时刻

        public int Active = 0;

        public DateTime CreateTime { get; set; } = DateTime.Now;

        public int CreatorID { get; set; } = 0;

        public String Creator { get; set; } = "";

        public int WorkDayID { get; set; } = 0; // 模板;

        public int LevelID { get; set; } = 0; // 1--3：白、中、晚;

    }
}
