using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class MSSLocation
    {


        public MSSLocation()
        {
        }

        public int ID { get; set; }=0;
 
        public String Code { get; set; } = "";

        public String Name { get; set; } = "";
     
        public int Type { get; set; } = 0;
 

        public int Active { get; set; } = 0;
     
        public DateTime EditTime { get; set; } = DateTime.Now;
          
        public int EditorID { get; set; } = 0;

        public String EditorName { get; set; } = "";

        public String Description { get; set; } = "";

    }
}
