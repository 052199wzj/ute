package com.mes.server.service.po.mss;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class MSSSpotItem implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID = 0;
 

	public int TaskID = 0;

	public int StepBOMID = 0;

	/**
	 * 产线
	 */
	public int LineID = 0;

	/**
	 * 产品规格
	 */
	public int ProductID = 0;

	/**
	 * 客户
	 */
	public int CustomerID = 0;

	/**
	 * 工位
	 */
	public int PartID = 0;

	/**
	 * 工序
	 */
	public int PartPointID = 0;

	/**
	 * 点检项目名称 需要存储 物料为 物料名称【物料号】（数量+单位） 设备为 设备名称【设备号】 其他的可自定义更改
	 */
	public String Name = "";

	/**
	 * 标准
	 * 
	 */
	public String Standard = "";

	/**
	 * 点检项类型 需要存储 不显示
	 */
	public int TypeID = 0;

	/**
	 * 项点描述 需要存储
	 */
	public String Remark = "";
 
 

	public String Line = "";
	public String ProductNo = "";
	public String CustomerName = "";
	public String PartName = "";
	public String PartPointName = "";
	public String Type = "";

	public int EditorID = 0;

	public String Editor = "";

	public DateTime EditTime = DateTime.Now;

	public DateTime StartTime = DateTime.Now;

	public DateTime EndTime = DateTime.Now;

	public List<String> ImgList = new List<>();

	public String Details = "";

	public int ItemResult = 0;

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

	public int getPartID() {
		return PartID;
	}

	public void setPartID(int partID) {
		PartID = partID;
	}

	public int getPartPointID() {
		return PartPointID;
	}

	public void setPartPointID(int partPointID) {
		PartPointID = partPointID;
	}

	public int getTypeID() {
		return TypeID;
	}

	public void setTypeID(int typeID) {
		TypeID = typeID;
	}

	public String getStandard() {
		return Standard;
	}

	public void setStandard(String standard) {
		Standard = standard;
	}

	public String getRemark() {
		return Remark;
	}

	public void setRemark(String remark) {
		Remark = remark;
	}

	public String getLine() {
		return Line;
	}

	public void setLine(String line) {
		Line = line;
	}

	public String getProductNo() {
		return ProductNo;
	}

	public void setProductNo(String productNo) {
		ProductNo = productNo;
	}

	public String getCustomerName() {
		return CustomerName;
	}

	public void setCustomerName(String customerName) {
		CustomerName = customerName;
	}

	public String getPartName() {
		return PartName;
	}

	public void setPartName(String partName) {
		PartName = partName;
	}

	public String getPartPointName() {
		return PartPointName;
	}

	public void setPartPointName(String partPointName) {
		PartPointName = partPointName;
	}

	public String getType() {
		return Type;
	}

	public void setType(String type) {
		Type = type;
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

	 

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	 

	public int getTaskID() {
		return TaskID;
	}

	public void setTaskID(int taskID) {
		TaskID = taskID;
	}

	public int getStepBOMID() {
		return StepBOMID;
	}

	public void setStepBOMID(int stepBOMID) {
		StepBOMID = stepBOMID;
	}

	public List<String> getImgList() {
		return ImgList;
	}

	public void setImgList(List<String> imgList) {
		ImgList = imgList;
	}

	public String getDetails() {
		return Details;
	}

	public void setDetails(String details) {
		Details = details;
	}

	public int getItemResult() {
		return ItemResult;
	}

	public void setItemResult(int itemResult) {
		ItemResult = itemResult;
	}

	public DateTime getStartTime() {
		return StartTime;
	}

	public void setStartTime(DateTime startTime) {
		StartTime = startTime;
	}

	public DateTime getEndTime() {
		return EndTime;
	}

	public void setEndTime(DateTime endTime) {
		EndTime = endTime;
	}

}
