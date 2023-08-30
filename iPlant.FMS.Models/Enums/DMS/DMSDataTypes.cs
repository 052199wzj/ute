using iPlant.Common.Tools;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace iPlant.FMS.Models
{
    public enum DMSDataTypes : int
    {
        [Description("Default")]
        Default = 0,
        [Description("Bool")]
        Bool = 1,
        [Description("Int")]
        Int = 2,
        [Description("String")]
        String = 3,
        [Description("Float")]
        Float = 4,
        [Description("Double")]
        Double = 5,
        [Description("Int32")]
        Int32 = 6,
        [Description("DateTime")]
        DateTime = 7,
        [Description("BoolArray")]
       BoolArray = 8,
        [Description("Byte")]
       Byte = 9,
        [Description("Date")]
       Date = 10,
        [Description("Time")]
       Time = 11
    }
    public static class DMSDataTypesExtension
    {

        public static String GetMysqlTypeString(this object wType, int wLength)
        {

            return StringUtils.parseInt(wType).GetMysqlTypeString(wLength);
        }

        public static String GetMysqlTypeString(this DMSDataTypes wDMSDataTypes, int wLength = 0)
        {
            String wDBString = "varchar(20)";
            if (wLength <= 0)
                wLength = 20;
            switch (wDMSDataTypes)
            {
                case DMSDataTypes.Default:
                    break;
                case DMSDataTypes.Bool:
                    wDBString = "tinyint(1)";
                    break;
                case DMSDataTypes.Int:
                    wDBString = "int";
                    break;
                case DMSDataTypes.String:
                    wDBString = StringUtils.Format("varchar({0})", wLength);
                    break;
                case DMSDataTypes.Float:
                    wDBString = "float";
                    break;
                case DMSDataTypes.Double:
                    wDBString = "double";
                    break;
                case DMSDataTypes.Int32:
                    wDBString = "int";
                    break;
                case DMSDataTypes.DateTime:
                    wDBString = "datetime(3)";
                    break;
                case DMSDataTypes.BoolArray:
                    wDBString = "int";
                    break;
                case DMSDataTypes.Byte:
                    wDBString = "int";
                    break;
                case DMSDataTypes.Date:
                    wDBString = "Date";
                    break;
                case DMSDataTypes.Time:
                    wDBString = "Time(3)";
                    break;
                default:
                    break;
            }
            return wDBString;
        }
        public static String GetMysqlTypeString(this int wType, int wLength)
        {
            DMSDataTypes wDMSDataTypes = DMSDataTypes.Default;
            Enum.TryParse(wType + "", out wDMSDataTypes);

            return wDMSDataTypes.GetMysqlTypeString(wLength);
        }



        public static String GetMysqlDefaultString(this object wType)
        {

            return StringUtils.parseInt(wType).GetMysqlDefaultString();
        }

        public static String GetMysqlDefaultString(this DMSDataTypes wDMSDataTypes)
        {
            String wDefaultString = "''";
          
            switch (wDMSDataTypes)
            {
                case DMSDataTypes.Default:
                    break;
                case DMSDataTypes.Bool: 
                case DMSDataTypes.Int:
                case DMSDataTypes.Float:
                case DMSDataTypes.Double:
                case DMSDataTypes.Int32:
                case DMSDataTypes.BoolArray:
                case DMSDataTypes.Byte:
                    wDefaultString = "'0'";
                    break;
                case DMSDataTypes.String: 
                    break;
                case DMSDataTypes.DateTime:
                    wDefaultString = " CURRENT_TIMESTAMP(3) ";
                    break; 
                case DMSDataTypes.Date:
                    wDefaultString = "'2000-01-01'";
                    break;
                case DMSDataTypes.Time:
                    wDefaultString = "'00:00:00.000'";
                    break;
                default:
                    break;
            }
            return wDefaultString;
        }
        public static String GetMysqlDefaultString(this int wType)
        {
            DMSDataTypes wDMSDataTypes = DMSDataTypes.Default;
            Enum.TryParse(wType + "", out wDMSDataTypes);

            return wDMSDataTypes.GetMysqlDefaultString();
        }


        public static String GetMysqlTablePrefixString(this int wDataClass)
        {

            DMSDataClass wDMSDataClass = DMSDataClass.Default;
            Enum.TryParse(wDataClass + "", out wDMSDataClass);

            return wDMSDataClass.GetMysqlTablePrefixString();

        }

        public static String GetMysqlTablePrefixString(this DMSDataClass wDataClass)
        {
            String wString = "dms_device_";
            switch (wDataClass)
            {
                case DMSDataClass.Default:
                    wString += "default";
                    break;
                case DMSDataClass.Status:
                    wString += "status";
                    break;
                case DMSDataClass.Alarm:
                    wString += "alarm";
                    break;
                case DMSDataClass.Params:
                    wString += "params";
                    break;
                case DMSDataClass.WorkParams:
                    wString += "workparams";
                    break;
                case DMSDataClass.PowerParams:
                    wString += "powerparams";
                    break;
                case DMSDataClass.QualityParams:
                    wString += "qualityparams";
                    break;
                case DMSDataClass.ControlData:
                    wString += "controldata";
                    break;
                case DMSDataClass.TechnologyData:
                    wString += "technology";
                    break;
                case DMSDataClass.PositionData:
                    wString += "position";
                    break;
                default:
                    wString += "default";
                    break;
            }
            //dms_device_workparams_xx  dms_device_qualityparams_xx  dms_device_technology_xx
            return wString;

        }
    }
}
