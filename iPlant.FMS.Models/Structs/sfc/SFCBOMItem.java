package com.mes.server.service.po.sfc;

import java.io.Serializable;
import java.util.DateTime;
 

public class SFCBOMItem implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public int ID = 0;
	
	public int BOMID=0;
	
	public int BOMItemID=0;
	
	public String BOMNo="";
	 
	public String WBSNo = "";

	public int OrderID = 0;

	public String PartNo = "";

	public int LineID = 0;

	public String LineName = "";

	public int ProductID = 0;

	public String ProductNo = "";

	public int CustomerID = 0;
	
	public String CustomerCode="";

	public int PartID = 0;

	public String PartName = "";

	public int PartPointID = 0;

	public String PartPointName = "";

	public int MaterialID = 0;

	public String MaterialNo = "";

	public String MaterialName = "";

	public Double Number = 0.0;

	public int UnitID = 0;

	public String UnitText = "PC";

	public int AuditorID = 0;

	public String Auditor = "";

	public DateTime AuditTime = DateTime.Now;

	public int EditorID = 0;

	public String Editor = "";

	public DateTime EditTime = DateTime.Now;

	public int Status = 0;

	public SFCBOMItem() {
	}

	 

	 
	 

	public String getWBSNo() {
		return WBSNo;
	}

	public void setWBSNo(String wBSNo) {
		WBSNo = wBSNo;
	}

	public int getOrderID() {
		return OrderID;
	}

	public void setOrderID(int orderID) {
		OrderID = orderID;
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

	public int getProductID() {
		return ProductID;
	}

	public void setProductID(int productID) {
		ProductID = productID;
	}

	public String getProductNo() {
		return ProductNo;
	}

	public void setProductNo(String productNo) {
		ProductNo = productNo;
	}

	public int getPartID() {
		return PartID;
	}

	public void setPartID(int partID) {
		PartID = partID;
	}

	public String getPartNo() {
		return PartNo;
	}

	public void setPartNo(String partNo) {
		PartNo = partNo;
	}

	public int getPartPointID() {
		return PartPointID;
	}

	public void setPartPointID(int partPointID) {
		PartPointID = partPointID;
	}

	public String getPartPointName() {
		return PartPointName;
	}

	public void setPartPointName(String partPointName) {
		PartPointName = partPointName;
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

	public Double getNumber() {
		return Number;
	}

	public void setNumber(Double number) {
		Number = number;
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
 
	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getCustomerID() {
		return CustomerID;
	}

	public void setCustomerID(int customerID) {
		CustomerID = customerID;
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

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public DateTime getEditTime() {
		return EditTime;
	}

	public void setEditTime(DateTime editTime) {
		EditTime = editTime;
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

	public String getPartName() {
		return PartName;
	}

	public void setPartName(String partName) {
		PartName = partName;
	}

	public String getCustomerCode() {
		return CustomerCode;
	}

	public void setCustomerCode(String customerCode) {
		CustomerCode = customerCode;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

}
