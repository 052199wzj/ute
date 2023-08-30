package com.mes.server.service.po.wms;

import java.io.Serializable;
import java.util.DateTime;

public class WMSMaterialLocation implements Serializable {
	private static final long serialVersionUID = 1L;

	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0;
	// [DataMember(Name = "TaskMaterialID", Order = 1)]
	public int TaskMaterialID = 0; // 物料任务ID
	// [DataMember(Name = "StockID", Order = 2)]
	public int StockID = 0;
	// [DataMember(Name = "LocationName", Order = 3)]
	public String LocationName = "";
	// [DataMember(Name = "StockName", Order = 4)]
	public String StockName = "";
	// [DataMember(Name = "FQTYFact", Order = 5)]
	public float FQTYFact = 0.0f; // 实际配料数
	// [DataMember(Name = "Status", Order = 6)]
	public int Status = 0;
	// [DataMember(Name = "LocationID", Order = 7)]
	public int LocationID = 0;
	// [DataMember(Name = "FQTYKC", Order = 8)]
	public float FQTYKC = 0.0f; // 库存数量
	// [DataMember(Name = "StockStatus", Order = 9)]
	public int StockStatus = 0;
	// [DataMember(Name = "LocationText", Order = 10)]
	public String LocationText = ""; // 仓位二维码
	// [DataMember(Name = "FlotText", Order = 11)]
	public String FlotText = ""; // 批号
	// [DataMember(Name = "StockTime", Order = 12)]
	public DateTime StockTime = DateTime.Now; // 库存时刻
	// [DataMember(Name = "StockStatusText", Order = 13)]
	public String StockStatusText = ""; // 库存状态文本
	// [DataMember(Name = "BatchNo", Order = 14)]
	public String BatchNo = ""; // 批号
	// [DataMember(Name = "FQTYPL", Order = 15)]
	public float FQTYPL = 0.0f; // 计划配料数
	// [DataMember(Name = "FQTYMargin", Order = 16)]
	public float FQTYMargin = 0.0f; // 剩余配料数
	// [DataMember(Name = "MaterialNo", Order = 17)]
	public String MaterialNo = "";
	// [DataMember(Name = "MaterialName", Order = 18)]
	public String MaterialName = "";
	// [DataMember(Name = "TaskStepID", Order = 19)]
	public int TaskStepID = 0; // 工序任务ID
	// [DataMember(Name = "TaskPartID", Order = 20)]
	public int TaskPartID = 0; // 工段任务ID
	// [DataMember(Name = "TaskLineID", Order = 21)]
	public int TaskLineID = 0; // 产线任务ID

	public WMSMaterialLocation() {
		this.ID = 0;
		this.TaskMaterialID = 0;
		this.StockID = 0;
		this.LocationName = "";
		this.StockName = "";

		this.FlotText = "";
		this.FQTYFact = 0.0f;
		this.Status = 0;
		this.LocationID = 0;
		this.FQTYKC = 0.0f;
		this.StockStatus = 0;
		this.LocationText = "";
		this.FlotText = "";
		this.StockTime = DateTime.Now;
		this.StockStatusText = "";
		this.BatchNo = "";
		this.FQTYPL = 0.0f;

		this.FQTYMargin = 0.0f;
		this.MaterialNo = "";

		this.MaterialName = "";
		this.TaskStepID = 0;
		this.TaskPartID = 0;
		this.TaskLineID = 0;
	}
}
