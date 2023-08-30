using iPlant.Common.Tools;
using iPlant.Data.EF;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    class MSSLocationDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(MSSLocationDAO));

        private static MSSLocationDAO Instance;

        public List<MSSLocation> SelectAll(BMSEmployee wLoginUser, int wType, Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<MSSLocation> wResult = new List<MSSLocation>();
            try
            {


                String wSQL = StringUtils.Format("SELECT t.*,t1.Name as EditorName FROM {0}.mss_location t " +
                    " left join {0}.mbs_user t1 on t.EditorID=t1.ID " +
                    " WHERE 1=1 and (@wType <= 0 or @wType=t.Type )",
                        MESDBSource.Basic.getDBName());
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>
                {
                    { "wType", wType }
                };
                wSQL = this.DMLChange(wSQL);

                wResult = mDBPool.queryForList<MSSLocation>(wSQL, wParamMap, wPagination);

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error("SelectAll", e);
            }
            return wResult;
        }

        public int Update(BMSEmployee wLoginUser, MSSLocation wMSSLocation, OutResult<Int32> wErrorCode)
        {
            int wResult = 0;
            try
            {

                /// \"\s*\+[\s ]*\"
                /// \`([A-Za-z0-9_]+)\`
                /// \<\{([A-Za-z0-9_]+)\:[^\}]+\}\>

                wMSSLocation.EditorID = wLoginUser.ID;

                
                Dictionary<String, Object> wParams = CloneTool.Clone<Dictionary<String, Object>>(wMSSLocation);
                if (wParams.ContainsKey("EditorName"))
                    wParams.Remove("EditorName");

                if (wMSSLocation.ID <= 0)
                {
                    if (wParams.ContainsKey("ID"))
                        wParams.Remove("ID");

                    wMSSLocation.ID = this.Insert(StringUtils.Format("{0}.mss_location", MESDBSource.Basic.getDBName()), wParams);
                }
                else
                {
                    this.Update(StringUtils.Format("{0}.mss_location", MESDBSource.Basic.getDBName()), "ID", wParams);

                }
                wResult = wMSSLocation.ID;

            }
            catch (Exception e)
            {
                wErrorCode.Result = MESException.DBSQL.Value;
                logger.Error("Update", e);
            }
            return wResult;
        }

        private MSSLocationDAO() : base()
        {

        }

        public static MSSLocationDAO getInstance()
        {
            if (Instance == null)
                Instance = new MSSLocationDAO();
            return Instance;
        }

    }
}
