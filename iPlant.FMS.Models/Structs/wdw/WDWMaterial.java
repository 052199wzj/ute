package com.mes.server.service.po.wdw;

import java.io.Serializable;
import java.util.DateTime;

public class WDWMaterial implements Serializable {
	private static final long serialVersionUID = 1L;

	// [DataMember(Name = "ID", Order = 0)]
	public int ID=0;
	// [DataMember(Name = "MaterialID", Order = 1)]
	public int MaterialID=0;
	// [DataMember(Name = "MaterialNo", Order = 2)]
	public String MaterialNo= "";
	// [DataMember(Name = "MaterialName", Order = 3)]
	public String MaterialName= "";
	// [DataMember(Name = "StationID", Order = 4)]
	public int StationID=0; // 工位ID
	// [DataMember(Name = "Active", Order = 5)]
	public int Active=0; // 是否最后的物料
	// [DataMember(Name = "ScanTime", Order = 6)]
	public DateTime ScanTime= DateTime.Now; // 扫码时刻
	// [DataMember(Name = "BatchNo", Order = 7)]
	public String BatchNo= ""; // 批号
	// [DataMember(Name = "BatchID", Order = 8)]
	public String BatchID= ""; // 单体ID

	public WDWMaterial() {
		this.ID=0;
		this.MaterialID=0;
		this.StationID=0;
		this.ScanTime = DateTime.Now;
		this.BatchNo = "";
		this.BatchID = "";
		this.MaterialNo = "";
		this.MaterialName = "";
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
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

	public int getStationID() {
		return StationID;
	}

	public void setStationID(int stationID) {
		StationID = stationID;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public DateTime getScanTime() {
		return ScanTime;
	}

	public void setScanTime(DateTime scanTime) {
		ScanTime = scanTime;
	}

	public String getBatchNo() {
		return BatchNo;
	}

	public void setBatchNo(String batchNo) {
		BatchNo = batchNo;
	}

	public String getBatchID() {
		return BatchID;
	}

	public void setBatchID(String batchID) {
		BatchID = batchID;
	}
}
