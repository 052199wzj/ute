using System;
using System.Collections.Generic;
using System.Text;

namespace ShrisCommunicationCore
{
    public class ServerDescription
    {
        public Guid ServerId { get; set; }



        /// <summary>
        /// Server 的地址
        /// </summary>
        public string ServerUrl { get; set; }

        /// <summary>
        /// 服务器类型
        /// </summary>
        public int ServerType { get; set; } = 0;


        /// <summary>
        /// 服务器名称
        /// </summary>
        public String ServerName { get; set; } = ""; 
    }
}
