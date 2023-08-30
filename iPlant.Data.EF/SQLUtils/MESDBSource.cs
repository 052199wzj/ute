using iPlant.Common.Tools;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;

namespace iPlant.Data.EF
{
    public class MESDBSource
    {

        enum MESDBSourceEnum : int
        {
            Default = 0,
            Basic = 1,
            MDS,
            EXC,
            DMS,
            ERP,
            PLM,
            APS,
            WDW,
        }

        public static MESDBSource Default { get; } = new MESDBSource(MESDBSourceEnum.Default);

        public static MESDBSource Basic { get; } = new MESDBSource(MESDBSourceEnum.Basic);

        public static MESDBSource MDS { get; } = new MESDBSource(MESDBSourceEnum.MDS);
        public static MESDBSource EXC { get; } = new MESDBSource(MESDBSourceEnum.EXC);
        public static MESDBSource DMS { get; } = new MESDBSource(MESDBSourceEnum.DMS);
        public static MESDBSource ERP { get; } = new MESDBSource(MESDBSourceEnum.ERP);
        public static MESDBSource PLM { get; } = new MESDBSource(MESDBSourceEnum.PLM);
        public static MESDBSource APS { get; } = new MESDBSource(MESDBSourceEnum.APS);
        public static MESDBSource WDW { get; } = new MESDBSource(MESDBSourceEnum.WDW);


        private static List<MESDBSource> _values = new List<MESDBSource>();
        public static List<MESDBSource> values
        {
            get
            {
                return _values.ToArray().ToList();
            }
        }

        private MESDBSource(MESDBSourceEnum value)
        {
            this.value = (int)value;
            this.lable = value.ToString();
        }


        private readonly int value;
        private readonly String lable;

        /**
         * 通过 value 的数值获取枚举实例
         *
         * @param val
         * @return
         */
        public static MESDBSource getEnumType(int val)
        {
            foreach (MESDBSource type in MESDBSource.values)
            {
                if (type.getValue() == val)
                {
                    return type;
                }
            }
            return Default;
        }

        public String getDBName(DBEnumType wDBEnumType = DBEnumType.Default)
        {
            String wResult = DefaultDBName;

            switch ((MESDBSourceEnum)this.value)
            {
                case MESDBSourceEnum.Default:
                    wResult = DefaultDBName;
                    break;
                case MESDBSourceEnum.Basic:
                    wResult = BasicDBName;
                    break;
                case MESDBSourceEnum.MDS:
                    wResult = MDSDBName;
                    break;
                case MESDBSourceEnum.EXC:
                    wResult = EXCDBName;
                    break;
                case MESDBSourceEnum.DMS:
                    wResult = DMSDBName;
                    break;
                case MESDBSourceEnum.ERP:
                    wResult = ERPDBName;
                    break;
                case MESDBSourceEnum.PLM:
                    wResult = PLMDBName;
                    break;
                case MESDBSourceEnum.APS:
                    wResult = BasicDBName;
                    break;
                case MESDBSourceEnum.WDW:
                    wResult = BasicDBName;
                    break;
                default:
                    break;
            }
            return ChangeDataBaseName(wDBEnumType, wResult);

        }

        public int getValue()
        {
            return value;
        }

        public String getLable()
        {
            return lable;
        }



      

        private String ChangeDataBaseName(DBEnumType wDBEnumType, String wDBName)
        {
            switch (wDBEnumType)
            {
                case DBEnumType.MySQL:

                    break;
                case DBEnumType.SQLServer:
                    wDBName = wDBName + ".dbo";
                    break;
                case DBEnumType.Oracle:

                    break;
                case DBEnumType.Access:

                    break;
                default:
                    break;
            }
            return wDBName;
        }



        private static readonly String DefaultDBName =  GlobalConstant.GlobalConfiguration.GetValue("DataBase.Name.Default");

        private static readonly String BasicDBName =  GlobalConstant.GlobalConfiguration.GetValue("DataBase.Name.Basic");
        private static readonly String DMSDBName =  GlobalConstant.GlobalConfiguration.GetValue("DataBase.Name.DMS");
        private static readonly String EXCDBName =  GlobalConstant.GlobalConfiguration.GetValue("DataBase.Name.EXC");
        private static readonly String ERPDBName =  GlobalConstant.GlobalConfiguration.GetValue("DataBase.Name.ERP");
        private static readonly String MDSDBName =  GlobalConstant.GlobalConfiguration.GetValue("DataBase.Name.MDS");
        private static readonly String PLMDBName =  GlobalConstant.GlobalConfiguration.GetValue("DataBase.Name.PLM");
 
    }

}
