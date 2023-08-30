package com.mes.server.service.po.qms;

import java.io.Serializable;

/**
 * 点检项目 
 * @author ShrisJava
 *
 */
public class QMSCheckItem implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0; // 内部ID

	public int ItemID = 0; // 检验项目ID

	public String ItemText; // 检验项目文本

	public int MethodID = 0; // 检验方法ID

	public String MethodText; // 检验方法文本

	public float CheckValue = 0.0f;

	public boolean CheckResult = false;
	
	

	public QMSCheckItem() {
		this.ID = 0;
		this.ItemID = 0;
		this.MethodID = 0;
		this.CheckValue = 0.0f;
		this.ItemText = "";
		this.MethodText = "";
	}
}
