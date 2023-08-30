package com.mes.server.service.po.mss;

import java.io.Serializable;
import java.util.DateTime;

public class MSSMeasureUnit implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public int SourceUnitID = 0;

	public int MeasureUnitID = 0;

	public int ERPSourceUnitID = 0;

	public int ERPMeasureUnitID = 0;

	public float Coefficient = 1.0f; // 转换系数：MeasureUnitID= Coefficient* SourceUnitID;

	public int OperatorID = 0;

	public String Operator = "";

	public DateTime EditTime = DateTime.Now;

	public int Active = 0;

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getSourceUnitID() {
		return SourceUnitID;
	}

	public void setSourceUnitID(int sourceUnitID) {
		SourceUnitID = sourceUnitID;
	}

	public int getMeasureUnitID() {
		return MeasureUnitID;
	}

	public void setMeasureUnitID(int measureUnitID) {
		MeasureUnitID = measureUnitID;
	}

	public int getERPSourceUnitID() {
		return ERPSourceUnitID;
	}

	public void setERPSourceUnitID(int eRPSourceUnitID) {
		ERPSourceUnitID = eRPSourceUnitID;
	}

	public int getERPMeasureUnitID() {
		return ERPMeasureUnitID;
	}

	public void setERPMeasureUnitID(int eRPMeasureUnitID) {
		ERPMeasureUnitID = eRPMeasureUnitID;
	}

	public float getCoefficient() {
		return Coefficient;
	}

	public void setCoefficient(float coefficient) {
		Coefficient = coefficient;
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

	public MSSMeasureUnit() {
		this.ID = 0;
		this.SourceUnitID = 0;
		this.Operator = "";
		this.EditTime = DateTime.Now;
	}
}
