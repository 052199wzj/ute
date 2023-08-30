using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace iPlant.Common.Tools
{
    public static class StringExtension
    {


        public static String ParseToString(this object wObject)
        {
            if (wObject == null)
                return null;
            return wObject.ToString();
        }

        public static DateTime ParseToDate(this object wObject)
        {
            return StringUtils.parseDate(wObject);
        }

        public static T ParseToType<T>(this object wObject)
        {
            if (wObject == null || !(wObject is T))
                return default;
            return (T)wObject;
        }


        public static int ParseToInt(this Guid wGuid)
        {
            String wServerIDString = wGuid.ToString().Substring(26);
            if (int.TryParse(wServerIDString, out int wServerId))
            {
                return wServerId;
            }
            else
            {
                return 0;
            }

        }

        /// <summary>
        /// 将object转换为bool，若转换失败，则返回false。不抛出异常。  
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static bool ParseToBool(this object str, bool wReversed = false)
        {
            bool wResult = StringUtils.parseInt(str) == 1;

            return wReversed ? (!wResult) : wResult;
        }


        public static int ParseToInt(this object wObject)
        {
            return StringUtils.parseInt(wObject);
        }

        public static bool IsGuidNullOrEmpty(this Guid value)
        {
            if (value.ToString() == "")
                return true;
            if (value == Guid.Empty)
                return true;
            return false;

        }


        public static bool AddRange(this Dictionary<String, Object> wSource, Dictionary<String, Object> wValue) {

            if (wSource == null)
                return false;
            if (wValue == null || wValue.Count <= 0)
                return true;

            foreach (var item in wValue.Keys)
            {
                if (wSource.ContainsKey(item)) { 
                    wSource[item] = wValue[item];
                }
                else {
                    wSource.Add(item, wValue[item]);
                }
            }
            return true;
        }
    




        public static string ChangeToTableName(this string wDeviceCode)
        {
            Regex.CacheSize = Int32.MaxValue;

            Regex wRegex = new Regex(@"(?<Column>[^A-Za-z0-9_]+)", RegexOptions.IgnoreCase);

             
            wDeviceCode = wRegex.Replace(wDeviceCode, match =>
            { 
                return  "_".PadLeft(match.Groups["Column"].Value.Length,'_') ;
            });

            return wDeviceCode;

        }
    }
}