package com.mes.server.service.mesenum;

import java.util.ArrayList;
import java.util.List;

import com.mes.server.service.po.cfg.CFGItem;

public enum APSUnitLevel {

	Default(0, "默认", ""),
	/**
	 * SCH
	 */
	Line(1, "产线", "MELineRevision"),
	/**
	 * APP
	 */
	Part(2, "工段", "XNY2gdRevision"),
	/**
	 * APP
	 */
	Step(3, "工序", "XNY2gxRevision"),
	/**
	 * APP
	 */
	Station(4, "工位", "XNY2gwRevision");

	private int value;
	private String lable;
	private String code;

	private APSUnitLevel(int value, String lable, String code) {
		this.value = value;
		this.lable = lable;
		this.code = code;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static APSUnitLevel getEnumType(int val) {
		for (APSUnitLevel type : APSUnitLevel.values()) {
			if (type.getValue() == val) {
				return type;
			}
		}
		return APSUnitLevel.Default;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static APSUnitLevel getEnumType(String code) {
		for (APSUnitLevel type : APSUnitLevel.values()) {
			if (type.getCode().equals(code)) {
				return type;
			}
		}
		return APSUnitLevel.Default;
	}

	public static List<CFGItem> getEnumList() {
		List<CFGItem> wItemList = new ArrayList<CFGItem>();

		for (APSUnitLevel type : APSUnitLevel.values()) {
			CFGItem wItem = new CFGItem();
			wItem.ID = type.getValue();
			wItem.ItemName = type.getLable();
			wItem.ItemText = type.getLable();
			wItemList.add(wItem);
		}
		return wItemList;
	}

	public int getValue() {
		return value;
	}

	public String getLable() {
		return lable;
	}

	public String getCode() {
		return code;
	}
}
