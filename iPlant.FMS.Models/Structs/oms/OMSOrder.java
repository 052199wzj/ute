package com.mes.aps.server.service.po.oms;

import java.io.Serializable;
import java.util.Calendar;

/**
 * 订单
 * 
 * @author PengYouWang
 * @CreateTime 2019年12月27日12:54:19
 * @LastEditTime 2020-6-4 21:34:55
 *
 */
public class OMSOrder implements Serializable {

	/**
	 * 序列号
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 唯一编号
	 */
	public int ID;
	/**
	 * 生产命令票ID
	 */
	public int CommandID;
	/**
	 * ERPID
	 */
	
	/**
	 * 制造令编号
	 */
	public String OrderNo = "";
	/**
	 * 产线ID
	 */
	public int LineID;
	/**
	 * 产线
	 */
	public String LineName = "";
	/**
	 * 产品规格ID
	 */
	public int ProductID;
	/**
	 * 产品规格编码
	 */
	public String ProductNo = "";

	public int MaterialID = 0;

	public String MaterialName = "";

	public String MaterialNo = "";

	public int WorkShopID = 0;

	public String WorkShopName = "";
	/**
	 * 车号
	 */


	/**
	 * BOM编号
	 */
	public String BOMNo = "";
	/**
	 * 优先级
	 */
	public int Priority = 0;
	/**
	 * 台车订单状态
	 */
	public int Status;
	/**
	 * ERP计划开工日期   
	 */
	public Calendar PlanReceiveDate = Calendar.getInstance();
	/**
	 * 周计划开工日期
	 */
	public Calendar RealReceiveDate = Calendar.getInstance();
	/**
	 * ERP计划完工日期
	 */
	public Calendar PlanFinishDate = Calendar.getInstance();
	/**
	 * 实际开工日期   开工日期
	 */
	public Calendar RealStartDate = Calendar.getInstance();
	/**
	 * 实际完工日期    完工日期
	 */
	public Calendar RealFinishDate = Calendar.getInstance();
	/**
	 * 实际发货日期   上传信息日期
	 */
	public Calendar RealSendDate = Calendar.getInstance();
	/**
	 * 备注信息
	 */
	public String Remark = "";
	/**
	 * 创建人ID
	 */
	public int CreateID;
	/**
	 * 创建人名称
	 */
	public String Creator = "";
	/**
	 * 创建时刻
	 */
	public Calendar CreateTime = Calendar.getInstance();
	/**
	 * 编辑人ID
	 */
	public int EditID;
	/**
	 * 编辑人名称
	 */
	public String Editor = "";
	/**
	 * 编辑时刻
	 */
	public Calendar EditTime = Calendar.getInstance();
	/**
	 * 审核人ID
	 */
	public int AuditorID = 0;
	/**
	 * 审核人Name
	 */
	public String Auditor = "";
	/**
	 * 审核时刻   下达日期
	 */
	public Calendar AuditTime = Calendar.getInstance();
	/**
	 * 订单有效状态
	 */
	public int Active = 0;
	/**
	 * 工艺路线ID
	 */
	public int RouteID = 0;
	/**
	 * 周计划完工日期
	 */
	public Calendar TelegraphTime = Calendar.getInstance();
	/**
	 * 预计发货日期
	 */
	public Calendar TelegraphRealTime = Calendar.getInstance();

	// Command表属性
	/**
	 * 评审单编号
	 */
	public String WBSNo = "";
	public int CustomerID = 0;
	public String Customer = "";
	public String ContactCode = "";
	public String No = "";
	public int LinkManID;
	public String LinkMan = "";
	public int FactoryID;
	public String Factory = "";
	public int BusinessUnitID;
	public String BusinessUnit = "";
	public Double FQTYPlan = 0.0;
	public Double FQTYActual = 0.0;
	public Double FQTYBad = 0.0;
	public Double FQTYScrap = 0.0;
	public Double FQTYSent = 0.0;

	public Double FQTYMust = 0.0;

	public Double FQTYReceive = 0.0;

	public OMSOrder() {
		PlanReceiveDate.set(2000, 0, 1);
		RealReceiveDate.set(2000, 0, 1);
		PlanFinishDate.set(2000, 0, 1);
		RealStartDate.set(2000, 0, 1);
		RealFinishDate.set(2000, 0, 1);
		RealSendDate.set(2000, 0, 1);
		CreateTime.set(2000, 0, 1);
		EditTime.set(2000, 0, 1);
		AuditTime.set(2000, 0, 1);
		TelegraphTime.set(2000, 0, 1);
		TelegraphRealTime.set(2000, 0, 1);
	}

	public int getRouteID() {
		return RouteID;
	}

	public void setRouteID(int routeID) {
		RouteID = routeID;
	}

	public int getCommandID() {
		return CommandID;
	}

	public void setCommandID(int commandID) {
		CommandID = commandID;
	}

	public int getID() {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getERPID() {
		return ERPID;
	}

	public void setERPID(int eRPID) {
		ERPID = eRPID;
	}

	public String getOrderNo() {
		return OrderNo;
	}

	public void setOrderNo(String orderNo) {
		OrderNo = orderNo;
	}

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
	}

	public String getLineName() {
		return LineName;
	}

	public void setLineName(String lineName) {
		LineName = lineName;
	}

	public int getProductID() {
		return ProductID;
	}

