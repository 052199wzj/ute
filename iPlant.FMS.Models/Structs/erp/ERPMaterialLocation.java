package com.mes.server.service.po.erp;

import java.io.Serializable;
import java.util.DateTime;

public class ERPMaterialLocation implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public String MaterialNo;

	public String MaterialName;

	public float FQTY;

	public int StockID;

	public int LocationID;

	public int StockUnitID;

	public String SPECIFICATION;

	public int StockStatus;

	public DateTime StockTime = DateTime.Now;

	public String StockName;

	public String LocationName; // 仓位编码

	public int EntryID;

	public String LocationText; // 仓位二维码

	public int ActionMode; // 1:生产配料；2：生产入库

	public int ActionTaskID; // 配料任务ID或报工任务ID

	public boolean IsFlotEnable;

	public int ERPMaterialID; // ERP物料ID

	public int BatchID; // ERP批号

	public String Batch; // ERP批号文本

	public int ShiftID;

	public float FQTYStock;// 库存数

	public String StockStatusText;

	public int ItemID;

	public String FeedBoxText;

	public String StockCode; // ERP仓库编码

	public int ERPResult; // ERP交互结果

	public String RemarkText; // 手工备注
	// 配料员
	public int CompounderID;
	// 领料员
	public int ReceivingClerkID;

	public String MaterialModel;// 物料规格型号

	public int BaseUnitID;// 基本计量单位编号

	public String BaseUnitName;// 基本计量单位名称

	public float FQTYOnline;// 在线数

	public float FQTYDJ;// 待检数

	public float FQTYZG;// 在购数

	public ERPMaterialLocation() {
		this.Batch = "";
		this.MaterialName = "";
		this.StockName = "";
		this.LocationName = "";
		this.SPECIFICATION = "";
		this.StockTime.set(2000, 0, 1);
		this.FeedBoxText = "";
		this.RemarkText = "";
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

	public int getStockID() {
		return StockID;
	}

	public void setStockID(int stockID) {
		StockID = stockID;
	}

	public int getLocationID() {
		return LocationID;
	}

	public void setLocationID(int locationID) {
		LocationID = locationID;
	}

	public int getStockUnitID() {
		return StockUnitID;
	}

	public void setStockUnitID(int stockUnitID) {
		StockUnitID = stockUnitID;
	}

	public String getSPECIFICATION() {
		return SPECIFICATION;
	}

	public void setSPECIFICATION(String sPECIFICATION) {
		SPECIFICATION = sPECIFICATION;
	}

	public int getStockStatus() {
		return StockStatus;
	}

	public void setStockStatus(int stockStatus) {
		StockStatus = stockStatus;
	}

	public DateTime getStockTime() {
		return StockTime;
	}

	public void setStockTime(DateTime stockTime) {
		StockTime = stockTime;
	}

	public String getStockName() {
		return StockName;
	}

	public void setStockName(String stockName) {
		StockName = stockName;
	}

	public String getLocationName() {
		return LocationName;
	}

	public void setLocationName(String locationName) {
		LocationName = locationName;
	}

	public int getEntryID() {
		return EntryID;
	}

	public void setEntryID(int entryID) {
		EntryID = entryID;
	}

	public String getLocationText() {
		return LocationText;
	}

	public void setLocationText(String locationText) {
		LocationText = locationText;
	}

	public int getActionMode() {
		return ActionMode;
	}

	public void setActionMode(int actionMode) {
		ActionMode = actionMode;
	}

	public int getActionTaskID() {
		return ActionTaskID;
	}

	public void setActionTaskID(int actionTaskID) {
		ActionTaskID = actionTaskID;
	}

	public boolean isIsFlotEnable() {
		return IsFlotEnable;
	}

	public void setIsFlotEnable(boolean isFlotEnable) {
		IsFlotEnable = isFlotEnable;
	}

	public int getERPMaterialID() {
		return ERPMaterialID;
	}

	public void setERPMaterialID(int eRPMaterialID) {
		ERPMaterialID = eRPMaterialID;
	}

	public int getBatchID() {
		return BatchID;
	}

	public void setBatchID(int batchID) {
		BatchID = batchID;
	}

	public String getBatch() {
		return Batch;
	}

	public void setBatch(String batch) {
		Batch = batch;
	}

	public int getShiftID() {
		return ShiftID;
	}

	public void setShiftID(int shiftID) {
		ShiftID = shiftID;
	}

	public float getFQTYStock() {
		return FQTYStock;
	}

	public void setFQTYStock(float fQTYStock) {
		FQTYStock = fQTYStock;
	}

	public String getStockStatusText() {
		return StockStatusText;
	}

	public void setStockStatusText(String stockStatusText) {
		StockStatusText = stockStatusText;
	}

	public int getItemID() {
		return ItemID;
	}

	public void setItemID(int itemID) {
		ItemID = itemID;
	}

	public String getFeedBoxText() {
		return FeedBoxText;
	}

	public void setFeedBoxText(String feedBoxText) {
		FeedBoxText = feedBoxText;
	}

	public String getStockCode() {
		return StockCode;
	}

	public void setStockCode(String stockCode) {
		StockCode = stockCode;
	}

	public int getERPResult() {
		return ERPResult;
	}

	public void setERPResult(int eRPResult) {
		ERPResult = eRPResult;
	}

	public String getRemarkText() {
		return RemarkText;
	}

	public void setRemarkText(String remarkText) {
		RemarkText = remarkText;
	}

	public int getCompounderID() {
		return CompounderID;
	}

	public void setCompounderID(int compounderID) {
		CompounderID = compounderID;
	}

	public int getReceivingClerkID() {
		return ReceivingClerkID;
	}

	public void setReceivingClerkID(int receivingClerkID) {
		ReceivingClerkID = receivingClerkID;
	}

	public String getMaterialModel() {
		return MaterialModel;
	}

	public void setMaterialModel(String materialModel) {
		MaterialModel = materialModel;
	}

	public int getBaseUnitID() {
		return BaseUnitID;
	}

	public void setBaseUnitID(int baseUnitID) {
		BaseUnitID = baseUnitID;
	}

	public String getBaseUnitName() {
		return BaseUnitName;
	}

	public void setBaseUnitName(String baseUnitName) {
		BaseUnitName = baseUnitName;
	}

	public float getFQTYOnline() {
		return FQTYOnline;
	}

	public void setFQTYOnline(float fQTYOnline) {
		FQTYOnline = fQTYOnline;
	}

	public float getFQTYDJ() {
		return FQTYDJ;
	}

	public void setFQTYDJ(float fQTYDJ) {
		FQTYDJ = fQTYDJ;
	}

	public float getFQTYZG() {
		return FQTYZG;
	}

	public void setFQTYZG(float fQTYZG) {
		FQTYZG = fQTYZG;
	}

}
