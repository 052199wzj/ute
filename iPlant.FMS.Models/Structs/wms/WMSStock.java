package com.mes.server.service.po.wms;

import java.io.Serializable;
import java.util.DateTime;

public class WMSStock implements Serializable {
	private static final long serialVersionUID = 1L;
	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0;
	// [DataMember(Name = "StockName", Order = 1)]
	public String StockName = "";
	// [DataMember(Name = "Length", Order = 2)]
	public int Length = 0; // 单位毫米
	// [DataMember(Name = "Width", Order = 3)]
	public int Width = 0; // 单位毫米
	// [DataMember(Name = "Height", Order = 4)]
	public int Height = 0; // 单位毫米
	// [DataMember(Name = "CreatorID", Order = 5)]
	public int CreatorID = 0;
	// [DataMember(Name = "CreateTime", Order = 6)]
	public DateTime CreateTime = DateTime.Now;
	// [DataMember(Name = "Active", Order = 7)]
	public int Active = 0;
	// [DataMember(Name = "Creator", Order = 8)]
	public String Creator = "";

	public WMSStock() {
		this.ID = 0;
		this.StockName = "";
		this.Length = 0;
		this.Width = 0;
		this.Height = 0;
		this.CreatorID = 0;
		this.CreateTime = DateTime.Now;
		this.Active = 0;
		this.Creator = "";
	}
}
