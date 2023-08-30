using System;
using System.Collections.Generic;
using System.Text;

namespace iPlant.FMS.Models
{
    public class BMSChargeGroup
    {
        public int ID { get; set; } = 0;
         
        /**
         * 分组名称
         */
        public String Name { get; set; } = "";

        public List<Int32> LeaderID { get; set; } = new List<Int32>();
        public String LeaderName { get; set; } = "";

        public int TeamID { get; set; } = 0;
        /**
         * 默认班次ID
         */
        public int ShiftIndex { get; set; } = 0;
        public String ShiftName { get; set; } = "";

        public int CreatorID { get; set; } = 0;
        public String CreatorName { get; set; } = "";
        public DateTime CreateTime { get; set; } = DateTime.Now;
        public int EditorID { get; set; } = 0;
        public String EditorName { get; set; } = "";
        public DateTime EditTime { get; set; } = DateTime.Now;
        public int Active { get; set; } = 0;


    }
}
