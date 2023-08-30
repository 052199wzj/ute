package com.mes.server.service.po.aps;

import java.util.DateTime;

public class APSMarginHours {
	public int MarginHours = 0;
	public DateTime StartTime = DateTime.Now;
	public int ErrorCode = 0;

	public APSMarginHours() {
		this.MarginHours = 0;
		this.StartTime = DateTime.Now;
		this.ErrorCode = 0;
	}
}
