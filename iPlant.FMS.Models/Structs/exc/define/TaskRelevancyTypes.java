package com.mes.server.service.po.exc.define;

/**
 * 关联任务类型
 * 
 * @author ShrisJava
 *
 */
public enum TaskRelevancyTypes {
	/**
	 * 默认 无
	 */
	Default(0, "默认"),

	/**
	 * 保养
	 */
	Maintain(1, "保养"),

	/**
	 * 维修
	 */
	Repair(2, "维修"),

	/**
	 * 点检
	 */
	PointCheck(3, "点检"),

	/**
	 * 配料
	 */
	Material(4, "配料"),

	/**
	 * 巡检
	 */
	LoopCheck(5, "巡检");

	private int value;
	private String lable;

	private TaskRelevancyTypes(int value, String lable) {
		this.value = value;
		this.lable = lable;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static TaskRelevancyTypes getEnumType(int val) {
		for (TaskRelevancyTypes type : TaskRelevancyTypes.values()) {
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