using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{


    public class ELGServiceImpl : ELGService
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(ELGServiceImpl));
        private static ELGService _instance = new ELGServiceImpl();

        public static ELGService getInstance()
        {
            if (_instance == null)
                _instance = new ELGServiceImpl();

            return _instance;
        }



        public ServiceResult<List<ELGCatalog>> ELG_QueryCataLogList(BMSEmployee wLoginUser)
        {
            ServiceResult<List<ELGCatalog>> wResult = new ServiceResult<List<ELGCatalog>>();
            try
            {
                wResult.Result = ELGCatalogDAO.getInstance().SelectList(wLoginUser);
            }
            catch (Exception e)
            {

                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public  ServiceResult<List<String>> ELG_ShowLogFile(BMSEmployee wLoginUser, String wPath)
        {
            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                wResult.Result = ELGCatalogDAO.getInstance().ShowLogFile(wLoginUser, wPath);
            }
            catch (Exception e)
            {

                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<Boolean> ELG_DeleteLogFile(BMSEmployee wLoginUser, String wPath)
        {
            ServiceResult<Boolean> wResult = new ServiceResult<Boolean>();
            try
            {
                wResult.Result = ELGCatalogDAO.getInstance().DeleteByPath(wLoginUser, wPath);
            }
            catch (Exception ex)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
            }
            return wResult;
        }


        public ServiceResult<String> ELG_DeleteLogFileList(BMSEmployee wLoginUser, List<String> wPathList)
        {
            ServiceResult<String> wResult = new ServiceResult<String>();
            try
            {
                wResult.Result = ELGCatalogDAO.getInstance().DeleteList(wLoginUser, wPathList);
            }
            catch (Exception e)
            {

                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


    }
}
