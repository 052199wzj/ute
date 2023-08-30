package com.mes.aps.server.serviceimpl.dao.oms;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mes.aps.server.service.mesenum.MESDBSource;
import com.mes.aps.server.service.mesenum.MESException;
import com.mes.aps.server.service.mesenum.OMSOrderStatus;
import com.mes.aps.server.service.po.OutResult;
import com.mes.aps.server.service.po.ServiceResult;
import com.mes.aps.server.service.po.bms.BMSEmployee;
import com.mes.aps.server.service.po.fpc.FPCRoute;
import com.mes.aps.server.service.po.mss.MSSMaterial;
import com.mes.aps.server.service.po.oms.OMSOrder;
import com.mes.aps.server.service.utils.StringUtils;
import com.mes.aps.server.serviceimpl.FMCServiceImpl;
import com.mes.aps.server.serviceimpl.WMSServiceImpl;
import com.mes.aps.server.serviceimpl.dao.BaseDAO;
import com.mes.aps.server.serviceimpl.dao.oms.OMSOrderDAO;
import com.mes.aps.server.serviceimpl.utils.aps.APSConstants;

public class OMSOrderDAO extends BaseDAO {
	private static Logger logger = LoggerFactory.getLogger(OMSOrderDAO.class);

	private static OMSOrderDAO Instance = null;

	public long Update(BMSEmployee wLoginUser, OMSOrder wOMSOrder, OutResult<Integer> wErrorCode) {
		int wResult = 0;
		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.APS,
					wLoginUser.getID(), 500903);
			wErrorCode.set(wInstance.ErrorCode);
			if (((Integer) wErrorCode.Result) != 0) {
				return wResult;
			}

			if (wOMSOrder == null) {
				return 0L;
			}

			if (StringUtils.isNotEmpty(wOMSOrder.MaterialNo) && wOMSOrder.MaterialID <= 0) {

				List<MSSMaterial> wMSSMaterialList = WMSServiceImpl.getInstance()
						.MSS_QueryMaterialList(wLoginUser, wOMSOrder.MaterialNo).List(MSSMaterial.class);

				if (wMSSMaterialList != null && wMSSMaterialList.size() > 0) {
					wMSSMaterialList.removeIf(p -> p.Status != 1);
					if (wMSSMaterialList.size() > 0) {
						if (wOMSOrder.MaterialID <= 0 || wOMSOrder.MaterialID != wMSSMaterialList[0].ID) {
							wOMSOrder.MaterialID = wMSSMaterialList[0].ID;
							wOMSOrder.MaterialName = wMSSMaterialList[0].MaterialName;

						}
					}
				}
			}

			if (wOMSOrder.ID <= 0 && StringUtils.isEmpty(wOMSOrder.OrderNo))
				wOMSOrder.OrderNo = SelectSubOrderNo(wLoginUser, wOMSOrder.CommandID, wErrorCode);

			Map<String, Object> wParamMap = new HashMap<>();

			wParamMap.put("CommandID", wOMSOrder.CommandID);
			wParamMap.put("ERPID", wOMSOrder.ERPID);
			if (StringUtils.isNotEmpty(wOMSOrder.OrderNo))
				wParamMap.put("OrderNo", wOMSOrder.OrderNo);
			wParamMap.put("LineID", wOMSOrder.LineID);
			wParamMap.put("ProductID", wOMSOrder.ProductID);
			wParamMap.put("PartNo", wOMSOrder.PartNo);
			wParamMap.put("BOMNo", wOMSOrder.BOMNo);
			wParamMap.put("Priority", wOMSOrder.Priority);
			wParamMap.put("Status", wOMSOrder.Status);
			wParamMap.put("PlanReceiveDate", wOMSOrder.PlanReceiveDate);
			wParamMap.put("RealReceiveDate", wOMSOrder.RealReceiveDate);
			wParamMap.put("PlanFinishDate", wOMSOrder.PlanFinishDate);
			wParamMap.put("RealStartDate", wOMSOrder.RealStartDate);
			wParamMap.put("RealFinishDate", wOMSOrder.RealFinishDate);
			wParamMap.put("RealSendDate", wOMSOrder.RealSendDate);
			wParamMap.put("Remark", wOMSOrder.Remark);
			wParamMap.put("EditID", wOMSOrder.EditID);
			wParamMap.put("EditTime", Calendar.getInstance());
			wParamMap.put("AuditorID", wOMSOrder.AuditorID);
			wParamMap.put("AuditTime", wOMSOrder.AuditTime);
			wParamMap.put("Active", wOMSOrder.Active);
			wParamMap.put("RouteID", wOMSOrder.RouteID);
			wParamMap.put("TelegraphTime", wOMSOrder.TelegraphTime);
			wParamMap.put("TelegraphRealTime", wOMSOrder.TelegraphRealTime);
			wParamMap.put("FQTYPlan", wOMSOrder.FQTYPlan);
			wParamMap.put("FQTYActual", wOMSOrder.FQTYActual);
			wParamMap.put("FQTYSent", wOMSOrder.FQTYSent);
			wParamMap.put("FQTYBad", wOMSOrder.FQTYBad);
			wParamMap.put("FQTYScrap", wOMSOrder.FQTYScrap);
			wParamMap.put("FQTYReceive", wOMSOrder.FQTYReceive);

