package com.mes.server.service.po.bfc;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class BFCHomePageGroup implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public BFCHomePageGroup() {
	}

	public int ID;

	public String Name = "";

	public String Icon = "";
	
	public String IconColor="";

	public String Icon_S="";
	
	public int Type = 0;
	
	public int GroupID=0;

	public int Active = 0;

	public int Grad = 0;
	
	/**
	 *  权限ID  为0不做权限控制
	 */
	public int RoleID=0;

	public DateTime CreateTime = DateTime.Now;

	public DateTime EditTime = DateTime.Now;

	public int CreatorID = 0;

	public int EditorID = 0;
	

	public int IsDefault = 0;

	public int OrderNum = 0;
	
	public int MessageCount=0;

	public List<BFCHomePageModule> ModuleList = new List<BFCHomePageModule>();

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

	public String getIcon() {
		return Icon;
	}

	public void setIcon(String icon) {
		Icon = icon;
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

	public List<BFCHomePageModule> getModuleList() {
		return ModuleList;
	}

	public void setModuleList(List<BFCHomePageModule> moduleList) {
		if (moduleList == null)
			moduleList = new List<BFCHomePageModule>();
		ModuleList = moduleList;
	}

	public int getOrderNum() {
		return OrderNum;
	}

	public void setOrderNum(int orderNum) {
		OrderNum = orderNum;
	}

	public int getIsDefault() {
		return IsDefault;
	}

	public void setIsDefault(int isDefault) {
		IsDefault = isDefault;
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

	public String getIconColor() {
		return IconColor;
	}

	public void setIconColor(String iconColor) {
		IconColor = iconColor;
	}
	

}
