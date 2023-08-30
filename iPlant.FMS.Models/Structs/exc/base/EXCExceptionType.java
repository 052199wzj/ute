package com.mes.server.service.po.exc.base;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List; 

public class EXCExceptionType implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	public long ID;
	/**
	 * 类型名称
	 */
	public String Name;

	/**
	 * 异常点类型
	 */
	public long StationType;

	/**
	 * 异常点类型名称
	 */
	public String StationTypeName;

	/**
	 * 责任岗位ID
	 */
	public List<Int32> DutyPositionID;
	/**
	 * 确认人岗位ID
	 */
	public int ConfirmPositionID;
	/**
	 * 审批人岗位ID
	 */
	public int ApproverPositionID;

	/**
	 * 再次发起间隔时间
	 */
	public int AgainInterval;
	/**
	 * 关联任务类型
	 */
	public int RelevancyTaskType;
	
	/**
	 * 异常所属   0 无  1 物料 类 2 设备类
	 */
	public int ModeType;

	/**
	 * 创建人
	 */
	public long CreatorID;
	/**
	 * 创建时间
	 */
	public DateTime CreateTime;

	/**
	 * 录入人
	 */
	public long EditorID;
	/**
	 * 录入时间
	 */
	public DateTime EditTime;

	/**
	 * 状态
	 */
	public int Active;

	public EXCExceptionType() {
		DutyPositionID = new List<Int32>();
		CreateTime = DateTime.Now;
		EditTime = DateTime.Now;
		Name = "";
		StationTypeName = "";
	}

	public long ID {
		return ID;
	}

	public void setID(long iD) {
		ID = iD;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public long getStationType() {
		return StationType;
	}

	public void setStationType(long stationType) {
		StationType = stationType;
	}

	public String getStationTypeName() {
		return StationTypeName;
	}

	public void setStationTypeName(String stationTypeName) {
		StationTypeName = stationTypeName;
	}

	public List<Int32> getDutyPositionID() {
		return DutyPositionID;
	}

	public void setDutyPositionID(List<Int32> dutyPositionID) {
		DutyPositionID = dutyPositionID;
	}

	public int getConfirmPositionID() {
		return ConfirmPositionID;
	}

	public void setConfirmPositionID(int confirmPositionID) {
		ConfirmPositionID = confirmPositionID;
	}

	public int getApproverPositionID() {
		return ApproverPositionID;
	}

	public void setApproverPositionID(int approverPositionID) {
		ApproverPositionID = approverPositionID;
	}

	public int getAgainInterval() {
		return AgainInterval;
	}

	public void setAgainInterval(int againInterval) {
		AgainInterval = againInterval;
	}

	public int getRelevancyTaskType() {
		return RelevancyTaskType;
	}

	public void setRelevancyTaskType(int relevancyTaskType) {
		RelevancyTaskType = relevancyTaskType;
	}

	public long getCreatorID() {
		return CreatorID;
	}

	public void setCreatorID(long creatorID) {
		CreatorID = creatorID;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public long getEditorID() {
		return EditorID;
	}

	public void setEditorID(long editorID) {
		EditorID = editorID;
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

	public int getModeType() {
		return ModeType;
	}

	public void setModeType(int modeType) {
		ModeType = modeType;
	}
}
