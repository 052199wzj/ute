package com.mes.server.service.po.dms.deviceLegder;

import java.io.Serializable;
import java.util.DateTime;

import com.mes.server.service.mesenum.dms.DMSAssetTypes;

/// <summary>
/// 固定资产
/// </summary>
public class DMSFixedAssets implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/// <summary>
	/// 固定资产ID
	/// </summary>
	public int ID = 0;
	/// <summary>
	/// 固定资产编码
	/// </summary>
	public String AssetNo = "";

	public String Name = "";

	public String Remark = "";
	/// <summary>
	/// 固定资产类型
	/// </summary>
	public int AssetType = 0;

	public String AssetTypeName = "";

	/// <summary>
	/// 资产净值
	/// </summary>
	public double NetValue = 0;
	/// <summary>
	/// 资产残值
	/// </summary>
	public double ScrapValue = 0;
	/// <summary>
	/// 资产采购价
	/// </summary>
	public double InitialValue = 0;

	public int OperatorID = 0;

	public String OperatorName = "";

	public DateTime OperateTime = DateTime.Now;

	public int Active = 0;

	public DMSFixedAssets() {
		AssetType = (int)DMSAssetTypes.Default();
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getAssetNo() {
		return AssetNo;
	}

	public void setAssetNo(String assetNo) {
		AssetNo = assetNo;
	}

	public int getAssetType() {
		return AssetType;
	}

	public void setAssetType(int assetType) {
		AssetType = assetType;
	}

	public double getNetValue() {
		return NetValue;
	}

	public void setNetValue(double netValue) {
		NetValue = netValue;
	}

	public double getScrapValue() {
		return ScrapValue;
	}

	public void setScrapValue(double scrapValue) {
		ScrapValue = scrapValue;
	}

	public double getInitialValue() {
		return InitialValue;
	}

	public void setInitialValue(double initialValue) {
		InitialValue = initialValue;
	}

	public int getOperatorID() {
		return OperatorID;
	}

	public void setOperatorID(int operatorID) {
		OperatorID = operatorID;
	}

	public DateTime getOperateTime() {
		return OperateTime;
	}

	public void setOperateTime(DateTime operateTime) {
		OperateTime = operateTime;
	}
}
