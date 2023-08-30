package com.mes.server.service.po.mss;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;


/**
 * 入库部件表 Type=3时，即台车部件表
 * 
 * @author ShrisJava
 *
 */
public class MSSPartItem implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	/**
	 * 默认有值  
	 */
	public String Code = "";

	public String Name = "";

	public int LineID = 0;

	public String LineName = "";

	public String ProductNo = "";

	public int CustomerID = 0;

	public String CustomerName = "";

	public int MaterialID = 0;

	public String MaterialNo = "";

	public String MaterialName = "";

	public int UnitID = 0;

	public String UnitText = "PC";

	/**
	 * 检修-1 新造-2      台车关键部件采集-3
	 */
	public int Type = 1;

	/**
	 * 部件数量 这里只有一个
	 */
	public Double Number = 0.0;

	/**
	 * 供应商名称
	 */
	public String SupplierName = "";

	/**
	 * 供应商型号ID
	 */
	public String SupplierProductNo = "";

	/**
	 * 部件编号
	 */
	public String SupplierPartNo = "";

	/**
	 * 订单号
	 */
	public int OrderID = 0;

	/**
	 * 订单编号
	 */
	public String OrderNo = "";

	/*
	 * 车号
	 */
	public String PartNo = "";

	public int AuditorID = 0;

	public String Auditor = "";

	public DateTime AuditTime = DateTime.Now;

	public int Status = 0;

	public int Certificate = 0;

	public int Record = 0;

	/**
	 * 电子标签与二维码   无 0   二维码 1  电子标签 2  电子标签与二维码 3 
	 */
	public int QRCode = 0; 

	public int Result = 0;

	public String Remark = "";

	public List<String> ImagePath = new List<>();

	public int IsUsed = 0;

	public int EditorID = 0;

	public String Editor = "";

	public DateTime EditTime = DateTime.Now;

	public int Active = 0;
	
	public int ConfigID=0;

	public MSSPartItem() {
		super();
	}

	public MSSPartItem(MSSPartConfig wMSSPartConfig) {

		this.Code = wMSSPartConfig.Code;
		this.Name = wMSSPartConfig.Name;
		this.LineID = wMSSPartConfig.LineID;
		this.LineName = wMSSPartConfig.LineName;
		this.CustomerID = wMSSPartConfig.CustomerID;
		this.ProductNo = wMSSPartConfig.ProductNo;
		this.ConfigID=wMSSPartConfig.ID;
		this.CustomerName = wMSSPartConfig.CustomerName;
		this.MaterialID = wMSSPartConfig.MaterialID;
		this.MaterialNo = wMSSPartConfig.MaterialNo;
		this.MaterialName = wMSSPartConfig.MaterialName;
		this.UnitID = wMSSPartConfig.UnitID;
		this.UnitText = wMSSPartConfig.UnitText;
		this.EditTime = wMSSPartConfig.EditTime;
		this.Active = wMSSPartConfig.Active; 

	}

	public Double getNumber() {
		return Number;
	}

	public void setNumber(Double number) {
		Number = number;
	}

	public String getSupplierName() {
		return SupplierName;
	}

	public void setSupplierName(String supplierName) {
		SupplierName = supplierName;
	}

	public String getSupplierProductNo() {
		return SupplierProductNo;
	}

	public void setSupplierProductNo(String supplierProductNo) {
		SupplierProductNo = supplierProductNo;
	}

	public String getSupplierPartNo() {
		return SupplierPartNo;
	}

	public void setSupplierPartNo(String supplierPartNo) {
		SupplierPartNo = supplierPartNo;
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

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public int getType() {
		return Type;
	}

	public void setType(int type) {
		Type = type;
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

	public int getCertificate() {
		return Certificate;
	}

	public void setCertificate(int certificate) {
		Certificate = certificate;
	}

	public int getRecord() {
		return Record;
	}

	public void setRecord(int record) {
		Record = record;
	}

	public int getQRCode() {
		return QRCode;
	}

	public void setQRCode(int qRCode) {
		QRCode = qRCode;
	}

	public int getIsUsed() {
		return IsUsed;
	}

	public void setIsUsed(int isUsed) {
		IsUsed = isUsed;
	}

	public String getPartNo() {
		return PartNo;
	}

	public void setPartNo(String partNo) {
		PartNo = partNo;
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getCode() {
		return Code;
	}

	public void setCode(String code) {
		Code = code;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
	}

	public String getLineName() {
		return LineName;
	}

	public void setLineName(String lineName) {
		LineName = lineName;
	}

	public String getProductNo() {
		return ProductNo;
	}

	public void setProductNo(String productNo) {
		ProductNo = productNo;
	}

	public int getCustomerID() {
		return CustomerID;
	}

	public void setCustomerID(int customerID) {
		CustomerID = customerID;
	}

	public String getCustomerName() {
		return CustomerName;
	}

	public void setCustomerName(String customerName) {
		CustomerName = customerName;
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

	public int getUnitID() {
		return UnitID;
	}

	public void setUnitID(int unitID) {
		UnitID = unitID;
	}

	public String getUnitText() {
		return UnitText;
	}

	public void setUnitText(String unitText) {
		UnitText = unitText;
	}

	public int getEditorID() {
		return EditorID;
	}

	public void setEditorID(int editorID) {
		EditorID = editorID;
	}

	public String getEditor() {
		return Editor;
	}

	public void setEditor(String editor) {
		Editor = editor;
	}

	public DateTime getEditTime() {
		return EditTime;
	}

	public void setEditTime(DateTime editTime) {
		EditTime = editTime;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public int getResult() {
		return Result;
	}

	public void setResult(int result) {
		Result = result;
	}

	public String getRemark() {
		return Remark;
	}

	public void setRemark(String remark) {
		Remark = remark;
	}

	public List<String> getImagePath() {
		return ImagePath;
	}

	public void setImagePath(List<String> imagePath) {
		ImagePath = imagePath;
	}

	public int getConfigID() {
		return ConfigID;
	}

	public void setConfigID(int configID) {
		ConfigID = configID;
	}

}
