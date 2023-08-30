package com.mes.server.service.po.erp;

import java.io.Serializable;

public class ERPLocation implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ERPLocation() {
		// TODO Auto-generated constructor stub
	}

	public int FSPID;// 仓位ID

	public String FName;// 仓位名称

	public String FNumber;// 仓位代码

	public String FShortNumber;// 短代码

	public int FSPGroupID;// 仓位组ID

	public String FFullNumber;// 全名

	public int FDeleted;// 是否禁用

	public int getFSPID() {
		return FSPID;
	}

	public void setFSPID(int fSPID) {
		FSPID = fSPID;
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

	public String getFShortNumber() {
		return FShortNumber;
	}

	public void setFShortNumber(String fShortNumber) {
		FShortNumber = fShortNumber;
	}

	public int getFSPGroupID() {
		return FSPGroupID;
	}

	public void setFSPGroupID(int fSPGroupID) {
		FSPGroupID = fSPGroupID;
	}

	public String getFFullNumber() {
		return FFullNumber;
	}

	public void setFFullNumber(String fFullNumber) {
		FFullNumber = fFullNumber;
	}

	public int getFDeleted() {
		return FDeleted;
	}

	public void setFDeleted(int fDeleted) {
		FDeleted = fDeleted;
	}

}
