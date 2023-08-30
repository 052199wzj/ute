using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class BFCHomePageGroup
    {


        public BFCHomePageGroup()
        {
        }

        public int ID { get; set; }=0;

        public String Name { get; set; } = "";

        public String Icon { get; set; } = "";

        public String IconColor { get; set; } = "";

        public String Icon_S { get; set; } = "";

        public int Type { get; set; } = 0;

        public int GroupID { get; set; } = 0;

        public int Active { get; set; } = 0;

        public int Grad { get; set; } = 0;

        /**
         *  权限ID  为0不做权限控制
         */
        public int RoleID { get; set; } = 0;

        public DateTime CreateTime { get; set; } = DateTime.Now;

        public DateTime EditTime { get; set; } = DateTime.Now;

        public int CreatorID { get; set; } = 0;

        public int EditorID { get; set; } = 0;


        public int IsDefault { get; set; } = 0;

        public int OrderNum { get; set; } = 0;

        public int MessageCount { get; set; } = 0;

        public List<BFCHomePageModule> ModuleList { get; set; } = new List<BFCHomePageModule>();


        public List<BFCHomePageGroup> GroupList { get; set; } = new List<BFCHomePageGroup>();
    }
}
