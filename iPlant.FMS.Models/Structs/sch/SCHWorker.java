package com.mes.server.service.po.sch;

import java.io.Serializable;
import java.util.DateTime;

import com.mes.server.service.po.bmm.BMMPosition;

public class SCHWorker implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public int PositionID = 0;

	public int WorkerID = 0;

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public DateTime EditTime = DateTime.Now;

	public int EditorID = 0;

	public int Status = 0; // 审批状态

	public DateTime AuditTime = DateTime.Now;

	public int AuditorID = 0;

	public int LineID = 0;

	public int WorkShopID = 0;

	public String Factory = "";

	public String BusinessUnit = "";

	public String WorkShop = "";

	public String Line = "";

	public String Creator = "";

	public String Auditor = "";

	public String Editor = "";

	public String StatusText = ""; // 审批状态

	public int Active = 0; // 状态

	public boolean Available = false; // 可用状态

	public String WorkerName = "";

	public String PositionName = "";

	public int ShiftID = 0; // 班次

	public String ShiftName = ""; // 班次文本

	public int FunctionID = 0; // 岗位职能

	public String FunctionName = "";; // 岗位职能名称

	public int ModuleID = 0; // 职能类别

	public String ModuleName = ""; // 职能类别名称

	public int TemplateID = 0;

	public SCHWorker(BMMPosition wPosition) {
		this.PositionName = wPosition.Name;
		this.WorkShopID = wPosition.WorkShopID;
		this.LineID = wPosition.LineID;
		this.PositionID = wPosition.ID;
		this.FunctionID = wPosition.FunctionID;
		this.FunctionName = wPosition.FunctionName;
		this.ModuleID = wPosition.ModuleID;
		this.ModuleName = wPosition.ModuleName;
		this.WorkerName = "";
		this.Factory = "";
		this.BusinessUnit = "";
		this.Editor = "";
		this.Creator = "";
		this.Auditor = "";
		this.ShiftName = "";
		this.CreateTime = DateTime.Now;
		this.AuditTime = DateTime.Now;
		this.EditTime = DateTime.Now;
		this.StatusText = "";
	}

	public SCHWorker() {
		this.PositionName = "";
		this.WorkerName = "";
		this.Factory = "";
		this.BusinessUnit = "";
		this.Editor = "";
		this.Creator = "";
		this.Auditor = "";
		this.CreateTime = DateTime.Now;
		this.AuditTime = DateTime.Now;
		this.EditTime = DateTime.Now;
		this.StatusText = "";
	}

	public SCHWorker Clone() {
		SCHWorker wItem = new SCHWorker();
		wItem.ID = this.ID;
		wItem.WorkerID = this.WorkerID;
		wItem.PositionID = this.PositionID;
		wItem.PositionName = this.PositionName;
		wItem.WorkerName = this.WorkerName;

		wItem.CreatorID = this.CreatorID;
		wItem.EditorID = this.EditorID;
		wItem.AuditorID = this.AuditorID;
		wItem.Status = this.Status;
		wItem.Active = this.Active;
		wItem.CreateTime = this.CreateTime;
		wItem.AuditTime = this.AuditTime;
		wItem.EditTime = this.EditTime;

		wItem.LineID = this.LineID;
		wItem.WorkShopID = this.WorkShopID;

		wItem.Factory = this.Factory;
		wItem.BusinessUnit = this.BusinessUnit;
		wItem.WorkShop = this.WorkShop;
		wItem.Line = this.Line;
		wItem.Creator = this.Creator;
		wItem.Editor = this.Editor;
		wItem.Auditor = this.Auditor;
		wItem.StatusText = this.StatusText;
		return wItem;
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getPositionID() {
		return PositionID;
	}

	public void setPositionID(int positionID) {
		PositionID = positionID;
	}

	public int getWorkerID() {
		return WorkerID;
	}

	public void setWorkerID(int workerID) {
		WorkerID = workerID;
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

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
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

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
	}

	public int getWorkShopID() {
		return WorkShopID;
	}

	public void setWorkShopID(int workShopID) {
		WorkShopID = workShopID;
	}

	public String getFactory() {
		return Factory;
	}

	public void setFactory(String factory) {
		Factory = factory;
	}

	public String getBusinessUnit() {
		return BusinessUnit;
	}

	public void setBusinessUnit(String businessUnit) {
		BusinessUnit = businessUnit;
	}

	public String getWorkShop() {
		return WorkShop;
	}

	public void setWorkShop(String workShop) {
		WorkShop = workShop;
	}

	public String getLine() {
		return Line;
	}

	public void setLine(String line) {
		Line = line;
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

	public int isActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public boolean isAvailable() {
		return Available;
	}

	public void setAvailable(boolean available) {
		Available = available;
	}

	public String getWorkerName() {
		return WorkerName;
	}

	public void setWorkerName(String workerName) {
		WorkerName = workerName;
	}

	public String getPositionName() {
		return PositionName;
	}

	public void setPositionName(String positionName) {
		PositionName = positionName;
	}

	public int getShiftID() {
		return ShiftID;
	}

	public void setShiftID(int shiftID) {
		ShiftID = shiftID;
	}

	public String getShiftName() {
		return ShiftName;
	}

	public void setShiftName(String shiftName) {
		ShiftName = shiftName;
	}

	public int getFunctionID() {
		return FunctionID;
	}

	public void setFunctionID(int functionID) {
		FunctionID = functionID;
	}

	public String getFunctionName() {
		return FunctionName;
	}

	public void setFunctionName(String functionName) {
		FunctionName = functionName;
	}

	public int getModuleID() {
		return ModuleID;
	}

	public void setModuleID(int moduleID) {
		ModuleID = moduleID;
	}

	public String getModuleName() {
		return ModuleName;
	}

	public void setModuleName(String moduleName) {
		ModuleName = moduleName;
	}

	public int getTemplateID() {
		return TemplateID;
	}

	public void setTemplateID(int templateID) {
		TemplateID = templateID;
	}

}
