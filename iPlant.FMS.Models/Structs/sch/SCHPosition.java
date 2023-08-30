package com.mes.server.service.po.sch;

import java.util.List;
import java.util.List;

import com.mes.server.service.po.bmm.BMMPosition;

public class SCHPosition extends BMMPosition {
	private static final long serialVersionUID = 1L;

	public int PositionID = 0;

	public List<Int32> WorkerID = new List<>();

	public String WorkerName = "";

	public String DepartmentName = "";

	public String PositionName = "";

	public String TemplateCode = "";

	public SCHPosition() {
		super();
	}

	public SCHPosition(BMMPosition wPosition) {
		super(wPosition);

		this.PositionID = wPosition.ID;
		this.PositionName = wPosition.Name; 
	}

	public int getPositionID() {
		return PositionID;
	}

	public void setPositionID(int positionID) {
		PositionID = positionID;
	}

}
