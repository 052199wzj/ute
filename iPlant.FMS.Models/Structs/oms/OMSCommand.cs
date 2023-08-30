using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class OMSCommand
    { 
        public OMSCommand()
        {
        }

        public int ID { get; set; } = 0;

        public String WBSNo { get; set; } = "";

        public String PartNo { get; set; } = "";


        /// <summary> 
        /// 产品规格ID  车型
        /// </summary>
        public int ProductID { get; set; } = 0;
        /**
         * 产品规格
         */
        public String ProductNo { get; set; } = "";

        /// <summary>
        /// 线路ID
        /// </summary>
        public int CustomerID { get; set; } = 0;
        /// <summary>
        /// 线路名称
        /// </summary>
        public String CustomerName { get; set; } = "";

        public String CustomerCode { get; set; } = "";

        public String ContactCode { get; set; } = "";
          
        public int LinkManID { get; set; } = 0;

        public int EditorID { get; set; } = 0;

        public String Editor { get; set; } = "";

        public DateTime EditTime { get; set; } = DateTime.Now; 

        public String LinkMan { get; set; } = "";

        public String LinkPhone { get; set; } = "";

        public int OrderCount { get; set; } = 0;

        public List<OMSOrder> OrderList { get; set; } =  new List<OMSOrder>();
         

        public int CreatorID { get; set; } = 0;

        public String Creator { get; set; } = "";

        public DateTime CreateTime { get; set; } = DateTime.Now;
         

        public int FactoryID { get; set; } = 0;

        public int BusinessUnitID { get; set; } = 0;

        public String Factory { get; set; } = "";

        public String BusinessUnit { get; set; } = "";
         
        public int WorkShopID { get; set; } = 0;

        public String WorkShopName { get; set; } = "";


    }
}
