package com.mes.server.service.po.exc.tree;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

import com.mes.server.service.po.exc.EXCOptionItem;
import com.mes.server.service.po.exc.action.EXCCallAction;
import com.mes.server.service.po.exc.define.EXCCallStatus;

/**
 * 异常责任人任务
 * 
 * @author ShrisJava
 *
 */
public class EXCCallDispatch implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	public long ID = 0;

	public long TaskID = 0;

	/** 
	 * 
	 */
	public int CompanyID = 0;

	/**
	 * 创建人
	 */
	public long CreatorID = 0;

	/**
	 * 接收人ID
	 */
	public long OperatorID = 0;

	/**
	 * 录入时间
	 */
	public DateTime CreateTime;

	/**
	 * 修改时间
	 */
	public DateTime EditTime;

	/**
	 * 任务状态 待处理 待确认 已确认 已驳回 已转发 已上报 已撤销
	 */
	public int Status;

	/**
	 * 操作记录
	 */
	public List<EXCCallAction> ActionList;

	/**
	 * 班次ID
	 */
	public int ShiftID;

	/**
	 * 允许的操作
	 */
	public List<EXCOptionItem> CallActions;

	public EXCCallDispatch() {
		ActionList = new List<EXCCallAction>();
		CallActions = new List<EXCOptionItem>();
		CreateTime = DateTime.Now;
		EditTime = DateTime.Now;
	}

	public EXCCallDispatch(EXCCallTask wEXCCallTask, long wOperatorID) {
		TaskID = wEXCCallTask.ID;
		CompanyID = wEXCCallTask.CompanyID;
		CreatorID = wEXCCallTask.ApplicantID;
		OperatorID = wOperatorID;
		CreateTime = DateTime.Now;
		EditTime = DateTime.Now;
		ShiftID = wEXCCallTask.ShiftID;
		CallActions = new List<EXCOptionItem>();
		Status = (int)EXCCallStatus.WaitRespond();
		ActionList = new List<EXCCallAction>();

	}

	public static List<EXCCallDispatch> ForwarderDispatch(EXCCallAction wEXCCallAction, int wShiftID) {
		List<EXCCallDispatch> wResult = new List<EXCCallDispatch>();

		if (wEXCCallAction == null || wEXCCallAction.Forwarder == null || wEXCCallAction.Forwarder.Count <= 0)
			return wResult;

		for (Long wForwarder : wEXCCallAction.Forwarder) {
			EXCCallDispatch wEXCCallDispatch = new EXCCallDispatch();

			wEXCCallDispatch.TaskID = wEXCCallAction.TaskID;
			wEXCCallDispatch.CompanyID = wEXCCallAction.CompanyID;
			wEXCCallDispatch.CreatorID = wEXCCallAction.OperatorID;
			wEXCCallDispatch.OperatorID = wForwarder;
			wEXCCallDispatch.CreateTime = DateTime.Now;
			wEXCCallDispatch.EditTime = DateTime.Now;
			wEXCCallDispatch.ShiftID = wShiftID;
			wEXCCallDispatch.CallActions = new List<EXCOptionItem>();
			wEXCCallDispatch.Status = (int)EXCCallStatus.WaitRespond();
			wEXCCallDispatch.ActionList = new List<EXCCallAction>();
			wResult.Add(wEXCCallDispatch);
		}

		return wResult;
	}

	public long ID {
		return ID;
	}

	public void setID(long iD) {
		ID = iD;
	}

	public long getTaskID() {
		return TaskID;
	}

	public void setTaskID(long taskID) {
		TaskID = taskID;
	}

	public int getCompanyID() {
		return CompanyID;
	}

	public void setCompanyID(int companyID) {
		CompanyID = companyID;
	}

	public long getCreatorID() {
		return CreatorID;
	}

	public void setCreatorID(long creatorID) {
		CreatorID = creatorID;
	}

	public long getOperatorID() {
		return OperatorID;
	}

	public void setOperatorID(long operatorID) {
		OperatorID = operatorID;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public DateTime getEditTime() {
		return EditTime;
	}

	public void setEditTime(DateTime editTime) {
		EditTime = editTime;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public List<EXCCallAction> getActionList() {
		return ActionList;
	}

	public void setActionList(List<EXCCallAction> actionList) {
		ActionList = actionList;
	}

	public int getShiftID() {
		return ShiftID;
	}

	public void setShiftID(int shiftID) {
		ShiftID = shiftID;
	}

	public List<EXCOptionItem> getCallActions() {
		return CallActions;
	}

	public void setCallActions(List<EXCOptionItem> callActions) {
		CallActions = callActions;
	}
}
