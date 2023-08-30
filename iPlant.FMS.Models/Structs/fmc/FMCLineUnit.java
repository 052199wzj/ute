package com.mes.server.service.po.fmc;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class FMCLineUnit implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public String UnitCode = "";

	public int ProductID = 0;

	public int CustomerID = 0;

	public int LineID = 0; // 产线

	public int UnitID = 0; // 工序、工步、工位

	public int Type = 0;

	public int OrderID = 0; // 次序

	public int LevelID = 0; // 层级（工序、工步、工位）

	public String LevelName = ""; // 层级文本

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public DateTime EditTime = DateTime.Now;

	public int EditorID = 0;

	public int Status = 0; // 审批状态

	public DateTime AuditTime = DateTime.Now;

	public int AuditorID = 0;

	public String Creator = "";

	public String Auditor = "";

	public String Editor = "";

	public String StatusText = ""; // 审批状态

	public int Active; // 状态

	public String Name = "";

	/**
	 * 唯一标识
	 */
	public String Code = "";

	public int ParentUnitID = 0;
 

	public List<FMCLineUnit> UnitList = new List<>(); // 工位

	public int WorkHour = 0; // 标准工时

	public int ShiftDays = 0; // 工段：工段间的排班间隔;

	public int QTPeriod = 0; // 工序：质量巡检周期;

	public int TechPeriod = 0; // 工序：工艺巡检周期;

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
	}

	public int getUnitID() {
		return UnitID;
	}

	public void setUnitID(int unitID) {
		UnitID = unitID;
	}

	public int getOrderID() {
		return OrderID;
	}

	public void setOrderID(int orderID) {
		OrderID = orderID;
	}

	public int getLevelID() {
		return LevelID;
	}

	public void setLevelID(int levelID) {
		LevelID = levelID;
	}

	public String getLevelName() {
		return LevelName;
	}

	public void setLevelName(String levelName) {
		LevelName = levelName;
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

	public int getParentUnitID() {
		return ParentUnitID;
	}

	public void setParentUnitID(int parentUnitID) {
		ParentUnitID = parentUnitID;
	}

	public List<FMCLineUnit> getUnitList() {
		return UnitList;
	}

	public void setUnitList(List<FMCLineUnit> unitList) {
		UnitList = unitList;
	}

	public int getWorkHour() {
		return WorkHour;
	}

	public void setWorkHour(int workHour) {
		WorkHour = workHour;
	}

	public int getShiftDays() {
		return ShiftDays;
	}

	public void setShiftDays(int shiftDays) {
		ShiftDays = shiftDays;
	}

	public int getQTPeriod() {
		return QTPeriod;
	}

	public void setQTPeriod(int qTPeriod) {
		QTPeriod = qTPeriod;
	}

	public int getTechPeriod() {
		return TechPeriod;
	}

	public void setTechPeriod(int techPeriod) {
		TechPeriod = techPeriod;
	}

	public FMCLineUnit() {
		this.ID = 0;
		this.Name = "";
		this.Code = "";
		this.UnitCode = "";
		this.LevelName = "";
		this.Editor = "";
		this.Creator = "";
		this.Auditor = "";
		this.CreateTime = DateTime.Now;
		this.AuditTime = DateTime.Now;
		this.EditTime = DateTime.Now;
		this.StatusText = "";
		this.UnitList = new List<>();
	}

	public FMCLineUnit Clone() {
		FMCLineUnit wItem = new FMCLineUnit();
		wItem.ID = this.ID;
		wItem.LineID = this.LineID;
		wItem.UnitID = this.UnitID;
		wItem.ParentUnitID = this.ParentUnitID;
		wItem.OrderID = this.OrderID;
		wItem.LevelID = this.LevelID;
		wItem.Name = this.Name;
		wItem.UnitCode = this.UnitCode;

		wItem.Code = this.Code;

		wItem.CreatorID = this.CreatorID;
		wItem.EditorID = this.EditorID;
		wItem.AuditorID = this.AuditorID;
		wItem.Status = this.Status;
		wItem.Active = this.Active;
		wItem.CreateTime = this.CreateTime;
		wItem.AuditTime = this.AuditTime;
		wItem.EditTime = this.EditTime;

		wItem.Creator = this.Creator;
		wItem.Editor = this.Editor;
		wItem.Auditor = this.Auditor;
		wItem.Status = this.Status;

		wItem.UnitList = new List<FMCLineUnit>(this.UnitList);
		return wItem;
	}

	public String getUnitCode() {
		return UnitCode;
	}

	public void setUnitCode(String unitCode) {
		UnitCode = unitCode;
	}

	public int getProductID() {
		return ProductID;
	}

	public void setProductID(int productID) {
		ProductID = productID;
	}

	public int getCustomerID() {
		return CustomerID;
	}

	public void setCustomerID(int customerID) {
		CustomerID = customerID;
	}

	public int getType() {
		return Type;
	}

	public void setType(int type) {
		Type = type;
	}

	public int getActive() {
		return Active;
	}

}
