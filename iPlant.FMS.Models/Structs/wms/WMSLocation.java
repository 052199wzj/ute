package com.mes.server.service.po.wms;

import java.io.Serializable;
import java.util.DateTime;

public class WMSLocation implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public int LocationID = 0;

	public String LocationText = "";

	public int StockID = 0;

	public String StockName = "";

	public int Length = 0; // 单位毫米

	public int Width = 0; // 单位毫米

	public int Height = 0; // 单位毫米
	// [DataMember(Name = "CreatorID", Order = 7)]
	public int CreatorID = 0;
	// [DataMember(Name = "CreateTime", Order = 8)]
	public DateTime CreateTime = DateTime.Now;
	// [DataMember(Name = "Active", Order = 9)]
	public int Active = 0;
	// [DataMember(Name = "Creator", Order = 10)]
	public String Creator = "";

	public WMSLocation() {
		this.ID = 0;
		this.LocationText = "";
		this.StockID = 0;
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
