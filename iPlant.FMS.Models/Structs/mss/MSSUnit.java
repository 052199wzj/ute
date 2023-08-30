package com.mes.server.service.po.mss;

import java.io.Serializable;
import java.util.DateTime;

public class MSSUnit implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public String Name = "";

	public String Code = "";

	public int OperatorID = 0;

	public String Operator = "";

	public DateTime EditTime = DateTime.Now;

	public int Active = 0;

	public int ERPUnitID = 0;

	public int GroupID = 0;

	public String GroupText = "";

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

	public int getERPUnitID() {
		return ERPUnitID;
	}

	public void setERPUnitID(int eRPUnitID) {
		ERPUnitID = eRPUnitID;
	}

	public int getGroupID() {
		return GroupID;
	}

	public void setGroupID(int groupID) {
		GroupID = groupID;
	}

	public String getGroupText() {
		return GroupText;
	}

	public void setGroupText(String groupText) {
		GroupText = groupText;
	}

	public MSSUnit() {
		this.ID = 0;
		this.ERPUnitID = 0;
		this.Name = "";
		this.GroupText = "";
		this.EditTime = DateTime.Now;
	}

	public String getCode() {
		return Code;
	}

	public void setCode(String code) {
		Code = code;
	}
}
