package com.mes.server.service.po.bfc;

import java.io.Serializable;

public class BFCPlaceQRStruct implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public BFCPlaceQRStruct() {
		QRStart = "";
		QREnd = "";
	}

	private int QRType;

	private String QRStart;

	private String QREnd;

	private int MinLength;

	private int MaxLength;

	public int getQRType() {
		return QRType;
	}

	public void setQRType(int qRType) {
		QRType = qRType;
	}

	public String getQRStart() {
		return QRStart;
	}

	public void setQRStart(String qRStart) {
		QRStart = qRStart;
	}

	public String getQREnd() {
		return QREnd;
	}

	public void setQREnd(String qREnd) {
		QREnd = qREnd;
	}

	public int getMinLength() {
		return MinLength;
	}

	public void setMinLength(int minLength) {
		MinLength = minLength;
	}

	public int getMaxLength() {
		return MaxLength;
	}

	public void setMaxLength(int maxLength) {
		MaxLength = maxLength;
	}

}
