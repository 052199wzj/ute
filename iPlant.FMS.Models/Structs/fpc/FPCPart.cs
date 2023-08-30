using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class FPCPart
    {


        public FPCPart()
        {
        }

        public int ID { get; set; } = 0;
        public String Name { get; set; } = "";

        public String Code { get; set; } = "";

        public int WorkShopID { get; set; } = 0;

        public String WorkShopName { get; set; } = "";

        public int LineID { get; set; } = 0;

        public String LineName { get; set; } = "";


        public DateTime CreateTime { get; set; } = DateTime.Now;

        public int CreatorID { get; set; } = 0;

        public DateTime EditTime { get; set; } = DateTime.Now;

        public int EditorID { get; set; } = 0;
          

        public int FactoryID { get; set; } = 0; // 工厂

        public int BusinessUnitID { get; set; } = 0; // 事业部

        public int ProductTypeID { get; set; } = 0; // 产品类型

        /**
         * 工位类型 普通工位 -1 预检工位-2 质量工位-3 普查工位-4
         */
        public int PartType { get; set; } = 0;

        public int QTPartID { get; set; } = 0;

        public String Factory { get; set; } = "";

        public String BusinessUnit { get; set; } = "";

        public String ProductType { get; set; } = "";

        public String Creator { get; set; } = "";
         

        public String Editor { get; set; } = "";
          
        public int OrderNum { get; set; } = 0;
        //	
        //	public int AreaID=0;
        //	
        //	public int AreaLeaderID=0;

        public int Active { get; set; } = 0; // 状态 

        public int ERPID { get; set; } = 0;
    }
}
