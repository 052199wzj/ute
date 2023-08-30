package com.mes.server.service.po.scm;

import java.io.Serializable;
import java.util.DateTime;

public class SCMReturnGoods implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public int OrderID = 0;

	public String OrderNo;

	public int SupplierID = 0;

	public String SupplierName;

	public String SupplierCode;

	public float FQTY = 0.0f;

	public float Price = 0.0f;

	public float Money = 0.0f;

	public int UnitID = 0;

	public int OperatorID = 0; // 申请人

	public String Operator; // 申请人

	public DateTime ApplyTime; // 申请时间

	public int AuditorID = 0; // 审核人

	public String Auditor; // 审核人

	public DateTime AuditTime; // 审核时间

	public int ShipperID = 0; // 发货人

	public String Shipper; // 发货人

	public DateTime ShipTime; // 发货时间

	public int PayerID = 0; // 收款确认人

	public String Payer; // 收款确认人

	public DateTime PayTime; // 收款时间

	public int Status = 0;

	public String ApplyText;

	public String TaxCode;

	public String UnitText;

	public String StatusText;

	public int MaterialID = 0;

	public String MaterialNo;

	public String MaterialName;

	public SCMReturnGoods() {
		this.ID = 0;
		this.OrderID = 0;
		this.SupplierID = 0;
		this.UnitID = 0;
		this.MaterialID = 0;

		this.OperatorID = 0;
		this.AuditorID = 0;
		this.ShipperID = 0;
		this.PayerID = 0;
		this.Status = 0;

		this.FQTY = 0.0f;
		this.Price = 0.0f;
		this.Money = 0.0f;

		this.Operator = "";
		this.Auditor = "";
		this.Shipper = "";
		this.Payer = "";

		this.ApplyText = "";
		this.TaxCode = "";
		this.UnitText = "";
		this.StatusText = "";

		this.OrderNo = "";
		this.SupplierName = "";
		this.SupplierCode = "";
		this.MaterialNo = "";
		this.MaterialName = "";

		this.ApplyTime = DateTime.Now;
		this.AuditTime = DateTime.Now;
		this.ShipTime = DateTime.Now;
		this.PayTime = DateTime.Now;
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getOrderID() {
		return OrderID;
	}

	public void setOrderID(int orderID) {
		OrderID = orderID;
	}

	public String getOrderNo() {
		return OrderNo;
	}

	public void setOrderNo(String orderNo) {
		OrderNo = orderNo;
	}

	public int getSupplierID() {
		return SupplierID;
	}

	public void setSupplierID(int supplierID) {
		SupplierID = supplierID;
	}

	public String getSupplierName() {
		return SupplierName;
	}

	public void setSupplierName(String supplierName) {
		SupplierName = supplierName;
	}

	public String getSupplierCode() {
		return SupplierCode;
	}

	public void setSupplierCode(String supplierCode) {
		SupplierCode = supplierCode;
	}

	public float getFQTY() {
		return FQTY;
	}

	public void setFQTY(float fQTY) {
		FQTY = fQTY;
	}

	public float getPrice() {
		return Price;
	}

	public void setPrice(float price) {
		Price = price;
	}

	public float getMoney() {
		return Money;
	}

	public void setMoney(float money) {
		Money = money;
	}

	public int getUnitID() {
		return UnitID;
	}

	public void setUnitID(int unitID) {
		UnitID = unitID;
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

	public DateTime getApplyTime() {
		return ApplyTime;
	}

	public void setApplyTime(DateTime applyTime) {
		ApplyTime = applyTime;
	}

	public int getAuditorID() {
		return AuditorID;
	}

	public void setAuditorID(int auditorID) {
		AuditorID = auditorID;
	}

	public String getAuditor() {
		return Auditor;
	}

	public void setAuditor(String auditor) {
		Auditor = auditor;
	}

	public DateTime getAuditTime() {
		return AuditTime;
	}

	public void setAuditTime(DateTime auditTime) {
		AuditTime = auditTime;
	}

	public int getShipperID() {
		return ShipperID;
	}

	public void setShipperID(int shipperID) {
		ShipperID = shipperID;
	}

	public String getShipper() {
		return Shipper;
	}

	public void setShipper(String shipper) {
		Shipper = shipper;
	}

	public DateTime getShipTime() {
		return ShipTime;
	}

	public void setShipTime(DateTime shipTime) {
		ShipTime = shipTime;
	}

	public int getPayerID() {
		return PayerID;
	}

	public void setPayerID(int payerID) {
		PayerID = payerID;
	}

	public String getPayer() {
		return Payer;
	}

	public void setPayer(String payer) {
		Payer = payer;
	}

	public DateTime getPayTime() {
		return PayTime;
	}

	public void setPayTime(DateTime payTime) {
		PayTime = payTime;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public String getApplyText() {
		return ApplyText;
	}

	public void setApplyText(String applyText) {
		ApplyText = applyText;
	}

	public String getTaxCode() {
		return TaxCode;
	}

	public void setTaxCode(String taxCode) {
		TaxCode = taxCode;
	}

	public String getUnitText() {
		return UnitText;
	}

	public void setUnitText(String unitText) {
		UnitText = unitText;
	}

	public String getStatusText() {
		return StatusText;
	}

	public void setStatusText(String statusText) {
		StatusText = statusText;
	}

	public int getMaterialID() {
		return MaterialID;
	}

	public void setMaterialID(int materialID) {
		MaterialID = materialID;
	}

	public String getMaterialNo() {
		return MaterialNo;
	}

	public void setMaterialNo(String materialNo) {
		MaterialNo = materialNo;
	}

	public String getMaterialName() {
		return MaterialName;
	}

	public void setMaterialName(String materialName) {
		MaterialName = materialName;
	}
}
