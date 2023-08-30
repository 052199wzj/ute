using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    public class MSSServiceImpl : MSSService
    {
        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(MSSServiceImpl));
        private static MSSService _instance = new MSSServiceImpl();

        public static MSSService getInstance()
        {
            if (_instance == null)
                _instance = new MSSServiceImpl();

            return _instance;
        }

        public ServiceResult<List<MSSMaterial>> MSS_GetMaterialList(BMSEmployee wLoginUser, string wMaterialNo, string wMaterialName, string wGroes, int wActive, Pagination wPagination)
        {
            ServiceResult<List<MSSMaterial>> wResult = new ServiceResult<List<MSSMaterial>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(MSSMaterialDAO.getInstance().GetAll(wLoginUser, wMaterialNo, wMaterialName, wGroes, wActive, wPagination, wErrorCode)); 
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<Int32> MSS_SaveMaterial(BMSEmployee wLoginUser, MSSMaterial wMSSMaterial)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                MSSMaterialDAO.getInstance().Update(wLoginUser, wMSSMaterial, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<Int32> MSS_ActiveMaterialList(BMSEmployee wLoginUser, List<int> wIDList, int wActive)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                MSSMaterialDAO.getInstance().Active(wLoginUser, wIDList, wActive, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<Int32> MSS_DeleteMaterialList(BMSEmployee wLoginUser, MSSMaterial wMaterial)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                MSSMaterialDAO.getInstance().Delete(wLoginUser, wMaterial, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<MSSLocation>> MSS_GetMaterialLocation(BMSEmployee wLoginUser, int wType, Pagination wPagination)
        {
            ServiceResult<List<MSSLocation>> wResult = new ServiceResult<List<MSSLocation>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(MSSLocationDAO.getInstance().SelectAll(wLoginUser, wType, wPagination, wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<Int32> MSS_UpdateMaterialLocation(BMSEmployee wLoginUser, MSSLocation wMSSLocation)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                MSSLocationDAO.getInstance().Update(wLoginUser, wMSSLocation, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<MSSStock>> MSS_GetMaterialStock(BMSEmployee wLoginUser, int wMaterialID, int wLocationID, string wMaterialLike, Pagination wPagination)
        {
            ServiceResult<List<MSSStock>> wResult = new ServiceResult<List<MSSStock>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0); 
                wResult.setResult(MSSStockDAO.getInstance().GetAll(wLoginUser,  wMaterialID,  wLocationID,  wMaterialLike,  wPagination, wErrorCode)); 
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<MSSMaterialOperationRecord>> MSS_GetMaterialStockDetail(BMSEmployee wLoginUser, int wStockID,  Pagination wPagination)
        {
            ServiceResult<List<MSSMaterialOperationRecord>> wResult = new ServiceResult<List<MSSMaterialOperationRecord>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wResult.setResult(MSSMaterialOperationRecordDAO.getInstance().GetMaterialStock(wLoginUser, wStockID, wPagination, wErrorCode));
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> MSS_SaveMaterialOperationRecord(BMSEmployee wLoginUser, MSSMaterialOperationRecord wMSSMaterialOperationRecord)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                MSSMaterialOperationRecordDAO.getInstance().Add(wLoginUser, wMSSMaterialOperationRecord, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<MSSMaterialOperationRecord>> MSS_GetMaterialOperationRecord(BMSEmployee wLoginUser, int wLocationID, String wLocationLike, String wMaterialLike,
            String wMaterialBatch, int wOperationType, Pagination wPagination)
        {
            ServiceResult<List<MSSMaterialOperationRecord>> wResult = new ServiceResult<List<MSSMaterialOperationRecord>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0); 
                wResult.setResult(MSSMaterialOperationRecordDAO.getInstance().GetMaterialOperationRecord(wLoginUser, wLocationID, wLocationLike, wMaterialLike,
             wMaterialBatch, wOperationType, wPagination, wErrorCode)); 
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
    }
}
