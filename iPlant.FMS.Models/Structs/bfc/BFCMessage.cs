using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public class BFCMessage
    {
        public BFCMessage()
        {
            // TODO Auto-generated constructor stub
        }

        public int CompanyID { get; set; }
        public long ID { get; set; }=0;
        /**
         * 消息来源ID 如EXC的任务ID
         */
        public long MessageID { get; set; }=0;
        /**
         * 配置模块ID BPMEventModule
         */
        public int ModuleID { get; set; }=0;

        public String ModuleName { get; set; } = "";
        /**
         * 
         */
        public long StationID { get; set; }=0;

        public String StationNo { get; set; }="";

        public int StepID { get; set; } = 0;

        /**
         * 消息接收人ID
         */
        public int ResponsorID { get; set; }=0;

        /**
         * 0 默认 不需要执行 1 需要执行
         */
        public int Type { get; set; }=0;
        public String Title { get; set; } = "";
        public String MessageText { get; set; } = "";
        public int ShiftID { get; set; } = 0;
        public DateTime EditTime { get; set; } = DateTime.Now;
        public DateTime CreateTime { get; set; } = DateTime.Now;

        /**
         * 0 未读 // 1 已发送未读 // 2 已读 （已读后不发送了） //3 已办 // 4 已关闭
         */
        public int Active { get; set; } = 0;
        public int SendStatus { get; set; } = 0;
    }
}
