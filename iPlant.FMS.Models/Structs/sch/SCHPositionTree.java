package com.mes.server.service.po.sch;

import java.io.Serializable;
import java.util.List;
import java.util.List;

public class SCHPositionTree implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public int ID = 0;
	 

	public String Name = "";

	public int Level = 0;

	public List<SCHPositionTree> SonList = new List<SCHPositionTree>();

	public List<Int32> WorkerID = new List<>();

}
