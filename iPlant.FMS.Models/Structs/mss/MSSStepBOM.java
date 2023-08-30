package com.mes.server.service.po.mss;

import java.io.Serializable;
import java.util.DateTime;

/**
 * 工序BOM 班前点检项
 * 
 * @author ShrisJava
 *
 */
public class MSSStepBOM implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID = 0;

	/**
	 * 路线ID
	 */
	public int RouteID=0;
	
	/**
	 * 路线工序ID   需要存储
	 */
	public int RoutePartPointID=0;
	
	/**
	 * 路线工序编号   
	 */
	public String RoutePartPointCode="";
	
	/**
	 *  
	 */
	public int LineID = 0;

	/**
	 *  
	 */
	public int ProductID = 0;

	/**
	 *  
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
	 * 点检项目名称      需要存储 
	 *   物料为 物料名称【物料号】（数量+单位）
	 *   设备为 设备名称【设备号】  
	 *   其他的可自定义更改
	 */
	public String Name="";
	
	/**
	 * 标准     需要存储 检查标准
	 * 
	 * */
	public String Standard = "";
	
	/**
	 * 物料ID 
	 */
	public int EntityID = 0; 

	/**
	 * 点检项类型         默认1  物料
	 */
	public int TypeID = 1; 
	
	/**
	 * 物料需要的数量          需要存储
	 */
	public Double MaterialNumber = 0.0;
 
 
	/**
	 * 项点描述    需要存储
	 */
	public String Remark = "";
	
	
	
	
	public String Line = "";
	public String ProductNo = "";
	public String CustomerName = "";
	public String PartName = "";
	public String PartPointName = ""; 
	public String Type = "";

	
	public int CreatorID = 0;

	public int EditorID = 0;
	
	public String Creator = "";

	public String Editor = "";

	public DateTime EditTime = DateTime.Now;

	public DateTime CreateTime= DateTime.Now;

	public int Active = 0;

	  
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

 

	public int getCreatorID() {
		return CreatorID;
	}

	public void setCreatorID(int creatorID) {
		CreatorID = creatorID;
	}

	public int getEditorID() {
		return EditorID;
	}

	public void setEditorID(int editorID) {
		EditorID = editorID;
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

	public DateTime getEditTime() {
		return EditTime;
	}

	public void setEditTime(DateTime editTime) {
		EditTime = editTime;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public int getRouteID() {
		return RouteID;
	}

	public void setRouteID(int routeID) {
		RouteID = routeID;
	}

	public int getRoutePartPointID() {
		return RoutePartPointID;
	}

	public void setRoutePartPointID(int routePartPointID) {
		RoutePartPointID = routePartPointID;
	}

	 



	public void setMaterialNumber(Double materialNumber) {
		MaterialNumber = materialNumber;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public Double getMaterialNumber() {
		return MaterialNumber;
	}

	public int getEntityID() {
		return EntityID;
	}

	public void setEntityID(int entityID) {
		EntityID = entityID;
	}

	public String getRoutePartPointCode() {
		return RoutePartPointCode;
	}

	public void setRoutePartPointCode(String routePartPointCode) {
		RoutePartPointCode = routePartPointCode;
	}

	 

}
