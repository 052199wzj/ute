using iPlant.Common.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 工件信息
    /// </summary>
    public class QMSWorkpiece
    {
        public QMSWorkpiece() { }

        public int ID { get; set; } = 0;


        public int OrderID { get; set; } = 0;

        /// <summary>
        /// 订单号
        /// </summary>
        public String OrderNo { get; set; } = "";

        public int LineID { get; set; } = 0;

        /// <summary>
        /// 产线
        /// </summary>
        public String LineName { get; set; } = "";


        /// <summary>
        /// 产品型号ID
        /// </summary>
        public int ProductID { get; set; } = 0;

        /// <summary>
        /// 产品编号
        /// </summary>
        public String ProductNo { get; set; } = "";
        /// <summary>
        /// 产品名称
        /// </summary>
        public String ProductName { get; set; } = "";
        /// <summary>
        /// 工件编码   20200708-01-1
        /// </summary>
        public String WorkpieceNo { get; set; } = "";

        /// <summary>
        /// 工件打印内容
        /// </summary>
        public String PrintNo
        {
            get
            {

                if (StringUtils.isEmpty(OrderNo) || StringUtils.isEmpty(WorkpieceNo) || OrderNo.Length < 11 || StringUtils.isEmpty(ProductNo))
                {
                    return "";
                }
                else
                {
                    return String.Format("{0}-{1}-{2}", WorkpieceNo, OrderNo.Substring(10, 1), ProductNo);
                }

            }
        }

        public int WorkpieceCode
        {
            get
            {
                if (StringUtils.isEmpty(WorkpieceNo) || WorkpieceNo.Length < 13)
                {
                    return 0;
                }
                else
                {
                    return StringUtils.parseInt(WorkpieceNo.Substring(12));
                }
            }
        }



        /// <summary>
        /// 所在产线位置  根据状态决定  完工就在料框 入库就在仓库 其他就给空 使用产线实时信息填充
        /// </summary>
        public String StationName { get; set; } = "";

        /// <summary>
        /// 车间抽检结果
        /// </summary>
        public int SpotCheckResult { get; set; } = 0;
        /// <summary>
        /// 车间巡检结果
        /// </summary>
        public int PatrolCheckResult { get; set; } = 0;
        /// <summary>
        /// 返修次数
        /// </summary>
        public int RepairCount { get; set; } = 0;
        /// <summary>
        /// 产线上料时间
        /// </summary>
        public DateTime StartTime { get; set; } = DateTime.Now;
        /// <summary>
        /// 产线下料时间
        /// </summary>
        public DateTime EndTime { get; set; } = DateTime.Now;
        /// <summary>
        /// 工件状态
        /// </summary>
        public int Status { get; set; } = 0;
        /// <summary>
        /// 工件状态名称
        /// </summary>
        public String StatusName
        {
            get
            {
                return EnumTool.GetEnumDesc<OMSWorkpieceStatus>(this.Status);
            }
            private set { }
        }
        /// <summary>
        /// 三坐标结果
        /// </summary>
        public int ThreeDimensionalResult { get; set; } = 0;

        /// <summary>
        /// 工件备注
        /// </summary>
        public String Remark { get; set; } = "";

        public int CheckResult { get; set; } = 0;

        public int RepairResult { get; set; } = 0;

        public String RepairRemark { get; set; } = "";

    }


}
