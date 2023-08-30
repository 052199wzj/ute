package com.mes.server.service.po.erp;

import java.io.Serializable;
import java.util.DateTime;

/// <summary>
/// 收料通知单
/// </summary>

public class ERPPOInstock implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public int FInterID;// 通知单内码

	public String FBillNo;// 通知单号

	public DateTime FDate = DateTime.Now;// 单据日期

	public String FFetchAdd;// 交货地点

	public int FTranType;// 单据类型:72-收料通知，73-退料通知,702-采购检验申请单

	public int FCancellation;// 作废：0：未作废 1：作废

	public int FStatus;// 状态：0-未审核，1-已审核，2-部分关闭，3-全部关闭

	public String FSourceBillNo;// 源单单号

	public int FSourceEntryID;// 原分录号

	public int FSourceInterId;// 源单内码

	public int FSourceTranType;// 源单类型

	public int FStockID;// 仓库

	public int FUnitID;// 单位内码

	public String FBatchNo;// 批次

	public int FEntryID;// 分录号

	public int FItemID;// 物料ID

	public String FItemNo;// 物料编码

	public String FItemName;// 物料名称

	public String FOrderBillNo;// 订单单号

	public int FOrderEntryID;// 订单分录

	public int FOrderInterID;// 订单内码

	public float FQty;// 通知数量

	public ERPPOInstock() {
		FBillNo = "";
		FSourceBillNo = "";
		FBatchNo = "";
		FItemNo = "";
		FItemName = "";
		FOrderBillNo = "";
		FDate.set(2000, 0, 1);
	}

	public int getFInterID() {
		return FInterID;
	}

	public void setFInterID(int fInterID) {
		FInterID = fInterID;
	}

	public String getFBillNo() {
		return FBillNo;
	}

	public void setFBillNo(String fBillNo) {
		FBillNo = fBillNo;
	}

	public DateTime getFDate() {
		return FDate;
	}

	public void setFDate(DateTime fDate) {
		FDate = fDate;
	}

	public String getFFetchAdd() {
		return FFetchAdd;
	}

	public void setFFetchAdd(String fFetchAdd) {
		FFetchAdd = fFetchAdd;
	}

	public int getFTranType() {
		return FTranType;
	}

	public void setFTranType(int fTranType) {
		FTranType = fTranType;
	}

	public int getFCancellation() {
		return FCancellation;
	}

	public void setFCancellation(int fCancellation) {
		FCancellation = fCancellation;
	}

	public int getFStatus() {
		return FStatus;
	}

	public void setFStatus(int fStatus) {
		FStatus = fStatus;
	}

	public String getFSourceBillNo() {
		return FSourceBillNo;
	}

	public void setFSourceBillNo(String fSourceBillNo) {
		FSourceBillNo = fSourceBillNo;
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

	public int getFStockID() {
		return FStockID;
	}

	public void setFStockID(int fStockID) {
		FStockID = fStockID;
	}

	public int getFUnitID() {
		return FUnitID;
	}

	public void setFUnitID(int fUnitID) {
		FUnitID = fUnitID;
	}

	public String getFBatchNo() {
		return FBatchNo;
	}

	public void setFBatchNo(String fBatchNo) {
		FBatchNo = fBatchNo;
	}

	public int getFEntryID() {
		return FEntryID;
	}

	public void setFEntryID(int fEntryID) {
		FEntryID = fEntryID;
	}

	public int getFItemID() {
		return FItemID;
	}

	public void setFItemID(int fItemID) {
		FItemID = fItemID;
	}

	public String getFItemNo() {
		return FItemNo;
	}

	public void setFItemNo(String fItemNo) {
		FItemNo = fItemNo;
	}

	public String getFItemName() {
		return FItemName;
	}

	public void setFItemName(String fItemName) {
		FItemName = fItemName;
	}

	public String getFOrderBillNo() {
		return FOrderBillNo;
	}

	public void setFOrderBillNo(String fOrderBillNo) {
		FOrderBillNo = fOrderBillNo;
	}

	public int getFOrderEntryID() {
		return FOrderEntryID;
	}

	public void setFOrderEntryID(int fOrderEntryID) {
		FOrderEntryID = fOrderEntryID;
	}

	public int getFOrderInterID() {
		return FOrderInterID;
	}

	public void setFOrderInterID(int fOrderInterID) {
		FOrderInterID = fOrderInterID;
	}

	public float getFQty() {
		return FQty;
	}

	public void setFQty(float fQty) {
		FQty = fQty;
	}

}
