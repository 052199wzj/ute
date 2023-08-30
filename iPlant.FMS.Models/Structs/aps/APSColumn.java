package com.mes.server.service.po.aps;

import java.io.Serializable;
import java.util.DateTime;

public class APSColumn implements Serializable {
	private static final long serialVersionUID = 1L;
	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0;
	// [DataMember(Name = "LineID", Order = 1)]
	public int LineID = 0;
	// [DataMember(Name = "OrderID", Order = 2)]
	public int OrderID = 0;
	// [DataMember(Name = "PartID", Order = 3)]
	public int PartID = 0;
	// [DataMember(Name = "WorkDate", Order = 4)]
	public DateTime WorkDate = DateTime.Now;
	// [DataMember(Name = "FQTYPlan", Order = 5)]
	public int FQTYPlan = 0;
	// [DataMember(Name = "FQTYDone", Order = 6)]
	public int FQTYDone = 0;
	// [DataMember(Name = "ColumnID", Order = 7)]
	public int ColumnID = 0;
	// [DataMember(Name = "ColumnText", Order = 8)]
	public String ColumnText = "";

	public APSColumn() {
		this.ID = 0;
		this.LineID = 0;
		this.OrderID = 0;
		this.PartID = 0;
		this.WorkDate = DateTime.Now;
		this.FQTYPlan = 0;
		this.FQTYDone = 0;
		this.ColumnID = 0;
		this.ColumnText = "";
	}

	public APSColumn(APSTaskPart wTaskPart) {
		this.LineID = wTaskPart.LineID;
		this.OrderID = wTaskPart.OrderID;
		this.PartID = wTaskPart.PartID;
		this.FQTYPlan = wTaskPart.FQTYShift;
		this.FQTYDone = wTaskPart.FQTYDone;
		this.WorkDate = wTaskPart.ShiftDate;
		this.WorkDate.set(DateTime.HOUR_OF_DAY,0);
		this.WorkDate.set(DateTime.MINUTE,0);
		this.WorkDate.set(DateTime.SECOND, 0);
		this.WorkDate.set(DateTime.MILLISECOND, 0);
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

	public DateTime getWorkDate() {
		return WorkDate;
	}

	public void setWorkDate(DateTime workDate) {
		WorkDate = workDate;
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

	public int getColumnID() {
		return ColumnID;
	}

	public void setColumnID(int columnID) {
		ColumnID = columnID;
	}

	public String getColumnText() {
		return ColumnText;
	}

	public void setColumnText(String columnText) {
		ColumnText = columnText;
	}
}
