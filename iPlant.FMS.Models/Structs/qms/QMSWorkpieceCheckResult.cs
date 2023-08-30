using iPlant.Common.Tools;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 工件检测结果集 
    /// </summary>
    public class QMSWorkpieceCheckResult : Dictionary<String, Object>
    {
        public QMSWorkpieceCheckResult() : base() { }

        public QMSWorkpieceCheckResult(QMSWorkpiece wQMSWorkpiece, List<QMSCheckResult> wQMSCheckResultList) : base()
        {
            if (wQMSWorkpiece == null || wQMSWorkpiece.ID <= 0)
                return;
            this.ID = wQMSWorkpiece.ID;
            this.OrderID = wQMSWorkpiece.OrderID;
            this.OrderNo = wQMSWorkpiece.OrderNo;
            this.LineID = wQMSWorkpiece.LineID;
            this.LineName = wQMSWorkpiece.LineName;
            this.ProductID = wQMSWorkpiece.ProductID;
            this.ProductNo = wQMSWorkpiece.ProductNo;
            this.ProductName = wQMSWorkpiece.ProductName;
            this.WorkpieceNo = wQMSWorkpiece.WorkpieceNo;
            this.Status = wQMSWorkpiece.Status;
            this.CheckResult = wQMSWorkpiece.CheckResult;

            if (wQMSCheckResultList == null || wQMSCheckResultList.Count <= 0)
                return;

            foreach (QMSCheckResult wQMSCheckResult in wQMSCheckResultList)
            {
                this.Add(wQMSCheckResult.ParameterName, wQMSCheckResult.ParameterValue);
            }

        }


        private int _ID = 0;

        public int ID
        {
            get
            {
                return this._ID;
            }
            set
            {
                if (!base.ContainsKey("ID"))
                    base.Add("ID", value);
                else
                    base["ID"] = value;
                this._ID = value;
            }
        }


        private int _OrderID = 0;

        public int OrderID
        {
            get
            {
                return this._OrderID;
            }
            set
            {
                if (!base.ContainsKey("OrderID"))
                    base.Add("OrderID", value);
                else
                    base["OrderID"] = value;
                this._OrderID = value;
            }
        }

        private String _OrderNo { get; set; } = "";
        /// <summary>
        /// 订单号
        /// </summary>
        public String OrderNo
        {
            get
            {
                return this._OrderNo;
            }
            set
            {
                if (!base.ContainsKey("OrderNo"))
                    base.Add("OrderNo", value);
                else
                    base["OrderNo"] = value;
                this._OrderNo = value;
            }
        }

        private int _LineID = 0;


        public int LineID
        {
            get
            {
                return this._LineID;
            }
            set
            {
                if (!base.ContainsKey("LineID"))
                    base.Add("LineID", value);
                else
                    base["LineID"] = value;
                this._LineID = value;
            }
        }
        private String _LineName = "";
        /// <summary>
        /// 产线
        /// </summary>
        public String LineName
        {
            get
            {
                return this._LineName;
            }
            set
            {
                if (!base.ContainsKey("LineName"))
                    base.Add("LineName", value);
                else
                    base["LineName"] = value;
                this._LineName = value;
            }
        }

        private int _ProductID = 0;
        /// <summary>
        /// 产品型号ID
        /// </summary>
        public int ProductID
        {
            get
            {
                return this._ProductID;
            }
            set
            {
                if (!base.ContainsKey("ProductID"))
                    base.Add("ProductID", value);
                else
                    base["ProductID"] = value;
                this._ProductID = value;
            }
        }
        private String _ProductNo = "";
        /// <summary>
        /// 产品编号
        /// </summary>
        public String ProductNo
        {
            get
            {
                return this._ProductNo;
            }
            set
            {
                if (!base.ContainsKey("ProductNo"))
                    base.Add("ProductNo", value);
                else
                    base["ProductNo"] = value;
                this._ProductNo = value;
            }
        }
        private String _ProductName = "";
        /// <summary>
        /// 产品名称
        /// </summary>
        public String ProductName
        {
            get
            {
                return this._ProductName;
            }
            set
            {
                if (!base.ContainsKey("ProductName"))
                    base.Add("ProductName", value);
                else
                    base["ProductName"] = value;
                this._ProductName = value;
            }
        }
        private String _WorkpieceNo = "";
        /// <summary>
        /// 工件编码
        /// </summary>
        public String WorkpieceNo
        {
            get
            {
                return this._WorkpieceNo;
            }
            set
            {
                if (!base.ContainsKey("WorkpieceNo"))
                    base.Add("WorkpieceNo", value);
                else
                    base["WorkpieceNo"] = value;
                this._WorkpieceNo = value;
            }
        }
        private int _Status = 0;

        /// <summary>
        /// 工件状态
        /// </summary>
        public int Status
        {
            get
            {
                return this._Status;
            }
            set
            {
                if (!base.ContainsKey("Status"))
                    base.Add("Status", value);
                else
                    base["Status"] = value;

                this._Status = value;

                if (!base.ContainsKey("StatusName"))
                    base.Add("StatusName", StatusName);
                else
                    base["StatusName"] = StatusName;
            }
        }
        /// <summary>
        /// 工件状态名称
        /// </summary>
        public String StatusName
        {
            get
            {
                return EnumTool.GetEnumDesc<OMSWorkpieceStatus>(this._Status);
            }
            private set { }
        }

        private int _CheckResult = 0;
        /// <summary>
        /// 检测结果
        /// </summary>
        public int CheckResult
        {
            get
            {
                return this._CheckResult;
            }
            set
            {
                if (!base.ContainsKey("CheckResult"))
                    base.Add("CheckResult", value);
                else
                    base["CheckResult"] = value;
                this._CheckResult = value;
            }
        }


        public new void Add(String wKey, Object wValue)
        {
            if (StringUtils.isEmpty(wKey))
                return;
            var pi = this.GetType().GetProperty(wKey);
            if (pi != null)
            {
                return;
            }

            if (wValue == null)
                wValue = "";


            if (base.ContainsKey(wKey))
            {
                base[wKey] = wValue;
            }
            else
            {
                base.Add(wKey, wValue);
            }
        }

    }

    /// <summary>
    /// 工件检查结果小表
    /// </summary>
    public class QMSCheckResult
    {

        public int ID { get; set; } = 0;

        public int WorkpieceID { get; set; } = 0;

        public int DeviceID { get; set; } = 0;

        public String DeviceName { get; set; } = "";
        public String DeviceNo { get; set; } = "";

        public int ParameterID { get; set; } = 0;

        public String ParameterName { get; set; } = "";

        public String VariableName { get; set; } = "";
        public String ParameterValue { get; set; } = "";

        public String ParameterDescription { get; set; } = "";
 

        /// <summary>
        /// 数据类型
        /// </summary>
        public int DataType { get; set; } = 0;


        public QMSCheckResult() { }


        public QMSCheckResult(DMSProcessRecordItem wDMSProcessRecordItem, int wWorkpieceID)
        {

            this.WorkpieceID = wWorkpieceID;
            this.ParameterName = wDMSProcessRecordItem.ParameterName;
            this.ParameterDescription = wDMSProcessRecordItem.ParameterDesc;
            this.ParameterValue = wDMSProcessRecordItem.ParameterValue;
            this.DataType = wDMSProcessRecordItem.DataType;
            this.DeviceID = wDMSProcessRecordItem.DeviceID;
            this.DeviceNo = wDMSProcessRecordItem.DeviceNo;
            this.ParameterID = wDMSProcessRecordItem.ParameterID;
        }

    }
}
