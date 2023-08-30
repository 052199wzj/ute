using System;
using System.Collections.Generic;
using System.Text;

namespace iPlant.FMS.Models
{
    public class BMSTeamCharge
    {
        public int ID { get; set; } = 0;

        public int ItemID { get; set; } = 0;

        public int ShiftIndex { get; set; } = 0;
        public String ShiftName { get; set; } = "";

        public int GroupID { get; set; } = 0;

        public String GroupName { get; set; } = "";

        /**
         * 岗位名称
         */
        public String Name { get; set; } = "";

        public int TeamID { get; set; } = 0;

        public String TeamName { get; set; } = "";

        public int DepartmentID { get; set; } = 0;

        public String DepartmentName { get; set; } = "";

        public int WorkShopID { get; set; } = 0;

        public String WorkShopName { get; set; } = "";

        public int LineID { get; set; } = 0;

        public String LineName { get; set; } = "";

        public int PartID { get; set; } = 0;

        public String PartName { get; set; } = "";

        public int PartPointID { get; set; } = 0;

        public String PartPointName { get; set; } = "";

        public int StationID { get; set; } = 0;

        public String StationName { get; set; } = "";

        /**
         * 根据工位关联 资质证书
         */
        public List<String> CERT { get; set; } = new List<String>();

        public int ModuleID { get; set; } = 0;

        public String ModuleName { get; set; } = "";

        /**
         * 岗位对应的人员
         */
        public List<Int32> MateUserIDList { get; set; } = new List<Int32>();

        public List<Int32> ItemUserIDList { get; set; } = new List<Int32>();

        public String MateUserName { get; set; } = "";

        /**
         * 是否激活
         */
        public int Active { get; set; } = 0;

        public int CreatorID { get; set; } = 0;
        public String Creator { get; set; } = "";
        public DateTime CreateTime { get; set; } = DateTime.Now;
        public int EditorID { get; set; } = 0;
        public String Editor { get; set; } = ""; 
        public DateTime EditTime { get; set; } = DateTime.Now;
         


    }
}
