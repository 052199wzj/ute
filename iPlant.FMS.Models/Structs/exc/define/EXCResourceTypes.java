package com.mes.server.service.po.exc.define;

/**
 * 异常资源类型
 * 
 * @author ShrisJava
 *
 */
public enum EXCResourceTypes {
	/**
	 * 默认 无
	 */
	None(0, "默认"),

	/**
	 * 人工
	 */
	Artificial(1, "人工"),

	/**
	 * 系统
	 */
	System(2, "系统");

	private int value;
	private String lable;

	private EXCResourceTypes(int value, String lable) {
		this.value = value;
		this.lable = lable;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static EXCResourceTypes getEnumType(int val) {
		for (EXCResourceTypes type : EXCResourceTypes.values()) {
			if (type.getValue() == val) {
				return type;
			}
		}
		return None;
	}

	public int getValue() {
		return value;
	}

	public String getLable() {
		return lable;
	}

}