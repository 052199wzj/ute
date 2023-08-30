package com.mes.server.service.po.ipt;

public enum SharpenerType {
	/**
	 * Default
	 */
	Default(0, "Default"),
	/**
	 * GrindingWheel
	 */
	GrindingWheel(1, "GrindingWheel"),
	/**
	 * Whetstone
	 */
	Whetstone(2, "Whetstone");

	private int value;
	private String lable;

	private SharpenerType(int value, String lable) {
		this.value = value;
		this.lable = lable;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static SharpenerType getEnumType(int val) {
		for (SharpenerType type : SharpenerType.values()) {
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