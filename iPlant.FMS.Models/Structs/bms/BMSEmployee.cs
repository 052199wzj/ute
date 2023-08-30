using System;
using System.Collections.Generic; 
using System.Runtime.Serialization;
using System.Text;

namespace iPlant.FMS.Models
{
    
   
    public class BMSEmployee
    {

        public int ID { get; set; } = 0;
       
        public String Name { get; set; } = "";

        public String LoginName { get; set; } = "";
       
        public String Password { get; set; } = "";
        
        public int DepartmentID { get; set; } = 0;
       
        public String DepartmentCode { get; set; } = "";
        
        public String Department { get; set; } = "";
        
        public int Active { get; set; } = 1;

        // 0普通用户 1 管理员账户 9开发者账户
        public int Grad { get; set; } = 0;

        public int Manager { get; set; } = 0;

        public String Operator { get; set; } = "";
        public int OperatorID { get; set; } = 0;
        
        public String Phone { get; set; } = "";
       
        public String Email { get; set; } = "";
       
        public String FaceIcon { get; set; } = "/independent/static/images/userface.png";

        public DateTime CreateDate { get; set; } = DateTime.Now;

        public int Position { get; set; } = 0;

        public String PositionName { get; set; } = "";

        public String WeiXin { get; set; } = "";

        public String PhoneMAC { get; set; } = "";

        public int Online { get; set; } = 0;

        public int Type { get; set; } = 0;

        public int OnShift { get; set; } = 0;

        /**
         * 直接上级ID   根据岗位的DutyID自动设置  规则为自动设置条件
         */
        public int SuperiorID { get; set; } = 0;

        public DateTime OnLineTime { get; set; } = DateTime.Now;

        public DateTime DepartureDate { get; set; } = DateTime.Now;

        public DateTime LastOnLineTime { get; set; } = DateTime.Now;

        public int CompanyID { get; set; } = 0;
        
        public String LoginID { get; set; } = "";

        public int DutyID { get; set; } = 0;

        public List<int> RoleIDList { get; set; } = new List<int>();
       
        public String RoleCode { get; set; } = "";
        
        public String RoleName{ get; set; } = "";


    }
}
