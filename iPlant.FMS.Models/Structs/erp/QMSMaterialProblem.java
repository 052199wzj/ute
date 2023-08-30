package com.mes.server.service.po.erp;

import java.io.Serializable;
import java.util.DateTime;

public class QMSMaterialProblem implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public int ID;// 编号

	public int MaterialCheckID;// 来料检验单编号

	public DateTime CreateTime = DateTime.Now;// 创建日期

	public int MaterialID;// 物料编号

	public String MaterialNo;// 物料编码

	public String MaterialName;// 物料名称

	public int SupplierID;// 供应商编号

	public String SupplierName;// 供应商名称

	public String Project;// 项目名称

	public String Batch;// 批次号

	public float FQTY_Check;// 报检数量

	public float FQTY_Bad;// 不合格数量

	public float FQTY_Spot;// 抽检数量

	public String Description;// 不良问题描述

	public int OperatorID;// 操作员编号

	public String OperatorName;// 操作员名称

	public QMSMaterialProblem() {
		CreateTime.set(2000, 0, 1);
		MaterialNo = "";
		MaterialName = "";
		SupplierName = "";
		Batch = "";
		Project = "";
		Description = "";
		OperatorName = "";
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getMaterialCheckID() {
		return MaterialCheckID;
	}

	public void setMaterialCheckID(int materialCheckID) {
		MaterialCheckID = materialCheckID;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public int getMaterialID() {
		return MaterialID;
	}

	public void setMaterialID(int materialID) {
		MaterialID = materialID;
	}

	public String getMaterialNo() {
		return MaterialNo;
	}

	public void setMaterialNo(String materialNo) {
		MaterialNo = materialNo;
	}

	public String getMaterialName() {
		return MaterialName;
	}

	public void setMaterialName(String materialName) {
		MaterialName = materialName;
	}

	public int getSupplierID() {
		return SupplierID;
	}

	public void setSupplierID(int supplierID) {
		SupplierID = supplierID;
	}

	public String getSupplierName() {
		return SupplierName;
	}

	public void setSupplierName(String supplierName) {
		SupplierName = supplierName;
	}

	public String getProject() {
		return Project;
	}

	public void setProject(String project) {
		Project = project;
	}

	public String getBatch() {
		return Batch;
	}

	public void setBatch(String batch) {
		Batch = batch;
	}

	public float getFQTY_Check() {
		return FQTY_Check;
	}

	public void setFQTY_Check(float fQTY_Check) {
		FQTY_Check = fQTY_Check;
	}

	public float getFQTY_Bad() {
		return FQTY_Bad;
	}

	public void setFQTY_Bad(float fQTY_Bad) {
		FQTY_Bad = fQTY_Bad;
	}

	public float getFQTY_Spot() {
		return FQTY_Spot;
	}

	public void setFQTY_Spot(float fQTY_Spot) {
		FQTY_Spot = fQTY_Spot;
	}

	public String getDescription() {
		return Description;
	}

	public void setDescription(String description) {
		Description = description;
	}

	public int getOperatorID() {
		return OperatorID;
	}

	public void setOperatorID(int operatorID) {
		OperatorID = operatorID;
	}

	public String getOperatorName() {
		return OperatorName;
	}

	public void setOperatorName(String operatorName) {
		OperatorName = operatorName;
	}
}
