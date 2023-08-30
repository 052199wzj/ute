package com.mes.server.service.po.aps;

import java.io.Serializable;
import java.util.List;
import java.util.List;

public class APSEntryGant implements Serializable {
	private static final long serialVersionUID = 1L;
	public int ID = 0;
	// [DataMember(Name = "TaskLineList", Order = 1)]
	public List<APSTaskLine> TaskLineList = new List<>();
	// [DataMember(Name = "GantPartList", Order = 2)]
	public List<APSGantPart> GantPartList = new List<>();
	// [DataMember(Name = "ColumnList", Order = 3)]
	public List<APSColumn> ColumnList = new List<>();

	public APSEntryGant() {
		this.TaskLineList = new List<>();
		this.ColumnList = new List<>();
		this.GantPartList = new List<>();
	}
}
