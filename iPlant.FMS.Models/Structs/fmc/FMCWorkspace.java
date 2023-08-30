package com.mes.server.service.po.fmc;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

/**
 * -台位
 * 
 * @author ShrisJava
 *
 */
public class FMCWorkspace implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public FMCWorkspace() {
		// TODO Auto-generated constructor stub
	}

	public int ID;
	/**
	 * 名称
	 */
	public String Name = "";

	public String Code = "";

	public int Active = 0;
	/**
	 * 产品规格 产品类型 对应系统中productID
	 */
	public int ProductID = 0;
	/**
	 * 台位/库位 台位类型 1台位 2库位
	 */
	public int PlaceType = 0;

	public int ParentID = 0;

	public int CreatorID = 0;

	/**
	 * 顺序ID
	 */
	public int OrderID = 0;

	public String Creator = "";

	public DateTime CreateTime = DateTime.Now;

	public int EditorID = 0;

	public String Editor = "";

	public DateTime EditTime = DateTime.Now;

	public int PartID = 0;

	public String PartNo = "";

	public List<String> ActualPartNoList = new List<>();

	public int Status = 0;

	public Double Length = 0.0;

	public int TransType = 0;

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

	public int getPlaceType() {
		return PlaceType;
	}

	public void setPlaceType(int placeType) {
		PlaceType = placeType;
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

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public int getParentID() {
		return ParentID;
	}

	public void setParentID(int parentID) {
		ParentID = parentID;
	}

	public String getCode() {
		return Code;
	}

	public void setCode(String code) {
		Code = code;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public Double getLength() {
		return Length;
	}

	public void setLength(Double length) {
		Length = length;
	}

	public int getOrderID() {
		return OrderID;
	}

	public void setOrderID(int orderID) {
		OrderID = orderID;
	}

	public List<String> getActualPartNoList() {
		return ActualPartNoList;
	}

	public void setActualPartNoList(List<String> actualPartNoList) {
		ActualPartNoList = actualPartNoList;
	}

	public int getTransType() {
		return TransType;
	}

	public void setTransType(int transType) {
		TransType = transType;
	}

 
}
