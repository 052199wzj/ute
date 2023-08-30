package com.mes.server.service.po.scm;

import java.io.Serializable;
import java.util.DateTime;

public class SCMArrivalItem implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public int OrderID = 0;

	public float ArrivalFQTY = 0.0f;

	public int OperatorID = 0;

	public String Operator = "";

	public DateTime ArrivalTime = DateTime.Now;

	public float InStockFQTY = 0.0f;

	public int AuditorID = 0;

	public String Auditor = "";

	public DateTime InStockTime = DateTime.Now; // 入库时刻

	public int Status = 0; // 订单状态

	public String StatusText = "";

	public SCMArrivalItem() {
		this.ID = 0;
		this.OrderID = 0;
		this.OperatorID = 0;
		this.AuditorID = 0;
		this.Status = 0;

		this.ArrivalFQTY = 0.0f;
		this.InStockFQTY = 0.0f;

		this.Operator = "";
		this.Auditor = "";
		this.StatusText = "";

		this.ArrivalTime = DateTime.Now;
		this.InStockTime = DateTime.Now;
	}
}
