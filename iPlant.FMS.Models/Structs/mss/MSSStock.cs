using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    public class MSSStock
    {
        public int ID { get; set; } = 0;

        /// <summary>
        /// 物料ID
        /// </summary>
        public int MaterialID { get; set; } = 0;
         

        /// <summary>
        /// 存放点ID
        /// </summary>
        public int LocationID { get; set; } = 0;
        /// <summary>
        /// 存放点
        /// </summary>
        public string LocationName { get; set; } = "";

        /// <summary>
        /// 存放点编码
        /// </summary>
        public string LocationCode { get; set; } = "";

        /// <summary>
        /// 物料编号
        /// </summary>
        public string MaterialNo { get; set; } = "";

        /// <summary>
        /// 物料名称
        /// </summary>
        public string MaterialName { get; set; } = "";

        /// <summary>
        /// 物料规格型号
        /// </summary>
        public string Groes { get; set; } = "";
 
        /// <summary>
        /// 库存数量
        /// </summary>
        public double StockNum { get; set; } = 0;


 
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; } = DateTime.Now;

        /// <summary>
        /// 创建人ID
        /// </summary>
        public int CreatorID { get; set; } = 0;

        /// <summary>
        /// 创建人名称
        /// </summary>
        public string CreatorName { get; set; } = "";


        /// <summary>
        /// 编辑时间
        /// </summary>
        public DateTime EditTime { get; set; } = DateTime.Now;

        /// <summary>
        /// 编辑人ID
        /// </summary>
        public int EditorID { get; set; } = 0;

        /// <summary>
        /// 编辑人名称
        /// </summary>
        public string EditorName { get; set; } = "";

        /// <summary>
        /// 描述
        /// </summary>
        public string Description { get; set; } = "";
    }

    
}
