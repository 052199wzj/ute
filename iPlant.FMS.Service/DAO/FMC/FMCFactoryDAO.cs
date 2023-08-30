using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class FMCFactoryDAO : BaseDAO
    {

        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FMCFactoryDAO));
        private static FMCFactoryDAO Instance = null;

        private FMCFactoryDAO() : base()
        {

        }

        public static FMCFactoryDAO getInstance()
        {
            if (Instance == null)
                Instance = new FMCFactoryDAO();
            return Instance;
        }

        // 工厂&事业部&车间&产线&工位
        // 工厂
        private FMCFactory FMC_CheckFactoryByCode(BMSEmployee wLoginUser, FMCFactory wFactory,
                OutResult<Int32> wErrorCode)
        {
            FMCFactory wFactoryDB = new FMCFactory();
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = StringUtils.Format("Select * from {0}.fmc_factory ", wInstance)
                                + " where ID!=@ID and (Code=@Code or Name = @Name )";
                    wParms.Clear();
                    wParms.Add("ID", wFactory.ID);
                    wParms.Add("Code", wFactory.Code);
                    wParms.Add("Name", wFactory.Name);

                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        wFactoryDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wFactoryDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wFactoryDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);
                        wFactoryDB.CountryID = StringUtils.parseInt(wSqlDataReader["CountryID"]);
                        wFactoryDB.ProvinceID = StringUtils.parseInt(wSqlDataReader["ProvinceID"]);
                        wFactoryDB.CityID = StringUtils.parseInt(wSqlDataReader["CityID"]);

                        wFactoryDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wFactoryDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wFactoryDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wFactoryDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                    }

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_CheckFactoryByCode", ex);

            }
            return wFactoryDB;
        }

        public void FMC_AddFactory(BMSEmployee wLoginUser, FMCFactory wFactory,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    FMCFactory wFactoryDB = this.FMC_CheckFactoryByCode(wLoginUser, wFactory, wErrorCode);
                    if (wFactoryDB.ID > 0)
                        wErrorCode.set(MESException.Logic.Value);
                }
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("Insert Into {0}.fmc_factory", wInstance)
                            + "(Name,Code,CreatorID,EditorID,CreateTime,EditTime,Active,CountryID,ProvinceID,CityID,Remark) "
                            + " Values(@Name,@Code,@CreatorID,@EditorID,@CreateTime,@EditTime,@Active,@CountryID,@ProvinceID,@CityID,@Remark);";
                    wParms.Clear();

                    wParms.Add("Name", wFactory.Name);
                    wParms.Add("Code", wFactory.Code);
                    wParms.Add("CreatorID", wLoginUser.ID);
                    wParms.Add("EditorID", wLoginUser.ID);

                    wParms.Add("CreateTime", DateTime.Now);
                    wParms.Add("EditTime", DateTime.Now);
                    wParms.Add("CountryID", wFactory.CountryID);
                    wParms.Add("ProvinceID", wFactory.ProvinceID);

                    wParms.Add("Remark", wFactory.Remark);
                    wParms.Add("CityID", wFactory.CityID);
                    wParms.Add("Active", wFactory.Active);
                    wSQLText = this.DMLChange(wSQLText);
                    wFactory.ID = (int)mDBPool.insert(wSQLText, wParms);

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_AddFactory", ex);
            }
        }

        public void FMC_SaveFactory(BMSEmployee wLoginUser, FMCFactory wFactory,
                OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    FMCFactory wFactoryDB = this.FMC_CheckFactoryByCode(wLoginUser, wFactory, wErrorCode);
                    if (wFactoryDB.ID > 0)
                        wErrorCode.set(MESException.Logic.Value);
                }
                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("update {0}.fmc_factory", wInstance)
                            + " set Name=@Name,Code=@Code,EditorID=@EditorID,Remark=@Remark,"
                            + "EditTime=@EditTime,CountryID=@CountryID,ProvinceID=@ProvinceID,CityID=@CityID where ID=@ID ";
                    wParms.Clear();

                    wParms.Add("ID", wFactory.ID);

                    wParms.Add("Name", wFactory.Name);
                    wParms.Add("Code", wFactory.Code);
                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wParms.Add("Remark", wFactory.Remark);

                    wParms.Add("CountryID", wFactory.CountryID);
                    wParms.Add("ProvinceID", wFactory.ProvinceID);
                    wParms.Add("CityID", wFactory.CityID);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);

                logger.Error("FMC_SaveFactory", ex);
            }
        }

        public int FMC_DisableFactory(BMSEmployee wLoginUser, FMCFactory wFactory, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("update {0}.fmc_factory set EditorID=@EditorID,"
                            + " EditTime=@EditTime,Active=2 where ID=@ID ", wInstance);
                    wParms.Clear();

                    wParms.Add("ID", wFactory.ID);

                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);

                logger.Error("FMC_DisableFactory", ex);
            }
            return wErrorCode.Result;
        }

        public int FMC_ActiveFactory(BMSEmployee wLoginUser, FMCFactory wFactory, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("update {0}.fmc_factory set EditorID=@EditorID,"
                            + " EditTime=@EditTime,Active=1 where ID=@ID ", wInstance);
                    wParms.Clear();

                    wParms.Add("ID", wFactory.ID);

                    wParms.Add("EditorID", wLoginUser.ID);
                    wParms.Add("EditTime", DateTime.Now);
                    wSQLText = this.DMLChange(wSQLText);
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);

                logger.Error("FMC_ActiveFactory", ex);
            }
            return wErrorCode.Result;
        }

        public int FMC_DeleteFactory(BMSEmployee wLoginUser, FMCFactory wFactory, OutResult<Int32> wErrorCode)
        {
            wErrorCode.set(0);
            // 判断客户信息是否存在(中国：统一社会信用代码，国外:提醒是否有重复）

            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("delete  from {0}.fmc_factory where ID=@ID and Active=0; ", wInstance);
                    wParms.Clear();

                    wParms.Add("ID", wFactory.ID); 
                    mDBPool.update(wSQLText, wParms);
                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);

                logger.Error("FMC_DeleteFactory", ex);
            }
            return wErrorCode.Result;
        }


        public FMCFactory FMC_QueryFactoryByID(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            FMCFactory wFactoryDB = new FMCFactory();
            wErrorCode.set(0);
            try
            {
                if (wID <= 0)
                    return wFactoryDB;
                List<FMCFactory> wList = this.FMC_QueryFactoryList(wLoginUser, wID, "", "", 0, 0, 0, -1, wErrorCode);
                if (wList != null && wList.Count > 0)
                    wFactoryDB = wList[0];
            }
            catch (Exception ex)
            {
                logger.Error("FMC_QueryFactoryByID", ex);
                wErrorCode.set(MESException.Exception.Value);
            }
            return wFactoryDB;
        }

        public FMCFactory FMC_QueryFactoryByCode(BMSEmployee wLoginUser, String wCode,
                OutResult<Int32> wErrorCode)
        {
            FMCFactory wFactoryDB = new FMCFactory();
            wErrorCode.set(0);
            try
            {
                if (StringUtils.isEmpty(wCode))
                    return wFactoryDB;
                List<FMCFactory> wList = this.FMC_QueryFactoryList(wLoginUser, 0, wCode,"", 0, 0, 0, -1, wErrorCode);
                if (wList != null && wList.Count > 0)
                    wFactoryDB = wList[0];
            }
            catch (Exception ex)
            {
                logger.Error("FMC_QueryFactoryByCode", ex);
                wErrorCode.set(MESException.Exception.Value);
            }
            return wFactoryDB;
        }

        public List<FMCFactory> FMC_QueryFactoryList(BMSEmployee wLoginUser, String wName, int wCountryID,
            int wProvinceID,
                int wCityID, int wActive,
                OutResult<Int32> wErrorCode)
        {

            return this.FMC_QueryFactoryList(wLoginUser, -1, "", wName, wCountryID,
             wProvinceID, wCityID, wActive, wErrorCode);
        }


        private List<FMCFactory> FMC_QueryFactoryList(BMSEmployee wLoginUser, int wID, String wCode, String wName, int wCountryID,
            int wProvinceID,
                int wCityID, int wActive, OutResult<Int32> wErrorCode)
        {
            List<FMCFactory> wFactoryList = new List<FMCFactory>();
            wErrorCode.set(0);

            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();

                if (wErrorCode.Result == 0)
                {

                    // Step0:查询
                    Dictionary<String, Object> wParms = new Dictionary<String, Object>();
                    String wSQLText = "";

                    wSQLText = StringUtils.Format("Select t.*, t3.Name as Creator,t4.Name as Editor"
                               + "  from {0}.fmc_factory t "
                               + " left join {0}.mbs_user t3 on t.CreatorID=t3.ID "
                               + " left join {0}.mbs_user t4 on t.EditorID=t4.ID "
                               + " where (@ID<=0 OR t.ID=@ID) and  (@Code = '' OR t.Code=@Code) "
                               + "  and  (@Name = '' OR t.Name like @Name)" +
                               " and (@CountryID<=0 OR t.CountryID=@CountryID)"
                               + " and (@ProvinceID<=0 OR t.ProvinceID=@ProvinceID)" +
                               "  and (@CityID<=0 OR t.CityID=@CityID)" +
                               "  and(@Active < 0 OR t.Active = @Active) ;", wInstance);


                    wParms.Clear();
                    wParms.Add("CountryID", wCountryID);
                    wParms.Add("ProvinceID", wProvinceID);
                    wParms.Add("CityID", wCityID);
                    wParms.Add("ID", wID);
                    wParms.Add("Code", wCode);
                    wParms.Add("Active", wActive);
                    wParms.Add("Name", StringUtils.isEmpty(wName) ? wName : "%" + wName + "%");
                    wSQLText = this.DMLChange(wSQLText);
                    List<Dictionary<String, Object>> wQueryResultList = mDBPool.queryForList(wSQLText, wParms);
                    foreach (Dictionary<String, Object> wSqlDataReader in wQueryResultList)
                    {
                        FMCFactory wFactoryDB = new FMCFactory();
                        wFactoryDB.ID = StringUtils.parseInt(wSqlDataReader["ID"]);
                        wFactoryDB.Name = StringUtils.parseString(wSqlDataReader["Name"]);
                        wFactoryDB.Code = StringUtils.parseString(wSqlDataReader["Code"]);

                        wFactoryDB.CountryID = StringUtils.parseInt(wSqlDataReader["CountryID"]);
                        wFactoryDB.ProvinceID = StringUtils.parseInt(wSqlDataReader["ProvinceID"]);
                        wFactoryDB.CityID = StringUtils.parseInt(wSqlDataReader["CityID"]);

                        wFactoryDB.Remark = StringUtils.parseString(wSqlDataReader["Remark"]);
                        wFactoryDB.CreatorID = StringUtils.parseInt(wSqlDataReader["CreatorID"]);
                        wFactoryDB.EditorID = StringUtils.parseInt(wSqlDataReader["EditorID"]);
                        wFactoryDB.Creator = StringUtils.parseString(wSqlDataReader["Creator"]);
                        wFactoryDB.Editor = StringUtils.parseString(wSqlDataReader["Editor"]);
                        wFactoryDB.CreateTime = StringUtils.parseDate(wSqlDataReader["CreateTime"]);
                        wFactoryDB.EditTime = StringUtils.parseDate(wSqlDataReader["EditTime"]);
                        wFactoryDB.Active = StringUtils.parseInt(wSqlDataReader["Active"]);

                        wFactoryList.Add(wFactoryDB);
                    }

                }
            }
            catch (Exception ex)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error("FMC_QueryFactoryList",
                        ex);
            }
            return wFactoryList;
        }



    }
}
