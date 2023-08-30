package com.mes.server.service.po.fmc;

import java.io.Serializable;
import java.util.DateTime;

public class FMCWorkspaceRecord implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public FMCWorkspaceRecord() {
		// TODO Auto-generated constructor stub
	}

	public FMCWorkspaceRecord(FMCWorkspace wFMCWorkspace) {
		this.ID = 0;
		this.PlaceID = wFMCWorkspace.ID;
		this.PlaceName = wFMCWorkspace.Name;
		this.ProductID = wFMCWorkspace.ProductID;
		this.PartNo = wFMCWorkspace.PartNo;
		this.PartID = wFMCWorkspace.PartID;
		this.EditorID = wFMCWorkspace.EditorID;
		this.Editor = wFMCWorkspace.Editor;
		this.EditTime = DateTime.Now;
		this.CreateTime = DateTime.Now;

	}

	public int ID;
	/**
	 * 台位 ID
	 */
	public int PlaceID = 0;

	/**
	 * 台位 名称
	 */
	public String PlaceName = "";
	/**
	 * 产品规格
	 */
	public int ProductID = 0;

	/**
	 * 工件编号
	 */
	public String PartNo = "";

	/**
	 * 工件号
	 */
	public int PartID = 0;

	public int EditorID = 0;

	/**
	 * 绑定人
	 */
	public String Editor = "";
	
	/**
	 * 解绑时刻  小于 CreateTime 即没解绑
	 */
	public DateTime EditTime = DateTime.Now;
	
	/**
	 * 绑定时刻
	 */
	public DateTime CreateTime = DateTime.Now;

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
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

	public int getPlaceID() {
		return PlaceID;
	}

	public void setPlaceID(int placeID) {
		PlaceID = placeID;
	}

	public String getPlaceName() {
		return PlaceName;
	}

	public void setPlaceName(String placeName) {
		PlaceName = placeName;
	}

	public int getPartID() {
		return PartID;
	}

	public void setPartID(int partID) {
		PartID = partID;
	}

	public String getPartNo() {
		return PartNo;
	}

	public void setPartNo(String partNo) {
		PartNo = partNo;
	}

	public int getProductID() {
		return ProductID;
	}

	public void setProductID(int productID) {
		ProductID = productID;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

}
