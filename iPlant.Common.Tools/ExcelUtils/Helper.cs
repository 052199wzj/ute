using System;
using System.Collections.Generic;
using System.Reflection;
using NPOI.HSSF.Util;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

namespace iPlant.Common.Tools
{
    class Helper
    {
        public string ExchangeDataToExcel(object wValue)
        {
            string wValueString = "";
            if (wValue == null)
                return wValueString;


            if (wValue is Array)
            {
                return string.Join(";", wValue);
            }
            if (wValue.GetType().Name.Contains("Dictionary"))
            {
                return JsonTool.ObjectToJson(wValue);
            }



            switch (wValue.GetType().Name)
            {
                case "Single":
                    wValueString = ((float)wValue).ToString("F2");
                    break;
                case "Double":
                    wValueString = ((double)wValue).ToString("F2");
                    break;
                case "DateTime":
                    wValueString = ((DateTime)wValue).ToString("yyyy-MM-dd hh:mm:ss");
                    break;
                default:
                    wValueString = wValue.ToString();
                    break;
            }
            return wValueString;
        }
        public Object ExchangeDataToData<T>(PropertyInfo wPropertyInfo, string wValue)
        {
            Object wObjectValue = new object();
            //List<PropertyInfo> wPropertyInfolist = new List<PropertyInfo>(typeof(T).GetProperties());

            //PropertyInfo wPropertyInfo = wPropertyInfolist.Find(p => p.Name == wFieldName);
            if (wPropertyInfo == null)
                return wValue;
            string wType = wPropertyInfo.PropertyType.Name;
            switch (wType)
            {
                case "Int32":
                    wObjectValue = Int32.Parse(wValue);
                    break;
                case "Boolean":
                    wObjectValue = Boolean.Parse(wValue);
                    break;
                case "Single":
                    wObjectValue = Single.Parse(wValue);
                    break;
                case "Double":
                    wObjectValue = Double.Parse(wValue);
                    break;
                case "DateTime":
                    wObjectValue = Convert.ToDateTime(wValue);
                    break;
                case "Byte":
                    wObjectValue = Byte.Parse(wValue);
                    break;
                default:
                    wObjectValue = wValue;
                    break;
            }

            return wObjectValue;
        }


    }


    public static class ExcelExtension
    {



       
        
    }
}