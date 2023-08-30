using iPlant.Common.Tools;
using System;

namespace iPlant.FMS.Models
{
    public class DMSSpareRecord
    {
        public int ID { get; set; } = 0;

        public int SpareID { get; set; } = 0;

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
        /// 所属设备型号
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
        /// 备注
        /// </summary>

        public String Remark { get; set; } = "";

  
        /// <summary>
        /// 编辑人
        /// </summary>
        public int EditorID { get; set; } = 0;

        public String EditorName { get; set; } = "";
        /// <summary>
        /// 编辑时刻
        /// </summary>
        public DateTime EditTime { get; set; } = DateTime.Now;


        public int RecordType { get; set; } = ((int)MSSOperateType.Default);
         
        /// <summary>
        /// 类型名称
        /// </summary>
        public string RecordTypeName
        {
            get
            { 
                return EnumTool.GetEnumDesc<MSSOperateType>(this.RecordType);
            }
            private set { }
        }

        /// <summary>
        /// 操作数量
        /// </summary>
        public double RecordNum { get; set; } = 0;


        public int Active { get; set; } = 0;



    }
}
