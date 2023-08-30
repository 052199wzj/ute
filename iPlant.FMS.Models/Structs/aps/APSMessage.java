package com.mes.server.service.po.aps;

import java.io.Serializable;

public class APSMessage implements Serializable {
	private static final long serialVersionUID = 1L;
	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0; // 错误ID
	// [DataMember(Name = "Type", Order = 1)]
	public String Type = ""; // 错误类型
	// [DataMember(Name = "ProductNo", Order = 2)]
	public String ProductNo = ""; // 产品规格
	// [DataMember(Name = "WorkShopID", Order = 3)]
	public int WorkShopID = 0; // 车间ID
	// [DataMember(Name = "LineID", Order = 4)]
	public int LineID = 0; // 产线ID
	// [DataMember(Name = "PartID", Order = 5)]
	public int PartID = 0; // 工序段ID
	// [DataMember(Name = "PartName", Order = 6)]
	public String PartName = ""; // 工序段名称
	// [DataMember(Name = "MessageText", Order = 7)]
	public String MessageText = ""; // 异常描述

	public APSMessage() {
		this.ID = 0;
		this.Type = "";
		this.ProductNo = "";
		this.WorkShopID = 0;
		this.LineID = 0;
		this.PartID = 0;
		this.PartName = "";
		this.MessageText = "";
	}

}
