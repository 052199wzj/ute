using System;
using System.Collections.Generic;
using System.Text;

namespace ShrisCommunicationCore
{

    public class BaseMonitoredItem {
        public event BaseMonitoredItemNotificationEventHandler m_Notification;
        protected object m_cache = new object();
        public String ID { get; set; } = "";
        /// <summary>
        /// 数据源地址
        /// </summary>

        public string SourceAddress { get; set; } = "";

        public int DataTypeCode { get; set; } = 3;


        /// <summary>
        /// 数据分类
        /// </summary>

        public int DataCatalog { get; set; } = 0;

        public bool IsChange { get; protected set; } = true;

        public Object RealValue { get; protected set; }

        public void ChangeData(Object wValue)
        {
            m_Notification(this, new BaseMonitoredEventArgs(wValue));
        }
        public void ChangeData(int wValue)
        {
            m_Notification(this, new BaseMonitoredEventArgs(wValue));
        }

        public void RealValueSet(Object value)
        {
            IsChange = false;
            if (value == null)
            {
                if (RealValue == null)
                    return;
                RealValue = value;
                IsChange = true;
            }

            if (RealValue == null || !value.ToString().Equals(RealValue.ToString()))
            {
                RealValue = value;
                IsChange = true;
            }

            if (IsChange)
            {
                m_Notification(this, new BaseMonitoredEventArgs(RealValue));
            }
        }


         

        public BaseMonitoredItem(String wID, String wSourceAddress, int wDataType, int wDataCatalog, BaseMonitoredItemNotificationEventHandler wEventHandler)
        {
            this.ID = wID;
            this.SourceAddress = wSourceAddress;
            this.DataCatalog = wDataCatalog;
            this.DataTypeCode = wDataType;
            this.Notification += wEventHandler;
        }

        public event BaseMonitoredItemNotificationEventHandler Notification
        {
            add
            {
                lock (m_cache)
                {
                    m_Notification += value;
                }
            }

            remove
            {
                lock (m_cache)
                {
                    m_Notification -= value;
                }
            }
        }

      
    }



    public class BaseMonitoredItemNotification
    {
        public bool IsGeneral { get; protected set; } = false;
        public Object RealValue { get; protected set; }
      
        public BaseMonitoredItemNotification(Object wValue)
        {
            IsGeneral = true;
            RealValue = wValue;
        }
      

    }
   


    public delegate void BaseMonitoredItemNotificationEventHandler(BaseMonitoredItem monitoredItem, BaseMonitoredEventArgs e);
    public class BaseMonitoredEventArgs : EventArgs {

        public BaseMonitoredItemNotification Notification { get; protected set; }

        public BaseMonitoredEventArgs(Object wValue) {
            Notification= new BaseMonitoredItemNotification(wValue);
        }

    }


}
