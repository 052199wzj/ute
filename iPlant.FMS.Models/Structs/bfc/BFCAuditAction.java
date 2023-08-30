package com.mes.server.service.po.bfc;

import java.io.Serializable;
import java.util.DateTime;

public class BFCAuditAction implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 主键ID
	 */
	public int ID = 0;
	/**
	 * 事件任务ID
	 */
	public int TaskID = 0;

	/**
	 * 事件任务类型
	 */
	public int EventModule = 0;
	/**
	 * 流程节点ID
	 */
	public int ConfigID = 0;
	public String ConfigName = "";

	/**
	 * 审核人ID
	 */
	public int AuditorID = 0;
	public String AuditorName = "";

	/**
	 * 审核结果
	 */
	public int Result = 0;

	/**
	 * 审核时刻
	 */
	public DateTime AuditorTime = DateTime.Now;

	/**
	 * 备注
	 */
	public String Remark = "";

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getResult() {
		return Result;
	}

	public void setResult(int result) {
		Result = result;
	}

	public DateTime getAuditorTime() {
		return AuditorTime;
	}

	public void setAuditorTime(DateTime auditorTime) {
		AuditorTime = auditorTime;
	}

 

	public int getAuditorID() {
		return AuditorID;
	}

	public void setAuditorID(int auditorID) {
		AuditorID = auditorID;
	}

	public String getAuditorName() {
		return AuditorName;
	}

	public void setAuditorName(String auditorName) {
		AuditorName = auditorName;
	}

	public String getRemark() {
		return Remark;
	}

	public void setRemark(String remark) {
		Remark = remark;
	}

	public int getTaskID() {
		return TaskID;
	}

	public void setTaskID(int taskID) {
		TaskID = taskID;
	}

	public int getEventModule() {
		return EventModule;
	}

	public void setEventModule(int eventModule) {
		EventModule = eventModule;
	}

	public int getConfigID() {
		return ConfigID;
	}

	public void setConfigID(int configID) {
		ConfigID = configID;
	}

	public String getConfigName() {
		return ConfigName;
	}

	public void setConfigName(String configName) {
		ConfigName = configName;
	}

}
