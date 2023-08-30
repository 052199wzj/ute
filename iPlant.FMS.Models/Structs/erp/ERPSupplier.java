package com.mes.server.service.po.erp;

import java.io.Serializable;

public class ERPSupplier implements Serializable {

	/**
	 * ERP供应商信息
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 供应商ID
	 */
	public int SupplierID;
	/**
	 * 供应商编码
	 */
	public String SupplierNo;
	/**
	 * 供应商名称
	 */
	public String SupplierName;
	/**
	 * 状态
	 */
	public int Status;

	public int getSupplierID() {
		return SupplierID;
	}

	public void setSupplierID(int supplierID) {
		SupplierID = supplierID;
	}

	public String getSupplierNo() {
		return SupplierNo;
	}

	public void setSupplierNo(String supplierNo) {
		SupplierNo = supplierNo;
	}

	public String getSupplierName() {
		return SupplierName;
	}

	public void setSupplierName(String supplierName) {
		SupplierName = supplierName;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public ERPSupplier() {
		this.SupplierNo = "";
		this.SupplierName = "";
	}
}
