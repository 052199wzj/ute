using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.Common.Tools
{
    public class RemoteInvokeUtils
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(RemoteInvokeUtils));
        private RemoteInvokeUtils() : base()
        {
        }

        private static RemoteInvokeUtils Instance = new RemoteInvokeUtils();
        public static RemoteInvokeUtils getInstance()
        {
            if (Instance == null)
                Instance = new RemoteInvokeUtils();
            return Instance;
        }
        public string HttpInvokeString(string wUrl, Dictionary<string, object> wParms, HttpMethod wMethodType)
        {
            string wResult = string.Empty;
            try
            {
                if (wParms == null)
                    wParms = new Dictionary<string, object>();
                if (wMethodType == HttpMethod.Get)
                    //处理url 
                    foreach (var wKey in wParms.Keys)
                    {
                        if (wParms[wKey] is DateTime)
                        {
                            wUrl += string.Format("&{0}={1}", wKey, ((DateTime)wParms[wKey]).ToString("yyyy-MM-dd HH:mm:ss"));
                            continue;
                        }
                        wUrl += string.Format("&{0}={1}", wKey, wParms[wKey].ToString());
                    }
                //处理URL后面的随机参数
                Random wRandom = new Random(Guid.NewGuid().GetHashCode());
                double wValue = wRandom.NextDouble();

                int wIndex = wRandom.Next(97, 123);
                ASCIIEncoding wASCIIEncoding = new ASCIIEncoding();
                byte[] wBtNumber = new byte[] { (byte)wIndex };
                string wValueChar = wASCIIEncoding.GetString(wBtNumber);

                if (wUrl.IndexOf("?") > 1)
                {
                    wUrl += string.Format("&{0}={1}", wValueChar, wValue);
                }
                else
                {
                    wUrl += string.Format("?{0}={1}", wValueChar, wValue);
                }

                Encoding wEncoding = Encoding.UTF8;
                HttpWebRequest wRequest = (HttpWebRequest)WebRequest.Create(wUrl);//webrequest请求api地址  
                wRequest.Accept = "text/html,application/json,application/xhtml+xml,*/*";
                wRequest.ContentType = "application/json";
                wRequest.Method = wMethodType.Method.ToUpper();//get或者post  
                wRequest.Timeout = 60000; // 60s
                if (wMethodType == HttpMethod.Post)
                {
                    string wJson = JsonTool.ObjectToJson(wParms);
                    byte[] wBuffer = wEncoding.GetBytes(wJson);
                    wRequest.ContentLength = wBuffer.Length;
                    wRequest.GetRequestStream().Write(wBuffer, 0, wBuffer.Length);
                }

                HttpWebResponse wResponse = (HttpWebResponse)wRequest.GetResponse();
                using (StreamReader wReader = new StreamReader(wResponse.GetResponseStream(), Encoding.UTF8))
                    wResult = wReader.ReadToEndAsync().Result;
            }
            catch (Exception ex)
            {
                
                logger.Error(StringUtils.Format("{0} URL:{1} ",
                    System.Reflection.MethodBase.GetCurrentMethod().Name, wUrl), ex);
                
                throw new Exception("RemoteInvokeUtils HttpInvokeString error:" + ex.Message);
            }

            return wResult;
        }
        public string HttpInvokeString(string wServerUrl, string wServerName, string wApiUrl, Dictionary<string, object> wParms, HttpMethod wMethodType)
        {
            if (wServerUrl.EndsWith("/"))
                wServerUrl = wServerUrl.Substring(0, wServerUrl.Length - 1);
            if (wServerName.EndsWith("/"))
                wServerName = wServerName.Substring(0, wServerUrl.Length - 1);

            if (wServerName.StartsWith("/"))
                wServerName = wServerName.Substring(1);
            if (wApiUrl.StartsWith("/"))
                wApiUrl = wServerName.Substring(1);
            return this.HttpInvokeString(StringUtils.Format("{0}/{1}/{2}", wServerUrl, wServerName, wApiUrl), wParms, wMethodType);

        }


        public string HttpApiUpload(string wUrl, string wMethodType, string wFileName)
        {
            string wResult = string.Empty;

            try
            {
                using (WebClient myWebClient = new WebClient())
                {
                    myWebClient.Credentials = CredentialCache.DefaultCredentials;
                    byte[] wResByte = myWebClient.UploadFile(new Uri(wUrl), wMethodType, wFileName);

                    wResult = Encoding.UTF8.GetString(wResByte);
                }
            }
            catch (Exception ex)
            {
                
                logger.Error(
                   System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
                throw new Exception("RemoteInvokeUtils HttpApiUpload error:" + ex.Message);
            }

            return wResult;
        }

    }
}
