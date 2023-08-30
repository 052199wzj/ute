package com.mes.server.service.po.mrp;

import java.io.Serializable;

public class MRPException implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0; // 错误ID

	public String Type = ""; // 错误类型

	public String MaterialNo = ""; // 物料号

	public String MaterialName = ""; // 物料名称

	public String ExceptionText = ""; // 异常描述

	public MRPException() {
		this.ID = 0;
		this.Type = "";
		this.MaterialNo = "";
		this.MaterialName = "";
		this.ExceptionText = "";
	}
}
