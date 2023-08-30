using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace iPlant.FMS.Communication
{

    public class DataSourceEntity
    {
        /// <summary>
        /// 数据源唯一ID
        /// </summary>


        public int ID { get; set; }

        /// <summary>
        /// 数据源编码
        /// </summary>
        public string Code { get; set; } = "";


        /// <summary>
        /// 服务器ID
        /// </summary>

        public int ServerId { get; set; } = 0;

        /// <summary>
        /// 数据源地址
        /// </summary>

        public string SourceAddress { get; set; } = "";

        /// <summary>
        /// 数据类型
        /// </summary>

        public int DataTypeCode { get; set; } = 0;

        /// <summary>
        /// 数据分类
        /// </summary>

        public int DataCatalog { get; set; } = 0;

        /// <summary>
        /// 数据标签    order
        /// </summary>

        public int DataIndex { get; set; } = 0;

        /// <summary>
        /// 数据名称    
        /// </summary>

        public string Name { get; set; } = "";

        /// <summary>
        ///   变量名
        /// </summary>

        public string DataName { get; set; } = "";

        /// <summary>
        /// 参数所属设备采集编号
        /// </summary>

        public string DeviceCode { get; set; } = "";

        /// <summary>
        /// 数据读写操作 0=不使用，1=ReadOnly; 2=WriteOnly; 3=ReadWrite; 4=Subscription  5 循环读取
        /// </summary>

        public int DataAction { get; set; } = 0;

        /// <summary>
        /// 数据更新时间(ms)
        /// </summary>
        public int InternalTime { get; set; } = 100;

        /// <summary>
        /// 说明   参数解释 
        /// </summary>
        public string Description { get; set; } = "";


        /// <summary>
        /// 是否反转Bool
        /// </summary>
        public bool Reversed { get; set; } = false;

        /// <summary>
        /// 合并实际顺序 
        /// </summary>
        public int ActOrder { get; set; } = 0;


        public List<String> DescriptionValue
        {
            get
            {

                if (Description == null)
                    return new List<string>();

                return Description.Split(new String[] { "_", ",", " ", ";", "/", "\\" }, StringSplitOptions.RemoveEmptyEntries).Distinct().ToList();

            }
            private set { }
        }


        public DataSourceEntity() { }

        public DataSourceEntity(DMSDeviceParameter wDeviceParameter)
        {

            this.ID = wDeviceParameter.ID;
            this.Code = wDeviceParameter.Code;
            this.ServerId = wDeviceParameter.ServerId;
            this.SourceAddress = wDeviceParameter.OPCClass;
            this.DataTypeCode = wDeviceParameter.DataType;
            this.DataCatalog = wDeviceParameter.DataClass;
            this.DataIndex = wDeviceParameter.AnalysisOrder;
            this.Name = wDeviceParameter.Name;
            this.DataName = wDeviceParameter.VariableName;
            this.DeviceCode = wDeviceParameter.AssetNo;

            this.DataAction = wDeviceParameter.DataAction;
            this.InternalTime = wDeviceParameter.InternalTime;
            this.Description = wDeviceParameter.ParameterDesc;
            this.ActOrder = wDeviceParameter.ActOrder;
            this.Reversed = wDeviceParameter.Reversed == 1;





        }
    }

}
