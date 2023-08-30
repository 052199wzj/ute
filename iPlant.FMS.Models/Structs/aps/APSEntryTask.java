package com.mes.server.service.po.aps;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class APSEntryTask implements Serializable {
	private static final long serialVersionUID = 1L;

	// [DataMember(Name = "ID", Order = 0)]
	public int ID= 0;
	// [DataMember(Name = "TaskID", Order = 1)]
	public int TaskID= 0; // 加工单元ID
	// [DataMember(Name = "TaskName", Order = 2)]
	public String TaskName= ""; // 加工单元名称
	// [DataMember(Name = "UnitID", Order = 3)]
	public int UnitID= 0; // 加工单元ID
	// [DataMember(Name = "UnitName", Order = 4)]
	public String UnitName= ""; // 加工单元名称
	// [DataMember(Name = "UnitCode", Order = 5)]
	public String UnitCode= ""; // 加工单元编码
	// [DataMember(Name = "UnitLevel", Order = 6)]
	public int UnitLevel= 0; // 加工单元类型
	// [DataMember(Name = "ProductNo", Order = 7)]
	public String ProductNo= "";
	// [DataMember(Name = "MaterialNo", Order = 8)]
	public String MaterialNo= "";
	// [DataMember(Name = "MaterialName", Order = 9)]
	public String MaterialName= ""; // 加工成品的物料名称
	// [DataMember(Name = "FQTY", Order = 10)]
	public float FQTY= 0.0f; // 计划数
	// [DataMember(Name = "WorkHour", Order = 11)]
	public int WorkHour= 0;// 单位1s
	// [DataMember(Name = "WorkHours", Order = 12)]
	public int WorkHours= 0; // 总工时
	// [DataMember(Name = "Shifts", Order = 13)]
	public float Shifts= 0.0f; // 排班班次数
	// [DataMember(Name = "CreateTime", Order = 14)]
	public DateTime CreateTime = DateTime.Now; // 创建时刻
	// [DataMember(Name = "Status", Order = 15)]
	public int Status= 0; // 状态
	// [DataMember(Name = "ShiftHours", Order = 16)]
	public int ShiftHours= 0; // 单班标准工时
	// [DataMember(Name = "StartTime", Order = 17)]
	public DateTime StartTime = DateTime.Now; // 开始时刻
	// [DataMember(Name = "FinishedTime", Order = 18)]
	public DateTime FinishedTime = DateTime.Now; // 完成时刻
	// [DataMember(Name = "MessageList", Order = 19)]
	public List<APSMessage> MessageList = new List<>(); // 异常消息

	public APSEntryTask() {
		this.ID = 0;
		this.TaskID= 0;
		this.TaskName = "";
		this.UnitID= 0;
		this.UnitName = "";
		this.UnitCode = "";
		this.UnitLevel= 0;
		this.ProductNo = "";
		this.MaterialNo = "";
		this.MaterialName = "";
		this.FQTY= 0.0f;
		this.WorkHour= 0;
		this.WorkHours= 0;
		this.Shifts= 0.0f;
		this.CreateTime = DateTime.Now;
		this.Status= 0;
		this.ShiftHours= 0;
		this.StartTime = DateTime.Now;
		this.FinishedTime = DateTime.Now;
		this.MessageList = new List<>();
		
	}
}
