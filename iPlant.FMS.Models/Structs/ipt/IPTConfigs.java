package com.mes.server.service.po.ipt;

import java.io.Serializable;

public class IPTConfigs  implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private int KeepDay = 30;

	private int KeepDayMin = 14;

	private int TOPNumMin = 15;

	private int TOPNumMax = 100;

	private int TOPNum = 50;

	public int getKeepDay() {
		return KeepDay;
	}

	public void setKeepDay(int keepDay) {
		KeepDay = keepDay;
	}

	public int getKeepDayMin() {
		return KeepDayMin;
	}

	public void setKeepDayMin(int keepDayMin) {
		KeepDayMin = keepDayMin;
	}

	public int getTOPNumMin() {
		return TOPNumMin;
	}

	public void setTOPNumMin(int tOPNumMin) {
		TOPNumMin = tOPNumMin;
	}

	public int getTOPNumMax() {
		return TOPNumMax;
	}

	public void setTOPNumMax(int tOPNumMax) {
		TOPNumMax = tOPNumMax;
	}

	public int getTOPNum() {
		return TOPNum;
	}

	public void setTOPNum(int tOPNum) {
		TOPNum = tOPNum;
	}
}
