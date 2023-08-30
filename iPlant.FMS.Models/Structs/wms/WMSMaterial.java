package com.mes.server.service.po.wms;

import java.io.Serializable;
import java.util.List;
import java.util.List;

public class WMSMaterial implements Serializable {
	private static final long serialVersionUID = 1L;

	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0;
	// [DataMember(Name = "MaterialNo", Order = 1)]
	public String MaterialNo = "";
	// [DataMember(Name = "MaterialName", Order = 2)]
	public String MaterialName = "";
	// [DataMember(Name = "FQTYPlan", Order = 3)]
	public float FQTYPlan= 0.0f;; // 实际计划数
	// [DataMember(Name = "FQTYMargin", Order = 4)]
	public float FQTYMargin= 0.0f;; // 剩余配料数--计算用途
	// [DataMember(Name = "FQTYPL", Order = 5)]
	public float FQTYPL= 0.0f;; // 配料数
	// [DataMember(Name = "FQTYLL", Order = 6)]
	public float FQTYLL= 0.0f;; // 领料数
	// [DataMember(Name = "LineID", Order = 7)]
	public int LineID = 0;
	// [DataMember(Name = "TaskLineID", Order = 8)]
	public int TaskLineID = 0;
	// [DataMember(Name = "TaskPartID", Order = 9)]
	public int TaskPartID = 0;
	// [DataMember(Name = "TaskStepID", Order = 10)]
	public int TaskStepID = 0;
	// [DataMember(Name = "Active", Order = 11)]
	public int Active = 0;
	// [DataMember(Name = "PlanerID", Order = 12)]
	public int PlanerID = 0; // 计划员ID
	// [DataMember(Name = "LocationPlanList", Order = 13)]
	public List<WMSMaterialLocation> LocationPlanList = new List<>(); // 物料仓位取料计划
	// 辅助计算舒属性
	// [DataMember(Name = "MaterialUnit", Order = 14)]
	public float MaterialUnit= 0.0f;
	// [DataMember(Name = "MaterialMode", Order = 15)]
	public int MaterialMode = 0;
	// [DataMember(Name = "MaterialSubMode", Order = 16)]
	public int MaterialSubMode = 0;
	// [DataMember(Name = "ERPEntryID", Order = 17)]
	public int ERPEntryID = 0; // ERP用料清单实体ID
	// [DataMember(Name = "FQTYOnSite", Order = 18)]
	public float FQTYOnSite= 0.0f; // 线上库存
	// [DataMember(Name = "FQTYBase", Order = 19)]
	public float FQTYBase= 0.0f; // 需求量
	// [DataMember(Name = "Type", Order = 20)]
	public int Type = 0; // 任务类型（配料或补料）
	// [DataMember(Name = "Status", Order = 21)]
	public int Status = 0; // 审批状态
	// [DataMember(Name = "StationID", Order = 22)]
	public int StationID = 0; // 物料配送点ID=LineID*10000+PartID*100+PartPointID;
	// [DataMember(Name = "PartID", Order = 23)]
	public int PartID = 0;
	// [DataMember(Name = "PartPointID", Order = 24)]
	public int PartPointID = 0;
	// [DataMember(Name = "ShiftID", Order = 25)]
	public int ShiftID = 0; // 审批状态
	// [DataMember(Name = "PLOperatorID", Order = 26)]
	public int PLOperatorID = 0; // 配料员ID
	//
	// [DataMember(Name = "OrderNo", Order = 27)]
	public String OrderNo = "";
	// [DataMember(Name = "ProductNo", Order = 28)]
	public String ProductNo = "";
	// [DataMember(Name = "PLOperatorName", Order = 29)]
	public String PLOperatorName = "";

	// [DataMember(Name = "WorkShopName", Order = 30)]
	public String WorkShopName = "";
	// [DataMember(Name = "LineName", Order = 31)]
	public String LineName = "";
	// [DataMember(Name = "PartName", Order = 32)]
	public String PartName = "";
	// [DataMember(Name = "PartPointName", Order = 33)]
	public String PartPointName = "";
	// [DataMember(Name = "MaterialID", Order = 34)]
	public int MaterialID = 0;
	// [DataMember(Name = "PlanerName", Order = 35)]
	public String PlanerName = "";

