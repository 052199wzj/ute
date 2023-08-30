package com.mes.server.service.po.crm;

import java.io.Serializable;
import java.util.DateTime;

public class CRMSaleMeeting implements Serializable {
	private static final long serialVersionUID = 1L;
	public int ID;

    public int CustomerID;

    public String EventName;

    public String Address;

    public DateTime EventTime= DateTime.Now;

    public String EventText;

    public int Status;

    public String StatusText;

    public String Description;
    
    public int EditorID = 0;

	public String Editor = "";

	public DateTime EditTime = DateTime.Now;
	
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

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public String getStatusText() {
		return StatusText;
	}

	public void setStatusText(String statusText) {
		StatusText = statusText;
	}

	public String getDescription() {
		return Description;
	}

	public void setDescription(String description) {
		Description = description;
	}

	public int getEditorID() {
		return EditorID;
	}

	public void setEditorID(int editorID) {
		EditorID = editorID;
	}

	public String getEditor() {
		return Editor;
	}

	public void setEditor(String editor) {
		Editor = editor;
	}

	public DateTime getEditTime() {
		return EditTime;
	}

	public void setEditTime(DateTime editTime) {
		EditTime = editTime;
	}

	public CRMSaleMeeting()
    {
    	this.EventTime= DateTime.Now;
    	this.EditTime = DateTime.Now;
    }
}
