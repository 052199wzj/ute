package com.mes.server.service.po.exc;

import java.io.Serializable;


import com.mes.server.service.utils.StringUtils;

/**
 * 可选项
 * 
 * @author ShrisJava
 *
 */
public class EXCOptionItem implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 索引ID
	 */
	public int ID;

	/**
	 * 识 没有Int ID的情况用此字段
	 */
	public String Sign;

	/**
	 * 显示
	 */
	public String Name;

	public EXCOptionItem() {
		ID = 0;
		Sign = "";
		Name = "";
	}

	public EXCOptionItem(String wFormatText) {
		if (wFormatText == null)
			return;
		String[] wStringList = wFormatText.split("\\+\\|,\\|\\+");

		if (wStringList.length != 3)
			return;

		ID = StringUtils.parseInt(wStringList[0]);
		Sign = StringUtils.parseString(wStringList[1]);
		Name = StringUtils.parseString(wStringList[2]);
	}

	@Override
	public String ToString() {
		if (Sign == null)
			Sign = "";
		if (Name == null)
			Name = "";
		return StringUtils.Format("{0}+|,|+{1}+|,|+{2}", String.valueOf(ID), Sign, Name);
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getSign() {
		return Sign;
	}

	public void setSign(String sign) {
		Sign = sign;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}
}
