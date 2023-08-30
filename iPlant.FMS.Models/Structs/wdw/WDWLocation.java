package com.mes.server.service.po.wdw;

import java.io.Serializable;

public class WDWLocation implements Serializable {
	private static final long serialVersionUID = 1L;

	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0;
	// [DataMember(Name = "StockID", Order = 1)]
	public int StockID = 0;
	// [DataMember(Name = "StockName", Order = 2)]
	public String StockName = "";
	// [DataMember(Name = "StockCode", Order = 3)]
	public String StockCode = "";
	// [DataMember(Name = "LocationID", Order = 4)]
	public int LocationID = 0;
	// [DataMember(Name = "LocationName", Order = 5)]
	public String LocationName = "";
	// [DataMember(Name = "ProductNo", Order = 6)]
	public String ProductNo = "";
	// [DataMember(Name = "Location_Total", Order = 7)]
	public int Location_Total = 0;
	// [DataMember(Name = "Location_Used", Order = 8)]
	public int Location_Used = 0;
	// [DataMember(Name = "Location_Margin", Order = 9)]
	public int Location_Margin = 0;
	// [DataMember(Name = "StockStatus", Order = 10)]
	public int StockStatus = 0;
	// [DataMember(Name = "StockStatusText", Order = 11)]
	public String StockStatusText = "";
	// [DataMember(Name = "Active", Order = 12)]
	public int Active = 0;
	// [DataMember(Name = "MaterialNo", Order = 13)]
	public String MaterialNo = "";
	// [DataMember(Name = "FENTRYID", Order = 14)]
	public int FENTRYID = 0;
	// [DataMember(Name = "FFLEXID", Order = 15)]
	public int FFLEXID = 0;

	public WDWLocation() {
		this.ID = 0;
		this.StockID = 0;
		this.LocationID = 0;
		this.Location_Total = 14;
		this.Location_Used = 0;

		this.Location_Margin = 0;
		this.StockStatus = 0;
		this.Active = 0;
		this.FENTRYID = 0;
		this.FFLEXID = 0;

		this.MaterialNo = "";
		this.StockName = "";
		this.StockCode = "";
		this.LocationName = "";
		this.ProductNo = "";

		this.StockStatusText = "";
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getStockID() {
		return StockID;
	}

	public void setStockID(int stockID) {
		StockID = stockID;
	}

	public String getStockName() {
		return StockName;
	}

	public void setStockName(String stockName) {
		StockName = stockName;
	}

	public String getStockCode() {
		return StockCode;
	}

	public void setStockCode(String stockCode) {
		StockCode = stockCode;
	}

	public int getLocationID() {
		return LocationID;
	}

	public void setLocationID(int locationID) {
		LocationID = locationID;
	}

	public String getLocationName() {
		return LocationName;
	}

	public void setLocationName(String locationName) {
		LocationName = locationName;
	}

	public String getProductNo() {
		return ProductNo;
	}

	public void setProductNo(String productNo) {
		ProductNo = productNo;
	}

	public int getLocation_Total() {
		return Location_Total;
	}

	public void setLocation_Total(int location_Total) {
		Location_Total = location_Total;
	}

	public int getLocation_Used() {
		return Location_Used;
	}

	public void setLocation_Used(int location_Used) {
		Location_Used = location_Used;
	}

	public int getLocation_Margin() {
		return Location_Margin;
	}

	public void setLocation_Margin(int location_Margin) {
		Location_Margin = location_Margin;
	}

	public int getStockStatus() {
		return StockStatus;
	}

	public void setStockStatus(int stockStatus) {
		StockStatus = stockStatus;
	}

	public String getStockStatusText() {
		return StockStatusText;
	}

	public void setStockStatusText(String stockStatusText) {
		StockStatusText = stockStatusText;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public String getMaterialNo() {
		return MaterialNo;
	}

	public void setMaterialNo(String materialNo) {
		MaterialNo = materialNo;
	}

	public int getFENTRYID() {
		return FENTRYID;
	}

	public void setFENTRYID(int fENTRYID) {
		FENTRYID = fENTRYID;
	}

	public int getFFLEXID() {
		return FFLEXID;
	}

	public void setFFLEXID(int fFLEXID) {
		FFLEXID = fFLEXID;
	}
}
