package com.mes.server.service.po.exc.base;

import java.io.Serializable;
import java.util.DateTime;

/**
 * 异常地点类型
 * @author ShrisJava
 *
 */
public class EXCStationType implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	public long ID;
	/**
	 * 类型名称
	 */
	public String Name;
	/**
	 * 关联类型 可不使用
	 */
	public int RelevancyType;

	/**
	 * 创建人
	 */
	public long CreatorID;
	/**
	 * 创建时间
	 */
	public DateTime CreateTime;

	/**
	 * 录入人
	 */
	public long EditorID;
	/**
	 * 录入时间
	 */
	public DateTime EditTime;

	/**
	 * 状态
	 */
	public int Active;

	public EXCStationType() {
		CreateTime = DateTime.Now;
		EditTime = DateTime.Now;
		Name = "";
	}

	public long ID {
		return ID;
	}

	public void setID(long iD) {
		ID = iD;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public int getRelevancyType() {
		return RelevancyType;
	}

	public void setRelevancyType(int relevancyType) {
		RelevancyType = relevancyType;
	}

	public long getCreatorID() {
		return CreatorID;
	}

	public void setCreatorID(long creatorID) {
		CreatorID = creatorID;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public long getEditorID() {
		return EditorID;
	}

	public void setEditorID(long editorID) {
		EditorID = editorID;
	}

	public DateTime getEditTime() {
		return EditTime;
	}

	public void setEditTime(DateTime editTime) {
		EditTime = editTime;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}
}
