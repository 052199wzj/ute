package com.mes.server.service.po.ipt.biz;

import java.util.List;
import java.util.List;

public class WDWReportModule {
	public int ID;
	/// <summary>
	/// 报工单ID 或自检单ID
	/// </summary>
	public int EntryPartID;
	/// <summary>
	/// 工件编号 模组的模组号 单体的为单体编号
	/// </summary>
	public String PartNo;
	/// <summary>
	/// 打包编号 模组的为电容包号 单体的为电容包编号
	/// </summary>
	public String PackgeNo;
	/// <summary>
	/// 标签编号 多模组打包的标签号
	/// </summary>
	public String LabelNo;

	/// <summary>
	/// 工件类型
	/// </summary>
	public int PartType;
	public boolean Result;
	public String Comment;
	/// <summary>
	/// 报工单类型
	/// </summary>
	public int EntryType;

	/// <summary>
	/// 容量
	/// </summary>
	public double Capacity;

	public String MainMaterialNo;

	public List<String> SubMaterialNoList;

	public WDWReportModule() {
		PartNo = "";
		PackgeNo = "";
		LabelNo = "";
		Capacity = 0.0;
		MainMaterialNo = "";
		SubMaterialNoList = new List<String>();
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getEntryPartID() {
		return EntryPartID;
	}

	public void setEntryPartID(int entryPartID) {
		EntryPartID = entryPartID;
	}

	public String getPartNo() {
		return PartNo;
	}

	public void setPartNo(String partNo) {
		PartNo = partNo;
	}

	public String getPackgeNo() {
		return PackgeNo;
	}

	public void setPackgeNo(String packgeNo) {
		PackgeNo = packgeNo;
	}

	public String getLabelNo() {
		return LabelNo;
	}

	public void setLabelNo(String labelNo) {
		LabelNo = labelNo;
	}

	public int getPartType() {
		return PartType;
	}

	public void setPartType(int partType) {
		PartType = partType;
	}

	public boolean isResult() {
		return Result;
	}

	public void setResult(boolean result) {
		Result = result;
	}

	public String getComment() {
		return Comment;
	}

	public void setComment(String comment) {
		Comment = comment;
	}

	public int getEntryType() {
		return EntryType;
	}

	public void setEntryType(int entryType) {
		EntryType = entryType;
	}

	public double getCapacity() {
		return Capacity;
	}

	public void setCapacity(double capacity) {
		Capacity = capacity;
	}

	public String getMainMaterialNo() {
		return MainMaterialNo;
	}

	public void setMainMaterialNo(String mainMaterialNo) {
		MainMaterialNo = mainMaterialNo;
	}

	public List<String> getSubMaterialNoList() {
		return SubMaterialNoList;
	}

	public void setSubMaterialNoList(List<String> subMaterialNoList) {
		SubMaterialNoList = subMaterialNoList;
	}
}
