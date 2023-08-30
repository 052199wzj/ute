package com.mes.server.service.po.aps;

import java.io.Serializable;
import java.util.DateTime;

import com.mes.server.service.mesenum.BPMStatus;
import com.mes.server.service.po.mss.MSSBOMItem;

public class APSBOMItem implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	/**
	 * BOM类型 检修/新造
	 */
	public int BOMType = 0;

	/**
	 * 
	 */
	public int FactoryID = 1900;

	public String WBSNo = "";

	public int OrderID = 0;


	public String PartNo = "";

	public int LineID = 0;

	public String LineName = "";

	public int ProductID = 0;

	public String ProductNo = "";

	public int CustomerID = 0;

	public String CustomerCode = "";

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

	/**
	 * 必换1/偶换2/计划外 9
	 */
	public int ReplaceType = 0;

	/**
	 * 委外必修件1/委外偶修件2/自修必修3/自修偶修4/ 其他0
	 */
	public int OutsourceType = 0;

	/**
	 * 原拆原装要求 X/空
	 */
	public int OriginalType = 0;

	/**
	 * 是否拆解下车 X/空
	 */
	public int DisassyType = 0;

	/**
	 * 是否超产线 X/空
	 */
	public int OverLine = 0;

	/**
	 * 是否呼唤件 X/空
	 */
	public int PartChange = 0;

	/**
	 * 领料部门
	 */
	public String ReceiveDepart = "0001";

	/**
	 * 仓库号 1100新造 1200检修
	 */
	public int StockID = 0;

	/**
	 * 质量损失大类 报废001 返工返修002 停产003 内部质量收入004
	 */
	public int QTType = 0;
	/**
	 * 质量损失小类 设计差错01 工艺差错02 制造差错03 供方原因04 其他原因05
	 */
	public int QTItemType = 0;

	/**
	 * 客户供料 X/空
	 */
	public int CustomerMaterial = 0;

	public int AuditorID = 0;

	public String Auditor = "";

	public DateTime AuditTime = DateTime.Now;

	public int EditorID = 0;

	public String Editor = "";

	public DateTime EditTime = DateTime.Now;

	public int Status = 0;

	public APSBOMItem() {
	}

	public APSBOMItem(MSSBOMItem wBOMItem, int wLineID, int wProductID, int wCustomerID, int wOrderID, String wWBSNo,
			String wPartNo) {

		this.BOMType = wBOMItem.BOMType;
		this.LineID = wLineID;
		this.ProductID = wProductID;
		this.CustomerID = wCustomerID;
		this.OrderID = wOrderID;
		this.WBSNo = wWBSNo;
		this.PartNo = wPartNo;
		this.MaterialID = wBOMItem.MaterialID;
		this.MaterialNo = wBOMItem.MaterialNo;
		this.Number =  wBOMItem.MaterialNumber;
		this.OriginalType = wBOMItem.OriginalType;
		this.OutsourceType = wBOMItem.OutsourceType;
		this.DisassyType = wBOMItem.DisassyType;
		this.OverLine = 0;
		this.PartID = wBOMItem.PlaceID;
		this.PartPointID = wBOMItem.PartPointID;
		this.ReplaceType = wBOMItem.ReplaceType;
		this.StockID = getStockIDByBOMType(wBOMItem.BOMType);
		this.MaterialNo = wBOMItem.MaterialNo;
		this.UnitID = wBOMItem.UnitID;
		this.Status = (int)BPMStatus.Save();

	}

	public int getStockIDByBOMType(int wBOMType) {
		switch (wBOMType) {
		case 1:
			return 1100;
		case 2:
			return 1200;
		default:
			break;
		}
		return 0;
	}

	public int getBOMType() {
		return BOMType;
	}

	public void setBOMType(int bOMType) {
		BOMType = bOMType;
	}

	public int getFactoryID() {
		return FactoryID;
	}

	public void setFactoryID(int factoryID) {
		FactoryID = factoryID;
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

	public int getReplaceType() {
		return ReplaceType;
	}

	public void setReplaceType(int replaceType) {
		ReplaceType = replaceType;
	}

	public int getOutsourceType() {
		return OutsourceType;
	}

	public void setOutsourceType(int outsourceType) {
		OutsourceType = outsourceType;
	}

	public int getOriginalType() {
		return OriginalType;
	}

	public void setOriginalType(int originalType) {
		OriginalType = originalType;
	}

	public int getDisassyType() {
		return DisassyType;
	}

	public void setDisassyType(int disassyType) {
		DisassyType = disassyType;
	}

	public int getOverLine() {
		return OverLine;
	}

	public void setOverLine(int overLine) {
		OverLine = overLine;
	}

	public int getPartChange() {
		return PartChange;
	}

	public void setPartChange(int partChange) {
		PartChange = partChange;
	}

	public String getReceiveDepart() {
		return ReceiveDepart;
	}

	public void setReceiveDepart(String receiveDepart) {
		ReceiveDepart = receiveDepart;
	}

	public int getStockID() {
		return StockID;
	}

	public void setStockID(int stockID) {
		StockID = stockID;
	}

	public int getQTType() {
		return QTType;
	}

	public void setQTType(int qTType) {
		QTType = qTType;
	}

	public int getQTItemType() {
		return QTItemType;
	}

	public void setQTItemType(int qTItemType) {
		QTItemType = qTItemType;
	}

	public int getCustomerMaterial() {
		return CustomerMaterial;
	}

	public void setCustomerMaterial(int customerMaterial) {
		CustomerMaterial = customerMaterial;
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
