using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class CFGCalendar
    {


        public CFGCalendar()
        {
        }

        public DateTime HolidayDate { get; set; } = DateTime.Now; // 日期

        public int Year { get; set; } = 0; // 年

        public int Active { get; set; } = 0; // 激活

        public int OperatorID { get; set; } = 0; // 操作员ID

        public DateTime OperationTime { get; set; } = DateTime.Now; // 操作时刻

        public String OperatorName { get; set; } = ""; // 操作员

        public int WorkShopID { get; set; } = 0; // 车间

        public int LineID { get; set; } = 0; // 产线

    }
}
