package com.mes.server.service.po.sfc;

import java.io.Serializable; 

public class SFCProductShift implements Serializable {
	private static final long serialVersionUID = 1L;

 
	public int ShiftID = 0; 
	
	public double FQTYDone = 0;  
	 
	public double FQTYBad = 0;

	public int getShiftID() {
		return ShiftID;
	}

	public void setShiftID(int shiftID) {
		ShiftID = shiftID;
	}

	public double getFQTYDone() {
		return FQTYDone;
	}

	public void setFQTYDone(double fQTYDone) {
		FQTYDone = fQTYDone;
	}

	public double getFQTYBad() {
		return FQTYBad;
	}

	public void setFQTYBad(double fQTYBad) {
		FQTYBad = fQTYBad;
	}  
	
	
	
}
