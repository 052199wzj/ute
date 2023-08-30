package com.mes.server.service.po.exc.define;

public enum TagTypes {

	Default(0, "默认"),

	Dispatcher(1, "接收"),

	Applicant(2, "发起"),

	Confirmer(3, "确认"),

	Approver(4, "审批");

	private int value;
	private String lable;

	private TagTypes(int value, String lable) {
		this.value = value;
		this.lable = lable;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static TagTypes getEnumType(int val) {
		for (TagTypes type : TagTypes.values()) {
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
