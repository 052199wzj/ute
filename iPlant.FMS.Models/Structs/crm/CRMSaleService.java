package com.mes.server.service.po.crm;

import java.io.Serializable;
import java.util.DateTime;

public class CRMSaleService implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public int CustomerID = 0;

	public String ServiceName = "";

	public String ContentText = "";

	public String TypeText;

	public int Type = 0;

	public DateTime StartTime = DateTime.Now;

	public DateTime EndTime = DateTime.Now;

	public int ExecutorID = 0;

	public String Executor = "";

	public String Description = "";

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getCustomerID() {
		return CustomerID;
	}

	public void setCustomerID(int customerID) {
		CustomerID = customerID;
	}

	public String getServiceName() {
		return ServiceName;
	}

	public void setServiceName(String serviceName) {
		ServiceName = serviceName;
	}

	public String getContentText() {
		return ContentText;
	}

	public void setContentText(String contentText) {
		ContentText = contentText;
	}

	public String getTypeText() {
		return TypeText;
	}

	public void setTypeText(String typeText) {
		TypeText = typeText;
	}

	public int getType() {
		return Type;
	}

	public void setType(int type) {
		Type = type;
	}

	public DateTime getStartTime() {
		return StartTime;
	}

	public void setStartTime(DateTime startTime) {
		StartTime = startTime;
	}

	public DateTime getEndTime() {
		return EndTime;
	}

	public void setEndTime(DateTime endTime) {
		EndTime = endTime;
	}

	public int getExecutorID() {
		return ExecutorID;
	}

	public void setExecutorID(int executorID) {
		ExecutorID = executorID;
	}

	public String getExecutor() {
		return Executor;
	}

	public void setExecutor(String executor) {
		Executor = executor;
	}

	public String getDescription() {
		return Description;
	}

	public void setDescription(String description) {
		Description = description;
	}

	public CRMSaleService() {
		this.StartTime = DateTime.Now;
		this.EndTime = DateTime.Now;
	}
}
