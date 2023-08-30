using System;
using System.Collections.Generic;
using System.Text;

namespace iPlant.FMS.Models
{
    public class BMSRoleItem
    {

        public int UserID { get; set; } = 0;

        public int RoleID { get; set; } = 0;

        public int FunctionID { get; set; } = 0;

        public String Text { get; set; } = "";

        public String Path { get; set; } = "";

        public int TypeID { get; set; } = 0;

        public String Remark { get; set; } = "";


    }
}
