package com.mes.server.service.po.erp;

import java.io.Serializable;
import java.util.DateTime;

public class PurchasePlan implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public int ID;// 编号

	public String EvaluationNo;// 合同评审号

	public String RequestPurchaseNo;// 请购单号

	public String Project;// 项目

	public String DrawingNo;// 图号

	public String Version;// 版本号

	public int MaterialID;// 物料编号

	public String MaterialNo;// 物料编码

	public String ProductName;// 产品名称

	public String ProductNo;// 产品规格

	public int ProductID;// 产品编号

	public String TParameter;// 技术参数

	public float FQTY_Request;// 需求量

	public float FQTY_Plan;// 计划采购数

	public int Unit;// 单位

	public String UnitText;// 单位名称

	public float FQTY_Arrival;// 实际到货数量

	public DateTime ArrivalDate = DateTime.Now;// 实际到货日期

	public DateTime ExpectArrivalDate = DateTime.Now;;// 预计到货日期

	public int RSupplierID;// 推荐供应商编号

	public String RSupplierName;// 推荐供应商名称

	public int SupplierID;// 供应商编号

	public String SupplierName;// 供应商

	public String ContractNo;// 合同号

	public int Status;// 状态

	public int Active;// 激活、关闭

	public int CreatorID;

	public int AuditorID;

	public String Creator;

	public String Auditor;

	public DateTime CreateTime = DateTime.Now;;

	public DateTime AuditTime = DateTime.Now;;

	public int BuyerID;// 采购员编号

	public String Buyer;// 采购员

	public PurchasePlan() {
		EvaluationNo = "";
		RequestPurchaseNo = "";
		Project = "";
		DrawingNo = "";
		Version = "";
		MaterialNo = "";
		ProductName = "";
		ProductNo = "";
		TParameter = "";
		UnitText = "";
		ArrivalDate.set(2000, 01, 01);
		ExpectArrivalDate.set(2000, 01, 01);
		RSupplierName = "";
		SupplierName = "";
		ContractNo = "";
		Creator = "";
		Auditor = "";
		CreateTime.set(2000, 01, 01);
		AuditTime.set(2000, 01, 01);
		Buyer = "";
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getEvaluationNo() {
		return EvaluationNo;
	}

	public void setEvaluationNo(String evaluationNo) {
		EvaluationNo = evaluationNo;
	}

	public String getRequestPurchaseNo() {
		return RequestPurchaseNo;
	}

	public void setRequestPurchaseNo(String requestPurchaseNo) {
		RequestPurchaseNo = requestPurchaseNo;
	}

	public String getProject() {
		return Project;
	}

	public void setProject(String project) {
		Project = project;
	}

	public String getDrawingNo() {
		return DrawingNo;
	}

	public void setDrawingNo(String drawingNo) {
		DrawingNo = drawingNo;
	}

	public String getVersion() {
		return Version;
	}

	public void setVersion(String version) {
		Version = version;
	}

	public int getMaterialID() {
		return MaterialID;
	}

	public void setMaterialID(int materialID) {
		MaterialID = materialID;
	}

	public String getMaterialNo() {
		return MaterialNo;
	}

	public void setMaterialNo(String materialNo) {
		MaterialNo = materialNo;
	}

	public String getProductName() {
		return ProductName;
	}

	public void setProductName(String productName) {
		ProductName = productName;
	}

	public String getProductNo() {
		return ProductNo;
	}

	public void setProductNo(String productNo) {
		ProductNo = productNo;
	}

	public int getProductID() {
		return ProductID;
	}

	public void setProductID(int productID) {
		ProductID = productID;
	}

	public String getTParameter() {
		return TParameter;
	}

	public void setTParameter(String tParameter) {
		TParameter = tParameter;
	}

	public float getFQTY_Request() {
		return FQTY_Request;
	}

	public void setFQTY_Request(float fQTY_Request) {
		FQTY_Request = fQTY_Request;
	}

	public float getFQTY_Plan() {
		return FQTY_Plan;
	}

	public void setFQTY_Plan(float fQTY_Plan) {
		FQTY_Plan = fQTY_Plan;
	}

	public int getUnit() {
		return Unit;
	}

	public void setUnit(int unit) {
		Unit = unit;
	}

	public String getUnitText() {
		return UnitText;
	}

	public void setUnitText(String unitText) {
		UnitText = unitText;
	}

	public float getFQTY_Arrival() {
		return FQTY_Arrival;
	}

	public void setFQTY_Arrival(float fQTY_Arrival) {
		FQTY_Arrival = fQTY_Arrival;
	}

	public DateTime getArrivalDate() {
		return ArrivalDate;
	}

	public void setArrivalDate(DateTime arrivalDate) {
		ArrivalDate = arrivalDate;
	}

	public DateTime getExpectArrivalDate() {
		return ExpectArrivalDate;
	}

	public void setExpectArrivalDate(DateTime expectArrivalDate) {
		ExpectArrivalDate = expectArrivalDate;
	}

	public int getRSupplierID() {
		return RSupplierID;
	}

	public void setRSupplierID(int rSupplierID) {
		RSupplierID = rSupplierID;
	}

	public String getRSupplierName() {
		return RSupplierName;
	}

	public void setRSupplierName(String rSupplierName) {
		RSupplierName = rSupplierName;
	}

	public int getSupplierID() {
		return SupplierID;
	}

	public void setSupplierID(int supplierID) {
		SupplierID = supplierID;
	}

	public String getSupplierName() {
		return SupplierName;
	}

	public void setSupplierName(String supplierName) {
		SupplierName = supplierName;
	}

	public String getContractNo() {
		return ContractNo;
	}

	public void setContractNo(String contractNo) {
		ContractNo = contractNo;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public int getCreatorID() {
		return CreatorID;
	}

	public void setCreatorID(int creatorID) {
		CreatorID = creatorID;
	}

	public int getAuditorID() {
		return AuditorID;
	}

	public void setAuditorID(int auditorID) {
		AuditorID = auditorID;
	}

	public String getCreator() {
		return Creator;
	}

	public void setCreator(String creator) {
		Creator = creator;
	}

	public String getAuditor() {
		return Auditor;
	}

	public void setAuditor(String auditor) {
		Auditor = auditor;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public DateTime getAuditTime() {
		return AuditTime;
	}

	public void setAuditTime(DateTime auditTime) {
		AuditTime = auditTime;
	}

	public int getBuyerID() {
		return BuyerID;
	}

	public void setBuyerID(int buyerID) {
		BuyerID = buyerID;
	}

	public String getBuyer() {
		return Buyer;
	}

	public void setBuyer(String buyer) {
		Buyer = buyer;
	}
}
