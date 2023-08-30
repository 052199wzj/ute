package com.mes.server.service.po.bmm;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

/**
 * 职能对应职责
 * 
 * @author ShrisJava
 *
 */
public class BMMPosition implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public String Name = "";

	public String Text = "";

	public int TemplateID = 0;

	public String TemplateName = "";

	public String VersionNo = "";// 版本ID（已使用的版本则必须另存为）

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public DateTime EditTime = DateTime.Now;

	public int EditorID = 0;

	public int WorkShopID = 0; // 车间

	public int LineID = 0; // 产线

	public int PartID = 0;

	public int PartPointID = 0;

	public int StationID = 0;

	public String WorkShopName = "";

	public String LineName = "";

	public String PartName = "";

	public String PartPointName = "";

	public String StationName = "";

	public String Editor = "";

	public String Creator = "";

	public int FunctionID = 0; // 职能

	public int PositionLevel = 0;

	/**
	 * 证书名称
	 */
	public String WorkLicenseName = "";

	public List<BMMCertificate> CertificateList = new List<>();

	public String FunctionName = ""; // 职能文本

	public int ParentID = 0; // 上级岗位ID

	public String ParentName = "";// 上级岗位名称

	public int ModuleID = 0; // 模块ID

	public String ModuleName = "";// 模块名称

	public int ShiftIndex = 0;

	public BMMPosition() {
		this.Name = "";
		this.Text = "";
		this.WorkShopName = "";
		this.LineName = "";
		this.Editor = "";
		this.Creator = "";
		this.FunctionName = "";
		this.VersionNo = "";
		this.ModuleName = "";
		this.ParentName = "";
		this.CreateTime = DateTime.Now;
		this.EditTime = DateTime.Now;
	}
	
	public BMMPosition(BMMPosition wPosition) {
		this.Name = wPosition.Name;;
		this.Text = wPosition.Text;
		this.WorkShopName = wPosition.WorkShopName;
		this.TemplateName = wPosition.TemplateName;
		this.WorkShopID = wPosition.WorkShopID;
		this.LineID = wPosition.LineID;
		this.LineName = wPosition.LineName;
		this.PartID = wPosition.PartID;
		this.PartName = wPosition.PartName;
		this.PartPointID = wPosition.PartPointID;
		this.PartPointName = wPosition.PartPointName;
		this.StationID = wPosition.StationID;
		this.StationName = wPosition.StationName;
		this.FunctionID = wPosition.FunctionID;
		this.FunctionName =wPosition.FunctionName;
		this.PositionLevel = wPosition.PositionLevel;
		this.CertificateList = wPosition.CertificateList; 
		this.WorkLicenseName = wPosition.WorkLicenseName;
		this.StationName = wPosition.StationName;
		this.ParentID = wPosition.ParentID;
		this.ParentName = wPosition.ParentName;
		this.ModuleID = wPosition.ModuleID;
		this.ModuleName = wPosition.ModuleName;
		this.ShiftIndex = wPosition.ShiftIndex;
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

	public int getTemplateID() {
		return TemplateID;
	}

	public void setTemplateID(int templateID) {
		TemplateID = templateID;
	}

	public String getTemplateName() {
		return TemplateName;
	}

	public void setTemplateName(String templateName) {
		TemplateName = templateName;
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

	public int getStationID() {
		return StationID;
	}

	public void setStationID(int stationID) {
		StationID = stationID;
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

	public String getStationName() {
		return StationName;
	}

	public void setStationName(String stationName) {
		StationName = stationName;
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

	public int getFunctionID() {
		return FunctionID;
	}

	public void setFunctionID(int functionID) {
		FunctionID = functionID;
	}

	public int getPositionLevel() {
		return PositionLevel;
	}

	public void setPositionLevel(int positionLevel) {
		PositionLevel = positionLevel;
	}

	public String getWorkLicenseName() {
		return WorkLicenseName;
	}

	public void setWorkLicenseName(String workLicenseName) {
		WorkLicenseName = workLicenseName;
	}

	public List<BMMCertificate> getCertificateList() {
		return CertificateList;
	}

	public void setCertificateList(List<BMMCertificate> certificateList) {
		CertificateList = certificateList;
	}

	public String getFunctionName() {
		return FunctionName;
	}

	public void setFunctionName(String functionName) {
		FunctionName = functionName;
	}

	public int getParentID() {
		return ParentID;
	}

	public void setParentID(int parentID) {
		ParentID = parentID;
	}

	public String getParentName() {
		return ParentName;
	}

	public void setParentName(String parentName) {
		ParentName = parentName;
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

	public int getShiftIndex() {
		return ShiftIndex;
	}

	public void setShiftIndex(int shiftIndex) {
		ShiftIndex = shiftIndex;
	}

	 

}
