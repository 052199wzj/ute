using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iPlant.Data.EF;

namespace iPlant.FMC.Service
{
    class DMSEnergyParameterDAO : BaseDAO
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DMSEnergyParameterDAO));




        private static DMSEnergyParameterDAO Instance;

        private DMSEnergyParameterDAO() : base()
        {

        }

        public static DMSEnergyParameterDAO getInstance()
        {
            if (Instance == null)
                Instance = new DMSEnergyParameterDAO();
            return Instance;
        }


        public List<DMSEnergyParameter> DMS_SelectEnergyParameterList(BMSEmployee wLoginUser, DateTime wStartTime, DateTime wEndTime, OutResult<Int32> wErrorCode)
        {
            List<DMSEnergyParameter> wResult = new List<DMSEnergyParameter>();
            try
            {
                wErrorCode.set(0); 	 String wInstance =iPlant.Data.EF.MESDBSource.DMS.getDBName();
                if (wErrorCode.Result != 0)
                    return wResult;
                String wSQL = StringUtils.Format("SELECT t.*  FROM {0}.dms_energy_params t" +
                    "  WHERE t.UpdateTime >= @wStartTime and  t.UpdateTime <= @wEndTime "
                     , wInstance);
                wSQL = this.DMLChange(wSQL);
                Dictionary<String, Object> wParamMap = new Dictionary<String, Object>();

                wParamMap.Add("wStartTime", wStartTime);
                wParamMap.Add("wEndTime", wEndTime);

                List<Dictionary<String, Object>> wQueryResult = mDBPool.queryForList(wSQL, wParamMap);
                // wReader\[\"(\w+)\"\]
                foreach (Dictionary<String, Object> wReader in wQueryResult)
                {
                    DMSEnergyParameter wDeviceModelW = new DMSEnergyParameter();

                    wDeviceModelW.DeviceID = StringUtils.parseInt(wReader["DeviceID"]);
                    wDeviceModelW.EnergyType = StringUtils.parseInt(wReader["EnergyType"]);
                    wDeviceModelW.RealValue = StringUtils.parseDouble(wReader["RealValue"]);
                    wDeviceModelW.UpdateTime = StringUtils.parseDate(wReader["UpdateTime"]);

                    wResult.Add(wDeviceModelW);
                }

            }
            catch (Exception e)
            {
                wErrorCode.set(MESException.DBSQL.Value);
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


 



        public String DMS_InsertEnergyParameter(DMSEnergyParameter wDMSEnergyParameter)
        {

            if (wDMSEnergyParameter == null || wDMSEnergyParameter.DeviceID <= 0 || wDMSEnergyParameter.EnergyType <= 0 || wDMSEnergyParameter.RealValue < 0)
            {
                return "";
            }
             
            return StringUtils.Format(" Insert into {0}.dms_energy_params (DeviceID,EnergyType,RealValue,UpdateTime) " +
                "values ({1},{2},{3},'{4}');", MESDBSource.DMS.getDBName(), wDMSEnergyParameter.DeviceID, wDMSEnergyParameter.EnergyType,
                 wDMSEnergyParameter.RealValue, wDMSEnergyParameter.UpdateTime.ToString("yyyy-MM-dd HH:mm:ss"));


        }


    }
}
