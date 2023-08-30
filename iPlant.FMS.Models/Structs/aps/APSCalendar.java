package com.mes.server.service.po.aps;

import java.io.Serializable;
import java.util.List;
import java.util.List;

public class APSCalendar implements Serializable {
	private static final long serialVersionUID = 1L;

	// [DataMember(Name = "ID", Order = 0)]
	public int ID= 0;
	// [DataMember(Name = "UnitID", Order = 1)]
	public int UnitID= 0; // 加工单元ID
	// [DataMember(Name = "UnitName", Order = 2)]
	public String UnitName=""; // 加工单元名称
	// [DataMember(Name = "UnitCode", Order = 3)]
	public String UnitCode="";  // 加工单元编码
	// [DataMember(Name = "UnitLevel", Order = 4)]
	public int UnitLevel= 0; // 加工单元类型
	// [DataMember(Name = "ShiftPeriod", Order = 5)]
	public int ShiftPeriod= 0; // 排程周期：小时、天、周、月
	// [DataMember(Name = "ShiftMode", Order = 6)]
	public int ShiftMode= 0; // 1:白班；2.倒班；3.夜班；4.自由方式（白班优先）
	// [DataMember(Name = "ShiftWorkHours", Order = 7)]
	public int ShiftWorkHours= 0; // 白班标准班的工作时长
	// [DataMember(Name = "MaxLoadRate", Order = 8)]
	public float MaxLoadRate; // 1.白班模式下的最大负载率，超出最大负载则安排夜班或休息
	// [DataMember(Name = "WorkCalendarList", Order = 9)]
	public List<APSWorkCalendar> WorkCalendarList = new List<>(); // 工作日历
	// [DataMember(Name = "CheckWorkHours", Order = 10)]
	public boolean CheckWorkHours = false; // 是否校验工时
	// [DataMember(Name = "ShiftID", Order = 11)]
	public int ShiftID= 0; // 1:排班班次
	// [DataMember(Name = "CheckShiftHours", Order = 12)]
	public boolean CheckShiftHours= false; // 1:是否校验已排班任务工时
	// [DataMember(Name = "UnitPeriod", Order = 13)]
	public int UnitPeriod= 0;       // 产线生产周期(分钟、小时、班、天、周、月、季度)
	// [DataMember(Name = "DisplayMode", Order = 14)]
	public int DisplayMode= 0;      // 1:订单排序；2.工序模式

	public APSCalendar() {
		this.ID = 0;
		this.UnitID = 0;
		this.UnitName = "";
		this.UnitCode = "";
		
		this.UnitLevel= 0;
		this.ShiftPeriod= 0;
		this.ShiftMode= 0;
		this.ShiftWorkHours= 0;
		this.WorkCalendarList = new List<>();
		
		this.MaxLoadRate = (float) 1.0;
		this.CheckShiftHours = true;
		this.ShiftID= 0;
		this.CheckWorkHours = true;
		this.UnitPeriod = 5;
		this.DisplayMode = 1;
	}
}
