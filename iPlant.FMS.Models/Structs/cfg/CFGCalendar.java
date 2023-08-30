package com.mes.server.service.po.cfg;

import java.io.Serializable;
import java.util.DateTime;

public class CFGCalendar implements Serializable {

	private static final long serialVersionUID = 1L;

	public DateTime HolidayDate = DateTime.Now; // 日期

	public int Year = 0; // 年

	public int Active = 0; // 激活

	public int OperatorID = 0; // 操作员ID

	public DateTime OperationTime = DateTime.Now; // 操作时刻

	public String OperatorName = ""; // 操作员

	public int WorkShopID = 0; // 车间

	public int LineID = 0; // 产线

	public int FactoryID = 0; // 工厂

	public CFGCalendar() {
		this.WorkShopID = 0;
		this.HolidayDate = DateTime.Now;
		this.Year = DateTime.Now.get(DateTime.YEAR);
		this.OperationTime = DateTime.Now;
		this.OperatorName = "";
	}
}
