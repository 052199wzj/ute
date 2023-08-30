package com.mes.server.service.po.exc.action;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

import com.mes.server.service.po.exc.define.EXCActionTypes;
 

/**
 * 所有操作提交的数据
 */
public class EXCCallAction implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 唯一
	 */
	public long ID;

	public long TaskID;
	/**
	 * 操作类型
	 */
	public int ActionType;

	public int CompanyID;

	/**
	 * 用户ID 操作人ID
	 */
	public long OperatorID;

	/**
	 * 接收ID
	 */
	public long DispatchID;

	/**
	 * 转发对象ID
	 */
	public List<Long> Forwarder;

	/**
	 * 描述
	 */
	public String Comment;

	/**
	 * 图片地址
	 */
	public List<String> ImageList;

	/**
	 * 录入时间
	 */
	public DateTime CreateTime;

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

	public int getActionType() {
		return ActionType;
	}

	public void setActionType(int actionType) {
		ActionType = actionType;
	}

	public int getCompanyID() {
		return CompanyID;
	}

	public void setCompanyID(int companyID) {
		CompanyID = companyID;
	}

	public long getOperatorID() {
		return OperatorID;
	}

	public void setOperatorID(long operatorID) {
		OperatorID = operatorID;
	}

	public long getDispatchID() {
		return DispatchID;
	}

	public void setDispatchID(long dispatchID) {
		DispatchID = dispatchID;
	}

	 

	public String getComment() {
		return Comment;
	}

	public void setComment(String comment) {
		Comment = comment;
	}

	public List<String> getImageList() {
		return ImageList;
	}

	public void setImageList(List<String> imageList) {
		ImageList = imageList;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public EXCCallAction() {

		Comment = "";
		ActionType = (int)EXCActionTypes.Default();
		ImageList = new List<String>();
	}

	public List<Long> getForwarder() {
		return Forwarder;
	}

	public void setForwarder(List<Long> forwarder) {
		Forwarder = forwarder;
	}

}
