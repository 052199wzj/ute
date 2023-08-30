package com.mes.server.service.po.aps;

import java.io.Serializable;
import java.util.List;
import java.util.List;

public class APSEntryUnit implements Serializable {
	private static final long serialVersionUID = 1L;

	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0;
	// [DataMember(Name = "UnitID", Order = 1)]
	public int UnitID = 0; // 加工单元ID
	// [DataMember(Name = "UnitName", Order = 2)]
	public String UnitName= ""; // 加工单元名称
	// [DataMember(Name = "UnitCode", Order = 3)]
	public String UnitCode= ""; // 加工单元编码
	// [DataMember(Name = "UnitLevel", Order = 4)]
	public int UnitLevel = 0; // 加工单元类型
	// [DataMember(Name = "EntryTaskList", Order = 5)]
	public List<APSEntryTask> EntryTaskList = new List<>(); // 生产订单
	// [DataMember(Name = "OperatorID", Order = 6)]
	public int OperatorID = 0; // 计划员
	// [DataMember(Name = "LevelName", Order = 7)]
	public String LevelName= ""; // 计划层级名称
	// [DataMember(Name = "OperatorName", Order = 8)]
	public String OperatorName= "";// 计划员ID

	public APSEntryUnit() {
		this.ID = 0;
		this.UnitID = 0;
		this.UnitName = "";
		this.UnitCode = "";
		this.UnitLevel = 0;
		this.EntryTaskList = new List<>();
		this.OperatorID = 0;
		this.LevelName = "";
		this.OperatorName = "";
	}
}
