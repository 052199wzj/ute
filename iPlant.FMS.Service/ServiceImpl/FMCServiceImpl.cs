using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{


    public class FMCServiceImpl : FMCService
    {

        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(FMCServiceImpl));

        public FMCServiceImpl()
        {
            // TODO Auto-generated constructor stub
        }

        private static FMCService Instance = null;

        public static FMCService getInstance()
        {
            if (Instance == null)
                Instance = new FMCServiceImpl();

            return Instance;
        }




        public ServiceResult<Int32> FMC_AddFactory(BMSEmployee wLoginUser, FMCFactory wFactory)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                FMCFactoryDAO.getInstance().FMC_AddFactory(wLoginUser, wFactory, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_SaveFactory(BMSEmployee wLoginUser, FMCFactory wFactory)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                FMCFactoryDAO.getInstance().FMC_SaveFactory(wLoginUser, wFactory, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_DisableFactory(BMSEmployee wLoginUser, FMCFactory wFactory)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCFactoryDAO.getInstance().FMC_DisableFactory(wLoginUser, wFactory, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_ActiveFactory(BMSEmployee wLoginUser, FMCFactory wFactory)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCFactoryDAO.getInstance().FMC_ActiveFactory(wLoginUser, wFactory, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_DeleteFactory(BMSEmployee wLoginUser, FMCFactory wFactory)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCFactoryDAO.getInstance().FMC_DeleteFactory(wLoginUser, wFactory, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
        public ServiceResult<FMCFactory> FMC_QueryFactoryByID(BMSEmployee wLoginUser, int wID)
        {
            // TODO Auto-generated method stub
            ServiceResult<FMCFactory> wResult = new ServiceResult<FMCFactory>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCFactoryDAO.getInstance().FMC_QueryFactoryByID(wLoginUser, wID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<FMCFactory> FMC_QueryFactoryByCode(BMSEmployee wLoginUser, String wCode)
        {
            // TODO Auto-generated method stub
            ServiceResult<FMCFactory> wResult = new ServiceResult<FMCFactory>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCFactoryDAO.getInstance().FMC_QueryFactoryByCode(wLoginUser, wCode,
                        wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<FMCFactory>> FMC_QueryFactoryList(BMSEmployee wLoginUser, String wName, int wCountryID,
            int wProvinceID,
                int wCityID, int wActive)
        {
            // TODO Auto-generated method stub
            ServiceResult<List<FMCFactory>> wResult = new ServiceResult<List<FMCFactory>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCFactoryDAO.getInstance().FMC_QueryFactoryList(wLoginUser, wName, wCountryID,
             wProvinceID,
                 wCityID, wActive, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<Int32> FMC_AddWorkShop(BMSEmployee wLoginUser, FMCWorkShop wWorkShop)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCWorkShopDAO.getInstance().FMC_AddWorkShop(wLoginUser, wWorkShop, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_SaveWorkShop(BMSEmployee wLoginUser, FMCWorkShop wWorkShop)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCWorkShopDAO.getInstance().FMC_SaveWorkShop(wLoginUser, wWorkShop, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_DisableWorkShop(BMSEmployee wLoginUser, FMCWorkShop wWorkShop)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCWorkShopDAO.getInstance().FMC_DisableWorkShop(wLoginUser, wWorkShop,
                        wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_ActiveWorkShop(BMSEmployee wLoginUser, FMCWorkShop wWorkShop)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCWorkShopDAO.getInstance().FMC_ActiveWorkShop(wLoginUser, wWorkShop,
                        wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }




        public ServiceResult<FMCWorkShop> FMC_QueryWorkShopByID(BMSEmployee wLoginUser, int wID)
        {
            // TODO Auto-generated method stub
            ServiceResult<FMCWorkShop> wResult = new ServiceResult<FMCWorkShop>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCWorkShopDAO.getInstance().FMC_QueryWorkShopByID(wLoginUser, wID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<FMCWorkShop> FMC_QueryWorkShopByCode(BMSEmployee wLoginUser, String wCode)
        {
            // TODO Auto-generated method stub
            ServiceResult<FMCWorkShop> wResult = new ServiceResult<FMCWorkShop>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCWorkShopDAO.getInstance().FMC_QueryWorkShopByCode(wLoginUser, wCode,
                        wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<FMCWorkShop>> FMC_QueryWorkShopList(BMSEmployee wLoginUser, int wFactoryID,
                int wBusinessUnitID, int wActive)
        {
            // TODO Auto-generated method stub
            ServiceResult<List<FMCWorkShop>> wResult = new ServiceResult<List<FMCWorkShop>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCWorkShopDAO.getInstance().FMC_QueryWorkShopList(wLoginUser, wFactoryID,
                        wBusinessUnitID, wActive, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_AddLine(BMSEmployee wLoginUser, FMCLine wLine)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                FMCLineDAO.getInstance().FMC_AddLine(wLoginUser, wLine, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_SaveLine(BMSEmployee wLoginUser, FMCLine wLine)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                FMCLineDAO.getInstance().FMC_SaveLine(wLoginUser, wLine, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_DisableLine(BMSEmployee wLoginUser, FMCLine wLine)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCLineDAO.getInstance().FMC_DisableLine(wLoginUser, wLine, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_ActiveLine(BMSEmployee wLoginUser, FMCLine wLine)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCLineDAO.getInstance().FMC_ActiveLine(wLoginUser, wLine, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<FMCLine> FMC_QueryLineByID(BMSEmployee wLoginUser, int wID)
        {
            // TODO Auto-generated method stub
            ServiceResult<FMCLine> wResult = new ServiceResult<FMCLine>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCLineDAO.getInstance().FMC_QueryLineByID(wLoginUser, wID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<FMCLine> FMC_QueryLineByCode(BMSEmployee wLoginUser, String wCode)
        {
            // TODO Auto-generated method stub
            ServiceResult<FMCLine> wResult = new ServiceResult<FMCLine>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCLineDAO.getInstance().FMC_QueryLineByCode(wLoginUser, wCode, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<FMCLine>> FMC_QueryLineList(BMSEmployee wLoginUser, int wBusinessUnitID,
                int wFactoryID, int wWorkShopID, int wActive)
        {
            // TODO Auto-generated method stub
            ServiceResult<List<FMCLine>> wResult = new ServiceResult<List<FMCLine>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCLineDAO.getInstance().FMC_QueryLineList(wLoginUser, wBusinessUnitID,
                        wFactoryID, wWorkShopID, wActive, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Dictionary<Int32, FMCLine>> FMC_QueryLineDic()
        {
            // TODO Auto-generated method stub
            ServiceResult<Dictionary<Int32, FMCLine>> wResult = new ServiceResult<Dictionary<Int32, FMCLine>>(
                    new Dictionary<Int32, FMCLine>());
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<FMCLine> wFMCLineList = FMCLineDAO.getInstance().FMC_QueryLineList(BaseDAO.SysAdmin, -1,
                       -1, -1, -1, wErrorCode);
                wResult.Result = wFMCLineList.ToDictionary(p => p.ID, p => p);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        //public ServiceResult<Int32> FMC_AddLineUnit(BMSEmployee wLoginUser, FMCLineUnit wLineUnit)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);

        //        FMCLineUnitDAO.getInstance().FMC_AddLineUnit(wLoginUser, wLineUnit, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_CopyLineUnit(BMSEmployee wLoginUser, int wOldLineID, int wOldProductID,
        //        int wOldCustomerID, int wLineID, int wProductID, int wCustomerID)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        FMCLineUnitDAO.getInstance().FMC_CopyLineUnit(wLoginUser, wOldLineID, wOldProductID,
        //                wOldCustomerID, wLineID, wProductID, wCustomerID, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_SaveLineUnit(BMSEmployee wLoginUser, FMCLineUnit wLineUnit)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        FMCLineUnitDAO.getInstance().FMC_SaveLineUnit(wLoginUser, wLineUnit, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_DeleteLineUnitByID(BMSEmployee wLoginUser, int wID)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        wResult.Result = FMCLineUnitDAO.getInstance().FMC_DeleteLineUnitByID(wLoginUser, wID, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_ActiveLineUnit(BMSEmployee wLoginUser, FMCLineUnit wLineUnit)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        wResult.Result = FMCLineUnitDAO.getInstance().FMC_ActiveLineUnit(wLoginUser, wLineUnit,
        //                wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_DisableLineUnit(BMSEmployee wLoginUser, FMCLineUnit wLineUnit)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        wResult.Result = FMCLineUnitDAO.getInstance().FMC_DisableLineUnit(wLoginUser, wLineUnit,
        //                wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<List<FMCLineUnit>> FMC_QueryLineUnitListByLineID(BMSEmployee wLoginUser, int wProductID,
        //        int wCustomerID, int wLineID, int wID, boolean wIsList)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<List<FMCLineUnit>> wResult = new ServiceResult<List<FMCLineUnit>>();
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        wResult.Result = FMCLineUnitDAO.getInstance().FMC_QueryLineUnitListByLineID(wLoginUser,
        //                wProductID, wCustomerID, wLineID, wID, wIsList, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<List<FMCLineUnit>> FMC_QueryLineUnitListByStationID(BMSEmployee wLoginUser,
        //        int wProductID, int wCustomerID, int wLineID, int wStationID)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<List<FMCLineUnit>> wResult = new ServiceResult<List<FMCLineUnit>>();
        //    wResult.Result = new List<FMCLineUnit>();
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        List<FMCLineUnit> wLineUnitList = FMCLineUnitDAO.getInstance().FMC_QueryLineUnitListByLineID(wCompanyID,
        //                wLoginID, wProductID, wCustomerID, wLineID, 0, false, wErrorCode);

        //        for (FMCLineUnit wPartUnit : wLineUnitList)
        //        {
        //            for (FMCLineUnit wStepUnit : wPartUnit.UnitList)
        //            {
        //                if (wStepUnit.UnitList != null && wStepUnit.UnitList.Count > 0
        //                        && wStepUnit.UnitList.stream().anyMatch(p=>p.UnitID == wStationID))
        //                {
        //                    wResult.Result.Add(wPartUnit);
        //                    break;
        //                }
        //            }
        //        }

        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<List<FMCLineUnit>> FMC_QueryLineUnitListByPartID(BMSEmployee wLoginUser, int wProductID,
        //        int wCustomerID, int wLineID, int wPartID)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<List<FMCLineUnit>> wResult = new ServiceResult<List<FMCLineUnit>>();
        //    wResult.Result = new List<FMCLineUnit>();
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        List<FMCLineUnit> wLineUnitList = FMCLineUnitDAO.getInstance().FMC_QueryLineUnitListByLineID(wCompanyID,
        //                wLoginID, wProductID, wCustomerID, wLineID, 0, false, wErrorCode);

        //        for (FMCLineUnit wPartUnit : wLineUnitList)
        //        {

        //            if (wPartUnit.UnitList == null || wPartUnit.UnitList.Count <= 0 || wPartUnit.UnitID != wPartID
        //                    || wPartUnit.Active != 1)
        //                continue;

        //            for (FMCLineUnit wStepUnit : wPartUnit.UnitList)
        //            {

        //                if (wStepUnit.UnitList == null || wStepUnit.UnitList.Count <= 0 || wStepUnit.Active != 1)
        //                    continue;

        //                for (FMCLineUnit wStationUnit : wStepUnit.UnitList)
        //                {
        //                    if (wStepUnit.Active != 1 || wStepUnit.ID <= 0 || wStepUnit.UnitID <= 0)
        //                        continue;

        //                    wResult.Result.Add(wStationUnit);
        //                }
        //            }
        //        }

        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<List<FMCStation>> FMC_QueryStationListByPartID(BMSEmployee wLoginUser, int wProductID,
        //        int wCustomerID, int wLineID, int wPartID)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<List<FMCStation>> wResult = new ServiceResult<List<FMCStation>>();
        //    wResult.Result = new List<FMCStation>();
        //    try
        //    {

        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        List<FMCLineUnit> wLineUnitList = FMCLineUnitDAO.getInstance().FMC_QueryLineUnitListByLineID(wCompanyID,
        //                wLoginID, wProductID, wCustomerID, wLineID, 0, false, wErrorCode);

        //        List<Int32> wStationIDList = new List<Int32>();
        //        for (FMCLineUnit wPartUnit : wLineUnitList)
        //        {

        //            if (wPartUnit.UnitList == null || wPartUnit.UnitList.Count <= 0 || wPartUnit.UnitID != wPartID
        //                    || wPartUnit.Active != 1)
        //                continue;

        //            for (FMCLineUnit wStepUnit : wPartUnit.UnitList)
        //            {

        //                if (wStepUnit.UnitList == null || wStepUnit.UnitList.Count <= 0 || wStepUnit.Active != 1)
        //                    continue;

        //                for (FMCLineUnit wStationUnit : wStepUnit.UnitList)
        //                {
        //                    if (wStepUnit.Active != 1 || wStepUnit.ID <= 0 || wStepUnit.UnitID <= 0
        //                            || wStationIDList.contains(wStepUnit.UnitID))
        //                        continue;
        //                    wStationIDList.Add(wStationUnit.UnitID);
        //                    wResult.Result.Add(FMCConstants.GetFMCStation(wStationUnit.UnitID));
        //                }
        //            }
        //        }

        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_AddResource(BMSEmployee wLoginUser, FMCResource wResource)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        FMCResourceDAO.getInstance().FMC_AddResource(wLoginUser, wResource, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_SaveResource(BMSEmployee wLoginUser, FMCResource wResource)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        FMCResourceDAO.getInstance().FMC_SaveResource(wLoginUser, wResource, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_DisableResource(BMSEmployee wLoginUser, FMCResource wResource)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        FMCResourceDAO.getInstance().FMC_DisableResource(wLoginUser, wResource, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_ActiveResource(BMSEmployee wLoginUser, FMCResource wResource)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        FMCResourceDAO.getInstance().FMC_ActiveResource(wLoginUser, wResource, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<FMCResource> FMC_QueryResourceByID(BMSEmployee wLoginUser, int wID)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<FMCResource> wResult = new ServiceResult<FMCResource>();
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        wResult.Result = FMCResourceDAO.getInstance().FMC_QueryResourceByID(wLoginUser, wID, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<List<FMCResource>> FMC_QueryResourceList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID,
        //        int wStationID, int wAreaID, int wResourceID, int wType, int wActive)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<List<FMCResource>> wResult = new ServiceResult<List<FMCResource>>();
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        wResult.Result = FMCResourceDAO.getInstance().FMC_QueryResourceList(wLoginUser, wWorkShopID, wLineID,
        //                wStationID, wAreaID, wResourceID, wType, wActive, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_AddWorkArea(BMSEmployee wLoginUser, FMCWorkArea wWorkArea)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        FMCWorkAreaDAO.getInstance().FMC_AddWorkArea(wLoginUser, wWorkArea, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_SaveWorkArea(BMSEmployee wLoginUser, FMCWorkArea wWorkArea)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        FMCWorkAreaDAO.getInstance().FMC_SaveWorkArea(wLoginUser, wWorkArea, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_DisableWorkArea(BMSEmployee wLoginUser, FMCWorkArea wWorkArea)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        FMCWorkAreaDAO.getInstance().FMC_DisableWorkArea(wLoginUser, wWorkArea, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_ActiveWorkArea(BMSEmployee wLoginUser, FMCWorkArea wWorkArea)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        FMCWorkAreaDAO.getInstance().FMC_ActiveWorkArea(wLoginUser, wWorkArea, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<FMCWorkArea> FMC_QueryWorkArea(BMSEmployee wLoginUser, int wID, String wCode)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<FMCWorkArea> wResult = new ServiceResult<FMCWorkArea>();
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        wResult.Result = FMCWorkAreaDAO.getInstance().FMC_QueryWorkArea(wLoginUser, wID, wCode, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<List<FMCWorkArea>> FMC_QueryWorkAreaList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID,
        //        int wParentID, int wActive)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<List<FMCWorkArea>> wResult = new ServiceResult<List<FMCWorkArea>>();
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        wResult.Result = FMCWorkAreaDAO.getInstance().FMC_QueryWorkAreaList(wLoginUser, "", wWorkShopID, wLineID,
        //                wParentID, wActive, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_AddStation(BMSEmployee wLoginUser, FMCStation wStation)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        FMCStationDAO.getInstance().FMC_AddStation(wLoginUser, wStation, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_SaveStation(BMSEmployee wLoginUser, FMCStation wStation)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        FMCStationDAO.getInstance().FMC_SaveStation(wLoginUser, wStation, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_DisableStation(BMSEmployee wLoginUser, FMCStation wStation)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        FMCStationDAO.getInstance().FMC_DisableStation(wLoginUser, wStation, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_ActiveStation(BMSEmployee wLoginUser, FMCStation wStation)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        FMCStationDAO.getInstance().FMC_ActiveStation(wLoginUser, wStation, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<FMCStation> FMC_QueryStation(BMSEmployee wLoginUser, int wID, String wCode)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<FMCStation> wResult = new ServiceResult<FMCStation>();
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        wResult.Result = FMCStationDAO.getInstance().FMC_QueryStation(wLoginUser, wID, wCode, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<List<FMCStation>> FMC_QueryStationList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID,
        //        int wWorkAreaID, int wActive)
        //{
        //    // TODO Auto-generated method stub
        //    ServiceResult<List<FMCStation>> wResult = new ServiceResult<List<FMCStation>>();
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        wResult.Result = FMCStationDAO.getInstance().FMC_QueryStationList(wLoginUser, "", wWorkShopID, wLineID,
        //                wWorkAreaID, wActive, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}




        public ServiceResult<Int32> FMC_AddResource(BMSEmployee wLoginUser, FMCResource wResource)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                FMCResourceDAO.getInstance().FMC_AddResource(wLoginUser, wResource, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_SaveResource(BMSEmployee wLoginUser, FMCResource wResource)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                FMCResourceDAO.getInstance().FMC_SaveResource(wLoginUser, wResource, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_DisableResource(BMSEmployee wLoginUser, FMCResource wResource)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                FMCResourceDAO.getInstance().FMC_DisableResource(wLoginUser, wResource, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_ActiveResource(BMSEmployee wLoginUser, FMCResource wResource)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                FMCResourceDAO.getInstance().FMC_ActiveResource(wLoginUser, wResource, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_DeleteResource(BMSEmployee wLoginUser, FMCResource wResource)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                FMCResourceDAO.getInstance().FMC_DeleteResource(wLoginUser, wResource, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<FMCResource> FMC_QueryResourceByID(BMSEmployee wLoginUser, int wID)
        {
            // TODO Auto-generated method stub
            ServiceResult<FMCResource> wResult = new ServiceResult<FMCResource>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCResourceDAO.getInstance().FMC_QueryResourceByID(wLoginUser, wID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<FMCResource>> FMC_QueryResourceList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID,
                int wStationID, int wAreaID, int wResourceID, int wType, int wActive)
        {
            // TODO Auto-generated method stub
            ServiceResult<List<FMCResource>> wResult = new ServiceResult<List<FMCResource>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCResourceDAO.getInstance().FMC_QueryResourceList(wLoginUser, wWorkShopID, wLineID,
                        wStationID, wAreaID, wResourceID, wType, wActive, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }



        public ServiceResult<Int32> FMC_AddStation(BMSEmployee wLoginUser, FMCStation wStation)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                FMCStationDAO.getInstance().FMC_AddStation(wLoginUser, wStation, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_SaveStation(BMSEmployee wLoginUser, FMCStation wStation)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                FMCStationDAO.getInstance().FMC_SaveStation(wLoginUser, wStation, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_DisableStation(BMSEmployee wLoginUser, FMCStation wStation)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                FMCStationDAO.getInstance().FMC_DisableStation(wLoginUser, wStation, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_ActiveStation(BMSEmployee wLoginUser, FMCStation wStation)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                FMCStationDAO.getInstance().FMC_ActiveStation(wLoginUser, wStation, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
        public ServiceResult<Int32> FMC_DeleteStation(BMSEmployee wLoginUser, FMCStation wStation)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                FMCStationDAO.getInstance().FMC_DeleteStation(wLoginUser, wStation, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<String>> FMC_SyncStationList(BMSEmployee wLoginUser, List<FMCStation> wStationList)
        {

            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                wResult.Result = new List<string>();
                if (wStationList == null || wStationList.Count <= 0)
                    return wResult;

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<FMCStation> wSourveList = FMCStationDAO.getInstance().FMC_QueryStationList(wLoginUser, "",
                        -1, -1, -1, -1, Pagination.MaxSize, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                List<BMSRegion> wRegionSourceList = BMSRegionDAO.getInstance().BMS_SelectRegionList(wLoginUser, -1, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }

                List<DMSDeviceLedger> wDeviceLedgerSourveList = DMSDeviceLedgerDAO.getInstance().DMS_SelectDeviceLedgerList(wLoginUser, -1, -1, Pagination.Create(1, int.MaxValue), wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }

                List<BMSEmployee> wEmployeeSourveList = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeAll(wLoginUser, -1, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }


                Dictionary<string, DMSDeviceLedger> wDeviceLedgerSourveDic = wDeviceLedgerSourveList.ToDictionary(p => p.Code, p => p);


                Dictionary<string, Int32> wEmployeeIDSourveDic = wEmployeeSourveList.ToDictionary(p => p.LoginID, p => p.ID);

                Dictionary<string, BMSRegion> wRegionSourveDic = wRegionSourceList.ToDictionary(p => p.Code, p => p);


                Dictionary<string, FMCStation> wSourveDic = wSourveList.ToDictionary(p => p.Code, p => p);
                int i = 0;
                foreach (FMCStation wStation in wStationList)
                {
                    i++;
                    if (wStation == null)
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}条数据不完整  !", i));
                        continue;
                    }
                    if (StringUtils.isEmpty(wStation.Code) || StringUtils.isEmpty(wStation.Name))
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}条数据不完整 Code:{1} Name:{2} !", i,
                              wStation.Code, wStation.Name));
                        continue;
                    }
                    if (wRegionSourveDic.ContainsKey(wStation.AreaCode))
                    {
                        wStation.AreaID = wRegionSourveDic[wStation.AreaCode].ID;
                    }
                    else
                    {
                        wResult.Result.Add(StringUtils.Format("Code:{0} AreaCode：{1}  Error:Area Not Found!",
                               wStation.Code, wStation.AreaCode));
                        continue;
                    }


                    if (wSourveDic.ContainsKey(wStation.Code))
                    {
                        wSourveDic[wStation.Code].Name = wStation.Name;
                        wSourveDic[wStation.Code].Active = wStation.Active;
                        wSourveDic[wStation.Code].AreaName = wStation.AreaName;
                        wSourveDic[wStation.Code].AreaCode = wStation.AreaCode;
                        wSourveDic[wStation.Code].AreaID = wStation.AreaID;
                        wSourveDic[wStation.Code].ResourceList = wStation.ResourceList;
                        wSourveDic[wStation.Code].Remark = wStation.Remark;
                        wSourveDic[wStation.Code].WorkName = wStation.WorkName;
                        FMCStationDAO.getInstance().FMC_SaveStation(wLoginUser, wSourveDic[wStation.Code], wErrorCode);
                        if (wErrorCode.Result != 0)
                        {
                            wResult.Result.Add(StringUtils.Format("Code:{0} Update Error:{1}",
                                wStation.Code, MESException.getEnumType(wErrorCode.get()).getLabel()));
                            continue;

                        }
                        wStation.ID = wSourveDic[wStation.Code].ID;
                    }
                    else
                    {
                        FMCStationDAO.getInstance().FMC_AddStation(wLoginUser, wStation, wErrorCode);

                        if (wErrorCode.Result != 0)
                        {
                            wResult.Result.Add(StringUtils.Format("Code:{0} Add Error:{1}", wStation.Code,
                                MESException.getEnumType(wErrorCode.get()).getLabel()));
                            continue;
                        }
                        if (wStation.ID > 0)
                            wSourveDic.Add(wStation.Code, wStation);
                    }

                    if (wStation.ID <= 0 || wStation.ResourceList == null || wStation.ResourceList.Count <= 0)
                    {
                        //全部禁用
                        continue;
                    }


                    FMCResourceDAO.getInstance().FMC_DeleteResource(wLoginUser, wStation.ID,
                        (int)FMCResourceType.Device, wErrorCode);
                    if (wErrorCode.Result != 0)
                    {
                        wResult.Result.Add(StringUtils.Format("Code:{0} DeleteResource Error:{1}", wStation.Code,
                            MESException.getEnumType(wErrorCode.get()).getLabel()));
                        continue;
                    }


                    foreach (FMCResource wResource in wStation.ResourceList)
                    {
                        if (wResource.Type != (int)FMCResourceType.Device)
                            continue;
                        if (!wDeviceLedgerSourveDic.ContainsKey(wResource.Code))
                        {
                            continue;
                        }
                        wResource.StationID = wStation.ID;
                        wResource.ResourceID = wDeviceLedgerSourveDic[wResource.Code].ID;

                        FMCResourceDAO.getInstance().FMC_AddResource(wLoginUser, wResource, wErrorCode);
                        if (wErrorCode.Result != 0)
                        {
                            wResult.Result.Add(StringUtils.Format("Code:{0} ResourceCode:{1} Add Resource Error:{2}", wStation.Code, wResource.Code,
                                MESException.getEnumType(wErrorCode.get()).getLabel()));
                            continue;
                        }
                    }




                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;

        }


        public ServiceResult<FMCStation> FMC_QueryStation(BMSEmployee wLoginUser, int wID, String wCode)
        {
            // TODO Auto-generated method stub
            ServiceResult<FMCStation> wResult = new ServiceResult<FMCStation>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCStationDAO.getInstance().FMC_QueryStation(wLoginUser, wID, wCode, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<FMCStation>> FMC_QueryStationList(BMSEmployee wLoginUser, int wWorkShopID, int wLineID,
                int wWorkAreaID, int wActive, Pagination wPagination)
        {
            // TODO Auto-generated method stub
            ServiceResult<List<FMCStation>> wResult = new ServiceResult<List<FMCStation>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCStationDAO.getInstance().FMC_QueryStationList(wLoginUser, "", wWorkShopID, wLineID,
                        wWorkAreaID, wActive, wPagination, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<Int32> FMC_AddWorkDay(BMSEmployee wLoginUser, FMCWorkDay wShift)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCShiftDAO.getInstance().FMC_AddWorkDay(wLoginUser, wShift, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_SaveWorkDay(BMSEmployee wLoginUser, FMCWorkDay wShift)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                wResult.Result = FMCShiftDAO.getInstance().FMC_SaveWorkDay(wLoginUser, wShift, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_DisableWorkDay(BMSEmployee wLoginUser, FMCWorkDay wShift)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCShiftDAO.getInstance().FMC_DisableWorkDay(wLoginUser, wShift, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_ActiveWorkDay(BMSEmployee wLoginUser, FMCWorkDay wShift)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCShiftDAO.getInstance().FMC_ActiveWorkDay(wLoginUser, wShift, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }



        public ServiceResult<FMCWorkDay> FMC_QueryWorkDayByID(BMSEmployee wLoginUser, int wID)
        {
            // TODO Auto-generated method stub
            ServiceResult<FMCWorkDay> wResult = new ServiceResult<FMCWorkDay>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);

                wResult.Result = FMCShiftDAO.getInstance().FMC_QueryWorkDayByID(wLoginUser, wID, wErrorCode);
                if (wResult.Result != null && wResult.Result.ID > 0)
                {
                    wResult.Result.ShiftList = FMCShiftDAO.getInstance().FMC_QueryShiftList(wLoginUser,
                            wResult.Result.ID, -1, wErrorCode);
                    if (wResult.Result.ShiftList != null && wResult.Result.ShiftList.Count > 0)
                    {

                        wResult.Result.ShiftList.Sort((o1, o2) => o1.LevelID - o2.LevelID);
                    }
                }
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<FMCWorkDay> FMC_QueryActiveWorkDay(BMSEmployee wLoginUser, int wFactoryID,
                int wWorkShopID)
        {
            // TODO Auto-generated method stub
            ServiceResult<FMCWorkDay> wResult = new ServiceResult<FMCWorkDay>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                wResult.Result = FMCShiftDAO.getInstance().FMC_QueryActiveWorkDay(wLoginUser, wFactoryID,
                        wWorkShopID, wErrorCode);
                if (wResult.Result != null && wResult.Result.ID > 0)
                {
                    wResult.Result.ShiftList = FMCShiftDAO.getInstance().FMC_QueryShiftList(wLoginUser,
                            wResult.Result.ID, 1, wErrorCode);

                    if (wResult.Result.ShiftList != null && wResult.Result.ShiftList.Count > 0)
                    {
                        wResult.Result.ShiftList.RemoveAll(p => p.Active != 1);

                        wResult.Result.ShiftList.Sort((o1, o2) => o1.LevelID - o2.LevelID);
                    }
                }

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<FMCWorkDay>> FMC_QueryWorkDayList(BMSEmployee wLoginUser, int wFactoryID,
                int wWorkShopID, int wActive)
        {
            // TODO Auto-generated method stub
            ServiceResult<List<FMCWorkDay>> wResult = new ServiceResult<List<FMCWorkDay>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCShiftDAO.getInstance().FMC_QueryWorkDayList(wLoginUser, wFactoryID,
                        wWorkShopID, wActive, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<FMCTimeZone>> FMC_QueryShiftTimeZoneList(BMSEmployee wLoginUser, int wShiftID)
        {
            // TODO Auto-generated method stub
            ServiceResult<List<FMCTimeZone>> wResult = new ServiceResult<List<FMCTimeZone>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCShiftDAO.getInstance().FMC_QueryShiftTimeZoneList(wLoginUser, wShiftID,
                        wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_SaveShiftTimeZoneList(BMSEmployee wLoginUser,
                List<FMCTimeZone> wTimeZoneList, int wShiftID)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCShiftDAO.getInstance().FMC_SaveShiftTimeZoneList(wLoginUser, wTimeZoneList,
                        wShiftID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<FMCShift>> FMC_QueryShiftList(BMSEmployee wLoginUser, int wWorkDayID, int wActive)
        {
            // TODO Auto-generated method stub
            ServiceResult<List<FMCShift>> wResult = new ServiceResult<List<FMCShift>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCShiftDAO.getInstance().FMC_QueryShiftList(wLoginUser, wWorkDayID, wActive,
                        wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_SaveShiftList(BMSEmployee wLoginUser, List<FMCShift> wShiftList)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCShiftDAO.getInstance().FMC_SaveShiftList(wLoginUser, wShiftList, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_SaveShift(BMSEmployee wLoginUser, FMCShift wShift)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCShiftDAO.getInstance().FMC_SaveShift(wLoginUser, wShift, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<FMCShift> FMC_QueryShiftByID(BMSEmployee wLoginUser, int wWorkDayID)
        {
            // TODO Auto-generated method stub
            ServiceResult<FMCShift> wResult = new ServiceResult<FMCShift>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCShiftDAO.getInstance().FMC_QueryShiftByID(wLoginUser, wWorkDayID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> FMC_DeleteShiftByID(BMSEmployee wLoginUser, int wID)
        {
            // TODO Auto-generated method stub
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                wErrorCode.set(0);
                wResult.Result = FMCShiftDAO.getInstance().FMC_DeleteShiftByID(wLoginUser, wID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        //public ServiceResult<List<FMCWorkspace>> FMC_GetFMCWorkspaceList(BMSEmployee wLoginUser, int wProductID,
        //        int wPartID, String wPartNo, int wPlaceType, int wActive)
        //{
        //    ServiceResult<List<FMCWorkspace>> wResult = new ServiceResult<List<FMCWorkspace>>();
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        wResult.Result = FMCWorkspaceDAO.getInstance().FMC_GetFMCWorkspaceList(wLoginUser, wProductID,
        //                wPartID, wPartNo, wPlaceType, wActive, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<FMCWorkspace> FMC_GetFMCWorkspace(BMSEmployee wLoginUser, int wID, String wCode)
        //{
        //    ServiceResult<FMCWorkspace> wResult = new ServiceResult<FMCWorkspace>();
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        wResult.Result = FMCWorkspaceDAO.getInstance().FMC_GetFMCWorkspace(wLoginUser, wID, wCode,
        //                wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_SaveFMCWorkspace(BMSEmployee wLoginUser, FMCWorkspace wFMCWorkspace)
        //{
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        if (wFMCWorkspace.ID <= 0)
        //        {
        //            FMCWorkspaceDAO.getInstance().FMC_AddFMCWorkspace(wLoginUser, wFMCWorkspace, wErrorCode);
        //        }
        //        else
        //        {
        //            FMCWorkspaceDAO.getInstance().FMC_EditFMCWorkspace(wLoginUser, wFMCWorkspace, wErrorCode);
        //        }
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_BindFMCWorkspace(BMSEmployee wLoginUser, FMCWorkspace wFMCWorkspace)
        //{
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);

        //        wResult.Result = FMCWorkspaceDAO.getInstance().FMC_BindFMCWorkspace(wLoginUser, wFMCWorkspace,
        //                wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.error("FMCServiceImpl FMC_BindFMCWorkspace Error:", e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<Int32> FMC_ActiveFMCWorkspace(BMSEmployee wLoginUser, int wActive,
        //        FMCWorkspace wFMCWorkspace)
        //{
        //    ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        wResult.Result = FMCWorkspaceDAO.getInstance().FMC_ActiveFMCWorkspace(wLoginUser, wActive,
        //                wFMCWorkspace, wErrorCode);
        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}


        //public ServiceResult<List<FMCWorkspaceRecord>> FMC_GetFMCWorkspaceRecordList(BMSEmployee wLoginUser,
        //        int wProductID, int wPartID, String wPartNo, int wPlaceID, int wPlaceType, int wLimit, DateTime wStartTime,
        //        DateTime wEndTime)
        //{
        //    ServiceResult<List<FMCWorkspaceRecord>> wResult = new ServiceResult<List<FMCWorkspaceRecord>>();
        //    try
        //    {
        //        OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
        //        wErrorCode.set(0);
        //        wResult.Result = FMCWorkspaceDAO.getInstance().FMC_GetFMCWorkspaceRecordList(wLoginUser,
        //                wProductID, wPartID, wPartNo, wPlaceID, wPlaceType, wStartTime, wEndTime, wLimit, wErrorCode);

        //        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

        //    }
        //    catch (Exception e)
        //    {
        //        logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
        //    }
        //    return wResult;
        //}

        public ServiceResult<Int32> FMC_QueryShiftID(BMSEmployee wLoginUser, int wWorkShopID, DateTime wShiftTime,
                int wShifts, OutResult<Int32> wShiftIndex)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                wResult.Result = MESServer.MES_QueryShiftID(wWorkShopID, wShiftTime, wShiftIndex);
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }
    }
}
