package com.mes.server.service.po.excel;

import java.io.Serializable;
import java.util.List;

/**
 * 
 * @author PengYouWang
 * @CreateTime 2020-1-11 14:06:23
 * @LastEditTime 2020-1-11 14:06:27
 *
 */
public class ExcelSheetData implements Serializable {

	/**
	 * 序列号
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 工作簿名称
	 */
	public String sheetName;
	/**
	 * 表格总行数
	 */
	public int lineSum;
	/**
	 * 行数据集合
	 */
	public List<ExcelLineData> lineData;

	public String getSheetName() {
		return sheetName;
	}

	public void setSheetName(String sheetName) {
		this.sheetName = sheetName;
	}

	public int getLineSum() {
		return lineSum;
	}

	public void setLineSum(int lineSum) {
		this.lineSum = lineSum;
	}

	public List<ExcelLineData> getLineData() {
		return lineData;
	}

	public void setLineData(List<ExcelLineData> lineData) {
		this.lineData = lineData;
	}
}
