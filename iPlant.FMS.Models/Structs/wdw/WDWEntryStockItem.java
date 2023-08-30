package com.mes.server.service.po.wdw;

import java.io.Serializable;

public class WDWEntryStockItem implements Serializable {
	private static final long serialVersionUID = 1L;

	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0;
	// [DataMember(Name = "PartPointID", Order = 1)]
	public int PartPointID = 0;
	// [DataMember(Name = "FQTY", Order = 2)]
	public float FQTY;
	// [DataMember(Name = "StockStatus", Order = 3)]
	public int StockStatus = 0;
	// [DataMember(Name = "EntryPartID", Order = 4)]
	public int EntryPartID = 0; // 报工单ID
	// [DataMember(Name = "PartPointName", Order = 5)]
	public String PartPointName = "";
	// [DataMember(Name = "MaterialNo", Order = 6)]
	public String MaterialNo = "";
	// [DataMember(Name = "StockID", Order = 7)]
	public int StockID = 0;
	// [DataMember(Name = "LocationID", Order = 8)]
	public int LocationID = 0;
	// [DataMember(Name = "FlotText", Order = 9)]
	public String FlotText;
	// [DataMember(Name = "ERPEntryID", Order = 10)]
	public int ERPEntryID = 0; // ERP生产订单实体ID
	// [DataMember(Name = "Status", Order = 11)]
	public int Status = 0;
	// [DataMember(Name = "TaskID", Order = 12)]
	public int TaskID = 0;
	// [DataMember(Name = "StockName", Order = 13)]
	public String StockName = "";
	// [DataMember(Name = "LocationName", Order = 14)]
	public String LocationName = "";
	// [DataMember(Name = "StockCode", Order = 15)]
	public String StockCode = "";
	// [DataMember(Name = "LocationText", Order = 16)]
	public String LocationText = "";
	// [DataMember(Name = "RemarkText", Order = 17)]
	public String RemarkText = "";

	public WDWEntryStockItem() {
		this.ID = 0;
		this.PartPointID = 0;
		this.FQTY = 0.0f;
		this.StockStatus = 0;
		this.EntryPartID = 0;
		this.StockID = 0;
		this.LocationID = 0;
		this.ERPEntryID = 0;
		this.Status = 0;
		this.TaskID = 0;
		this.MaterialNo = "";
		this.FlotText = "";
		this.StockName = "";
		this.LocationName = "";
		this.StockCode = "";
		this.LocationText = "";
		this.PartPointName = "";
		this.RemarkText = "";
	}
}
