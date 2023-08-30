using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace iPlant.FMS.Models
{
    
    public class BMSTeamManage
    { 
        public int ID { get; set; }=0;

        
        public String Code { get; set; } = "";

        
        public String Name { get; set; } = "";
          
        /**
         * 职能ID
         */
        public int ModuleID { get; set; } = 0;

        public String ModuleName { get; set; } = "";

        public int WorkShopID { get; set; } = 0;

        public String WorkShopName { get; set; } = "";

        
        public int DepartmentID { get; set; } = 0;
        
        public List<Int32> LeaderID { get; set; } = new List<Int32>();
        
        public List<Int32> MateID { get; set; } = new List<Int32>();


        
        public String MateCode { get; set; } = "";

        
        public String MateName { get; set; } = "";
        
        public String LeaderName { get; set; } = "";
        
        public String LeaderCode { get; set; } = "";

        
        public String Remark { get; set; } = "";
        
        public String DepartmentName { get; set; } = "";

        
        public String DepartmentCode { get; set; } = "";

        public List<BMSTeamCharge> TeamChargeList { get; set; } = new List<BMSTeamCharge>();

        public List<BMSTeamItem> TeamItemList { get; set; } = new List<BMSTeamItem>();

        public List<BMSChargeGroup> ChargeGroupList { get; set; } = new List<BMSChargeGroup>();

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
