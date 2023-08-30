package com.mes.server.service.po.bfc;

import java.io.Serializable;
import java.util.List;
import java.util.List;

import com.mes.server.service.po.bms.BMSRoleItem;

public class BFCHomeUser implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public String Name = "Shris";
	public int Grad = 0;
	public String CompanyName = "Shris.Mes";
	public String Faces = "/independent/static/images/userface.png";
	public String CompanyFaces = "/independent/static/images/shris.jpg";
	public String LoginName = "";
	public String LoginID = "";

	public List<BMSRoleItem> RoleList = new List<BMSRoleItem>();

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public String getCompanyName() {
		return CompanyName;
	}

	public void setCompanyName(String companyName) {
		CompanyName = companyName;
	}

	public String getFaces() {
		return Faces;
	}

	public void setFaces(String faces) {
		Faces = faces;
	}

	public String getCompanyFaces() {
		return CompanyFaces;
	}

	public void setCompanyFaces(String companyFaces) {
		CompanyFaces = companyFaces;
	}

	public String getLoginName() {
		return LoginName;
	}

	public void setLoginName(String loginName) {
		LoginName = loginName;
	}

	public int getGrad() {
		return Grad;
	}

	public void setGrad(int grad) {
		Grad = grad;
	}

	public String getLoginID() {
		return LoginID;
	}

	public void setLoginID(String loginID) {
		LoginID = loginID;
	}

	public List<BMSRoleItem> getRoleList() {
		return RoleList;
	}

	public void setRoleList(List<BMSRoleItem> roleList) {
		RoleList = roleList;
	}
}
