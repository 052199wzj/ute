package com.mes.server.service.po.wms;


public enum WMSMaterialTaskStatus {

	// \[Description\s*\(\"(\S*)\"\)\][\s\n\r]+(\w+)\s*\=?\s*(\d+)? $2($3,"$1")

	Default(0, "默认"),
	/// <summary>
	/// 已配料
	/// </summary>
	Ready(1, "配料"),
	/// <summary>
	/// 待收料
	/// </summary>
	Check(2, "收料"),
	/// <summary>
	/// 已收料
	/// </summary>
	Done(3, "完成"),

	/**
	 * 驳回
	 */
	Reject(4, "驳回");

	private int value;
	private String lable;

	private WMSMaterialTaskStatus(int value, String lable) {
		this.value = value;
		this.lable = lable;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static WMSMaterialTaskStatus getEnumType(int val) {
		for (WMSMaterialTaskStatus type : WMSMaterialTaskStatus.values()) {
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
