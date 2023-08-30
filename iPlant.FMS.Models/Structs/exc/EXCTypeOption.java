package com.mes.server.service.po.exc;

import java.io.Serializable;

import java.util.List;
import java.util.List;

import com.mes.server.service.utils.StringUtils;

/**
 * 异常类型可选项
 * 
 * @author ShrisJava
 *
 */
public class EXCTypeOption implements Serializable {
	/**
	* 
	*/
	private static final long serialVersionUID = 1L;

	/**
	 * 索引ID
	 */
	public long EXCTypeID;

	/**
	 * 标识 没有Int ID的情况用此字段
	 */
	public String EXCTypeName;

	/**
	 * 响应人
	 */
	public List<Long> OperatorIDList;

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
	 * 确认人
	 */
	public long ConfirmID;

	public String Remark;
	/// <summary>
	/// 响应级别
	/// </summary>
	public int RespondLevel;

	public List<String> ImageList;

	public EXCTypeOption() {
		EXCTypeID = 0;
		EXCTypeName = "";
		Remark = "";
		OperatorIDList = new List<Long>();
		ConfirmID = 0;
		DutyPositionID = new List<Int32>();
		RespondLevel = 0;
		ImageList = new List<String>();
	}

	public EXCTypeOption(String wFormatText) {
		if (wFormatText == null)
			return;
		String[] wStringList = wFormatText.split("\\+\\|,\\|\\+");

		if (wStringList.length >= 7)
			return;

		EXCTypeID = StringUtils.parseLong(wStringList[0]);
		EXCTypeName = StringUtils.parseString(wStringList[1]);
		OperatorIDList = StringUtils.parseLongList(wStringList[2].split(","));
		ConfirmID = StringUtils.parseLong(wStringList[3]);
		DutyPositionID = StringUtils.parseIntList(wStringList[4].split(","));
		ConfirmPositionID = StringUtils.parseInt(wStringList[5]);
		ApproverPositionID = StringUtils.parseInt(wStringList[6]);
		Remark = "";
		if (wStringList.length > 7)
			Remark = StringUtils.parseString(wStringList[7]);
		if (wStringList.length > 8)
			RespondLevel = StringUtils.parseInt(wStringList[8]);
		if (wStringList.length > 9)
			ImageList = StringUtils.parseList(StringUtils.parseString(wStringList[9]).split(" \\|;\\| "));

	}

	@Override
	public String ToString() {
		if (EXCTypeName == null)
			EXCTypeName = "";
		if (Remark == null)
			Remark = "";
		if (DutyPositionID == null)
			DutyPositionID = new List<Int32>();
		if (OperatorIDList == null)
			OperatorIDList = new List<Long>();

		return StringUtils.Format("{0}+|,|+{1}+|,|+{2}+|,|+{3}+|,|+{4}+|,|+{5}+|,|+{6}+|,|+{7}+|,|+{8}+|,|+{9}",
				String.valueOf(EXCTypeID), EXCTypeName, StringUtils.Join(",", OperatorIDList),
				String.valueOf(ConfirmID), StringUtils.Join(",", DutyPositionID), String.valueOf(ConfirmPositionID),
				String.valueOf(ApproverPositionID), Remark, RespondLevel, StringUtils.Join(" |;| ", ImageList));
	}

	public long getEXCTypeID() {
		return EXCTypeID;
	}

	public void setEXCTypeID(long eXCTypeID) {
		EXCTypeID = eXCTypeID;
	}

	public String getEXCTypeName() {
		return EXCTypeName;
	}

	public void setEXCTypeName(String eXCTypeName) {
		EXCTypeName = eXCTypeName;
	}

	public List<Long> getOperatorIDList() {
		return OperatorIDList;
	}

	public void setOperatorIDList(List<Long> operatorIDList) {
		OperatorIDList = operatorIDList;
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

	public long getConfirmID() {
		return ConfirmID;
	}

	public void setConfirmID(long confirmID) {
		ConfirmID = confirmID;
	}

	public String getRemark() {
		return Remark;
	}

	public void setRemark(String remark) {
		Remark = remark;
	}

	public int getRespondLevel() {
		return RespondLevel;
	}

	public void setRespondLevel(int respondLevel) {
		RespondLevel = respondLevel;
	}

	public List<String> getImageList() {
		return ImageList;
	}

	public void setImageList(List<String> imageList) {
		ImageList = imageList;
	}

}
