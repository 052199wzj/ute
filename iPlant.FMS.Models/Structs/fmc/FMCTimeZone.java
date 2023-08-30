package com.mes.server.service.po.fmc;

import java.io.Serializable;
import java.util.DateTime;

public class FMCTimeZone implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID = 0; // 0--100;

	public String ZoneName = "";

	public DateTime StartTime = DateTime.Now;// 开始时刻

	public int Minutes = 0; // 时长;

	public boolean IdleOrWork = false; // true:休息，false：工作

	public int ShiftID = 0;

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getZoneName() {
		return ZoneName;
	}

	public void setZoneName(String zoneName) {
		ZoneName = zoneName;
	}

	public DateTime getStartTime() {
		return StartTime;
	}

	public void setStartTime(DateTime startTime) {
		StartTime = startTime;
	}

	public int getMinutes() {
		return Minutes;
	}

	public void setMinutes(int minutes) {
		Minutes = minutes;
	}

	public boolean isIdleOrWork() {
		return IdleOrWork;
	}

	public void setIdleOrWork(boolean idleOrWork) {
		IdleOrWork = idleOrWork;
	}

	public int getShiftID() {
		return ShiftID;
	}

	public void setShiftID(int shiftID) {
		ShiftID = shiftID;
	}

	public FMCTimeZone() {
		this.ID = 0;
		this.StartTime = DateTime.Now;
		this.Minutes = 0;
		this.IdleOrWork = true;
	}
}
