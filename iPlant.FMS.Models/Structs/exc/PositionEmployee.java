package com.mes.server.service.po.exc;

import java.io.Serializable;
import java.util.List;
import java.util.List;

public class PositionEmployee implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public EXCOptionItem Confirmer;
	public EXCOptionItem Approver;
	public List<EXCOptionItem> ResponserList;

	public PositionEmployee() {

		Confirmer = new EXCOptionItem();
		Approver = new EXCOptionItem();
		ResponserList = new List<EXCOptionItem>();
	}

	public EXCOptionItem getConfirmer() {
		return Confirmer;
	}

	public void setConfirmer(EXCOptionItem confirmer) {
		Confirmer = confirmer;
	}

	public EXCOptionItem getApprover() {
		return Approver;
	}

	public void setApprover(EXCOptionItem approver) {
		Approver = approver;
	}

	public List<EXCOptionItem> getResponserList() {
		return ResponserList;
	}

	public void setResponserList(List<EXCOptionItem> responserList) {
		ResponserList = responserList;
	}

}
