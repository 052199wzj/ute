package com.mes.server.service.po.bmm;

import java.io.Serializable;
import java.util.DateTime;

/**
 * 职能 区分车间 产线区分可选
 * 
 * @author ShrisJava
 *
 */
public class BMMFunction implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public int OldID = 0;

	public String Name = "";

	public String Text = "";

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public int Status = 0; // 状态

	public DateTime EditTime = DateTime.Now;

	public int EditorID = 0;

	public int WorkShopID = 0; // 车间

	public int LineID = 0; // 产线

	public String WorkShopName = "";

	public String LineName = "";

	public String Editor = "";

	public String Creator = "";

	public int ModuleID = 0; // 职能分类

	public String ModuleName = ""; // 职能文本

	public String StatusText = ""; // 状态

	/**
	 * 派工类型 0 默认 1 无需任务 2需要任务才生成
	 */
	public int DispatchType = 0;

	/**
	 * 角色
	 */
	public int RoleUserID = 0;

	public String RoleUserName = "";

	public BMMFunction() {
		this.Name = "";
		this.Text = "";
		this.WorkShopName = "";
		this.LineName = "";
		this.Editor = "";
		this.Creator = "";
		this.ModuleName = "";
		this.CreateTime = DateTime.Now;
		this.EditTime = DateTime.Now;
	}

	public BMMFunction Clone() {
		BMMFunction wItem = new BMMFunction();
		wItem.ID = this.ID;
		wItem.CreatorID = this.CreatorID;
		wItem.EditorID = this.EditorID;
		wItem.WorkShopID = this.WorkShopID;
		wItem.LineID = this.LineID;
		wItem.ModuleID = this.ModuleID;
		wItem.Status = this.Status;
		wItem.Name = this.Name;
		wItem.Text = this.Text;
		wItem.CreateTime = this.CreateTime;
		wItem.EditTime = this.EditTime;
		return wItem;
	}

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

	public String getText() {
		return Text;
	}

	public void setText(String text) {
		Text = text;
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

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
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

	public int getWorkShopID() {
		return WorkShopID;
	}

	public void setWorkShopID(int workShopID) {
		WorkShopID = workShopID;
	}

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
	}

	public String getWorkShopName() {
		return WorkShopName;
	}

	public void setWorkShopName(String workShopName) {
		WorkShopName = workShopName;
	}

	public String getLineName() {
		return LineName;
	}

	public void setLineName(String lineName) {
		LineName = lineName;
	}

	public String getEditor() {
		return Editor;
	}

	public void setEditor(String editor) {
		Editor = editor;
	}

	public String getCreator() {
		return Creator;
	}

	public void setCreator(String creator) {
		Creator = creator;
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

	public String getStatusText() {
		return StatusText;
	}

	public void setStatusText(String statusText) {
		StatusText = statusText;
	}

}
