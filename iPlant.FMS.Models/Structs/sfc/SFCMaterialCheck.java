package com.mes.server.service.po.sfc;

import java.io.Serializable;
import java.util.DateTime;

public class SFCMaterialCheck implements Serializable {

	private static final long serialVersionUID = 1L;
	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0; // ID
	// [DataMember(Name = "TaskID", Order = 1)]
	public int TaskID = 0; // 任务ID
	// [DataMember(Name = "TaskLevelID", Order = 2)]
	public int TaskLevelID = 0; // 任务层级ID（产线、工段、工序）
	// [DataMember(Name = "OperatorID", Order = 3)]
	public int OperatorID = 0; // 操作员
	// [DataMember(Name = "CheckTime", Order = 4)]
	public DateTime CheckTime = DateTime.Now; // 检查时刻
	// [DataMember(Name = "Result", Order = 5)]
	public boolean Result = false; // 检查结果
	// [DataMember(Name = "Remark", Order = 6)]
	public String Remark=""; // 备注信息

	public SFCMaterialCheck() {
		this.ID = 0;
		this.TaskID = 0;
		this.TaskLevelID = 0;
		this.OperatorID = 0;
		this.Result = false;
		this.CheckTime = DateTime.Now;
		this.Remark = "";
	}
}
