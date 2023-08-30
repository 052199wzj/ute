package com.mes.server.service.po.sfc;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class SFCTaskLine implements Serializable {
	private static final long serialVersionUID = 1L;

	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0;
	// [DataMember(Name = "OrderID", Order = 1)]
	public int OrderID = 0;
	// [DataMember(Name = "LineID", Order = 2)]
	public int LineID = 0;
	// [DataMember(Name = "FQTYShift", Order = 3)]
	public int FQTYShift = 0; // 计划班产
	// [DataMember(Name = "FQTYParts", Order = 4)]
	public int FQTYParts = 0; // 实时产量
	// [DataMember(Name = "FQTYDone", Order = 5)]
	public int FQTYDone = 0; // 报工产量
	// [DataMember(Name = "ShiftID", Order = 6)]
	public int ShiftID = 0; // 班次
	// [DataMember(Name = "ProductID", Order = 7)]
	public int ProductID = 0; // 产品ID
	// [DataMember(Name = "StartTime", Order = 8)]
	public DateTime StartTime = DateTime.Now;
	// [DataMember(Name = "EndTime", Order = 9)]
	public DateTime EndTime = DateTime.Now;
	// [DataMember(Name = "Status", Order = 10)]
	public int Status = 0; // 状态
	// [DataMember(Name = "TaskPartList", Order = 11)]
	public List<SFCTaskPart> TaskPartList = new List<>(); // 工段任务列表
	// [DataMember(Name = "BOMMaterialList", Order = 12)]
	public List<SFCMaterial> BOMMaterialList = new List<>(); // 物料需求列表
	// 订单、工序段辅助属性
	// [DataMember(Name = "OrderNo", Order = 13)]
	public String OrderNo = "";
	// [DataMember(Name = "ProductNo", Order = 14)]
	public String ProductNo = "";
	// [DataMember(Name = "MaterialNo", Order = 15)]
	public String MaterialNo = "";
	// [DataMember(Name = "MaterialName", Order = 16)]
	public String MaterialName = "";
	// [DataMember(Name = "PlanerID", Order = 17)]
	public int PlanerID = 0;
	// [DataMember(Name = "PlanerName", Order = 18)]
	public String PlanerName = "";
	// [DataMember(Name = "LineName", Order = 19)]
	public String LineName;
	// [DataMember(Name = "TaskText", Order = 20)]
	public String TaskText = "";
	// [DataMember(Name = "MaterialCheck", Order = 21)]
	public boolean MaterialCheck = false;
	// [DataMember(Name = "MaterialCheckID", Order = 22)]
	public int MaterialCheckID = 0;
	// [DataMember(Name = "MaterialList", Order = 23)]
	public List<SFCMaterial> MaterialList = new List<>(); // 物料需求列表
	// [DataMember(Name = "MaterialCheckList", Order = 24)]
	public List<SFCMaterialCheck> MaterialCheckList = new List<>(); // 齐套检查日志
	// [DataMember(Name = "BOMNo", Order = 25)]
	public String BOMNo = "";

	// 优化设计
	public SFCTaskLine() {
		this.ID = 0;
		this.OrderID = 0;
		this.LineID = 0;

		this.FQTYShift = 0;
		this.FQTYParts = 0;
		this.FQTYDone = 0;

		this.ShiftID = 0;
		this.ProductID = 0;
		this.Status = 0;
		this.PlanerID = 0;
		this.MaterialCheckID = 0;

		this.MaterialCheck = false;

		this.OrderNo = "";
		this.ProductNo = "";
		this.LineName = "";

		this.MaterialNo = "";
		this.MaterialName = "";
		this.PlanerName = "";
		this.TaskText = "";

		this.StartTime = DateTime.Now;
		this.EndTime = DateTime.Now;

		this.TaskPartList = new List<>();
		this.BOMMaterialList = new List<>();
		this.MaterialList = new List<>();
		this.MaterialCheckList = new List<>();
	}

	public SFCTaskLine Clone() {
		SFCTaskLine wTaskLine = new SFCTaskLine();
		wTaskLine.ID = this.ID;
		wTaskLine.OrderID = this.OrderID;
		wTaskLine.LineID = this.LineID;

		wTaskLine.FQTYShift = this.FQTYShift;
		wTaskLine.FQTYParts = this.FQTYParts;
		wTaskLine.FQTYDone = this.FQTYDone;
		wTaskLine.ShiftID = this.ShiftID;
		wTaskLine.ProductID = this.ProductID;

		wTaskLine.StartTime = this.StartTime;
		wTaskLine.EndTime = this.EndTime;
		wTaskLine.Status = this.Status;
		wTaskLine.OrderNo = this.OrderNo;
		wTaskLine.ProductNo = this.ProductNo;

		wTaskLine.MaterialNo = this.MaterialNo;
		wTaskLine.MaterialName = this.MaterialName;
		wTaskLine.PlanerID = this.PlanerID;
		wTaskLine.PlanerName = this.PlanerName;

		wTaskLine.LineName = this.LineName;
		wTaskLine.TaskText = this.TaskText;
		wTaskLine.MaterialCheck = this.MaterialCheck;
		wTaskLine.MaterialCheckID = this.MaterialCheckID;
		wTaskLine.BOMNo = this.BOMNo;

		wTaskLine.TaskPartList = new List<SFCTaskPart>(this.TaskPartList);
		wTaskLine.BOMMaterialList = new List<SFCMaterial>(this.BOMMaterialList);
		wTaskLine.MaterialList = new List<SFCMaterial>(this.MaterialList);
		wTaskLine.MaterialCheckList = new List<SFCMaterialCheck>(this.MaterialCheckList);
		return wTaskLine;
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

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
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

	public List<SFCTaskPart> getTaskPartList() {
		return TaskPartList;
	}

	public void setTaskPartList(List<SFCTaskPart> taskPartList) {
		TaskPartList = taskPartList;
	}

	public List<SFCMaterial> getBOMMaterialList() {
		return BOMMaterialList;
	}

	public void setBOMMaterialList(List<SFCMaterial> bOMMaterialList) {
		BOMMaterialList = bOMMaterialList;
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

	public List<SFCMaterial> getMaterialList() {
		return MaterialList;
	}

	public void setMaterialList(List<SFCMaterial> materialList) {
		MaterialList = materialList;
	}

	public List<SFCMaterialCheck> getMaterialCheckList() {
		return MaterialCheckList;
	}

	public void setMaterialCheckList(List<SFCMaterialCheck> materialCheckList) {
		MaterialCheckList = materialCheckList;
	}

	public String getBOMNo() {
		return BOMNo;
	}

	public void setBOMNo(String bOMNo) {
		BOMNo = bOMNo;
	}
}
