package com.mes.server.service.po.mss;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

import com.mes.server.service.po.cfg.CFGItem;

/**
 * 部件清单
 * 
 * @author ShrisJava
 *
 */
public class MSSPartConfig implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public String Code = "";

	public String Name = "";
	

	public String PartTypeName = "";

	public int PartTypeID = 0;

	public int LineID = 0;

	public String LineName = "";

	public String ProductNo = "";

	public int CustomerID = 0;

	public String CustomerName = "";

	public int MaterialID = 0;

	public String MaterialNo = "";

	public String MaterialName = "";

	public List<CFGItem> SupplierList = new List<CFGItem>();

	public int UnitID = 0;

	public String UnitText = "PC";

	public int EditorID = 0;

	public String Editor = "";

	public DateTime EditTime = DateTime.Now;

	public int Active = 0;

	public MSSPartConfig() {
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

	public List<CFGItem> getSupplierList() {
		return SupplierList;
	}

	public void setSupplierList(List<CFGItem> supplierList) {
		SupplierList = supplierList;
	}

	public String getPartTypeName() {
		return PartTypeName;
	}

	public void setPartTypeName(String partTypeName) {
		PartTypeName = partTypeName;
	}

	public int getPartTypeID() {
		return PartTypeID;
	}

	public void setPartTypeID(int partTypeID) {
		PartTypeID = partTypeID;
	}

}
