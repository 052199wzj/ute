package com.mes.server.service.po.ipt;

import java.util.DateTime;

public class IPTSharpener {
	public int ID;

	/// <summary>
	/// 规格
	/// </summary>
	public String SharpenerNo;
	/// <summary>
	/// BOM的编号
	/// </summary>
	public String BomID;

	/// <summary>
	/// 磨具类型 如砂轮 油石
	/// </summary>
	public int Type;
	/// <summary>
	/// 硬度
	/// </summary>
	public String Hardness;

	/// <summary>
	/// 粒度
	/// </summary>
	public String Granularity;

	/// <summary>
	/// 材料
	/// </summary>
	public String Material;

	/// <summary>
	/// 外径或长度
	/// </summary>
	public Double WJORLength;

	/// <summary>
	/// 内孔或宽度
	/// </summary>
	public Double NKORWidth;

	/// <summary>
	/// 厚度或高度
	/// </summary>
	public Double Height;
	/// <summary>
	/// 状态 是否使用
	/// </summary>
	public int Status;

	/// <summary>
	/// 创建时间
	/// </summary>
	public DateTime CreateTime;

	/// <summary>
	/// 更新时间
	/// </summary>
	public DateTime UpdateTime;

	/**
	 *  
	 */
	public int OperatorID;
	

	public IPTSharpener() {
		Material = "";
		BomID = "";
		CreateTime = DateTime.Now;
		Type = 0;
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getSharpenerNo() {
		return SharpenerNo;
	}

	public void setSharpenerNo(String sharpenerNo) {
		SharpenerNo = sharpenerNo;
	}

	public String getBomID() {
		return BomID;
	}

	public void setBomID(String bomID) {
		BomID = bomID;
	}

	public int getType() {
		return Type;
	}

	public void setType(int type) {
		Type = type;
	}

	public String getHardness() {
		return Hardness;
	}

	public void setHardness(String hardness) {
		Hardness = hardness;
	}

	public String getGranularity() {
		return Granularity;
	}

	public void setGranularity(String granularity) {
		Granularity = granularity;
	}

	public String getMaterial() {
		return Material;
	}

	public void setMaterial(String material) {
		Material = material;
	}

	public Double getWJORLength() {
		return WJORLength;
	}

	public void setWJORLength(Double wJORLength) {
		WJORLength = wJORLength;
	}

	public Double getNKORWidth() {
		return NKORWidth;
	}

	public void setNKORWidth(Double nKORWidth) {
		NKORWidth = nKORWidth;
	}

	public Double getHeight() {
		return Height;
	}

	public void setHeight(Double height) {
		Height = height;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public DateTime getUpdateTime() {
		return UpdateTime;
	}

	public void setUpCalendar(DateTime updateTime) {
		UpdateTime = updateTime;
	}

	public int getOperatorID() {
		return OperatorID;
	}

	
	public void setOperatorID(int operatorID) {
		OperatorID = operatorID;
	}

	 
}
