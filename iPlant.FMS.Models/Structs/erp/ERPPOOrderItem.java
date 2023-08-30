package com.mes.server.service.po.erp;

import java.io.Serializable;

public class ERPPOOrderItem implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ERPPOOrderItem() {
		// TODO Auto-generated constructor stub
	}

	public float FAllAmount;// 价税合计

	public float FAmtDiscount;// 折扣额

	public float FAuxPriceDiscount;// 实际含税单价

	public int FAuxPropID;// 辅助属性

	public float FAuxTaxPrice;// 含税单价

	public float FCheckAmount;// 累计核销金额(本位币)

	public float FDescount;// 折扣额

	public int FDetailID;// 分录内码

	public int FEntrySelfP0253;// 工作号

	public int FMapID;// 对应代码

	public int FMrpAutoClosed;// MRP自动关闭标志

	public String FMtoNo;// 计划跟踪号

	public float FPayApplyAmount_Commit;// 付款申请关联金额（本位币）

	public float FPayApplyAmountFor_Commit;// 付款申请关联金额

	public String FPlanMode;// 计划模式

	public float FPriceDiscount;// 实际含税单价（本位币）

	public float FQtyInvoice;// 基本单位开票数量

	public float FQtyInvoiceBase;// 基本计量单位开票数量

	public float FReceiveAmount_Commit;// 付款关联金额

	public float FReceiveAmountFor_Commit;// 付款关联金额（本位币）

	public float FSecCoefficient;// 换算率

	public float FSecInvoiceQty;// 辅助单位开票数量

	public float FSecQty;// 辅助数量

	public float FSecStockQty;// 辅助单位入库数量

	public int FSourceEntryID;// 原分录号

	public int FSourceInterId;// 源单内码

	public int FSourceTranType;// 源单类型

	public int FSProducingAreaID;// 源产地

	public float FStockQty;// 入库数量

	public float FTax;// 税金（本位币）

	public float FTaxAmount;// 税额

	public float FTaxPrice;// 含税单价（本位币）

	public float FTaxRate;// 折扣率

	public int FUnitID;// 单位内码

	public String FSourceBillNo;// 源单单号

	public float FSecCommitQty;// 辅助执行数量

	public float FQty;// 订货数量

	public float FPrice;// 单价

	public String FNote;// 备注

	public int FMRPLockFlag;// 锁单标记

	public int FMrpClosed;// 行业务关闭标志

	public String FMapNumber;// 对应代码

	public String FMapName;// 对应名称

	public int FItemID;// 物料内码

	public int FInterID;// 采购订单内码

	public int FEntryID;// 分录号
	//
	// public DateTime DATETIME;//交货日期

	public int FContractInterID;// 合同内码

	public int FContractEntryID;// 合同分录

	public String FContractBillNo;// 合同单号

	public float FCommitQty;// 到货数量

	public float FCess;// 税率

	public String FBrNo;// 公司机构类码

	public float FAuxStockQty;// 辅助入库数量

	public float FAuxQtyInvoice;// 开票数量

	public float FAuxQty;// 辅助订货数量

	public float FAuxPrice;// 辅助单价

	public float FAuxCommitQty;// 辅助到货数量

	public float FAmount;// 金额

	public float getFAllAmount() {
		return FAllAmount;
	}

	public void setFAllAmount(float fAllAmount) {
		FAllAmount = fAllAmount;
	}

	public float getFAmtDiscount() {
		return FAmtDiscount;
	}

	public void setFAmtDiscount(float fAmtDiscount) {
		FAmtDiscount = fAmtDiscount;
	}

	public float getFAuxPriceDiscount() {
		return FAuxPriceDiscount;
	}

	public void setFAuxPriceDiscount(float fAuxPriceDiscount) {
		FAuxPriceDiscount = fAuxPriceDiscount;
	}

	public int getFAuxPropID() {
		return FAuxPropID;
	}

	public void setFAuxPropID(int fAuxPropID) {
		FAuxPropID = fAuxPropID;
	}

	public float getFAuxTaxPrice() {
		return FAuxTaxPrice;
	}

	public void setFAuxTaxPrice(float fAuxTaxPrice) {
		FAuxTaxPrice = fAuxTaxPrice;
	}

	public float getFCheckAmount() {
		return FCheckAmount;
	}

	public void setFCheckAmount(float fCheckAmount) {
		FCheckAmount = fCheckAmount;
	}

	public float getFDescount() {
		return FDescount;
	}

	public void setFDescount(float fDescount) {
		FDescount = fDescount;
	}

	public int getFDetailID() {
		return FDetailID;
	}

	public void setFDetailID(int fDetailID) {
		FDetailID = fDetailID;
	}

	public int getFEntrySelfP0253() {
		return FEntrySelfP0253;
	}

	public void setFEntrySelfP0253(int fEntrySelfP0253) {
		FEntrySelfP0253 = fEntrySelfP0253;
	}

	public int getFMapID() {
		return FMapID;
	}

	public void setFMapID(int fMapID) {
		FMapID = fMapID;
	}

	public int getFMrpAutoClosed() {
		return FMrpAutoClosed;
	}

	public void setFMrpAutoClosed(int fMrpAutoClosed) {
		FMrpAutoClosed = fMrpAutoClosed;
	}

	public String getFMtoNo() {
		return FMtoNo;
	}

	public void setFMtoNo(String fMtoNo) {
		FMtoNo = fMtoNo;
	}

	public float getFPayApplyAmount_Commit() {
		return FPayApplyAmount_Commit;
	}

	public void setFPayApplyAmount_Commit(float fPayApplyAmount_Commit) {
		FPayApplyAmount_Commit = fPayApplyAmount_Commit;
	}

	public float getFPayApplyAmountFor_Commit() {
		return FPayApplyAmountFor_Commit;
	}

	public void setFPayApplyAmountFor_Commit(float fPayApplyAmountFor_Commit) {
		FPayApplyAmountFor_Commit = fPayApplyAmountFor_Commit;
	}

	public String getFPlanMode() {
		return FPlanMode;
	}

	public void setFPlanMode(String fPlanMode) {
		FPlanMode = fPlanMode;
	}

	public float getFPriceDiscount() {
		return FPriceDiscount;
	}

	public void setFPriceDiscount(float fPriceDiscount) {
		FPriceDiscount = fPriceDiscount;
	}

	public float getFQtyInvoice() {
		return FQtyInvoice;
	}

	public void setFQtyInvoice(float fQtyInvoice) {
		FQtyInvoice = fQtyInvoice;
	}

	public float getFQtyInvoiceBase() {
		return FQtyInvoiceBase;
	}

	public void setFQtyInvoiceBase(float fQtyInvoiceBase) {
		FQtyInvoiceBase = fQtyInvoiceBase;
	}

	public float getFReceiveAmount_Commit() {
		return FReceiveAmount_Commit;
	}

	public void setFReceiveAmount_Commit(float fReceiveAmount_Commit) {
		FReceiveAmount_Commit = fReceiveAmount_Commit;
	}

	public float getFReceiveAmountFor_Commit() {
		return FReceiveAmountFor_Commit;
	}

	public void setFReceiveAmountFor_Commit(float fReceiveAmountFor_Commit) {
		FReceiveAmountFor_Commit = fReceiveAmountFor_Commit;
	}

	public float getFSecCoefficient() {
		return FSecCoefficient;
	}

	public void setFSecCoefficient(float fSecCoefficient) {
		FSecCoefficient = fSecCoefficient;
	}

	public float getFSecInvoiceQty() {
		return FSecInvoiceQty;
	}

	public void setFSecInvoiceQty(float fSecInvoiceQty) {
		FSecInvoiceQty = fSecInvoiceQty;
	}

	public float getFSecQty() {
		return FSecQty;
	}

	public void setFSecQty(float fSecQty) {
		FSecQty = fSecQty;
	}

	public float getFSecStockQty() {
		return FSecStockQty;
	}

	public void setFSecStockQty(float fSecStockQty) {
		FSecStockQty = fSecStockQty;
	}

	public int getFSourceEntryID() {
		return FSourceEntryID;
	}

	public void setFSourceEntryID(int fSourceEntryID) {
		FSourceEntryID = fSourceEntryID;
	}

	public int getFSourceInterId() {
		return FSourceInterId;
	}

	public void setFSourceInterId(int fSourceInterId) {
		FSourceInterId = fSourceInterId;
	}

	public int getFSourceTranType() {
		return FSourceTranType;
	}

	public void setFSourceTranType(int fSourceTranType) {
		FSourceTranType = fSourceTranType;
	}

	public int getFSProducingAreaID() {
		return FSProducingAreaID;
	}

	public void setFSProducingAreaID(int fSProducingAreaID) {
		FSProducingAreaID = fSProducingAreaID;
	}

	public float getFStockQty() {
		return FStockQty;
	}

	public void setFStockQty(float fStockQty) {
		FStockQty = fStockQty;
	}

	public float getFTax() {
		return FTax;
	}

	public void setFTax(float fTax) {
		FTax = fTax;
	}

	public float getFTaxAmount() {
		return FTaxAmount;
	}

	public void setFTaxAmount(float fTaxAmount) {
		FTaxAmount = fTaxAmount;
	}

	public float getFTaxPrice() {
		return FTaxPrice;
	}

	public void setFTaxPrice(float fTaxPrice) {
		FTaxPrice = fTaxPrice;
	}

	public float getFTaxRate() {
		return FTaxRate;
	}

	public void setFTaxRate(float fTaxRate) {
		FTaxRate = fTaxRate;
	}

	public int getFUnitID() {
		return FUnitID;
	}

	public void setFUnitID(int fUnitID) {
		FUnitID = fUnitID;
	}

	public String getFSourceBillNo() {
		return FSourceBillNo;
	}

	public void setFSourceBillNo(String fSourceBillNo) {
		FSourceBillNo = fSourceBillNo;
	}

	public float getFSecCommitQty() {
		return FSecCommitQty;
	}

	public void setFSecCommitQty(float fSecCommitQty) {
		FSecCommitQty = fSecCommitQty;
	}

	public float getFQty() {
		return FQty;
	}

	public void setFQty(float fQty) {
		FQty = fQty;
	}

	public float getFPrice() {
		return FPrice;
	}

	public void setFPrice(float fPrice) {
		FPrice = fPrice;
	}

	public String getFNote() {
		return FNote;
	}

	public void setFNote(String fNote) {
		FNote = fNote;
	}

	public int getFMRPLockFlag() {
		return FMRPLockFlag;
	}

	public void setFMRPLockFlag(int fMRPLockFlag) {
		FMRPLockFlag = fMRPLockFlag;
	}

	public int getFMrpClosed() {
		return FMrpClosed;
	}

	public void setFMrpClosed(int fMrpClosed) {
		FMrpClosed = fMrpClosed;
	}

	public String getFMapNumber() {
		return FMapNumber;
	}

	public void setFMapNumber(String fMapNumber) {
		FMapNumber = fMapNumber;
	}

	public String getFMapName() {
		return FMapName;
	}

	public void setFMapName(String fMapName) {
		FMapName = fMapName;
	}

	public int getFItemID() {
		return FItemID;
	}

	public void setFItemID(int fItemID) {
		FItemID = fItemID;
	}

	public int getFInterID() {
		return FInterID;
	}

	public void setFInterID(int fInterID) {
		FInterID = fInterID;
	}

	public int getFEntryID() {
		return FEntryID;
	}

	public void setFEntryID(int fEntryID) {
		FEntryID = fEntryID;
	}

	public int getFContractInterID() {
		return FContractInterID;
	}

	public void setFContractInterID(int fContractInterID) {
		FContractInterID = fContractInterID;
	}

	public int getFContractEntryID() {
		return FContractEntryID;
	}

	public void setFContractEntryID(int fContractEntryID) {
		FContractEntryID = fContractEntryID;
	}

	public String getFContractBillNo() {
		return FContractBillNo;
	}

	public void setFContractBillNo(String fContractBillNo) {
		FContractBillNo = fContractBillNo;
	}

	public float getFCommitQty() {
		return FCommitQty;
	}

	public void setFCommitQty(float fCommitQty) {
		FCommitQty = fCommitQty;
	}

	public float getFCess() {
		return FCess;
	}

	public void setFCess(float fCess) {
		FCess = fCess;
	}

	public String getFBrNo() {
		return FBrNo;
	}

	public void setFBrNo(String fBrNo) {
		FBrNo = fBrNo;
	}

	public float getFAuxStockQty() {
		return FAuxStockQty;
	}

	public void setFAuxStockQty(float fAuxStockQty) {
		FAuxStockQty = fAuxStockQty;
	}

	public float getFAuxQtyInvoice() {
		return FAuxQtyInvoice;
	}

	public void setFAuxQtyInvoice(float fAuxQtyInvoice) {
		FAuxQtyInvoice = fAuxQtyInvoice;
	}

	public float getFAuxQty() {
		return FAuxQty;
	}

	public void setFAuxQty(float fAuxQty) {
		FAuxQty = fAuxQty;
	}

	public float getFAuxPrice() {
		return FAuxPrice;
	}

	public void setFAuxPrice(float fAuxPrice) {
		FAuxPrice = fAuxPrice;
	}

	public float getFAuxCommitQty() {
		return FAuxCommitQty;
	}

	public void setFAuxCommitQty(float fAuxCommitQty) {
		FAuxCommitQty = fAuxCommitQty;
	}

	public float getFAmount() {
		return FAmount;
	}

	public void setFAmount(float fAmount) {
		FAmount = fAmount;
	}

}
