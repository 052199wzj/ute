package com.mes.server.service.po.bmm;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class BMMTemplate implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public String Name = "";

	public String Text = "";

	public String VersionNo = "";

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public DateTime EditTime = DateTime.Now;

	public int EditorID = 0;

	public int LineID = 0;

	public int WorkShopID = 0;

	public String WorkShopName = "";

	public String LineName = "";

	public int ModuleID = 0;

	public String ModuleName = "";

	public String Creator = "";

	public String Editor = "";

	public int ShiftCount = 0; // 班次数量

	public int Active = 0; // 状态

	public List<BMMPosition> PositionList = new List<BMMPosition>();

	public BMMTemplate() {
		this.Name = "";
		this.Editor = "";
		this.Creator = "";
		this.CreateTime = DateTime.Now;
		this.EditTime = DateTime.Now;
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

	public String getVersionNo() {
		return VersionNo;
	}

	public void setVersionNo(String versionNo) {
		VersionNo = versionNo;
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

	public int getShiftCount() {
		return ShiftCount;
	}

	public void setShiftCount(int shiftCount) {
		ShiftCount = shiftCount;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
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

}
