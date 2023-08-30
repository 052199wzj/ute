package com.mes.server.service.po.exc.base;

import java.io.Serializable; 
import java.util.DateTime; 
 
/**
 * 异常地点
 * @author ShrisJava
 *
 */
public class EXCStation implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	public long ID;
	/**
	 * 异常地点编码
	 */

	public String StationNo;
	/**
	 * 异常点名称（可选）
	 */

	public String StationName;

	/**
	 * 异常点类型
	 */

	public long StationType;
	/**
	 * 关联类型 可不使用
	 */

	public int RelevancyType;

	/**
	 * 关联ID 可不使用
	 */

	public long RelevancyID;

	/**
	 * 创建人
	 */

	public long CreatorID;
	///
	/// 创建时间
	///
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

	public EXCStation() {
		CreateTime = DateTime.Now;
		EditTime = DateTime.Now;
		StationName = "";
		StationNo = "";
	}

	public long ID {
		return ID;
	}

	public void setID(long iD) {
		ID = iD;
	}

	public String getStationNo() {
		return StationNo;
	}

	public void setStationNo(String stationNo) {
		StationNo = stationNo;
	}

	public String getStationName() {
		return StationName;
	}

	public void setStationName(String stationName) {
		StationName = stationName;
	}

	public long getStationType() {
		return StationType;
	}

	public void setStationType(long stationType) {
		StationType = stationType;
	}

	public int getRelevancyType() {
		return RelevancyType;
	}

	public void setRelevancyType(int relevancyType) {
		RelevancyType = relevancyType;
	}

	public long getRelevancyID() {
		return RelevancyID;
	}

	public void setRelevancyID(long relevancyID) {
		RelevancyID = relevancyID;
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
