package com.mes.server.service.po.mrp;

import java.io.Serializable;

public class MRPStock implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID = 0; // ID

	public int MRPID = 0; // MRPID

	public int StockID = 0; // 仓库ID

	public String StockName = ""; // 仓库名称
	
	public MRPStock() {
		this.ID = 0;
		this.MRPID = 0;
		this.StockID = 0;
		this.StockName = "";
	}
}
