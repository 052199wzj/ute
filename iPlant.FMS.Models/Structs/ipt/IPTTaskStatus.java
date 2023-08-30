package com.mes.server.service.po.ipt;

public enum IPTTaskStatus {
	/**
	 * 默认
	 */
	Default(0, "默认"),
	/**
	 * 提交但 未完成
	 */
	UnFinish(1, "提交但 未完成"),
	/**
	 * 完成
	 */
	Finish(2, "完成");

	private int value;
	private String lable;

	private IPTTaskStatus(int value, String lable) {
		this.value = value;
		this.lable = lable;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static IPTTaskStatus getEnumType(int val) {
		for (IPTTaskStatus type : IPTTaskStatus.values()) {
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