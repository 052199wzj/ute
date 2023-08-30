package com.mes.server.service.po.dms.deviceLegder.measure;

import java.io.Serializable;
import java.util.DateTime;

/// <summary>
/// 量具台账信息
/// </summary>
public class DMSMeasureLedger extends DMSMeasureModel implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/// <summary>
	/// 量具ID
	/// </summary>
	public int ID = 0;

	/// <summary>
	/// 量具编号
	/// </summary>
	public String Code = "";

	/// <summary>
	/// 量具名称 型号名称
	/// </summary>
	public String Name = "";

	/**
	 * 出厂编码
	 */
	public String ManufacturerNo = "";

	/**
	 * 固定资产编码
	 */
	public String AssetsNo = "";

	/**
	 * 设备ID
	 */
	public int DeviceID = 0;

	/**
	 * 设备编号
	 */
	public String DeviceNo = "";

	public String DeviceName = "";

	/**
	 * 设备型号
	 */
	public String DeviceModelNo = "";

	/**
	 * 规格要求
	 */
	public String ModelDemand = "";

	/**
	 * 校准单位
	 */
	public String CalibrationManufacturer = "";

	/**
	 * 校准责任人
	 */
	public int CalibrationPersonID = 0;

	/**
	 * 校准责任人
	 */
	public String CalibrationPersonName = "";

	/**
	 * 校准日期
	 */
	public DateTime CalibrationDate = DateTime.Now;

	/**
	 * 校准日期
	 */
	public DateTime NextCalibrationDate = DateTime.Now;

	/**
	 * 校准证书编号
	 */
	public String CalibrationNo = "";

	/**
	 * 存放地点
	 */
	public String StorageLocation = "";

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

	public int PartID = 0;

	public String PartName = "";

	public String PartNo = "";

	/**
	 * 责任人
	 */
	public int OwnerID = 0;

	public String OwnerName = "";

	/**
	 * 借用人
	 */
	public int BorrowerID = 0;

	public String BorrowerName = "";

	public DateTime BorrowTime = DateTime.Now;

	/**
	 * 投入使用日期
	 */
	public DateTime FirstTime = DateTime.Now;

	/// <summary>
	/// 设备使用状态 0：就绪（默认值 加入台账时为就绪状态） 1：使用 2：闲置 3：维修 4：保养 5：报废 6：封存
	/// </summary>
	public int Status;

	public String Remark = "";

	public DMSMeasureLedger() {

	}

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

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public String getManufacturerNo() {
		return ManufacturerNo;
	}

	public void setManufacturerNo(String manufacturerNo) {
		ManufacturerNo = manufacturerNo;
	}

	public int getDeviceID() {
		return DeviceID;
	}

	public void setDeviceID(int deviceID) {
		DeviceID = deviceID;
	}

	public String getDeviceNo() {
		return DeviceNo;
	}

	public void setDeviceNo(String deviceNo) {
		DeviceNo = deviceNo;
	}

	public String getDeviceName() {
		return DeviceName;
	}

	public void setDeviceName(String deviceName) {
		DeviceName = deviceName;
	}

	public String getDeviceModelNo() {
		return DeviceModelNo;
	}

	public void setDeviceModelNo(String deviceModelNo) {
		DeviceModelNo = deviceModelNo;
	}

	public String getModelDemand() {
		return ModelDemand;
	}

	public void setModelDemand(String modelDemand) {
		ModelDemand = modelDemand;
	}

	public String getCalibrationManufacturer() {
		return CalibrationManufacturer;
	}

	public void setCalibrationManufacturer(String calibrationManufacturer) {
		CalibrationManufacturer = calibrationManufacturer;
	}

	public int getCalibrationPersonID() {
		return CalibrationPersonID;
	}

	public void setCalibrationPersonID(int calibrationPersonID) {
		CalibrationPersonID = calibrationPersonID;
	}

	public String getCalibrationPersonName() {
		return CalibrationPersonName;
	}

	public void setCalibrationPersonName(String calibrationPersonName) {
		CalibrationPersonName = calibrationPersonName;
	}

	public DateTime getCalibrationDate() {
		return CalibrationDate;
	}

	public void setCalibrationDate(DateTime calibrationDate) {
		CalibrationDate = calibrationDate;
	}

	public String getCalibrationNo() {
		return CalibrationNo;
	}

	public void setCalibrationNo(String calibrationNo) {
		CalibrationNo = calibrationNo;
	}

	public String getStorageLocation() {
		return StorageLocation;
	}

	public void setStorageLocation(String storageLocation) {
		StorageLocation = storageLocation;
	}

	public int getWorkShopID() {
		return WorkShopID;
	}

	public void setWorkShopID(int workShopID) {
		WorkShopID = workShopID;
	}

	public String getWorkShopName() {
		return WorkShopName;
	}

	public void setWorkShopName(String workShopName) {
		WorkShopName = workShopName;
	}

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
	}

	public String getLineName() {
		return LineName;
	}

	public void setLineName(String lineName) {
		LineName = lineName;
	}

	public int getPartID() {
		return PartID;
	}

	public void setPartID(int partID) {
		PartID = partID;
	}

	public String getPartName() {
		return PartName;
	}

	public void setPartName(String partName) {
		PartName = partName;
	}

	public String getPartNo() {
		return PartNo;
	}

	public void setPartNo(String partNo) {
		PartNo = partNo;
	}

	public int getOwnerID() {
		return OwnerID;
	}

	public void setOwnerID(int ownerID) {
		OwnerID = ownerID;
	}

	public String getOwnerName() {
		return OwnerName;
	}

	public void setOwnerName(String ownerName) {
		OwnerName = ownerName;
	}

	public int getBorrowerID() {
		return BorrowerID;
	}

	public void setBorrowerID(int borrowerID) {
		BorrowerID = borrowerID;
	}

	public String getBorrowerName() {
		return BorrowerName;
	}

	public void setBorrowerName(String borrowerName) {
		BorrowerName = borrowerName;
	}

	public DateTime getBorrowTime() {
		return BorrowTime;
	}

	public void setBorrowTime(DateTime borrowTime) {
		BorrowTime = borrowTime;
	}

	public DateTime getFirstTime() {
		return FirstTime;
	}

	public void setFirstTime(DateTime firstTime) {
		FirstTime = firstTime;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public String getAssetsNo() {
		return AssetsNo;
	}

	public void setAssetsNo(String assetsNo) {
		AssetsNo = assetsNo;
	}

	public DateTime getNextCalibrationDate() {
		return NextCalibrationDate;
	}

	public void setNextCalibrationDate(DateTime nextCalibrationDate) {
		NextCalibrationDate = nextCalibrationDate;
	}

	public String getRemark() {
		return Remark;
	}

	public void setRemark(String remark) {
		Remark = remark;
	}

}
