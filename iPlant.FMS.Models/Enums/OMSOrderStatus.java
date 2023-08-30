package com.mes.aps.server.service.mesenum;

/**
 * -- 台车订单状态
 * 
 * @author PengYouWang
 * @CreateTime 2019年12月26日17:54:54
 * @LastEditTime 2019年12月26日17:55:11
 */
public enum OMSOrderStatus {
	/**
	 * 默认
	 */
	Default(0, "默认"),
	/**
	 * 有订单(可以制定月计划)
	 */
	HasOrder(1, "已保存"),
	/**
	 * 已制定月计划 可以制定周计划
	 */
	PlantOrder(2, "已制定"),
	/**
	 * 已制定周计划 可以走日计划打卡开工了
	 */
	WeekPlantOrder(3, "已下达"),

	/**
	 * 生产中(周计划)(月计划)
	 */
	ProductOrder(4, "生产中"),
	/**
	 * 已完工
	 */
	FinishOrder(5, "已完工"),
	/**
	 * 暂停中
	 */
	StopOrder(6, "暂停中"),
	/**
	 * 已入库
	 */
	StockOrder(7, "已入库"),

	/**
	 * 已发货
	 */
	SendOrder(8, "已发货");

	private int value;
	private String lable;

	private OMSOrderStatus(int value, String lable) {
		this.value = value;
		this.lable = lable;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static OMSOrderStatus getEnumType(int val) {
		for (OMSOrderStatus type : OMSOrderStatus.values()) {
			if (type.getValue() == val) {
				return type;
			}
		}
		return Default;
	}

	public int getValue() {
		return value;
	}

	public String getLable() {
		return lable;
	}
}
