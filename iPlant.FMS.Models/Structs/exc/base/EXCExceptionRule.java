package com.mes.server.service.po.exc.base;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

import com.mes.server.service.po.exc.EXCTimeItem;
import com.mes.server.service.po.exc.define.EXCTemplates;

/**
 * 异常后台判断规则 ExceptionType RespondLevel EXCTemplate 三个为联合主键
 * 
 * @author ShrisJava
 *
 */
public class EXCExceptionRule implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public long ID;

	public String Name;

	/**
	 * 异常类型
	 */
	public long ExceptionType;

	/**
	 * 异常类型名称
	 */
	public String ExceptionTypeName;

	/**
	 * 异常响应等级
	 */
	public int RespondLevel;

	/**
	 * 超时判定时长 单位秒
	 */
	public List<EXCTimeItem> TimeOutList;

	/**
	 * 上报次数
	 */
	public int ReportTimes;

	/**
	 * 转发次数
	 */
	public int ForwardTimes;

	/**
	 * 异常发起模板
	 */
	public int EXCTemplate;

	/**
	 * 异常发起方类型 仅作显示
	 */
	public int EXCRequestType;
	/**
	 * 异常处理方类型 仅作显示
	 */
	public int EXCResponseType;
	/**
	 * 异常确认方类型 仅作显示
	 */
	public int EXCConfirmType;

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

	public EXCExceptionRule() {
		EXCTemplate =  (int)EXCTemplates.Artificial();
		CreateTime = DateTime.Now;
		EditTime = DateTime.Now;
		ExceptionTypeName = "";
		TimeOutList = new List<EXCTimeItem>();
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

	public long getExceptionType() {
		return ExceptionType;
	}

	public void setExceptionType(long exceptionType) {
		ExceptionType = exceptionType;
	}

	public String getExceptionTypeName() {
		return ExceptionTypeName;
	}

	public void setExceptionTypeName(String exceptionTypeName) {
		ExceptionTypeName = exceptionTypeName;
	}

	public int getRespondLevel() {
		return RespondLevel;
	}

	public void setRespondLevel(int respondLevel) {
		RespondLevel = respondLevel;
	}

	public List<EXCTimeItem> getTimeOutList() {
		return TimeOutList;
	}

	public void setTimeOutList(List<EXCTimeItem> timeOutList) {
		TimeOutList = timeOutList;
	}

	public int getReportTimes() {
		return ReportTimes;
	}

	public void setReportTimes(int reportTimes) {
		ReportTimes = reportTimes;
	}

	public int getForwardTimes() {
		return ForwardTimes;
	}

	public void setForwardTimes(int forwardTimes) {
		ForwardTimes = forwardTimes;
	}

	public int getEXCTemplate() {
		return EXCTemplate;
	}

	public void setEXCTemplate(int eXCTemplate) {
		EXCTemplate = eXCTemplate;
	}

	public int getEXCRequestType() {
		return EXCRequestType;
	}

	public void setEXCRequestType(int eXCRequestType) {
		EXCRequestType = eXCRequestType;
	}

	public int getEXCResponseType() {
		return EXCResponseType;
	}

	public void setEXCResponseType(int eXCResponseType) {
		EXCResponseType = eXCResponseType;
	}

	public int getEXCConfirmType() {
		return EXCConfirmType;
	}

	public void setEXCConfirmType(int eXCConfirmType) {
		EXCConfirmType = eXCConfirmType;
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
