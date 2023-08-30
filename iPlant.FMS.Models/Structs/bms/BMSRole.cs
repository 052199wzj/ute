using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace iPlant.FMS.Models
{
    
    public class BMSRole
    { 
      
        public int ID { get; set; } = 0;
        
        public String Name { get; set; } = "";
        
        public String Code { get; set; } = "";
 
        public int DepartmentID { get; set; } = 0;
        
        public String DepartmentName { get; set; } = "";
        
        public String DepartmentCode { get; set; } = "";
        public int EditorID { get; set; } = 0;
        public String EditorName { get; set; } = "";
        
        public String Remark { get; set; } = "";

        public int EmployeeCount { get; set; } = 0;

        public List<int> EmployeeIDList { get; set; } = new List<int>();
          
        public DateTime EditTime { get; set; } = DateTime.Now;
        
        public int Active { get; set; } = 0;


    }
}
