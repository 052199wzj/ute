package com.mes.server.service.po.aps;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class APSTaskLine implements Serializable {
	private static final long serialVersionUID = 1L;
	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0;
	// [DataMember(Name = "OrderID", Order = 1)]
	public int OrderID = 0;
	// [DataMember(Name = "WorkShopID", Order = 2)]
	public int WorkShopID = 0;
	// [DataMember(Name = "LineID", Order = 3)]
	public int LineID = 0;
	// [DataMember(Name = "FQTYShift", Order = 4)]
	public int FQTYShift = 0; // 计划加工数量
	// [DataMember(Name = "FQTYParts", Order = 5)]
	public int FQTYParts = 0; // 实时加工节拍数（可以考虑检测机的检测数据）
	// [DataMember(Name = "FQTYDone", Order = 6)]
	public int FQTYDone = 0; // 入库完工数
	// [DataMember(Name = "PartHours", Order = 7)]
	public int PartHours = 0; // 标准工时(瓶颈工序)
	// [DataMember(Name = "CraftMinutes", Order = 8)]
	public int CraftMinutes = 0; // 换型时间
	// [DataMember(Name = "ShiftID", Order = 9)]
	public int ShiftID = 0;
	// [DataMember(Name = "PlanerID", Order = 10)]
	public int PlanerID = 0;
	// [DataMember(Name = "SubmitTime", Order = 11)]
	public DateTime SubmitTime = DateTime.Now;
	// [DataMember(Name = "SessionTime", Order = 12)]
	public DateTime SessionTime = DateTime.Now;
	// [DataMember(Name = "TaskPartList", Order = 13)]
	public List<APSTaskPart> TaskPartList = new List<>();
	// [DataMember(Name = "MaterialList", Order = 14)]
	public List<APSMaterial> MaterialList = new List<>(); // 物料需求
	// [DataMember(Name = "MessageList", Order = 15)]
	public List<APSMessage> MessageList = new List<>(); // 消息
	// [DataMember(Name = "AuditorID", Order = 16)]
	public int AuditorID = 0;
	// [DataMember(Name = "AuditTime", Order = 17)]
	public DateTime AuditTime = DateTime.Now;

	// 辅助属性（订单属性）
	// [DataMember(Name = "OrderNo", Order = 18)]
	public String OrderNo = "";
	// [DataMember(Name = "ProductNo", Order = 19)]
	public String ProductNo = "";
	// [DataMember(Name = "MaterialNo", Order = 20)]
	public String MaterialNo = "";
	// [DataMember(Name = "MaterialName", Order = 21)]
	public String MaterialName = "";
	// [DataMember(Name = "FQTY", Order = 22)]
	public int FQTY = 0; // 订单数量
	// [DataMember(Name = "Auditor", Order = 23)]
	public String Auditor;
	// [DataMember(Name = "BOMNo", Order = 24)]
	public String BOMNo;
	// [DataMember(Name = "FQTYGood", Order = 25)]
	public int FQTYGood = 0; // 订单入库检合格数量
	// [DataMember(Name = "FQTYBad", Order = 26)]
	public int FQTYBad = 0; // 订单入库检不合格数量
	// [DataMember(Name = "Priority", Order = 27)]
	public int Priority = 0;
	// [DataMember(Name = "PlanerName", Order = 28)]
	public String PlanerName = "";
	// [DataMember(Name = "WorkShopName", Order = 29)]
	public String WorkShopName = "";
	// [DataMember(Name = "LineName", Order = 30)]
	public String LineName = "";
	// 接口错误码
	// [DataMember(Name = "ErrorCode", Order = 31)]
	public int ErrorCode = 0; // 错误码
	// [DataMember(Name = "Active", Order = 32)]
	public int Active = 0; // 状态
	// [DataMember(Name = "TaskText", Order = 33)]
	public String TaskText;
	// [DataMember(Name = "WorkHour", Order = 34)]
	public int WorkHour = 0; // 单工件工时
	// [DataMember(Name = "WorkHours", Order = 35)]
	public int WorkHours = 0; // 总加工工时
	// [DataMember(Name = "Status", Order = 36)]
	public int Status = 0; // 订单状态
	// [DataMember(Name = "StartTime", Order = 37)]
	public DateTime StartTime = DateTime.Now;
	// [DataMember(Name = "EndTime", Order = 38)]
	public DateTime EndTime = DateTime.Now;
	// [DataMember(Name = "Shifts", Order = 39)]
	public float Shifts = 0.0f;

	public APSTaskLine() {
		this.ID = 0;
		this.OrderID = 0;
		this.WorkShopID = 0;
		this.LineID = 0;
		this.FQTYShift = 0;
		this.FQTYParts = 0;
		this.FQTYDone = 0;
		this.PartHours = 0;
		this.CraftMinutes = 0;
		this.ShiftID = 0;
		this.PlanerID = 0;
		this.AuditorID = 0;
		this.FQTY = 0;
		this.FQTYGood = 0;
		this.FQTYBad = 0;
		this.Priority = 0;
		this.ErrorCode = 0;
		this.Active = 0;
		this.WorkHour = 0;
		this.WorkHours = 0;
		this.Status = 0;
		this.Shifts = 0.0f;

		this.OrderNo = "";
		this.ProductNo = "";
		
		this.MaterialNo = "";
		this.MaterialName = "";
		this.Auditor = "";
		this.BOMNo = "";
		this.PlanerName = "";
		this.WorkShopName = "";
		this.LineName = "";
		this.TaskText = "";
		
		this.SubmitTime = DateTime.Now;
		this.SessionTime = DateTime.Now;
		this.StartTime = DateTime.Now;
		this.EndTime = DateTime.Now;
		this.AuditTime = DateTime.Now;
		this.TaskPartList = new List<>();
		this.MaterialList = new List<>();
		this.MessageList = new List<>();
	}

	public APSTaskLine(int wCompanyID, APSOrder wOrder) {
		this.WorkShopID = wOrder.WorkShopID;
		this.LineID = wOrder.LineID;

		this.OrderID = wOrder.ID;
		this.OrderNo = wOrder.OrderNo;
		this.ProductNo = wOrder.ProductNo;
		this.MaterialNo = wOrder.MaterialNo;
		this.MaterialName = wOrder.MaterialName;
		this.BOMNo = wOrder.BOMNo;
		this.PlanerName = "";

		this.FQTY = wOrder.FQTY;
		this.FQTYDone = wOrder.FQTYDone;

		this.WorkHour = wOrder.WorkHour;
		this.WorkHours = wOrder.WorkHours;
		this.FQTYShift = wOrder.FQTYShift;
		this.Shifts = wOrder.Shifts;
		this.SubmitTime = DateTime.Now;
		this.SessionTime = DateTime.Now;
		this.StartTime = wOrder.StartTime;
		this.EndTime = wOrder.EndTime;
		this.AuditTime = DateTime.Now;
		this.TaskPartList = new List<>();
		this.MaterialList = new List<>();
		this.MessageList = new List<>();

		this.TaskText = "";
	}
	public APSTaskLine Clone() {
		APSTaskLine wTaskLine = new APSTaskLine();
		wTaskLine.WorkShopID = this.WorkShopID;
		wTaskLine.LineID = this.LineID;
		wTaskLine.PlanerID = this.PlanerID;
		wTaskLine.AuditorID = this.AuditorID;
		wTaskLine.FQTY = this.FQTY;
		wTaskLine.FQTYShift = this.FQTYShift;
		wTaskLine.FQTYParts = this.FQTYParts;
		wTaskLine.FQTYGood = this.FQTYGood;
		wTaskLine.FQTYBad = this.FQTYBad;
		wTaskLine.SubmitTime = this.SubmitTime;
		wTaskLine.OrderNo = this.OrderNo;
		wTaskLine.ProductNo = this.ProductNo;
		wTaskLine.MaterialNo = this.MaterialNo;
		wTaskLine.MaterialName = this.MaterialName;
		wTaskLine.Auditor = this.Auditor;
		wTaskLine.BOMNo = this.BOMNo;
		wTaskLine.PlanerName = this.PlanerName;
		wTaskLine.SubmitTime = this.SubmitTime;
		wTaskLine.SessionTime = this.SessionTime;
		wTaskLine.StartTime = this.StartTime;
		wTaskLine.EndTime = this.EndTime;
		wTaskLine.AuditTime = this.AuditTime;
		wTaskLine.TaskText = this.TaskText;
		wTaskLine.TaskPartList= new List<APSTaskPart>(this.TaskPartList);
		wTaskLine.MaterialList= new List<APSMaterial>(this.MaterialList);
		wTaskLine.MessageList= new List<APSMessage>(this.MessageList);
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

	public int getWorkShopID() {
		return WorkShopID;
	}

	public void setWorkShopID(int workShopID) {
		WorkShopID = workShopID;
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

	public int getPartHours() {
		return PartHours;
	}

	public void setPartHours(int partHours) {
		PartHours = partHours;
	}

	public int getCraftMinutes() {
		return CraftMinutes;
	}

	public void setCraftMinutes(int craftMinutes) {
		CraftMinutes = craftMinutes;
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

	public DateTime getSessionTime() {
		return SessionTime;
	}

	public void setSessionTime(DateTime sessionTime) {
		SessionTime = sessionTime;
	}

	public List<APSTaskPart> getTaskPartList() {
		return TaskPartList;
	}

	public void setTaskPartList(List<APSTaskPart> taskPartList) {
		TaskPartList = taskPartList;
	}

	public List<APSMaterial> getMaterialList() {
		return MaterialList;
	}

	public void setMaterialList(List<APSMaterial> materialList) {
		MaterialList = materialList;
	}

	public List<APSMessage> getMessageList() {
		return MessageList;
	}

	public void setMessageList(List<APSMessage> messageList) {
		MessageList = messageList;
	}

	public int getAuditorID() {
		return AuditorID;
	}

	public void setAuditorID(int auditorID) {
		AuditorID = auditorID;
	}

	public DateTime getAuditTime() {
		return AuditTime;
	}

	public void setAuditTime(DateTime auditTime) {
		AuditTime = auditTime;
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

	public int getFQTY() {
		return FQTY;
	}

	public void setFQTY(int fQTY) {
		FQTY = fQTY;
	}

	public String getAuditor() {
		return Auditor;
	}

	public void setAuditor(String auditor) {
		Auditor = auditor;
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

	public int getWorkHour() {
		return WorkHour;
	}

	public void setWorkHour(int workHour) {
		WorkHour = workHour;
	}

	public int getWorkHours() {
		return WorkHours;
	}

	public void setWorkHours(int workHours) {
		WorkHours = workHours;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
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

	public float getShifts() {
		return Shifts;
	}

	public void setShifts(float shifts) {
		Shifts = shifts;
	}
	
}
