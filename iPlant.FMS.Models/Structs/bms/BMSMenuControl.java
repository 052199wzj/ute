package com.mes.server.service.po.bms;

import java.io.Serializable;
import java.util.List;
import java.util.List;

public class BMSMenuControl implements Serializable {

	private static final long serialVersionUID = 1L;
	
	public int ID = 0;

	public String Name = "";

	public String BackgroundUri = "";

	public boolean IsDisplay=false;

	public List<BMSItemControl> ItemControlList = new List<>();

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

	public String getBackgroundUri() {
		return BackgroundUri;
	}

	public void setBackgroundUri(String backgroundUri) {
		BackgroundUri = backgroundUri;
	}

	public boolean isIsDisplay() {
		return IsDisplay;
	}

	public void setIsDisplay(boolean isDisplay) {
		IsDisplay = isDisplay;
	}

	public List<BMSItemControl> getItemControlList() {
		return ItemControlList;
	}

	public void setItemControlList(List<BMSItemControl> itemControlList) {
		ItemControlList = itemControlList;
	}

	public BMSMenuControl() {
		this.ID=0;
		this.Name="";
		this.BackgroundUri="";
		this.IsDisplay=false;
		this.ItemControlList = new List<>();
	}
}
