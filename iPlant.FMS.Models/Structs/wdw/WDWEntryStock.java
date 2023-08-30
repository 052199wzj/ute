package com.mes.server.service.po.wdw;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class WDWEntryStock implements Serializable {
	private static final long serialVersionUID = 1L;

	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0;
	// [DataMember(Name = "OrderID", Order = 1)]
	public int OrderID = 0;
	// [DataMember(Name = "TaskLineID", Order = 2)]
	public int TaskLineID = 0;
	// [DataMember(Name = "TaskPartID", Order = 3)]
	public int TaskPartID = 0;
	// [DataMember(Name = "TaskStepID", Order = 4)]
	public int TaskStepID = 0;
	// [DataMember(Name = "FQTYTotal", Order = 5)]
	public float FQTYTotal = 0.0f;
	// [DataMember(Name = "WareKeeperID", Order = 6)]
	public int WareKeeperID = 0;
	// [DataMember(Name = "InpectorID", Order = 7)]
	public int InpectorID = 0;
	// [DataMember(Name = "ItemList", Order = 8)]
	public List<WDWEntryStockItem> ItemList = new List<>(); // 入库单各种物料状态的数量
	// [DataMember(Name = "Status", Order = 9)]
	public int Status = 0;
	// [DataMember(Name = "FeedBoxs", Order = 10)]
	public int FeedBoxs = 0; // 单个仓位存放料盒的数量
	// [DataMember(Name = "FeedBoxFQTY", Order = 11)]
	public float FeedBoxFQTY = 0.0f; // 单个料盒存放工件的数量
	// [DataMember(Name = "MaterialNo", Order = 12)]
	public String MaterialNo = "";
	// [DataMember(Name = "ERPEntryID", Order = 13)]
	public int ERPEntryID = 0; // ERP实体ID
	// [DataMember(Name = "WareKeeperName", Order = 14)]
	public String WareKeeperName = "";
	// [DataMember(Name = "InspectorName", Order = 15)]
	public String InspectorName = "";
	// [DataMember(Name = "SubmitTime", Order = 16)]
	public DateTime SubmitTime = DateTime.Now;
	// [DataMember(Name = "InStockTime", Order = 17)]
	public DateTime InStockTime = DateTime.Now;
	// [DataMember(Name = "ItemEntryList", Order = 18)]
	public List<WDWEntryStockItem> ItemEntryList = new List<>();
	// [DataMember(Name = "ItemIPTList", Order = 19)]
	public List<Int32> ItemIPTList = new List<>();
	// [DataMember(Name = "EntryPartID", Order = 20)]
	public int EntryPartID = 0;              //报工单ID
	// [DataMember(Name = "InStockType", Order = 21)]
	public int InStockType = 0;

	// [DataMember(Name = "OrderNo", Order = 22)]
	public String OrderNo = "";
	// [DataMember(Name = "ProductNo", Order = 23)]
	public String ProductNo = "";
	// [DataMember(Name = "LineName", Order = 24)]
	public String LineName = "";
	// [DataMember(Name = "PartName", Order = 25)]
	public String PartName = "";
	// [DataMember(Name = "MaterialName", Order = 26)]
	public String MaterialName = "";
	// [DataMember(Name = "LineID", Order = 27)]
	public int LineID = 0;
	// [DataMember(Name = "PartID", Order = 28)]
	public int PartID = 0;

	public WDWEntryStock() {
		this.ID = 0;
		this.OrderID = 0;
		this.TaskLineID = 0;
		this.TaskPartID = 0;
		this.TaskStepID = 0;
		this.FQTYTotal = 0.0f;
		this.WareKeeperID = 0;
		this.InpectorID = 0;
		
		this.Status = 0;
		this.FeedBoxs = 0;
		this.FeedBoxFQTY = 0.0f;
		this.ERPEntryID = 0;
		this.EntryPartID = 0;
		this.InStockType = 0;
		
		this.LineID = 0;
		this.PartID = 0;
		
		this.MaterialNo = "";
		this.OrderNo = "";
		this.ProductNo = "";
		this.LineName = "";
		this.PartName = "";
		this.MaterialName = "";
		this.WareKeeperName = "";
		this.InspectorName = "";
		
		this.ItemList = new List<>();
		this.ItemEntryList = new List<>();
		this.ItemIPTList = new List<>();
		this.SubmitTime = DateTime.Now;
		this.InStockTime = DateTime.Now;
	}
}
