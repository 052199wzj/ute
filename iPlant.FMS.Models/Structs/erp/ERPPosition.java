package com.mes.server.service.po.erp;

import java.io.Serializable;
/// <summary>
/// 岗位信息
/// </summary>

public class ERPPosition implements Serializable {
	private static final long serialVersionUID = 1L;
	public int PositionID;// 岗位ID
	public String PositionNo;// 岗位编码
	public String PositionName;// 岗位名称
	public int DepartmentID;// 部门ID
	public String Departmentname;// 部门名称
	public String DepartmentFullName;// 部门全称
	public int Status;// 状态：禁用-0激活-1
	
	public int getPositionID() {
		return PositionID;
	}
	public void setPositionID(int positionID) {
		PositionID = positionID;
	}
	public String getPositionNo() {
		return PositionNo;
	}
	public void setPositionNo(String positionNo) {
		PositionNo = positionNo;
	}
	public String getPositionName() {
		return PositionName;
	}
	public void setPositionName(String positionName) {
		PositionName = positionName;
	}
	public int getDepartmentID() {
		return DepartmentID;
	}
	public void setDepartmentID(int departmentID) {
		DepartmentID = departmentID;
	}
	public String getDepartmentname() {
		return Departmentname;
	}
	public void setDepartmentname(String departmentname) {
		Departmentname = departmentname;
	}
	public String getDepartmentFullName() {
		return DepartmentFullName;
	}
	public void setDepartmentFullName(String departmentFullName) {
		DepartmentFullName = departmentFullName;
	}
	public int getStatus() {
		return Status;
	}
	public void setStatus(int status) {
		Status = status;
	}
}
