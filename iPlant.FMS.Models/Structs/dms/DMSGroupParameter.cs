using iPlant.Common.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 设备型号
    /// </summary> 
    public class DMSGroupParameter : DMSParameter
    {


        /// <summary>
        /// 设备组编码
        /// </summary>
        public String DeviceGroupCode { get; set; } = "";


        public DMSGroupParameter() : base()
        {
        }

        public DMSDeviceParameter CreateDeviceParameter(int wDeviceID, String wAssetNo)
        {

            DMSDeviceParameter wDMSDeviceParameter = new DMSDeviceParameter();


            wDMSDeviceParameter.Name = this.Name;
            wDMSDeviceParameter.VariableName = this.VariableName; 
            wDMSDeviceParameter.ServerId = this.ServerId;
            wDMSDeviceParameter.ServerName = this.ServerName;
            wDMSDeviceParameter.Protocol = this.Protocol;
            wDMSDeviceParameter.OPCClass = this.OPCClass;
            wDMSDeviceParameter.DataType = this.DataType;
            wDMSDeviceParameter.DataAction = this.DataAction;
            wDMSDeviceParameter.DataClass = this.DataClass;
            wDMSDeviceParameter.DataLength = this.DataLength;
            wDMSDeviceParameter.InternalTime = this.InternalTime;
            wDMSDeviceParameter.KeyChar = this.KeyChar;
            wDMSDeviceParameter.AuxiliaryChar = this.AuxiliaryChar;
            wDMSDeviceParameter.ParameterDesc = this.ParameterDesc;
            wDMSDeviceParameter.ValueLeft = this.ValueLeft;
            wDMSDeviceParameter.ValueRight = this.ValueRight;
            wDMSDeviceParameter.Active = this.Active;
            wDMSDeviceParameter.AnalysisOrder = this.AnalysisOrder;
            wDMSDeviceParameter.PositionID = this.PositionID;
            wDMSDeviceParameter.DeviceID = wDeviceID;
            wDMSDeviceParameter.AssetNo = wAssetNo;
            wDMSDeviceParameter.ID = 0;
            wDMSDeviceParameter.Code = wAssetNo + this.Code.Substring(this.DeviceGroupCode.Length + 1);
            return wDMSDeviceParameter;
        }

       
    }
}
