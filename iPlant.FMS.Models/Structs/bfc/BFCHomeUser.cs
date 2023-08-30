using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class BFCHomeUser
    {
        public BFCHomeUser()
        {
            // TODO Auto-generated constructor stub
        }
        public String Name { get; set; } = "Shris";
        public int Grad { get; set; } = 0;
        public String CompanyName { get; set; } = "Shris.Mes";
        public String Faces { get; set; } = "/independent/static/images/userface.png";
        public String CompanyFaces { get; set; } = "/independent/static/images/shris.jpg";
        public String LoginName { get; set; } = "";
        public String LoginID { get; set; } = "";

        public int UserID { get; set; } = 0;

        public List<BMSRoleItem> RoleList { get; set; } = new List<BMSRoleItem>();
    }
}