			if (wOMSOrder.ID > 0) {
				wParamMap.put("ID", wOMSOrder.ID);
				this.Update(StringUtils.Format("{0}.oms_order", wInstance.Result), "ID", wParamMap);
			} else {
				wParamMap.put("CreateID", wOMSOrder.CreateID);
				wParamMap.put("CreateTime", Calendar.getInstance());

				wOMSOrder.ID = this.Insert(StringUtils.Format("{0}.oms_order", wInstance.Result), wParamMap);
			}

		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	public void DeleteList(BMSEmployee wLoginUser, List<OMSOrder> wList, OutResult<Integer> wErrorCode) {
		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.APS,
					wLoginUser.getID(), 500903);
			wErrorCode.set(wInstance.ErrorCode);
			if (((Integer) wErrorCode.Result) != 0) {
				return;
			}

			if (wList == null || wList.size() <= 0) {
				return;
			}
			List<String> wIDList = new ArrayList<>();
			for (OMSOrder wItem : wList) {
				wIDList.add(String.valueOf(wItem.ID));
			}
			String wSql = StringUtils.Format("delete from {0}.oms_order WHERE ID IN({1}) ;", wInstance.Result,
					String.join(",", wIDList));
			ExecuteSqlTransaction(wSql);
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
	}

	public OMSOrder SelectByID(BMSEmployee wLoginUser, int wID, OutResult<Integer> wErrorCode) {
		OMSOrder wResult = new OMSOrder();
		try {

			Calendar wBaseTime = Calendar.getInstance();
			wBaseTime.set(2000, 1, 1);

			List<OMSOrder> wList = SelectList(wLoginUser, wID, -1, "", -1, -1, -1, -1, -1, "", "", -1, null, wBaseTime,
					wBaseTime, wBaseTime, wBaseTime, wErrorCode);
			if (wList == null || wList.size() != 1)
				return wResult;
			wResult = wList[0];
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.getValue());
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
		}
		return wResult;
	}

	public List<OMSOrder> SelectList(BMSEmployee wLoginUser, int wID, int wCommandID, String wOrderNo, int wWorkShopID,
			int wLineID, int wProductID, int wMaterialID, int wCustomerID, String wPartNo, String wBOMNo, int wActive,
			List<Integer> wStateIDList, Calendar wPreStartTime, Calendar wPreEndTime, Calendar wRelStartTime,
			Calendar wRelEndTime, OutResult<Integer> wErrorCode) {
		List<OMSOrder> wResultList = new ArrayList<>();
		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.APS,
					wLoginUser.getID(), 0);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wResultList;
			}

			ServiceResult<String> wInstanceBasic = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.Basic,
					wLoginUser.getID(), 0);
			wErrorCode.set(wInstanceBasic.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wResultList;
			}

			if (wStateIDList == null) {
				wStateIDList = new ArrayList<>();
			}
			wStateIDList.removeIf(p -> p < 0);

			Calendar wBaseTime = Calendar.getInstance();
			wBaseTime.set(2000, 1, 1);
			if (wPreStartTime == null || wPreStartTime.compareTo(wBaseTime) < 0)
				wPreStartTime = wBaseTime;
			if (wPreEndTime == null || wPreEndTime.compareTo(wBaseTime) < 0)
				wPreEndTime = wBaseTime;
			if (wPreStartTime.compareTo(wPreEndTime) > 0) {
				return wResultList;
			}
			if (wRelStartTime == null || wRelStartTime.compareTo(wBaseTime) < 0)
				wRelStartTime = wBaseTime;
			if (wRelEndTime == null || wRelEndTime.compareTo(wBaseTime) < 0)
				wRelEndTime = wBaseTime;
			if (wRelStartTime.compareTo(wRelEndTime) > 0) {
				return wResultList;
			}

			if (wPartNo == null)
				wPartNo = "";
			if (wOrderNo == null)
				wOrderNo = "";
			if (wBOMNo == null)
				wBOMNo = "";
			String wSQL = StringUtils.Format("SELECT t1.*,t2.WBSNo,t2.CustomerID,t2.ContactCode,t2.No,"
					+ " t2.LinkManID,t2.FactoryID,t2.BusinessUnitID,t2.WorkShopID,t4.MaterialID,"
					+ " t3.MaterialName, t3.MaterialNo,t4.ProductNo,t4.ProductName  FROM {0}.oms_order t1"
					+ " left join {0}.oms_command t2 on t1.CommandID=t2.ID "
					+ " left join {1}.fpc_product t4 on t1.ProductID=t4.ID "
					+ " left join {1}.mss_material t3 on t4.MaterialID=t3.ID "
					+ " WHERE  1=1  and ( :wID <= 0 or :wID = t1.ID ) "
					+ " and ( :wCommandID <= 0 or :wCommandID = t1.CommandID ) "
					+ " and ( :wOrderNo is null or :wOrderNo = '''' or :wOrderNo = t1.OrderNo ) "
					+ " and ( :wLineID <= 0 or :wLineID = t1.LineID ) "
					+ " and ( :wProductID <= 0 or :wProductID = t1.ProductID ) "
					+ " and ( :wMaterialID <= 0 or :wMaterialID = t4.MaterialID ) "
					+ " and ( :wCustomerID <= 0 or :wCustomerID = t2.CustomerID ) "
					+ " and ( :wWorkShopID <= 0 or :wWorkShopID = t2.WorkShopID ) "
					+ " and ( :wPartNo is null or :wPartNo = '''' or :wPartNo = t1.PartNo ) "
					+ " and ( :wBOMNo is null or :wBOMNo = '''' or :wBOMNo = t1.BOMNo ) "
					+ " and ( :wStatus is null or :wStatus = '''' or t1.Status in ({2})) "
					+ " and ( :wPreStartTime <= str_to_date(''2010-01-01'', ''%Y-%m-%d'') or t1.PlanFinishDate <= str_to_date(''2010-01-01'', ''%Y-%m-%d'') or :wPreStartTime <= t1.PlanFinishDate) "
					+ " and ( :wPreEndTime <= str_to_date(''2010-01-01'', ''%Y-%m-%d'') or t1.PlanReceiveDate <= str_to_date(''2010-01-01'', ''%Y-%m-%d'') or :wPreEndTime >= t1.PlanReceiveDate) "
					+ " and ( :wRelStartTime <= str_to_date(''2010-01-01'', ''%Y-%m-%d'') or t1.RealFinishDate <= str_to_date(''2010-01-01'', ''%Y-%m-%d'') or :wRelStartTime <= t1.RealFinishDate) "
					+ " and ( :wRelEndTime <= str_to_date(''2010-01-01'', ''%Y-%m-%d'') or t1.RealReceiveDate <= str_to_date(''2010-01-01'', ''%Y-%m-%d'') or :wRelEndTime >= t1.RealReceiveDate) "
					+ " and ( :wActive <= 0 or :wActive = t1.Active );", wInstance.Result, wInstanceBasic.Result,
					(wStateIDList.size() > 0) ? StringUtils.Join(",", wStateIDList) : "0");
			Map<String, Object> wParamMap = new HashMap<>();

			wParamMap.put("wID", wID);
			wParamMap.put("wCommandID", wCommandID);
			wParamMap.put("wOrderNo", wOrderNo);
			wParamMap.put("wLineID", wLineID);
			wParamMap.put("wProductID", wProductID);
			wParamMap.put("wMaterialID", wMaterialID);
			wParamMap.put("wCustomerID", wCustomerID);
			wParamMap.put("wWorkShopID", wWorkShopID);
			wParamMap.put("wPartNo", wPartNo);
			wParamMap.put("wBOMNo", wBOMNo);
			wParamMap.put("wActive", wActive);
			wParamMap.put("wPreStartTime", wPreStartTime);
			wParamMap.put("wPreEndTime", wPreEndTime);
			wParamMap.put("wRelStartTime", wRelStartTime);
			wParamMap.put("wRelEndTime", wRelEndTime);
			wParamMap.put("wStatus", StringUtils.Join(",", wStateIDList));

			wSQL = DMLChange(wSQL);

			List<Map<String, Object>> wQueryResult = this.nameJdbcTemplate.queryForList(wSQL, wParamMap);

			SetValue(wLoginUser, wResultList, wQueryResult, wErrorCode);
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResultList;
	}

	public List<OMSOrder> APS_QueryOrderByStatus(BMSEmployee wLoginUser, int wWorkShopID, List<Integer> wStateIDList,
			OutResult<Integer> wErrorCode) {
		List<OMSOrder> wResult = new ArrayList<OMSOrder>();
		try {

			Calendar wBaseTime = Calendar.getInstance();
			wBaseTime.set(2000, 1, 1);

			wResult = SelectList(wLoginUser, -1, -1, "", wWorkShopID, -1, -1, -1, -1, "", "", -1, wStateIDList,
					wBaseTime, wBaseTime, wBaseTime, wBaseTime, wErrorCode);

		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.getValue());
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
		}
		return wResult;
	}

	public OMSOrder OMS_QueryOrderByNo(BMSEmployee wLoginUser, String wOrderNo, OutResult<Integer> wErrorCode) {
		OMSOrder wResult = new OMSOrder();
		try {
			wErrorCode.set(0);
			Calendar wBaseTime = Calendar.getInstance();
			wBaseTime.set(2000, 1, 1);

			List<OMSOrder> wList = SelectList(wLoginUser, -1, -1, wOrderNo, -1, -1, -1, -1, -1, "", "", -1, null,
					wBaseTime, wBaseTime, wBaseTime, wBaseTime, wErrorCode);
			if (wList == null || wList.size() != 1)
				return wResult;
			wResult = wList[0];
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.getValue());
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
		}
		return wResult;
	}

	public List<OMSOrder> SelectListByIDList(BMSEmployee wLoginUser, List<Integer> wIDList,
			OutResult<Integer> wErrorCode) {
		List<OMSOrder> wResultList = new ArrayList<>();
		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.APS,
					wLoginUser.getID(), 0);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wResultList;
			}

			ServiceResult<String> wInstanceBasic = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.Basic,
					wLoginUser.getID(), 0);
			wErrorCode.set(wInstanceBasic.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wResultList;
			}
			if (wIDList == null) {
				wIDList = new ArrayList<>();
			}
			String wSQL = StringUtils.Format(
					"SELECT t1.*,t2.WBSNo,t2.CustomerID,t2.ContactCode,t2.No,"
							+ " t2.LinkManID,t2.FactoryID,t2.BusinessUnitID,t2.WorkShopID,t4.MaterialID,"
							+ " t3.MaterialName, t3.MaterialNo,t4.ProductNo,t4.ProductName  FROM {0}.oms_order t1"
							+ " left join {0}.oms_command t2 on t1.CommandID=t2.ID "
							+ " left join {1}.fpc_product t4 on t1.ProductID=t4.ID "
							+ " left join {1}.mss_material t3 on t4.MaterialID=t3.ID "

							+ " WHERE 1=1  and (  :wIDs = '''' or t1.ID in ({2}));",

					wInstance.Result, wInstanceBasic.Result,
					(wIDList.size() > 0) ? StringUtils.Join(",", wIDList) : "0");
			Map<String, Object> wParamMap = new HashMap<>();

			wParamMap.put("wIDs", StringUtils.Join(",", wIDList));

			wSQL = DMLChange(wSQL);

			List<Map<String, Object>> wQueryResult = this.nameJdbcTemplate.queryForList(wSQL, wParamMap);

			SetValue(wLoginUser, wResultList, wQueryResult, wErrorCode);
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResultList;
	}

	public List<OMSOrder> SelectFinishListByTime(BMSEmployee wLoginUser, Calendar wStartTime, Calendar wEndTime,
			OutResult<Integer> wErrorCode) {
		List<OMSOrder> wResultList = new ArrayList<>();
		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.APS,
					wLoginUser.getID(), 0);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wResultList;
			}

			ServiceResult<String> wInstanceBasic = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.Basic,
					wLoginUser.getID(), 0);
			wErrorCode.set(wInstanceBasic.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wResultList;
			}

			Calendar wBaseTime = Calendar.getInstance();
			wBaseTime.set(2000, 0, 1);
			if (wStartTime == null) {
				wStartTime = wBaseTime;
			}
			if (wEndTime == null) {
				wEndTime = wBaseTime;
			}

			String wSQL = StringUtils.Format(
					"SELECT t1.*,t2.WBSNo,t2.CustomerID,t2.ContactCode,t2.No,"
							+ " t2.LinkManID,t2.FactoryID,t2.BusinessUnitID,t2.WorkShopID,t4.MaterialID,"
							+ " t3.MaterialName, t3.MaterialNo,t4.ProductNo,t4.ProductName  FROM {0}.oms_order t1"
							+ " left join {0}.oms_command t2 on t1.CommandID=t2.ID "
							+ " left join {1}.fpc_product t4 on t1.ProductID=t4.ID "
							+ " left join {1}.mss_material t3 on t4.MaterialID=t3.ID "
							+ "WHERE 1=1  and :wStartTime <= t1.RealFinishDate and t1.RealFinishDate <= :wEndTime "
							+ " and t1.Status in({2});",
					wInstance.Result, wInstanceBasic.Result,
					StringUtils.parseList(new Integer[] { OMSOrderStatus.FinishOrder.getValue(),
							OMSOrderStatus.StockOrder.getValue(), OMSOrderStatus.SendOrder.getValue() }));
			Map<String, Object> wParamMap = new HashMap<>();

			wParamMap.put("wStartTime", wStartTime);
			wParamMap.put("wEndTime", wEndTime);

			wSQL = DMLChange(wSQL);

			List<Map<String, Object>> wQueryResult = this.nameJdbcTemplate.queryForList(wSQL, wParamMap);

			SetValue(wLoginUser, wResultList, wQueryResult, wErrorCode);
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResultList;
	}

	public List<OMSOrder> SelectList_RF(BMSEmployee wLoginUser, int wCustomerID, int wWorkShopID, int wLineID,
			int wProductID, String wPartNo, int wActive, Calendar wStartTime, Calendar wEndTime,
			OutResult<Integer> wErrorCode) {
		List<OMSOrder> wResultList = new ArrayList<>();
		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.APS,
					wLoginUser.getID(), 0);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wResultList;
			}
			ServiceResult<String> wInstanceBasic = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.Basic,
					wLoginUser.getID(), 0);
			wErrorCode.set(wInstanceBasic.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wResultList;
			}

			Calendar wBaseTime = Calendar.getInstance();
			wBaseTime.set(2000, 1, 1);
			if ( wStartTime.compareTo(wBaseTime) < 0)
				wStartTime = wBaseTime;
			if ( wEndTime.compareTo(wBaseTime) < 0) {
				wEndTime = wBaseTime;
			}
			if (wEndTime.compareTo(wStartTime) < 0) {
				return wResultList;
			}
			String wSQL = StringUtils.Format(
					"SELECT t1.*,t2.WBSNo,t2.CustomerID,t2.ContactCode,t2.No,"
							+ " t2.LinkManID,t2.FactoryID,t2.BusinessUnitID,t2.WorkShopID,t4.MaterialID,"
							+ " t3.MaterialName, t3.MaterialNo,t4.ProductNo,t4.ProductName  FROM {0}.oms_order t1"
							+ " left join {0}.oms_command t2 on t1.CommandID=t2.ID "
							+ " left join {1}.fpc_product t4 on t1.ProductID=t4.ID "
							+ " left join {1}.mss_material t3 on t4.MaterialID=t3.ID "
							+ " WHERE 1=1 and ( :wCustomerID <= 0 or :wCustomerID = t2.CustomerID ) "
							+ " and ( :wWorkShopID <= 0 or :wWorkShopID = t2.WorkShopID ) "
							+ " and ( :wLineID <= 0 or :wLineID = t1.LineID ) "
							+ " and ( :wProductID <= 0 or :wProductID = t1.ProductID ) "
							+ " and ( :wPartNo is null or :wPartNo = '''' or :wPartNo = t1.PartNo ) "
							+ " and ( :wStartTime <= str_to_date(''2010-01-01'', ''%Y-%m-%d'') "
							+ " or :wEndTime <= str_to_date(''2010-01-01'', ''%Y-%m-%d'') "
							+ " or (:wStartTime <= t1.PlanReceiveDate and t1.PlanReceiveDate<=:wEndTime) "
							+ " or (:wStartTime <= t1.RealReceiveDate and t1.RealReceiveDate<=:wEndTime) "
							+ " or (:wStartTime <= t1.PlanFinishDate and t1.PlanFinishDate<=:wEndTime) "
							+ " or (:wStartTime <= t1.RealStartDate and t1.RealStartDate<=:wEndTime) "
							+ " or (:wStartTime <= t1.RealFinishDate and t1.RealFinishDate<=:wEndTime) "
							+ " or (:wStartTime <= t1.RealSendDate and t1.RealSendDate<=:wEndTime) ) "
							+ " and ( :wActive <= 0 or :wActive = t1.Active );",
					wInstance.Result, wInstanceBasic.Result);
			Map<String, Object> wParamMap = new HashMap<>();

			wParamMap.put("wCustomerID", wCustomerID);
			wParamMap.put("wLineID", wLineID);
			wParamMap.put("wProductID", wProductID);
			wParamMap.put("wWorkShopID", wWorkShopID);
			wParamMap.put("wPartNo", wPartNo);
			wParamMap.put("wStartTime", wStartTime);
			wParamMap.put("wEndTime", wEndTime);
			wParamMap.put("wActive", wActive);

			wSQL = DMLChange(wSQL);

			List<Map<String, Object>> wQueryResult = this.nameJdbcTemplate.queryForList(wSQL, wParamMap);

			SetValue(wLoginUser, wResultList, wQueryResult, wErrorCode);
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResultList;
	}

	public List<OMSOrder> ConditionAll(BMSEmployee wLoginUser, int wProductID, int wWorkShopID, int wLine,
			int wCustomerID, String wWBSNo, Calendar wStartTime, Calendar wEndTime, int wStatus,
			OutResult<Integer> wErrorCode) {
		List<OMSOrder> wResult = new ArrayList<>();
		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.APS,
					wLoginUser.getID(), 0);
			wErrorCode.set(wInstance.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wResult;
			}

			ServiceResult<String> wInstanceBasic = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.Basic,
					wLoginUser.getID(), 0);
			wErrorCode.set(wInstanceBasic.ErrorCode);
			if (wErrorCode.Result != 0) {
				return wResult;
			}

			Calendar wBaseTime = Calendar.getInstance();
			wBaseTime.set(2000, 1, 1);
			if ( wStartTime.compareTo(wBaseTime) < 0)
				wStartTime = wBaseTime;
			if ( wEndTime.compareTo(wBaseTime) < 0) {
				wEndTime = wBaseTime;
			}
			if (wEndTime.compareTo(wStartTime) < 0) {
				return wResult;
			}
			if (StringUtils.isEmpty(wWBSNo)) {
				wWBSNo = "";
			}

			String wSQL = StringUtils.Format(
					"SELECT t1.*,t2.WBSNo,t2.CustomerID,t2.ContactCode,t2.No,"
							+ " t2.LinkManID,t2.FactoryID,t2.BusinessUnitID,t2.WorkShopID, t4.MaterialID,"
							+ " t3.MaterialName, t3.MaterialNo,t4.ProductNo,t4.ProductName  FROM {0}.oms_order t1"
							+ " left join {0}.oms_command t2 on t1.CommandID=t2.ID "
							+ " left join {1}.fpc_product t4 on t1.ProductID=t4.ID "
							+ " left join {1}.mss_material t3 on t4.MaterialID=t3.ID "
							+ " where  1=1 and (:wCustomerID <= 0 or :wCustomerID = t2.CustomerID ) "
							+ " and ( :wWorkShopID <= 0 or :wWorkShopID = t2.WorkShopID ) "
							+ " and ( :wLineID <= 0 or :wLineID = t1.LineID ) "
							+ " and ( :wStatus <= 0 or :wStatus = t1.Status ) "
							+ " and ( :wProductID <= 0 or :wProductID = t1.ProductID ) "
							+ " and ( :wWBSNo is null or :wWBSNo = '''' or t2.WBSNo like ''%{2}%'') "
							+ " and ( :wStartTime <= str_to_date(''2010-01-01'', ''%Y-%m-%d'') "
							+ " or :wEndTime <= str_to_date(''2010-01-01'', ''%Y-%m-%d'') "
							+ " or (:wStartTime <= t1.PlanReceiveDate and t1.PlanReceiveDate<=:wEndTime) "
							+ " or (:wStartTime <= t1.RealReceiveDate and t1.RealReceiveDate<=:wEndTime) "
							+ " or (:wStartTime <= t1.PlanFinishDate and t1.PlanFinishDate<=:wEndTime) "
							+ " or (:wStartTime <= t1.RealStartDate and t1.RealStartDate<=:wEndTime) "
							+ " or (:wStartTime <= t1.RealFinishDate and t1.RealFinishDate<=:wEndTime) "
							+ " or (:wStartTime <= t1.RealSendDate and t1.RealSendDate<=:wEndTime) );",
					wInstance.Result, wInstanceBasic.Result, wWBSNo);
			Map<String, Object> wParamMap = new HashMap<>();

			wParamMap.put("wProductID", wProductID);
			wParamMap.put("wLineID", wLine);
			wParamMap.put("wWorkShopID", wWorkShopID);
			wParamMap.put("wCustomerID", wCustomerID);
			wParamMap.put("wWBSNo", wWBSNo);
			wParamMap.put("wStartTime", wStartTime);
			wParamMap.put("wEndTime", wEndTime);
			wParamMap.put("wStatus", wStatus);

			wSQL = DMLChange(wSQL);

			List<Map<String, Object>> wQueryResult = this.nameJdbcTemplate.queryForList(wSQL, wParamMap);

			SetValue(wLoginUser, wResult, wQueryResult, wErrorCode);
		} catch (Exception e) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
		}
		return wResult;
	}

	public String SelectSubOrderNo(BMSEmployee wLoginUser, int wCommandID, OutResult<Integer> wErrorCode) {
		String wResult = "";
		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.APS,
					wLoginUser.getID(), 0);
			wErrorCode.set(wInstance.ErrorCode);
			if (((Integer) wErrorCode.Result) != 0) {
				return wResult;
			}

			String wSQL = StringUtils
					.Format("SELECT (select WBSNo from {0}.oms_command where ID={1}) as WBSNo, COUNT(*)+1 as MaxID"
							+ " FROM  {0}.oms_command t2  left join  {0}.oms_order t1  on t1.CommandID = t2.ID"
							+ " WHERE t1.CommandID={1};", new Object[] { wInstance.Result, wCommandID });

			Map<String, Object> wParamMap = new HashMap<>();

			wSQL = DMLChange(wSQL);

			List<Map<String, Object>> wQueryResult = this.nameJdbcTemplate.queryForList(wSQL, wParamMap);

			int wMaxID = 0;
			String wWBSNo = "";
			for (Map<String, Object> wMap : wQueryResult) {
				if (wMap.containsKey("MaxID")) {
					wMaxID = StringUtils.parseInt(wMap["MaxID"]);
				}
				if (wMap.containsKey("MaxID")) {
					wWBSNo = StringUtils.parseString(wMap["WBSNo"]);
				}
			}

			if (wMaxID > 0 && StringUtils.isNotEmpty(wWBSNo)) {
				wResult = StringUtils.Format("{0}.{1}", wWBSNo, String.format("%03d", wMaxID));
			}
		} catch (Exception ex) {
			wErrorCode.set(MESException.DBSQL.getValue());
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	/**
	 * 根据季度开始时间和结束时间和产线获取完成数
	 * 
	 * @param wLoginUser
	 * @param wQStart    季度开始时刻
	 * @param wQEnd      季度结束时刻
	 * @param wLineID    产线
	 * @param wErrorCode 错误码
	 * @return 订单完成数
	 */
	public int SelectCountByQuarter(BMSEmployee wLoginUser, Calendar wQStart, Calendar wQEnd, int wLineID,
			OutResult<Integer> wErrorCode) {
		int wResult = 0;
		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.APS,
					wLoginUser.getID(), 0);
			wErrorCode.set(wInstance.ErrorCode);
			if (((Integer) wErrorCode.Result) != 0) {
				return wResult;
			}

			String wSQL = StringUtils.Format("select count(*) as Number From {0}.oms_order "
					+ "where :wStartTime <= RealFinishDate and RealFinishDate <= :wEndTime "
					+ "and LineID = :wLineID and Status in(5,6,7,8);", wInstance.Result);
			Map<String, Object> wParamMap = new HashMap<>();

			wParamMap.put("wStartTime", wQStart);
			wParamMap.put("wEndTime", wQEnd);
			wParamMap.put("wLineID", wLineID);

			wSQL = DMLChange(wSQL);

			List<Map<String, Object>> wQueryResult = this.nameJdbcTemplate.queryForList(wSQL, wParamMap);

			for (Map<String, Object> wReader : wQueryResult) {
				Integer wNumber = StringUtils.parseInt(wReader["Number"]);
				if (wNumber > 0) {
					return wNumber;
				}
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	public String CreateNo(int wNumber) {
		String wResult = "";
		try {
			wResult = StringUtils.Format("PO-{0}", new Object[] { String.format("%07d", new Object[] { wNumber }) });
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
		return wResult;
	}

	private void SetValue(BMSEmployee wLoginUser, List<OMSOrder> wResultList, List<Map<String, Object>> wQueryResult,
			OutResult<Integer> wErrorCode) {
		try {
			FPCRoute wFPCRoute;
			for (Map<String, Object> wReader : wQueryResult) {
				OMSOrder wItem = new OMSOrder();

				wItem.ID = StringUtils.parseInt(wReader["ID"]);
				wItem.CommandID = StringUtils.parseInt(wReader["CommandID"]);
				wItem.ERPID = StringUtils.parseInt(wReader["ERPID"]);
				wItem.OrderNo = StringUtils.parseString(wReader["OrderNo"]);
				wItem.LineID = StringUtils.parseInt(wReader["LineID"]);
				wItem.ProductID = StringUtils.parseInt(wReader["ProductID"]);
				wItem.WorkShopID = StringUtils.parseInt(wReader["WorkShopID"]);
				wItem.CustomerID = StringUtils.parseInt(wReader["CustomerID"]);
				wItem.PartNo = StringUtils.parseString(wReader["PartNo"]);
				wItem.BOMNo = StringUtils.parseString(wReader["BOMNo"]);
				wItem.Priority = StringUtils.parseInt(wReader["Priority"]);
				wItem.Status = StringUtils.parseInt(wReader["Status"]);
				wItem.PlanReceiveDate = StringUtils.parseCalendar(wReader["PlanReceiveDate"]);
				wItem.RealReceiveDate = StringUtils.parseCalendar(wReader["RealReceiveDate"]);
				wItem.PlanFinishDate = StringUtils.parseCalendar(wReader["PlanFinishDate"]);
				wItem.RealStartDate = StringUtils.parseCalendar(wReader["RealStartDate"]);
				wItem.RealFinishDate = StringUtils.parseCalendar(wReader["RealFinishDate"]);
				wItem.RealSendDate = StringUtils.parseCalendar(wReader["RealSendDate"]);
				wItem.Remark = StringUtils.parseString(wReader["Remark"]);
				wItem.CreateID = StringUtils.parseInt(wReader["CreateID"]);
				wItem.CreateTime = StringUtils.parseCalendar(wReader["CreateTime"]);
				wItem.EditID = StringUtils.parseInt(wReader["EditID"]);
				wItem.EditTime = StringUtils.parseCalendar(wReader["EditTime"]);
				wItem.AuditorID = StringUtils.parseInt(wReader["AuditorID"]);
				wItem.AuditTime = StringUtils.parseCalendar(wReader["AuditTime"]);
				wItem.Active = StringUtils.parseInt(wReader["Active"]);
				wItem.RouteID = StringUtils.parseInt(wReader["RouteID"]);
				wItem.TelegraphTime = StringUtils.parseCalendar(wReader["TelegraphTime"]);
				wItem.TelegraphRealTime = StringUtils.parseCalendar(wReader["TelegraphRealTime"]);
				wItem.ProductNo = StringUtils.parseString(wReader["ProductNo"]);
				wItem.MaterialID = StringUtils.parseInt(wReader["MaterialID"]);
				wItem.MaterialNo = StringUtils.parseString(wReader["MaterialNo"]);
				wItem.MaterialName = StringUtils.parseString(wReader["MaterialName"]);
				wItem.ContactCode = StringUtils.parseString(wReader["ContactCode"]);
				wItem.No = StringUtils.parseString(wReader["No"]);
				wItem.LinkManID = StringUtils.parseInt(wReader["LinkManID"]);
				wItem.FactoryID = StringUtils.parseInt(wReader["FactoryID"]);
				wItem.BusinessUnitID = StringUtils.parseInt(wReader["BusinessUnitID"]);
				wItem.FQTYPlan = StringUtils.parseDouble(wReader["FQTYPlan"]);
				wItem.FQTYActual = StringUtils.parseDouble(wReader["FQTYActual"]);
				wItem.FQTYSent = StringUtils.parseDouble(wReader["FQTYSent"]);
				wItem.FQTYBad = StringUtils.parseDouble(wReader["FQTYBad"]);
				wItem.FQTYScrap = StringUtils.parseDouble(wReader["FQTYScrap"]);
				wItem.FQTYReceive = StringUtils.parseDouble(wReader["FQTYReceive"]);
				wItem.WBSNo = StringUtils.parseString(wReader["WBSNo"]);
				wItem.CustomerID = StringUtils.parseInt(wReader["CustomerID"]);
				wItem.LineName = APSConstants.GetFMCLineName(wItem.LineID);
				wItem.Customer = APSConstants.GetCRMCustomerName(wItem.CustomerID);
				wItem.WorkShopName = APSConstants.GetFMCWorkShopName(wItem.WorkShopID);
				wItem.Customer = APSConstants.GetCRMCustomerName(wItem.CustomerID);

				if (wItem.RouteID == 0) {
					wFPCRoute = FMCServiceImpl.getInstance()
							.FPC_QueryRoute(wLoginUser, wItem.LineID, wItem.ProductID, "", wItem.CustomerID)
							.Info(FPCRoute.class);
					wItem.RouteID = wFPCRoute.ID;
					Update(wLoginUser, wItem, wErrorCode);
				}

				wResultList.add(wItem);
			}
		} catch (Exception ex) {
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, ex);
		}
	}

	public void Active(BMSEmployee wLoginUser, List<Integer> wIDList, int wActive, OutResult<Integer> wErrorCode) {
		try {
			ServiceResult<String> wInstance = GetDataBaseName(wLoginUser.getCompanyID(), MESDBSource.APS,
					wLoginUser.getID(), 500903);
			wErrorCode.set(wInstance.ErrorCode);
			if (((Integer) wErrorCode.Result) != 0) {
				return;
			}

			if (wIDList == null || wIDList.size() <= 0)
				return;
			for (Integer wItem : wIDList) {
				OMSOrder wOMSOrder = SelectByID(wLoginUser, wItem, wErrorCode);
				if (wOMSOrder == null || wOMSOrder.ID <= 0) {
					continue;
				}
				if (wActive == 2 && wOMSOrder.Active != 1) {
					wErrorCode.set(MESException.Logic.getValue());
					return;
				}
				wOMSOrder.Active = wActive;
				long wID = Update(wLoginUser, wOMSOrder, wErrorCode);
				if (wID <= 0L)
					break;
			}
		} catch (Exception e) {
			wErrorCode.set(MESException.DBSQL.getValue());
			logger.Error(System.Reflection.MethodBase.GetCurrentMethod().Name, e);
		}
	}

	public static OMSOrderDAO getInstance() {
		if (Instance == null)
			Instance = new OMSOrderDAO();
		return Instance;
	}

}
