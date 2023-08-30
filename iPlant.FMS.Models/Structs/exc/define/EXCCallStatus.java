package com.mes.server.service.po.exc.define;

/**
 * 任务单的状态
 * 
 * @author ShrisJava
 *
 */
public enum EXCCallStatus {
	/**
	 * 默认
	 */

	Default(0, "默认"),

	/**
	 * 待处理
	 */

	WaitRespond(1, "待处理"),

	/**
	 * 收到待处理
	 */

	NoticeWaitRespond(2, "收到待处理"),

	/**
	 * 到场待处理
	 */

	OnSiteRespond(3, "到场待处理"),

	/**
	 * 已处理
	 */

	WaitConfirm(4, "已处理"),

	/**
	 * 已转发
	 */

	Forwarded(5, "已转发"),

	/**
	 * 已确认
	 */

	Confirmed(6, "已确认"),

	/**
	 * 已驳回
	 */

	Rejected(7, "已驳回"),

	/**
	 * 上报待处理
	 */

	UpGraded(8, "上报待处理"),

	/**
	 * 撤销
	 */

	Cancel(9, "已撤销"),;

	private int value;
	private String lable;

	private EXCCallStatus(int value, String lable) {
		this.value = value;
		this.lable = lable;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static EXCCallStatus getEnumType(int val) {
		for (EXCCallStatus type : EXCCallStatus.values()) {
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
