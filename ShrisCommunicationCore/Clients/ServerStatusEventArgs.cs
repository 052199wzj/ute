using System;
using System.Collections.Generic;
using System.Text;

namespace ShrisCommunicationCore
{
    public class ServerStatusEventArgs : EventArgs
    {
        public ServerStatusEventArgs(bool isConnected, DateTime time, string status, params object[] args)
        {
            IsConnected = isConnected;
            Text = string.Format(status, args);
            Time = time.ToLocalTime();
        }

        /// <summary>
        /// 是否异常
        /// </summary>
        public bool IsConnected { get; set; }
        /// <summary>
        /// 时间
        /// </summary>
        public DateTime Time { get; set; }
        /// <summary>
        /// 文本
        /// </summary>
        public string Text { get; set; }

        /// <summary>
        /// 转化为字符串
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            return IsConnected ? "[连接]" : "[断开]" + Time.ToString("  yyyy-MM-dd HH:mm:ss  ") + Text;
        }
    }


    public class SubscriptionParam
    {

        public string subscriptionKey { get; set; }

        public int publishInterval { get; set; } = 0;

        public int sample { get; set; } = 0;

        public List<string> tags { get; set; } = null;

        public List<string> itemName { get; set; } = null;

        public List<int> catalogs { get; set; } = null;


        public List<int> dataTypes { get; set; } = null;

        public SubscriptionParam(string _subscriptionKey, int _publishInterval, int _sample, List<string> _tags,
            List<string> _itemName, List<int> _dataTypes, List<int> _catalogs)
        {

            subscriptionKey = _subscriptionKey;
            publishInterval = _publishInterval;
            sample = 500;
            tags = _tags;
            itemName = _itemName;
            catalogs = _catalogs;
            dataTypes = _dataTypes;

        }
    }
}
