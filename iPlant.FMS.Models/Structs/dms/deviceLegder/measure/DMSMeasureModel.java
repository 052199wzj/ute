package com.mes.server.service.po.dms.deviceLegder.measure;

import java.io.Serializable;
import java.util.DateTime;

/**
 * 量具基本信息表
 */
public class DMSMeasureModel implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 量具型号ID
	 */
	public int ModelID = 0;
	/**
	 * 量具型号编码
	 */
	public String ModelNo = "";

	public String ModelName = "";

	/**
	 * 量具加工类型
	 */
	public int WorkType = 0;

	/**
	 * 量具加工类型
	 */
	public String WorkTypeName = "";

	/**
	 * 型号属性ID
	 */
	public int SupplierID = 0;
	/**
	 * 供应商ID
	 */
	public String SupplierName = "";
	/**
	 * 供应商型号
	 */

	public String SupplierModelNo = "";

	/**
	 * 量具价值
	 */
	public double Cost = 0;
	/**
	 * 量具寿命
	 */
	public double Life = 0;

	/**
	 * 量程范围
	 */
	public String MeasureRange = "";

	/**
	 * 精准度
	 */
	public String Accuracy = "";

	/**
	 * 允许误差
	 */
	public String Mistake = "";

	/**
	 * 环境
	 */
	public String Environment = "";

	/**
	 * 校准等级
	 */
	public int CalibrationLevel = 0;

	public String CalibrationLevelCode = "";

	public double CalibrationCycle = 0;

	/**
	 * 校准依据
	 */
	public String CalibrationBasis = "";

	public int EditorID = 0;

	public String EditorName = "";

	public DateTime EditTime = DateTime.Now;

	public int CreatorID = 0;

	public String CreatorName = "";

	public DateTime CreateTime = DateTime.Now;

	public int Active = 0;

	public DMSMeasureModel() {
	}

	public int getModelID() {
		return ModelID;
	}

	public void setModelID(int modelID) {
		ModelID = modelID;
	}

	public String getModelNo() {
		return ModelNo;
	}

	public void setModelNo(String modelNo) {
		ModelNo = modelNo;
	}

	public String getModelName() {
		return ModelName;
	}

	public void setModelName(String modelName) {
		ModelName = modelName;
	}

	public int getWorkType() {
		return WorkType;
	}

	public void setWorkType(int workType) {
		WorkType = workType;
	}

	public String getWorkTypeName() {
		return WorkTypeName;
	}

	public void setWorkTypeName(String workTypeName) {
		WorkTypeName = workTypeName;
	}

 

	public String getSupplierName() {
		return SupplierName;
	}

	public void setSupplierName(String supplierName) {
		SupplierName = supplierName;
	}

	public String getSupplierModelNo() {
		return SupplierModelNo;
	}

	public void setSupplierModelNo(String supplierModelNo) {
		SupplierModelNo = supplierModelNo;
	}

	public double getCost() {
		return Cost;
	}

	public void setCost(double cost) {
		Cost = cost;
	}

	public double getLife() {
		return Life;
	}

	public void setLife(double life) {
		Life = life;
	}

	public String getMeasureRange() {
		return MeasureRange;
	}

	public void setMeasureRange(String measureRange) {
		MeasureRange = measureRange;
	}

	public String getAccuracy() {
		return Accuracy;
	}

	public void setAccuracy(String accuracy) {
		Accuracy = accuracy;
	}

	public String getMistake() {
		return Mistake;
	}

	public void setMistake(String mistake) {
		Mistake = mistake;
	}

	public String getEnvironment() {
		return Environment;
	}

	public void setEnvironment(String environment) {
		Environment = environment;
	}

	public int getCalibrationLevel() {
		return CalibrationLevel;
	}

	public void setCalibrationLevel(int calibrationLevel) {
		CalibrationLevel = calibrationLevel;
	}
 

	public double getCalibrationCycle() {
		return CalibrationCycle;
	}

	public void setCalibrationCycle(double calibrationCycle) {
		CalibrationCycle = calibrationCycle;
	}

	public String getCalibrationBasis() {
		return CalibrationBasis;
	}

	public void setCalibrationBasis(String calibrationBasis) {
		CalibrationBasis = calibrationBasis;
	}

	public int getEditorID() {
		return EditorID;
	}

	public void setEditorID(int editorID) {
		EditorID = editorID;
	}

	public String getEditorName() {
		return EditorName;
	}

	public void setEditorName(String editorName) {
		EditorName = editorName;
	}

	public DateTime getEditTime() {
		return EditTime;
	}

	public void setEditTime(DateTime editTime) {
		EditTime = editTime;
	}

	public int getCreatorID() {
		return CreatorID;
	}

	public void setCreatorID(int creatorID) {
		CreatorID = creatorID;
	}

	public String getCreatorName() {
		return CreatorName;
	}

	public void setCreatorName(String creatorName) {
		CreatorName = creatorName;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public String getCalibrationLevelCode() {
		return CalibrationLevelCode;
	}

	public void setCalibrationLevelCode(String calibrationLevelCode) {
		CalibrationLevelCode = calibrationLevelCode;
	}

	public int getSupplierID() {
		return SupplierID;
	}

	public void setSupplierID(int supplierID) {
		SupplierID = supplierID;
	}

}
