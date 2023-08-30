package com.mes.server.service.po.wms;

public enum WMSTaskType {

	/// <summary>
	/// 未知:0
	/// </summary>
	Default(0, "默认"),
	/// <summary>
	/// 计划：1
	/// </summary>
	Plan(1, "计划配料"),
	/// <summary>
	/// 计划：1
	/// </summary>
	Feed(2, "自由配料");

	private int value;
	private String lable;

	private WMSTaskType(int value, String lable) {
		this.value = value;
		this.lable = lable;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static WMSTaskType getEnumType(int val) {
		for (WMSTaskType type : WMSTaskType.values()) {
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
