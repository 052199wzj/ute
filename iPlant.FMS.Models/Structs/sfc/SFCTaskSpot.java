package com.mes.server.service.po.sfc;

import java.io.Serializable;
import java.util.DateTime;

import com.mes.server.service.po.fmc.FMCStation;
import com.mes.server.service.po.fmc.FMCWorkShop;
import com.mes.server.shristool.LoggerTool;
import com.mes.server.service.mesenum.SFCTaskType;
public class SFCTaskSpot implements Serializable {
	private static final long serialVersionUID = 1L;
	
	public int ID = 0;

    public int DeviceID = 0;        //多含义：车间ID|产线ID|设备ID|工位ID
   
    public String DeviceNo="";      //编码：二维码
 
    public String DeviceName="";
  
    public int TaskType = 0;

    public int ModuleVersionID = 0;  //版本（版本一旦用过，不允许修改，必须创建新版本）
  
    public int OperatorID = 0;       //操作员ID
  
    public int ShiftID = 0;          //班次
 
    public DateTime ActiveTime = DateTime.Now;  //任务激活时间
   
    public int Status = 0;           //任务状态
 
    public DateTime SubmitTime = DateTime.Now;  //任务提交时间
 
    public boolean Result=false;           //结果
   
    public int TaskMode = 0;
   
    public int Times = 0;
    //辅助属性
    
    public int WorkShopID = 0;
 
    public int LineID = 0;
 
    public String OperatorName="";     //操作员
   
    public String WorkShopName="";
   
    public String LineName="";
   
    public String TypeText="";
   
    public String ModeText="";
   
    public int EventID = 0;          //作业ID标识（枚举值）
    
    public SFCTaskSpot()
    {
    	this.ID=0;
    	this.DeviceID=0;
    	this.TaskType=0;
    	
    	this.ModuleVersionID=0;
    	this.OperatorID=0;
    	this.ShiftID=0;
    	this.TaskMode=0;
    	this.Times=0;
    	
    	this.WorkShopID=0;
    	this.LineID=0;
    	this.EventID=0;
    	
        this.Status = 0;
        this.DeviceNo=""; 
        this.DeviceName=""; 
        this.OperatorName=""; 
        this.WorkShopName=""; 
        this.LineName="";
        
        this.TypeText=""; 
        this.ModeText="";
        this.ActiveTime  = DateTime.Now;
        this.SubmitTime  = DateTime.Now;
    }
    public SFCTaskSpot(FMCStation wStation, SFCTaskType wTaskYype)
    {
        this.DeviceID = wStation.ID;
        this.DeviceNo = wStation.Code;
        this.TaskType = wTaskYype.getValue();
        this.Status = 0;
        this.ActiveTime  = DateTime.Now;
        this.SubmitTime  = DateTime.Now;
        this.ModuleVersionID = wStation.IPTModuleID;
        this.WorkShopID = wStation.WorkShopID;
        this.LineID = wStation.LineID;
    }
    public SFCTaskSpot(FMCWorkShop wWorkShop, SFCTaskType wTaskYype)
    {
        this.DeviceID = wWorkShop.ID;
        this.DeviceNo = wWorkShop.Code;
        this.TaskType = wTaskYype.getValue();
        this.Status = 0;
        this.ActiveTime  = DateTime.Now;
        this.SubmitTime  = DateTime.Now;
        this.ModuleVersionID = wWorkShop.IPTModuleID;
        this.WorkShopID = wWorkShop.ID;
        this.LineID = 0;
    }
    public SFCTaskSpot Clone()
    {
        SFCTaskSpot wTaskSpot = new SFCTaskSpot();
        try
        {
            wTaskSpot.DeviceID = this.DeviceID;
            wTaskSpot.DeviceNo = this.DeviceNo;
            wTaskSpot.TaskType = this.TaskType;
            wTaskSpot.Status = this.Status;
            wTaskSpot.ActiveTime = this.ActiveTime;
            wTaskSpot.SubmitTime = this.SubmitTime;
            wTaskSpot.ModuleVersionID = this.ModuleVersionID;
            wTaskSpot.WorkShopID = this.WorkShopID;
            wTaskSpot.LineID = this.LineID;
        }
        catch (Exception ex)
        {
            LoggerTool.SaveException("SFCService", "SFCTaskSpot Clone", ex);
        }
        return wTaskSpot;
    }
	public int ID {
		return ID;
	}
	public void setID(int iD) {
		ID = iD;
	}
	public int getDeviceID() {
		return DeviceID;
	}
	public void setDeviceID(int deviceID) {
		DeviceID = deviceID;
	}
	public String getDeviceNo() {
		return DeviceNo;
	}
	public void setDeviceNo(String deviceNo) {
		DeviceNo = deviceNo;
	}
	public String getDeviceName() {
		return DeviceName;
	}
	public void setDeviceName(String deviceName) {
		DeviceName = deviceName;
	}
	public int getTaskType() {
		return TaskType;
	}
	public void setTaskType(int taskType) {
		TaskType = taskType;
	}
	public int getModuleVersionID() {
		return ModuleVersionID;
	}
	public void setModuleVersionID(int moduleVersionID) {
		ModuleVersionID = moduleVersionID;
	}
	public int getOperatorID() {
		return OperatorID;
	}
	public void setOperatorID(int operatorID) {
		OperatorID = operatorID;
	}
	public int getShiftID() {
		return ShiftID;
	}
	public void setShiftID(int shiftID) {
		ShiftID = shiftID;
	}
	public DateTime getActiveTime() {
		return ActiveTime;
	}
	public void setActiveTime(DateTime activeTime) {
		ActiveTime = activeTime;
	}
	public int getStatus() {
		return Status;
	}
	public void setStatus(int status) {
		Status = status;
	}
	public DateTime getSubmitTime() {
		return SubmitTime;
	}
	public void setSubmitTime(DateTime submitTime) {
		SubmitTime = submitTime;
	}
	public boolean isResult() {
		return Result;
	}
	public void setResult(boolean result) {
		Result = result;
	}
	public int getTaskMode() {
		return TaskMode;
	}
	public void setTaskMode(int taskMode) {
		TaskMode = taskMode;
	}
	public int getTimes() {
		return Times;
	}
	public void setTimes(int times) {
		Times = times;
	}
	public int getWorkShopID() {
		return WorkShopID;
	}
	public void setWorkShopID(int workShopID) {
		WorkShopID = workShopID;
	}
	public int getLineID() {
		return LineID;
	}
	public void setLineID(int lineID) {
		LineID = lineID;
	}
	public String getOperatorName() {
		return OperatorName;
	}
	public void setOperatorName(String operatorName) {
		OperatorName = operatorName;
	}
	public String getWorkShopName() {
		return WorkShopName;
	}
	public void setWorkShopName(String workShopName) {
		WorkShopName = workShopName;
	}
	public String getLineName() {
		return LineName;
	}
	public void setLineName(String lineName) {
		LineName = lineName;
	}
	public String getTypeText() {
		return TypeText;
	}
	public void setTypeText(String typeText) {
		TypeText = typeText;
	}
	public String getModeText() {
		return ModeText;
	}
	public void setModeText(String modeText) {
		ModeText = modeText;
	}
	public int getEventID() {
		return EventID;
	}
	public void setEventID(int eventID) {
		EventID = eventID;
	}
}
