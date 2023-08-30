package com.mes.server.service.po.exc.define;

/**
 * 异常动作类型
 * 
 * @author ShrisJava
 *
 */
public enum EXCActionTypes {

	/**
	 * 默认
	 */
	Default(0, "默认"),

	/**
	 * 发起
	 */
	Request(1, "发起"),

	/**
	 * 撤销
	 */
	Cancel(2, "撤销"),

	/**
	 * 收到
	 */
	Notice(3, "收到"),

	/**
	 * 到场
	 */
	OnSite(4, "到场"),

	/**
	 * 处理
	 */
	Respond(5, "处理"),

	/**
	 * 转发
	 */
	Forward(6, "转发"),

	/**
	 * 确认
	 */
	Confirm(7, "确认"),

	/**
	 * 驳回
	 */
	Reject(8, "驳回"),

	/**
	 * 上报
	 */
	UpGrade(9, "上报");

	private int value;
	private String lable;

	private EXCActionTypes(int value, String lable) {
		this.value = value;
		this.lable = lable;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static EXCActionTypes getEnumType(int val) {
		for (EXCActionTypes type : EXCActionTypes.values()) {
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
