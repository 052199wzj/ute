package com.mes.server.service.po.aps;

import java.io.Serializable;
import java.util.DateTime;

public class APSTaskStep implements Serializable {
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
	public int FQTYShift = 0; // 计划班产
	// [DataMember(Name = "FQTYParts", Order = 8)]
	public int FQTYParts = 0; // 实时产量
	// [DataMember(Name = "FQTYDone", Order = 9)]
	public int FQTYDone = 0; // 报工产量
	// [DataMember(Name = "ShiftID", Order = 10)]
	public int ShiftID = 0; // 班次
	// [DataMember(Name = "StartTime", Order = 11)]
	public DateTime StartTime = DateTime.Now;
	// [DataMember(Name = "EndTime", Order = 12)]
	public DateTime EndTime = DateTime.Now;
	// [DataMember(Name = "Status", Order = 13)]
	public int Status = 0; // 状态
	// 订单、工序段辅助属性
	// [DataMember(Name = "OrderNo", Order = 14)]
	public String OrderNo = "";
	// [DataMember(Name = "ProductNo", Order = 15)]
	public String ProductNo = "";
	// [DataMember(Name = "LineName", Order = 16)]
	public String LineName = "";
	// [DataMember(Name = "PartName", Order = 17)]
	public String PartName = "";
	// [DataMember(Name = "PartPointName", Order = 18)]
	public String PartPointName = "";
	// [DataMember(Name = "MaterialNo", Order = 19)]
	public String MaterialNo = "";
	// [DataMember(Name = "MaterialName", Order = 20)]
	public String MaterialName = "";
	// [DataMember(Name = "PlanerID", Order = 21)]
	public int PlanerID = 0;
	// [DataMember(Name = "PlanerName", Order = 22)]
	public String PlanerName = "";
	// [DataMember(Name = "StepOrderID", Order = 23)]
	public int StepOrderID = 0; // 工序先后循序ID
	// [DataMember(Name = "ErrorCode", Order = 24)]
	public int ErrorCode = 0; // 错误码
	// [DataMember(Name = "TaskText", Order = 25)]
	public String TaskText = "";
	// 优化设计
	// [DataMember(Name = "WorkHour", Order = 26)]
	public int WorkHour = 0; // 单工件工时
	// [DataMember(Name = "ShiftDate", Order = 27)]
	public DateTime ShiftDate = DateTime.Now;// 日期

	public APSTaskStep() {
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
		this.PlanerID = 0;

		this.ErrorCode = 0;
		this.WorkHour = 0;
		this.Status = 0;

		this.OrderNo = "";
		this.ProductNo = "";

		this.MaterialNo = "";
		this.MaterialName = "";

		this.PlanerName = "";
		this.LineName = "";
		this.PartName = "";
		this.PartPointName = "";
		this.TaskText = "";

		this.StartTime = DateTime.Now;
		this.EndTime = DateTime.Now;
		this.ShiftDate = DateTime.Now;
	}

	public APSTaskStep Clone() {
		APSTaskStep wTaskStep = new APSTaskStep();
		wTaskStep.PlanerID = this.PlanerID;
		wTaskStep.OrderID = this.OrderID;
		wTaskStep.LineID = this.LineID;
		wTaskStep.PartID = this.PartID;
		wTaskStep.PartPointID = this.PartPointID;
		wTaskStep.TaskLineID = this.TaskLineID;
		wTaskStep.TaskPartID = this.TaskPartID;
		wTaskStep.FQTYShift = this.FQTYShift;
		wTaskStep.FQTYParts = this.FQTYParts;
		wTaskStep.FQTYDone = this.FQTYDone;
		wTaskStep.ShiftID = this.ShiftID;
		wTaskStep.OrderNo = this.OrderNo;
		wTaskStep.ProductNo = this.ProductNo;
		wTaskStep.MaterialNo = this.MaterialNo;
		wTaskStep.MaterialName = this.MaterialName;
		wTaskStep.PartName = this.PartName;
		wTaskStep.PlanerName = this.PlanerName;
		wTaskStep.StartTime = this.StartTime;
		wTaskStep.EndTime = this.EndTime;
		wTaskStep.Status = this.Status;
		wTaskStep.StepOrderID = this.StepOrderID;
		wTaskStep.ShiftDate = this.ShiftDate;
		return wTaskStep;
	}
}
