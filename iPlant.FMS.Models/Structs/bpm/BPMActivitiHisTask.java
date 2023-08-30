package com.mes.server.service.po.bpm;

import java.util.List;
import java.util.DateTime;
import java.util.List;

public class BPMActivitiHisTask {

	public String ID = "";

	public String ProcessDefinitionId = "";

	public String ActivitiID = "";

	public String ProcessInstanceId = "";

	public String ExecutionId = "";

	public String Name = "";

	public String Description = "";

	public String Assignee = "";

	public String Owner;// 委托人

	public DateTime dueDate; // 到期时间

	public DateTime StartTime = DateTime.Now;

	public DateTime EndTime = DateTime.Now;

	public List<BPMActivitiHisTaskVarinst> HisTaskVarinstList = new List<BPMActivitiHisTaskVarinst>();

}
