using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    public class MSSMaterial
    {
        public MSSMaterial()
        {
        }

        public int ID { get; set; } = 0;

        /// <summary>
        /// 物料编号
        /// </summary>
        public string MaterialNo { get; set; } = "";

        /// <summary>
        /// 物料名称
        /// </summary>
        public string MaterialName { get; set; } = "";

        /// <summary>
        /// 物料规格型号
        /// </summary>
        public string Groes { get; set; } = "";

        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; } = "";

        /// <summary>
        /// 启用状态
        /// </summary>
        public int Active { get; set; } = 0;

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; } = DateTime.Now;

        /// <summary>
        /// 创建人ID
        /// </summary>
        public int CreatorID { get; set; } = 0;

        /// <summary>
        /// 创建人名称
        /// </summary>
        public string Creator { get; set; } = "";

        /// <summary>
        /// 编辑时间
        /// </summary>
        public DateTime EditTime { get; set; } = DateTime.Now;

        /// <summary>
        /// 编辑人ID
        /// </summary>
        public int EditorID { get; set; } = 0;

        /// <summary>
        /// 编辑人名称
        /// </summary>
        public string Editor { get; set; } = "";
    }
}
