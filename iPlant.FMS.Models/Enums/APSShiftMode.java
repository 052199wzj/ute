package com.mes.server.service.mesenum;

import java.util.List;
import java.util.List;

import com.mes.server.service.po.cfg.CFGItem;

public enum APSShiftMode {
	Default(0, "默认"),
	/**
	 * SCH
	 */
	Pull(1, "拉式排程"),
	/**
	 * APP
	 */
	Push(2, "推式排程");
	private int value;
	private String lable;

	private APSShiftMode(int value, String lable) {
		this.value = value;
		this.lable = lable;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static APSShiftMode getEnumType(int val) {
		for (APSShiftMode type : APSShiftMode.values()) {
			if (type.getValue() == val) {
				return type;
			}
		}
		return APSShiftMode.Default;
	}

	public static List<CFGItem> getEnumList() {
		List<CFGItem> wItemList = new List<CFGItem>();

		for (APSShiftMode type : APSShiftMode.values()) {
			CFGItem wItem = new CFGItem();
			wItem.ID = type.getValue();
			wItem.ItemName = type.getLable();
			wItem.ItemText = type.getLable();
			wItemList.Add(wItem);
		}
		return wItemList;
	}

	public int getValue() {
		return value;
	}

	public String getLable() {
		return lable;
	}
}
