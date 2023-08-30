package com.mes.server.service.po.aps;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class APSTaskPart implements Serializable {
	private static final long serialVersionUID = 1L;
	// [DataMember(Name = "ID", Order = 0)]
	public int ID= 0;
	// [DataMember(Name = "OrderID", Order = 1)]
	public int OrderID= 0; // 订单ID
	// [DataMember(Name = "TaskLineID", Order = 2)]
	public int TaskLineID= 0;
	// [DataMember(Name = "LineID", Order = 3)]
	public int LineID= 0;
	// [DataMember(Name = "PartID", Order = 4)]
	public int PartID= 0;
	// [DataMember(Name = "FQTYShift", Order = 5)]
	public int FQTYShift= 0; // 计划加工数量
	// [DataMember(Name = "FQTYParts", Order = 6)]
	public int FQTYParts= 0; // 实时加工节拍数（可以考虑检测机的检测数据）
	// [DataMember(Name = "FQTYDone", Order = 7)]
	public int FQTYDone= 0; // 入库完工数
	// [DataMember(Name = "WorkHour", Order = 8)]
	public int WorkHour= 0; // 标准工时
	// [DataMember(Name = "ShiftID", Order = 9)]
	public int ShiftID= 0;
	// [DataMember(Name = "PlanerID", Order = 10)]
	public int PlanerID= 0;

	// [DataMember(Name = "SubmitTime", Order = 11)]
	public DateTime SubmitTime= DateTime.Now;
	// [DataMember(Name = "StartTime", Order = 12)]
	public DateTime StartTime= DateTime.Now;
	// [DataMember(Name = "EndTime", Order = 13)]
	public DateTime EndTime= DateTime.Now;
	// [DataMember(Name = "TaskStepList", Order = 14)]
	public List<APSTaskStep> TaskStepList= new List<>();
	// 辅助属性（订单属性）
	// [DataMember(Name = "OrderNo", Order = 15)]
	public String OrderNo = "";
	// [DataMember(Name = "ProductNo", Order = 16)]
	public String ProductNo = "";
	// [DataMember(Name = "MaterialNo", Order = 17)]
	public String MaterialNo = "";
	// [DataMember(Name = "MaterialName", Order = 18)]
	public String MaterialName = "";
	// [DataMember(Name = "PartName", Order = 19)]
	public String PartName = "";
	// [DataMember(Name = "BOMNo", Order = 20)]
	public String BOMNo = "";
	// [DataMember(Name = "FQTYGood", Order = 21)]
	public int FQTYGood= 0; // 订单入库检合格数量
	// [DataMember(Name = "FQTYBad", Order = 22)]
	public int FQTYBad= 0; // 订单入库检不合格数量
	// [DataMember(Name = "Priority", Order = 23)]
	public int Priority= 0;
	// [DataMember(Name = "PlanerName", Order = 24)]
	public String PlanerName = "";
	// [DataMember(Name = "WorkShopName", Order = 26)]
	public String WorkShopName = "";
	// [DataMember(Name = "LineName", Order = 27)]
	public String LineName = "";

	// 接口错误码
	// [DataMember(Name = "ErrorCode", Order = 28)]
	public int ErrorCode= 0; // 错误码
	// [DataMember(Name = "Active", Order = 29)]
	public int Active= 0; // 状态
	// [DataMember(Name = "TaskText", Order = 30)]
	public String TaskText = "";

	// [DataMember(Name = "DelayDays", Order = 31)]
	public int DelayDays= 0;
	// [DataMember(Name = "PartOrderID", Order = 32)]
	public int PartOrderID= 0;
	// [DataMember(Name = "ShiftDate", Order = 33)]
	public DateTime ShiftDate= DateTime.Now;
	// [DataMember(Name = "ShiftHours", Order = 34)]
	public int ShiftHours= 0; // 单班标准工时
	// [DataMember(Name = "Status", Order = 35)]
	public int Status= 0;

	public APSTaskPart() {	
		this.ID = 0;
		this.OrderID = 0;
		this.TaskLineID = 0;
		this.LineID = 0;
		this.FQTYShift = 0;
		this.FQTYParts = 0;
		this.FQTYDone = 0;
		this.ShiftID = 0;
		this.PlanerID = 0;

		this.FQTYGood = 0;
		this.FQTYBad = 0;
		this.Priority = 0;
		this.ErrorCode = 0;
		this.Active = 0;
		this.WorkHour = 0;
		this.Status = 0;

		this.OrderNo = "";
		this.ProductNo = "";
		
		this.MaterialNo = "";
		this.MaterialName = "";
		this.BOMNo = "";
		this.PlanerName = "";
		this.WorkShopName = "";
		this.LineName = "";
		this.TaskText = "";
		
		this.SubmitTime = DateTime.Now;
		this.StartTime = DateTime.Now;
		this.EndTime = DateTime.Now;
		this.TaskStepList = new List<>();
	}

	public APSTaskPart(int wCompanyID, APSOrder wOrder) {
		
		this.LineID = wOrder.LineID;
		this.PartID = wOrder.PartID;

		this.OrderID = wOrder.ID;
		this.OrderNo = wOrder.OrderNo;
		this.ProductNo = wOrder.ProductNo;
		this.MaterialNo = wOrder.MaterialNo;
		this.MaterialName = wOrder.MaterialName;
		this.PartName = wOrder.PartName;
		this.BOMNo = wOrder.BOMNo;

		this.PlanerName = "";
		this.StartTime = DateTime.Now;
		this.TaskStepList = new List<>();
		this.SubmitTime = DateTime.Now;
		this.StartTime = DateTime.Now;
		this.TaskText = "";
	}

	public APSTaskPart Clone() {
		APSTaskPart wTaskPart = new APSTaskPart();
		wTaskPart.LineID = this.LineID;
		wTaskPart.PartID = this.PartID;
		wTaskPart.OrderID = this.OrderID;
		wTaskPart.PartOrderID = this.PartOrderID;
		wTaskPart.FQTYShift = this.FQTYShift;
		wTaskPart.FQTYParts = this.FQTYParts;
		wTaskPart.FQTYGood = this.FQTYGood;
		wTaskPart.FQTYBad = this.FQTYBad;
		wTaskPart.SubmitTime = this.SubmitTime;
		wTaskPart.OrderNo = this.OrderNo;
		wTaskPart.ProductNo = this.ProductNo;
		wTaskPart.MaterialNo = this.MaterialNo;
		wTaskPart.MaterialName = this.MaterialName;
		wTaskPart.PartName = this.PartName;
		wTaskPart.BOMNo = this.BOMNo;
		wTaskPart.PlanerName = this.PlanerName;
		wTaskPart.StartTime = this.StartTime;
		wTaskPart.EndTime = this.EndTime;
		wTaskPart.TaskStepList = new List<APSTaskStep>(this.TaskStepList);
		wTaskPart.TaskText = this.TaskText;
		wTaskPart.WorkHour = this.WorkHour;
		wTaskPart.ShiftDate = this.ShiftDate;
		wTaskPart.DelayDays = this.DelayDays;
		wTaskPart.ShiftHours = this.ShiftHours;
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

	public int getWorkHour() {
		return WorkHour;
	}

	public void setWorkHour(int workHour) {
		WorkHour = workHour;
	}

	public int getShiftID() {
		return ShiftID;
	}

	public void setShiftID(int shiftID) {
		ShiftID = shiftID;
	}

	public int getPlanerID() {
		return PlanerID;
	}

	public void setPlanerID(int planerID) {
		PlanerID = planerID;
	}

	public DateTime getSubmitTime() {
		return SubmitTime;
	}

	public void setSubmitTime(DateTime submitTime) {
		SubmitTime = submitTime;
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

	public List<APSTaskStep> getTaskStepList() {
		return TaskStepList;
	}

	public void setTaskStepList(List<APSTaskStep> taskStepList) {
		TaskStepList = taskStepList;
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

	public String getPartName() {
		return PartName;
	}

	public void setPartName(String partName) {
		PartName = partName;
	}

	public String getBOMNo() {
		return BOMNo;
	}

	public void setBOMNo(String bOMNo) {
		BOMNo = bOMNo;
	}

	public int getFQTYGood() {
		return FQTYGood;
	}

	public void setFQTYGood(int fQTYGood) {
		FQTYGood = fQTYGood;
	}

	public int getFQTYBad() {
		return FQTYBad;
	}

	public void setFQTYBad(int fQTYBad) {
		FQTYBad = fQTYBad;
	}

	public int getPriority() {
		return Priority;
	}

	public void setPriority(int priority) {
		Priority = priority;
	}

	public String getPlanerName() {
		return PlanerName;
	}

	public void setPlanerName(String planerName) {
		PlanerName = planerName;
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

	public int getErrorCode() {
		return ErrorCode;
	}

	public void setErrorCode(int errorCode) {
		ErrorCode = errorCode;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public String getTaskText() {
		return TaskText;
	}

	public void setTaskText(String taskText) {
		TaskText = taskText;
	}

	public int getDelayDays() {
		return DelayDays;
	}

	public void setDelayDays(int delayDays) {
		DelayDays = delayDays;
	}

	public int getPartOrderID() {
		return PartOrderID;
	}

	public void setPartOrderID(int partOrderID) {
		PartOrderID = partOrderID;
	}

	public DateTime getShiftDate() {
		return ShiftDate;
	}

	public void setShiftDate(DateTime shiftDate) {
		ShiftDate = shiftDate;
	}

	public int getShiftHours() {
		return ShiftHours;
	}

	public void setShiftHours(int shiftHours) {
		ShiftHours = shiftHours;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}
}
