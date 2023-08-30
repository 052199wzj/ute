package com.mes.server.service.po.erp;

import java.io.Serializable;

public class ERPMaterialGroup implements Serializable {
	/**
	 * ERP物料组信息
	 */
	private static final long serialVersionUID = 1L;

	public ERPMaterialGroup() {
		// TODO Auto-generated constructor stub
	}

	public int MaterialGroupID;// 物料组ID
	public String MaterialGroupName;// 物料组名称
	public String MateiralGroupNo;// 物料组代码
	public int PMaterialGroupID;// 上级物料组ID
	public String PMaterialGroupFullID;// 上级组ID全称

	public int getMaterialGroupID() {
		return MaterialGroupID;
	}

	public void setMaterialGroupID(int materialGroupID) {
		MaterialGroupID = materialGroupID;
	}

	public String getMaterialGroupName() {
		return MaterialGroupName;
	}

	public void setMaterialGroupName(String materialGroupName) {
		MaterialGroupName = materialGroupName;
	}

	public String getMateiralGroupNo() {
		return MateiralGroupNo;
	}

	public void setMateiralGroupNo(String mateiralGroupNo) {
		MateiralGroupNo = mateiralGroupNo;
	}

	public int getPMaterialGroupID() {
		return PMaterialGroupID;
	}

	public void setPMaterialGroupID(int pMaterialGroupID) {
		PMaterialGroupID = pMaterialGroupID;
	}

	public String getPMaterialGroupFullID() {
		return PMaterialGroupFullID;
	}

	public void setPMaterialGroupFullID(String pMaterialGroupFullID) {
		PMaterialGroupFullID = pMaterialGroupFullID;
	}

}
