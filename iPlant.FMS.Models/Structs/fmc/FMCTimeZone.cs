using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class FMCTimeZone
    {  
        public FMCTimeZone()
        {
        }

        public int ID { get; set; } = 0; // 0--100;

        public String ZoneName { get; set; } = "";

        public DateTime StartTime { get; set; } = DateTime.Now;// 开始时刻

        public int Minutes { get; set; } = 0; // 时长;

        public Boolean IdleOrWork { get; set; } = false; // true:休息，false：工作

        public int ShiftID { get; set; } = 0;

    }
}
