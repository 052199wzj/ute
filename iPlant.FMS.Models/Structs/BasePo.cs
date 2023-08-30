using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    public class BasePo
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; } = 0;

        /// <summary>
        /// 录入人
        /// </summary>
        public int CreatorID { get; set; } = 0;
        [NotMapped]
        public String CreatorName { get; set; } = "";
        /// <summary>
        /// 录入时刻
        /// </summary>
        public DateTime CreateTime { get; set; } = DateTime.Now;

        /// <summary>
        /// 编辑人
        /// </summary>
        public int EditorID { get; set; } = 0;
        [NotMapped]
        public String EditorName { get; set; } = "";
        /// <summary>
        /// 编辑时刻
        /// </summary>
        public DateTime EditTime { get; set; } = DateTime.Now;


        public void SetUserInfo(BMSEmployee wUserInfo)
        {

            if (this.ID <= 0)
            {
                this.CreatorID = wUserInfo.ID;
                this.CreatorName = wUserInfo.Name;
                this.CreateTime = DateTime.Now;
            }
            this.EditorID = wUserInfo.ID;
            this.EditorName = wUserInfo.Name;
            this.EditTime = DateTime.Now;

        }
    }
}
