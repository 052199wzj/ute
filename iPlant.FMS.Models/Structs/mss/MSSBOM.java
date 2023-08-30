package com.mes.server.service.po.mss;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class MSSBOM implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public String BOMNo = "";

	public String BOMName = "";

	public int RouteID = 0;

	public String VersionNo = "";

	public int Status = 0;

	public DateTime EditTime = DateTime.Now;

	public DateTime AuditTime = DateTime.Now;

	public String Author = "";

	public String Auditor = "";

	public int WorkShopID = 0; // 制造车间ID

	public int TypeID = 0; // BOM类型：1.标准BOM；2.自定义BOM

	public String StatusText = "";

	public String WorkShop = ""; // 制造车间

	public String Type = "";

	public int MaterialID = 0;

	public String MaterialNo = "";

	public String MaterialName = "";

	public int LineID = 0; // 制造产线ID

	public int PartID = 0; // 工序段ID

	public String LineName = ""; // 产线名称

	public String PartName = ""; // 工序段名称

	public int CustomerID = 0;

	public String CustomerName = "";

	public int IsStandard = 0;

	/**
	 * 产品规格
	 */
	public int ProductID;

	public List<MSSBOMItem> ItemList = new List<>(); // Item集合

	public MSSBOM() {
		this.ItemList = new List<>();
		this.BOMNo = "";
		this.BOMName = "";
		this.Author = "";
		this.Auditor = "";
		this.StatusText = "";
		this.WorkShop = "";
		this.Type = "";
		this.MaterialNo = "";
		this.MaterialName = "";
		this.PartName = "";
		this.LineName = "";
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getBOMNo() {
		return BOMNo;
	}

	public void setBOMNo(String bOMNo) {
		BOMNo = bOMNo;
	}

	public String getBOMName() {
		return BOMName;
	}

	public void setBOMName(String bOMName) {
		BOMName = bOMName;
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

	public DateTime getAuditTime() {
		return AuditTime;
	}

	public void setAuditTime(DateTime auditTime) {
		AuditTime = auditTime;
	}

	public String getAuthor() {
		return Author;
	}

	public void setAuthor(String author) {
		Author = author;
	}

	public String getAuditor() {
		return Auditor;
	}

	public void setAuditor(String auditor) {
		Auditor = auditor;
	}

	public int getWorkShopID() {
		return WorkShopID;
	}

	public void setWorkShopID(int workShopID) {
		WorkShopID = workShopID;
	}

	public int getTypeID() {
		return TypeID;
	}

	public void setTypeID(int typeID) {
		TypeID = typeID;
	}

	public String getStatusText() {
		return StatusText;
	}

	public void setStatusText(String statusText) {
		StatusText = statusText;
	}

	public String getWorkShop() {
		return WorkShop;
	}

	public void setWorkShop(String workShop) {
		WorkShop = workShop;
	}

	public String getType() {
		return Type;
	}

	public void setType(String type) {
		Type = type;
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

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
	}

	public int getPartID() {
		return PartID;
	}

	public void setPartID(int partID) {
		PartID = partID;
	}

	public String getLineName() {
		return LineName;
	}

	public void setLineName(String lineName) {
		LineName = lineName;
	}

	public String getPartName() {
		return PartName;
	}

	public void setPartName(String partName) {
		PartName = partName;
	}

	public List<MSSBOMItem> getItemList() {
		return ItemList;
	}

	public void setItemList(List<MSSBOMItem> itemList) {
		ItemList = itemList;
	}

	public int getProductID() {
		return ProductID;
	}

	public void setProductID(int productID) {
		ProductID = productID;
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

	public int getIsStandard() {
		return IsStandard;
	}

	public void setIsStandard(int isStandard) {
		IsStandard = isStandard;
	}

	public int getRouteID() {
		return RouteID;
	}

	public void setRouteID(int routeID) {
		RouteID = routeID;
	}

	public String getVersionNo() {
		return VersionNo;
	}

	public void setVersionNo(String versionNo) {
		VersionNo = versionNo;
	}

	 

}
