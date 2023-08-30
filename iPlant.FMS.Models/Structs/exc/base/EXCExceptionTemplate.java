package com.mes.server.service.po.exc.base;

import java.io.Serializable; 

import com.mes.server.service.po.exc.define.EXCResourceTypes;
import com.mes.server.service.po.exc.define.EXCTemplates;

public class EXCExceptionTemplate implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public int EXCTemplate;
	public int EXCRequestType;
	public int EXCResponseType;
	public int EXCConfirmType;

	public EXCExceptionTemplate(int wEXCTemplate, int wEXCRequestType, int wEXCResponseType, int wEXCConfirmType) {
		EXCTemplate = wEXCTemplate;
		EXCRequestType = wEXCRequestType;
		EXCResponseType = wEXCResponseType;
		EXCConfirmType = wEXCConfirmType;
	}

	public EXCExceptionTemplate(EXCTemplates wEXCTemplate, EXCResourceTypes wEXCRequestType,
			EXCResourceTypes wEXCResponseType, EXCResourceTypes wEXCConfirmType) {
		EXCTemplate = wEXCTemplate.getValue();
		EXCRequestType = wEXCRequestType.getValue();
		EXCResponseType = wEXCResponseType.getValue();
		EXCConfirmType = wEXCConfirmType.getValue();
	}

	public int getEXCTemplate() {
		return EXCTemplate;
	}

	public void setEXCTemplate(int eXCTemplate) {
		EXCTemplate = eXCTemplate;
	}

	public int getEXCRequestType() {
		return EXCRequestType;
	}

	public void setEXCRequestType(int eXCRequestType) {
		EXCRequestType = eXCRequestType;
	}

	public int getEXCResponseType() {
		return EXCResponseType;
	}

	public void setEXCResponseType(int eXCResponseType) {
		EXCResponseType = eXCResponseType;
	}

	public int getEXCConfirmType() {
		return EXCConfirmType;
	}

	public void setEXCConfirmType(int eXCConfirmType) {
		EXCConfirmType = eXCConfirmType;
	}
}
