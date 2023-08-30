package com.mes.server.service.po.cfg;

import java.io.Serializable;

public class CFGItem implements Serializable {

	private static final long serialVersionUID = 1L;
	public int ID = 0;;

	public String ItemName = "";

	public String ItemText = "";

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getItemName() {
		return ItemName;
	}

	public void setItemName(String itemName) {
		ItemName = itemName;
	}

	public String getItemText() {
		return ItemText;
	}

	public void setItemText(String itemText) {
		ItemText = itemText;
	}

	public CFGItem() {
		this.ItemName = "";
		this.ItemText = "";
	}

	public CFGItem Clone() {
		CFGItem wItem = new CFGItem();
		wItem.ID = this.ID;
		wItem.ItemName = this.ItemName;
		wItem.ItemText = this.ItemText;
		return wItem;
	}
}
