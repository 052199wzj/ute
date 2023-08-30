package com.mes.server.service.po.ipt;

public class IPTValue {
	public long ID;

	public long StandardID;

	public long IPTItemID;

	public String Value;

	public String Remark;

	public int Result;

	public IPTValue() {
		Value = "";
		Result = 1;
		Remark = "";
	}

	public long ID {
		return ID;
	}

	public void setID(long iD) {
		ID = iD;
	}

	public long getStandardID() {
		return StandardID;
	}

	public void setStandardID(long standardID) {
		StandardID = standardID;
	}

	public long getIPTItemID() {
		return IPTItemID;
	}

	public void setIPTItemID(long iPTItemID) {
		IPTItemID = iPTItemID;
	}

	public String getValue() {
		return Value;
	}

	public void setValue(String value) {
		Value = value;
	}

	public String getRemark() {
		return Remark;
	}

	public void setRemark(String remark) {
		Remark = remark;
	}

	public int getResult() {
		return Result;
	}

	public void setResult(int result) {
		Result = result;
	}
}