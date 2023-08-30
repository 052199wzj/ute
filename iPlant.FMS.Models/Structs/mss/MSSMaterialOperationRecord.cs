using iPlant.Common.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    public class MSSMaterialOperationRecord
    {
        public MSSMaterialOperationRecord()
        {
        }

        public int ID { get; set; } = 0;

        public int StockID { get; set; } = 0;

        /// <summary>
        /// 物料ID
        /// </summary>
        public int MaterialID { get; set; } = 0;



        /// <summary>
        /// 物料ID
        /// </summary>
        public int LocationID { get; set; } = 0;
        /// <summary>
        /// 存放点
        /// </summary>
        public string LocationName { get; set; } = "";

        /// <summary>
        /// 存放点
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
        /// 物料批次
        /// </summary>
        public string MaterialBatch { get; set; } = "";

        /// <summary>
        /// 数量
        /// </summary>
        public double Num { get; set; } = 0;

        public double StockNum { get; set; } = 0;

        public double PrevStockNum { get; set; } = 0;

        public double NextStockNum { get; set; } = 0;

        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; } = "";

        /// <summary>
        /// 操作类型
        /// </summary>
        public int OperationType { get; set; } = 0;

        /// <summary>
        /// 操作类型名称
        /// </summary>
        public string OperationTypeName
        {
            get
            {

                return EnumTool.GetEnumDesc<MSSOperateType>(this.OperationType);
            }
            private set { }
        }  

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
        public string Creator { get; set; } = "";
    }
}
