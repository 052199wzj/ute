package com.mes.server.service.po.sfc;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class SFCTaskPart implements Serializable {
	private static final long serialVersionUID = 1L;

	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0;
	// [DataMember(Name = "OrderID", Order = 1)]
	public int OrderID = 0;
	// [DataMember(Name = "TaskLineID", Order = 2)]
	public int TaskLineID = 0;
	// [DataMember(Name = "LineID", Order = 3)]
	public int LineID = 0;
	// [DataMember(Name = "PartID", Order = 4)]
	public int PartID = 0;
	// [DataMember(Name = "FQTYShift", Order = 5)]
	public int FQTYShift = 0; // 计划班产
	// [DataMember(Name = "FQTYParts", Order = 6)]
	public int FQTYParts = 0; // 实时产量
	// [DataMember(Name = "FQTYDone", Order = 7)]
	public int FQTYDone = 0; // 报工产量
	// [DataMember(Name = "ShiftID", Order = 8)]
	public int ShiftID = 0; // 班次
	// [DataMember(Name = "ProductID", Order = 9)]
	public int ProductID = 0; // 产品ID
	// [DataMember(Name = "StartTime", Order = 10)]
	public DateTime StartTime= DateTime.Now;
	// [DataMember(Name = "EndTime", Order = 11)]
	public DateTime EndTime= DateTime.Now;
	// [DataMember(Name = "Status", Order = 12)]
	public int Status = 0; // 状态
	// [DataMember(Name = "TaskStepList", Order = 13)]
	public List<SFCTaskStep> TaskStepList = new List<>(); // 工序任务列表
	// [DataMember(Name = "MaterialList", Order = 14)]
	public List<SFCMaterial> MaterialList = new List<>(); // 物料需求列表
	// 订单、工序段辅助属性
	// [DataMember(Name = "OrderNo", Order = 15)]
	public String OrderNo="";
	// [DataMember(Name = "ProductNo", Order = 16)]
	public String ProductNo="";
	// [DataMember(Name = "PartName", Order = 17)]
	public String PartName="";
	// [DataMember(Name = "MaterialNo", Order = 18)]
	public String MaterialNo="";
	// [DataMember(Name = "MaterialName", Order = 19)]
	public String MaterialName="";
	// [DataMember(Name = "PlanerID", Order = 20)]
	public int PlanerID = 0;
	// [DataMember(Name = "PlanerName", Order = 21)]
	public String PlanerName="";
	// [DataMember(Name = "LineName", Order = 22)]
	public String LineName="";
	// [DataMember(Name = "PartOrderID", Order = 23)]
	public int PartOrderID = 0; // 工序先后循序ID
	// [DataMember(Name = "TaskText", Order = 24)]
	public String TaskText="";
	// [DataMember(Name = "MaterialCheck", Order = 25)]
	public boolean MaterialCheck=false;
	// [DataMember(Name = "MaterialCheckID", Order = 26)]
	public int MaterialCheckID = 0;
	// [DataMember(Name = "MaterialCheckList", Order = 27)]
	public List<SFCMaterialCheck> MaterialCheckList = new List<>(); // 齐套检查日志
	// [DataMember(Name = "ShiftDate", Order = 28)]
	public DateTime ShiftDate= DateTime.Now; // 任务计划日期
	// [DataMember(Name = "BOMNo", Order = 29)]
	public String BOMNo="";

	// 优化设计
	public SFCTaskPart() {
		this.ID = 0;
		this.OrderID = 0;
		this.TaskLineID = 0;
		this.LineID = 0;

		this.PartID = 0;
		this.FQTYShift = 0;
		this.FQTYParts = 0;
		this.FQTYDone = 0;

		this.ShiftID = 0;
		this.ProductID = 0;
		this.Status = 0;
		this.PlanerID = 0;
		this.MaterialCheckID = 0;

		this.PartOrderID = 0;

		this.MaterialCheck = false;

		this.OrderNo = "";
		this.ProductNo = "";
		this.LineName = "";
		this.PartName = "";
		
		this.MaterialNo = "";
		this.MaterialName = "";
		this.PlanerName = "";
		this.TaskText = "";
		
		this.StartTime = DateTime.Now;
		this.EndTime = DateTime.Now;
		this.ShiftDate = DateTime.Now;
		
		this.TaskStepList  = new List<>();
		this.MaterialList  = new List<>();
		this.MaterialCheckList  = new List<>();
	}

	public SFCTaskPart Clone() {
		SFCTaskPart wTaskPart = new SFCTaskPart();
		wTaskPart.ID = this.ID;
		wTaskPart.OrderID = this.OrderID;
		wTaskPart.TaskLineID = this.TaskLineID;
		wTaskPart.LineID = this.LineID;
		wTaskPart.PartID = this.PartID;

		wTaskPart.FQTYShift = this.FQTYShift;
		wTaskPart.FQTYParts = this.FQTYParts;
		wTaskPart.FQTYDone = this.FQTYDone;
		wTaskPart.ShiftID = this.ShiftID;
		wTaskPart.ProductID = this.ProductID;

		wTaskPart.StartTime = this.StartTime;
		wTaskPart.EndTime = this.EndTime;
		wTaskPart.Status = this.Status;
		wTaskPart.OrderNo = this.OrderNo;
		wTaskPart.ProductNo = this.ProductNo;

		wTaskPart.PartName = this.PartName;
		wTaskPart.MaterialNo = this.MaterialNo;
		wTaskPart.MaterialName = this.MaterialName;
		wTaskPart.PlanerID = this.PlanerID;
		wTaskPart.PlanerName = this.PlanerName;

		wTaskPart.LineName = this.LineName;
		wTaskPart.PartOrderID = this.PartOrderID;
		wTaskPart.TaskText = this.TaskText;
		wTaskPart.MaterialCheck = this.MaterialCheck;
		wTaskPart.MaterialCheckID = this.MaterialCheckID;
		wTaskPart.ShiftDate = this.ShiftDate;
		wTaskPart.BOMNo = this.BOMNo;

		wTaskPart.TaskStepList=new List<SFCTaskStep>(this.TaskStepList);
		wTaskPart.MaterialList=new List<SFCMaterial>(this.MaterialList);
		wTaskPart.MaterialCheckList=new List<SFCMaterialCheck>(this.MaterialCheckList);
		return wTaskPart;
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

	public List<SFCTaskStep> getTaskStepList() {
		return TaskStepList;
	}

	public void setTaskStepList(List<SFCTaskStep> taskStepList) {
		TaskStepList = taskStepList;
	}

	public List<SFCMaterial> getMaterialList() {
		return MaterialList;
	}

	public void setMaterialList(List<SFCMaterial> materialList) {
		MaterialList = materialList;
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

	public String getLineName() {
		return LineName;
	}

	public void setLineName(String lineName) {
		LineName = lineName;
	}

	public int getPartOrderID() {
		return PartOrderID;
	}

	public void setPartOrderID(int partOrderID) {
		PartOrderID = partOrderID;
	}

	public String getTaskText() {
		return TaskText;
	}

	public void setTaskText(String taskText) {
		TaskText = taskText;
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

	public DateTime getShiftDate() {
		return ShiftDate;
	}

	public void setShiftDate(DateTime shiftDate) {
		ShiftDate = shiftDate;
	}

	public String getBOMNo() {
		return BOMNo;
	}

	public void setBOMNo(String bOMNo) {
		BOMNo = bOMNo;
	}
}
