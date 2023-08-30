package com.mes.server.service.mesenum;

import java.util.List;
import java.util.List;

import com.mes.server.service.po.cfg.CFGItem;

public enum BPMEventModule {
	/**
	 * SCH
	 */
	Default(0, "默认"), SCLogin(1001, "开工打卡", 1), SCDJ(1002, "生产点检", 1), SCZJ(1003, "生产自检", 1), SCSJ(1004, "生产首检", 1),
	SCNCR(1005, "NCR报告", 1), SCLL(1006, "领料"), SCBG(1007, "报检", 1), SCReady(1008, "SCReady"), SCBL(1009, "生产补料"),
	SCTL(1010, "生产退料"), SCCall(1012, "异常", 1), SCXJ(1014, "生产巡检"), SCBeforeDJ(1015, "班前点检"), SCAfterDJ(1016, "班后点检"),
	SCLayout(8111, "完工打卡", 1), SCRepair(1018, "返工", 1), SCMovePart(1020, "移车"), SCCertification(1201, "资质审批"),
	SCScrap(1031, "生产报废"), SCPB(1040, "生产排班"),

	QTLLJY(2001, "来料检验", 1), QTSJ(2002, "质量首检", 1), QTXJ(2003, "质量巡检", 1), QTRKJ(2004, "入库检"), QTCKJ(2005, "出库检"),
	QTNCR(2006, "NCR报告"), QTLock(2007, "停线（序）"), QTRepair(2011, "生产返工(修)"), QTJLXJ(2012, "计量巡检", 1),
	QTReCheck(2014, "复测"), CurbProduct(2020, "早期生产遏制", 1), ReceiptNotice(2025, "收料通知", 1), QTLJJZ(2022, "量具校准", 1),

	TechXJ(3001, "工艺巡检", 1),

	DeviceDJ(4001, "设备点检"), DeviceBY(4002, "设备保养", 1), DeviceWX(4003, "设备维修", 1),

	CKSCM(5001, "采购入库"), CKSCPL(5002, "生产配料"), CKSL(5003, "送料"), CKSCRK(5004, "生产入库",1), CKFHCK(5005, "发货出库"),
	CKRepair(5010, "返工"),

	/**
	 * 广机为客户 其他为客户 暂不需审批
	 */
	ATCustomer(8005, "客户设置"),

	/**
	 * 设备资产 需要审批
	 */
	ATDevice(8006, "设备资产"),
	/**
	 * 事业部设置 暂不需审批
	 */
	ATBusinessUnit(8007, "事业部设置"),

	/**
	 * 车间设置 暂不需审批
	 */
	ATWorkShop(8008, "车间设置"),
	/**
	 * 产线设置 暂不需审批
	 */
	ATLine(8009, "产线设置"),
	/**
	 * 产线单元设置 需要审批
	 */
	ATLineUnit(8010, "产线单元设置"),

	/**
	 * 台位设置 暂不需审批
	 */
	ATWorkspace(8011, "台位设置"),
	/**
	 * 工段设置 广机为工位
	 */
	ATPart(8012, "工位库设置"),
	/**
	 * 工序设置
	 */
	ATStep(8013, "工序库设置"),
	/**
	 * 产品类型 广机为车辆类型
	 */
	ATProductType(8014, "车辆类型设置"),
	/**
	 * 产品设置 广机为产品规格设置
	 */
	ATProduct(8015, "产品规格设置"),

	/**
	 * 产品工艺路线设置 广机为一级流程设置
	 */
	ATProductRoute(8016, "标准流程方案"),

	ATRoute(8017, "流程方案"),

	/**
	 * 供应商设置
	 */
	ATSupplier(8019, "供应商设置"),

	/**
	 * 物料设置
	 */
	ATMaterial(8030, "物料设置"),

	ATUnit(8031, "单位设置"),

	ATBOM(8032, "BOM设置"),

	ATAPSBOM(8033, "台车BOM"),

	ATInStock(8035, "部件入库"),

	/**
	 * 生产命令票 广机为生产订单
	 */
	ATCommand(8040, "生产订单"),

	/**
	 * 生产订单 广机为台车订单
	 */
	ATOrder(8041, "台车订单"),
	/**
	 * 月计划审批
	 */
	SCMonthAudit(8100, "月计划审批"),
	/**
	 * 周计划审批
	 */
	SCWeekAudit(8101, "周计划审批"),
	/**
	 * 日计划审批
	 */
	SCDayAudit(8102, "日计划审批"),
	/**
	 * 派工
	 */
	SCDispatching(8103, "派工"),

	/**
	 * 
	 */
	ToLoan(8104, "借调"),
	/**
	 * 
	 */
	DayPlanIssue(8105, "日计划下达"),

	/**
	 * 
	 */
	ProblemPG(8106, "问题项派工"),

	/**
	 * 
	 */
	YJReport(8107, "预检报告审批"),

	/**
	 * 
	 */
	QTDispatching(8108, "质量派工"),
	/**
	 * 出厂申请
	 */
	OutPlantApply(8109, "出厂申请"), TurnOrder(8110, "转序"), MutualCheck(

			8112, "互检"),
	SpecialCheck(

			8113, "专检"),
	PreCheck(

			8114, "预检"),
	PreProblemHandle(

			8115, "预检问题项处理"),
	StationTip(

			8116, "工位提示"),
	FinalCheck(

			8117, "终检"),
	OutCheck(

			8118, "出厂检"),
	OccasionNCR(

			8201, "偶换件不合格评审");

	private int value;
	private String lable;
	private int isUsed = 0;

	private BPMEventModule(int value, String lable, int isUsed) {
		this.value = value;
		this.lable = lable;
		this.isUsed = isUsed;
	}

	private BPMEventModule(int value, String lable) {
		this.value = value;
		this.lable = lable;
		this.isUsed = 0;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static BPMEventModule getEnumType(int val) {
		for (BPMEventModule type : BPMEventModule.values()) {
			if (type.getValue() == val) {
				return type;
			}
		}
		return Default;
	}

	public static List<CFGItem> getEnumList() {
		List<CFGItem> wItemList = new List<CFGItem>();
		CFGItem wItem = null;
		for (BPMEventModule type : BPMEventModule.values()) {
			wItem = new CFGItem();
			wItem.ID = type.getValue();
			wItem.ItemName = type.name();
			wItem.ItemText = type.getLable();
			wItemList.Add(wItem);
		}
		return wItemList;
	}

	public static List<CFGItem> getEnumList(int min) {
		List<CFGItem> wItemList = new List<CFGItem>();
		CFGItem wItem = null;
		for (BPMEventModule type : BPMEventModule.values()) {
			if (type.getValue() < min)
				continue;
			wItem = new CFGItem();
			wItem.ID = type.getValue();
			wItem.ItemName = type.getLable();
			wItem.ItemText = type.getLable();
			wItemList.Add(wItem);
		}
		return wItemList;
	}

	public int getValue() {
		return value;
	}

	public String getLable() {
		return lable;
	}

	public int getIsUsed() {
		return isUsed;
	}
}
