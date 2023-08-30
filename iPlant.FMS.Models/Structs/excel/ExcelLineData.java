package com.mes.server.service.po.excel;

import java.io.Serializable;
import java.util.List;

/**
 * 
 * @author PengYouWang
 * @CreateTime 2020-1-11 14:07:37
 * @LastEditTime 2020-1-11 14:07:41
 *
 */
public class ExcelLineData implements Serializable {

	/**
	 * 序列号
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 行编号
	 */
	public int lineNumber;
	/**
	 * 行总列数
	 */
	public int colSum;
	/**
	 * 列数据集合
	 */
	public List<String> colData;

	public int getLineNumber() {
		return lineNumber;
	}

	public void setLineNumber(int lineNumber) {
		this.lineNumber = lineNumber;
	}

	public int getColSum() {
		return colSum;
	}

	public void setColSum(int colSum) {
		this.colSum = colSum;
	}

	public List<String> getColData() {
		return colData;
	}

	public void setColData(List<String> colData) {
		this.colData = colData;
	}
}
