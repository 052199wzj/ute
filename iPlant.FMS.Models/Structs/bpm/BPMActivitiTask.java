package com.mes.server.service.po.bpm;

import java.util.List;
import java.util.DateTime;
import java.util.List;

import com.mes.server.service.utils.StringUtils;

public class BPMActivitiTask {

	public String ID;

	/**
	 * 节点名称
	 */
	public String Name;

	public DateTime CreateTime;

	public String BusinessKey;

	public String Assignee;

	public String ProcessDefinitionId;

	public String ModuleID;

	public String ProcessDefinitionName;

	public String TaskType;

	public String ExecutionId;

	public int Status;

	public String ProcessInstanceId;

	/**
	 * 节点ID
	 */
	public String ActivitiID;

	public int CreateID;

	public String Recipients; // 任务通知人

	public String Owner; // 委托人

	public int delegationState; // 委托任务状态 0：非委托任务 1：委托任务待办 2：委托任务已办

	public DateTime dueDate; // 到期时间

	public List<BPMActivitiHisTask> HisTaskList = new List<BPMActivitiHisTask>();// 历史任务列表

	public List<BPMActivitiHisTaskVarinst> HisTaskVarinstList = new List<>();

	public String GetModule() {

		if (StringUtils.isEmpty(ProcessDefinitionId)) {
			ModuleID = "";
		} else {
			ModuleID = this.ProcessDefinitionId.split(":")[0];
		}

		return ModuleID;
	}

	public BPMActivitiTask() {
	}

	public String ID {
		return ID;
	}

	public void setID(String iD) {
		ID = iD;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public DateTime getCreateTime() {
		return CreateTime;
	}

	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}

	public String getBusinessKey() {
		return BusinessKey;
	}

	public void setBusinessKey(String businessKey) {
		BusinessKey = businessKey;
	}

	public String getAssignee() {
		return Assignee;
	}

	public void setAssignee(String assignee) {
		Assignee = assignee;
	}

	public String getProcessDefinitionId() {
		return ProcessDefinitionId;
	}

	public void setProcessDefinitionId(String processDefinitionId) {
		ProcessDefinitionId = processDefinitionId;
	}

	public String getModuleID() {
		return ModuleID;
	}

	public void setModuleID(String moduleID) {
		ModuleID = moduleID;
	}

	public String getProcessDefinitionName() {
		return ProcessDefinitionName;
	}

	public void setProcessDefinitionName(String processDefinitionName) {
		ProcessDefinitionName = processDefinitionName;
	}

	public String getTaskType() {
		return TaskType;
	}

	public void setTaskType(String taskType) {
		TaskType = taskType;
	}

	public String getExecutionId() {
		return ExecutionId;
	}

	public void setExecutionId(String executionId) {
		ExecutionId = executionId;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public String getProcessInstanceId() {
		return ProcessInstanceId;
	}

	public void setProcessInstanceId(String processInstanceId) {
		ProcessInstanceId = processInstanceId;
	}

	public String getActivitiID() {
		return ActivitiID;
	}

	public void setActivitiID(String activitiID) {
		ActivitiID = activitiID;
	}

	public int getCreateID() {
		return CreateID;
	}

	public void setCreateID(int createID) {
		CreateID = createID;
	}

	public List<BPMActivitiHisTask> getHisTaskList() {
		return HisTaskList;
	}

	public void setHisTaskList(List<BPMActivitiHisTask> hisTaskList) {
		HisTaskList = hisTaskList;
	}

	public List<BPMActivitiHisTaskVarinst> getHisTaskVarinstList() {
		return HisTaskVarinstList;
	}

	public void setHisTaskVarinstList(List<BPMActivitiHisTaskVarinst> hisTaskVarinstList) {
		HisTaskVarinstList = hisTaskVarinstList;
	}
}
