package com.mes.server.service.po.bfc;

import java.io.Serializable;

public class BFCAuditVersion implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public String VersionNo = "";
	public int EventModule = 0;
	public String EventModuleName = "";
	public int Active = 0;

	public BFCAuditVersion() {
	}

	public String getVersionNo() {
		return VersionNo;
	}

	public void setVersionNo(String versionNo) {
		VersionNo = versionNo;
	}

	public int getEventModule() {
		return EventModule;
	}

	public void setEventModule(int eventModule) {
		EventModule = eventModule;
	}

	public String getEventModuleName() {
		return EventModuleName;
	}

	public void setEventModuleName(String eventModuleName) {
		EventModuleName = eventModuleName;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

}
