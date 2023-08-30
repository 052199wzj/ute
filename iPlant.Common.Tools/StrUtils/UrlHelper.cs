using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace iPlant.Common.Tools
{
    public class UrlHelper
    {
        private static UrlHelper _Instance;

        public static UrlHelper Instance
        {
            get
            {
                if (_Instance == null)
                    _Instance = new UrlHelper();
                return UrlHelper._Instance;
            }

        }
        private UrlHelper() { }

        public string MyUrlDeCode(string wPar, Encoding wEncoding)
        {
            if (wEncoding == null)
            {
                Encoding wUTF8 = Encoding.UTF8;
                //首先用utf-8进行解码                    
                string code = HttpUtility.UrlDecode(wPar.ToUpper(), wUTF8);
                //将已经解码的字符再次进行编码.
                string encode = HttpUtility.UrlEncode(code, wUTF8).ToUpper();
                if (wPar == encode)
                    wEncoding = Encoding.UTF8;
                else
                    wEncoding = Encoding.GetEncoding("gb2312");
            }
            return HttpUtility.UrlDecode(wPar, wEncoding);
        }



    }
}
