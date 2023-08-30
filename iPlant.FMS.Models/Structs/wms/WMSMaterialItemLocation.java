package com.mes.server.service.po.wms;

import java.io.Serializable;
import java.util.DateTime;

public class WMSMaterialItemLocation implements Serializable {
	private static final long serialVersionUID = 1L;

	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0;
	// [DataMember(Name = "StockID", Order = 1)]
	public int StockID = 0;
	// [DataMember(Name = "LocationID", Order = 2)]
	public int LocationID = 0;
	// [DataMember(Name = "FQTYPL", Order = 3)]
	public float FQTYPL; // 实际取料数
	// [DataMember(Name = "FQTYKC", Order = 4)]
	public float FQTYKC; // 库存数量
	// [DataMember(Name = "StockTime", Order = 5)]
	public DateTime StockTime = DateTime.Now; // 库存时刻
	// [DataMember(Name = "BatchNo", Order = 6)]
	public String BatchNo = ""; // 批号
	// [DataMember(Name = "StockStatus", Order = 7)]
	public int StockStatus = 0; // 库存状态
	// [DataMember(Name = "Status", Order = 8)]
	public int Status = 0; // 提交状态
	// [DataMember(Name = "RemarkText", Order = 9)]
	public String RemarkText = ""; // 备注信息
	// [DataMember(Name = "LocationName", Order = 10)]
	public String LocationName = "";
	// [DataMember(Name = "StockName", Order = 11)]
	public String StockName = "";

	public WMSMaterialItemLocation() {
		this.ID = 0;
		this.StockID = 0;
		this.LocationID = 0;
		this.FQTYPL = 0;
		this.FQTYKC = 0;
		
		this.StockStatus = 0;
		this.Status = 0;
		this.BatchNo = "";
		this.RemarkText = "";
		this.StockTime = DateTime.Now;
		this.LocationName = "";
		this.StockName = "";
	}
}
