using System;
using System.Collections.Generic;
using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iPlant.Data.EF;

namespace iPlant.FMC.Service
{
    class DMSDeviceServerDAO : BaseDAO
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSDeviceServerDAO));

        private static DMSDeviceServerDAO Instance;

        public List<DMSDeviceServer> DMS_SelectDeviceServerAll(BMSEmployee wLoginUser, int wID, int wServerType, int wActive,Pagination wPagination, OutResult<Int32> wErrorCode)
        {
            List<DMSDeviceServer> wResult = new List<DMSDeviceServer>();
            try
            {
                wErrorCode.set(0); 
	            String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
              

                String wSQL = StringUtils.Format(
                        "SELECT * FROM {0}.dms_device_server WHERE 1=1 and (@wActive <= 0 or @wActive=Active) " +
                        " and (@wServerType <= 0 or @wServerType=ServerType)  and (@wID <= 0 or @wID=ID)",
                        wInstance);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>
                {
                    { "wServerType", wServerType },
                    { "wID", wID },
                    { "wActive", wActive }
                };
                wSQL = this.DMLChange(wSQL);

                wResult = this.QueryForList<DMSDeviceServer>(wSQL, wParamMap, wPagination);

            }
            catch (Exception e)
            {

                logger.Error("SelectAll", e);
                wErrorCode.set(MESException.DBSQL.Value);

            }
            return wResult;
        }

        public DMSDeviceServer DMS_SelectDeviceServer(BMSEmployee wLoginUser, int wID, OutResult<Int32> wErrorCode)
        {
            DMSDeviceServer wResult = new DMSDeviceServer();
            try
            {
                if (wID <= 0)
                    return wResult;

                List<DMSDeviceServer> wDMSDeviceServerList = DMS_SelectDeviceServerAll(wLoginUser,wID, 0, 0,Pagination.Default, wErrorCode);

                if (wDMSDeviceServerList.Count > 0)
                {
                    wResult = wDMSDeviceServerList[0];
                }

            }
            catch (Exception e)
            {
                logger.Error("Select", e);

            }
            return wResult;
        }

        public void DMS_UpdateDeviceServer(BMSEmployee wLoginUser, DMSDeviceServer wDMSDeviceServer, OutResult<Int32> wErrorCode)
        { 
            try
            {

                /// \"\s*\+[\s ]*\"
                /// \`([A-Za-z0-9_]+)\`
                /// \<\{([A-Za-z0-9_]+)\:[^\}]+\}\>

                wErrorCode.set(0); 
	            String wInstance =iPlant.Data.EF.MESDBSource.Basic.getDBName();
                  
                Dictionary<String, Object> wParams = CloneTool.Clone<Dictionary<String, Object>>(wDMSDeviceServer);
                if (wDMSDeviceServer.ID <= 0)
                {
                    wParams.Remove("ID");
                    wDMSDeviceServer.ID= this.Insert(StringUtils.Format(" {0}.dms_device_server ", wInstance), wParams);
                }
                else
                {
                    this.Update(StringUtils.Format(" {0}.dms_device_server ", wInstance),"ID", wParams);
                }
               
            }
            catch (Exception e)
            {
                logger.Error("Update", e);
                wErrorCode.set(MESException.DBSQL.Value);

            } 
        }
         

        private DMSDeviceServerDAO() : base()

        {
        }

        public static DMSDeviceServerDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSDeviceServerDAO();
            return Instance;
        }

    }
}
