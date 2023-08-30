package com.mes.server.service.po.sfc;

import java.io.Serializable;
import java.util.DateTime;

public class SFCPartLogger implements Serializable {
	private static final long serialVersionUID = 1L;

	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0; // ID
	// [DataMember(Name = "OrderID", Order = 1)]
	public int OrderID = 0; // 任务ID
	// [DataMember(Name = "TaskLineID", Order = 2)]
	public int TaskLineID = 0; // 产线任务ID
	// [DataMember(Name = "TaskPartID", Order = 3)]
	public int TaskPartID = 0; // 工段任务ID
	// [DataMember(Name = "TaskStepID", Order = 4)]
	public int TaskStepID = 0;// 工序任务ID
	// [DataMember(Name = "PartNo", Order = 5)]
	public String PartNo = ""; // 工件编码
	// [DataMember(Name = "StartTime", Order = 6)]
	public DateTime StartTime = DateTime.Now; // 扫码时刻
	// [DataMember(Name = "EndTime", Order = 7)]
	public DateTime EndTime = DateTime.Now; // 完成时刻
	// [DataMember(Name = "WorkHour", Order = 8)]
	public int WorkHour = 0; // 工时
	// [DataMember(Name = "OperatorID", Order = 9)]
	public int OperatorID = 0; // 操作员ID
	// [DataMember(Name = "FormID", Order = 10)]
	public int FormID = 0; // 表单ID
	// [DataMember(Name = "Status", Order = 11)]
	public int Status = 0; // 日志状态
	// [DataMember(Name = "Result", Order = 12)]
	public boolean Result = false; // 合格状态
	// [DataMember(Name = "StationID", Order = 13)]
	public int StationID = 0; // 工位ID

	public SFCPartLogger(SFCTaskStep wTaskStep, String wPartNo, int wStationID) {
		this.OrderID = wTaskStep.OrderID;
		this.TaskLineID = wTaskStep.TaskLineID;
		this.TaskPartID = wTaskStep.TaskPartID;
		this.TaskStepID = wTaskStep.ID;
		this.PartNo = wPartNo;
		this.StartTime = DateTime.Now;
		this.EndTime = DateTime.Now;
		this.Status = 0;
		this.Result = false;
		this.StationID = wStationID;
	}

	public SFCPartLogger() {
		this.ID = 0;
		this.OrderID = 0;
		this.TaskLineID = 0;
		this.TaskPartID = 0;
		this.TaskStepID = 0;

		this.WorkHour = 0;
		this.OperatorID = 0;
		this.FormID = 0;
		this.Status = 0;
		this.StationID = 0;
		
		this.PartNo = "";
		this.StartTime = DateTime.Now;
		this.EndTime = DateTime.Now;
		this.Result = false;
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

	public String getPartNo() {
		return PartNo;
	}

	public void setPartNo(String partNo) {
		PartNo = partNo;
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

	public int getWorkHour() {
		return WorkHour;
	}

	public void setWorkHour(int workHour) {
		WorkHour = workHour;
	}

	public int getOperatorID() {
		return OperatorID;
	}

	public void setOperatorID(int operatorID) {
		OperatorID = operatorID;
	}

	public int getFormID() {
		return FormID;
	}

	public void setFormID(int formID) {
		FormID = formID;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public boolean isResult() {
		return Result;
	}

	public void setResult(boolean result) {
		Result = result;
	}

	public int getStationID() {
		return StationID;
	}

	public void setStationID(int stationID) {
		StationID = stationID;
	}
}
