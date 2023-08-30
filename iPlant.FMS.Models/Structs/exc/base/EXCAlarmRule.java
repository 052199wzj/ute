package com.mes.server.service.po.exc.base;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class EXCAlarmRule implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public long ID;

	/**
	 * 报警代号
	 */
	public String AlarmCode;

	/**
	 * 报警ID
	 */
	public long AlarmID;

	/**
	 * 位置点类型
	 */
	public long StationType;

	/**
	 * 位置点ID
	 */
	public long StationID;

	/**
	 * 位置点编号
	 */
	public String StationNo;

	/**
	 * 触发异常类型
	 */
	public List<Long> ExceptionTypeList;

	/**
	 * 响应等级
	 */
	public int RespondLevel;

	/**
	 * 内容显示文本
	 */
	public String AlarmText;

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
	///
	/// 录入时间
	///
	public DateTime EditTime;

	/**
	 * 状态
	 */
	public int Active;

	public EXCAlarmRule() {
		CreateTime = DateTime.Now;
		EditTime = DateTime.Now;
		AlarmCode = "";
		AlarmText = "";
		ExceptionTypeList = new List<Long>();
		StationNo = "";
	}

	public long ID {
		return ID;
	}

	public void setID(long iD) {
		ID = iD;
	}

	public String getAlarmCode() {
		return AlarmCode;
	}

	public void setAlarmCode(String alarmCode) {
		AlarmCode = alarmCode;
	}

	public long getAlarmID() {
		return AlarmID;
	}

	public void setAlarmID(long alarmID) {
		AlarmID = alarmID;
	}

	public long getStationType() {
		return StationType;
	}

	public void setStationType(long stationType) {
		StationType = stationType;
	}

	public long getStationID() {
		return StationID;
	}

	public void setStationID(long stationID) {
		StationID = stationID;
	}

	public String getStationNo() {
		return StationNo;
	}

	public void setStationNo(String stationNo) {
		StationNo = stationNo;
	}

	public List<Long> getExceptionTypeList() {
		return ExceptionTypeList;
	}

	public void setExceptionTypeList(List<Long> exceptionTypeList) {
		ExceptionTypeList = exceptionTypeList;
	}

	public int getRespondLevel() {
		return RespondLevel;
	}

	public void setRespondLevel(int respondLevel) {
		RespondLevel = respondLevel;
	}

	public String getAlarmText() {
		return AlarmText;
	}

	public void setAlarmText(String alarmText) {
		AlarmText = alarmText;
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

}
