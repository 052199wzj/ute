using iPlant.Common.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class OMSOrder
    {
        public OMSOrder()
        {
        }

        public int ID { get; set; } = 0;
        /// <summary>
        /// 订单ID
        /// </summary>
        public int CommandID { get; set; } = 0;

        /// <summary>
        ///  订单编号
        /// </summary> 
        public String CommandNo { get; set; } = "";
        
        /// <summary>
        /// ERPID
        /// </summary>
        public int ERPID { get; set; } = 0;
        /// <summary>
        /// 工序任务ID 
        /// </summary>  
        public String OrderNo { get; set; } = "";

        /// <summary>
        /// 产线ID
        /// </summary>
        public int LineID { get; set; } = 0;

        /// <summary>
        /// 产线名称   
        /// </summary>
        public String LineName { get; set; } = "";



        /// <summary>
        /// 订单状态  系统启动获取开工的订单，其他订单自动关闭
        /// </summary>
        public int Status { get; set; } = 0;


        /// <summary>
        /// 计划开工日期
        /// </summary>
        public DateTime PlanReceiveDate { get; set; } = new DateTime(2000, 1, 1);
        /// <summary>
        /// 计划完工日期
        /// </summary>
        public DateTime PlanFinishDate { get; set; } = new DateTime(2000, 1, 1);
        /// <summary>
        /// 实际开工日期  开工日期
        /// </summary>
        public DateTime RealStartDate { get; set; } = new DateTime(2000, 1, 1);
        /// <summary>
        /// 实际完工日期  完工日期
        /// </summary>
        public DateTime RealFinishDate { get; set; } = new DateTime(2000, 1, 1);
        /// <summary>
        ///  实际发货日期   上传日期 
        /// </summary>

        public DateTime RealSendDate { get; set; } = new DateTime(2000, 1, 1);
        /**
         * 备注信息
         */
        public String Remark { get; set; } = "";

        public int StationID { get; set; } = 0;

        public String StationNo { get; set; } = "";
        public String StationName { get; set; } = "";

        /// <summary>
        /// 设备编号   MES传输
        /// </summary> 
        public String DeviceNo { get; set; } = "";
        /// <summary>
        /// 采集编号  通过采集编号与MES关联    MES传输
        /// </summary>
        public String AssetNo { get; set; } = "";
        /// <summary>
        /// 设备名称   MES传输
        /// </summary>
        public String DeviceName { get; set; } = "";

        /// <summary>
        /// 加工工序   MES传输
        /// </summary>
        public String WorkPartPointCode { get; set; } = "";

        /// <summary>
        /// 加工工序名称   MES传输
        /// </summary>
        public String WorkPartPointName { get; set; } = "";


        /// <summary>
        /// 作业名称
        /// </summary>
        public String WorkName { get; set; } = "";

        public int TeamID { get; set; } = 0;

        public String TeamNo { get; set; } = "";
        public String TeamName { get; set; } = "";

        public List<Int32> WorkerIDList = new List<Int32>();

        /// <summary>
        /// 作业人员  
        /// </summary>
        public String WorkerName = "";
        /**
            * 创建人ID
            */
        public int CreatorID { get; set; } = 0;
        /**
         * 创建人名称
         */
        public String Creator { get; set; } = "";
        /**
         * 创建时刻
         */
        public DateTime CreateTime { get; set; } = new DateTime(2000, 1, 1);
        /**
         * 编辑人ID
         */
        public int EditorID { get; set; } = 0;
        /**
         * 编辑人名称
         */
        public String Editor { get; set; } = "";
        /**
         * 编辑时刻
         */
        public DateTime EditTime { get; set; } = new DateTime(2000, 1, 1);
        /**
         * 审核人ID
         */
        public int AuditorID { get; set; } = 0;
        /**
         * 审核人Name
         */
        public String Auditor { get; set; } = "";
        /// <summary>
        /// 审核时刻  下达时刻
        /// </summary>
        public DateTime AuditTime { get; set; } = new DateTime(2000, 1, 1);

        public int OverTime
        {
            get
            {

                switch ((OMSOrderStatus)Status)
                {
                    case OMSOrderStatus.Default:
                    case OMSOrderStatus.HasOrder:
                    case OMSOrderStatus.PlantOrder:
                    case OMSOrderStatus.WeekPlantOrder:

                        if (DateTime.Now > PlanReceiveDate && PlanReceiveDate > new DateTime(2020, 1, 1))
                        {
                            return (int)(DateTime.Now - PlanReceiveDate).TotalMinutes;
                        }

                        break;
                    case OMSOrderStatus.ProductOrder:
                        if (DateTime.Now > PlanFinishDate && PlanFinishDate > new DateTime(2020, 1, 1))
                        {
                            return (int)(DateTime.Now - PlanFinishDate).TotalMinutes;
                        }

                        break;
                    case OMSOrderStatus.FinishOrder:
                    case OMSOrderStatus.StopOrder:
                    case OMSOrderStatus.StockOrder:
                    case OMSOrderStatus.SendOrder:
                        if (RealFinishDate > PlanFinishDate)
                        {
                            return (int)(RealFinishDate - PlanFinishDate).TotalMinutes;
                        }
                        break;
                    case OMSOrderStatus.CloseOrder:
                    case OMSOrderStatus.OverOrder:
                        break;
                    default:
                        break;
                }
                return 0;

            }
            set { }
        }

        public String OverTimeText
        {
            get
            {

                String wResult = "";
                int wOverTime = OverTime;
                if (wOverTime <= 0)
                    return wResult;
                int wDays = wOverTime / (24 * 60);

                if (wDays > 0)
                {
                    wOverTime -= (wDays * 24 * 60);
                    wResult += (wDays + "天");
                }

                int wHours = wOverTime / 60;
                if (wDays > 0 || wHours > 0)
                {
                    wOverTime -= (wHours * 60);
                    wResult += (wHours + "小时");
                }
                wResult += (wOverTime + "分钟");

                return wResult;
            }
            set { }
        }


        /// <summary> 
        /// 产品规格ID    MES传输
        /// </summary>
        public int ProductID { get; set; } = 0;



        //计划数量
        public double PlanFQTY { get; set; } = 0;
        
        /// <summary>
        /// 上料数
        /// </summary>
        public double FeedFQTY { get; set; } = 0;

        /// <summary>
        /// 来源于工件状态为完成或报废的数量
        /// </summary>
        public double DoneFQTY { get; set; } = 0;

        /// <summary>
        /// 来源于工件状态为不合格或报废的统计
        /// </summary>
        public double BadFQTY { get; set; } = 0;

        public double GoodFQTY
        {
            get
            {
                if (DoneFQTY < BadFQTY)
                    return 0;
                return DoneFQTY - BadFQTY;
            }
            private set { }
        }

        public double RateFQTY
        {
            get
            {
                return (PlanFQTY > 0 && DoneFQTY > 0) ? DoneFQTY / PlanFQTY : 0;
            }
            private set { }
        }

        public double GoodRateFQTY
        {
            get
            {
                return (DoneFQTY > 0 && GoodFQTY > 0) ? GoodFQTY / DoneFQTY : 0;
            }
            private set { }
        }


        public int OrderPriority { get; set; } = 0;

        public String Description { get; set; } = "";

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


        #region OMSCommand属性
        /// <summary>
        /// 车号
        /// </summary>
        public String PartNo { get; set; } = "";


        public String WBSNo { get; set; } = "";



        public int CustomerID { get; set; } = 0;
        public String Customer { get; set; } = "";
        public String ContactCode { get; set; } = "";
        public int LinkManID { get; set; } = 0;
        public String LinkMan { get; set; } = "";
        public int FactoryID { get; set; } = 0;
        public String Factory { get; set; } = "";
        public int BusinessUnitID { get; set; } = 0;
        public String BusinessUnit { get; set; } = "";

        public int WorkShopID { get; set; } = 0;

        public String WorkShopName { get; set; } = "";
        #endregion


        #region  产品属性

        public double Length { get; set; } = 0.0;


        /// <summary> 
        /// 产品规格    MES传输
        /// </summary>
        public String ProductNo { get; set; } = "";

        public String ProductName { get; set; } = "";

        public String DrawingNo { get; set; } = "";


        /// <summary>
        /// 图纸文件
        /// </summary>		
        public String DrawingNoFile { get; set; } = "";



        #endregion

        /// <summary>
        /// 当前产品序列号 更改工件状态时 修改订单工件序列号
        /// </summary>
        public String CurrentWorkpieceNo { get; set; } = "";

        public double ThreeCheckNum { get; set; } = 0.0;

        public double ThreeCheckBadNum { get; set; } = 0.0;

        public double SpotCheckNum { get; set; } = 0.0;

        public double SpotCheckBadNum { get; set; } = 0.0;

        public double RepairNum { get; set; } = 0.0;

    }

 
}
