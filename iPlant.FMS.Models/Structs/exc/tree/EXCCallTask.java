package com.mes.server.service.po.exc.tree;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

/**
 * 异常任务主体
 * 
 * @author ShrisJava
 *
 */
public class EXCCallTask implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	public long ID;

	/**
	 * 接收ID 发起人获取为0 接收人获取为>0
	 */
	public long DispatchID;

	/**
	 * 申请单ID
	 */
	public long ApplyID;

	/**  
	 *  
	 */
	public int CompanyID;

	/**
	 * 异常点类型 申请单中获取
	 */
	public long StationType;

	/**
	 * 异常点类型 申请单中获取
	 */
	public String StationTypeName;

	/**
	 * 异常点ID 申请单中获取
	 */
	public long StationID;

	/**
	 * 异常点编码 申请单中获取
	 */
	public String StationNo;

	/**
	 * 异常类型ID
	 */
	public long ExceptionTypeID;

	/**
	 * 异常类型名称
	 */

	public String ExceptionTypeName;

	/**
	 * 申请人ID 申请单中获取
	 */
	public long ApplicantID;

	/**
	 * 确认人ID
	 */
	public long ConfirmID;

	/**
	 * 责任人ID 异常解决人 最后责任人 会变
	 */
	public List<Long> OperatorID;

	/**
	 * 申请时刻
	 */
	public DateTime ApplicantTime = DateTime.Now;

	/**
	 * 响应级别 申请单中获取
	 */
	public int RespondLevel;

	/**
	 * 是否到场确认 申请单中获取
	 */
	public boolean OnSite;

	/**
	 * 是否在看板上显示 申请单中获取
	 */
	public boolean DisplayBoard;

	/**
	 * 录入时间
	 */

	public DateTime CreateTime = DateTime.Now;

	/**
	 * 修改时间
	 */
	public DateTime EditTime = DateTime.Now;

	/**
	 * 超时时间 -- 不存数据库 只在拿个人任务列表时赋值 >2010-1-1 时为需要倒计时的 否则无需倒计时
	 */
	public DateTime ExpireTime = DateTime.Now;

	/**
	 * 备注 可用于自定义数据存储
	 */
	public String Remark;

	/**
	 * 描述 申请单中获取
	 */
	public String Comment;

	/**
	 * 图片地址 申请单中获取
	 */
	public List<String> ImageList;

	/**
	 * 任务状态 撤销 待处理 待确认 已确认 已驳回
	 */
	public int Status;

	/**
	 * 剩余上报次数
	 */
	public int ReportTimes;

	/**
	 * 剩余转发次数
	 */
	public int ForwardTimes;

	/**
	 * 班次ID
	 */
	public int ShiftID;
	/**
	 * !工件编号
	 */
	public String PartNo;
	
	/**
	 *   台位ID
	 */
	public int PlaceID;
	
	/**
	 *   台位编号
	 */
	public String PlaceNo;

	public EXCCallTask() {
		StationTypeName = "";
		StationNo = "";
		ExpireTime.set(2000, 0, 1);
		ApplicantTime.set(2000, 0, 1);
		CreateTime.set(2000, 0, 1);
		EditTime.set(2000, 0, 1);
		Comment = "";
		PartNo = "";
		ImageList = new List<String>();
	}

	public long ID {
		return ID;
	}

	public void setID(long iD) {
		ID = iD;
	}

	public long getDispatchID() {
		return DispatchID;
	}

	public void setDispatchID(long dispatchID) {
		DispatchID = dispatchID;
	}

	public long getApplyID() {
		return ApplyID;
	}

	public void setApplyID(long applyID) {
		ApplyID = applyID;
	}

	public int getCompanyID() {
		return CompanyID;
	}

	public void setCompanyID(int companyID) {
		CompanyID = companyID;
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

	public long getExceptionTypeID() {
		return ExceptionTypeID;
	}

	public void setExceptionTypeID(long exceptionTypeID) {
		ExceptionTypeID = exceptionTypeID;
	}

	public String getExceptionTypeName() {
		return ExceptionTypeName;
	}

	public void setExceptionTypeName(String exceptionTypeName) {
		ExceptionTypeName = exceptionTypeName;
	}

	public long getApplicantID() {
		return ApplicantID;
	}

	public void setApplicantID(long applicantID) {
		ApplicantID = applicantID;
	}

	public long getConfirmID() {
		return ConfirmID;
	}

	public void setConfirmID(long confirmID) {
		ConfirmID = confirmID;
	}

	 

	public DateTime getApplicantTime() {
		return ApplicantTime;
	}

	public void setApplicantTime(DateTime applicantTime) {
		ApplicantTime = applicantTime;
	}

	public int getRespondLevel() {
		return RespondLevel;
	}

	public void setRespondLevel(int respondLevel) {
		RespondLevel = respondLevel;
	}

	public boolean isOnSite() {
		return OnSite;
	}

	public void setOnSite(boolean onSite) {
		OnSite = onSite;
	}

	public boolean isDisplayBoard() {
		return DisplayBoard;
	}

	public void setDisplayBoard(boolean displayBoard) {
		DisplayBoard = displayBoard;
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

	public DateTime getExpireTime() {
		return ExpireTime;
	}

	public void setExpireTime(DateTime expireTime) {
		ExpireTime = expireTime;
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

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
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

	public int getShiftID() {
		return ShiftID;
	}

	public void setShiftID(int shiftID) {
		ShiftID = shiftID;
	}

	public String getRemark() {
		return Remark;
	}

	public void setRemark(String remark) {
		Remark = remark;
	}

	public String getPartNo() {
		return PartNo;
	}

	public void setPartNo(String partNo) {
		PartNo = partNo;
	}

	 
	public String getPlaceNo() {
		return PlaceNo;
	}

	public void setPlaceNo(String placeNo) {
		PlaceNo = placeNo;
	}

	public int getPlaceID() {
		return PlaceID;
	}

	public void setPlaceID(int placeID) {
		PlaceID = placeID;
	}

	public List<Long> getOperatorID() {
		return OperatorID;
	}

	public void setOperatorID(List<Long> operatorID) {
		OperatorID = operatorID;
	}
}
