package com.mes.server.service.po.crm;

import java.io.Serializable;
import java.util.DateTime;

public class CRMSaleOrderItem implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public int OrderID = 0;

	public int ItemID = 0;

	public String ItemName = "";

	public String ItemCode = "";

	public float FQTY = 0.0f;

	public float Price = 0.0f;

	public int UnitID = 0; // 数量单位

	public String Address = ""; // 收货地址

	public String LinkMan = ""; // 联系人

	public String Phone = ""; // 联系电话

	public int Status = 0; // 订单状态

	public String Description = "";

	public int Active = 0;

	public String UnitName = "";

	public String StatusText = "";

	public float FQTYDelivery = 0.0f; // 发货数量

	public int BOMID = 0; // BOMID

	public int EditorID = 0;

	public String Editor = "";

	public DateTime EditTime = DateTime.Now;

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getOrderID() {
		return OrderID;
	}

	public void setOrderID(int orderID) {
		OrderID = orderID;
	}

	public int getItemID() {
		return ItemID;
	}

	public void setItemID(int itemID) {
		ItemID = itemID;
	}

	public String getItemName() {
		return ItemName;
	}

	public void setItemName(String itemName) {
		ItemName = itemName;
	}

	public String getItemCode() {
		return ItemCode;
	}

	public void setItemCode(String itemCode) {
		ItemCode = itemCode;
	}

	public float getFQTY() {
		return FQTY;
	}

	public void setFQTY(float fQTY) {
		FQTY = fQTY;
	}

	public float getPrice() {
		return Price;
	}

	public void setPrice(float price) {
		Price = price;
	}

	public int getUnitID() {
		return UnitID;
	}

	public void setUnitID(int unitID) {
		UnitID = unitID;
	}

	public String getAddress() {
		return Address;
	}

	public void setAddress(String address) {
		Address = address;
	}

	public String getLinkMan() {
		return LinkMan;
	}

	public void setLinkMan(String linkMan) {
		LinkMan = linkMan;
	}

	public String getPhone() {
		return Phone;
	}

	public void setPhone(String phone) {
		Phone = phone;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
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

	public String getUnitName() {
		return UnitName;
	}

	public void setUnitName(String unitName) {
		UnitName = unitName;
	}

	public String getStatusText() {
		return StatusText;
	}

	public void setStatusText(String statusText) {
		StatusText = statusText;
	}

	public float getFQTYDelivery() {
		return FQTYDelivery;
	}

	public void setFQTYDelivery(float fQTYDelivery) {
		FQTYDelivery = fQTYDelivery;
	}

	public int getBOMID() {
		return BOMID;
	}

	public void setBOMID(int bOMID) {
		BOMID = bOMID;
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

	public CRMSaleOrderItem() {
		this.EditTime = DateTime.Now;
	}
}
