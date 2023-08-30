package com.mes.server.service.po.bfc;

import java.io.Serializable;

import com.mes.server.service.mesenum.FPCCustomProperty;

public class FPCCustomStruct implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int PropertyID;
	/// <summary>
	/// LongText ArrayOneControl ArrayControl ArrayOne Array
	/// DateTime Date Time InputArray Readonly Number String Bool
	/// </summary>
	private String PropertyType;

	private String PropertyName;

	public FPCCustomStruct() {
		PropertyName = "";
	}

	public FPCCustomStruct(FPCCustomProperty wFPCCustomProperty) {
		PropertyID = wFPCCustomProperty.getValue();
		PropertyName = wFPCCustomProperty.getLable();
		switch (wFPCCustomProperty) {
		case Default:
			PropertyType = "String";
			break;
		case SeriesThree:
			PropertyType = "Bool";
			break;
		case RepeatMeasure:
			PropertyType = "Bool";
			break;
		default:
			break;
		}
	}

	public int getPropertyID() {
		return PropertyID;
	}

	public void setPropertyID(int propertyID) {
		PropertyID = propertyID;
	}

	public String getPropertyType() {
		return PropertyType;
	}

	public void setPropertyType(String propertyType) {
		PropertyType = propertyType;
	}

	public String getPropertyName() {
		return PropertyName;
	}

	public void setPropertyName(String propertyName) {
		PropertyName = propertyName;
	}

}
