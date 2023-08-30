using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{


    public class BMSServiceImpl : BMSService
    {


        private static log4net.ILog logger = log4net.LogManager.GetLogger(typeof(BMSServiceImpl));

        private static BMSService Instance = null;

        public static BMSService getInstance()
        {
            if (Instance == null)
                Instance = new BMSServiceImpl();

            return Instance;
        }


        public ServiceResult<BMSEmployee> BMS_LoginEmployee(String wLoginName, String wPassword, long wMAC)
        {
            ServiceResult<BMSEmployee> wResult = new ServiceResult<BMSEmployee>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSEmployeeDAO.getInstance().BMS_LoginEmployee(wLoginName, wPassword, wMAC, wErrorCode);

                // 更新在线时间
                BMSEmployeeDAO.getInstance().BMS_UpdateOnline(wResult.Result, wErrorCode);

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<BMSEmployee> BMS_LoginEmployeeByUserName(String wUserName, String wPassword)
        {
            ServiceResult<BMSEmployee> wResult = new ServiceResult<BMSEmployee>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSEmployeeDAO.getInstance().BMS_LoginEmployeeByUserName(wUserName, wPassword, wErrorCode);

                if (wResult.Result == null || wResult.Result.ID <= 0)
                {
                    //调用ERP登录接口
                }
                if (wResult.Result != null && wResult.Result.ID > 0)
                {
                    // 更新在线时间
                    BMSEmployeeDAO.getInstance().BMS_UpdateOnline(wResult.Result, wErrorCode);
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<BMSEmployee> BMS_LoginEmployeeByToken(String wLoginName, String wToken)
        {
            ServiceResult<BMSEmployee> wResult = new ServiceResult<BMSEmployee>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSEmployeeDAO.getInstance().BMS_LoginEmployeeByToken(wLoginName, wToken, wErrorCode);
                // wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();
                BMSEmployeeDAO.getInstance().BMS_UpdateOnline(wResult.Result, wErrorCode);
            }
            catch (Exception e)
            {

                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<BMSEmployee> BMS_LoginEmployeeByOne(String wLoginID)
        {
            ServiceResult<BMSEmployee> wResult = new ServiceResult<BMSEmployee>(new BMSEmployee());
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);

                wResult.Result = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeByLoginID(BaseDAO.SysAdmin, wLoginID, wErrorCode);

                wResult.Result.LoginName = DesUtil.encrypt(wResult.Result.LoginName, BaseDAO.appSecret);

                BMSEmployeeDAO.getInstance().BMS_UpdateOnline(wResult.Result, wErrorCode);
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<BMSEmployee>> BMS_QueryEmployeeList(BMSEmployee wLoginUser, String wName, int wDepartmentID,
                int wPosition, int wDepartmentType, int wPositionType, int wRoleID, int wActive, Pagination wPagination)
        {
            ServiceResult<List<BMSEmployee>> wResult = new ServiceResult<List<BMSEmployee>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeList(wLoginUser, wName, wDepartmentID, wPosition,
                        wDepartmentType, wPositionType, wRoleID, wActive, wPagination, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<BMSEmployee>> BMS_QueryEmployeeList(BMSEmployee wLoginUser, List<Int32> wIDList)
        {
            ServiceResult<List<BMSEmployee>> wResult = new ServiceResult<List<BMSEmployee>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeList(wLoginUser, wIDList, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Dictionary<Int32, BMSEmployee>> BMS_QueryEmployeeDic()
        {
            ServiceResult<Dictionary<Int32, BMSEmployee>> wResult = new ServiceResult<Dictionary<Int32, BMSEmployee>>(
                    new Dictionary<Int32, BMSEmployee>());
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);

                List<BMSEmployee> wBMSEmployeeList = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeAll(BaseDAO.SysAdmin, -1, wErrorCode);
                wResult.Result = wBMSEmployeeList.ToDictionary(p => p.ID, p => p);

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<BMSEmployee> BMS_QueryEmployeeByID(BMSEmployee wLoginUser, int wID)
        {
            ServiceResult<BMSEmployee> wResult = new ServiceResult<BMSEmployee>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeByID(wLoginUser, wID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> BMS_AddEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);

                BMSEmployeeDAO.getInstance().BMS_AddEmployee(wLoginUser, wEmployee, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                if (StringUtils.isNotEmpty(wResult.FaultCode))
                {
                    return wResult;
                }
                List<BMSRole> wBMSRoleList = BMSRoleDAO.getInstance().BMS_GetRoleList(wLoginUser, "", -1, wEmployee.ID, 1, Pagination.MaxSize, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                if (StringUtils.isNotEmpty(wResult.FaultCode))
                {
                    return wResult;
                }
                if (wEmployee.RoleIDList == null)
                {
                    wEmployee.RoleIDList = new List<int>();
                }
                wEmployee.RoleIDList = wEmployee.RoleIDList.Distinct().ToList();
                //原来的角色
                List<int> wRoleIDList = wBMSRoleList.Select(p => p.ID).Distinct().ToList();

                if (wRoleIDList.Count == wEmployee.RoleIDList.Count)
                {
                    wRoleIDList.RemoveAll(p => wEmployee.RoleIDList.Contains(p));
                    if (wRoleIDList.Count == 0)
                    {
                        return wResult;
                    }
                }
                List<BMSRoleItem> wBMSRoleItemList = new List<BMSRoleItem>();

                foreach (int wRoleID in wEmployee.RoleIDList)
                {
                    wBMSRoleItemList.Add(new BMSRoleItem() { UserID = wEmployee.ID, RoleID = wRoleID });
                }
                BMSRoleDAO.getInstance().BMS_SaveRoleUserListByUser(wLoginUser, wEmployee.ID, wBMSRoleItemList, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }

            return wResult;
        }



        public ServiceResult<List<String>> BMS_SyncEmployeeList(BMSEmployee wLoginUser, List<BMSEmployee> wEmployeeList)
        {
            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                wResult.Result = new List<string>();
                if (wEmployeeList == null || wEmployeeList.Count <= 0)
                    return wResult;

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<BMSEmployee> wSourveList = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeAll(wLoginUser, -1, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }

                List<BMSDepartment> wDepartmentSourceList = BMSDepartmentDAO.getInstance().BMS_QueryDepartmentList(wLoginUser, -1, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                List<BMSRole> wBMSRoleList = BMSRoleDAO.getInstance().BMS_GetRoleList(wLoginUser, "", -1, -1, -1, Pagination.MaxSize, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                Dictionary<string, BMSDepartment> wDepartmentSourveDic = wDepartmentSourceList.ToDictionary(p => p.Code, p => p);
                Dictionary<string, BMSRole> wRoleSourveDic = wBMSRoleList.ToDictionary(p => p.Code, p => p);
                Dictionary<string, int> wRoleIDDic = wBMSRoleList.ToDictionary(p => p.Code, p => p.ID);


                Dictionary<string, BMSEmployee> wSourveDic = wSourveList.ToDictionary(p => p.LoginID, p => p);
                List<BMSRoleItem> wBMSRoleItemList = new List<BMSRoleItem>();
                int i = 0;
                foreach (BMSEmployee wEmployee in wEmployeeList)
                {
                    i++;
                    if (wEmployee == null)
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}条数据不完整  !", i));
                        continue;
                    }
                    if (StringUtils.isEmpty(wEmployee.LoginID) || StringUtils.isEmpty(wEmployee.Name))
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}条数据不完整 LoginID:{1} Name:{2} !", i,
                               wEmployee.LoginID, wEmployee.Name));
                        continue;
                    }


                    if (wDepartmentSourveDic.ContainsKey(wEmployee.DepartmentCode))
                    {
                        wEmployee.DepartmentID = wDepartmentSourveDic[wEmployee.DepartmentCode].ID;
                    }
                    else
                    {
                        wResult.Result.Add(StringUtils.Format("Code:{0} DepartmentCode:{1} Error:Department Not Found!",
                               wEmployee.LoginID, wEmployee.DepartmentCode));
                        continue;
                    }
                    wEmployee.RoleIDList = StringUtils.parseIntList(wEmployee.RoleCode, wRoleIDDic);

                    if (wSourveDic.ContainsKey(wEmployee.LoginID))
                    {
                        wSourveDic[wEmployee.LoginID].Name = wEmployee.Name;
                        wSourveDic[wEmployee.LoginID].Password = wEmployee.Password;

                        wSourveDic[wEmployee.LoginID].DepartmentCode = wEmployee.DepartmentCode;
                        wSourveDic[wEmployee.LoginID].Department = wEmployee.Department;
                        wSourveDic[wEmployee.LoginID].Phone = wEmployee.Phone;
                        wSourveDic[wEmployee.LoginID].Email = wEmployee.Email;
                        wSourveDic[wEmployee.LoginID].RoleCode = wEmployee.RoleCode;
                        wSourveDic[wEmployee.LoginID].RoleName = wEmployee.RoleName;
                        if (StringUtils.isNotEmpty(wEmployee.FaceIcon))
                            wSourveDic[wEmployee.LoginID].FaceIcon = wEmployee.FaceIcon;

                        wSourveDic[wEmployee.LoginID].Active = wEmployee.Active;

                        BMSEmployeeDAO.getInstance().BMS_SaveEmployee(wLoginUser, wSourveDic[wEmployee.LoginID], wErrorCode);

                    }
                    else
                    {

                        BMSEmployeeDAO.getInstance().BMS_AddEmployee(wLoginUser, wEmployee, wErrorCode);

                    }
                    if (wEmployee.ID > 0 && !wSourveDic.ContainsKey(wEmployee.LoginID))
                        wSourveDic.Add(wEmployee.LoginID, wEmployee);
                    if (wErrorCode.Result != 0)
                    {
                        wResult.Result.Add(StringUtils.Format("LoginID:{0}  Error:{1}", wEmployee.LoginID,
                            MESException.getEnumType(wErrorCode.get()).getLabel()));
                        continue;
                    }

                    wBMSRoleItemList.Clear();
                    foreach (int wRoleID in wEmployee.RoleIDList)
                    {
                        wBMSRoleItemList.Add(new BMSRoleItem() { UserID = wEmployee.ID, RoleID = wRoleID });
                    }
                    BMSRoleDAO.getInstance().BMS_SaveRoleUserListByUser(wLoginUser, wEmployee.ID, wBMSRoleItemList, wErrorCode);
                    if (wErrorCode.Result != 0)
                    {
                        wResult.Result.Add(StringUtils.Format("LoginID:{0} RoleCode:{1} Update Error:{2}", wEmployee.LoginID, wEmployee.RoleCode,
                            MESException.getEnumType(wErrorCode.get()).getLabel()));
                        continue;
                    }
                }


            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> BMS_SetEngineerUserList(List<BMSEmployee> wEngineerUserList)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            BMSEmployeeDAO.SetEngineerUserList(wEngineerUserList);

            return wResult;
        }

        public ServiceResult<List<BMSEmployee>> BMS_GetEngineerUserList()
        {
            ServiceResult<List<BMSEmployee>> wResult = new ServiceResult<List<BMSEmployee>>();
            wResult.Result = BMSEmployeeDAO.GetEngineerUserList();

            return wResult;
        }

        public ServiceResult<Int32> BMS_GetMinEngineerUserID()
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            wResult.Result = BMSEmployeeDAO.EngineerUserIDMin;

            return wResult;
        }
        public ServiceResult<String> BMS_GetDefaultPassword()
        {
            ServiceResult<String> wResult = new ServiceResult<String>("");
            wResult.Result = BMSEmployeeDAO.defaultPassword;

            return wResult;
        }


        public ServiceResult<Int32> BMS_AutoSetEmployeeSuperior(BMSEmployee wLoginUser, List<BMSEmployee> wEmployeeList,
                List<Int32> wDutyOrders)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();

            try
            {

                if (wDutyOrders == null || wEmployeeList == null || wEmployeeList.Count <= 0 || wDutyOrders.Count <= 0)
                    return wResult;

                wErrorCode.set(0);
                int wIndex = -1;
                int wParentDuty = 0;
                int wDepartmentID = 0;
                List<BMSPosition> wBMSPositionAllList = BMSPositionDAO.getInstance().BMS_QueryPositionList(wLoginUser, 1,
                        wErrorCode);
                List<BMSDepartment> wBMSDepartmentList = BMSDepartmentDAO.getInstance().BMS_QueryDepartmentList(wLoginUser, 1,
                        wErrorCode);
                Dictionary<Int32, BMSPosition> wBMSPositionDic = wBMSPositionAllList.ToDictionary(p => p.ID, p => p);

                Dictionary<Int32, BMSDepartment> wBMSDepartmentDic = wBMSDepartmentList.ToDictionary(p => p.ID, p => p);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

                foreach (BMSEmployee wEmployee in wEmployeeList)
                {

                    wEmployee.DutyID = wBMSPositionDic.ContainsKey(wEmployee.Position)
                            ? wBMSPositionDic[wEmployee.Position].DutyID
                            : wEmployee.DutyID;

                    wIndex = wDutyOrders.IndexOf(wEmployee.DutyID);

                    wParentDuty = wDutyOrders[0];

                    if (wIndex == 0)
                    {
                        if (wBMSDepartmentDic.ContainsKey(wEmployee.DepartmentID))
                        {
                            wDepartmentID = wBMSDepartmentDic[wEmployee.DepartmentID].ParentID;
                        }
                        else
                        {
                            wDepartmentID = 0;
                            continue;
                        }

                    }
                    else
                    {
                        wDepartmentID = wEmployee.DepartmentID;
                    }
                    wErrorCode.set(0);
                    this.BMS_GetSuperior(wLoginUser, wEmployee, wDepartmentID, wParentDuty, wDutyOrders,
                            wBMSPositionAllList, wEmployeeList, wBMSDepartmentDic, wErrorCode);
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    if (wEmployee.SuperiorID > 0 && wEmployee.ID > 0)
                    {
                        BMSEmployeeDAO.getInstance().BMS_SaveEmployeeSuperiorID(wLoginUser, wEmployee, wErrorCode);
                        wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    }
                }

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }

            return wResult;
        }

        private void BMS_GetSuperiorNext(BMSEmployee wLoginUser, BMSEmployee wEmployee, int wDepartmentID, int wParentDuty,
                List<Int32> wDutyOrders, List<BMSPosition> wBMSPositionAllList, List<BMSEmployee> wEmployeeList, Dictionary<Int32, BMSDepartment> wBMSDepartmentDic, OutResult<Int32> wErrorCode)
        {

            if (wErrorCode.Result != 0)
                return;

            int wIndex = wDutyOrders.IndexOf(wParentDuty);
            if (wIndex < 0)
            {
                return;
            }

            if (wIndex == 0)
            {
                if (wDepartmentID != wEmployee.DepartmentID)
                {
                    if (wDutyOrders.Count <= wIndex + 1)
                        return;
                    wParentDuty = wDutyOrders[wIndex + 1];
                }
                else
                {
                    if (wDutyOrders.Count <= wIndex + 1 || wEmployee.DutyID == wDutyOrders[wIndex + 1])
                    {
                        wParentDuty = wDutyOrders[0];
                        wDepartmentID = wBMSDepartmentDic.ContainsKey(wDepartmentID) ? wBMSDepartmentDic[wDepartmentID].ParentID : 0;


                    }
                    else
                    {
                        wParentDuty = wDutyOrders[wIndex + 1];
                    }
                }

            }
            else
            {
                if (wDepartmentID != wEmployee.DepartmentID)
                {
                    if (wDutyOrders.Count <= wIndex + 1)
                        return;
                    wParentDuty = wDutyOrders[wIndex + 1];
                }
                else
                {

                    if (wDutyOrders.Count <= wIndex + 1 || wEmployee.DutyID == wDutyOrders[wIndex + 1])
                    {
                        wParentDuty = wDutyOrders[0];
                        wDepartmentID = wBMSDepartmentDic.ContainsKey(wDepartmentID) ? wBMSDepartmentDic[wDepartmentID].ParentID : 0;

                    }
                    else
                    {
                        wParentDuty = wDutyOrders[wIndex + 1];
                    }
                }
            }

            this.BMS_GetSuperior(wLoginUser, wEmployee, wDepartmentID, wParentDuty, wDutyOrders, wBMSPositionAllList, wEmployeeList, wBMSDepartmentDic,
                    wErrorCode);
        }

        private void BMS_GetSuperior(BMSEmployee wLoginUser, BMSEmployee wEmployee, int wDepartmentID, int wParentDuty,
                List<Int32> wDutyOrders, List<BMSPosition> wBMSPositionAllList, List<BMSEmployee> wBMSEmployeeList, Dictionary<Int32, BMSDepartment> wBMSDepartmentDic, OutResult<Int32> wErrorCode)
        {

            if (wErrorCode.Result != 0)
                return;

            if (wLoginUser == null || wEmployee == null || wDepartmentID <= 0 || wParentDuty <= 0 || wDutyOrders == null
                    || wDutyOrders.Count <= 0 || wBMSPositionAllList == null || wBMSPositionAllList.Count <= 0)
                return;

            List<Int32> wBMSPositionTemp = wBMSPositionAllList.FindAll(p => p.DutyID == wParentDuty && p.DepartmentID == wDepartmentID).Select(p => p.ID).ToList();

            if (wBMSPositionTemp == null || wBMSPositionTemp.Count <= 0)
            {
                BMS_GetSuperiorNext(wLoginUser, wEmployee, wDepartmentID, wParentDuty, wDutyOrders, wBMSPositionAllList, wBMSEmployeeList, wBMSDepartmentDic,
                        wErrorCode);
                return;
            }
            wBMSEmployeeList = wBMSEmployeeList.FindAll(p => p.DepartmentID == wDepartmentID && p.Active == 1 && wBMSPositionTemp.Contains(p.Position)).ToList();


            if (wBMSEmployeeList == null || wBMSEmployeeList.Count <= 0)
            {
                BMS_GetSuperiorNext(wLoginUser, wEmployee, wDepartmentID, wParentDuty, wDutyOrders, wBMSPositionAllList, wBMSEmployeeList, wBMSDepartmentDic,
                        wErrorCode);
                return;
            }

            wEmployee.SuperiorID = wBMSEmployeeList[0].ID;

        }


        public ServiceResult<Int32> BMS_GetEmployeeSuperior(BMSEmployee wLoginUser, BMSEmployee wEmployee,
                List<Int32> wDutyOrders, List<BMSPosition> wBMSPositionAllList, List<BMSEmployee> wBMSEmployeeList,
                Dictionary<Int32, BMSDepartment> wBMSDepartmentDic)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

            try
            {

                if (wDutyOrders == null || wDutyOrders.Count <= 0)
                    return wResult;

                int wDepartmentID = wEmployee.DepartmentID;

                if (wBMSPositionAllList == null || wBMSPositionAllList.Count <= 0)
                {
                    wBMSPositionAllList = BMSPositionDAO.getInstance().BMS_QueryPositionList(wLoginUser, 1, wErrorCode);
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

                }

                Dictionary<Int32, BMSPosition> wBMSPositionDic = wBMSPositionAllList.ToDictionary(p => p.ID, p => p);

                if (wBMSEmployeeList == null || wBMSEmployeeList.Count <= 0)
                {
                    wBMSEmployeeList = BMSEmployeeDAO.getInstance().BMS_QueryEmployeeAll(wLoginUser, -1, wErrorCode);
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                }

                if (wBMSDepartmentDic == null || wBMSDepartmentDic.Count <= 0)
                {
                    wBMSDepartmentDic = BMSDepartmentDAO.getInstance().BMS_QueryDepartmentList(wLoginUser, -1, wErrorCode).ToDictionary(p => p.ID, p => p);
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                }


                wEmployee.DutyID = wBMSPositionDic.ContainsKey(wEmployee.Position)
                        ? wBMSPositionDic[wEmployee.Position].DutyID
                        : wEmployee.DutyID;

                int wIndex = wDutyOrders.IndexOf(wEmployee.DutyID);

                int wParentDuty = wDutyOrders[0];

                if (wIndex == 0)
                {
                    wDepartmentID = wBMSDepartmentDic.ContainsKey(wEmployee.DepartmentID) ? wBMSDepartmentDic[wEmployee.DepartmentID].ParentID : 0;
                }
                wErrorCode.set(0);
                this.BMS_GetSuperior(wLoginUser, wEmployee, wDepartmentID, wParentDuty, wDutyOrders, wBMSPositionAllList, wBMSEmployeeList, wBMSDepartmentDic,
                        wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }

            return wResult;
        }


        public ServiceResult<Int32> BMS_SaveEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                BMSEmployeeDAO.getInstance().BMS_SaveEmployee(wLoginUser, wEmployee, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                if (StringUtils.isNotEmpty(wResult.FaultCode))
                {
                    return wResult;
                }
                List<BMSRole> wBMSRoleList = BMSRoleDAO.getInstance().BMS_GetRoleList(wLoginUser, "", -1, wEmployee.ID, 1, Pagination.MaxSize, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                if (StringUtils.isNotEmpty(wResult.FaultCode))
                {
                    return wResult;
                }
                if (wEmployee.RoleIDList == null)
                {
                    wEmployee.RoleIDList = new List<int>();
                }
                wEmployee.RoleIDList = wEmployee.RoleIDList.Distinct().ToList();
                //原来的角色
                List<int> wRoleIDList = wBMSRoleList.Select(p => p.ID).Distinct().ToList();

                if (wRoleIDList.Count == wEmployee.RoleIDList.Count)
                {
                    wRoleIDList.RemoveAll(p => wEmployee.RoleIDList.Contains(p));
                    if (wRoleIDList.Count == 0)
                    {
                        return wResult;
                    }
                }
                List<BMSRoleItem> wBMSRoleItemList = new List<BMSRoleItem>();

                foreach (int wRoleID in wEmployee.RoleIDList)
                {
                    wBMSRoleItemList.Add(new BMSRoleItem() { UserID = wEmployee.ID, RoleID = wRoleID });
                }
                BMSRoleDAO.getInstance().BMS_SaveRoleUserListByUser(wLoginUser, wEmployee.ID, wBMSRoleItemList, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                wResult.FaultCode += e.ToString();
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> BMS_SavePassword(BMSEmployee wLoginUser, BMSEmployee wEmployee)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSEmployeeDAO.getInstance().BMS_SavePassword(wLoginUser, wEmployee, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<Int32> BMS_DisableEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSEmployeeDAO.getInstance().BMS_DisableEmployee(wLoginUser, wEmployee, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<Int32> BMS_DeleteEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSEmployeeDAO.getInstance().BMS_DeleteEmployee(wLoginUser, wEmployee, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<Int32> BMS_ActiveEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSEmployeeDAO.getInstance().BMS_ActiveEmployee(wLoginUser, wEmployee, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<Int32> BMS_ResetPassword(BMSEmployee wLoginUser, BMSEmployee wEmployee)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSEmployeeDAO.getInstance().BMS_ResetPassword(wLoginUser, wEmployee, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }

            return wResult;
        }



        public ServiceResult<BMSRole> BMS_AddRole(BMSEmployee wLoginUser, BMSRole wRole)
        {
            ServiceResult<BMSRole> wResult = new ServiceResult<BMSRole>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                BMSRoleDAO.getInstance().BMS_AddRole(wLoginUser, wRole, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<BMSRole>> BMS_GetRoleList(BMSEmployee wLoginUser, String wName, int wDepartmentID, int wUserID, int wActive, Pagination wPagination)
        {
            ServiceResult<List<BMSRole>> wResult = new ServiceResult<List<BMSRole>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSRoleDAO.getInstance().BMS_GetRoleList(wLoginUser, wName, wDepartmentID, wUserID, wActive, wPagination, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> BMS_RemoveRole(BMSEmployee wLoginUser, int wID)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                if (wID <= 0)
                {
                    return wResult;
                }
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                BMSRoleDAO.getInstance().BMS_RemoveRole(wLoginUser, wID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> BMS_SaveRole(BMSEmployee wLoginUser, BMSRole wRole)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                BMSRoleDAO.getInstance().BMS_SaveRole(wLoginUser, wRole, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<String>> BMS_SyncRoleList(BMSEmployee wLoginUser, List<BMSRole> wRoleList)
        {
            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                wResult.Result = new List<string>();
                if (wRoleList == null || wRoleList.Count <= 0)
                    return wResult;

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<BMSRole> wSourveList = BMSRoleDAO.getInstance().BMS_GetRoleList(wLoginUser, "", -1, -1, -1, Pagination.MaxSize, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                List<BMSDepartment> wDepartmentSourceList = BMSDepartmentDAO.getInstance().BMS_QueryDepartmentList(wLoginUser, -1, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                Dictionary<string, BMSDepartment> wDepartmentSourveDic = wDepartmentSourceList.ToDictionary(p => p.Code, p => p);

                Dictionary<string, BMSRole> wSourveDic = wSourveList.ToDictionary(p => p.Code, p => p);
                int i = 0;
                foreach (BMSRole wRole in wRoleList)
                {
                    i++;

                    if (wRole == null)
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}条数据不完整  !", i));
                        continue;
                    }
                    if (StringUtils.isEmpty(wRole.Code) || StringUtils.isEmpty(wRole.Name))
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}条数据不完整 Code:{1} Name:{2} !", i,
                           wRole.Code, wRole.Name));
                        continue;
                    }

                    if (wDepartmentSourveDic.ContainsKey(wRole.DepartmentCode))
                    {
                        wRole.DepartmentID = wDepartmentSourveDic[wRole.DepartmentCode].ID;
                    }
                    else
                    {
                        wResult.Result.Add(StringUtils.Format("Code:{0} DepartmentCode：{1}  Error:Department Not Found!",
                               wRole.Code, MESException.getEnumType(wErrorCode.get()).getLabel()));
                        continue;
                    }
                    if (wSourveDic.ContainsKey(wRole.Code))
                    {
                        wSourveDic[wRole.Code].Name = wRole.Name;
                        wSourveDic[wRole.Code].Active = wRole.Active;
                        wSourveDic[wRole.Code].DepartmentCode = wRole.DepartmentCode;
                        wSourveDic[wRole.Code].DepartmentName = wRole.DepartmentName;
                        wSourveDic[wRole.Code].DepartmentID = wRole.DepartmentID;
                        wSourveDic[wRole.Code].Remark = wRole.Remark;

                        BMSRoleDAO.getInstance().BMS_SaveRole(wLoginUser, wSourveDic[wRole.Code], wErrorCode);
                        if (wErrorCode.Result != 0)
                        {
                            wResult.Result.Add(StringUtils.Format("Code:{0} Update Error:{1}",
                                wRole.Code, MESException.getEnumType(wErrorCode.get()).getLabel()));

                        }
                        continue;
                    }

                    BMSRoleDAO.getInstance().BMS_AddRole(wLoginUser, wRole, wErrorCode);
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

                    if (wErrorCode.Result != 0)
                    {
                        wResult.Result.Add(StringUtils.Format("Code:{0} Add Error:{1}", wRole.Code,
                            MESException.getEnumType(wErrorCode.get()).getLabel()));
                    }
                    if (wRole.ID > 0)
                        wSourveDic.Add(wRole.Code, wRole);
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<Int32> BMS_SaveRoleRangeList(BMSEmployee wLoginUser, int wRoleID,
                List<BMSRoleItem> wFunctionList)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSRoleDAO.getInstance().BMS_SaveRoleRangeList(wLoginUser, wRoleID, wFunctionList,
                        wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> BMS_SaveRoleFunctionList(BMSEmployee wLoginUser, int wRoleID,
                List<BMSRoleItem> wFunctionList)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSRoleDAO.getInstance().BMS_SaveRoleFunctionList(wLoginUser, wRoleID, wFunctionList,
                    wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<Int32> BMS_SaveRoleUserList(BMSEmployee wLoginUser, int wRoleID,
                List<BMSRoleItem> wUserList)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSRoleDAO.getInstance().BMS_SaveRoleUserList(wLoginUser, wRoleID, wUserList, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<List<BMSRoleItem>> BMS_QueryRangeListByRoleID(BMSEmployee wLoginUser, int wRoleID)
        {
            ServiceResult<List<BMSRoleItem>> wResult = new ServiceResult<List<BMSRoleItem>>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSRoleDAO.getInstance().BMS_QueryRangeListByRoleID(wLoginUser, wRoleID, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<List<BMSRoleItem>> BMS_QueryRangeListByOperatorID(BMSEmployee wLoginUser, int wOperatorID,
                int wFunctionID)
        {
            ServiceResult<List<BMSRoleItem>> wResult = new ServiceResult<List<BMSRoleItem>>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSRoleDAO.getInstance().BMS_QueryRangeList(wLoginUser, wOperatorID, wFunctionID, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<List<BMSRoleItem>> BMS_QueryFunctionListByRoleID(BMSEmployee wLoginUser, int wRoleID)
        {
            ServiceResult<List<BMSRoleItem>> wResult = new ServiceResult<List<BMSRoleItem>>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSRoleDAO.getInstance().BMS_QueryFunctionListByRoleID(wLoginUser, wRoleID, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<List<BMSRoleItem>> BMS_GetFunctionListByLoginID(BMSEmployee wLoginUser, int wUserID)
        {
            ServiceResult<List<BMSRoleItem>> wResult = new ServiceResult<List<BMSRoleItem>>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSRoleDAO.getInstance().BMS_QueryFunctionListByLoginID(wLoginUser, wUserID, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<List<BMSRoleItem>> BMS_QueryUserListByFunctionID(BMSEmployee wLoginUser, int wFunctionID)
        {
            ServiceResult<List<BMSRoleItem>> wResult = new ServiceResult<List<BMSRoleItem>>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSRoleDAO.getInstance().BMS_QueryUserListByFunctionID(wLoginUser, wFunctionID, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<List<BMSRoleItem>> BMS_QueryUserListByPath(BMSEmployee wLoginUser, String wPath)
        {
            ServiceResult<List<BMSRoleItem>> wResult = new ServiceResult<List<BMSRoleItem>>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSRoleDAO.getInstance().BMS_QueryUserListByPath(wLoginUser, wPath, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<List<BMSRoleItem>> BMS_QueryUserListByRoleID(BMSEmployee wLoginUser, int wRoleID)
        {
            ServiceResult<List<BMSRoleItem>> wResult = new ServiceResult<List<BMSRoleItem>>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSRoleDAO.getInstance().BMS_QueryUserListByRoleID(wLoginUser, wRoleID, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<Int32> BMS_DisableRole(BMSEmployee wLoginUser, int wID)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSRoleDAO.getInstance().BMS_DisableRole(wLoginUser, wID, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<Int32> BMS_ActiveRole(BMSEmployee wLoginUser, int wID)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSRoleDAO.getInstance().BMS_ActiveRole(wLoginUser, wID, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }

        public ServiceResult<Boolean> BMS_CheckPowerByLoginID(int wCompanyID, int wLoginID, String wPath, int wRangeID,
               int wRangeType)
        {
            ServiceResult<Boolean> wResult = new ServiceResult<Boolean>(true);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSRoleDAO.getInstance().BMS_CheckPowerByLoginID(wCompanyID, wLoginID, wPath,
                        (BMSRange)wRangeType, wRangeID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }

            return wResult;
        }


        public ServiceResult<Boolean> BMS_CheckPowerByLoginID(int wCompanyID, int wLoginID, int wAuthorityID, int wRangeID,
                int wRangeType)
        {
            ServiceResult<Boolean> wResult = new ServiceResult<Boolean>(true);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSRoleDAO.getInstance().BMS_CheckPowerByLoginID(wCompanyID, wLoginID, wAuthorityID,
                        (BMSRange)wRangeType, wRangeID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }

            return wResult;
        }


        public ServiceResult<BMSRoleItem> BMS_UpdateFunctionNodeTree(BMSEmployee wLoginUser, BMSRoleItem wBMSRoleItem)
        {
            ServiceResult<BMSRoleItem> wResult = new ServiceResult<BMSRoleItem>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                BMSRoleDAO.getInstance().BMS_UpdateFunctionNodeTree(wLoginUser, wBMSRoleItem, wErrorCode);
                wResult.Result = wBMSRoleItem;
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> BMS_ActiveFunctionNodeTree(BMSEmployee wLoginUser, List<Int32> wFunctionIDList,
                int wActive)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                BMSRoleDAO.getInstance().BMS_ActiveFunctionNodeTree(wLoginUser, wFunctionIDList, wActive, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> BMS_DeleteFunctionNodeTree(BMSEmployee wLoginUser, List<Int32> wFunctionIDList)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);
                BMSRoleDAO.getInstance().BMS_DeleteFunctionNodeTree(wLoginUser, wFunctionIDList, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<BMSRoleItem>> BMS_GetFunctionNodeTree(BMSEmployee wLoginUser, int wActive)
        {
            ServiceResult<List<BMSRoleItem>> wResult = new ServiceResult<List<BMSRoleItem>>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSRoleDAO.getInstance().BMS_GetFunctionNodeTree(wLoginUser, 0, wActive, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<Int32> BMS_AddPosition(BMSEmployee wLoginUser, BMSPosition wPosition)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSPositionDAO.getInstance().BMS_AddPosition(wLoginUser, wPosition, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<Int32> BMS_SavePosition(BMSEmployee wLoginUser, BMSPosition wPosition)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSPositionDAO.getInstance().BMS_SavePosition(wLoginUser, wPosition, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<Int32> BMS_ActivePositionByID(BMSEmployee wLoginUser, int wID)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSPositionDAO.getInstance().BMS_ActivePositionByID(wLoginUser, wID, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<Int32> BMS_DisablePositionByID(BMSEmployee wLoginUser, int wID)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            wResult.Result = BMSPositionDAO.getInstance().BMS_DisablePositionByID(wLoginUser, wID, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<Int32> BMS_DeletePositionByID(BMSEmployee wLoginUser, int wID)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();

            OutResult<Int32> wErrorCode = new OutResult<Int32>();
            wErrorCode.set(0);
            BMSPositionDAO.getInstance().BMS_DeletePositionByID(wLoginUser, wID, wErrorCode);
            wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

            return wResult;
        }


        public ServiceResult<List<BMSPosition>> BMS_QueryPositionList(BMSEmployee wLoginUser, String wName, int wDepartmentID, int wActive, Pagination wPagination)
        {
            ServiceResult<List<BMSPosition>> wResult = new ServiceResult<List<BMSPosition>>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSPositionDAO.getInstance().BMS_QueryPositionList(wLoginUser, wName, wDepartmentID, wActive, wPagination, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<BMSPosition> BMS_QueryPositionByID(BMSEmployee wLoginUser, int wID, String wCode)
        {
            ServiceResult<BMSPosition> wResult = new ServiceResult<BMSPosition>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSPositionDAO.getInstance().BMS_QueryPositionByID(wLoginUser, wID, wCode, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> BMS_AddDepartment(BMSEmployee wLoginUser, BMSDepartment wDepartment)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                BMSDepartmentDAO.getInstance().BMS_AddDepartment(wLoginUser, wDepartment, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> BMS_SaveDepartment(BMSEmployee wLoginUser, BMSDepartment wDepartment)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                BMSDepartmentDAO.getInstance().BMS_SaveDepartment(wLoginUser, wDepartment, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<List<String>> BMS_SyncDepartmentList(BMSEmployee wLoginUser, List<BMSDepartment> wDepartmentList)
        {
            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                wResult.Result = new List<string>();
                if (wDepartmentList == null || wDepartmentList.Count <= 0)
                    return wResult;

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<BMSDepartment> wSourveList = BMSDepartmentDAO.getInstance().BMS_QueryDepartmentList(wLoginUser, -1, wErrorCode);

                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }

                List<BMSDepartment> wParentNoFoundList = new List<BMSDepartment>();

                Dictionary<string, BMSDepartment> wSourveDic = wSourveList.ToDictionary(p => p.Code, p => p);
                int i = 0;
                foreach (BMSDepartment wDepartment in wDepartmentList)
                {
                    i++;
                    if (wDepartment == null)
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}条数据不完整  !", i));
                        continue;
                    }
                    if (StringUtils.isEmpty(wDepartment.Code) || StringUtils.isEmpty(wDepartment.Name))
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}条数据不完整 Code:{1} Name:{2} !", i,
                             wDepartment.Code, wDepartment.Name));
                        continue;
                    }

                    if (wSourveDic.ContainsKey(wDepartment.Code))
                    {
                        wSourveDic[wDepartment.Code].Name = wDepartment.Name;
                        wSourveDic[wDepartment.Code].Active = wDepartment.Active;
                        wSourveDic[wDepartment.Code].ParentCode = wDepartment.ParentCode;
                        if (wSourveDic.ContainsKey(wDepartment.ParentCode))
                        {
                            wSourveDic[wDepartment.Code].ParentID = wSourveDic[wDepartment.ParentCode].ID;
                        }
                        else if (StringUtils.isNotEmpty(wDepartment.ParentCode))
                        {
                            wParentNoFoundList.Add(wSourveDic[wDepartment.Code]);
                        }
                        else
                        {
                            wSourveDic[wDepartment.Code].ParentID = 0;
                        }

                        wSourveDic[wDepartment.Code].ParentName = wDepartment.ParentName;
                        wSourveDic[wDepartment.Code].Remark = wDepartment.Remark;

                        BMSDepartmentDAO.getInstance().BMS_SaveDepartment(wLoginUser, wSourveDic[wDepartment.Code], wErrorCode);
                        if (wErrorCode.Result != 0)
                        {

                            wResult.Result.Add(StringUtils.Format("Code:{0} Update Error:{1}",
                                wDepartment.Code, MESException.getEnumType(wErrorCode.get()).getLabel()));

                        }
                        continue;
                    }

                    if (wSourveDic.ContainsKey(wDepartment.ParentCode))
                    {
                        wSourveDic[wDepartment.Code].ParentID = wSourveDic[wDepartment.ParentCode].ID;
                    }
                    else if (StringUtils.isNotEmpty(wDepartment.ParentCode))
                    {
                        wParentNoFoundList.Add(wSourveDic[wDepartment.Code]);
                    }

                    BMSDepartmentDAO.getInstance().BMS_AddDepartment(wLoginUser, wDepartment, wErrorCode);
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

                    if (wErrorCode.Result != 0)
                    {
                        wResult.Result.Add(StringUtils.Format("Code:{0} Add Error:{1}", wDepartment.Code,
                            MESException.getEnumType(wErrorCode.get()).getLabel()));
                    }
                    if (wDepartment.ID > 0)
                        wSourveDic.Add(wDepartment.Code, wDepartment);
                }

                foreach (BMSDepartment wDepartment in wParentNoFoundList)
                {
                    if (StringUtils.isEmpty(wDepartment.ParentCode))
                        continue;
                    if (wSourveDic.ContainsKey(wDepartment.ParentCode))
                    {
                        wSourveDic[wDepartment.Code].ParentID = wSourveDic[wDepartment.ParentCode].ID;
                        BMSDepartmentDAO.getInstance().BMS_SaveDepartment(wLoginUser, wSourveDic[wDepartment.Code], wErrorCode);
                        if (wErrorCode.Result != 0)
                        {

                            wResult.Result.Add(StringUtils.Format("Code:{0} Update Error:{1}",
                                wDepartment.Code, MESException.getEnumType(wErrorCode.get()).getLabel()));

                        }
                        continue;
                    }
                    wResult.Result.Add(StringUtils.Format("Code:{0} ParentCode:{1} Update Error: Parent Not Found!",
                               wDepartment.Code, wDepartment.ParentCode));
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<Int32> BMS_ActiveDepartmentByID(BMSEmployee wLoginUser, int wID)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSDepartmentDAO.getInstance().BMS_ActiveDepartmentByID(wLoginUser, wID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> BMS_DisableDepartmentByID(BMSEmployee wLoginUser, int wID)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {

                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSDepartmentDAO.getInstance().BMS_DisableDepartmentByID(wLoginUser, wID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> BMS_DeleteDepartmentByID(BMSEmployee wLoginUser, int wID)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {

                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                BMSDepartmentDAO.getInstance().BMS_DeleteDepartmentByID(wLoginUser, wID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<BMSDepartment>> BMS_QueryDepartmentList(BMSEmployee wLoginUser, String wName, int wParentID, int wActive, Pagination wPagination)
        {
            ServiceResult<List<BMSDepartment>> wResult = new ServiceResult<List<BMSDepartment>>();
            try
            {

                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSDepartmentDAO.getInstance().BMS_QueryDepartmentListByLikeName(wLoginUser, wName, wParentID, wActive, wPagination, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<BMSDepartment> BMS_QueryDepartmentByID(BMSEmployee wLoginUser, int wID, String wCode)
        {
            ServiceResult<BMSDepartment> wResult = new ServiceResult<BMSDepartment>();
            try
            {

                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSDepartmentDAO.getInstance().BMS_QueryDepartmentByID(wLoginUser, wID, wCode, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }

            return wResult;
        }


        public ServiceResult<String> ADC_GetLoginIDByCardID(String wCardID)
        {
            ServiceResult<String> wResult = new ServiceResult<String>("");
            try
            {

                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                // wResult.Result = ADCardDAO.getInstance().ADC_GetLoginIDByCardID(wCardID, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<BMSRegion>> BMS_QueryRegionList(BMSEmployee wLoginUser, String wName, int wParentID, int wActive, Pagination wPagination)
        {
            ServiceResult<List<BMSRegion>> wResult = new ServiceResult<List<BMSRegion>>();
            try
            {

                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSRegionDAO.getInstance().BMS_SelectRegionList(wLoginUser, wName, wParentID, wActive, wPagination, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<BMSRegion> BMS_QueryRegion(BMSEmployee wLoginUser, int wID, string wCode)
        {
            ServiceResult<BMSRegion> wResult = new ServiceResult<BMSRegion>();
            try
            {

                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSRegionDAO.getInstance().BMS_SelectRegion(wLoginUser, wID, wCode, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }

            return wResult;
        }

        public ServiceResult<Int32> BMS_UpdateRegion(BMSEmployee wLoginUser, BMSRegion wBMSRegion)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                BMSRegionDAO.getInstance().BMS_UpdateRegion(wLoginUser, wBMSRegion, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<Int32> BMS_ActiveRegion(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                BMSRegionDAO.getInstance().BMS_ActiveRegion(wLoginUser, wIDList, wActive, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }

        public ServiceResult<Int32> BMS_DeleteRegion(BMSEmployee wLoginUser, List<Int32> wIDList)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>();
            try
            {
                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                BMSRegionDAO.getInstance().BMS_DeleteRegion(wLoginUser, wIDList, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }






        public ServiceResult<List<BMSTeamManage>> BMS_GetTeamManageList(BMSEmployee wLoginUser, String wName, int wWorkShopID,
            int wDepartmentID, int wModuleID, int wLeaderID, int wActive, int wHasItem, Pagination wPagination)
        {
            ServiceResult<List<BMSTeamManage>> wResult = new ServiceResult<List<BMSTeamManage>>();
            try
            {

                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSTeamManageDAO.getInstance().BMS_GetTeamManageList(wLoginUser, wName, wWorkShopID,
                        wDepartmentID, wModuleID, wLeaderID, wActive, wPagination, wErrorCode);

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                //if (wHasItem == 1 && wResult.Result != null && wResult.Result.Count > 0)
                //{

                //    List<BMSTeamItem> wTeamItemList = BMSTeamItemDAO.getInstance().BMS_GetTeamItemList(wLoginUser, -1,
                //            wWorkShopID, wDepartmentID, wModuleID, -1, -1, -1, -1, wActive, wErrorCode);
                //    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLable();

                //    if (wTeamItemList != null && wTeamItemList.Count > 0)
                //    {

                //        Dictionary<Int32, List<BMSTeamItem>> wTeamItemMap = wTeamItemList.stream()
                //                .collect(Collectors.groupingBy(p->p.TeamID));

                //        for (BMSTeamManage wBMSTeamManage : wResult.Result)
                //        {
                //            if (wTeamItemMap.ContainsKey(wBMSTeamManage.ID))
                //                wBMSTeamManage.TeamItemList = wTeamItemMap.get(wBMSTeamManage.ID);
                //        }

                //    }

                //}


            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<BMSTeamManage>> BMS_GetTeamManageList(BMSEmployee wLoginUser, int wLeaderID)
        {
            ServiceResult<List<BMSTeamManage>> wResult = new ServiceResult<List<BMSTeamManage>>();
            try
            {
                wResult.Result = new List<BMSTeamManage>();
                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<BMSTeamManage> wBMSTeamManageList = BMSTeamManageDAO.getInstance().BMS_GetTeamManageList(wLoginUser, "",
                        -1, -1, -1, wLeaderID, 1, Pagination.MaxSize, wErrorCode);

                foreach (BMSTeamManage wBMSTeamManage in wBMSTeamManageList)
                {
                    if (wBMSTeamManage.LeaderID == null || wBMSTeamManage.LeaderID.Count <= 0)
                        continue;

                    if (!wBMSTeamManage.LeaderID.Contains(wLeaderID))
                        continue;

                    //wBMSTeamManage.ChargeGroupList = BMSChargeGroupDAO.getInstance().BMS_GetChargeGroupList(wLoginUser,
                    //        wBMSTeamManage.ID, 1, wErrorCode);
                    //wBMSTeamManage.TeamChargeList = BMSTeamChargeDAO.getInstance().BMS_GetTeamChargeList(wLoginUser,
                    //        wBMSTeamManage.ID, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, wErrorCode);
                    wResult.Result.Add(wBMSTeamManage);
                }

                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<BMSTeamManage>> BMS_GetTeamManageList(BMSEmployee wLoginUser, List<Int32> wIDList)
        {
            ServiceResult<List<BMSTeamManage>> wResult = new ServiceResult<List<BMSTeamManage>>();
            try
            {

                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSTeamManageDAO.getInstance().BMS_GetTeamManageList(wLoginUser, wIDList, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<BMSTeamManage> BMS_GetTeamManage(BMSEmployee wLoginUser, int wID, String wCode)
        {
            ServiceResult<BMSTeamManage> wResult = new ServiceResult<BMSTeamManage>();
            try
            {

                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                wResult.Result = BMSTeamManageDAO.getInstance().BMS_GetTeamManage(wLoginUser, wID, wCode, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> BMS_UpdateTeamManage(BMSEmployee wLoginUser, BMSTeamManage wBMSTeamManage)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {

                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                BMSTeamManageDAO.getInstance().BMS_UpdateTeamManage(wLoginUser, wBMSTeamManage, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<List<String>> BMS_SyncTeamManageList(BMSEmployee wLoginUser, List<BMSTeamManage> wTeamManageList)
        {
            ServiceResult<List<String>> wResult = new ServiceResult<List<String>>();
            try
            {
                wResult.Result = new List<string>();
                if (wTeamManageList == null || wTeamManageList.Count <= 0)
                    return wResult;

                OutResult<Int32> wErrorCode = new OutResult<Int32>(0);

                List<BMSTeamManage> wSourveList = BMSTeamManageDAO.getInstance().BMS_GetTeamManageList(wLoginUser, "",
                        -1, -1, -1, -1, -1, Pagination.MaxSize, wErrorCode);
                if (wErrorCode.Result != 0)
                {
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
                    return wResult;
                }
                List<BMSDepartment> wDepartmentSourceList = BMSDepartmentDAO.getInstance().BMS_QueryDepartmentList(wLoginUser, -1, wErrorCode);

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




                Dictionary<string, Int32> wEmployeeIDSourveDic = wEmployeeSourveList.ToDictionary(p => p.LoginID, p => p.ID);

                Dictionary<string, BMSDepartment> wDepartmentSourveDic = wDepartmentSourceList.ToDictionary(p => p.Code, p => p);

                Dictionary<string, BMSTeamManage> wSourveDic = wSourveList.ToDictionary(p => p.Code, p => p);
                int i = 0;
                foreach (BMSTeamManage wTeamManage in wTeamManageList)
                {
                    i++;
                    if (wTeamManage == null)
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}条数据不完整  !", i));
                        continue;
                    }
                    if (StringUtils.isEmpty(wTeamManage.Code) || StringUtils.isEmpty(wTeamManage.Name))
                    {
                        wResult.Result.Add(StringUtils.Format("第{0}条数据不完整 Code:{1} Name:{2} !", i,
                           wTeamManage.Code, wTeamManage.Name));
                        continue;
                    }

                    if (wDepartmentSourveDic.ContainsKey(wTeamManage.DepartmentCode))
                    {
                        wTeamManage.DepartmentID = wDepartmentSourveDic[wTeamManage.DepartmentCode].ID;
                    }
                    else
                    {
                        wResult.Result.Add(StringUtils.Format("Code:{0} DepartmentCode：{1}  Error:Department Not Found!",
                               wTeamManage.Code, wTeamManage.DepartmentCode));
                        continue;
                    }
                    wTeamManage.MateID = StringUtils.parseIntList(wTeamManage.MateCode, wEmployeeIDSourveDic);
                    wTeamManage.LeaderID = StringUtils.parseIntList(wTeamManage.LeaderCode, wEmployeeIDSourveDic);

                    if (wSourveDic.ContainsKey(wTeamManage.Code))
                    {
                        wSourveDic[wTeamManage.Code].Name = wTeamManage.Name;
                        wSourveDic[wTeamManage.Code].Active = wTeamManage.Active;
                        wSourveDic[wTeamManage.Code].DepartmentCode = wTeamManage.DepartmentCode;
                        wSourveDic[wTeamManage.Code].DepartmentName = wTeamManage.DepartmentName;
                        wSourveDic[wTeamManage.Code].DepartmentID = wTeamManage.DepartmentID;
                        wSourveDic[wTeamManage.Code].LeaderCode = wTeamManage.LeaderCode;
                        wSourveDic[wTeamManage.Code].LeaderName = wTeamManage.LeaderName;
                        wSourveDic[wTeamManage.Code].LeaderID = wTeamManage.LeaderID;
                        wSourveDic[wTeamManage.Code].MateCode = wTeamManage.MateCode;
                        wSourveDic[wTeamManage.Code].MateName = wTeamManage.MateName;
                        wSourveDic[wTeamManage.Code].MateID = wTeamManage.MateID;
                        wSourveDic[wTeamManage.Code].Remark = wTeamManage.Remark;

                        BMSTeamManageDAO.getInstance().BMS_UpdateTeamManage(wLoginUser, wSourveDic[wTeamManage.Code], wErrorCode);
                        if (wErrorCode.Result != 0)
                        {
                            wResult.Result.Add(StringUtils.Format("Code:{0} Update Error:{1}",
                                wTeamManage.Code, MESException.getEnumType(wErrorCode.get()).getLabel()));

                        }
                        continue;
                    }

                    BMSTeamManageDAO.getInstance().BMS_UpdateTeamManage(wLoginUser, wTeamManage, wErrorCode);
                    wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();

                    if (wErrorCode.Result != 0)
                    {
                        wResult.Result.Add(StringUtils.Format("Code:{0} Add Error:{1}", wTeamManage.Code,
                            MESException.getEnumType(wErrorCode.get()).getLabel()));
                    }
                    if (wTeamManage.ID > 0)
                        wSourveDic.Add(wTeamManage.Code, wTeamManage);
                }

            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> BMS_ActiveTeamManage(BMSEmployee wLoginUser, int wActive,
                BMSTeamManage wBMSTeamManage)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {

                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                BMSTeamManageDAO.getInstance().BMS_ActiveTeamManage(wLoginUser, wActive, wBMSTeamManage, wErrorCode);
                wResult.FaultCode += MESException.getEnumType(wErrorCode.get()).getLabel();
            }
            catch (Exception e)
            {
                logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
            }
            return wResult;
        }


        public ServiceResult<Int32> BMS_DeleteTeamManage(BMSEmployee wLoginUser, BMSTeamManage wBMSTeamManage)
        {
            ServiceResult<Int32> wResult = new ServiceResult<Int32>(0);
            try
            {

                OutResult<Int32> wErrorCode = new OutResult<Int32>();
                wErrorCode.set(0);
                BMSTeamManageDAO.getInstance().BMS_DeleteTeamManage(wLoginUser, wBMSTeamManage, wErrorCode);
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
