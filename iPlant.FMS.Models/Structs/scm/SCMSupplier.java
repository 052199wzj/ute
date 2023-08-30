package com.mes.server.service.po.scm;

import java.io.Serializable;
import java.util.DateTime;

public class SCMSupplier implements Serializable {
	private static final long serialVersionUID = 1L;
	
	public int ID=0;
 
    public String SupplierName="";   //供应商名称

    public String SupplierCode="";   //供应商编码
 
    public String TaxCode="";        //税号

    public int CountryID=0;         //国家
  
    public int ProvinceID=0;        //省份
 
    public int CityID=0;            //城市
   
    public String Country="";
   
    public String Province="";

    public String City="";
  
    public String Address="";        //地址
  
    public int Type=0;              //行业
  
    public String TypeText="";
   
    public int Grade=0;             //等级
   
    public String GradeText="";
   
    public String Creator="";       //创建人
    
    public String Auditor="";         //审核人
   
    public DateTime CreateTime;
    
    public DateTime AuditTime;
  
    public int Active=0;
    
    public int Status=0;
   
    public String BankName="";      //开户银行
   
    public String BankAccount="";   //账号
    
    public SCMSupplier()
    {
		this.ID = 0;
		this.CountryID = 0;
		this.ProvinceID = 0;
		this.CityID = 0;
		this.Type = 0;
		this.Grade = 0;
		this.Status = 0;
		
		this.SupplierName="";
		this.SupplierCode="";
		
		this.TaxCode="";
		this.Country="";
		this.Province="";
		this.City="";
		this.Address="";
		
		this.TypeText="";
		this.GradeText="";
		
		this.Creator="";
		this.Auditor="";
		this.BankName="";
		this.BankAccount="";
		
		this.CreateTime = DateTime.Now;
		this.AuditTime = DateTime.Now;
    }

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
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

	public String getTaxCode() {
		return TaxCode;
	}

	public void setTaxCode(String taxCode) {
		TaxCode = taxCode;
	}

	public int getCountryID() {
		return CountryID;
	}

	public void setCountryID(int countryID) {
		CountryID = countryID;
	}

	public int getProvinceID() {
		return ProvinceID;
	}

	public void setProvinceID(int provinceID) {
		ProvinceID = provinceID;
	}

	public int getCityID() {
		return CityID;
	}

	public void setCityID(int cityID) {
		CityID = cityID;
	}

	public String getCountry() {
		return Country;
	}

	public void setCountry(String country) {
		Country = country;
	}

	public String getProvince() {
		return Province;
	}

	public void setProvince(String province) {
		Province = province;
	}

	public String getCity() {
		return City;
	}

	public void setCity(String city) {
		City = city;
	}

	public String getAddress() {
		return Address;
	}

	public void setAddress(String address) {
		Address = address;
	}

	public int getType() {
		return Type;
	}

	public void setType(int type) {
		Type = type;
	}

	public String getTypeText() {
		return TypeText;
	}

	public void setTypeText(String typeText) {
		TypeText = typeText;
	}

	public int getGrade() {
		return Grade;
	}

	public void setGrade(int grade) {
		Grade = grade;
	}

	public String getGradeText() {
		return GradeText;
	}

	public void setGradeText(String gradeText) {
		GradeText = gradeText;
	}

	public String getCreator() {
		return Creator;
	}

	public void setCreator(String creator) {
		Creator = creator;
	}

	public String getAuditor() {
		return Auditor;
	}

	public void setAuditor(String auditor) {
		Auditor = auditor;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public DateTime getAuditTime() {
		return AuditTime;
	}

	public void setAuditTime(DateTime auditTime) {
		AuditTime = auditTime;
	}

	public int isActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public String getBankName() {
		return BankName;
	}

	public void setBankName(String bankName) {
		BankName = bankName;
	}

	public String getBankAccount() {
		return BankAccount;
	}

	public void setBankAccount(String bankAccount) {
		BankAccount = bankAccount;
	}
}
