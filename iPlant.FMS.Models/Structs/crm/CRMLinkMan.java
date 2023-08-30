package com.mes.server.service.po.crm;

import java.io.Serializable;
import java.util.DateTime;

public class CRMLinkMan implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public int CustomerID = 0;

	public String CustomerName = "";

	public String CustomerCode = "";

	public String Name = "";

	public String Position = "";

	public String WeiXin = "";

	public String MobilePhone = "";

	public String EMail = "";

	public int Grade = 0;

	public int CreatorID = 0;

	public String GradeText = "";

	public String Description = "";

	public String Creator = "";

	public DateTime CreateTime = DateTime.Now;

	public int Active = 0;

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getCustomerID() {
		return CustomerID;
	}

	public void setCustomerID(int customerID) {
		CustomerID = customerID;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public String getPosition() {
		return Position;
	}

	public void setPosition(String position) {
		Position = position;
	}

	public String getWeiXin() {
		return WeiXin;
	}

	public void setWeiXin(String weiXin) {
		WeiXin = weiXin;
	}

	public String getMobilePhone() {
		return MobilePhone;
	}

	public void setMobilePhone(String mobilePhone) {
		MobilePhone = mobilePhone;
	}

	public String getEMail() {
		return EMail;
	}

	public void setEMail(String eMail) {
		EMail = eMail;
	}

	public int getGrade() {
		return Grade;
	}

	public void setGrade(int grade) {
		Grade = grade;
	}

	public int getCreatorID() {
		return CreatorID;
	}

	public void setCreatorID(int creatorID) {
		CreatorID = creatorID;
	}

	public String getGradeText() {
		return GradeText;
	}

	public void setGradeText(String gradeText) {
		GradeText = gradeText;
	}

	public String getDescription() {
		return Description;
	}

	public void setDescription(String description) {
		Description = description;
	}

	public String getCreator() {
		return Creator;
	}

	public void setCreator(String creator) {
		Creator = creator;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public CRMLinkMan() {
		this.CreateTime = DateTime.Now;
	}
}
