using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{

    public class DMSProcessRecord
    {
        public int ID { get; set; } = 0;


        public int LineID { get; set; } = 0;
        public String LineName { get; set; } = "";

        public int DeviceID { get; set; } = 0;

        public String DeviceNo { get; set; } = "";

        public String DeviceName { get; set; } = "";
        /// <summary>
        /// 固定资产编码  采集编码
        /// </summary> 

        public String AssetNo { get; set; } = "";

        public int OrderID { get; set; } = 0;
        public int ModelID { get; set; } = 0;


        public String OrderNo { get; set; } = "";




        public int ProductID { get; set; } = 0;
        /// <summary>
        /// 产品编号
        /// </summary>
        public String ProductNo { get; set; } = "";
        /// <summary>
        /// 产品名称
        /// </summary>
        public String ProductName { get; set; } = "";


        public String MetroNo { get; set; } = "";


        /// <summary>
        /// 加工工序   MES传输
        /// </summary>
        public String WorkPartPointCode { get; set; } = "";

        /// <summary>
        /// 加工工序名称   MES传输
        /// </summary>
        public String WorkPartPointName { get; set; } = "";


        /// <summary>
        /// 根据工件号关联
        /// </summary>
        public String WorkpieceNo { get; set; } = "";


        public DateTime StartTime { get; set; } = new DateTime(2000, 1, 1);

        public DateTime EndTime { get; set; } = new DateTime(2000, 1, 1);

        /// <summary>
        /// 0  默认数据 未上传
        /// </summary>
        public int Active { get; set; } = 0;

        public int Status { get; set; } = 0;

        public String StatusText { get; set; } = "";

        public String Remark { get; set; } = "";

        /// <summary>
        /// 记录类型   1 加工 2检验  3抽检  4返修 
        /// </summary>
        public int RecordType { get; set; } = 1;
        /// <summary>
        /// 工艺参数表主键ID
        /// </summary>
        public int TechnologyID { get; set; } = 0;

        /// <summary>
        /// 节拍参数
        /// </summary>
        public Dictionary<String, Object> ProductParams { get; set; } = new Dictionary<string, object>();
        /// <summary>
        /// 检测机参数
        /// </summary>
        public Dictionary<String, Object> CheckParams { get; set; } = new Dictionary<string, object>();
        /// <summary>
        /// 工艺参数
        /// </summary>
        public Dictionary<String, Object> TechnologyParams { get; set; } = new Dictionary<string, object>();

        public List<DMSProcessRecordItem> ItemList { get; set; } = new List<DMSProcessRecordItem>();
    }

    public class DMSProcessRecordItem
    {
        public long ID { get; set; } = 0;

        public int RecordID { get; set; } = 0;
        public int DeviceID { get; set; } = 0;

        public String DeviceNo { get; set; } = "";

        public String AssetNo { get; set; } = "";
        public int ParameterID { get; set; } = 0;

        public int AnalysisOrder { get; set; } = 0;


        public String ParameterNo { get; set; } = "";

        public String ParameterName { get; set; } = "";

        public String ParameterDesc { get; set; } = "";

        public String ParameterValue { get; set; } = "";


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


        /// <summary>
        /// 误差
        /// </summary>
        public Double ErrorValue
        {
            get
            {
                if (DataClass == ((int)DMSDataClass.QualityParams) && (DataType == ((int)DMSDataTypes.Int) || DataType != ((int)DMSDataTypes.Float
                    ) || DataType != ((int)DMSDataTypes.Double)))
                {
                    if (double.TryParse(ParameterValue, out double wActualValue))
                    {
                        return wActualValue - TheoreticalValue;
                    }
                }
                 
                return 0;
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
                if (ErrorValue == 0)
                    return 0;

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


        public int DataType { get; set; } = 0;

        public int DataClass { get; set; } = 0;

        public DateTime SampleTime { get; set; } = new DateTime(2000, 1, 1);




    }
}
