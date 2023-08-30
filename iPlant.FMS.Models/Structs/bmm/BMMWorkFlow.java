package com.mes.server.service.po.bmm;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class BMMWorkFlow implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public String Name = "";

	public String Text = "";

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public int Status = 0; // 状态

	public DateTime AuditTime = DateTime.Now;

	public int AuditorID = 0;

	public int WorkShopID = 0;

	public int LineID = 0;

	public int PartID = 0;
	public String PartName = "";

	public String WorkShopName = "";

	public String LineName = "";



	public String Creator = "";

	public String Auditor = "";

	public String VersionNo = "";// 版本ID（已使用的版本则必须另存为）

	public List<BMMWFStep> StepList = new List<>();

	public String StatusText = ""; // 状态

	public BMMWorkFlow() {
		this.Name = "";
		this.Text = "";
		this.CreateTime = DateTime.Now;
		this.AuditTime = DateTime.Now;
		this.StepList = new List<>();
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public String getText() {
		return Text;
	}

	public void setText(String text) {
		Text = text;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public int getCreatorID() {
		return CreatorID;
	}

	public void setCreatorID(int creatorID) {
		CreatorID = creatorID;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public DateTime getAuditTime() {
		return AuditTime;
	}

	public void setAuditTime(DateTime auditTime) {
		AuditTime = auditTime;
	}

	public int getAuditorID() {
		return AuditorID;
	}

	public void setAuditorID(int auditorID) {
		AuditorID = auditorID;
	}

	public int getWorkShopID() {
		return WorkShopID;
	}

	public void setWorkShopID(int workShopID) {
		WorkShopID = workShopID;
	}

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
	}

	public int getPartID() {
		return PartID;
	}

	public void setPartID(int partID) {
		PartID = partID;
	}

	public String getPartName() {
		return PartName;
	}

	public void setPartName(String partName) {
		PartName = partName;
	}

	public String getWorkShopName() {
		return WorkShopName;
	}

	public void setWorkShopName(String workShopName) {
		WorkShopName = workShopName;
	}

	public String getLineName() {
		return LineName;
	}

	public void setLineName(String lineName) {
		LineName = lineName;
	}

	public String getCreator() {
		return Creator;
	}

	public void setCreator(String creator) {
		Creator = creator;
	}

	public String getAuditor() {
		return Auditor;
	}

	public void setAuditor(String auditor) {
		Auditor = auditor;
	}

	public String getVersionNo() {
		return VersionNo;
	}

	public void setVersionNo(String versionNo) {
		VersionNo = versionNo;
	}

	public List<BMMWFStep> getStepList() {
		return StepList;
	}

	public void setStepList(List<BMMWFStep> stepList) {
		StepList = stepList;
	}

	public String getStatusText() {
		return StatusText;
	}

	public void setStatusText(String statusText) {
		StatusText = statusText;
	}

}
