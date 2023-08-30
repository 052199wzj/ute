package com.mes.server.service.po.ipt;

import java.util.List;
import java.util.List;

public class IPTItem {
	public long ID;

	public String Text;

	public int StandardType;

	public String StandardValue;

	public String StandardBaisc;

	public String DefaultValue;

	public double StandardLeft;

	public double StandardRight;

	public String Standard;

	public String Unit;

	public boolean Again;

	public boolean Visiable;

	public List<String> ValueSource;

	public IPTItem() {
		Text = "";
		StandardType = 0;
		Standard = "";
		StandardBaisc = "";
		StandardValue = "";
		DefaultValue = "";
		Unit = "";
		Again = false;
		ValueSource = new List<String>();
	}

	public long ID {
		return ID;
	}

	public void setID(long iD) {
		ID = iD;
	}

	public String getText() {
		return Text;
	}

	public void setText(String text) {
		Text = text;
	}

	public int getStandardType() {
		return StandardType;
	}

	public void setStandardType(int standardType) {
		StandardType = standardType;
	}

	public String getStandardValue() {
		return StandardValue;
	}

	public void setStandardValue(String standardValue) {
		StandardValue = standardValue;
	}

	public String getStandardBaisc() {
		return StandardBaisc;
	}

	public void setStandardBaisc(String standardBaisc) {
		StandardBaisc = standardBaisc;
	}

	public String getDefaultValue() {
		return DefaultValue;
	}

	public void setDefaultValue(String defaultValue) {
		DefaultValue = defaultValue;
	}

	public double getStandardLeft() {
		return StandardLeft;
	}

	public void setStandardLeft(double standardLeft) {
		StandardLeft = standardLeft;
	}

	public double getStandardRight() {
		return StandardRight;
	}

	public void setStandardRight(double standardRight) {
		StandardRight = standardRight;
	}

	public String getStandard() {
		return Standard;
	}

	public void setStandard(String standard) {
		Standard = standard;
	}

	public String getUnit() {
		return Unit;
	}

	public void setUnit(String unit) {
		Unit = unit;
	}

	public boolean isAgain() {
		return Again;
	}

	public void setAgain(boolean again) {
		Again = again;
	}

	public boolean isVisiable() {
		return Visiable;
	}

	public void setVisiable(boolean visiable) {
		Visiable = visiable;
	}

	public List<String> getValueSource() {
		return ValueSource;
	}

	public void setValueSource(List<String> valueSource) {
		ValueSource = valueSource;
	}
}
