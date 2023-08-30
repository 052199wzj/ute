package com.mes.server.service.po.fmc;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

/**
 * -工区 暂时只做对工位的分组
 * 
 * @author ShrisJava
 *
 */
public class FMCWorkArea implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public FMCWorkArea() {
		// TODO Auto-generated constructor stub
	}

	public int ID;
	/**
	 * 名称
	 */
	public String Name = "";

	public String Code = "";

	public int WorkShopID = 0;

	public String WorkShopName = "";

	public int LineID = 0;

	public String LineName = "";

	public int ParentID = 0;

	public int CreatorID = 0;

	public List<Int32> AreaLeaderID = new List<>();

	public String AreaLeaderName = "";
	/**
	 * 顺序ID
	 */
	public int OrderID = 0;

	public String Creator = "";

	public DateTime CreateTime = DateTime.Now;

	public int EditorID = 0;

	public String Editor = "";

	public DateTime EditTime = DateTime.Now;

	public int Active = 0;
	
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

	public int getWorkShopID() {
		return WorkShopID;
	}

	public void setWorkShopID(int workShopID) {
		WorkShopID = workShopID;
	}

	public String getWorkShopName() {
		return WorkShopName;
	}

	public void setWorkShopName(String workShopName) {
		WorkShopName = workShopName;
	}

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
	}

	public String getLineName() {
		return LineName;
	}

	public void setLineName(String lineName) {
		LineName = lineName;
	}

	public int getParentID() {
		return ParentID;
	}

	public void setParentID(int parentID) {
		ParentID = parentID;
	}

	public int getCreatorID() {
		return CreatorID;
	}

	public void setCreatorID(int creatorID) {
		CreatorID = creatorID;
	}

	public List<Int32> getAreaLeaderID() {
		return AreaLeaderID;
	}

	public void setAreaLeaderID(List<Int32> areaLeaderID) {
		AreaLeaderID = areaLeaderID;
	}

	public String getAreaLeaderName() {
		return AreaLeaderName;
	}

	public void setAreaLeaderName(String areaLeaderName) {
		AreaLeaderName = areaLeaderName;
	}

	public int getOrderID() {
		return OrderID;
	}

	public void setOrderID(int orderID) {
		OrderID = orderID;
	}

	public String getCreator() {
		return Creator;
	}

	public void setCreator(String creator) {
		Creator = creator;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public int getEditorID() {
		return EditorID;
	}

	public void setEditorID(int editorID) {
		EditorID = editorID;
	}

	public String getEditor() {
		return Editor;
	}

	public void setEditor(String editor) {
		Editor = editor;
	}

	public DateTime getEditTime() {
		return EditTime;
	}

	public void setEditTime(DateTime editTime) {
		EditTime = editTime;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}



}
