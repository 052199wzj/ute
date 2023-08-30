package com.mes.server.service.po.bfc;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

/**
 * 审批流配置
 * 
 * @author 杨范明
 * @version 1.0
 * @since 20200428
 */
public class BFCAuditConfig implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 主键ID
	 */
	public int ID = 0;
	/**
	 * 审批节点名称
	 */
	public String Name = "";

	/**
	 * 审批流程类型 事件类型
	 */
	public int EventModule = 0;

	public String EventModuleName = "";

	/**
	 * 激活状态
	 */
	public int Active = 0;

	/**
	 * 权限树ID
	 */
	public int FunctionID = 0;

	/**
	 * 权限树名称
	 */
	public String FunctionName = "";

	/**
	 * 版本信息
	 */
	public String VersionNo = "";
	/**
	 * 创建人
	 */
	public int CreatorID = 0;
	public String CreatorName = "";

	public DateTime CreateTime = DateTime.Now;

	/**
	 * 编辑人
	 */
	public int EditorID = 0;
	public String EditorName = "";
	/**
	 * 审批顺序
	 */
	public int OrderID = 0;

	public int ReSubmitCurrent = 0;

	/**
	 * 编辑时刻
	 */
	public DateTime EditTime = DateTime.Now;

	/**
	 * 可做操作列表
	 */
	public List<Int32> AuditActions = new List<>();

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

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public String getVersionNo() {
		return VersionNo;
	}

	public void setVersionNo(String versionNo) {
		VersionNo = versionNo;
	}

	public int getEditorID() {
		return EditorID;
	}

	public void setEditorID(int editorID) {
		EditorID = editorID;
	}

	public int getOrderID() {
		return OrderID;
	}

	public void setOrderID(int orderID) {
		OrderID = orderID;
	}

	public String getEditorName() {
		return EditorName;
	}

	public void setEditorName(String editorName) {
		EditorName = editorName;
	}

	public int getEventModule() {
		return EventModule;
	}

	public void setEventModule(int eventModule) {
		EventModule = eventModule;
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

	public DateTime getEditTime() {
		return EditTime;
	}

	public void setEditTime(DateTime editTime) {
		EditTime = editTime;
	}

	public int getCreatorID() {
		return CreatorID;
	}

	public void setCreatorID(int creatorID) {
		CreatorID = creatorID;
	}

	public String getCreatorName() {
		return CreatorName;
	}

	public void setCreatorName(String creatorName) {
		CreatorName = creatorName;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public List<Int32> getAuditActions() {
		return AuditActions;
	}

	public void setAuditActions(List<Int32> auditActions) {
		AuditActions = auditActions;
	}

	public String getEventModuleName() {
		return EventModuleName;
	}

	public void setEventModuleName(String eventModuleName) {
		EventModuleName = eventModuleName;
	}

	public int getReSubmitCurrent() {
		return ReSubmitCurrent;
	}

	public void setReSubmitCurrent(int reSubmitCurrent) {
		ReSubmitCurrent = reSubmitCurrent;
	}

}
