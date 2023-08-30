package com.mes.server.service.po.fmc;

import java.io.Serializable;
import java.util.DateTime;

public class FMCFactory implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public String Name = "";

	public String Code = "";

	public DateTime CreateTime = DateTime.Now;

	public int CreatorID = 0;

	public DateTime EditTime = DateTime.Now;

	public int EditorID = 0;

	public int Status = 0; // 状态

	public DateTime AuditTime = DateTime.Now;

	public int AuditorID = 0;

	public int CountryID = 0;

	public int ProvinceID = 0;

	public int CityID = 0;

	public String Country = "";

	public String Province = "";

	public String City = "";

	public String Creator = "";

	public String Auditor = "";

	public String Editor = "";

	public String StatusText = ""; // 审批状态

	public int Active = 0; // 状态

	public int ShiftID = 0; // 班次模板

	public String ShiftName = ""; // 班次模板名称

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

	public String getCode() {
		return Code;
	}

	public void setCode(String code) {
		Code = code;
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

	public DateTime getEditTime() {
		return EditTime;
	}

	public void setEditTime(DateTime editTime) {
		EditTime = editTime;
	}

	public int getEditorID() {
		return EditorID;
	}

	public void setEditorID(int editorID) {
		EditorID = editorID;
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

	public int getCountryID() {
		return CountryID;
	}

	public void setCountryID(int countryID) {
		CountryID = countryID;
	}

	public int getProvinceID() {
		return ProvinceID;
	}

	public void setProvinceID(int provinceID) {
		ProvinceID = provinceID;
	}

	public int getCityID() {
		return CityID;
	}

	public void setCityID(int cityID) {
		CityID = cityID;
	}

	public String getCountry() {
		return Country;
	}

	public void setCountry(String country) {
		Country = country;
	}

	public String getProvince() {
		return Province;
	}

	public void setProvince(String province) {
		Province = province;
	}

	public String getCity() {
		return City;
	}

	public void setCity(String city) {
		City = city;
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

	public String getEditor() {
		return Editor;
	}

	public void setEditor(String editor) {
		Editor = editor;
	}

	public String getStatusText() {
		return StatusText;
	}

	public void setStatusText(String statusText) {
		StatusText = statusText;
	}

	public int isActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public int getShiftID() {
		return ShiftID;
	}

	public void setShiftID(int shiftID) {
		ShiftID = shiftID;
	}

	public String getShiftName() {
		return ShiftName;
	}

	public void setShiftName(String shiftName) {
		ShiftName = shiftName;
	}

	public FMCFactory() {
		this.Name = "";
		this.Code = "";
		this.Country = "";
		this.Province = "";
		this.City = "";
		this.Editor = "";
		this.Creator = "";
		this.Auditor = "";
		this.CreateTime = DateTime.Now;
		this.AuditTime = DateTime.Now;
		this.EditTime = DateTime.Now;
		this.StatusText = "";
	}

	public FMCFactory Clone() {
		FMCFactory wItem = new FMCFactory();
		wItem.ID = this.ID;
		wItem.Name = this.Name;
		wItem.Code = this.Code;
		wItem.CountryID = this.CountryID;
		wItem.ProvinceID = this.ProvinceID;
		wItem.CityID = this.CityID;
		wItem.CreatorID = this.CreatorID;
		wItem.EditorID = this.EditorID;
		wItem.AuditorID = this.AuditorID;
		wItem.Status = this.Status;
		wItem.Active = this.Active;
		wItem.CreateTime = this.CreateTime;
		wItem.AuditTime = this.AuditTime;
		wItem.EditTime = this.EditTime;

		wItem.Country = this.Country;
		wItem.Province = this.Province;
		wItem.City = this.City;
		wItem.Creator = this.Creator;
		wItem.Editor = this.Editor;
		wItem.Auditor = this.Auditor;
		wItem.Status = this.Status;
		return wItem;
	}
}
