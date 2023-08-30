package com.mes.server.service.po.erp;

import java.io.Serializable;
/// <summary>
/// 单位信息
/// </summary>

public class ERPUnit implements Serializable {
	
	
	private static final long serialVersionUID = 1L;

	public int UnitID;// 单位ID
	public String UnitNo;// 单位编号
	public String UnitName;// 单位名称
	public int Status;// 状态：禁用-2激活-1
	
	public int getUnitID() {
		return UnitID;
	}
	public void setUnitID(int unitID) {
		UnitID = unitID;
	}
	public String getUnitNo() {
		return UnitNo;
	}
	public void setUnitNo(String unitNo) {
		UnitNo = unitNo;
	}
	public String getUnitName() {
		return UnitName;
	}
	public void setUnitName(String unitName) {
		UnitName = unitName;
	}
	public int getStatus() {
		return Status;
	}
	public void setStatus(int status) {
		Status = status;
	}
	
}
