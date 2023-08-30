package com.mes.server.service.po.aps;

import java.io.Serializable;
import java.util.DateTime;

public class APSWorkShift implements Serializable {
	private static final long serialVersionUID = 1L;
	// [DataMember(Name = "ID", Order = 0)]
	public int ID= 0;
	// [DataMember(Name = "WeekDay", Order = 1)]
	public int WeekDay= 0; // 周几
	// [DataMember(Name = "ShiftID", Order = 2)]
	public int ShiftID= 0; // 白班、夜班ID
	// [DataMember(Name = "ShiftName", Order = 3)]
	public String ShiftName=""; // 班名称
	// [DataMember(Name = "WorkDate", Order = 4)]
	public DateTime WorkDate = DateTime.Now; // 工作日
	// [DataMember(Name = "Active", Order = 5)]
	public boolean Active=false; // 是否生产
	// [DataMember(Name = "WorkHours", Order = 6)]
	public int WorkHours= 0; // 工作时长

	public APSWorkShift() {
		this.ShiftName = "";
		this.WorkDate = DateTime.Now;
		this.WeekDay = this.WorkDate.get(DateTime.DAY_OF_WEEK);
		this.ID = 0;
		this.ShiftID= 0;
		this.WorkHours= 0;
		this.Active = true;
	}

	public APSWorkShift(int wID, DateTime wWorkDate) {
		this.ID = wID;
		this.WorkDate = wWorkDate;
		this.WeekDay = this.WorkDate.get(DateTime.DAY_OF_WEEK);
		this.Active = true;
		this.ShiftID= 0;
		this.ShiftName = "";
		this.WorkHours= 0;
	}
}
