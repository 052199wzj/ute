package com.mes.aps.server.serviceimpl.dao.oms;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import com.mes.aps.server.service.mesenum.MESDBSource;
import com.mes.aps.server.service.mesenum.MESException;
import com.mes.aps.server.service.po.OutResult;
import com.mes.aps.server.service.po.ServiceResult;
import com.mes.aps.server.service.po.bms.BMSEmployee;
import com.mes.aps.server.service.po.oms.OMSCommand;
import com.mes.aps.server.service.utils.StringUtils;
import com.mes.aps.server.serviceimpl.dao.BaseDAO;
import com.mes.aps.server.serviceimpl.dao.oms.OMSCommandDAO;
import com.mes.aps.server.serviceimpl.utils.aps.APSConstants;

public class OMSCommandDAO extends BaseDAO {
	private static Logger logger = LoggerFactory.getLogger(OMSCommandDAO.class);

	private static OMSCommandDAO Instance = null;

	public static OMSCommandDAO getInstance() {
		if (Instance == null)
			Instance = new OMSCommandDAO();
		return Instance;
	}

	public int Update(BMSEmployee wLoginUser, OMSCommand wOMSCommand, OutResult<Integer> wErrorCode) {
		int wResult = 0;
		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.APS,
					wLoginUser.getID(), 0);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wResult;
			}

			if (wOMSCommand == null) {
				return 0;
			}
			String wSQL = "";
			if (wOMSCommand.getID() <= 0) {

				wOMSCommand.No = StringUtils.Format("CM-{0}-{1}",
						String.format("%04d", this.OMS_GetCommandMaxNo(wLoginUser, wErrorCode) + 1),
						StringUtils.parseCalendarToString(Calendar.getInstance(), "MM-yyyy"));

				wSQL = StringUtils.Format(
						"INSERT INTO {0}.oms_command(CustomerID,ContactCode,No,Status,LinkManID,EditorID,EditTime,"
								+ "Active,AuditorID,AuditTime,CreatorID,CreateTime,FactoryID,BusinessUnitID,FQTY,WBSNo,WorkShopID)"
								+ " VALUES(:CustomerID,:ContactCode,:No,:Status,:LinkManID,:EditorID,:EditTime,:Active,:AuditorID,"
								+ ":AuditTime,:CreatorID,:CreateTime,:FactoryID,:BusinessUnitID,:FQTY,:WBSNo,:WorkShopID);",

						wInstance.Result);
			} else {
				wSQL = StringUtils.Format(
						"UPDATE {0}.oms_command SET CustomerID = :CustomerID,ContactCode = :ContactCode,No = :No,WorkShopID=:WorkShopID,"
								+ "Status = :Status,LinkManID = :LinkManID,EditorID = :EditorID,EditTime = :EditTime,Active = :Active,"
								+ "AuditorID = :AuditorID,AuditTime = :AuditTime,CreatorID = :CreatorID,CreateTime = :CreateTime,FactoryID = :FactoryID,"
								+ "BusinessUnitID = :BusinessUnitID,FQTY = :FQTY,WBSNo=:WBSNo WHERE ID = :ID;",
						new Object[] {

								wInstance.Result });
			}
			wSQL = DMLChange(wSQL);

			Map<String, Object> wParamMap = new HashMap<>();

			wParamMap.put("ID", wOMSCommand.ID);
			wParamMap.put("WorkShopID", wOMSCommand.WorkShopID);
			wParamMap.put("CustomerID", wOMSCommand.CustomerID);
			wParamMap.put("ContactCode", wOMSCommand.ContactCode);
			wParamMap.put("No", wOMSCommand.No);
			wParamMap.put("Status", wOMSCommand.Status);
			wParamMap.put("LinkManID", wOMSCommand.LinkManID);
			wParamMap.put("EditorID", wOMSCommand.EditorID);
			wParamMap.put("EditTime", wOMSCommand.EditTime);
			wParamMap.put("Active", wOMSCommand.Active);
			wParamMap.put("AuditorID", wOMSCommand.AuditorID);
			wParamMap.put("AuditTime", wOMSCommand.AuditTime);
			wParamMap.put("CreatorID", wOMSCommand.CreatorID);
			wParamMap.put("CreateTime", wOMSCommand.CreateTime);
			wParamMap.put("FactoryID", wOMSCommand.FactoryID);
			wParamMap.put("BusinessUnitID", wOMSCommand.BusinessUnitID);
			wParamMap.put("FQTY", wOMSCommand.FQTY);
			wParamMap.put("WBSNo", wOMSCommand.WBSNo);

			GeneratedKeyHolder generatedKeyHolder = new GeneratedKeyHolder();
			MapSqlParameterSource mapSqlParameterSource = new MapSqlParameterSource(wParamMap);

			this.nameJdbcTemplate.update(wSQL, (SqlParameterSource) mapSqlParameterSource,
					(KeyHolder) generatedKeyHolder);

			if (wOMSCommand.getID() <= 0) {
				wResult = generatedKeyHolder.getKey().intValue();
				wOMSCommand.setID(wResult);
			} else {
				wResult = wOMSCommand.getID();
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	private int OMS_GetCommandMaxNo(BMSEmployee wLoginUser, OutResult<Integer> wErrorCode) {
		int wResult = 0;
		try {

			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.APS,
					wLoginUser.getID(), 0);

			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wResult;
			}

			Calendar wStartTime = Calendar.getInstance();
			wStartTime.set(Calendar.DAY_OF_MONTH, 1);
			wStartTime.set(Calendar.HOUR_OF_DAY, 0);
			wStartTime.set(Calendar.MINUTE, 0);
			wStartTime.set(Calendar.SECOND, 0);

			Calendar wEndTime = (Calendar) wStartTime.clone();
			wEndTime.add(Calendar.MONTH, 1);

			Map<String, Object> wParamMap = new HashMap<>();

			wParamMap.put("StartTime", wStartTime);
			wParamMap.put("EndTime", wEndTime);
			String wSql = StringUtils.Format(
					"select ID,No from {0}.oms_command WHERE CreateTime between :StartTime and :EndTime ;",
					wInstance.Result);

			List<Map<String, Object>> wQueryResult = this.nameJdbcTemplate.queryForList(wSql, wParamMap);
			String wNo = "";
			int wNum = 0;
			String wEndWiths = StringUtils.parseCalendarToString(wStartTime, "MM-yyyy");
			for (Map<String, Object> wReader : wQueryResult) {

				wNo = StringUtils.parseString(wReader["No"]);
				if (!wNo.endsWith(wEndWiths))
					continue;

				wNo = wNo.substring(3, 7);
				wNum = StringUtils.parseInt(wNo);
				if (wResult < wNum)
					wResult = wNum;
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	public ServiceResult<Integer> DeleteList(BMSEmployee wLoginUser, List<OMSCommand> wList,
			OutResult<Integer> wErrorCode) {
		ServiceResult<Integer> wResult = new ServiceResult<>(0);
		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.APS,
					wLoginUser.getID(), 0);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wResult;
			}

			if (wList == null || wList.size() <= 0) {
				return wResult;
			}
			List<String> wIDList = new ArrayList<>();
			for (OMSCommand wItem : wList) {
				wIDList.add(String.valueOf(wItem.ID));
			}
			String wSql = StringUtils.Format("delete from {1}.oms_command WHERE ID IN({0}) ;",
					String.join(",", wIDList), wInstance.Result);
			ExecuteSqlTransaction(wSql);
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	public OMSCommand SelectByID(BMSEmployee wLoginUser, int wID, OutResult<Integer> wErrorCode) {
		OMSCommand wResult = new OMSCommand();
		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.APS,
					wLoginUser.getID(), 0);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wResult;
			}

			List<OMSCommand> wList = SelectList(wLoginUser, wID, "", "", -1, -1, -1, -1, -1, null, null, wErrorCode);
			if (wList == null || wList.size() != 1)
				return wResult;
			wResult = wList[0];
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.getValue());
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
		}
		return wResult;
	}

	public OMSCommand SelectByID(BMSEmployee wLoginUser, String wNo, OutResult<Integer> wErrorCode) {
		OMSCommand wResult = new OMSCommand();
		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.APS,
					wLoginUser.getID(), 0);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wResult;
			}

			List<OMSCommand> wList = SelectList(wLoginUser, -1, wNo, "", -1, -1, -1, -1, -1, null, null, wErrorCode);
			if (wList == null || wList.size() != 1)
				return wResult;
			wResult = wList[0];
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.getValue());
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
		}
		return wResult;
	}

	public List<OMSCommand> SelectList(BMSEmployee wLoginUser, int wID, String wNo, String wWBSNo, int wFactoryID,
			int wBusinessUnitID, int wWorkShopID, int wCustomerID, int wActive, Calendar wStartTime, Calendar wEndTime,
			OutResult<Integer> wErrorCode) {
		List<OMSCommand> wResultList = new ArrayList<>();
		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.APS,
					wLoginUser.getID(), 0);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wResultList;
			}

			Calendar wBaseTime = Calendar.getInstance();
			wBaseTime.set(2000, 1, 1);
			if ( wStartTime.compareTo(wBaseTime) < 0)
				wStartTime = wBaseTime;
			if ( wEndTime.compareTo(wBaseTime) < 0)
				wEndTime = wBaseTime;
			if (wStartTime.compareTo(wEndTime) > 0) {
				return wResultList;
			}

			String wSQL = StringUtils.Format(
					"SELECT t.*,Count(t1.ID) as OrderCount,Sum(t1.FQTYPlan) as FQTYPlan,Sum(t1.FQTYActual) as FQTYActual FROM {0}.oms_command t"
							+ " Left join {0}.oms_order t1 on t1.CommandID=t.ID WHERE  1=1  "
							+ " and ( :wID <= 0 or :wID = t.ID )  and ( :wNo <= 0 or :wNo = t.No ) "
							+ " and ( :wFactoryID <= 0 or :wFactoryID = t.FactoryID )  and ( :wWBSNo = '''' or :wWBSNo = t.WBSNo )"
							+ " and ( :wWorkShopID <= 0 or :wWorkShopID = t.WorkShopID ) "
							+ " and ( :wCustomerID <= 0 or :wCustomerID = t.CustomerID ) "
							+ " and ( :wBusinessUnitID <= 0 or :wBusinessUnitID = t.BusinessUnitID ) "
							+ " and ( :wStartTime <= str_to_date(''2010-01-01'', ''%Y-%m-%d'') or :wStartTime <= t.EditTime) "
							+ " and ( :wEndTime <= str_to_date(''2010-01-01'', ''%Y-%m-%d'') or :wEndTime >= t.CreateTime) group by t.ID;",
					wInstance.Result);
			Map<String, Object> wParamMap = new HashMap<>();

			wParamMap.put("wID", wID);
			wParamMap.put("wNo", wNo);
			wParamMap.put("wActive", wActive);
			wParamMap.put("wFactoryID", wFactoryID);
			wParamMap.put("wCustomerID", wCustomerID);
			wParamMap.put("wWBSNo", wWBSNo);
			wParamMap.put("wWorkShopID", wWorkShopID);
			wParamMap.put("wBusinessUnitID", wBusinessUnitID);
			wParamMap.put("wStartTime", wStartTime);
			wParamMap.put("wEndTime", wEndTime);

			wSQL = DMLChange(wSQL);

			List<Map<String, Object>> wQueryResult = this.nameJdbcTemplate.queryForList(wSQL, wParamMap);

			for (Map<String, Object> wReader : wQueryResult) {
				OMSCommand wItem = new OMSCommand();

				wItem.ID = StringUtils.parseInt(wReader["ID"]);
				wItem.CustomerID = StringUtils.parseInt(wReader["CustomerID"]);
				wItem.ContactCode = StringUtils.parseString(wReader["ContactCode"]);
				wItem.No = StringUtils.parseString(wReader["No"]);
				wItem.Status = StringUtils.parseInt(wReader["Status"]);
				wItem.LinkManID = StringUtils.parseInt(wReader["LinkManID"]);
				wItem.WorkShopID = StringUtils.parseInt(wReader["WorkShopID"]);
				wItem.WorkShopName = APSConstants.GetFMCWorkShopName(wItem.WorkShopID);
				wItem.EditorID = StringUtils.parseInt(wReader["EditorID"]);
				wItem.EditTime = StringUtils.parseCalendar(wReader["EditTime"]);
				wItem.Active = StringUtils.parseInt(wReader["Active"]);
				wItem.AuditorID = StringUtils.parseInt(wReader["AuditorID"]);
				wItem.AuditTime = StringUtils.parseCalendar(wReader["AuditTime"]);
				wItem.CreatorID = StringUtils.parseInt(wReader["CreatorID"]);
				wItem.CreateTime = StringUtils.parseCalendar(wReader["CreateTime"]);
				wItem.FactoryID = StringUtils.parseInt(wReader["FactoryID"]);
				wItem.BusinessUnitID = StringUtils.parseInt(wReader["BusinessUnitID"]);
				wItem.FQTY = StringUtils.parseDouble(wReader["FQTY"]);
				wItem.OrderCount = StringUtils.parseInt(wReader["OrderCount"]);
				wItem.FQTYPlan = StringUtils.parseDouble(wReader["FQTYPlan"]);
				wItem.FQTYActual = StringUtils.parseDouble(wReader["FQTYActual"]);
				wItem.WBSNo = StringUtils.parseString(wReader["WBSNo"]);
				wItem.Customer = APSConstants.GetCRMCustomerName(wItem.CustomerID);
				wResultList.add(wItem);
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResultList;
	}

	public ServiceResult<Integer> Active(BMSEmployee wLoginUser, List<Integer> wIDList, int wActive,
			OutResult<Integer> wErrorCode) {
		ServiceResult<Integer> wResult = new ServiceResult<>(0);
		try {
			ServiceResult<String> wInstance = this.GetDataBaseName(wLoginUser, MESDBSource.APS);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wResult;
			}

			if (wIDList == null || wIDList.size() <= 0)
				return wResult;
			for (Integer wItem : wIDList) {
				OMSCommand wOMSCommand = SelectByID(wLoginUser, wItem, wErrorCode);
				if (wOMSCommand == null || wOMSCommand.ID <= 0) {
					continue;
				}
				if (wActive == 2 && wOMSCommand.Active != 1) {
					wErrorCode.set(MESException.Logic.getValue());
					return wResult;
				}
				wOMSCommand.Active = wActive;
				long wID = Update(wLoginUser, wOMSCommand, wErrorCode);
				if (wID <= 0L)
					break;
			}
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.getValue());
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
		}
		return wResult;
	}

}