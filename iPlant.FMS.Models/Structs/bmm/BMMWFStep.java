package com.mes.server.service.po.bmm;

import java.io.Serializable;
import java.util.DateTime;
import java.util.Dictionary;
import java.util.Dictionary;

public class BMMWFStep implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public String Name = "";

	public String Text = "";

	// 职责ID
	public int FunctionID = 0;

	// 职责名称
	public String FunctionName = "";

	public int WorkFlowID = 0;

	public String WorkFlowName = "";

	public int EventID = 0; // 作业类型(APP作业事件)

	public String EventName = ""; // 作业名称

	public int OrderID = 0; // 顺序ID

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public DateTime EditTime = DateTime.Now;

	public int EditorID = 0;

	// 大模块枚举
	public int ModuleID = 0;

	//
	public String ModuleName = "";

	public int WorkShopID = 0;

	public int LineID = 0;

	public String WorkShopName = "";

	public String LineName = "";

	public int PartID = 0;
	public String PartName = "";

	public String Editor = "";

	public String Creator = "";

	/**
	 * 间隔时间 激活时刻=流程开始时刻+（触发次数 * Interval）-30min
	 */
	public int Interval = 0;

	/**
	 * 触发类型 0 默认来就触发 1 都来就触发 2同流程仅触发一次 3同来源仅触发一次 4 循环触发 根据Interval控制激活时刻
	 */
	public int TriggerType = 0;

	public int PrevID = 0; // 上级ID

	/**
	 * -1 不合格 0 默认触发 >0 合格次数
	 */
	public Dictionary<String, String> NextMap = new Dictionary<String, String>();

	public BMMWFStep() {
		this.Name = "";
		this.Text = "";
		this.FunctionName = "";
		this.Editor = "";
		this.Creator = "";
		this.WorkFlowName = "";
		this.EventName = "";
		this.CreateTime = DateTime.Now;
		this.EditTime = DateTime.Now;
	}

	public BMMWFStep Clone() {
		BMMWFStep wItem = new BMMWFStep();
		wItem.ID = this.ID;
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

	public int getFunctionID() {
		return FunctionID;
	}

	public void setFunctionID(int functionID) {
		FunctionID = functionID;
	}

	public String getFunctionName() {
		return FunctionName;
	}

	public void setFunctionName(String functionName) {
		FunctionName = functionName;
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

	public int getWorkFlowID() {
		return WorkFlowID;
	}

	public void setWorkFlowID(int workFlowID) {
		WorkFlowID = workFlowID;
	}

	public int getOrderID() {
		return OrderID;
	}

	public void setOrderID(int orderID) {
		OrderID = orderID;
	}

	public String getWorkFlowName() {
		return WorkFlowName;
	}

	public void setWorkFlowName(String workFlowName) {
		WorkFlowName = workFlowName;
	}

	public int getEventID() {
		return EventID;
	}

	public void setEventID(int eventID) {
		EventID = eventID;
	}

	public String getEventName() {
		return EventName;
	}

	public void setEventName(String eventName) {
		EventName = eventName;
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

	public int getPartID() {
		return PartID;
	}

	public void setPartID(int partID) {
		PartID = partID;
	}

	public String getPartName() {
		return PartName;
	}

	public void setPartName(String partName) {
		PartName = partName;
	}

	public int getInterval() {
		return Interval;
	}

	public void setInterval(int interval) {
		Interval = interval;
	}

	public int getTriggerType() {
		return TriggerType;
	}

	public void setTriggerType(int triggerType) {
		TriggerType = triggerType;
	}

	public int getPrevID() {
		return PrevID;
	}

	public void setPrevID(int prevID) {
		PrevID = prevID;
	}

	public Dictionary<String, String> getNextMap() {
		return NextMap;
	}

	public void setNextMap(Dictionary<String, String> nextMap) {
		NextMap = nextMap;
	}
}
