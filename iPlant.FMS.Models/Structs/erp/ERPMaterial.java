package com.mes.server.service.po.erp;

import java.io.Serializable;

public class ERPMaterial implements Serializable {

	/**
	 * ERP物料信息
	 */
	private static final long serialVersionUID = 1L;

	public ERPMaterial() {
		// TODO Auto-generated constructor stub
	}

	public int FDStock = 0;
	public String FDStockName = "";
	public int IsIQCCheck = 0;
	public int MaterialID;// 物料内码
	public String MaterialName;// 物料名称
	public String MaterialNo;// 物料代码
	public String Specification;// 规格型号
	public int MaterialType;// 物料属性：外购-1;自制-2委外-3;配置-9资产-10;特征-4;费用-11;虚拟-5服务-6;一次性-7;模型-12
	public int BasicUnitID;// 基本单位ID
	public String BasicUnitName;// 基本单位名称
	public int StockUnitID;// 基本单位ID
	public String StockUnitName;// 基本单位名称
	public int MaterialGroupID;// 物料分组ID
	public String MaterialGroupNo;// 物料分组编码
	public String MaterialGroupName;// 物料分组名称
	public int Status;// 状态
	public int ExpPeriod;// 保质期
	public int ExpUnitID;// 保质期单位ID
	public String ExpUnitName;// 保质期单位名称
	public int MinIssueUnitID;// 最小发料批量单位

	public int getFDStock() {
		return FDStock;
	}

	public void setFDStock(int fDStock) {
		FDStock = fDStock;
	}

	public String getFDStockName() {
		return FDStockName;
	}

	public void setFDStockName(String fDStockName) {
		FDStockName = fDStockName;
	}

	public int getMaterialID() {
		return MaterialID;
	}

	public void setMaterialID(int materialID) {
		MaterialID = materialID;
	}

	public String getMaterialName() {
		return MaterialName;
	}

	public void setMaterialName(String materialName) {
		MaterialName = materialName;
	}

	public String getMaterialNo() {
		return MaterialNo;
	}

	public void setMaterialNo(String materialNo) {
		MaterialNo = materialNo;
	}

	public String getSpecification() {
		return Specification;
	}

	public void setSpecification(String specification) {
		Specification = specification;
	}

	public int getMaterialType() {
		return MaterialType;
	}

	public void setMaterialType(int materialType) {
		MaterialType = materialType;
	}

	public int getBasicUnitID() {
		return BasicUnitID;
	}

	public void setBasicUnitID(int basicUnitID) {
		BasicUnitID = basicUnitID;
	}

	public String getBasicUnitName() {
		return BasicUnitName;
	}

	public void setBasicUnitName(String basicUnitName) {
		BasicUnitName = basicUnitName;
	}

	public int getStockUnitID() {
		return StockUnitID;
	}

	public void setStockUnitID(int stockUnitID) {
		StockUnitID = stockUnitID;
	}

	public String getStockUnitName() {
		return StockUnitName;
	}

	public void setStockUnitName(String stockUnitName) {
		StockUnitName = stockUnitName;
	}

	public int getMaterialGroupID() {
		return MaterialGroupID;
	}

	public void setMaterialGroupID(int materialGroupID) {
		MaterialGroupID = materialGroupID;
	}

	public String getMaterialGroupNo() {
		return MaterialGroupNo;
	}

	public void setMaterialGroupNo(String materialGroupNo) {
		MaterialGroupNo = materialGroupNo;
	}

	public String getMaterialGroupName() {
		return MaterialGroupName;
	}

	public void setMaterialGroupName(String materialGroupName) {
		MaterialGroupName = materialGroupName;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public int getExpPeriod() {
		return ExpPeriod;
	}

	public void setExpPeriod(int expPeriod) {
		ExpPeriod = expPeriod;
	}

	public int getExpUnitID() {
		return ExpUnitID;
	}

	public void setExpUnitID(int expUnitID) {
		ExpUnitID = expUnitID;
	}

	public String getExpUnitName() {
		return ExpUnitName;
	}

	public void setExpUnitName(String expUnitName) {
		ExpUnitName = expUnitName;
	}

	public int getMinIssueUnitID() {
		return MinIssueUnitID;
	}

	public void setMinIssueUnitID(int minIssueUnitID) {
		MinIssueUnitID = minIssueUnitID;
	}

}
