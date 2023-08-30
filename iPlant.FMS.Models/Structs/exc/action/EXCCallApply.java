package com.mes.server.service.po.exc.action;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

import com.mes.server.service.po.exc.EXCTypeOption;

/**
 * 异常申请单 可生成多条任务单
 */
public class EXCCallApply implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/// <summary>
	/// 唯一
	/// </summary>
	public long ID;

	/// <summary>
	///
	/// </summary>
	public int CompanyID;

	/// <summary>
	/// 异常点类型
	/// </summary>
	public long StationType;
	/// <summary>
	/// 异常点类型
	/// </summary>
	public String StationTypeName;

	/// <summary>
	/// 异常点ID
	/// </summary>
	public long StationID;

	/// <summary>
	/// 异常点编码
	/// </summary>
	public String StationNo;

	/// <summary>
	/// 异常类型 多选
	/// </summary>
	public List<EXCTypeOption> ExceptionTypeList;

	/// <summary>
	/// 响应级别
	/// </summary>
	public int RespondLevel;

	/// <summary>
	/// 申请人ID
	/// </summary>
	public long ApplicantID;

	/// <summary>
	/// 申请时刻
	/// </summary>
	public DateTime ApplicantTime = DateTime.Now;
	/// <summary>
	/// 审批人ID
	/// </summary>
	public long ApproverID;

	/// <summary>
	/// 审批时刻
	/// </summary>
	public DateTime ApproverTime = DateTime.Now;
	/// <summary>
	/// 确认人ID
	/// </summary>
	public long ConfirmID;

	/// <summary>
	/// 确认时刻
	/// </summary>
	public DateTime ConfirmTime = DateTime.Now;

	/// <summary>
	/// 是否到场确认
	/// </summary>
	public boolean OnSite;

	/// <summary>
	/// 是否在看板上显示
	/// </summary>
	public boolean DisplayBoard;

	/// <summary>
	/// 描述
	/// </summary>
	public String Comment;

	/// <summary>
	/// 图片地址
	/// </summary>
	public List<String> ImageList;

	/// <summary>
	/// 申请单据状态 撤销 审批 驳回
	/// </summary>
	public int Status;
	
	/**
	 *   !工件编号
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

	public EXCCallApply() {
		StationTypeName = "";
		StationNo = "";
		ExceptionTypeList = new List<EXCTypeOption>();
		ApplicantTime.set(2000, 0, 1);  
		ApproverTime.set(2000, 0, 1);
		ConfirmTime.set(2000, 0, 1);
		Comment = "";
		ImageList = new List<String>();
	}

	public long ID {
		return ID;
	}

	public void setID(long iD) {
		ID = iD;
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

	public List<EXCTypeOption> getExceptionTypeList() {
		return ExceptionTypeList;
	}

	public void setExceptionTypeList(List<EXCTypeOption> exceptionTypeList) {
		ExceptionTypeList = exceptionTypeList;
	}

	public int getRespondLevel() {
		return RespondLevel;
	}

	public void setRespondLevel(int respondLevel) {
		RespondLevel = respondLevel;
	}

	public long getApplicantID() {
		return ApplicantID;
	}

	public void setApplicantID(long applicantID) {
		ApplicantID = applicantID;
	}

	public DateTime getApplicantTime() {
		return ApplicantTime;
	}

	public void setApplicantTime(DateTime applicantTime) {
		ApplicantTime = applicantTime;
	}

	public long getApproverID() {
		return ApproverID;
	}

	public void setApproverID(long approverID) {
		ApproverID = approverID;
	}

	public DateTime getApproverTime() {
		return ApproverTime;
	}

	public void setApproverTime(DateTime approverTime) {
		ApproverTime = approverTime;
	}

	public long getConfirmID() {
		return ConfirmID;
	}

	public void setConfirmID(long confirmID) {
		ConfirmID = confirmID;
	}

	public DateTime getConfirmTime() {
		return ConfirmTime;
	}

	public void setConfirmTime(DateTime confirmTime) {
		ConfirmTime = confirmTime;
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

	public String getPartNo() {
		return PartNo;
	}

	public void setPartNo(String partNo) {
		PartNo = partNo;
	}

	public int getPlaceID() {
		return PlaceID;
	}

	public void setPlaceID(int placeID) {
		PlaceID = placeID;
	}

	public String getPlaceNo() {
		return PlaceNo;
	}

	public void setPlaceNo(String placeNo) {
		PlaceNo = placeNo;
	}
}
