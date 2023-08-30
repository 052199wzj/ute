package com.mes.server.service.po.mrp;

import java.io.Serializable;
import java.util.DateTime;

public class MRPMaterial implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID = 0; // ID

	public int MRPID = 0; // MRPID

	public int GradeID = 0; // 层级ID

	public int MaterialID = 0; // 物料ID

	public String MaterialNo = ""; // 物料编码

	public String MaterialName = ""; // 物料名称

	public float BadRatio = 0.0f; // 损耗率

	public float DemandFQTY = 0.0f; // 需求量

	public float AvailableFQTY = 0.0f; // 可用量

	public float MarginFQTY = 0.0f; // 净需求量

	public float StockFQTY = 0.0f; // 当前库存量

	public float OnBuyFQTY = 0.0f; // 采购在订量

	public float OnFactoryFQTY = 0.0f; // 在制订量

	public float OnSaleFQTY = 0.0f; // 销售在订量

	public float SafeFQTY = 0.0f; // 安全库存

	public float LossFQTY = 0.0f; // 损耗量

	public float FrozenFQTY = 0.0f; // 预占库存

	public String UnitText = ""; // 物料单位

	public DateTime DemandStartTime = DateTime.Now;// 需求开始日期

	public DateTime DemandEndTime = DateTime.Now; // 需求结束日期

	public int WorkShopID = 0; // 制造车间ID

	public int LineID = 0; // 制造产线ID

	public int PartID = 0; // 制造工序段ID

	public int UnitID = 0;

	public int TypeID = 0; // 01:自制件|02:外购件|04:委外件

	public int BuyDays = 0; // 采购提前时间

	public int SafeMode = 0; // 工厂保障|供应商保障（继承物料信息属性）

	public int StockID = 0; // 默认仓库ID

	public int SupplierID = 0; // 默认供应商ID

	public String SupplierName = ""; // 供应商

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getMRPID() {
		return MRPID;
	}

	public void setMRPID(int mRPID) {
		MRPID = mRPID;
	}

	public int getGradeID() {
		return GradeID;
	}

	public void setGradeID(int gradeID) {
		GradeID = gradeID;
	}

	public int getMaterialID() {
		return MaterialID;
	}

	public void setMaterialID(int materialID) {
		MaterialID = materialID;
	}

	public String getMaterialNo() {
		return MaterialNo;
	}

	public void setMaterialNo(String materialNo) {
		MaterialNo = materialNo;
	}

	public String getMaterialName() {
		return MaterialName;
	}

	public void setMaterialName(String materialName) {
		MaterialName = materialName;
	}

	public float getBadRatio() {
		return BadRatio;
	}

	public void setBadRatio(float badRatio) {
		BadRatio = badRatio;
	}

	public float getDemandFQTY() {
		return DemandFQTY;
	}

	public void setDemandFQTY(float demandFQTY) {
		DemandFQTY = demandFQTY;
	}

	public float getAvailableFQTY() {
		return AvailableFQTY;
	}

	public void setAvailableFQTY(float availableFQTY) {
		AvailableFQTY = availableFQTY;
	}

	public float getMarginFQTY() {
		return MarginFQTY;
	}

	public void setMarginFQTY(float marginFQTY) {
		MarginFQTY = marginFQTY;
	}

	public float getStockFQTY() {
		return StockFQTY;
	}

	public void setStockFQTY(float stockFQTY) {
		StockFQTY = stockFQTY;
	}

	public float getOnBuyFQTY() {
		return OnBuyFQTY;
	}

	public void setOnBuyFQTY(float onBuyFQTY) {
		OnBuyFQTY = onBuyFQTY;
	}

	public float getOnFactoryFQTY() {
		return OnFactoryFQTY;
	}

	public void setOnFactoryFQTY(float onFactoryFQTY) {
		OnFactoryFQTY = onFactoryFQTY;
	}

	public float getOnSaleFQTY() {
		return OnSaleFQTY;
	}

	public void setOnSaleFQTY(float onSaleFQTY) {
		OnSaleFQTY = onSaleFQTY;
	}

	public float getSafeFQTY() {
		return SafeFQTY;
	}

	public void setSafeFQTY(float safeFQTY) {
		SafeFQTY = safeFQTY;
	}

	public float getLossFQTY() {
		return LossFQTY;
	}

	public void setLossFQTY(float lossFQTY) {
		LossFQTY = lossFQTY;
	}

	public float getFrozenFQTY() {
		return FrozenFQTY;
	}

	public void setFrozenFQTY(float frozenFQTY) {
		FrozenFQTY = frozenFQTY;
	}

	public String getUnitText() {
		return UnitText;
	}

	public void setUnitText(String unitText) {
		UnitText = unitText;
	}

	public DateTime getDemandStartTime() {
		return DemandStartTime;
	}

	public void setDemandStartTime(DateTime demandStartTime) {
		DemandStartTime = demandStartTime;
	}

	public DateTime getDemandEndTime() {
		return DemandEndTime;
	}

	public void setDemandEndTime(DateTime demandEndTime) {
		DemandEndTime = demandEndTime;
	}

	public int getWorkShopID() {
		return WorkShopID;
	}

	public void setWorkShopID(int workShopID) {
		WorkShopID = workShopID;
	}

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
	}

	public int getPartID() {
		return PartID;
	}

	public void setPartID(int partID) {
		PartID = partID;
	}

	public int getUnitID() {
		return UnitID;
	}

	public void setUnitID(int unitID) {
		UnitID = unitID;
	}

	public int getTypeID() {
		return TypeID;
	}

	public void setTypeID(int typeID) {
		TypeID = typeID;
	}

	public int getBuyDays() {
		return BuyDays;
	}

	public void setBuyDays(int buyDays) {
		BuyDays = buyDays;
	}

	public int getSafeMode() {
		return SafeMode;
	}

	public void setSafeMode(int safeMode) {
		SafeMode = safeMode;
	}

	public int getStockID() {
		return StockID;
	}

	public void setStockID(int stockID) {
		StockID = stockID;
	}

	public int getSupplierID() {
		return SupplierID;
	}

	public void setSupplierID(int supplierID) {
		SupplierID = supplierID;
	}

	public String getSupplierName() {
		return SupplierName;
	}

	public void setSupplierName(String supplierName) {
		SupplierName = supplierName;
	}

	public MRPMaterial() {
		this.DemandStartTime = DateTime.Now;
		this.DemandEndTime = DateTime.Now;
	}

	public MRPMaterial(int wMaterialID, String wMaterialNo, String wMaterialName, float wFQTY) {
		this.MaterialID = wMaterialID;
		this.MaterialNo = wMaterialNo;
		this.MaterialName = wMaterialName;

		this.DemandStartTime = DateTime.Now;
		this.DemandEndTime = DateTime.Now;
		this.DemandFQTY = wFQTY;
	}
}
