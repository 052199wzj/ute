package com.mes.server.service.po.scm;

import java.io.Serializable;
import java.util.DateTime;

public class SCMOrder implements Serializable {
	private static final long serialVersionUID = 1L;
	
	 public int ID= 0;
 
     public String OrderNo="";
   
     public int SupplierID=0;
  
     public String SupplierName="";
  
     public String SupplierCode="";
   
     public int MaterialID= 0;
   
     public String MaterialNo="";
   
     public String MaterialName="";
 
     public float FQTY=0.0f;          //数量
 
     public float Price=0.0f;         //价格
  
     public int UnitID= 0;            //单位
 
     public String Address="";        //收货地址
   
     public String LinkMan="";        //供应商联系人
  
     public String LinkPhone="";      //供应商联系电话
  
     public int OperatorID= 0;
 
     public String Operator="";
   
     public DateTime ApplyTime= DateTime.Now;
    
     public int AuditorID= 0;
  
     public String Auditor="";
    
     public DateTime AuditTime= DateTime.Now;
  
     public int Status= 0;
   
     public int MRPID= 0;
    
     public String TaxCode="";

     public String UnitText="";
     
     public String StatusText="";
   
     public int Active=0;
     
     public SCMOrder()
     {
		this.ID = 0;
		this.SupplierID = 0;
		this.MaterialID = 0;
		this.UnitID = 0;
		this.OperatorID = 0;
		this.AuditorID = 0;
		
		this.Status = 0;
		this.MRPID = 0;
		
		this.FQTY=0.0f;
		this.Price=0.0f; 
		this.Active=0;
		
		this.OrderNo = "";
		this.SupplierName = "";
		this.MaterialNo = "";
		this.MaterialName = "";
		
		this.Address = "";
		this.LinkMan = "";
		this.LinkPhone = "";
		this.Operator = "";
		this.Auditor = "";
		
		this.TaxCode = "";
		this.UnitText = "";
		this.StatusText = "";
		
		this.ApplyTime = DateTime.Now;
		this.AuditTime = DateTime.Now;
     }

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
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

	public int getUnitID() {
		return UnitID;
	}

	public void setUnitID(int unitID) {
		UnitID = unitID;
	}

	public String getAddress() {
		return Address;
	}

	public void setAddress(String address) {
		Address = address;
	}

	public String getLinkMan() {
		return LinkMan;
	}

	public void setLinkMan(String linkMan) {
		LinkMan = linkMan;
	}

	public String getLinkPhone() {
		return LinkPhone;
	}

	public void setLinkPhone(String linkPhone) {
		LinkPhone = linkPhone;
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

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public int getMRPID() {
		return MRPID;
	}

	public void setMRPID(int mRPID) {
		MRPID = mRPID;
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

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}
}
