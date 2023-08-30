package com.mes.server.service.po.sfc;

import java.io.Serializable;
import java.util.DateTime;

import com.mes.server.shristool.LoggerTool;

public class SFCWorkFlow implements Serializable {
	private static final long serialVersionUID = 1L;

	// [DataMember(Name = "ID", Order = 0)]
	public int ID= 0; // 索引值
	// [DataMember(Name = "EntryID", Order = 1)]
	public int EntryID= 0; // 实体ID
	// [DataMember(Name = "EntryName", Order = 2)]
	public String EntryName = ""; // 实体名称
	// [DataMember(Name = "EntryType", Order = 3)]
	public int EntryType= 0; // 实体类别（车间、产线、工序、工位）
	// [DataMember(Name = "WorkFlowID", Order = 4)]
	public int WorkFlowID= 0; // 作业工作流ID
	// [DataMember(Name = "CreateTime", Order = 5)]
	public DateTime CreateTime= DateTime.Now;
	// [DataMember(Name = "CreatorID", Order = 6)]
	public int CreatorID= 0;
	// [DataMember(Name = "AuditTime", Order = 7)]
	public DateTime AuditTime= DateTime.Now;
	// [DataMember(Name = "AuditorID", Order = 8)]
	public int AuditorID= 0;
	// [DataMember(Name = "Status", Order = 9)]
	public int Status= 0;
	// [DataMember(Name = "Active", Order = 10)]
	public int Active=0;
	// [DataMember(Name = "Creator", Order = 11)]
	public String Creator = "";
	// [DataMember(Name = "Auditor", Order = 12)]
	public String Auditor = "";
	// [DataMember(Name = "WorkShopName", Order = 13)]
	public String WorkShopName = "";
	// [DataMember(Name = "LineName", Order = 14)]
	public String LineName = "";
	// [DataMember(Name = "WorkFlowName", Order = 15)]
	public String WorkFlowName = "";
	// [DataMember(Name = "LineID", Order = 16)]
	public int LineID= 0; // 产线ID
	// [DataMember(Name = "WorkShopID", Order = 17)]
	public int WorkShopID= 0; // 车间ID

	public SFCWorkFlow() {
		this.ID=0;
		this.EntryID=0;
		this.EntryType=0;
		this.WorkFlowID=0;
		this.CreatorID=0;
		this.AuditorID=0;
		this.Status=0;
		
		this.LineID=0;
		this.WorkShopID=0; 
		this.Creator = "";
		this.Auditor = "";
		this.WorkShopName = "";
		this.LineName = "";
		this.WorkFlowName = "";
		this.AuditTime = DateTime.Now;
		this.CreateTime = DateTime.Now;
		this.Active = 0;
	}

	public SFCWorkFlow Clone() {
		SFCWorkFlow wItem = new SFCWorkFlow();
		try {
			wItem.ID = this.ID;
			wItem.EntryID = this.EntryID;
			wItem.EntryName = this.EntryName;
			wItem.EntryType = this.EntryType;

			wItem.WorkFlowID = this.WorkFlowID;
			wItem.AuditTime = this.AuditTime;
			wItem.AuditorID = this.AuditorID;
			wItem.CreateTime = this.CreateTime;
			wItem.CreatorID = this.CreatorID;
			wItem.Status = this.Status;
			wItem.Active = this.Active;
			wItem.Creator = this.Creator;
			wItem.Auditor = this.Auditor;
			wItem.WorkShopName = this.WorkShopName;
			wItem.LineName = this.LineName;
			wItem.WorkFlowName = this.WorkFlowName;
		} catch (Exception ex) {
			LoggerTool.SaveException("SFCService", "SFCWorkFlow Clone", ex);
		}
		return wItem;
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getEntryID() {
		return EntryID;
	}

	public void setEntryID(int entryID) {
		EntryID = entryID;
	}

	public String getEntryName() {
		return EntryName;
	}

	public void setEntryName(String entryName) {
		EntryName = entryName;
	}

	public int getEntryType() {
		return EntryType;
	}

	public void setEntryType(int entryType) {
		EntryType = entryType;
	}

	public int getWorkFlowID() {
		return WorkFlowID;
	}

	public void setWorkFlowID(int workFlowID) {
		WorkFlowID = workFlowID;
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

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
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

	public String getWorkFlowName() {
		return WorkFlowName;
	}

	public void setWorkFlowName(String workFlowName) {
		WorkFlowName = workFlowName;
	}

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
	}

	public int getWorkShopID() {
		return WorkShopID;
	}

	public void setWorkShopID(int workShopID) {
		WorkShopID = workShopID;
	}
}
