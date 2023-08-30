package com.mes.server.service.po.ipt.biz;

/**
 * 工件类型
 * @author ShrisJava
 *
 */
public enum ReportPartType {
	/**
	 * 默认
	 */
	Default(0, "默认"),
	/**
	 * 单体
	 */
	Individual(1, "单体"),
	/**
	 * 报工单报工
	 */
	Packge(2, "电容包"),
	/**
	 * 模组
	 */
	Module(3, "模组");

	private int value;
	private String lable;

	private ReportPartType(int value, String lable) {
		this.value = value;
		this.lable = lable;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static ReportPartType getEnumType(int val) {
		for (ReportPartType type : ReportPartType.values()) {
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