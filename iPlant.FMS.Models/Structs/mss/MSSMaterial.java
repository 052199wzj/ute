package com.mes.server.service.po.mss;

import java.io.Serializable;
import java.util.DateTime;

import com.mes.server.service.po.mrp.MRPMaterial;

public class MSSMaterial implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public String Name = "";

	public String MaterialNo = "";

	public String OldMaterialNo = "";

	/**
	 * //物料名称
	 */
	public String MaterialName = "";

	public int IsIQCCheck = 0;

	/**
	 * 基本单位ID
	 */
	public int CYUnitID = 0; // 常用计量单位ID

	/**
	 * 物料类型
	 */
	public int TypeID = 0; // 自制件|外购件|委外件
	/**
	 * 物料类型
	 */
	public int MaterialTypeID = 0;
	/**
	 * 物料类型
	 */
	public String MaterialType = "";

	/**
	 * 物料组
	 */
	public int MaterialGroupID = 0;

	/**
	 * 物料组
	 */
	public String MaterialGroup = "";

	/**
	 * 大小量纲
	 */
	public String Groes = "";

	/**
	 * 工业标准
	 */
	public String Normt = "";

	/**
	 * 附加信息
	 */
	public String Remark = "";

	/**
	 * 净重 宁波 保质期
	 */
	public double NetWeight = 0.0;

	/**
	 * 毛重
	 */
	public double GrossWeight = 0.0;

	/**
	 * 重量单位 宁波 保质期单位
	 */
	public int ZLUnitID = 0;

	/**
	 * 重量单位文本
	 */
	public String ZLUnitText = "";

	/**
	 * 仓库标识
	 */
	public int StockID = 0; // 默认仓库

	public int LocationID = 0; // 默认仓位

	public int Status = 0;

	public int AuthorID = 0;

	public int AuditorID = 0;

	public String Author = "";

	public String Auditor = "";

	public DateTime EditTime = DateTime.Now;

	public DateTime AuditTime = DateTime.Now;

	public String CYUnitText = ""; // 常用计量单位文本

	public String Type = "";

	public String StockText = "";

	public String LocationText = "";

	public int BoxTypeID = 0; // 料盒类型ID

	public String BoxType = ""; // 料盒类型

	public float BoxFQTY = 0.0f; // 料盒物料容量

	public int BatchEnable = 0; // 批号启用

	public float SafeFQTY = 0.0f; // 安全库存

	public float ShiftFQTY = 0.0f; // 默认班产

	public int SafeMode = 0; // 工厂保障|供应商保障

	public int BuyDays = 0; // 采购提前时间

	public int BOMID = 0; // 默认生产BOM(实际制造车间单元)

	public String BOMNo = ""; // 默认生产BOM(实际制造车间单元)

	public String WorkShopText = ""; // 默认生产车间(实际制造车间单元)

	public int LineID = 0; // 默认生产车间(产线)

	public String PartName = ""; // 默认生产车间(工序段)

	public int SupplierID = 0; // 默认供应商

	public String SupplierName = ""; // 供应商

	public int LocationBoxs = 0; // 仓位料盒容量

	public int CGUnitID = 0; // 采购计量单位ID

	public int SCUnitID = 0; // 生产计量单位ID

	public int XSUnitID = 0; // 销售计量单位ID

	/**
	 * 宁波 最小发料批量单位
	 */
	public int KCUnitID = 0; // 库存计量单位ID

	public String CGUnitText = ""; // 采购计量单位文本

	public String SCUnitText = ""; // 生产计量单位文本

	public String XSUnitText = ""; // 销售计量单位文本

	public String KCUnitText = ""; // 库存计量单位文本

	public int ERPMaterialID = 0;

	public int CheckVersionID = 0;

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
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

	public int getCYUnitID() {
		return CYUnitID;
	}

	public void setCYUnitID(int cYUnitID) {
		CYUnitID = cYUnitID;
	}

	public int getTypeID() {
		return TypeID;
	}

	public void setTypeID(int typeID) {
		TypeID = typeID;
	}

	public int getStockID() {
		return StockID;
	}

	public void setStockID(int stockID) {
		StockID = stockID;
	}

	public int getLocationID() {
		return LocationID;
	}

	public void setLocationID(int locationID) {
		LocationID = locationID;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public DateTime getEditTime() {
		return EditTime;
	}

	public void setEditTime(DateTime editTime) {
		EditTime = editTime;
	}

	public DateTime getAuditTime() {
		return AuditTime;
	}

	public void setAuditTime(DateTime auditTime) {
		AuditTime = auditTime;
	}

	public String getCYUnitText() {
		return CYUnitText;
	}

	public void setCYUnitText(String cYUnitText) {
		CYUnitText = cYUnitText;
	}

	public String getType() {
		return Type;
	}

	public void setType(String type) {
		Type = type;
	}

	public String getStockText() {
		return StockText;
	}

	public void setStockText(String stockText) {
		StockText = stockText;
	}

	public String getLocationText() {
		return LocationText;
	}

	public void setLocationText(String locationText) {
		LocationText = locationText;
	}

	public int getBoxTypeID() {
		return BoxTypeID;
	}

	public void setBoxTypeID(int boxTypeID) {
		BoxTypeID = boxTypeID;
	}

	public String getBoxType() {
		return BoxType;
	}

	public void setBoxType(String boxType) {
		BoxType = boxType;
	}

	public float getBoxFQTY() {
		return BoxFQTY;
	}

	public void setBoxFQTY(float boxFQTY) {
		BoxFQTY = boxFQTY;
	}

	public int getBatchEnable() {
		return BatchEnable;
	}

	public void setBatchEnable(int batchEnable) {
		BatchEnable = batchEnable;
	}

	public float getSafeFQTY() {
		return SafeFQTY;
	}

	public void setSafeFQTY(float safeFQTY) {
		SafeFQTY = safeFQTY;
	}

	public float getShiftFQTY() {
		return ShiftFQTY;
	}

	public void setShiftFQTY(float shiftFQTY) {
		ShiftFQTY = shiftFQTY;
	}

	public int getSafeMode() {
		return SafeMode;
	}

	public void setSafeMode(int safeMode) {
		SafeMode = safeMode;
	}

	public int getBuyDays() {
		return BuyDays;
	}

	public void setBuyDays(int buyDays) {
		BuyDays = buyDays;
	}

	public int getBOMID() {
		return BOMID;
	}

	public void setBOMID(int bOMID) {
		BOMID = bOMID;
	}

	public String getBOMNo() {
		return BOMNo;
	}

	public void setBOMNo(String bOMNo) {
		BOMNo = bOMNo;
	}

	public String getWorkShopText() {
		return WorkShopText;
	}

	public void setWorkShopText(String workShopText) {
		WorkShopText = workShopText;
	}

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
	}

	public String getPartName() {
		return PartName;
	}

	public void setPartName(String partName) {
		PartName = partName;
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

	public int getLocationBoxs() {
		return LocationBoxs;
	}

	public void setLocationBoxs(int locationBoxs) {
		LocationBoxs = locationBoxs;
	}

	public int getCGUnitID() {
		return CGUnitID;
	}

	public void setCGUnitID(int cGUnitID) {
		CGUnitID = cGUnitID;
	}

	public int getSCUnitID() {
		return SCUnitID;
	}

	public void setSCUnitID(int sCUnitID) {
		SCUnitID = sCUnitID;
	}

	public int getXSUnitID() {
		return XSUnitID;
	}

	public void setXSUnitID(int xSUnitID) {
		XSUnitID = xSUnitID;
	}

	public int getKCUnitID() {
		return KCUnitID;
	}

	public void setKCUnitID(int kCUnitID) {
		KCUnitID = kCUnitID;
	}

	public String getCGUnitText() {
		return CGUnitText;
	}

	public void setCGUnitText(String cGUnitText) {
		CGUnitText = cGUnitText;
	}

	public String getSCUnitText() {
		return SCUnitText;
	}

	public void setSCUnitText(String sCUnitText) {
		SCUnitText = sCUnitText;
	}

	public String getXSUnitText() {
		return XSUnitText;
	}

	public void setXSUnitText(String xSUnitText) {
		XSUnitText = xSUnitText;
	}

	public String getKCUnitText() {
		return KCUnitText;
	}

	public void setKCUnitText(String kCUnitText) {
		KCUnitText = kCUnitText;
	}

	public int getERPMaterialID() {
		return ERPMaterialID;
	}

	public void setERPMaterialID(int eRPMaterialID) {
		ERPMaterialID = eRPMaterialID;
	}

	public int getCheckVersionID() {
		return CheckVersionID;
	}

	public void setCheckVersionID(int checkVersionID) {
		CheckVersionID = checkVersionID;
	}

	public MSSMaterial() {
		this.ShiftFQTY = 1000;
		this.MaterialNo = "";
		this.MaterialName = "";

		this.CYUnitText = "";
		this.Type = "";
		this.StockText = "";
		this.LocationText = "";
		this.BoxType = "";
		this.BOMNo = "";
		this.WorkShopText = "";
		this.PartName = "";
		this.SupplierName = "";
		this.CGUnitText = "";
		this.SCUnitText = "";
		this.XSUnitText = "";
		this.KCUnitText = "";

		this.EditTime = DateTime.Now;
		this.AuditTime = DateTime.Now;
	}

	public MSSMaterial(int wID, String wMaterialNo, String wMaterialName) {
		this.ID = wID;
		this.MaterialNo = wMaterialNo;
		this.MaterialName = wMaterialName;

		this.EditTime = DateTime.Now;
		this.AuditTime = DateTime.Now;
	}

	public MSSMaterial Clone() {
		MSSMaterial wMaterial = new MSSMaterial();
		wMaterial.ID = this.ID;
		wMaterial.MaterialNo = this.MaterialNo;
		wMaterial.MaterialName = this.MaterialName;
		wMaterial.ShiftFQTY = this.ShiftFQTY;
		wMaterial.CYUnitID = this.CYUnitID;
		wMaterial.TypeID = this.TypeID;
		wMaterial.StockID = this.StockID;
		return wMaterial;
	}

	public MRPMaterial MRPClone() {
		MRPMaterial wMaterial = new MRPMaterial();
		wMaterial.ID = this.ID;
		wMaterial.MaterialID = this.ID;
		wMaterial.MaterialNo = this.MaterialNo;
		wMaterial.MaterialName = this.MaterialName;
		wMaterial.UnitID = this.CYUnitID;
		wMaterial.TypeID = this.TypeID;
		wMaterial.StockID = this.StockID;
		return wMaterial;
	}

	public String getOldMaterialNo() {
		return OldMaterialNo;
	}

	public void setOldMaterialNo(String oldMaterialNo) {
		OldMaterialNo = oldMaterialNo;
	}

	public String getMaterialGroup() {
		return MaterialGroup;
	}

	public void setMaterialGroup(String materialGroup) {
		MaterialGroup = materialGroup;
	}

	public String getGroes() {
		return Groes;
	}

	public void setGroes(String groes) {
		Groes = groes;
	}

	public String getNormt() {
		return Normt;
	}

	public void setNormt(String normt) {
		Normt = normt;
	}

	public String getRemark() {
		return Remark;
	}

	public void setRemark(String remark) {
		Remark = remark;
	}

	public double getNetWeight() {
		return NetWeight;
	}

	public void setNetWeight(double netWeight) {
		NetWeight = netWeight;
	}

	public double getGrossWeight() {
		return GrossWeight;
	}

	public void setGrossWeight(double grossWeight) {
		GrossWeight = grossWeight;
	}

	public int getZLUnitID() {
		return ZLUnitID;
	}

	public void setZLUnitID(int zLUnitID) {
		ZLUnitID = zLUnitID;
	}

	public String getZLUnitText() {
		return ZLUnitText;
	}

	public void setZLUnitText(String zLUnitText) {
		ZLUnitText = zLUnitText;
	}

	public int getAuthorID() {
		return AuthorID;
	}

	public void setAuthorID(int authorID) {
		AuthorID = authorID;
	}

	public int getAuditorID() {
		return AuditorID;
	}

	public void setAuditorID(int auditorID) {
		AuditorID = auditorID;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public String getAuthor() {
		return Author;
	}

	public void setAuthor(String author) {
		Author = author;
	}

	public String getAuditor() {
		return Auditor;
	}

	public void setAuditor(String auditor) {
		Auditor = auditor;
	}

	public String getMaterialType() {
		return MaterialType;
	}

	public void setMaterialType(String materialType) {
		MaterialType = materialType;
	}

	public int getMaterialTypeID() {
		return MaterialTypeID;
	}

	public void setMaterialTypeID(int materialTypeID) {
		MaterialTypeID = materialTypeID;
	}

	public int getMaterialGroupID() {
		return MaterialGroupID;
	}

	public void setMaterialGroupID(int materialGroupID) {
		MaterialGroupID = materialGroupID;
	}
}
