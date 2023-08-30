package com.mes.server.service.po.excel;

import java.io.Serializable;
import java.util.List;

/**
 * Excel数据
 * 
 * @author PengYouWang
 * @CreateTime 2020-1-11 14:04:36
 * @LastEditTime 2020-1-11 14:04:41
 *
 */
public class ExcelData implements Serializable {

	/**
	 * 序列号
	 */
	private static final long serialVersionUID = 1L;
	public int sheetSum;
	public String fileName;
	public List<ExcelSheetData> sheetData;

	public int getSheetSum() {
		return sheetSum;
	}

	public void setSheetSum(int sheetSum) {
		this.sheetSum = sheetSum;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public List<ExcelSheetData> getSheetData() {
		return sheetData;
	}

	public void setSheetData(List<ExcelSheetData> sheetData) {
		this.sheetData = sheetData;
	}
}
