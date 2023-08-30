package com.mes.server.service.po.erp;

import java.io.Serializable;

public class ERPMeasureUnit implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ERPMeasureUnit() {
		// TODO Auto-generated constructor stub
	}

	public int FItemID;// 单位内码

	public String FName;// 单位名称

	public String FNumber;// 单位代码

	public int FStandard;// 基本单位 0:不是 1:是

	public int getFItemID() {
		return FItemID;
	}

	public void setFItemID(int fItemID) {
		FItemID = fItemID;
	}

	public String getFName() {
		return FName;
	}

	public void setFName(String fName) {
		FName = fName;
	}

	public String getFNumber() {
		return FNumber;
	}

	public void setFNumber(String fNumber) {
		FNumber = fNumber;
	}

	public int getFStandard() {
		return FStandard;
	}

	public void setFStandard(int fStandard) {
		FStandard = fStandard;
	}

}
