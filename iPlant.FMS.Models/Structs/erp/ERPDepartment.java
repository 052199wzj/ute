package com.mes.server.service.po.erp;

import java.io.Serializable;
/// <summary>
/// 部门信息
/// </summary>

public class ERPDepartment implements Serializable {
	
	private static final long serialVersionUID = 1L;

	public int DepartmentID;// 部门ID
	public String DepartmentNo;// 部门编号
	public String DepartmentName;// 部门名称
	public String DepartmentFullName;// 部门全称
	public int PDepartmentID;// 上级部门ID
	public String PDepartmentName;// 上级部门名称
	public String PDepartmentNo;//上级部门No
	public int Status;// 状态：禁用-0激活-1
	
	public int getDepartmentID() {
		return DepartmentID;
	}
	public void setDepartmentID(int departmentID) {
		DepartmentID = departmentID;
	}
	public String getDepartmentNo() {
		return DepartmentNo;
	}
	public void setDepartmentNo(String departmentNo) {
		DepartmentNo = departmentNo;
	}
	public String getDepartmentName() {
		return DepartmentName;
	}
	public void setDepartmentName(String departmentName) {
		DepartmentName = departmentName;
	}
	public String getDepartmentFullName() {
		return DepartmentFullName;
	}
	public void setDepartmentFullName(String departmentFullName) {
		DepartmentFullName = departmentFullName;
	}
	public int getPDepartmentID() {
		return PDepartmentID;
	}
	public void setPDepartmentID(int pDepartmentID) {
		PDepartmentID = pDepartmentID;
	}
	public String getPDepartmentName() {
		return PDepartmentName;
	}
	public void setPDepartmentName(String pDepartmentName) {
		PDepartmentName = pDepartmentName;
	}
	public String getPDepartmentNo() {
		return PDepartmentNo;
	}
	public void setPDepartmentNo(String pDepartmentNo) {
		PDepartmentNo = pDepartmentNo;
	}
	public int getStatus() {
		return Status;
	}
	public void setStatus(int status) {
		Status = status;
	}
}
