using iPlant.Common.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    /// <summary>
    /// 设备采集服务器
    /// </summary> 
    public class DMSDeviceServer
    {
        /// <summary>
        /// 服务器唯一ID
        /// </summary> 
        public int ID { get; set; } = 0;


        /// <summary>
        /// OPC 服务器名称
        /// </summary>

        public string ServerName { get; set; }

        /// <summary>
        /// 服务器类型   
        /// </summary>
        public int ServerType { get; set; } = 1;

        /// <summary>
        /// Opc Client 客户端名称，如果采用配置，会被Configuration 里的客户端名称覆盖
        /// </summary>

        public string ClientName { get; set; } = "MyClient";

        /// <summary>
        /// OpcServer 的地址
        /// </summary>

        public string ServerUrl { get; set; }

        /// <summary>
        /// 是否使用配置文件初始化链接
        /// </summary>

        public bool Configured { get; set; } = false;

        /// <summary>
        /// ConfigurationSectionName 是文件名还是绝对文件路径
        /// </summary>

        public bool IsFilePath { get; set; } = false;


        /// <summary>
        /// 配置文件的名称，例如"Opc.Ua.SampleClient"
        /// </summary>

        public string ConfigurationSectionName { get; set; } = "Opc.Ua.SampleClient";

        /// <summary>
        /// 是否匿名连接
        /// </summary>

        public bool IsAnonymous { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>

        public string UserName { get; set; }

        /// <summary>
        /// 密码
        /// </summary>

        public string Password { get; set; }

        /// <summary>
        /// 数据安全策略 
        /// 0= select best endpointUrl
        /// 1="http://opcfoundation.org/UA/SecurityPolicy#None"
        /// 2="http://opcfoundation.org/UA/SecurityPolicy#Basic128Rsa15"
        /// 3="http://opcfoundation.org/UA/SecurityPolicy#Basic256"
        /// 4="http://opcfoundation.org/UA/SecurityPolicy#Basic256Sha256"
        /// </summary> 

        public int SecerityPolic { get; set; }

        /// <summary>
        /// 忽略服务器 server nonce 验证，828D 无法连接时，建议置 TRUE
        /// </summary>

        public bool IgnoreVaildServerNonce { get; set; }


        public int Active { get; set; } = 0;
    }
}
