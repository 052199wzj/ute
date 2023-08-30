using iPlant.Common.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// NC程序
    /// </summary> 

    public class DMSProgramNC
    {
        public int ID { get; set; } = 0;


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
        /// 采集编号  
        /// </summary> 
        public String AssetNo { get; set; } = "";

        /// <summary>
        /// 设备型号ID
        /// </summary>
        public int ModelID { get; set; } = 0;
        /// <summary>
        /// 设备型号名称
        /// </summary>

        public String ModelName { get; set; } = "";
        /// <summary>
        /// 设备型号ID
        /// </summary>

        public String ModelNo { get; set; } = "";

        /// <summary>
        /// 设备类型编码
        /// </summary>
        public int DeviceType { get; set; } = 0;

        /// <summary>
        /// 设备类型名称
        /// </summary>

        public String DeviceTypeName { get; set; } = "";
        /// <summary>
        /// 设备类型编码
        /// </summary>



        public int FactoryID { get; set; } = 0;

        public String FactoryName { get; set; } = "";
        public String FactoryCode { get; set; } = "";

        /// <summary>
        /// 车间ID
        /// </summary>
        public int WorkShopID { get; set; } = 0;

        public String WorkShopName { get; set; } = "";
        public String WorkShopCode { get; set; } = "";
        /// <summary>
        /// 产线ID
        /// </summary>
        public int LineID { get; set; } = 0;

        public String LineName { get; set; } = "";
        public String LineCode { get; set; } = "";

        public int AreaID { get; set; } = 0;

        public String AreaNo { get; set; } = "";
        /// <summary>
        /// 位置信息
        /// </summary>
        public String PositionText { get; set; } = "";

        public int ProductID { get; set; } = 0;

        public String ProductNo { get; set; } = "";

        public String ProductName { get; set; } = "";

        /// <summary>
        /// 文件名  固定值   不可更改
        /// </summary>
        public String ProgramName { get; set; } = "";

        public String FilePath { get; set; } = "";
         

        /// <summary>
        /// 共享文件路径   固定值 不可改 本地存储路径
        /// </summary>
        public String DeviceFilePath
        {
            get
            {
                String suffString = "";
                //文件后缀名设置  
                if (StringUtils.isNotEmpty(FileSourcePath) && FileSourcePath.LastIndexOf(".") > 0)
                {
                    suffString = FileSourcePath.Substring(FileSourcePath.LastIndexOf("."));
                }
                return String.Format("{0}/{1}/{2}{3}", GlobalConstant.GlobalConfiguration.GetValue("Device.ProgramNC.FilePath"), AssetNo, ProgramName, suffString);
            }
            set { }

        }


        /// <summary>
        /// 设备文件路径  无法访问 但必填
        /// </summary>
        public String FileSourcePath { get; set; } = "";


        /// <summary>
        /// 文件名  固定值   不可更改
        /// </summary>
        public String ProgramName_B { get; set; } = "";



        public String FilePath_B { get; set; } = "";


        /// <summary>
        /// 共享文件路径   固定值 不可改 本地存储路径
        /// </summary>
        public String DeviceFilePath_B
        {
            get
            {
                String suffString = "";
                //文件后缀名设置  
                if (StringUtils.isNotEmpty(FileSourcePath_B) && FileSourcePath_B.LastIndexOf(".") > 0)
                {
                    suffString = FileSourcePath_B.Substring(FileSourcePath_B.LastIndexOf("."));
                }
                return String.Format("{0}/{1}/{2}{3}", GlobalConstant.GlobalConfiguration.GetValue("Device.ProgramNC.FilePath"), AssetNo, ProgramName_B, suffString);
            }
            set { }

        }


        /// <summary>
        /// 设备文件路径  无法访问 但必填
        /// </summary>
        public String FileSourcePath_B { get; set; } = "";



        public String VersionNo { get; set; } = "";

        /// <summary>
        /// 描述
        /// </summary>

        public String Description { get; set; } = "";

        /// <summary>
        /// 编辑人
        /// </summary>
        public int EditorID { get; set; } = 0;

        public String EditorName { get; set; } = "";
        /// <summary>
        /// 编辑时刻
        /// </summary>
        public DateTime EditTime { get; set; } = DateTime.Now;


    }


    /// <summary>
    /// NC程序操作记录
    /// </summary> 

    public class DMSProgramNCRecord
    {
        public int ID { get; set; } = 0;


        public int ProgramID { get; set; } = 0;

        public int DeviceID { get; set; } = 0;

        /// <summary>
        /// 设备编码
        /// </summary>

        public String DeviceNo { get; set; } = "";

        /// <summary>
        /// 采集编号  必填
        /// </summary>
        public String AssetNo { get; set; } = "";

        /// <summary>
        ///  设备名称
        /// </summary>

        public String DeviceName { get; set; } = "";


        public int FactoryID { get; set; } = 0;

        public String FactoryName { get; set; } = "";
        public String FactoryCode { get; set; } = "";

        /// <summary>
        /// 车间ID
        /// </summary>
        public int WorkShopID { get; set; } = 0;

        public String WorkShopName { get; set; } = "";
        public String WorkShopCode { get; set; } = "";
        /// <summary>
        /// 产线ID
        /// </summary>
        public int LineID { get; set; } = 0;

        public String LineName { get; set; } = "";
        public String LineCode { get; set; } = "";

        public int AreaID { get; set; } = 0;

        public String AreaNo { get; set; } = "";
        /// <summary>
        /// 位置信息
        /// </summary>
        public String PositionText { get; set; } = "";

        public int ProductID { get; set; } = 0;

        public String ProductNo { get; set; } = "";

        public String ProductName { get; set; } = "";

        /// <summary>
        /// 程序名
        /// </summary>
        public String ProgramName { get; set; } = "";

        /// <summary>
        /// 上传 下载的文件路径  上传的文件为默认的上传接口 确定提交后将文件复制到指定文件中
        /// </summary>
        public String FilePath { get; set; } = "";

        /// <summary>
        ///共享文件路径   固定值 不可改 本地存储路径
        /// </summary>
        public String DeviceFilePath
        {
            get
            {
                String suffString = "";
                //文件后缀名设置  
                if (StringUtils.isNotEmpty(FileSourcePath) && FileSourcePath.LastIndexOf(".") > 0)
                {
                    suffString = FileSourcePath.Substring(FileSourcePath.LastIndexOf("."));
                }
                return String.Format("{0}/{1}/{2}{3}", GlobalConstant.GlobalConfiguration.GetValue("Device.ProgramNC.FilePath"), AssetNo, ProgramName, suffString);
            }
            set { }
        }


        /// <summary>
        /// 服务器文件路径  无法访问 但必填
        /// </summary>
        public String FileSourcePath { get; set; } = "";





        /// <summary>
        /// 文件名  固定值   不可更改
        /// </summary>
        public String ProgramName_B { get; set; } = "";



        public String FilePath_B { get; set; } = "";


        /// <summary>
        /// 共享文件路径   固定值 不可改 本地存储路径
        /// </summary>
        public String DeviceFilePath_B
        {
            get
            {
                String suffString = "";
                //文件后缀名设置  
                if (StringUtils.isNotEmpty(FileSourcePath_B) && FileSourcePath_B.LastIndexOf(".") > 0)
                {
                    suffString = FileSourcePath_B.Substring(FileSourcePath_B.LastIndexOf("."));
                }
                return String.Format("{0}/{1}/{2}{3}", GlobalConstant.GlobalConfiguration.GetValue("Device.ProgramNC.FilePath"), AssetNo, ProgramName_B, suffString);
            }
            set { }

        }


        /// <summary>
        /// 设备文件路径  无法访问 但必填
        /// </summary>
        public String FileSourcePath_B { get; set; } = "";


        public String VersionNo { get; set; } = "";

        /// <summary>
        /// 操作类型
        /// </summary>
        public int RecordType { get; set; } = 0;

        /// <summary>
        /// 操作类型释义
        /// </summary>
        public String RecordTypeText { get; set; } = "";

        /// <summary>
        /// 备注
        /// </summary>

        public String Remark { get; set; } = "";

        /// <summary>
        /// 编辑人
        /// </summary>
        public int EditorID { get; set; } = 0;

        public String EditorName { get; set; } = "";
        /// <summary>
        /// 编辑时刻
        /// </summary>
        public DateTime EditTime { get; set; } = DateTime.Now;


        public DMSProgramNC CreateSourceProgram()
        {
            DMSProgramNC wResult = new DMSProgramNC();
            wResult.ID = this.ProgramID;
            wResult.DeviceID = this.DeviceID;
            wResult.DeviceNo = this.DeviceNo;
            wResult.AssetNo= this.AssetNo;

            wResult.DeviceName = this.DeviceName;
            wResult.FactoryID = this.FactoryID;

            wResult.FactoryName = this.FactoryName;
            wResult.FactoryCode = this.FactoryCode;

            wResult.WorkShopID = this.WorkShopID;
            wResult.WorkShopName = this.WorkShopName;
            wResult.WorkShopCode = this.WorkShopCode;

            wResult.LineID = this.LineID;
            wResult.LineName = this.LineName;
            wResult.LineCode = this.LineCode;

            wResult.AreaID = this.AreaID;
            wResult.AreaNo = this.AreaNo;
            wResult.PositionText = this.PositionText;
            wResult.ProductID = this.ProductID;
            wResult.ProductNo = this.ProductNo;
            wResult.ProductName = this.ProductName;


            wResult.ProgramName = this.ProgramName;
            wResult.FilePath = this.FilePath;
            wResult.FileSourcePath = this.FileSourcePath;


            wResult.ProgramName_B = this.ProgramName_B;
            wResult.FilePath_B = this.FilePath_B;
            wResult.FileSourcePath_B = this.FileSourcePath_B;

            wResult.VersionNo = this.VersionNo;
            wResult.Description = this.Remark;

            wResult.EditorID = this.EditorID;
            wResult.EditorName = this.EditorName;
            wResult.EditTime = DateTime.Now;

            return wResult;
        }
    }
}
