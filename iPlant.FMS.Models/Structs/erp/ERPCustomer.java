package com.mes.server.service.po.erp;

import java.io.Serializable;

public class ERPCustomer implements Serializable {
	/**
	 * ERP客户信息
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 客户ID
	 */
	public int CustomerID;
	/**
	 * 客户编码
	 */
	public String CustomerNo;
	/**
	 * 客户名称
	 */
	public String CustomerName;
	/**
	 * 客户组ID
	 */
	public int CustomerGroupID;
	/**
	 * 客户组名称
	 */
	public String CustomerGroupName;
	/**
	 * 电话
	 */
	public String Phone;
	/**
	 * 状态
	 */
	public int Status;

	public int getCustomerID() {
		return CustomerID;
	}

	public void setCustomerID(int customerID) {
		CustomerID = customerID;
	}

	public String getCustomerNo() {
		return CustomerNo;
	}

	public void setCustomerNo(String customerNo) {
		CustomerNo = customerNo;
	}

	public String getCustomerName() {
		return CustomerName;
	}

	public void setCustomerName(String customerName) {
		CustomerName = customerName;
	}

	public int getCustomerGroupID() {
		return CustomerGroupID;
	}

	public void setCustomerGroupID(int customerGroupID) {
		CustomerGroupID = customerGroupID;
	}

	public String getCustomerGroupName() {
		return CustomerGroupName;
	}

	public void setCustomerGroupName(String customerGroupName) {
		CustomerGroupName = customerGroupName;
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

	public ERPCustomer() {
		CustomerNo = "";
		CustomerName = "";
		CustomerGroupName = "";
		Phone = "";
	}
}
