package com.mes.server.service.po.sch;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

/**
 * 数据全存 根据BMMTemplate直接生成
 * 
 * @author ShrisJava
 *
 */
public class SCHTemplate implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	/**
	 * PB-{0}-0001
	 */
	public String Code = "";

	public String Text = "";

	public int TemplateID = 0;

	public String TemplateName;

	public String TemplateText = "";

	public String TemplateVersionNo = "";

	/**
	 * 生效开始日期
	 */
	public DateTime StartTime = DateTime.Now;

	/**
	 * 生效结束日期
	 */
	public DateTime EndTime = DateTime.Now;

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public DateTime EditTime = DateTime.Now;

	public int EditorID = 0;

	public int LineID = 0;

	public int WorkShopID = 0;

	public String WorkShopName = "";

	public String LineName = "";

	public String Creator = "";

	public String Editor = "";

	public int ShiftCount = 0; // 班次数量

	public int ModuleID = 0; // 职能类别

	public String ModuleName = ""; // 职能类别名称

	/**
	 * 同ModuleID同时间内模板激活的只有一个 时间超出后将Active更改为2
	 */
	public int Active = 0; // 状态

	public List<SCHPosition> PositionList = new List<SCHPosition>();

	public int ItemCount = 0;

	public SCHTemplate() {
		this.TemplateName = "";
		this.ModuleName = "";
		this.Editor = "";
		this.Creator = "";
		this.CreateTime = DateTime.Now;
		this.EditTime = DateTime.Now;
	}

	public SCHTemplate Clone() {
		SCHTemplate wItem = new SCHTemplate();
		wItem.ID = this.ID;
		wItem.TemplateName = this.TemplateName;

		wItem.CreatorID = this.CreatorID;
		wItem.EditorID = this.EditorID;
		wItem.CreateTime = this.CreateTime;
		wItem.EditTime = this.EditTime;

		wItem.LineID = this.LineID;
		wItem.WorkShopID = this.WorkShopID;
		wItem.Creator = this.Creator;
		wItem.Editor = this.Editor;
		return wItem;
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
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

	public String getCreator() {
		return Creator;
	}

	public void setCreator(String creator) {
		Creator = creator;
	}

	public String getEditor() {
		return Editor;
	}

	public void setEditor(String editor) {
		Editor = editor;
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

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}
}
