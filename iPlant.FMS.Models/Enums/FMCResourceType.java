package com.mes.server.service.mesenum;

public enum FMCResourceType {
	/**
	 * 默认
	 */
	Default(0, "默认"),
	/**
	 * 设备
	 */
	Device(1, "设备"),
	/**
	 * 备件
	 */
	Spare(2, "备件"),
	/**
	 * 工装
	 */
	Parts(3, "工装"),

	/**
	 * 量具
	 */
	Measure(4, "量具");

	private int value;
	private String lable;

	private FMCResourceType(int value, String lable) {
		this.value = value;
		this.lable = lable;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static FMCResourceType getEnumType(int val) {
		for (FMCResourceType type : FMCResourceType.values()) {
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
