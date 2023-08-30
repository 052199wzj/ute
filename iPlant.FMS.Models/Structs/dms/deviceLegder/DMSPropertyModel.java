package com.mes.server.service.po.dms.deviceLegder;

import java.io.Serializable;
import java.util.DateTime;

/// <summary>
/// 设备属性
/// </summary>
public class DMSPropertyModel implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/// <summary>
	/// 主键ID 无意义
	/// </summary>
	public int ID;

	/// <summary>
	/// 供应商设备型号编码 或 系统版本 或控制器型号编码
	/// </summary>
	public String PropertyNo = "";
	/// <summary>
	/// 供应商ID 或 系统ID 或 控制器ID
	/// </summary>
	public int PropertyID = 0;
	/// <summary>
	/// 供应商名称 或 系统名称 或 控制器名称
	/// </summary>
	public String PropertyName = "";

	/// <summary>
	/// 操作员ID
	/// </summary>
	public int OperatorID = 0;

	public String OperatorName = "";

	/// <summary>
	/// 操作时间
	/// </summary>
	public DateTime OperateTime = DateTime.Now;
	/// <summary>
	/// 是否激活： 1为激活 0为禁用
	/// </summary>
	public int Active = 0;

	/// <summary>
	/// 设备或备件：1为设备，2为备件
	/// </summary>
	public int DSType = 1;

	/// <summary>
	/// 设备属性
	/// </summary>
	public int DevicePropertyType = 0;

	public DMSPropertyModel() {
		PropertyNo = "";
		PropertyName = "";
		OperateTime = DateTime.Now;
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getPropertyNo() {
		return PropertyNo;
	}

	public void setPropertyNo(String propertyNo) {
		PropertyNo = propertyNo;
	}

	public int getPropertyID() {
		return PropertyID;
	}

	public void setPropertyID(int propertyID) {
		PropertyID = propertyID;
	}

	public String getPropertyName() {
		return PropertyName;
	}

	public void setPropertyName(String propertyName) {
		PropertyName = propertyName;
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

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public int getDSType() {
		return DSType;
	}

	public void setDSType(int dSType) {
		DSType = dSType;
	}

	public int getDevicePropertyType() {
		return DevicePropertyType;
	}

	public void setDevicePropertyType(int devicePropertyType) {
		DevicePropertyType = devicePropertyType;
	}
}