	public WMSMaterial() {
		this.ID = 0;
		this.MaterialNo = "";
		this.MaterialName = "";
		this.FQTYPlan = 0.0f;
		this.FQTYMargin = 0.0f;
		this.FQTYPL = 0.0f;
		this.FQTYLL = 0.0f;
		

		this.LineID = 0;
		this.TaskLineID = 0;
		this.TaskPartID = 0;
		this.TaskStepID = 0;
		this.Active = 0;
		this.PlanerID = 0;
		
		this.MaterialUnit = 0.0f;
		this.MaterialMode = 0;
		this.MaterialSubMode = 0;
		this.ERPEntryID = 0;
		this.FQTYOnSite = 0.0f;
		this.FQTYBase = 0.0f;
		this.Type = 0;
		this.Status = 0;
		this.StationID = 0;
		this.PartID = 0;
		this.PartPointID = 0;
		this.ShiftID = 0;
		this.PLOperatorID = 0;
		this.MaterialID = 0;

		this.OrderNo = "";
		this.ProductNo = "";
		this.PLOperatorName = "";
		this.WorkShopName = "";
		this.LineName = "";
		this.PartName = "";
		this.PartPointName = "";

		this.PlanerName = "";
		this.LocationPlanList = new List<>();
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getMaterialNo() {
		return MaterialNo;
	}

	public void setMaterialNo(String materialNo) {
		MaterialNo = materialNo;
	}

	public String getMaterialName() {
		return MaterialName;
	}

	public void setMaterialName(String materialName) {
		MaterialName = materialName;
	}

	public float getFQTYPlan() {
		return FQTYPlan;
	}

	public void setFQTYPlan(float fQTYPlan) {
		FQTYPlan = fQTYPlan;
	}

	public float getFQTYMargin() {
		return FQTYMargin;
	}

	public void setFQTYMargin(float fQTYMargin) {
		FQTYMargin = fQTYMargin;
	}

	public float getFQTYPL() {
		return FQTYPL;
	}

	public void setFQTYPL(float fQTYPL) {
		FQTYPL = fQTYPL;
	}

	public float getFQTYLL() {
		return FQTYLL;
	}

	public void setFQTYLL(float fQTYLL) {
		FQTYLL = fQTYLL;
	}

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
	}

	public int getTaskLineID() {
		return TaskLineID;
	}

	public void setTaskLineID(int taskLineID) {
		TaskLineID = taskLineID;
	}

	public int getTaskPartID() {
		return TaskPartID;
	}

	public void setTaskPartID(int taskPartID) {
		TaskPartID = taskPartID;
	}

	public int getTaskStepID() {
		return TaskStepID;
	}

	public void setTaskStepID(int taskStepID) {
		TaskStepID = taskStepID;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public int getPlanerID() {
		return PlanerID;
	}

	public void setPlanerID(int planerID) {
		PlanerID = planerID;
	}

	public List<WMSMaterialLocation> getLocationPlanList() {
		return LocationPlanList;
	}

	public void setLocationPlanList(List<WMSMaterialLocation> locationPlanList) {
		LocationPlanList = locationPlanList;
	}

	public float getMaterialUnit() {
		return MaterialUnit;
	}

	public void setMaterialUnit(float materialUnit) {
		MaterialUnit = materialUnit;
	}

	public int getMaterialMode() {
		return MaterialMode;
	}

	public void setMaterialMode(int materialMode) {
		MaterialMode = materialMode;
	}

	public int getMaterialSubMode() {
		return MaterialSubMode;
	}

	public void setMaterialSubMode(int materialSubMode) {
		MaterialSubMode = materialSubMode;
	}

	public int getERPEntryID() {
		return ERPEntryID;
	}

	public void setERPEntryID(int eRPEntryID) {
		ERPEntryID = eRPEntryID;
	}

	public float getFQTYOnSite() {
		return FQTYOnSite;
	}

	public void setFQTYOnSite(float fQTYOnSite) {
		FQTYOnSite = fQTYOnSite;
	}

	public float getFQTYBase() {
		return FQTYBase;
	}

	public void setFQTYBase(float fQTYBase) {
		FQTYBase = fQTYBase;
	}

	public int getType() {
		return Type;
	}

	public void setType(int type) {
		Type = type;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public int getStationID() {
		return StationID;
	}

	public void setStationID(int stationID) {
		StationID = stationID;
	}

	public int getPartID() {
		return PartID;
	}

	public void setPartID(int partID) {
		PartID = partID;
	}

	public int getPartPointID() {
		return PartPointID;
	}

	public void setPartPointID(int partPointID) {
		PartPointID = partPointID;
	}

	public int getShiftID() {
		return ShiftID;
	}

	public void setShiftID(int shiftID) {
		ShiftID = shiftID;
	}

	public int getPLOperatorID() {
		return PLOperatorID;
	}

	public void setPLOperatorID(int pLOperatorID) {
		PLOperatorID = pLOperatorID;
	}

	public String getOrderNo() {
		return OrderNo;
	}

	public void setOrderNo(String orderNo) {
		OrderNo = orderNo;
	}

	public String getProductNo() {
		return ProductNo;
	}

	public void setProductNo(String productNo) {
		ProductNo = productNo;
	}

	public String getPLOperatorName() {
		return PLOperatorName;
	}

	public void setPLOperatorName(String pLOperatorName) {
		PLOperatorName = pLOperatorName;
	}

	public String getWorkShopName() {
		return WorkShopName;
	}

	public void setWorkShopName(String workShopName) {
		WorkShopName = workShopName;
	}

	public String getLineName() {
		return LineName;
	}

	public void setLineName(String lineName) {
		LineName = lineName;
	}

	public String getPartName() {
		return PartName;
	}

	public void setPartName(String partName) {
		PartName = partName;
	}

	public String getPartPointName() {
		return PartPointName;
	}

	public void setPartPointName(String partPointName) {
		PartPointName = partPointName;
	}

	public int getMaterialID() {
		return MaterialID;
	}

	public void setMaterialID(int materialID) {
		MaterialID = materialID;
	}

	public String getPlanerName() {
		return PlanerName;
	}

	public void setPlanerName(String planerName) {
		PlanerName = planerName;
	}
}
