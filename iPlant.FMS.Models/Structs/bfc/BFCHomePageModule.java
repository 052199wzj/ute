package com.mes.server.service.po.bfc;

import java.io.Serializable;
import java.util.DateTime;

public class BFCHomePageModule implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public int ID;

	public String Name;

	public int GroupID;

	public int MessageCount;

	public int EventModule;

	public String Icon;
	
	public String IconColor="";

	public String Icon_S="";

	public String Url;

	public int Type;
	
	public int Grad = 0;
	
	/**
	 *  权限ID  为0不做权限控制   
	 */
	public int RoleID=0;

	public int Active;

	public DateTime CreateTime;

	public DateTime EditTime;

	public int CreatorID;

	public int EditorID;

	public int IsDefault;

	public String SecretKey;

	public int OrderNum;
	
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

	public int getGroupID() {
		return GroupID;
	}

	public void setGroupID(int groupID) {
		GroupID = groupID;
	}

	public int getMessageCount() {
		return MessageCount;
	}

	public void setMessageCount(int messageCount) {
		MessageCount = messageCount;
	}

	public String getIcon() {
		return Icon;
	}

	public void setIcon(String icon) {
		Icon = icon;
	}

	public String getUrl() {
		return Url;
	}

	public void setUrl(String url) {
		Url = url;
	}

	public int getType() {
		return Type;
	}

	public void setType(int type) {
		Type = type;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public DateTime getEditTime() {
		return EditTime;
	}

	public void setEditTime(DateTime editTime) {
		EditTime = editTime;
	}

	public int getCreatorID() {
		return CreatorID;
	}

	public void setCreatorID(int creatorID) {
		CreatorID = creatorID;
	}

	public int getEditorID() {
		return EditorID;
	}

	public void setEditorID(int editorID) {
		EditorID = editorID;
	}

	public int getIsDefault() {
		return IsDefault;
	}

	public void setIsDefault(int isDefault) {
		IsDefault = isDefault;
	}

	public String getSecretKey() {
		return SecretKey;
	}

	public void setSecretKey(String secretKey) {
		SecretKey = secretKey;
	}

	public int getOrderNum() {
		return OrderNum;
	}

	public void setOrderNum(int orderNum) {
		OrderNum = orderNum;
	}

	public int getEventModule() {
		return EventModule;
	}

	public void setEventModule(int eventModule) {
		EventModule = eventModule;
	}

	public BFCHomePageModule() {
	}

	public int getGrad() {
		return Grad;
	}

	public void setGrad(int grad) {
		Grad = grad;
	}

	public String getIcon_S() {
		return Icon_S;
	}

	public void setIcon_S(String icon_S) {
		Icon_S = icon_S;
	}

	public int getRoleID() {
		return RoleID;
	}

	public void setRoleID(int roleID) {
		RoleID = roleID;
	}

	public String getIconColor() {
		return IconColor;
	}

	public void setIconColor(String iconColor) {
		IconColor = iconColor;
	}
}
