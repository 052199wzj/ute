package com.mes.server.service.po.erp;

import java.io.Serializable;
/// <summary>
/// 人员信息
/// </summary>

public class ERPEmployee implements Serializable {
	/**
	 * 人员信息
	 */
	private static final long serialVersionUID = 1L;

	public int EmployeeID;// 员工ID
	public String EmployeeNo;// 员工编号
	public String EmployeeName;// 员工姓名
	public int DepartmentID;// 部门ID
	public String DepartmentName;// 部门名称
	public int PositionID;// 岗位ID
	public String PositionName;// 岗位名称
	public String Phone;// 电话
	public int Status;// 状态：禁用-0激活-1

	public int getEmployeeID() {
		return EmployeeID;
	}

	public void setEmployeeID(int employeeID) {
		EmployeeID = employeeID;
	}

	public String getEmployeeNo() {
		return EmployeeNo;
	}

	public void setEmployeeNo(String employeeNo) {
		EmployeeNo = employeeNo;
	}

	public String getEmployeeName() {
		return EmployeeName;
	}

	public void setEmployeeName(String employeeName) {
		EmployeeName = employeeName;
	}

	public int getDepartmentID() {
		return DepartmentID;
	}

	public void setDepartmentID(int departmentID) {
		DepartmentID = departmentID;
	}

	public String getDepartmentName() {
		return DepartmentName;
	}

	public void setDepartmentName(String departmentName) {
		DepartmentName = departmentName;
	}

	public int getPositionID() {
		return PositionID;
	}

	public void setPositionID(int positionID) {
		PositionID = positionID;
	}

	public String getPositionName() {
		return PositionName;
	}

	public void setPositionName(String positionName) {
		PositionName = positionName;
	}

	public String getPhone() {
		return Phone;
	}

	public void setPhone(String phone) {
		Phone = phone;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}
}
