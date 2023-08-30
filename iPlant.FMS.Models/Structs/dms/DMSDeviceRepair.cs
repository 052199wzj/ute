using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMS.Models
{
    public class DMSDeviceRepair
    {
        public int ID { get; set; } = 0;

        public String Code { get; set; } = "";

        public int DeviceID { get; set; } = 0;

        public String DeviceNo { get; set; } = "";

        public String DeviceName { get; set; } = "";

        public int AlarmLevel { get; set; } = 0;

        public int AlarmType { get; set; } = 0;

        /// <summary>
        /// 报警编码 可以为空  即不关联报警
        /// </summary>
        public String AlarmCode { get; set; } = "";

        public String AlarmName { get; set; } = "";
          
        public String AlarmRemark { get; set; } = "";

        public List<String> AlarmImageList { get; set; } = new List<string>();

        /// <summary>
        /// 单据状态 1 报修中  单据可以删除  2 检修完成的单据不能删除 
        /// </summary>
        public int Status { get; set; } = 0;

        /// <summary>
        /// 报修人 
        /// </summary>
        public int CreatorID { get; set; } = 0;

        public String Creator { get; set; } = ""; 

        public DateTime CreateTime { get; set; } = new DateTime(2000,1,1);

        /// <summary>
        /// 维修人
        /// </summary>
        public List<int> RepairerIDList { get; set; } = new List<int>();

        public String Repairer { get; set; } = "";

        public DateTime RepairTime { get; set; } = new DateTime(2000, 1, 1);

        public String RepairRemark { get; set; } = "";


        public List<String> RepairImageList { get; set; } = new List<string>();


        public DateTime RepairStartTime { get; set; } = new DateTime(2000, 1, 1);

        public DateTime RepairEndTime { get; set; } = new DateTime(2000, 1, 1);
         
    }
}
