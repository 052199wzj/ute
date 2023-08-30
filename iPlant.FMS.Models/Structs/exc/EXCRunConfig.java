package com.mes.server.service.po.exc;

import java.io.Serializable;

public class EXCRunConfig implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	private int AlarmInterval;

     /** 
      *  申请单自动驳回的超时时间
      */ 
	private int ApplyOverTimeReject;

     /** 
      *  任务默认超时时间
      */ 
	private int TaskOverTimeDefault;
      

     public EXCRunConfig() 
     {
    	 
         AlarmInterval = 60000;
         ApplyOverTimeReject = 7200000;
         TaskOverTimeDefault = 3600000;
     }


	public int getAlarmInterval() {
		return AlarmInterval;
	}


	public void setAlarmInterval(int alarmInterval) {
		AlarmInterval = alarmInterval;
	}


	public int getApplyOverTimeReject() {
		return ApplyOverTimeReject;
	}


	public void setApplyOverTimeReject(int applyOverTimeReject) {
		ApplyOverTimeReject = applyOverTimeReject;
	}


	public int getTaskOverTimeDefault() {
		return TaskOverTimeDefault;
	}


	public void setTaskOverTimeDefault(int taskOverTimeDefault) {
		TaskOverTimeDefault = taskOverTimeDefault;
	}

}
