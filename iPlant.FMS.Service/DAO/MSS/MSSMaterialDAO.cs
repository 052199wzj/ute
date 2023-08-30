using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class MSSMaterialDAO : BaseDAO
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(MSSMaterialDAO));
        private static MSSMaterialDAO Instance = null;

        private MSSMaterialDAO() : base()
        {

        }

        public static MSSMaterialDAO getInstance()
        {
            if (Instance == null)
                Instance = new MSSMaterialDAO();
            return Instance;
        }

        public List<MSSMaterial> GetAll(BMSEmployee wLoginUser, string wMaterialNo, string wMaterialName, string wGroes, int wActive, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<MSSMaterial> wResult = new List<MSSMaterial>();
            try
            {

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName(); 
                if (wErrorCode.Result != 0)
                    return wResult;

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                string wSqlCondition = string.Format(@" from {0}.mss_material t " +
                    "left join {0}.mbs_user t1 on t1.ID=t.CreatorID " +
                    "left join {0}.mbs_user t2 on t2.ID=t.EditorID where 1=1  ", wInstance);
                if (!string.IsNullOrWhiteSpace(wMaterialNo))
                {
                    wSqlCondition += " and t.MaterialNo like @wMaterialNo";
                    wParamMap.Add("wMaterialNo", "%" + wMaterialNo + "%");
                }
                if (!string.IsNullOrWhiteSpace(wMaterialName))
                {
                    wSqlCondition += " and t.MaterialName like @wMaterialName";
                    wParamMap.Add("wMaterialName", "%" + wMaterialName + "%");
                }
                if (!string.IsNullOrWhiteSpace(wGroes))
                {
                    wSqlCondition += " and t.Groes like @wGroes";
                    wParamMap.Add("wGroes", "%" + wGroes + "%");
                }
                if (wActive >= 0)
                {
                    wSqlCondition += " and t.Active = @wActive";
                    wParamMap.Add("wActive", wActive);
                }
                 
                String wSQL = "select t.ID,t.MaterialNo,t.MaterialName,t.Groes,t.Remark,t.CreateTime,t.EditTime,t.Active,t.CreatorID,t.EditorID,t1.Name as Creator,t2.Name as Editor " + wSqlCondition ;
                
                wSQL = this.DMLChange(wSQL);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap, wPagination);

                if (wQueryResult.Count <= 0)
                {
                    return wResult;
                }
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    MSSMaterial wMaterial = new MSSMaterial();

                    wMaterial.ID = StringUtils.parseInt(wReader["ID"]);
                    wMaterial.MaterialNo = StringUtils.parseString(wReader["MaterialNo"]);
                    wMaterial.MaterialName = StringUtils.parseString(wReader["MaterialName"]);
                    wMaterial.Groes = StringUtils.parseString(wReader["Groes"]);
                    wMaterial.Remark = StringUtils.parseString(wReader["Remark"]);
                    wMaterial.Active = StringUtils.parseInt(wReader["Active"]);
                    wMaterial.CreatorID = StringUtils.parseInt(wReader["CreatorID"]);
                    wMaterial.Creator = StringUtils.parseString(wReader["Creator"]);
                    wMaterial.CreateTime = StringUtils.parseDate(wReader["CreateTime"]);
                    wMaterial.EditorID = StringUtils.parseInt(wReader["EditorID"]);
                    wMaterial.Editor = StringUtils.parseString(wReader["Editor"]);
                    wMaterial.EditTime = StringUtils.parseDate(wReader["EditTime"]);
                    wResult.Add(wMaterial);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public void Update(BMSEmployee wLoginUser, MSSMaterial wMSSMaterial, OutResult<Int32> wErrorCode)
        {
            try
            {
                if (wMSSMaterial == null || StringUtils.isEmpty(wMSSMaterial.MaterialNo) || StringUtils.isEmpty(wMSSMaterial.MaterialName))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                if (wMSSMaterial.ID > 0 && StringUtils.isEmpty(wMSSMaterial.MaterialNo) || StringUtils.isEmpty(wMSSMaterial.MaterialName))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName(); 

                MSSMaterial wMSSMaterialDB = this.MSS_CheckMaterialNo(wLoginUser, wMSSMaterial, wErrorCode);
                if (wMSSMaterialDB.ID > 0)
                {
                    wErrorCode.Result = MESException.Duplication.Value;
                    if (wMSSMaterial.ID <= 0)
                    {
                        wMSSMaterial.ID = wMSSMaterialDB.ID;
                    }
                    return;
                }

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("MaterialNo", wMSSMaterial.MaterialNo);
                wParamMap.Add("MaterialName", wMSSMaterial.MaterialName);
                wParamMap.Add("Groes", wMSSMaterial.Groes);
                wParamMap.Add("Remark", wMSSMaterial.Remark);
                wParamMap.Add("EditorID", wLoginUser.ID);
                wParamMap.Add("EditTime", DateTime.Now);

                if (wMSSMaterial.ID <= 0)
                { 
                    wParamMap.Add("Active", wMSSMaterial.Active);
                    wParamMap.Add("CreatorID", wLoginUser.ID);
                    wParamMap.Add("CreateTime", DateTime.Now);
                    wMSSMaterial.ID = this.Insert(StringUtils.Format("{0}.mss_material", wInstance), wParamMap);

                }
                else
                {
                    wParamMap.Add("ID", wMSSMaterial.ID);
                    this.Update(StringUtils.Format("{0}.mss_material", wInstance), "ID", wParamMap);
                }

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public MSSMaterial MSS_CheckMaterialNo(BMSEmployee wLoginUser, MSSMaterial wMSSMaterial,
                  OutResult<Int32> wErrorCode)
        {
            MSSMaterial wResult = new MSSMaterial();
            try
            {

                if (wMSSMaterial == null || StringUtils.isEmpty(wMSSMaterial.MaterialNo)
                        || StringUtils.isEmpty(wMSSMaterial.MaterialName))
                {
                    return wResult;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;

                String wSQL = StringUtils.Format(
                        "SELECT t1.* FROM {0}.mss_material t1 WHERE t1.ID != @ID " +
                        " AND t1.MaterialNo =@MaterialNo  ;",
                        wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("ID", wMSSMaterial.ID);
                wParamMap.Add("MaterialNo", wMSSMaterial.MaterialNo);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {

                    wResult.ID = StringUtils.parseInt(wReader["ID"]);
                    wResult.MaterialNo = StringUtils.parseString(wReader["MaterialNo"]);
                    wResult.MaterialName = StringUtils.parseString(wReader["MaterialName"]);
                    wResult.Groes = StringUtils.parseString(wReader["Groes"]);
                    wResult.Remark = StringUtils.parseString(wReader["Remark"]);
                    wResult.Active = StringUtils.parseInt(wReader["Active"]);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public void Active(BMSEmployee wLoginUser, List<int> wIDList, int wActive, OutResult<Int32> wErrorCode)
        {
            try
            {
                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                if (wIDList == null || wIDList.Count <= 0)
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }
                wIDList.RemoveAll(p => p <= 0);
                if (wIDList.Count <= 0)
                    return;

                if (wActive != 1)
                    wActive = 0;
                String wSql = StringUtils.Format("UPDATE {0}.mss_material SET Active ={1} WHERE ID IN({2}) ;",
                        wInstance, wActive, StringUtils.Join(",", wIDList));

                this.mDBPool.update(wSql, null);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }

        public void Delete(BMSEmployee wLoginUser, MSSMaterial wMaterial, OutResult<Int32> wErrorCode)
        {
            try
            {

                if (wMaterial == null || StringUtils.isEmpty(wMaterial.MaterialNo) || StringUtils.isEmpty(wMaterial.MaterialName))
                {
                    wErrorCode.set(MESException.Parameter.Value);
                    return;
                }

                wErrorCode.set(0);
                String wInstance = iPlant.Data.EF.MESDBSource.Basic.getDBName();
                if (wErrorCode.Result != 0)
                    return;

                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();
                wParamMap.Add("ID", wMaterial.ID);
                this.Delete(StringUtils.Format("{0}.mss_material", wInstance), wParamMap);
            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
        }
    }
}
