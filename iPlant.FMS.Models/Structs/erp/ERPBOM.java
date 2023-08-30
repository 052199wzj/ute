package com.mes.server.service.po.erp;

import java.io.Serializable;
/// <summary>
/// BOM信息
/// </summary>

public class ERPBOM implements Serializable {

	private static final long serialVersionUID = 1L;

	/**
	 * BOMID
	 */
	public int BOMID = 0;
	/**
	 * BOM编码
	 */
	public String BOMNo = "";
	/**
	 * BOM名称
	 */
	public String BOMName = "";
	/**
	 * BOM明细ID
	 */
	public int BOMDetailID = 0;
	/**
	 * 子项BOMID
	 */
	public int SBOMID = 0;
	/**
	 * 订单ID
	 */
	public int OrderID = 0;
	/**
	 * 订单编号
	 */
	public String OrderNo = "";
	/**
	 * 订单子项ID
	 */
	public int OrderDetailID = 0;
	/**
	 * 父项物料ID
	 */
	public int PMaterialID = 0;
	/**
	 * 父项物料编码
	 */
	public String PMaterialNo = "";
	/**
	 * 父项物料名称
	 */
	public String PMaterialName = "";
	/**
	 * 父项物料型号
	 */
	public String PMaterialModel = "";
	/**
	 * 子项物料ID
	 */
	public int SMaterialID = 0;
	/**
	 * 子项物料编码
	 */
	public String SMaterialNo = "";
	/**
	 * 子项物料名称
	 */
	public String SMaterialName = "";
	/**
	 * 子项物料型号
	 */
	public String SMaterialModel = "";
	/**
	 * 分子
	 */
	public Double Numerator = 0d;
	/**
	 * 分母
	 */
	public Double Denominator = 0d;
	/**
	 * 变动损耗率
	 */
	public Double ScrAprate = 0d;
	/**
	 * 工序ID
	 */
	public int PartPointID = 0;
	/**
	 * 用量单位ID
	 */
	public int UnitID = 0;
	/**
	 * 用量单位名称
	 */
	public String UnitName = "";
	/**
	 * 状态
	 */
	public int Status = 0;

	public int getBOMID() {
		return BOMID;
	}

	public void setBOMID(int bOMID) {
		BOMID = bOMID;
	}

	public String getBOMNo() {
		return BOMNo;
	}

	public void setBOMNo(String bOMNo) {
		BOMNo = bOMNo;
	}

	public String getBOMName() {
		return BOMName;
	}

	public void setBOMName(String bOMName) {
		BOMName = bOMName;
	}

	public int getBOMDetailID() {
		return BOMDetailID;
	}

	public void setBOMDetailID(int bOMDetailID) {
		BOMDetailID = bOMDetailID;
	}

	public int getSBOMID() {
		return SBOMID;
	}

	public void setSBOMID(int sBOMID) {
		SBOMID = sBOMID;
	}

	public int getOrderID() {
		return OrderID;
	}

	public void setOrderID(int orderID) {
		OrderID = orderID;
	}

	public String getOrderNo() {
		return OrderNo;
	}

	public void setOrderNo(String orderNo) {
		OrderNo = orderNo;
	}

	public int getOrderDetailID() {
		return OrderDetailID;
	}

	public void setOrderDetailID(int orderDetailID) {
		OrderDetailID = orderDetailID;
	}

	public int getPMaterialID() {
		return PMaterialID;
	}

	public void setPMaterialID(int pMaterialID) {
		PMaterialID = pMaterialID;
	}

	public String getPMaterialNo() {
		return PMaterialNo;
	}

	public void setPMaterialNo(String pMaterialNo) {
		PMaterialNo = pMaterialNo;
	}

	public String getPMaterialName() {
		return PMaterialName;
	}

	public void setPMaterialName(String pMaterialName) {
		PMaterialName = pMaterialName;
	}

	public String getPMaterialModel() {
		return PMaterialModel;
	}

	public void setPMaterialModel(String pMaterialModel) {
		PMaterialModel = pMaterialModel;
	}

	public int getSMaterialID() {
		return SMaterialID;
	}

	public void setSMaterialID(int sMaterialID) {
		SMaterialID = sMaterialID;
	}

	public String getSMaterialNo() {
		return SMaterialNo;
	}

	public void setSMaterialNo(String sMaterialNo) {
		SMaterialNo = sMaterialNo;
	}

	public String getSMaterialName() {
		return SMaterialName;
	}

	public void setSMaterialName(String sMaterialName) {
		SMaterialName = sMaterialName;
	}

	public String getSMaterialModel() {
		return SMaterialModel;
	}

	public void setSMaterialModel(String sMaterialModel) {
		SMaterialModel = sMaterialModel;
	}

	public Double getNumerator() {
		return Numerator;
	}

	public void setNumerator(Double numerator) {
		Numerator = numerator;
	}

	public Double getDenominator() {
		return Denominator;
	}

	public void setDenominator(Double denominator) {
		Denominator = denominator;
	}

	public Double getScrAprate() {
		return ScrAprate;
	}

	public void setScrAprate(Double scrAprate) {
		ScrAprate = scrAprate;
	}

	public int getPartPointID() {
		return PartPointID;
	}

	public void setPartPointID(int partPointID) {
		PartPointID = partPointID;
	}

	public int getUnitID() {
		return UnitID;
	}

	public void setUnitID(int unitID) {
		UnitID = unitID;
	}

	public String getUnitName() {
		return UnitName;
	}

	public void setUnitName(String unitName) {
		UnitName = unitName;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}
}
