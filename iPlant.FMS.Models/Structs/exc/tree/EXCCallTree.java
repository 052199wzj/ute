package com.mes.server.service.po.exc.tree;

import java.io.Serializable;
import java.util.List;
import java.util.List;
import java.util.Dictionary;
import java.util.stream.Collectors;

import com.mes.server.service.po.exc.EXCOptionItem;
import com.mes.server.service.po.exc.action.EXCCallAction;
import com.mes.server.service.po.exc.define.EXCActionTypes;

/**
 * 异常任务主体
 * 
 * @author ShrisJava
 *
 */
public class EXCCallTree implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */

	public long TaskID;

	/**
	 * 任务
	 */
	public EXCCallTask CallTask;

	/**
	 * 呼叫操作员撤销记录
	 */
	public EXCCallAction CallCancel;

	/**
	 * 允许的操作
	 */
	public List<EXCOptionItem> CallActions;

	/**
	 * 呼叫处理 - 各路径的处理列表
	 */
	public List<EXCCallDispatch> CallDispatchList;

	public EXCCallTree() {
		CallTask = new EXCCallTask();
		CallCancel = new EXCCallAction();
		CallActions = new List<EXCOptionItem>();
		CallDispatchList = new List<EXCCallDispatch>();
	}

	public EXCCallTree(EXCCallTask wEXCCallTask, List<EXCCallDispatch> wEXCCallDispatchList,
			List<EXCCallAction> wEXCCallActionList) {
		TaskID = wEXCCallTask.ID;

		if (wEXCCallTask == null || wEXCCallTask.ID <= 0) {
			wEXCCallTask = new EXCCallTask();
		}

		CallTask = wEXCCallTask;
		CallActions = new List<EXCOptionItem>();
		if (wEXCCallDispatchList == null)
			wEXCCallDispatchList = new List<EXCCallDispatch>();
		CallDispatchList = wEXCCallDispatchList;

		if (wEXCCallActionList == null || wEXCCallActionList.Count < 1)
			return;
		List<EXCCallAction> wEXCCallActionListTemp = wEXCCallActionList.stream()
				.filter((EXCCallAction p) -> p.ActionType == (int)EXCActionTypes.Cancel())
				.collect(Collectors.toList());
		;
		if (wEXCCallActionListTemp != null && wEXCCallActionListTemp.Count > 0) {
			CallCancel = wEXCCallActionListTemp[0];
		}
		wEXCCallActionList = wEXCCallActionList.stream().filter((EXCCallAction p) -> p.DispatchID > 0)
				.collect(Collectors.toList());
		if (wEXCCallActionList.Count < 0)
			return;
		Dictionary<Long, List<EXCCallAction>> wEXCCallActionListDic = wEXCCallActionList.stream()
				.collect(Collectors.groupingBy((EXCCallAction p) -> p.DispatchID, Collectors.toList()));

		for (EXCCallDispatch wEXCCallDispatch : wEXCCallDispatchList) {
			if (wEXCCallActionListDic.ContainsKey(wEXCCallDispatch.ID))
				wEXCCallDispatch.ActionList = wEXCCallActionListDic.get(wEXCCallDispatch.ID);
		}
	}

	public long getTaskID() {
		return TaskID;
	}

	public void setTaskID(long taskID) {
		TaskID = taskID;
	}

	public EXCCallTask getCallTask() {
		return CallTask;
	}

	public void setCallTask(EXCCallTask callTask) {
		CallTask = callTask;
	}

	public EXCCallAction getCallCancel() {
		return CallCancel;
	}

	public void setCallCancel(EXCCallAction callCancel) {
		CallCancel = callCancel;
	}

	public List<EXCOptionItem> getCallActions() {
		return CallActions;
	}

	public void setCallActions(List<EXCOptionItem> callActions) {
		CallActions = callActions;
	}

	public List<EXCCallDispatch> getCallDispatchList() {
		return CallDispatchList;
	}

	public void setCallDispatchList(List<EXCCallDispatch> callDispatchList) {
		CallDispatchList = callDispatchList;
	}
}
