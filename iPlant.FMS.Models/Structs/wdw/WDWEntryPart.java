package com.mes.server.service.po.wdw;

import java.io.Serializable;
import java.util.DateTime;

public class WDWEntryPart implements Serializable {
	private static final long serialVersionUID = 1L;

	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0;
	// [DataMember(Name = "OrderID", Order = 1)]
	public int OrderID = 0;
	// [DataMember(Name = "TaskLineID", Order = 2)]
	public int TaskLineID = 0; // 产线任务ID
	// [DataMember(Name = "TaskPartID", Order = 3)]
	public int TaskPartID = 0; // 工段任务ID
	// [DataMember(Name = "TaskStepID", Order = 4)]
	public int TaskStepID = 0; // 工序任务ID
	// [DataMember(Name = "LineID", Order = 5)]
	public int LineID = 0;
	// [DataMember(Name = "PartID", Order = 6)]
	public int PartID = 0;
	// [DataMember(Name = "PartPointID", Order = 7)]
	public int PartPointID = 0;
	// [DataMember(Name = "MaterialNo", Order = 8)]
	public String MaterialNo;
	// [DataMember(Name = "MaterialName", Order = 9)]
	public String MaterialName;
	// [DataMember(Name = "OperatorID", Order = 10)]
	public int OperatorID = 0; // 报工员
	// [DataMember(Name = "InspectorID", Order = 11)]
	public int InspectorID = 0; // 检验员
	// [DataMember(Name = "ReceiverID", Order = 12)]
	public int ReceiverID = 0; // 收料
	// [DataMember(Name = "StockManID", Order = 13)]
	public int StockManID = 0; // 仓库员
	// [DataMember(Name = "SubmitTime", Order = 14)]
	public DateTime SubmitTime = DateTime.Now; // 报工时间
	// [DataMember(Name = "InspectTime", Order = 15)]
	public DateTime InspectTime = DateTime.Now; // 检验时刻
	// [DataMember(Name = "ReceiveTime", Order = 16)]
	public DateTime ReceiveTime = DateTime.Now; // 收料时刻
	// [DataMember(Name = "InStockTime", Order = 17)]
	public DateTime InStockTime = DateTime.Now; // 入库时刻

	// [DataMember(Name = "FQTY", Order = 18)]
	public float FQTY; // 报工数量
	// [DataMember(Name = "FQTYGood", Order = 19)]
	public float FQTYGood; //
	// [DataMember(Name = "FQTYBad", Order = 20)]
	public float FQTYBad;
	// [DataMember(Name = "FQTYInStock", Order = 21)]
	public float FQTYInStock; // 入库数量
	// [DataMember(Name = "Status", Order = 22)]
	public int Status = 0; // 单据状态
	// [DataMember(Name = "Remark", Order = 23)]
	public String Remark;
	// [DataMember(Name = "BackwardID", Order = 24)]
	public int BackwardID = 0; // 下道工序任务
	// [DataMember(Name = "BGMode", Order = 25)]
	public int BGMode = 0; // 报工模式:1.流转报工;2.自动流转;3.检验入库报工；4.报工流转； 5.报工中转；
	// [DataMember(Name = "LableID", Order = 26)]
	public String LableID; // 标签ID
	// [DataMember(Name = "TaskLevel", Order = 27)]
	public int TaskLevel = 0; // 报工任务类型
	// 辅助字段
	// [DataMember(Name = "OrderNo", Order = 28)]
	public String OrderNo;
	// [DataMember(Name = "ProductNo", Order = 29)]
	public String ProductNo;
	// [DataMember(Name = "LineName", Order = 30)]
	public String LineName;
	// [DataMember(Name = "PartName", Order = 31)]
	public String PartName;
	// [DataMember(Name = "PartPointName", Order = 32)]
	public String PartPointName;
	// [DataMember(Name = "OperatorName", Order = 33)]
	public String OperatorName; // 报工员
	// [DataMember(Name = "InspectorName", Order = 34)]
	public String InspectorName; // 检验员
	// [DataMember(Name = "ReceiverkName", Order = 35)]
	public String ReceiverkName; // 收料员
	// [DataMember(Name = "StockManName", Order = 36)]
	public String StockManName; // 入库员
	// [DataMember(Name = "LocationList", Order = 37)]
	public String LocationList; // 入库可选仓位列表

