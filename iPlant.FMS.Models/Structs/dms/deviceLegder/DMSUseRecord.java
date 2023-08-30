package com.mes.server.service.po.dms.deviceLegder;

import java.io.Serializable;
import java.util.DateTime;

/// <summary>
/// 备件使用记录
/// </summary>
public class DMSUseRecord implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/// <summary>
	/// 记录ID
	/// </summary>
	public long ID = 0;
 
	/// <summary>
	/// 型号ID
	/// </summary>
	public int ModelID = 0;

	public String ModelNo = "";
	public String ModelName = "";
	/// <summary>
	/// 台账ID
	/// </summary>
	public int LedgerID = 0;

	public String LedgerName = "";
	/// <summary>
	/// 台账编号
	/// </summary>
	public String LedgerNo = "";

	public int DSType = 0;

	/// <summary>
	/// 所属部门
	/// </summary>
	public int BusinessUnitID = 0;

	public String BusinessUnitName = "";
	/// <summary>
	/// 所属生产基地ID
	/// </summary>
	public int BaseID = 0;

	public String BaseName = "";
	/// <summary>
	/// 所属生产基地下的工厂ID
	/// </summary>
	public int FactoryID = 0;

	public String FactoryName = "";
	/// <summary>
	/// 车间ID
	/// </summary>
	public int WorkShopID = 0;

	public String WorkShopName = "";
	/// <summary>
	/// 产线ID
	/// </summary>
	public int LineID = 0;

	public String LineName = "";

	/// <summary>
	/// 设备ID
	/// </summary>
	public long EquipmentID = 0;
	/// <summary>
	/// 设备号
	/// </summary>
	public String EquipmentNo = "";
	/// <summary>
	/// 开始时刻
	/// </summary>
	public DateTime StartTime = DateTime.Now;
	/// <summary>
	/// 结束时刻
	/// </summary>
	public DateTime EndTime = DateTime.Now;
	/// <summary>
	/// 加工时长
	/// </summary>
	public int ProcessingMin = 0;
	/// <summary>
	/// 加工工件个数
	/// </summary>
	public double ProcessingPartsNum = 0;

	/// <summary>
	/// 使用中1 或使用结束0
	/// </summary>
	public int Used = 0;

	public DMSUseRecord() {
	}

}
