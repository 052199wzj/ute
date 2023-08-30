package com.mes.server.service.po.aps;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class APSGantPart implements Serializable {
	private static final long serialVersionUID = 1L;
	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0;
	// [DataMember(Name = "LineID", Order = 1)]
	public int LineID = 0;
	// [DataMember(Name = "OrderID", Order = 2)]
	public int OrderID = 0;
	// [DataMember(Name = "PartID", Order = 3)]
	public int PartID = 0;
	// [DataMember(Name = "FQTYPlan", Order = 4)]
	public int FQTYPlan = 0;
	// [DataMember(Name = "FQTYDone", Order = 5)]
	public int FQTYDone = 0;
	// [DataMember(Name = "StartDate", Order = 6)]
	public DateTime StartDate = DateTime.Now;
	// [DataMember(Name = "EndDate", Order = 7)]
	public DateTime EndDate = DateTime.Now;
	// [DataMember(Name = "LineName", Order = 8)]
	public String LineName= "";
	// [DataMember(Name = "PartName", Order = 9)]
	public String PartName= "";
	// [DataMember(Name = "OrderNo", Order = 10)]
	public String OrderNo= "";
	// [DataMember(Name = "ProductNo", Order = 11)]
	public String ProductNo= "";
	// [DataMember(Name = "LeftBar", Order = 12)]
	public float LeftBar= 0.0f;
	// [DataMember(Name = "WidthBar", Order = 13)]
	public float WidthBar= 0.0f;
	// [DataMember(Name = "RightBar", Order = 14)]
	public float RightBar= 0.0f;
	// [DataMember(Name = "TaskPartList", Order = 15)]
	public List<APSTaskPart> TaskPartList = new List<>();
	// [DataMember(Name = "PartOrderID", Order = 16)]
	public int PartOrderID = 0;
	// [DataMember(Name = "TaskLineID", Order = 17)]
	public int TaskLineID = 0;
	// [DataMember(Name = "GroupID", Order = 18)]
	public int GroupID = 0;
	// [DataMember(Name = "Locked", Order = 19)]
	public boolean Locked = false;
	// [DataMember(Name = "ShiftDays", Order = 20)]
	public int ShiftDays = 0; // 有效排班天数

	public APSGantPart() {
		this.ID = 0;
		this.LineID = 0;
		this.OrderID = 0;
		this.PartID = 0;
		this.FQTYPlan = 0;
		this.FQTYDone = 0;
		this.StartDate = DateTime.Now;
		this.EndDate = DateTime.Now;
		this.LineName = "";
		this.PartName = "";
		this.OrderNo = "";
		this.ProductNo = "";
		this.LeftBar= 0.0f;
		this.WidthBar= 0.0f;
		this.RightBar= 0.0f;
		this.TaskPartList = new List<>();
		
		this.PartOrderID = 0;
		this.TaskLineID = 0;
		this.GroupID = 0;
		this.Locked = false;
		this.ShiftDays = 0;
	}
	public APSGantPart(APSTaskPart wTaskPart) {
		this.TaskLineID = wTaskPart.TaskLineID;
		this.LineID = wTaskPart.LineID;
		this.OrderID = wTaskPart.OrderID;
		this.PartID = wTaskPart.PartID;
		this.PartOrderID = wTaskPart.PartOrderID;
		this.FQTYPlan = wTaskPart.FQTYShift;
		this.FQTYDone = wTaskPart.FQTYDone;
		this.LineName = wTaskPart.LineName;
		this.PartName = wTaskPart.PartName;
		this.OrderNo = wTaskPart.OrderNo;
		this.ProductNo = wTaskPart.ProductNo;
		this.TaskPartList = new List<>();
		this.GroupID = 0;
		this.Locked = false;
		this.ShiftDays = 0;
		this.TaskPartList.Add(wTaskPart);
	}
	public int ID {
		return ID;
	}
	public void setID(int iD) {
		ID = iD;
	}
	public int getLineID() {
		return LineID;
	}
	public void setLineID(int lineID) {
		LineID = lineID;
	}
	public int getOrderID() {
		return OrderID;
	}
	public void setOrderID(int orderID) {
		OrderID = orderID;
	}
	public int getPartID() {
		return PartID;
	}
	public void setPartID(int partID) {
		PartID = partID;
	}
	public int getFQTYPlan() {
		return FQTYPlan;
	}
	public void setFQTYPlan(int fQTYPlan) {
		FQTYPlan = fQTYPlan;
	}
	public int getFQTYDone() {
		return FQTYDone;
	}
	public void setFQTYDone(int fQTYDone) {
		FQTYDone = fQTYDone;
	}
	public DateTime getStartDate() {
		return StartDate;
	}
	public void setStartDate(DateTime startDate) {
		StartDate = startDate;
	}
	public DateTime getEndDate() {
		return EndDate;
	}
	public void setEndDate(DateTime endDate) {
		EndDate = endDate;
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
	public float getLeftBar() {
		return LeftBar;
	}
	public void setLeftBar(float leftBar) {
		LeftBar = leftBar;
	}
	public float getWidthBar() {
		return WidthBar;
	}
	public void setWidthBar(float widthBar) {
		WidthBar = widthBar;
	}
	public float getRightBar() {
		return RightBar;
	}
	public void setRightBar(float rightBar) {
		RightBar = rightBar;
	}
	public List<APSTaskPart> getTaskPartList() {
		return TaskPartList;
	}
	public void setTaskPartList(List<APSTaskPart> taskPartList) {
		TaskPartList = taskPartList;
	}
	public int getPartOrderID() {
		return PartOrderID;
	}
	public void setPartOrderID(int partOrderID) {
		PartOrderID = partOrderID;
	}
	public int getTaskLineID() {
		return TaskLineID;
	}
	public void setTaskLineID(int taskLineID) {
		TaskLineID = taskLineID;
	}
	public int getGroupID() {
		return GroupID;
	}
	public void setGroupID(int groupID) {
		GroupID = groupID;
	}
	public boolean isLocked() {
		return Locked;
	}
	public void setLocked(boolean locked) {
		Locked = locked;
	}
	public int getShiftDays() {
		return ShiftDays;
	}
	public void setShiftDays(int shiftDays) {
		ShiftDays = shiftDays;
	}
}
