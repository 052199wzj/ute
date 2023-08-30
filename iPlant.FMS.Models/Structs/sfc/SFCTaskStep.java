package com.mes.server.service.po.sfc;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class SFCTaskStep implements Serializable {
	private static final long serialVersionUID = 1L;
	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0;
	// [DataMember(Name = "OrderID", Order = 1)]
	public int OrderID = 0;
	// [DataMember(Name = "TaskLineID", Order = 2)]
	public int TaskLineID = 0;
	// [DataMember(Name = "TaskPartID", Order = 3)]
	public int TaskPartID = 0;
	// [DataMember(Name = "LineID", Order = 4)]
	public int LineID = 0;
	// [DataMember(Name = "PartID", Order = 5)]
	public int PartID = 0;
	// [DataMember(Name = "PartPointID", Order = 6)]
	public int PartPointID = 0;
	// [DataMember(Name = "FQTYShift", Order = 7)]
	public int FQTYShift = 0;// 计划班产
	// [DataMember(Name = "FQTYParts", Order = 8)]
	public int FQTYParts = 0; // 实时产量
	// [DataMember(Name = "FQTYDone", Order = 9)]
	public int FQTYDone = 0; // 报工产量
	// [DataMember(Name = "ShiftID", Order = 10)]
	public int ShiftID = 0; // 班次
	// [DataMember(Name = "ProductID", Order = 11)]
	public int ProductID = 0; // 产品ID
	// [DataMember(Name = "StartTime", Order = 12)]
	public DateTime StartTime = DateTime.Now;
	// [DataMember(Name = "EndTime", Order = 13)]
	public DateTime EndTime = DateTime.Now;
	// [DataMember(Name = "Status", Order = 14)]
	public int Status = 0; // 状态
	// 订单、工序段辅助属性
	// [DataMember(Name = "OrderNo", Order = 15)]
	public String OrderNo = "";
	// [DataMember(Name = "ProductNo", Order = 16)]
	public String ProductNo = "";
	// [DataMember(Name = "PartName", Order = 17)]
	public String PartName = "";
	// [DataMember(Name = "MaterialNo", Order = 18)]
	public String MaterialNo = "";
	// [DataMember(Name = "MaterialName", Order = 19)]
	public String MaterialName = "";
	// [DataMember(Name = "PlanerID", Order = 20)]
	public int PlanerID = 0;
	// [DataMember(Name = "PlanerName", Order = 21)]
	public String PlanerName = "";
	// [DataMember(Name = "PartPointName", Order = 22)]
	public String PartPointName = "";
	// [DataMember(Name = "LineName", Order = 23)]
	public String LineName = "";
	// [DataMember(Name = "StepOrderID", Order = 24)]
	public int StepOrderID = 0; // 工序先后循序ID
	// [DataMember(Name = "TaskText", Order = 25)]
	public String TaskText = "";
	// [DataMember(Name = "ShiftDate", Order = 26)]
	public DateTime ShiftDate = DateTime.Now; // 任务计划日期
	// [DataMember(Name = "MaterialList", Order = 27)]
	public List<SFCMaterial> MaterialList = new List<>(); // 物料需求列表
	// [DataMember(Name = "MaterialCheck", Order = 28)]
	public boolean MaterialCheck = false;
	// [DataMember(Name = "MaterialCheckID", Order = 29)]
	public int MaterialCheckID = 0;
	// [DataMember(Name = "MaterialCheckList", Order = 30)]
	public List<SFCMaterialCheck> MaterialCheckList = new List<>(); // 齐套检查日志
	// [DataMember(Name = "PartLoggerList", Order = 31)]
	public List<SFCPartLogger> PartLoggerList = new List<>(); // 工件明细数量
	// [DataMember(Name = "WLMode", Order = 32)]
	public int WLMode = 0; // 物料：物料保障；1.人工配料(配料点)；2：上道自动流转；3.上道人工流转
	// [DataMember(Name = "BGMode", Order = 33)]
	public int BGMode = 0; // 报工方式：1.流转报工；2.自动流转;3.入库检报工

	// 优化设计
	public SFCTaskStep() {
		this.ID = 0;
		this.OrderID = 0;
		this.TaskLineID = 0;
		this.TaskPartID = 0;
		this.LineID = 0;

		this.PartID = 0;
		this.PartPointID = 0;
		this.FQTYShift = 0;
		this.FQTYParts = 0;
		this.FQTYDone = 0;

		this.ShiftID = 0;
		this.ProductID = 0;
		this.Status = 0;
		this.PlanerID = 0;
		this.MaterialCheckID = 0;

		this.StepOrderID = 0;
		this.WLMode = 0;
		this.BGMode = 0;
		this.MaterialCheck = false;

		this.OrderNo = "";
		this.ProductNo = "";
		this.LineName = "";
		this.PartName = "";
		this.PartPointName = "";

		this.MaterialNo = "";
		this.MaterialName = "";
		this.PlanerName = "";
		this.TaskText = "";

		this.StartTime = DateTime.Now;
		this.EndTime = DateTime.Now;
		this.ShiftDate = DateTime.Now;

		this.MaterialList = new List<>();
		this.MaterialCheckList = new List<>();
		this.PartLoggerList = new List<>();
	}

	public SFCTaskStep Clone() {
		SFCTaskStep wTaskStep = new SFCTaskStep();
		wTaskStep.ID = this.ID;
		wTaskStep.OrderID = this.OrderID;
		wTaskStep.TaskLineID = this.TaskLineID;
		wTaskStep.TaskPartID = this.TaskPartID;
		wTaskStep.LineID = this.LineID;
		wTaskStep.PartID = this.PartID;
		wTaskStep.PartPointID = this.PartPointID;

		wTaskStep.FQTYShift = this.FQTYShift;
		wTaskStep.FQTYParts = this.FQTYParts;
		wTaskStep.FQTYDone = this.FQTYDone;
		wTaskStep.ShiftID = this.ShiftID;
		wTaskStep.ProductID = this.ProductID;

		wTaskStep.StartTime = this.StartTime;
		wTaskStep.EndTime = this.EndTime;
		wTaskStep.Status = this.Status;
		wTaskStep.OrderNo = this.OrderNo;
		wTaskStep.ProductNo = this.ProductNo;

		wTaskStep.PartName = this.PartName;
		wTaskStep.MaterialNo = this.MaterialNo;
		wTaskStep.MaterialName = this.MaterialName;
		wTaskStep.PlanerID = this.PlanerID;
		wTaskStep.PlanerName = this.PlanerName;

		wTaskStep.LineName = this.LineName;
		wTaskStep.StepOrderID = this.StepOrderID;
		wTaskStep.TaskText = this.TaskText;
		wTaskStep.MaterialCheck = this.MaterialCheck;
		wTaskStep.ShiftDate = this.ShiftDate;

		wTaskStep.WLMode = this.WLMode;
		wTaskStep.BGMode = this.BGMode;
		wTaskStep.MaterialCheckID = this.MaterialCheckID;
		wTaskStep.MaterialList = new List<SFCMaterial>(this.MaterialList);
		wTaskStep.PartLoggerList = new List<SFCPartLogger>(this.PartLoggerList);
		wTaskStep.MaterialCheckList = new List<SFCMaterialCheck>(this.MaterialCheckList);
		return wTaskStep;
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

	public int getFQTYShift() {
		return FQTYShift;
	}

	public void setFQTYShift(int fQTYShift) {
		FQTYShift = fQTYShift;
	}

	public int getFQTYParts() {
		return FQTYParts;
	}

	public void setFQTYParts(int fQTYParts) {
		FQTYParts = fQTYParts;
	}

	public int getFQTYDone() {
		return FQTYDone;
	}

	public void setFQTYDone(int fQTYDone) {
		FQTYDone = fQTYDone;
	}

	public int getShiftID() {
		return ShiftID;
	}

	public void setShiftID(int shiftID) {
		ShiftID = shiftID;
	}

	public int getProductID() {
		return ProductID;
	}

	public void setProductID(int productID) {
		ProductID = productID;
	}

	public DateTime getStartTime() {
		return StartTime;
	}

	public void setStartTime(DateTime startTime) {
		StartTime = startTime;
	}

	public DateTime getEndTime() {
		return EndTime;
	}

	public void setEndTime(DateTime endTime) {
		EndTime = endTime;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
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

	public String getPartName() {
		return PartName;
	}

	public void setPartName(String partName) {
		PartName = partName;
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

	public int getPlanerID() {
		return PlanerID;
	}

	public void setPlanerID(int planerID) {
		PlanerID = planerID;
	}

	public String getPlanerName() {
		return PlanerName;
	}

	public void setPlanerName(String planerName) {
		PlanerName = planerName;
	}

	public String getPartPointName() {
		return PartPointName;
	}

	public void setPartPointName(String partPointName) {
		PartPointName = partPointName;
	}

	public String getLineName() {
		return LineName;
	}

	public void setLineName(String lineName) {
		LineName = lineName;
	}

	public int getStepOrderID() {
		return StepOrderID;
	}

	public void setStepOrderID(int stepOrderID) {
		StepOrderID = stepOrderID;
	}

	public String getTaskText() {
		return TaskText;
	}

	public void setTaskText(String taskText) {
		TaskText = taskText;
	}

	public DateTime getShiftDate() {
		return ShiftDate;
	}

	public void setShiftDate(DateTime shiftDate) {
		ShiftDate = shiftDate;
	}

	public List<SFCMaterial> getMaterialList() {
		return MaterialList;
	}

	public void setMaterialList(List<SFCMaterial> materialList) {
		MaterialList = materialList;
	}

	public boolean isMaterialCheck() {
		return MaterialCheck;
	}

	public void setMaterialCheck(boolean materialCheck) {
		MaterialCheck = materialCheck;
	}

	public int getMaterialCheckID() {
		return MaterialCheckID;
	}

	public void setMaterialCheckID(int materialCheckID) {
		MaterialCheckID = materialCheckID;
	}

	public List<SFCMaterialCheck> getMaterialCheckList() {
		return MaterialCheckList;
	}

	public void setMaterialCheckList(List<SFCMaterialCheck> materialCheckList) {
		MaterialCheckList = materialCheckList;
	}

	public List<SFCPartLogger> getPartLoggerList() {
		return PartLoggerList;
	}

	public void setPartLoggerList(List<SFCPartLogger> partLoggerList) {
		PartLoggerList = partLoggerList;
	}

	public int getWLMode() {
		return WLMode;
	}

	public void setWLMode(int wLMode) {
		WLMode = wLMode;
	}

	public int getBGMode() {
		return BGMode;
	}

	public void setBGMode(int bGMode) {
		BGMode = bGMode;
	}
}
