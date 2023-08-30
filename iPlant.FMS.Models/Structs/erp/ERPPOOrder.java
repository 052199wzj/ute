package com.mes.server.service.po.erp;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class ERPPOOrder implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ERPPOOrder() {
		// TODO Auto-generated constructor stub
	}

	public int FBillerID;// 制单人

	public int FCancellation;// 作废

	public String FChangeCauses;// 变更原因

	public DateTime FChangeDate;// 变更日期

	public String FChangeMark;// 变更标志:

	public String FConsignee;// 收货方

	public DateTime FDate;// 单据日期

	public String FDeliveryPlace;// 交货地点

	public DateTime FlastModyDate;// 最近修改日期

	public int FOrderAffirm;// 确认标志

	public String FPOOrdBillNo;// 分销订单号

	public int FPOStyle;// 采购方式

	public int FSelTranType;// 源单类型

	public DateTime FSettleDate = DateTime.Now;// 结算日期

	public int FSettleID;// 结算方式

	public int FStatus;// 状态

	public int FSupplyID;// 供应商内码

	public int FSysStatus;// 系统设置

	public float FTotalCostFor;// 订单金额

	public int FTranType;// 单据类型

	public String FValidaterName;// 确认人

	public String FVersionNo;// 版本号

	public int FInterID;// 采购订单内码

	public String FFetchAdd;// 交货地点

	public String FExplanation;// 摘要

	public int FCurrencyID;// 币别

	public int FCurCheckLevel;// 当前审核级别

	public DateTime FCheckDate;// 审核日期

	public String FBrNo;// 公司机构内码

	public int FBrID;// 制单机构

	public String FBillNo;// 采购订单号

	public List<ERPPOOrderItem> ERPPOOrderItemList = new List<ERPPOOrderItem>();

	public int getFBillerID() {
		return FBillerID;
	}

	public void setFBillerID(int fBillerID) {
		FBillerID = fBillerID;
	}

	public int getFCancellation() {
		return FCancellation;
	}

	public void setFCancellation(int fCancellation) {
		FCancellation = fCancellation;
	}

	public String getFChangeCauses() {
		return FChangeCauses;
	}

	public void setFChangeCauses(String fChangeCauses) {
		FChangeCauses = fChangeCauses;
	}

	public DateTime getFChangeDate() {
		return FChangeDate;
	}

	public void setFChangeDate(DateTime fChangeDate) {
		FChangeDate = fChangeDate;
	}

	public String getFChangeMark() {
		return FChangeMark;
	}

	public void setFChangeMark(String fChangeMark) {
		FChangeMark = fChangeMark;
	}

	public String getFConsignee() {
		return FConsignee;
	}

	public void setFConsignee(String fConsignee) {
		FConsignee = fConsignee;
	}

	public DateTime getFDate() {
		return FDate;
	}

	public void setFDate(DateTime fDate) {
		FDate = fDate;
	}

	public String getFDeliveryPlace() {
		return FDeliveryPlace;
	}

	public void setFDeliveryPlace(String fDeliveryPlace) {
		FDeliveryPlace = fDeliveryPlace;
	}

	public DateTime getFlastModyDate() {
		return FlastModyDate;
	}

	public void setFlastModyDate(DateTime flastModyDate) {
		FlastModyDate = flastModyDate;
	}

	public int getFOrderAffirm() {
		return FOrderAffirm;
	}

	public void setFOrderAffirm(int fOrderAffirm) {
		FOrderAffirm = fOrderAffirm;
	}

	public String getFPOOrdBillNo() {
		return FPOOrdBillNo;
	}

	public void setFPOOrdBillNo(String fPOOrdBillNo) {
		FPOOrdBillNo = fPOOrdBillNo;
	}

	public int getFPOStyle() {
		return FPOStyle;
	}

	public void setFPOStyle(int fPOStyle) {
		FPOStyle = fPOStyle;
	}

	public int getFSelTranType() {
		return FSelTranType;
	}

	public void setFSelTranType(int fSelTranType) {
		FSelTranType = fSelTranType;
	}

	public DateTime getFSettleDate() {
		return FSettleDate;
	}

	public void setFSettleDate(DateTime fSettleDate) {
		FSettleDate = fSettleDate;
	}

	public int getFSettleID() {
		return FSettleID;
	}

	public void setFSettleID(int fSettleID) {
		FSettleID = fSettleID;
	}

	public int getFStatus() {
		return FStatus;
	}

	public void setFStatus(int fStatus) {
		FStatus = fStatus;
	}

	public int getFSupplyID() {
		return FSupplyID;
	}

	public void setFSupplyID(int fSupplyID) {
		FSupplyID = fSupplyID;
	}

	public int getFSysStatus() {
		return FSysStatus;
	}

	public void setFSysStatus(int fSysStatus) {
		FSysStatus = fSysStatus;
	}

	public float getFTotalCostFor() {
		return FTotalCostFor;
	}

	public void setFTotalCostFor(float fTotalCostFor) {
		FTotalCostFor = fTotalCostFor;
	}

	public int getFTranType() {
		return FTranType;
	}

	public void setFTranType(int fTranType) {
		FTranType = fTranType;
	}

	public String getFValidaterName() {
		return FValidaterName;
	}

	public void setFValidaterName(String fValidaterName) {
		FValidaterName = fValidaterName;
	}

	public String getFVersionNo() {
		return FVersionNo;
	}

	public void setFVersionNo(String fVersionNo) {
		FVersionNo = fVersionNo;
	}

	public int getFInterID() {
		return FInterID;
	}

	public void setFInterID(int fInterID) {
		FInterID = fInterID;
	}

	public String getFFetchAdd() {
		return FFetchAdd;
	}

	public void setFFetchAdd(String fFetchAdd) {
		FFetchAdd = fFetchAdd;
	}

	public String getFExplanation() {
		return FExplanation;
	}

	public void setFExplanation(String fExplanation) {
		FExplanation = fExplanation;
	}

	public int getFCurrencyID() {
		return FCurrencyID;
	}

	public void setFCurrencyID(int fCurrencyID) {
		FCurrencyID = fCurrencyID;
	}

	public int getFCurCheckLevel() {
		return FCurCheckLevel;
	}

	public void setFCurCheckLevel(int fCurCheckLevel) {
		FCurCheckLevel = fCurCheckLevel;
	}

	public DateTime getFCheckDate() {
		return FCheckDate;
	}

	public void setFCheckDate(DateTime fCheckDate) {
		FCheckDate = fCheckDate;
	}

	public String getFBrNo() {
		return FBrNo;
	}

	public void setFBrNo(String fBrNo) {
		FBrNo = fBrNo;
	}

	public int getFBrID() {
		return FBrID;
	}

	public void setFBrID(int fBrID) {
		FBrID = fBrID;
	}

	public String getFBillNo() {
		return FBillNo;
	}

	public void setFBillNo(String fBillNo) {
		FBillNo = fBillNo;
	}

	public List<ERPPOOrderItem> getERPPOOrderItemList() {
		return ERPPOOrderItemList;
	}

	public void setERPPOOrderItemList(List<ERPPOOrderItem> eRPPOOrderItemList) {
		ERPPOOrderItemList = eRPPOOrderItemList;
	}

}