using System;
using System.Collections.Generic;
using System.Text;

namespace ShrisCommunicationCore
{
    public class FanucServerDescription:ServerDescription
    {
         
        /// <summary>
        /// Server 的端口
        /// </summary>
        public int ServerPort { get; set; } = 8193;

          /// <summary>
          /// 超时时长
          /// </summary>
        public int TimeOutSecond { get; set; } = 10;
    }
}
