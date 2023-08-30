package com.mes.server.service.po.dms.deviceLegder.measure;

import java.io.Serializable;
import java.util.DateTime;

/// <summary>
/// 设备基本信息表
/// </summary>
public class DMSCalibrationLevel implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public String Code = "";

	/**
	 * 校准单位
	 */
	public int CalibrationUnit = 1;

	public String CalibrationUnitText = "月";

	public double CalibrationCycle = 12;

	public int EditorID = 0;

	public String EditorName = "";

	public DateTime EditTime = DateTime.Now;

	public int CreatorID = 0;

	public String CreatorName = "";

	public DateTime CreateTime = DateTime.Now;

	public int Active = 0;

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getCode() {
		return Code;
	}

	public void setCode(String code) {
		Code = code;
	}

	public int getCalibrationUnit() {
		return CalibrationUnit;
	}

	public void setCalibrationUnit(int calibrationUnit) {
		CalibrationUnit = calibrationUnit;
	}

	public String getCalibrationUnitText() {
		return CalibrationUnitText;
	}

	public void setCalibrationUnitText(String calibrationUnitText) {
		CalibrationUnitText = calibrationUnitText;
	}

	public double getCalibrationCycle() {
		return CalibrationCycle;
	}

	public void setCalibrationCycle(double calibrationCycle) {
		CalibrationCycle = calibrationCycle;
	}

}
