package com.mes.server.service.po.dms.deviceLegder;

import java.io.Serializable;
import java.util.DateTime;

/// <summary>
/// 设备位置   待完善
/// </summary>
public class DMSWorkShopPosition implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/// <summary>
	/// 设备位置ID
	/// </summary>
	public long ID;
	/// <summary>
	/// 基地ID
	/// </summary>
	public int BaseID;
	/// <summary>
	/// 工厂ID
	/// </summary>
	public int FactoryID;
	/// <summary>
	/// 车间ID
	/// </summary>
	public int WorkShopID;
	/// <summary>
	/// 位置点
	/// </summary>
	public Double[] PositionPoint;
	/// <summary>
	/// 位置用度
	/// </summary>
	public String PositionExtend;
	/// <summary>
	/// 录入人
	/// </summary>
	public long OperatorID;
	/// <summary>
	/// 录入时刻
	/// </summary>
	public DateTime OperateTime;

	public DMSWorkShopPosition() {

	}

	public long ID {
		return ID;
	}

	public void setID(long iD) {
		ID = iD;
	}

	public int getBaseID() {
		return BaseID;
	}

	public void setBaseID(int baseID) {
		BaseID = baseID;
	}

	public int getFactoryID() {
		return FactoryID;
	}

	public void setFactoryID(int factoryID) {
		FactoryID = factoryID;
	}

	public int getWorkShopID() {
		return WorkShopID;
	}

	public void setWorkShopID(int workShopID) {
		WorkShopID = workShopID;
	}

	public Double[] getPositionPoint() {
		return PositionPoint;
	}

	public void setPositionPoint(Double[] positionPoint) {
		PositionPoint = positionPoint;
	}

	public String getPositionExtend() {
		return PositionExtend;
	}

	public void setPositionExtend(String positionExtend) {
		PositionExtend = positionExtend;
	}

	public long getOperatorID() {
		return OperatorID;
	}

	public void setOperatorID(long operatorID) {
		OperatorID = operatorID;
	}

	public DateTime getOperateTime() {
		return OperateTime;
	}

	public void setOperateTime(DateTime operateTime) {
		OperateTime = operateTime;
	}
}
