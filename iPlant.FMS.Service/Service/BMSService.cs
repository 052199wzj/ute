using iPlant.Common.Tools;
using iPlant.FMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iPlant.FMC.Service
{
    public interface BMSService
    {

        // Function01:User Manager Interface
        ServiceResult<BMSEmployee> BMS_LoginEmployee(String wLoginName, String wPassword, long wMAC);

        ServiceResult<BMSEmployee> BMS_LoginEmployeeByUserName(String wUserName, String wPassword);

        ServiceResult<BMSEmployee> BMS_LoginEmployeeByToken(String wLoginName, String wToken);

        ServiceResult<BMSEmployee> BMS_LoginEmployeeByOne(String wLoginID);

        ServiceResult<List<BMSEmployee>> BMS_QueryEmployeeList(BMSEmployee wLoginUser, String wName, int wDepartmentID, int wPosition,
                int wDepartmentType, int wPositionType, int wRoleID, int wActive, Pagination wPagination);

        ServiceResult<List<BMSEmployee>> BMS_QueryEmployeeList(BMSEmployee wLoginUser, List<Int32> wIDList);

        ServiceResult<Dictionary<Int32, BMSEmployee>> BMS_QueryEmployeeDic();

        ServiceResult<BMSEmployee> BMS_QueryEmployeeByID(BMSEmployee wLoginUser, int wID);

        ServiceResult<Int32> BMS_AddEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee);

        ServiceResult<Int32> BMS_SetEngineerUserList(List<BMSEmployee> wEngineerUserList);

        ServiceResult<List<String>>  BMS_SyncEmployeeList(BMSEmployee wLoginUser, List<BMSEmployee> wEmployeeList);

        ServiceResult<List<BMSEmployee>> BMS_GetEngineerUserList();

        ServiceResult<Int32> BMS_GetMinEngineerUserID();

        ServiceResult<String> BMS_GetDefaultPassword();

        ServiceResult<Int32> BMS_AutoSetEmployeeSuperior(BMSEmployee wLoginUser, List<BMSEmployee> wEmployee,
                List<Int32> DutyOrders);

        ServiceResult<Int32> BMS_GetEmployeeSuperior(BMSEmployee wLoginUser, BMSEmployee wEmployee,
                List<Int32> wDutyOrders, List<BMSPosition> wBMSPositionAllList, List<BMSEmployee> wBMSEmployeeList, Dictionary<Int32, BMSDepartment> wBMSDepartmentDic);

        ServiceResult<Int32> BMS_SaveEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee);

        ServiceResult<Int32> BMS_SavePassword(BMSEmployee wLoginUser, BMSEmployee wEmployee);

        ServiceResult<Int32> BMS_DeleteEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee);

        ServiceResult<Int32> BMS_DisableEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee);

        ServiceResult<Int32> BMS_ActiveEmployee(BMSEmployee wLoginUser, BMSEmployee wEmployee);

        ServiceResult<Int32> BMS_ResetPassword(BMSEmployee wLoginUser, BMSEmployee wEmployee);


        ServiceResult<BMSRole> BMS_AddRole(BMSEmployee wLoginUser, BMSRole wRole);

        ServiceResult<List<BMSRole>> BMS_GetRoleList(BMSEmployee wLoginUser, String wName, int wDepartmentID, int wUserID, int wActive,Pagination wPagination);

        ServiceResult<Int32> BMS_RemoveRole(BMSEmployee wLoginUser, int wID);

        ServiceResult<Int32> BMS_SaveRole(BMSEmployee wLoginUser, BMSRole wRole);

        ServiceResult<List<String>> BMS_SyncRoleList(BMSEmployee wBMSEmployee,   List<BMSRole> wBMSRoleList);

        ServiceResult<Int32> BMS_SaveRoleRangeList(BMSEmployee wLoginUser, int wRoleID, List<BMSRoleItem> wFunctionList);

        ServiceResult<Int32> BMS_SaveRoleFunctionList(BMSEmployee wLoginUser, int wRoleID,
                List<BMSRoleItem> wFunctionList);

        ServiceResult<Int32> BMS_SaveRoleUserList(BMSEmployee wLoginUser, int wRoleID, List<BMSRoleItem> wUserList);

        ServiceResult<List<BMSRoleItem>> BMS_QueryRangeListByRoleID(BMSEmployee wLoginUser, int wRoleID);

        ServiceResult<List<BMSRoleItem>> BMS_QueryRangeListByOperatorID(BMSEmployee wLoginUser, int wOperatorID,
                int wFunctionID);

        ServiceResult<List<BMSRoleItem>> BMS_QueryFunctionListByRoleID(BMSEmployee wLoginUser, int wRoleID);

        ServiceResult<List<BMSRoleItem>> BMS_QueryUserListByRoleID(BMSEmployee wLoginUser, int wRoleID);

        ServiceResult<Int32> BMS_DisableRole(BMSEmployee wLoginUser, int wID);

        ServiceResult<Int32> BMS_ActiveRole(BMSEmployee wLoginUser, int wID);

        ServiceResult<Boolean> BMS_CheckPowerByLoginID(int wCompanyID, int wLoginID, int wAuthorityID, int wRangeID,
                int wRangeType);

        ServiceResult<Boolean> BMS_CheckPowerByLoginID(int wCompanyID, int wLoginID, String wPath, int wRangeID,
                int wRangeType);

        ServiceResult<Int32> BMS_ActiveFunctionNodeTree(BMSEmployee wLoginUser, List<Int32> wFunctionIDList,
                int wActive);

        ServiceResult<Int32> BMS_DeleteFunctionNodeTree(BMSEmployee wLoginUser, List<Int32> wFunctionIDList);

        ServiceResult<BMSRoleItem> BMS_UpdateFunctionNodeTree(BMSEmployee wLoginUser, BMSRoleItem wBMSRoleItem);

        ServiceResult<List<BMSRoleItem>> BMS_GetFunctionNodeTree(BMSEmployee wLoginUser, int wActive);

        ServiceResult<List<BMSRoleItem>> BMS_GetFunctionListByLoginID(BMSEmployee wLoginUser, int wUserID);

        ServiceResult<List<BMSRoleItem>> BMS_QueryUserListByFunctionID(BMSEmployee wLoginUser, int wFunctionID);

        ServiceResult<List<BMSRoleItem>> BMS_QueryUserListByPath(BMSEmployee wLoginUser, String wPath);

        // Function Department&Position
        // Function02:Department Manager Interface
        ServiceResult<Int32> BMS_AddPosition(BMSEmployee wLoginUser, BMSPosition wPosition);

        ServiceResult<Int32> BMS_SavePosition(BMSEmployee wLoginUser, BMSPosition wPosition);

        ServiceResult<Int32> BMS_ActivePositionByID(BMSEmployee wLoginUser, int wID);

        ServiceResult<Int32> BMS_DisablePositionByID(BMSEmployee wLoginUser, int wID);

        ServiceResult<Int32> BMS_DeletePositionByID(BMSEmployee wLoginUser, int wID);

        ServiceResult<List<BMSPosition>> BMS_QueryPositionList(BMSEmployee wLoginUser, String wName, int wDepartmentID, int wActive, Pagination wPagination);

        ServiceResult<BMSPosition> BMS_QueryPositionByID(BMSEmployee wLoginUser, int wID, String wCode);

        ServiceResult<Int32> BMS_AddDepartment(BMSEmployee wLoginUser, BMSDepartment wDepartment);

        ServiceResult<Int32> BMS_SaveDepartment(BMSEmployee wLoginUser, BMSDepartment wDepartment);

        ServiceResult<List<String>> BMS_SyncDepartmentList(BMSEmployee wLoginUser, List<BMSDepartment> wDepartmentList);


        ServiceResult<Int32> BMS_ActiveDepartmentByID(BMSEmployee wLoginUser, int wID);

        ServiceResult<Int32> BMS_DeleteDepartmentByID(BMSEmployee wLoginUser, int wID);

        ServiceResult<Int32> BMS_DisableDepartmentByID(BMSEmployee wLoginUser, int wID);

        ServiceResult<List<BMSDepartment>> BMS_QueryDepartmentList(BMSEmployee wLoginUser, String wName, int wParentID, int wActive ,Pagination wPagination);

        ServiceResult<BMSDepartment> BMS_QueryDepartmentByID(BMSEmployee wLoginUser, int wID, String wCode);



        // endRegion

        ServiceResult<String> ADC_GetLoginIDByCardID(String wCardID);


        ServiceResult<List<BMSRegion>> BMS_QueryRegionList(BMSEmployee wLoginUser, String wName,int wParentID, int wActive, Pagination wPagination);

        ServiceResult<BMSRegion> BMS_QueryRegion(BMSEmployee wLoginUser, int wID, string wCode);

        ServiceResult<Int32> BMS_UpdateRegion(BMSEmployee wLoginUser, BMSRegion wBMSRegion);

        ServiceResult<Int32> BMS_ActiveRegion(BMSEmployee wLoginUser, List<Int32> wIDList, int wActive);

        ServiceResult<Int32> BMS_DeleteRegion(BMSEmployee wLoginUser, List<Int32> wIDList);



        ServiceResult<List<BMSTeamManage>> BMS_GetTeamManageList(BMSEmployee wLoginUser,String wName, int wWorkShopID,
                int wDepartmentID, int wModuleID, int wLeaderID, int wActive, int wHasItem, Pagination wPagination);


        ServiceResult<List<BMSTeamManage>> BMS_GetTeamManageList(BMSEmployee wLoginUser, int wLeaderID);


        ServiceResult<List<BMSTeamManage>> BMS_GetTeamManageList(BMSEmployee wLoginUser, List<Int32> wIDList);


        ServiceResult<BMSTeamManage> BMS_GetTeamManage(BMSEmployee wLoginUser, int wID,String wCode);
        ServiceResult<Int32> BMS_UpdateTeamManage(BMSEmployee wLoginUser, BMSTeamManage wBMSTeamManage);

        ServiceResult<Int32> BMS_ActiveTeamManage(BMSEmployee wLoginUser, int wActive,
               BMSTeamManage wBMSTeamManage);

        ServiceResult<List<String>> BMS_SyncTeamManageList(BMSEmployee wLoginUser, List<BMSTeamManage> wTeamManageList);
        ServiceResult<Int32> BMS_DeleteTeamManage(BMSEmployee wLoginUser, BMSTeamManage wBMSTeamManage);
    }
}
