using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 备件台账
    /// </summary> 

    public class DMSSpareLedger
    {
        public int ID { get; set; } = 0;
        /// <summary>
        /// 备件编码
        /// </summary>

        public String Code { get; set; } = "";

        /// <summary>
        ///  备件名称
        /// </summary>

        public String Name { get; set; } = "";

        /// <summary>
        /// 备件型号
        /// </summary>

        public String ModelName { get; set; } = "";


        /// <summary>
        /// 厂家名称
        /// </summary> 

        public String ManufactorName { get; set; } = "";

        /// <summary>
        /// 供应商名称
        /// </summary>

        public String SupplierName { get; set; } = "";


        /// <summary>
        /// 车间ID
        /// </summary>
        public int WorkShopID { get; set; } = 0;

        public String WorkShopName { get; set; } = "";
        /// <summary>
        /// 产线ID
        /// </summary>
        public int LineID { get; set; } = 0;

        public String LineName { get; set; } = "";

        /// <summary>
        /// 更换周期
        /// </summary>
        public String Period { get; set; } = "";

        /// <summary>
        /// 描述
        /// </summary>

        public String Description { get; set; } = "";



        /// <summary>
        /// 录入人
        /// </summary>
        public int CreatorID { get; set; } = 0;

        public String CreatorName { get; set; } = "";
        /// <summary>
        /// 录入时刻
        /// </summary>
        public DateTime CreateTime { get; set; } = DateTime.Now;

        /// <summary>
        /// 编辑人
        /// </summary>
        public int EditorID { get; set; } = 0;

        public String EditorName { get; set; } = "";
        /// <summary>
        /// 编辑时刻
        /// </summary>
        public DateTime EditTime { get; set; } = DateTime.Now;

        /// <summary>
        /// 库存数量
        /// </summary>
        public double StockNum { get; set; } = 0;

        /// <summary>
        /// 是否激活： 1为激活 2为禁用
        /// </summary>

        public int Active { get; set; } = 0;
    }
}