	public WDWEntryPart() {
		this.ID = 0;
		this.OrderID = 0;
		this.TaskLineID = 0;
		this.TaskPartID = 0;
		this.TaskStepID = 0;

		this.LineID = 0;
		this.PartID = 0;
		this.PartPointID = 0;
		this.OperatorID = 0;

		this.InspectorID = 0;
		this.ReceiverID = 0;
		this.StockManID = 0;
		this.TaskLevel = 0;

		this.FQTY = 0.0f;
		this.FQTYGood = 0.0f;
		this.FQTYBad = 0.0f;
		this.FQTYInStock = 0.0f;

		this.OrderNo = "";
		this.ProductNo = "";
		this.LineName = "";
		this.PartName = "";
		this.PartPointName = "";

		this.SubmitTime = DateTime.Now;
		this.InspectTime = DateTime.Now;
		this.ReceiveTime = DateTime.Now;
		this.InStockTime = DateTime.Now;
		this.OperatorName = "";
		this.InspectorName = "";
		this.ReceiverkName = "";
		this.StockManName = "";
		this.Remark = "";
		this.LocationList = "";
		this.MaterialNo = "";
		this.MaterialName = "";
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getOrderID() {
		return OrderID;
	}

	public void setOrderID(int orderID) {
		OrderID = orderID;
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

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
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

	public int getOperatorID() {
		return OperatorID;
	}

	public void setOperatorID(int operatorID) {
		OperatorID = operatorID;
	}

	public int getInspectorID() {
		return InspectorID;
	}

	public void setInspectorID(int inspectorID) {
		InspectorID = inspectorID;
	}

	public int getReceiverID() {
		return ReceiverID;
	}

	public void setReceiverID(int receiverID) {
		ReceiverID = receiverID;
	}

	public int getStockManID() {
		return StockManID;
	}

	public void setStockManID(int stockManID) {
		StockManID = stockManID;
	}

	public DateTime getSubmitTime() {
		return SubmitTime;
	}

	public void setSubmitTime(DateTime submitTime) {
		SubmitTime = submitTime;
	}

	public DateTime getInspectTime() {
		return InspectTime;
	}

	public void setInspectTime(DateTime inspectTime) {
		InspectTime = inspectTime;
	}

	public DateTime getReceiveTime() {
		return ReceiveTime;
	}

	public void setReceiveTime(DateTime receiveTime) {
		ReceiveTime = receiveTime;
	}

	public DateTime getInStockTime() {
		return InStockTime;
	}

	public void setInStockTime(DateTime inStockTime) {
		InStockTime = inStockTime;
	}

	public float getFQTY() {
		return FQTY;
	}

	public void setFQTY(float fQTY) {
		FQTY = fQTY;
	}

	public float getFQTYGood() {
		return FQTYGood;
	}

	public void setFQTYGood(float fQTYGood) {
		FQTYGood = fQTYGood;
	}

	public float getFQTYBad() {
		return FQTYBad;
	}

	public void setFQTYBad(float fQTYBad) {
		FQTYBad = fQTYBad;
	}

	public float getFQTYInStock() {
		return FQTYInStock;
	}

	public void setFQTYInStock(float fQTYInStock) {
		FQTYInStock = fQTYInStock;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public String getRemark() {
		return Remark;
	}

	public void setRemark(String remark) {
		Remark = remark;
	}

	public int getBackwardID() {
		return BackwardID;
	}

	public void setBackwardID(int backwardID) {
		BackwardID = backwardID;
	}

	public int getBGMode() {
		return BGMode;
	}

	public void setBGMode(int bGMode) {
		BGMode = bGMode;
	}

	public String getLableID() {
		return LableID;
	}

	public void setLableID(String lableID) {
		LableID = lableID;
	}

	public int getTaskLevel() {
		return TaskLevel;
	}

	public void setTaskLevel(int taskLevel) {
		TaskLevel = taskLevel;
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

	public String getOperatorName() {
		return OperatorName;
	}

	public void setOperatorName(String operatorName) {
		OperatorName = operatorName;
	}

	public String getInspectorName() {
		return InspectorName;
	}

	public void setInspectorName(String inspectorName) {
		InspectorName = inspectorName;
	}

	public String getReceiverkName() {
		return ReceiverkName;
	}

	public void setReceiverkName(String receiverkName) {
		ReceiverkName = receiverkName;
	}

	public String getStockManName() {
		return StockManName;
	}

	public void setStockManName(String stockManName) {
		StockManName = stockManName;
	}

	public String getLocationList() {
		return LocationList;
	}

	public void setLocationList(String locationList) {
		LocationList = locationList;
	}
}
