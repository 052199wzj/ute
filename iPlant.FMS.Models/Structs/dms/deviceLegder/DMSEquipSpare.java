package com.mes.server.service.po.dms.deviceLegder;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

/// <summary>
/// 设备可装备件类型信息
/// </summary>
public class DMSEquipSpare implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/// <summary>
	/// 设备型号对应备件ID
	/// </summary>
	public int ID = 0;
	/// <summary>
	/// 设备对应备件名称 包含位置信息（如：左侧电主轴） 同设备型号此名称不重复
	/// </summary>
	public String DeviceSpareName = "";
	/// <summary>
	/// 设备型号ID
	/// </summary>
	public int DeviceModelID = 0;

	public String DeviceModelNo = "";

	public String DeviceModelName = "";
	/// <summary>
	/// 备件型号ID
	/// </summary>
	public int SpareModelID = 0;

	public String SpareModelNo = "";

	public String SpareModelName = "";
	/// <summary>
	/// 设备所需此备件数量
	/// </summary>
	public int EquipNum = 0;
	/// <summary>
	/// 可选备件型号列表
	/// </summary>
	public List<Int32> EquipOptions = new List<Int32>();
	/// <summary>
	/// 录入人
	/// </summary>
	public int CreatorID = 0;

	public String CreatorName = "";
	/// <summary>
	/// 录入时刻
	/// </summary>
	public DateTime CreateTime = DateTime.Now;

	/// <summary>
	/// 编辑人
	/// </summary>
	public int EditorID = 0;

	public String EditorName = "";
	/// <summary>
	/// 编辑时刻
	/// </summary>
	public DateTime EditTime = DateTime.Now;
	/// <summary>
	/// 状态 激活/禁用
	/// </summary>
	public int Active = 0;

	public DMSEquipSpare() {

	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getDeviceSpareName() {
		return DeviceSpareName;
	}

	public void setDeviceSpareName(String deviceSpareName) {
		DeviceSpareName = deviceSpareName;
	}

	public int getDeviceModelID() {
		return DeviceModelID;
	}

	public void setDeviceModelID(int deviceModelID) {
		DeviceModelID = deviceModelID;
	}

	public int getSpareModelID() {
		return SpareModelID;
	}

	public void setSpareModelID(int spareModelID) {
		SpareModelID = spareModelID;
	}

	public int getEquipNum() {
		return EquipNum;
	}

	public void setEquipNum(int equipNum) {
		EquipNum = equipNum;
	}

	public List<Int32> getEquipOptions() {
		return EquipOptions;
	}

	public void setEquipOptions(List<Int32> equipOptions) {
		EquipOptions = equipOptions;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}
}
