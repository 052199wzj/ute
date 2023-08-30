package com.mes.server.service.po.dms.deviceLegder;

import java.io.Serializable;
import java.util.DateTime;

/// <summary>
/// 设备位置  待完善
/// </summary>
public class DMSDevicePosition implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/// <summary>
	/// 设备位置ID
	/// </summary>
	public int ID;
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
	/// 设备台账ID
	/// </summary>
	public int DeviceLedgerID;
	/// <summary>
	/// 产线ID
	/// </summary>
	public int LineID;
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
	public int OperatorID;
	public String OperatorName = "";
	/// <summary>
	/// 录入时刻
	/// </summary>
	public DateTime OperateTime;

	public DMSDevicePosition() {
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
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

	public int getDeviceLedgerID() {
		return DeviceLedgerID;
	}

	public void setDeviceLedgerID(int deviceLedgerID) {
		DeviceLedgerID = deviceLedgerID;
	}

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
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

	public DateTime getOperateTime() {
		return OperateTime;
	}

	public void setOperateTime(DateTime operateTime) {
		OperateTime = operateTime;
	}

	public int getOperatorID() {
		return OperatorID;
	}

	public void setOperatorID(int operatorID) {
		OperatorID = operatorID;
	}

}
