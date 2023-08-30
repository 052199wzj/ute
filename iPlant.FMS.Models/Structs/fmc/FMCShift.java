package com.mes.server.service.po.fmc;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class FMCShift implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0; // 1--8;

	public String Name; // 班次名称

	public DateTime StartTime = DateTime.Now; // 开始时刻

	public int Minutes = 0; // 总时长;

	public int WorkMinutes = 0; // 工作时长;

	public int IdleMinutes = 0; // 休息时长;

	public List<FMCTimeZone> IdleZoneList = new List<>();

	public DateTime EndTime = DateTime.Now; // 结束时刻

	public int Active = 0;

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public String Creator = "";

	public int WorkDayID = 0; // 模板;

	public int LevelID = 0; // 1--3：白、中、晚;

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
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

	public int getWorkMinutes() {
		return WorkMinutes;
	}

	public void setWorkMinutes(int workMinutes) {
		WorkMinutes = workMinutes;
	}

	public int getIdleMinutes() {
		return IdleMinutes;
	}

	public void setIdleMinutes(int idleMinutes) {
		IdleMinutes = idleMinutes;
	}

	public List<FMCTimeZone> getIdleZoneList() {
		return IdleZoneList;
	}

	public void setIdleZoneList(List<FMCTimeZone> idleZoneList) {
		IdleZoneList = idleZoneList;
	}

	public DateTime getEndTime() {
		return EndTime;
	}

	public void setEndTime(DateTime endTime) {
		EndTime = endTime;
	}

	public int isActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public int getCreatorID() {
		return CreatorID;
	}

	public void setCreatorID(int creatorID) {
		CreatorID = creatorID;
	}

	public String getCreator() {
		return Creator;
	}

	public void setCreator(String creator) {
		Creator = creator;
	}

	public int getWorkDayID() {
		return WorkDayID;
	}

	public void setWorkDayID(int workDayID) {
		WorkDayID = workDayID;
	}

	public int getLevelID() {
		return LevelID;
	}

	public void setLevelID(int levelID) {
		LevelID = levelID;
	}

	public FMCShift() {
		this.ID = 0;
		this.Name = "";
		this.Minutes = 0;
		this.WorkMinutes = 0;
		this.IdleMinutes = 0;

		this.StartTime = DateTime.Now;
		this.EndTime = (DateTime) this.StartTime.clone();
		this.Minutes = 480;
		this.EndTime.Add(DateTime.MINUTE, this.Minutes);
		this.IdleZoneList = new List<>();
		this.Creator = "";
	}

	public FMCShift Clone() {
		FMCShift wShift = new FMCShift();
		wShift.ID = this.ID;
		wShift.Name = this.Name;
		wShift.Minutes = this.Minutes;
		wShift.WorkMinutes = this.WorkMinutes;
		wShift.IdleMinutes = this.IdleMinutes;

		wShift.StartTime = this.StartTime;
		wShift.EndTime = this.EndTime;

		wShift.CreatorID = this.CreatorID;
		wShift.Active = this.Active;
		wShift.IdleZoneList = new List<FMCTimeZone>(this.IdleZoneList);
		return wShift;
	}
}
