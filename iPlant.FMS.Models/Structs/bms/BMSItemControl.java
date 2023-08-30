package com.mes.server.service.po.bms;

import java.io.Serializable; 

public class BMSItemControl implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public String Name = "";

	public String PageUri = "";

	public boolean IsDisplay = false;

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public String getPageUri() {
		return PageUri;
	}

	public void setPageUri(String pageUri) {
		PageUri = pageUri;
	}

	public boolean isIsDisplay() {
		return IsDisplay;
	}

	public void setIsDisplay(boolean isDisplay) {
		IsDisplay = isDisplay;
	}
	public BMSItemControl() {
		this.ID=0;
		this.Name="";
		this.PageUri="";
		this.IsDisplay=false;
	}
}
