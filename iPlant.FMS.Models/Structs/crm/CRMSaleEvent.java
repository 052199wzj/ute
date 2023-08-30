package com.mes.server.service.po.crm;

import java.io.Serializable;
import java.util.DateTime;

public class CRMSaleEvent implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID= 0;

	public int CustomerID= 0;

	public String EventName= "";

	public String Address= "";

	public DateTime EventTime = DateTime.Now;

	public String EventText= "";

	public int Type= 0;

	public int Status= 0;

	public String LinkMan= "";

	public String Description= "";

	public int Active= 0;

	public int ExecutorID= 0;

	public String StatusText= "";

	public String ExecutorName= "";

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

	public String getEventName() {
		return EventName;
	}

	public void setEventName(String eventName) {
		EventName = eventName;
	}

	public String getAddress() {
		return Address;
	}

	public void setAddress(String address) {
		Address = address;
	}

	public DateTime getEventTime() {
		return EventTime;
	}

	public void setEventTime(DateTime eventTime) {
		EventTime = eventTime;
	}

	public String getEventText() {
		return EventText;
	}

	public void setEventText(String eventText) {
		EventText = eventText;
	}

	public int getType() {
		return Type;
	}

	public void setType(int type) {
		Type = type;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public String getLinkMan() {
		return LinkMan;
	}

	public void setLinkMan(String linkMan) {
		LinkMan = linkMan;
	}

	public String getDescription() {
		return Description;
	}

	public void setDescription(String description) {
		Description = description;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public int getExecutorID() {
		return ExecutorID;
	}

	public void setExecutorID(int executorID) {
		ExecutorID = executorID;
	}

	public String getStatusText() {
		return StatusText;
	}

	public void setStatusText(String statusText) {
		StatusText = statusText;
	}

	public String getExecutorName() {
		return ExecutorName;
	}

	public void setExecutorName(String executorName) {
		ExecutorName = executorName;
	}

	public CRMSaleEvent() {
		this.EventTime = DateTime.Now;
	}
}
