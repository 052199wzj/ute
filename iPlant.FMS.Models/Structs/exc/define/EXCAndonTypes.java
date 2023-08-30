package com.mes.server.service.po.exc.define;

/**
 * 异常来源类型
 * 
 * @author ShrisJava
 *
 */
public enum EXCAndonTypes {
	/**
	 * 默认 无
	 */
	Default(0, "默认"),

	/**
	 * 呼叫
	 */
	Call(1, "呼叫");

	private int value;
	private String lable;

	private EXCAndonTypes(int value, String lable) {
		this.value = value;
		this.lable = lable;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static EXCAndonTypes getEnumType(int val) {
		for (EXCAndonTypes type : EXCAndonTypes.values()) {
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