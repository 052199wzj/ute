using iPlant.Common.Tools;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 设备工艺说明
    /// </summary> 
    [Table("dms_fixtures")]
    public class DMSFixtures : BasePo
    {


        public int DeviceID { get; set; } = 0;

        /// <summary>
        /// 设备编码
        /// </summary>
        [NotMapped]

        public String DeviceNo { get; set; } = "";

        /// <summary>
        ///  设备名称
        /// </summary>
        [NotMapped]
        public String DeviceName { get; set; } = "";

        /// <summary>
        /// 产线ID
        /// </summary>
        [NotMapped]
        public int LineID { get; set; } = 0;

        [NotMapped]
        public String LineName { get; set; } = ""; 


        /// <summary>
        /// 产品型号ID
        /// </summary>
        public int ProductID { get; set; } = 0;

        [NotMapped]
        public String ProductNo { get; set; } = "";
        [NotMapped]
        public String ProductName { get; set; } = "";
        [NotMapped]
        public String DrawingNo { get; set; } = "";


        /// <summary>
        /// 图纸文件
        /// </summary>		
        [NotMapped]
        public String DrawingNoFile { get; set; } = "";


        [NotMapped]

        public int NCEnable { get; set; } = 0;
        [NotMapped]

        public int ToolEnable { get; set; } = 0;

        [NotMapped]

        public int FixturesEnable { get; set; } = 0;

        /// <summary>
        /// 工装编号
        /// </summary>
        public String FixturesCode { get; set; } = "";
        /// <summary>
        /// 工装说明
        /// </summary>
        public String FixturesDescription { get; set; } = "";

        /// <summary>
        /// 工装更换指导文件
        /// </summary>
        public String FixturesFile { get; set; } = "";

        /// <summary>
        /// 刀具清单列表  多个使用;隔开
        /// </summary>
        public String ToolCode { get; set; } = "";

        [NotMapped]
        public List<String> ToolCodeList
        {
            get
            {
                if (StringUtils.isEmpty(ToolCode))
                    return new List<String>();

                return StringUtils.splitList(ToolCode, ";");
            }
            set
            {
                if (value == null)
                    return;
                ToolCode = StringUtils.Join(";", value);
            }
        }
        /// <summary>
        /// 刀具更换说明
        /// </summary>
        public String ToolDescription { get; set; } = "";

        /// <summary>
        /// 刀具更换指导文件
        /// </summary>
        public String ToolFile { get; set; } = "";
        /// <summary>
        /// 程序名称  关联查询
        /// </summary>

        [NotMapped]
        public String NCCode { get; set; } = "";
        /// <summary>
        /// 程序说明 关联查询
        /// </summary>

        [NotMapped]
        public String NCDescription { get; set; } = "";

         

        /// <summary>
        /// 描述
        /// </summary>

        public String Description { get; set; } = "";


    }

}
