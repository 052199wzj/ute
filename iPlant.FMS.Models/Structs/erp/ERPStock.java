package com.mes.server.service.po.erp;

import java.io.Serializable;

public class ERPStock implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ERPStock() {
		// TODO Auto-generated constructor stub
	}

	public int FItemID;// 库房内码

	public String FName;// 库房名称

	public String FNumber;// 库房代码

	public int FGroupID;// 组ID

	public int FDeleted;// 是否禁用

	public int FSPGroupID;// 仓位组ID

	public int FTypeID;// 库房类型

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

	public int getFGroupID() {
		return FGroupID;
	}

	public void setFGroupID(int fGroupID) {
		FGroupID = fGroupID;
	}

	public int getFDeleted() {
		return FDeleted;
	}

	public void setFDeleted(int fDeleted) {
		FDeleted = fDeleted;
	}

	public int getFSPGroupID() {
		return FSPGroupID;
	}

	public void setFSPGroupID(int fSPGroupID) {
		FSPGroupID = fSPGroupID;
	}

	public int getFTypeID() {
		return FTypeID;
	}

	public void setFTypeID(int fTypeID) {
		FTypeID = fTypeID;
	}

}
