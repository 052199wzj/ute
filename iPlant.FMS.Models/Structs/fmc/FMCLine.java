package com.mes.server.service.po.fmc;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class FMCLine implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public String Name = "";

	public String Code = "";

	public String PLMCode = "";

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID;

	public DateTime EditTime = DateTime.Now;

	public int EditorID = 0;

	public int Status = 0; // 审批状态

	public DateTime AuditTime = DateTime.Now;

	public int AuditorID = 0;

	public int FactoryID = 1;

	public int BusinessUnitID = 0;

	public int WorkShopID = 1;

	public String Factory = "";

	public String BusinessUnit = "";

	public String WorkShop = "";

	public String Creator = "";

	public String Auditor = "";

	public String Editor = "";

	public String StatusText = ""; // 审批状态

	public int Active = 0; // 状态

	public int Mode = 0; // 1:物理产线模式(物理产线同工艺路径);2.虚拟产线模式(产线自由组合)

	public String ModeText = ""; // 1:物理产线模式(物理产线同工艺路径);2.虚拟产线模式(产线自由组合)

	public int ERPID = 0; // ERP对象ID

	public List<FMCLineUnit> UnitList = new List<>(); // 工序、工位、工步、工位

	public String FactoryCode = "";

	public String BusinessCode = "";

	public String WorkShopCode = ""; 

	public int ShiftID = 0; // 班次模板

	public String ShiftName = ""; // 班次模板名称

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

	public String getCode() {
		return Code;
	}

	public void setCode(String code) {
		Code = code;
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

	public int getFactoryID() {
		return FactoryID;
	}

	public void setFactoryID(int factoryID) {
		FactoryID = factoryID;
	}

	public int getBusinessUnitID() {
		return BusinessUnitID;
	}

	public void setBusinessUnitID(int businessUnitID) {
		BusinessUnitID = businessUnitID;
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

	public int getMode() {
		return Mode;
	}

	public void setMode(int mode) {
		Mode = mode;
	}

	public String getModeText() {
		return ModeText;
	}

	public void setModeText(String modeText) {
		ModeText = modeText;
	}

	public int getERPID() {
		return ERPID;
	}

	public void setERPID(int eRPID) {
		ERPID = eRPID;
	}

	public List<FMCLineUnit> getUnitList() {
		return UnitList;
	}

	public void setUnitList(List<FMCLineUnit> unitList) {
		UnitList = unitList;
	}

	public String getFactoryCode() {
		return FactoryCode;
	}

	public void setFactoryCode(String factoryCode) {
		FactoryCode = factoryCode;
	}

	public String getBusinessCode() {
		return BusinessCode;
	}

	public void setBusinessCode(String businessCode) {
		BusinessCode = businessCode;
	}

	public String getWorkShopCode() {
		return WorkShopCode;
	}

	public void setWorkShopCode(String workShopCode) {
		WorkShopCode = workShopCode;
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

	public FMCLine() {
		this.Name = "";
		this.Code = "";
		this.Factory = "";
		this.BusinessUnit = "";
		this.Editor = "";
		this.Creator = "";
		this.Auditor = "";
		this.CreateTime = DateTime.Now;
		this.AuditTime = DateTime.Now;
		this.EditTime = DateTime.Now;
		this.StatusText = "";
		this.UnitList = new List<>();
	}

	public FMCLine Clone() {
		FMCLine wItem = new FMCLine();
		wItem.ID = this.ID;
		wItem.Name = this.Name;
		wItem.Code = this.Code;
		wItem.FactoryID = this.FactoryID;
		wItem.BusinessUnitID = this.BusinessUnitID;
		wItem.WorkShop = this.WorkShop;
		wItem.CreatorID = this.CreatorID;
		wItem.EditorID = this.EditorID;
		wItem.AuditorID = this.AuditorID;
		wItem.Status = this.Status;
		wItem.Active = this.Active;
		wItem.CreateTime = this.CreateTime;
		wItem.AuditTime = this.AuditTime;
		wItem.EditTime = this.EditTime;

		wItem.Factory = this.Factory;
		wItem.BusinessUnit = this.BusinessUnit;
		wItem.Creator = this.Creator;
		wItem.Editor = this.Editor;
		wItem.Auditor = this.Auditor;
		wItem.Status = this.Status;
		wItem.Mode = this.Mode;
		wItem.UnitList = new List<FMCLineUnit>(this.UnitList);
		return wItem;
	}
}
