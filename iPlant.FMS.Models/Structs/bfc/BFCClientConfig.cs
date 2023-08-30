using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class BFCClientConfig
    {
        public BFCClientConfig()
        {
            // TODO Auto-generated constructor stub
        }
        public Boolean IsUpdate { get; set; } = false;

        public  String VersionID { get; set; } = "";

        public String Url { get; set; } = "";

        public String Description { get; set; }="";
         
    }
}
