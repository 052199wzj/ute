package com.mes.server.service.po.fmc;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class FMCWorkDay implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0; // 1--8;

	public String Name = ""; // 班次名称

	public DateTime StartTime = DateTime.Now; // 开始时刻

	public int Minutes = 0; // 总时长;

	public int WorkMinutes = 0; // 工作时长;

	public int IdleMinutes = 0; // 休息时长;

	public DateTime EndTime = DateTime.Now; // 结束时刻

	public List<FMCShift> ShiftList = new List<>();

	public int Active = 0;

	public int Status = 0;

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public DateTime EditTime = DateTime.Now;

	public int EditorID = 0;

	public DateTime AuditTime = DateTime.Now;

	public int AuditorID = 0;

	public int FactoryID = 0;

	public int WorkShopID = 0;

	public String WorkShopName = "";

	public String Factory = "";

	public String Creator = "";

	public String Auditor = "";

	public String Editor = "";

	public String StatusText = ""; // 审批状态

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

	public DateTime getEndTime() {
		return EndTime;
	}

	public void setEndTime(DateTime endTime) {
		EndTime = endTime;
	}

	public List<FMCShift> getShiftList() {
		return ShiftList;
	}

	public void setShiftList(List<FMCShift> shiftList) {
		ShiftList = shiftList;
	}

	public int isActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
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

	public DateTime getEditTime() {
		return EditTime;
	}

	public void setEditTime(DateTime editTime) {
		EditTime = editTime;
	}

	public int getEditorID() {
		return EditorID;
	}

	public void setEditorID(int editorID) {
		EditorID = editorID;
	}

	public DateTime getAuditTime() {
		return AuditTime;
	}

	public void setAuditTime(DateTime auditTime) {
		AuditTime = auditTime;
	}

	public int getAuditorID() {
		return AuditorID;
	}

	public void setAuditorID(int auditorID) {
		AuditorID = auditorID;
	}

	public int getFactoryID() {
		return FactoryID;
	}

	public void setFactoryID(int factoryID) {
		FactoryID = factoryID;
	}

	public String getFactory() {
		return Factory;
	}

	public void setFactory(String factory) {
		Factory = factory;
	}

	public String getCreator() {
		return Creator;
	}

	public void setCreator(String creator) {
		Creator = creator;
	}

	public String getAuditor() {
		return Auditor;
	}

	public void setAuditor(String auditor) {
		Auditor = auditor;
	}

	public String getEditor() {
		return Editor;
	}

	public void setEditor(String editor) {
		Editor = editor;
	}

	public String getStatusText() {
		return StatusText;
	}

	public void setStatusText(String statusText) {
		StatusText = statusText;
	}

	public FMCWorkDay() {
		this.ID = 0;
		this.Name = "";
		this.Minutes = 0;
		this.WorkMinutes = 0;
		this.IdleMinutes = 0;

		this.StartTime = DateTime.Now;
		this.EndTime = (DateTime) this.StartTime.clone();
		this.Minutes = 480;
		this.EndTime.Add(DateTime.MINUTE, this.Minutes);
		this.ShiftList = new List<>();
		this.Factory = "";
		this.Creator = "";
		this.Editor = "";
		this.Auditor = "";
		this.StatusText = "";
	}

	public FMCWorkDay Clone() {
		FMCWorkDay wShift = new FMCWorkDay();
		wShift.ID = this.ID;
		wShift.Name = this.Name;
		wShift.Minutes = this.Minutes;
		wShift.WorkMinutes = this.WorkMinutes;
		wShift.IdleMinutes = this.IdleMinutes;

		wShift.StartTime = this.StartTime;
		wShift.EndTime = this.EndTime;

		wShift.FactoryID = this.FactoryID;
		wShift.AuditorID = this.AuditorID;
		wShift.EditorID = this.EditorID;
		wShift.CreatorID = this.CreatorID;
		wShift.Status = this.Status;
		wShift.Active = this.Active;
		wShift.ShiftList = new List<FMCShift>(this.ShiftList);
		return wShift;
	}
}
