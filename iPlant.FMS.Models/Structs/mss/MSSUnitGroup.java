package com.mes.server.service.po.mss;

import java.io.Serializable;
import java.util.DateTime;

public class MSSUnitGroup implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public String Name = "";

	public int OperatorID = 0;

	public String Operator = "";

	public DateTime EditTime = DateTime.Now;

	public int Active = 0;

	public int ERPUnitGroupID = 0;

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public int getOperatorID() {
		return OperatorID;
	}

	public void setOperatorID(int operatorID) {
		OperatorID = operatorID;
	}

	public String getOperator() {
		return Operator;
	}

	public void setOperator(String operator) {
		Operator = operator;
	}

	public DateTime getEditTime() {
		return EditTime;
	}

	public void setEditTime(DateTime editTime) {
		EditTime = editTime;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public int getERPUnitGroupID() {
		return ERPUnitGroupID;
	}

	public void setERPUnitGroupID(int eRPUnitGroupID) {
		ERPUnitGroupID = eRPUnitGroupID;
	}

	public MSSUnitGroup() {
		this.ID = 0;
		this.ERPUnitGroupID = 0;
		this.Name = "";
		this.EditTime = DateTime.Now;
		this.Operator = "ERP";
	}
}
