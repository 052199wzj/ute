using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    public class FPCProduct
    {

        public FPCProduct() { }

        public int ID { get; set; } = 0;

        /// <summary>
        /// 产品编码
        /// </summary>
        public String ProductNo { get; set; } = "";


        /// <summary>
        /// 产品分类 1 长 2短
        /// </summary>
        public int ProductType { get; set; } = 0;

        /// <summary>
        /// 产品规格
        /// </summary>
        public String ProductCode { get; set; } = "";

        /// <summary>
        /// 产品名称
        /// </summary>
        public String ProductName { get; set; } = "";

        public int MaterialID { get; set; } = 0;

        public String MaterialNo { get; set; } = "";

        public String DrawingNo { get; set; } = "";


        /// <summary>
        /// 图纸文件
        /// </summary>		
        public String DrawingNoFile { get; set; } = "";

        public double Length { get; set; } = 0.0;

        /// <summary>
        /// 人工单价
        /// </summary>
        public double LaborUnitPrice { get; set; } = 0.0;

        /// <summary>
        /// 物料单价
        /// </summary>
        public double MaterialUnitPrice { get; set; } = 0.0;

        /// <summary>
        /// 能源单价
        /// </summary>
        public double EnergyUnitPrice { get; set; } = 0.0;

        /// <summary>
        /// 设备单价
        /// </summary>
        public double DeviceUnitPrice { get; set; } = 0.0;

        /// <summary>
        /// 描述
        /// </summary>
        public String Description { get; set; } = "";




        /// <summary>
        /// 编辑时刻
        /// </summary>
        public DateTime EditTime { get; set; } = DateTime.Now;
        /// <summary>
        /// 编辑人ID
        /// </summary>
        public int EditorID { get; set; } = 0;
        /// <summary>
        /// 编辑人名字
        /// </summary>
        public String EditorName { get; set; } = "";

        /// <summary>
        /// 创建时刻
        /// </summary>
        public DateTime CreateTime { get; set; } = DateTime.Now;

        /// <summary>
        /// 创建人ID
        /// </summary>
        public int CreatorID { get; set; } = 0;

        /// <summary>
        /// 创建人名
        /// </summary>
        public String CreatorName { get; set; } = "";

        /// <summary>
        /// 状态
        /// </summary>
        public int Active { get; set; } = 0;

    }
}
