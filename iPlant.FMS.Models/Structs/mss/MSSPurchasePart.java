package com.mes.server.service.po.mss;

import java.io.Serializable;
import java.util.DateTime;

/**
 * 偶修件采购进度跟踪
 * 
 * @author PengYouWang
 * @CreateTime 2019年12月27日12:54:45
 * @LastEditTime 2019年12月27日16:01:46
 *
 */
public class MSSPurchasePart implements Serializable {

	private static final long serialVersionUID = 1L;
	/**
	 * 唯一编号
	 */
	public long ID;
	/**
	 * 台位ID
	 */
	public int PlaceID;
	/**
	 * 台位名称
	 */
	public String PlaceName = "";
	/**
	 * 车辆号
	 */
	public String PartNo = "";
	/**
	 * 物料ID
	 */
	public int MaterialID;
	/**
	 * 物料编码
	 */
	public String MaterialNo = "";
	/**
	 * 物料名称
	 */
	public String MaterialName = "";
	/**
	 * 供应商ID
	 */
	public int SupplierID;
	/**
	 * 供应商名称
	 */
	public String SupplierName = "";
	/**
	 * 采购数量
	 */
	public int FQTY;
	/**
	 * 联系人ID
	 */
	public int LinkmanID;
	/**
	 * 联系人名称
	 */
	public String LinkmanName = "";
	/**
	 * 无效字段
	 */
	public String SupplierAddress = "";
	/**
	 * 联系电话
	 */
	public String LinkmanPhone = "";
	/**
	 * 申请时间
	 */
	public DateTime ApplyTime = DateTime.Now;
	/**
	 * 下单时间
	 */
	public DateTime OrderTime = DateTime.Now;
	/**
	 * 预计到公司时间
	 */
	public DateTime PlanReceiveDate = DateTime.Now;
	/**
	 * 生产要求时间
	 */
	public DateTime RequirementDate = DateTime.Now;
	/**
	 * 实际采购周期
	 */
	public double RealPurchaseDur;
	/**
	 * 生产要求周期
	 */
	public double RequireDur;
	/**
	 * 到货状态
	 */
	public int Status;
	/**
	 * 备注
	 */
	public String Remark = "";
	/**
	 * 到场检验合格情况统计
	 */
	public String GoodRemark;
	/**
	 * 采购员ID
	 */
	public int PurchaserID;
	/**
	 * 采购员名称
	 */
	public String PurchaserName = "";
	/**
	 * 创建人ID
	 */
	public int CreateID;
	/**
	 * 创建人名称
	 */
	public String Creator = "";
	/**
	 * 创建时刻
	 */
	public DateTime CreateTime = DateTime.Now;
	/**
	 * 编辑人ID
	 */
	public int EditID;
	/**
	 * 编辑人名称
	 */
	public String Editor = "";
	/**
	 * 编辑时刻
	 */
	public DateTime EditTime = DateTime.Now;

	public MSSPurchasePart() {
		ApplyTime.set(2000, 1, 1);
		OrderTime.set(2000, 1, 1);
		PlanReceiveDate.set(2000, 1, 1);
		RequirementDate.set(2000, 1, 1);
		CreateTime.set(2000, 1, 1);
		EditTime.set(2000, 1, 1);
	}

	public long ID {
		return ID;
	}

	public void setID(long iD) {
		ID = iD;
	}

	public String getPartNo() {
		return PartNo;
	}

	public void setPartNo(String partNo) {
		PartNo = partNo;
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

	public int getFQTY() {
		return FQTY;
	}

	public void setFQTY(int fQTY) {
		FQTY = fQTY;
	}

	public int getLinkmanID() {
		return LinkmanID;
	}

	public void setLinkmanID(int linkmanID) {
		LinkmanID = linkmanID;
	}

	public String getLinkmanName() {
		return LinkmanName;
	}

	public void setLinkmanName(String linkmanName) {
		LinkmanName = linkmanName;
	}

	public String getSupplierAddress() {
		return SupplierAddress;
	}

	public void setSupplierAddress(String supplierAddress) {
		SupplierAddress = supplierAddress;
	}

	public String getLinkmanPhone() {
		return LinkmanPhone;
	}

	public void setLinkmanPhone(String linkmanPhone) {
		LinkmanPhone = linkmanPhone;
	}

	public DateTime getApplyTime() {
		return ApplyTime;
	}

	public void setApplyTime(DateTime applyTime) {
		ApplyTime = applyTime;
	}

	public DateTime getOrderTime() {
		return OrderTime;
	}

	public void setOrderTime(DateTime orderTime) {
		OrderTime = orderTime;
	}

	public DateTime getPlanReceiveDate() {
		return PlanReceiveDate;
	}

	public void setPlanReceiveDate(DateTime planReceiveDate) {
		PlanReceiveDate = planReceiveDate;
	}

	public DateTime getRequirementDate() {
		return RequirementDate;
	}

	public void setRequirementDate(DateTime requirementDate) {
		RequirementDate = requirementDate;
	}

	public double getRealPurchaseDur() {
		return RealPurchaseDur;
	}

	public void setRealPurchaseDur(double realPurchaseDur) {
		RealPurchaseDur = realPurchaseDur;
	}

	public double getRequireDur() {
		return RequireDur;
	}

	public void setRequireDur(double requireDur) {
		RequireDur = requireDur;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public String getRemark() {
		return Remark;
	}

	public void setRemark(String remark) {
		Remark = remark;
	}

	public String getGoodRemark() {
		return GoodRemark;
	}

	public void setGoodRemark(String goodRemark) {
		GoodRemark = goodRemark;
	}

	public int getPurchaserID() {
		return PurchaserID;
	}

	public void setPurchaserID(int purchaserID) {
		PurchaserID = purchaserID;
	}

	public String getPurchaserName() {
		return PurchaserName;
	}

	public void setPurchaserName(String purchaserName) {
		PurchaserName = purchaserName;
	}

	public int getCreateID() {
		return CreateID;
	}

	public void setCreateID(int createID) {
		CreateID = createID;
	}

	public String getCreator() {
		return Creator;
	}

	public void setCreator(String creator) {
		Creator = creator;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public int getEditID() {
		return EditID;
	}

	public void setEditID(int editID) {
		EditID = editID;
	}

	public String getEditor() {
		return Editor;
	}

	public void setEditor(String editor) {
		Editor = editor;
	}

	public DateTime getEditTime() {
		return EditTime;
	}

	public void setEditTime(DateTime editTime) {
		EditTime = editTime;
	}

	public int getPlaceID() {
		return PlaceID;
	}

	public void setPlaceID(int placeID) {
		PlaceID = placeID;
	}

	public String getPlaceName() {
		return PlaceName;
	}

	public void setPlaceName(String placeName) {
		PlaceName = placeName;
	}
}