	public void setProductID(int productID) {
		ProductID = productID;
	}

	public String getProductNo() {
		return ProductNo;
	}

	public void setProductNo(String productNo) {
		ProductNo = productNo;
	}

	public String getWBSNo() {
		return WBSNo;
	}

	public void setWBSNo(String wBSNo) {
		WBSNo = wBSNo;
	}

	public String getPartNo() {
		return PartNo;
	}

	public void setPartNo(String partNo) {
		PartNo = partNo;
	}

	public String getBOMNo() {
		return BOMNo;
	}

	public void setBOMNo(String bOMNo) {
		BOMNo = bOMNo;
	}

	public int getPriority() {
		return Priority;
	}

	public void setPriority(int priority) {
		Priority = priority;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public Calendar getPlanReceiveDate() {
		return PlanReceiveDate;
	}

	public void setPlanReceiveDate(Calendar planReceiveDate) {
		PlanReceiveDate = planReceiveDate;
	}

	public Calendar getRealReceiveDate() {
		return RealReceiveDate;
	}

	public void setRealReceiveDate(Calendar realReceiveDate) {
		RealReceiveDate = realReceiveDate;
	}

	public Calendar getPlanFinishDate() {
		return PlanFinishDate;
	}

	public void setPlanFinishDate(Calendar planFinishDate) {
		PlanFinishDate = planFinishDate;
	}

	public Calendar getRealStartDate() {
		return RealStartDate;
	}

	public void setRealStartDate(Calendar realStartDate) {
		RealStartDate = realStartDate;
	}

	public Calendar getRealFinishDate() {
		return RealFinishDate;
	}

	public void setRealFinishDate(Calendar realFinishDate) {
		RealFinishDate = realFinishDate;
	}

	public Calendar getRealSendDate() {
		return RealSendDate;
	}

	public void setRealSendDate(Calendar realSendDate) {
		RealSendDate = realSendDate;
	}

	public String getRemark() {
		return Remark;
	}

	public void setRemark(String remark) {
		Remark = remark;
	}

	public int getCreateID() {
		return CreateID;
	}

	public void setCreateID(int createID) {
		CreateID = createID;
	}

	public String getCreator() {
		return Creator;
	}

	public void setCreator(String creator) {
		Creator = creator;
	}

	public Calendar getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(Calendar createTime) {
		CreateTime = createTime;
	}

	public int getEditID() {
		return EditID;
	}

	public void setEditID(int editID) {
		EditID = editID;
	}

	public String getEditor() {
		return Editor;
	}

	public void setEditor(String editor) {
		Editor = editor;
	}

	public Calendar getEditTime() {
		return EditTime;
	}

	public void setEditTime(Calendar editTime) {
		EditTime = editTime;
	}

	public int getAuditorID() {
		return AuditorID;
	}

	public void setAuditorID(int auditorID) {
		AuditorID = auditorID;
	}

	public String getAuditor() {
		return Auditor;
	}

	public void setAuditor(String auditor) {
		Auditor = auditor;
	}

	public Calendar getAuditTime() {
		return AuditTime;
	}

	public void setAuditTime(Calendar auditTime) {
		AuditTime = auditTime;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public Calendar getTelegraphTime() {
		return TelegraphTime;
	}

	public void setTelegraphTime(Calendar telegraphTime) {
		TelegraphTime = telegraphTime;
	}

	public int getCustomerID() {
		return CustomerID;
	}

	public void setCustomerID(int customerID) {
		CustomerID = customerID;
	}

	public String getCustomer() {
		return Customer;
	}

	public void setCustomer(String customer) {
		Customer = customer;
	}

	public String getContactCode() {
		return ContactCode;
	}

	public void setContactCode(String contactCode) {
		ContactCode = contactCode;
	}

	public String getNo() {
		return No;
	}

	public void setNo(String no) {
		No = no;
	}

	public int getLinkManID() {
		return LinkManID;
	}

	public void setLinkManID(int linkManID) {
		LinkManID = linkManID;
	}

	public String getLinkMan() {
		return LinkMan;
	}

	public void setLinkMan(String linkMan) {
		LinkMan = linkMan;
	}

	public int getFactoryID() {
		return FactoryID;
	}

	public void setFactoryID(int factoryID) {
		FactoryID = factoryID;
	}

	public String getFactory() {
		return Factory;
	}

	public void setFactory(String factory) {
		Factory = factory;
	}

	public int getBusinessUnitID() {
		return BusinessUnitID;
	}

	public void setBusinessUnitID(int businessUnitID) {
		BusinessUnitID = businessUnitID;
	}

	public String getBusinessUnit() {
		return BusinessUnit;
	}

	public void setBusinessUnit(String businessUnit) {
		BusinessUnit = businessUnit;
	}

	public Calendar getTelegraphRealTime() {
		return TelegraphRealTime;
	}

	public void setTelegraphRealTime(Calendar telegraphRealTime) {
		TelegraphRealTime = telegraphRealTime;
	}

	public Double getFQTYPlan() {
		return FQTYPlan;
	}

	public void setFQTYPlan(Double fQTYPlan) {
		FQTYPlan = fQTYPlan;
	}

	public Double getFQTYActual() {
		return FQTYActual;
	}

	public void setFQTYActual(Double fQTYActual) {
		FQTYActual = fQTYActual;
	}
}
