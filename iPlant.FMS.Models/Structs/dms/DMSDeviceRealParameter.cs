using System;
using System.Runtime.Serialization;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 设备实时参数型号
    /// </summary> 
    
    public class DMSDeviceRealParameter
    {

        public int ID { get; set; } = 0;
        public int ParameterID { get; set; } = 0;

        /// <summary>
        /// 参数代码
        /// </summary>
        
        public String ParameterCode { get; set; } = "";

        /// <summary>
        ///  参数名称   同设备 同数据分类下Name唯一  汉字
        /// </summary>
        
        public String ParameterName { get; set; } = "";

        /// <summary>
        /// 变量名称
        /// </summary>
        public String VariableName { get; set; } = "";
        /// <summary>
        /// 设备ID
        /// </summary>
        public int DeviceID { get; set; } = 0;

        /// <summary>
        /// 设备编码
        /// </summary>
        
        public String DeviceNo { get; set; } = "";

        /// <summary>
        ///  设备名称
        /// </summary>
        
        public String DeviceName { get; set; } = "";
        /// <summary> 
        /// 固定资产编码  采集编码
        /// </summary>
        
        public String AssetNo { get; set; } = "";


        /// <summary>
        /// 数据类型
        /// </summary>
        public int DataType { get; set; } = 0;
        /// <summary>
        /// 数据类型文本
        /// </summary>
        public String DataTypeText { get; set; } = "";
        /// <summary>
        /// 数据分类
        /// </summary>
        public int DataClass { get; set; } = 0;
        /// <summary>
        /// 数据分类文本
        /// </summary>
        public String DataClassText { get; set; } = "";
         
        /// <summary>
        /// 字符主键
        /// </summary>
        public String KeyChar { get; set; } = "";

        /// <summary>
        /// 字符辅键
        /// </summary>
        public String AuxiliaryChar { get; set; } = "";

        /// <summary>
        /// 上限值
        /// </summary>
        public double ValueRight { get; set; } = 0;

        /// <summary>
        /// 下限值
        /// </summary>
        public double ValueLeft { get; set; } = 0;
        /// <summary>
        /// 备注
        /// </summary>
        public String ParameterDesc { get; set; } = "";

        /// <summary>
        /// 参数值
        /// </summary>
        
        public String ParameterValue { get; set; } = "";

        /// 编辑时刻
        /// </summary>
        
        public DateTime UpdateTime { get; set; } = DateTime.Now;

        public int PositionID { get; set; } = 0;

        public String PositionName { get; set; } = "";

        public int IsChange { get; set; } = 0;


    }
}
