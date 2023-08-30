using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.Common.Tools
{
    public class GlobalConstant
    {
        public static IConfiguration GlobalConfiguration { get; set; }

        private static Dictionary<String, String> _DBConnectionStringDic = new Dictionary<string, string>();

        public static Dictionary<String, String> DBConnectionStringDic
        {
            get
            {
                if (_DBConnectionStringDic.Count <= 0)
                {
                    GlobalConfiguration.GetDictionary("ConnectionStrings", _DBConnectionStringDic);


                }
                return _DBConnectionStringDic;
            }
        }
        public static String LogRepositoryName { get; set; } = "";

        private static int _DBSlowSqlLogTime = 2;

        public static int DBSlowSqlLogTime
        {
            get
            {
                if (_DBSlowSqlLogTime <= 0)
                {
                    _DBSlowSqlLogTime = StringUtils.parseInt(GlobalConstant.GlobalConfiguration.GetValue("DataBase.Default.LogTime"));
                }
                if (_DBSlowSqlLogTime < 2)
                {
                    _DBSlowSqlLogTime = 2;
                }
                return _DBSlowSqlLogTime;
            }
        }

        private static String _DefaultDbType = null;
        public static String DefaultDbType
        {
            get
            {
                if (String.IsNullOrWhiteSpace(_DefaultDbType))
                {
                    _DefaultDbType = GlobalConstant.GlobalConfiguration.GetValue("DataBase.Default.Type");
                }
                if (String.IsNullOrWhiteSpace(_DefaultDbType))
                {
                    _DefaultDbType = "Mysql";
                }
                return _DefaultDbType;

            }
        }
        private static int _DBCommandTimeOut = 0;
        public static int DBCommandTimeOut
        {
            get
            {
                if (_DBCommandTimeOut <= 0)
                {

                    _DBCommandTimeOut = StringUtils.parseInt(GlobalConstant.GlobalConfiguration.GetValue("DataBase.Command.Timeout"));
                }
                if (_DBCommandTimeOut < 3)
                {
                    _DBCommandTimeOut = 3;
                }

                return _DBCommandTimeOut;
            }
        }



    }

    public static class ConfigurationExtensions
    {

        public static String GetValue(this IConfiguration wConfiguration, String wKey, String wDefaultValue = "")
        {
            if (String.IsNullOrWhiteSpace(wKey))
                return wDefaultValue;
            wKey = wKey.Replace(" ", "");
            wKey = wKey.Replace(".", ":");
            String wResult = wConfiguration.GetValue<String>(wKey);
            if (wResult == null)
                wResult = wDefaultValue;

            return wResult;
        }


        public static IConfiguration GetDictionary(this IConfiguration wConfiguration, String wKey, Dictionary<String, String> wResult)
        {

            if (String.IsNullOrWhiteSpace(wKey))
                return wConfiguration;
            wKey = wKey.Replace(" ", "");
            wKey = wKey.Replace(".", ":");


            IConfigurationSection wIConfigurationSection = wConfiguration.GetSection(wKey);
            if (wIConfigurationSection == null || !wIConfigurationSection.Exists())
                return wConfiguration;

            foreach (var item in wIConfigurationSection.GetChildren())
            {
                if (item == null || !item.Exists())
                    continue;

                wResult.Add(item.Key, item.Value);
            }

            return wConfiguration;
        }


    }
}
