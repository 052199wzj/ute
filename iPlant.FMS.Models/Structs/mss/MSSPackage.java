package com.mes.server.service.po.mss;

import java.io.Serializable;
import java.util.DateTime;

public class MSSPackage implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public String MaterialNo = "";

	public String Name = "";

	public int OperatorID = 0;

	public String Operator = "";

	public DateTime EditTime = DateTime.Now;

	public int Active = 0;

	public int UnitID = 0;

	public float FQTY = 1.0f;

	public String UnitText = "";

	public int ERPPackageID = 0;

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getMaterialNo() {
		return MaterialNo;
	}

	public void setMaterialNo(String materialNo) {
		MaterialNo = materialNo;
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

	public int getUnitID() {
		return UnitID;
	}

	public void setUnitID(int unitID) {
		UnitID = unitID;
	}

	public float getFQTY() {
		return FQTY;
	}

	public void setFQTY(float fQTY) {
		FQTY = fQTY;
	}

	public String getUnitText() {
		return UnitText;
	}

	public void setUnitText(String unitText) {
		UnitText = unitText;
	}

	public int getERPPackageID() {
		return ERPPackageID;
	}

	public void setERPPackageID(int eRPPackageID) {
		ERPPackageID = eRPPackageID;
	}

	public MSSPackage() {
		this.ID = 0;
		this.ERPPackageID = 0;
		this.Name = "";
		this.UnitText = "";
		this.EditTime = DateTime.Now;
	}
}
