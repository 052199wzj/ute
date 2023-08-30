using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{

    public class QMSThreeDimensionalCheckResult  
    {  
        public QMSThreeDimensionalCheckResult() { }

        public int ID { get; set; } = 0;
        public int ProductID { get; set; } = 0;
        public String ProductNo { get; set; } = "";
        public String ProductName { get; set; } = "";


        public int ParameterID { get; set; } = 0;

        /// <summary>
        /// 检测参数
        /// </summary>
        public String CheckParameter { get; set; } = "";
        /// <summary>
        /// 理论值
        /// </summary>
        public Double TheoreticalValue { get; set; } = 0;
        /// <summary>
        /// 下公差
        /// </summary>
        public Double LowerTolerance { get; set; } = 0;
        /// <summary>
        /// 上公差
        /// </summary>
        public Double UpperTolerance { get; set; } = 0;


        public int EditorID { get; set; } = 0;

        public String EditorName { get; set; } = "";
        public DateTime EditTime { get; set; } = DateTime.Now;


        public int RecordID { get; set; } = 0;
 
        public String WorkpieceNo { get; set; } = "";
         
         
        /// <summary>
        /// 实际值
        /// </summary>
        public Double ActualValue { get; set; } = 0;
        /// <summary>
        /// 误差
        /// </summary>
        public Double ErrorValue
        {
            get
            {
                return ActualValue - TheoreticalValue;
            }
            private set
            {
            }
        }
       
        /// <summary>
        /// 超差
        /// </summary>
        public Double OutOfTolerance
        {
            get
            {
                Double wResult = 0;
                if (UpperTolerance < LowerTolerance)
                {
                    wResult = LowerTolerance;
                    LowerTolerance = UpperTolerance;
                    UpperTolerance = wResult;
                }

                if (ErrorValue < LowerTolerance)
                {
                    wResult = ErrorValue - LowerTolerance;
                }
                else if (ErrorValue > UpperTolerance)
                {
                    wResult = ErrorValue - UpperTolerance;
                }
                else
                {
                    wResult = 0;
                }
                return wResult;
            }
            private set
            {
            }
        }

        /// <summary>
        /// 结果
        /// </summary>
        public int Result { get; set; } = 0;

        /// <summary>
        /// 新插入1 将旧的全部变0
        /// </summary>
        public int Active { get; set; } = 0;
    }

    public class QMSThreeDimensionalSet
    {
        public int ID { get; set; } = 0;
        public int ProductID { get; set; } = 0;
        public String ProductNo { get; set; } = "";
        public String ProductName { get; set; } = "";

        public int Type { get; set; } = 0;

        public int ParameterID { get; set; } = 0;
        /// <summary>
        /// 检测参数
        /// </summary>
        public String CheckParameter { get; set; } = "";
        /// <summary>
        /// 理论值
        /// </summary>
        public Double TheoreticalValue { get; set; } = 0;
        /// <summary>
        /// 下公差
        /// </summary>
        public Double LowerTolerance { get; set; } = 0;
        /// <summary>
        /// 上公差
        /// </summary>
        public Double UpperTolerance { get; set; } = 0;


        public int EditorID { get; set; } = 0;

        public String EditorName { get; set; } = "";
        public DateTime EditTime { get; set; } = DateTime.Now;

        public int Active = 0;
    }
}
