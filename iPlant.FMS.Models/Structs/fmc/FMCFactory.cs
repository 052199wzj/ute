using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class FMCFactory
    { 
        public FMCFactory()
        {
        }

        public int ID { get; set; } = 0;

        public String Name { get; set; } = "";

        public String Code { get; set; } = "";

        public DateTime CreateTime { get; set; } = DateTime.Now;

        public int CreatorID { get; set; } = 0;

        public DateTime EditTime { get; set; } = DateTime.Now;

        public int EditorID { get; set; } = 0;
         

        public int CountryID { get; set; } = 0;

        public int ProvinceID { get; set; } = 0;

        public int CityID { get; set; } = 0;

        public String Country { get; set; } = "";

        public String Province { get; set; } = "";

        public String City { get; set; } = "";

        public String Creator { get; set; } = "";
         

        public String Editor { get; set; } = "";
         
        public String Remark { get; set; } = "";

        public int Active { get; set; } = 0; // 状态
         
          
    }
}
