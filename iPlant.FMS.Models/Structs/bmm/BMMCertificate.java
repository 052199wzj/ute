package com.mes.server.service.po.bmm;

import java.io.Serializable;

/**
 * 需求证书
 * 
 * @author ShrisJava
 *
 */
public class BMMCertificate implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public String Name = "";

	public String Detail = "";

	public int CheckType = 0;

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

	public int getCheckType() {
		return CheckType;
	}

	public void setCheckType(int checkType) {
		CheckType = checkType;
	}

	public String getDetail() {
		return Detail;
	}

	public void setDetail(String detail) {
		Detail = detail;
	}

	public BMMCertificate() {
	}

}
