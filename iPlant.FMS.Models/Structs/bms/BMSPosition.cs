using System;
using System.Collections.Generic;
using System.Text;

namespace iPlant.FMS.Models
{
    public class BMSPosition
    {


        public int ID { get; set; }=0;

        public String Name { get; set; } = "";

        public String Code { get; set; } = "";

        public int Active { get; set; } = 0;

        /**
         * 默认上级岗位ID  弃用
         */
        public int ParentID { get; set; } = 0;

        public int DepartmentID { get; set; } = 0;

        public int PrevDepartmentID { get; set; } = 0;


        /**
         * 职责ID  
         */
        public int DutyID { get; set; } = 0;

        public int CreatorID { get; set; } = 0;


        public String Creator { get; set; } = "";

        public DateTime CreateTime { get; set; } = DateTime.Now;
        public int EditorID { get; set; } = 0;


        public String Editor { get; set; } = "";

        public DateTime EditTime { get; set; } = DateTime.Now;

         
    }
}
