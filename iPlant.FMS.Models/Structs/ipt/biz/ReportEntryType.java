package com.mes.server.service.po.ipt.biz;

public enum ReportEntryType {
	/**
	 * 默认
	 */
	Default(0, "默认"),
	/**
	 * 自检单报工
	 */
	Patrol(1, "自检单报工"),
	/**
	 * 报工单报工
	 */
	Report(2, "报工单报工"),
	/**
	 * 复测
	 */
	RePatrol(3, "复测");

	private int value;
	private String lable;

	private ReportEntryType(int value, String lable) {
		this.value = value;
		this.lable = lable;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static ReportEntryType getEnumType(int val) {
		for (ReportEntryType type : ReportEntryType.values()) {
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