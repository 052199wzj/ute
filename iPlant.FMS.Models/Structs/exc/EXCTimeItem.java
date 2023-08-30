package com.mes.server.service.po.exc;

import java.io.Serializable;

import com.mes.server.service.utils.StringUtils;

/**
 * 时间数据可选项
 * 
 * @author ShrisJava
 *
 */
public class EXCTimeItem implements Serializable {
	/**
	* 
	*/
	private static final long serialVersionUID = 1L;

	/**
	 * 索引ID
	 */
	public int ID;

	/**
	 * 标识 没有Int ID的情况用此字段
	 */
	public String Sign;

	/**
	 * 时间
	 */
	public int Time;

	public int Responselevel;

	public EXCTimeItem() {
		ID = 0;
		Sign = "Default";
		Time = 60;
		Responselevel = 0;
	}

	public EXCTimeItem(String wFormatText) {
		if (wFormatText == null)
			return;
		String[] wStringList = wFormatText.split("\\+\\|,\\|\\+");

		if (wStringList.length < 3)
			return;

		ID = StringUtils.parseInt(wStringList[0]);
		Sign = StringUtils.parseString(wStringList[1]);
		Time = StringUtils.parseInt(wStringList[2]);
		Responselevel = wStringList.length > 3 ? StringUtils.parseInt(wStringList[3]) : 0;
	}

	@Override
	public String ToString() {
		if (Sign == null)
			Sign = "";
		return StringUtils.Format("{0}+|,|+{1}+|,|+{2}+|,|+{3}", ID, Sign, Time,Responselevel);
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

	public int getTime() {
		return Time;
	}

	public void setTime(int time) {
		Time = time;
	}

}
