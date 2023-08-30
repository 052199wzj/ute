package com.mes.server.service.po.exc.define;

public enum EXCTemplates {
	/**
	 * 
	 */
	Default(0, "默认"),
	/**
	 * 全部人为参与
	 */
	Artificial(1, " 全部人为参与"),
	/**
	 * 人发起 系统处理 系统确认 即人为发起通知 超时自动处理完成
	 */
	Artificial_System(2, "人发起 系统处理 系统确认  即人为发起通知  超时自动处理完成"),

	/**
	 * 系统发起 人为处理 系统确认 确定异常消失信号以及异常已处理 做确认操作
	 */
	System_Artificial_System(3, "系统发起 人为处理 系统确认  确定异常消失信号以及异常已处理 做确认操作"),

	/**
	 * 系统发起 人为处理 人为确认
	 */
	System_Artificial(4, "默认"),

	/**
	 * 系统自动发起通知
	 */
	System(5, "系统自动发起通知");
	private int value;
	private String lable;

	private EXCTemplates(int value, String lable) {
		this.value = value;
		this.lable = lable;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static EXCTemplates getEnumType(int val) {
		for (EXCTemplates type : EXCTemplates.values()) {
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
