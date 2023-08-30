package com.mes.server.service.po.ipt.biz;

import java.util.DateTime;

public class ModuleBindPackge {
	public int ID;
	/// <summary>
	/// 电容包编号
	/// </summary>
	public String PackgeNo;

	/// <summary>
	/// 模组编号
	/// </summary>
	public String PartNo;

	/// <summary>
	/// PCB编号
	/// </summary>
	public String PCBNo;

	/// <summary>
	/// 订单编号
	/// </summary>
	public String OrderNo;

	/// <summary>
	/// 创建时刻
	/// </summary>
	public DateTime CreateTime;
	/// <summary>
	/// 时刻
	/// </summary>
	public DateTime EditTime;
	/// <summary>
	/// 采集时刻
	/// </summary>
	public DateTime AcquisitionTime;

	/// <summary>
	/// 状态
	/// </summary>
	public int Active;

	public ModuleBindPackge() {
		PackgeNo = "";
		PartNo = "";
		OrderNo = "";
		EditTime = DateTime.Now;
		CreateTime = DateTime.Now;
		AcquisitionTime = DateTime.Now;
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getPackgeNo() {
		return PackgeNo;
	}

	public void setPackgeNo(String packgeNo) {
		PackgeNo = packgeNo;
	}

	public String getPartNo() {
		return PartNo;
	}

	public void setPartNo(String partNo) {
		PartNo = partNo;
	}

	public String getPCBNo() {
		return PCBNo;
	}

	public void setPCBNo(String pCBNo) {
		PCBNo = pCBNo;
	}

	public String getOrderNo() {
		return OrderNo;
	}

	public void setOrderNo(String orderNo) {
		OrderNo = orderNo;
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

	public DateTime getAcquisitionTime() {
		return AcquisitionTime;
	}

	public void setAcquisitionTime(DateTime acquisitionTime) {
		AcquisitionTime = acquisitionTime;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}
}
