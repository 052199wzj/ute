package com.mes.server.service.po.sfc;

import java.io.Serializable;
import java.util.DateTime;

public class SFCLoginEvent implements Serializable {
	private static final long serialVersionUID = 1L;

	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0;
	// [DataMember(Name = "WorkShopID", Order = 1)]
	public int WorkShopID = 0; // 车间ID
	// [DataMember(Name = "StationID", Order = 2)]
	public int StationID = 0; // 工位ID
	// [DataMember(Name = "OperatorID", Order = 3)]
	public int OperatorID = 0; // 操作员ID
	// [DataMember(Name = "ModuleID", Order = 4)]
	public int ModuleID = 0; // 生产、质量、工艺、设备、仓库
	// [DataMember(Name = "ShiftID", Order = 5)]
	public int ShiftID = 0; // 当前班次
	// [DataMember(Name = "Active", Order = 6)]
	public int Active = 0; // 激活状态
	// [DataMember(Name = "LoginTime", Order = 7)]
	public DateTime LoginTime = DateTime.Now; // 打卡时刻
	// [DataMember(Name = "Type", Order = 8)]
	public int Type = 0; // 打卡类型：上岗|下岗
	// 辅助属性
	// [DataMember(Name = "WorkShopName", Order = 9)]
	public String WorkShopName = "";
	// [DataMember(Name = "Operator", Order = 10)]
	public String OperatorName = ""; // 操作员
	// [DataMember(Name = "ModuleName", Order = 11)]
	public String ModuleName = ""; // 职能分类
	// [DataMember(Name = "StationName", Order = 12)]
	public String StationName = "";
	// [DataMember(Name = "LoginText", Order = 13)]
	public String LoginText = ""; // 打卡说明

	public SFCLoginEvent() {
		this.ID = 0;
		this.WorkShopID = 0;
		this.StationID = 0;
		this.OperatorID = 0;
		this.ModuleID = 0;
		this.ShiftID = 0;
		this.Type = 0;
		this.Active = 0;

		this.LoginTime = DateTime.Now;
		this.WorkShopName = "";
		this.OperatorName = "";
		this.ModuleName = "";
		this.StationName = "";
		this.LoginText = "";
	}

	public SFCLoginEvent(int wLoginID, int wWorkShopID, int wStationID, int wModuleID, int wLoginType) {
		this.LoginTime = DateTime.Now;
		this.WorkShopName = "";
		this.OperatorName = "";
		this.ModuleName = "";
		this.OperatorID = wLoginID;
		this.WorkShopID = wWorkShopID;
		this.StationID = wStationID;
		this.ModuleID = wModuleID;
		this.Type = wLoginType;
	}
}
