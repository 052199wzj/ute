package com.mes.server.service.po.wms;

 

public enum LocationChooseModeEnum {

	// \[Description\s*\(\"(\S*)\"\)\][\s\n\r]+(\w+)\s*\=?\s*(\d+)? $2($3,"$1")

	Default(0, "默认值"),
	/// <summary>
	/// 1：仓库数量优先
	/// </summary>
	StockNum(1, "仓库数量优先"),
	/// <summary>
	/// 2：批次优先
	/// </summary>
	Flot(2, "批次优先");

	private int value;
	private String lable;

	private LocationChooseModeEnum(int value, String lable) {
		this.value = value;
		this.lable = lable;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static LocationChooseModeEnum getEnumType(int val) {
		for (LocationChooseModeEnum type : LocationChooseModeEnum.values()) {
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
