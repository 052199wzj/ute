using System;
using System.Collections.Generic;
using System.Configuration;
using iPlant.FMS.Models;
using System.Linq;
using System.Web;
using iPlant.Common.Tools;

namespace iPlant.FMS.WEB
{
    public class Constants
    {

        public static String iPlant_resEncode_type = "UTF-8";
        public static int iPlant_timeout_seconds = 60;

        public static String IPLANT_RUN_TYPE_CLIENT = "client";
        public static String IPLANT_RUN_TYPE_WEB = "web";
        public static String IPLANT_RUN_TYPE_3TD = "3td";


        public static String UPLOAD_DOWN_URL = "/upload_down/";


        public static String UPLOAD_EXCEL_URL = "/upload/excel/";

        public static String UPLOAD_SAVE_PATH = "/upload/";

        public static String UPLOAD_BACK_DOWN_FILE_PATH = "/uploadFeedbackText/";


        public static String MENU_GROUP_ICON =  GlobalConstant.GlobalConfiguration.GetValue("Menu.Icon.Group"); 

        public static String MENU_MODULE_ICON =  GlobalConstant.GlobalConfiguration.GetValue("Menu.Icon.Module"); 
        public static String CompanyName
        {
            get
            {
                if (String.IsNullOrWhiteSpace( GlobalConstant.GlobalConfiguration.GetValue("CompanyName")))
                {
                    return "";
                }
                return  GlobalConstant.GlobalConfiguration.GetValue("CompanyName");
            }
        }
        public static String CompanyFaceUrl
        {
            get
            {
                if (String.IsNullOrWhiteSpace( GlobalConstant.GlobalConfiguration.GetValue("CompanyFaceUrl")))
                {
                    return "";
                }
                return  GlobalConstant.GlobalConfiguration.GetValue("CompanyFaceUrl");
            }
        }

        public static Dictionary<int, Dictionary<int, int>> Company_Shift_ID_All = new Dictionary<int, Dictionary<int, int>>();


        #region APP 客户端版本文件

        private static DateTime RefreshBFCAppTime = DateTime.Now;


        private static BFCClientConfig BFCClientConfig_APP;

        public static BFCClientConfig getBFCClientConfig_APP()
        {
            if (BFCClientConfig_APP == null || RefreshBFCAppTime.CompareTo(DateTime.Now) <= 0)
            {
                BFCClientConfig_APP = XMLTool.ReadXml<BFCClientConfig>(@"App_Data/Configs/APPClientConfig.xml");

                RefreshBFCAppTime = DateTime.Now.AddMinutes(3);

                if (BFCClientConfig_APP == null)
                {
                    BFCClientConfig_APP = new BFCClientConfig();
                    XMLTool.SaveXml(@"App_Data/Configs/APPClientConfig.xml", BFCClientConfig_APP);
                }
            }

            return BFCClientConfig_APP;
        }


        private static DateTime RefreshBFCClientTime = DateTime.Now;
        private static BFCClientConfig BFCClientConfig;

        public static BFCClientConfig getBFCClientConfig()
        {
            if (BFCClientConfig == null || RefreshBFCClientTime.CompareTo(DateTime.Now) <= 0)
            {
                BFCClientConfig = XMLTool.ReadXml<BFCClientConfig>(@"App_Data/Configs/ClientConfig.xml");

                RefreshBFCClientTime = DateTime.Now.AddMinutes(3);

                if (BFCClientConfig == null)
                {
                    BFCClientConfig = new BFCClientConfig();
                    XMLTool.SaveXml(@"App_Data/Configs/ClientConfig.xml", BFCClientConfig);
                }
            }

            return BFCClientConfig;
        }

        #endregion

    }


}