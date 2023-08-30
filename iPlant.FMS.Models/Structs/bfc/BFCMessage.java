package com.mes.server.service.po.bfc;

import java.io.Serializable;
import java.util.DateTime;

public class BFCMessage implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public BFCMessage() {
		// TODO Auto-generated constructor stub
	}

	public int CompanyID;
	public long ID;
	/**
	 * 消息来源ID 如EXC的任务ID
	 */
	public long MessageID;
	/**
	 * 配置模块ID BPMEventModule
	 */
	public int ModuleID;

	public String ModuleName = "";
	/**
	 * 
	 */
	public long StationID;

	public String StationNo;

	public int StepID = 0;

	/**
	 * 消息接收人ID
	 */
	public int ResponsorID;

	/**
	 * 0 默认 不需要执行 1 需要执行
	 */
	public int Type;
	public String Title = "";
	public String MessageText = "";
	public int ShiftID = 0;
	public DateTime EditTime = DateTime.Now;
	public DateTime CreateTime = DateTime.Now;

	/**
	 * 0 未读 // 1 已发送未读 // 2 已读 （已读后不发送了） //3 已办 // 4 已关闭
	 */
	public int Active = 0;
	public int SendStatus = 0;

	public long ID {
		return ID;
	}

	public void setID(long iD) {
		ID = iD;
	}

	public long getMessageID() {
		return MessageID;
	}

	public void setMessageID(long messageID) {
		MessageID = messageID;
	}

	public int getModuleID() {
		return ModuleID;
	}

	public void setModuleID(int moduleID) {
		ModuleID = moduleID;
	}

	public int getResponsorID() {
		return ResponsorID;
	}

	public void setResponsorID(int responsorID) {
		ResponsorID = responsorID;
	}

	public int getType() {
		return Type;
	}

	public void setType(int type) {
		Type = type;
	}

	public String getTitle() {
		return Title;
	}

	public void setTitle(String title) {
		Title = title;
	}

	public String getMessageText() {
		return MessageText;
	}

	public void setMessageText(String messageText) {
		MessageText = messageText;
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

	public long getStationID() {
		return StationID;
	}

	public void setStationID(long stationID) {
		StationID = stationID;
	}

	public int getCompanyID() {
		return CompanyID;
	}

	public void setCompanyID(int companyID) {
		CompanyID = companyID;
	}

	public int getShiftID() {
		return ShiftID;
	}

	public void setShiftID(int shiftID) {
		ShiftID = shiftID;
	}

	public String getStationNo() {
		return StationNo;
	}

	public void setStationNo(String stationNo) {
		StationNo = stationNo;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public int getStepID() {
		return StepID;
	}

	public void setStepID(int stepID) {
		StepID = stepID;
	}

}
