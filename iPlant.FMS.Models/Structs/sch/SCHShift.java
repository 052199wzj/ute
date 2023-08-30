package com.mes.server.service.po.sch;

import java.io.Serializable;
import java.util.DateTime;

public class SCHShift implements Serializable {
	private static final long serialVersionUID = 1L;
	
	public int ID=0;
   
    public int ShiftID=0;
    
    public DateTime CreateTime= DateTime.Now;
  
    public int CreatorID=0;
   
    public int LineID=0;
   
    public int WorkShopID=0;
    
    public String Factory="";
   
    public String BusinessUnit="";
   
    public String WorkShop="";
   
    public String Line="";
   
    public String Creator="";
    
    public String ShiftName="";          //班次文本
   
    public int ModuleID=0;              //职能类别
   
    public String ModuleName="";         //职能文本
    
    public SCHShift()
    {
        this.ModuleName = "";
        this.ShiftName = "";
        this.Factory = "";
        this.BusinessUnit = "";
        this.Creator = "";
        this.CreateTime = DateTime.Now;
    
    }
    public SCHShift(int wLineID, int wWorkShopID, int wModuleID, int wShiftID)
    {
        this.ModuleName = "";
        this.ShiftName = "";
        this.ShiftID = wShiftID;
        this.ModuleID = wModuleID;
        this.WorkShopID = wWorkShopID;
        this.LineID = wLineID;
        this.Creator = "";
        this.CreateTime= DateTime.Now;
    }
    public SCHShift Clone()
    {
        SCHShift wItem = new SCHShift();
        wItem.ID = this.ID;
        wItem.ModuleID = this.ModuleID;
        wItem.ShiftID = this.ShiftID;
        wItem.ShiftName = this.ShiftName;
        wItem.ModuleName = this.ModuleName;

        wItem.CreatorID = this.CreatorID;
        wItem.CreateTime = this.CreateTime;
        wItem.LineID = this.LineID;
        wItem.WorkShopID = this.WorkShopID;

        wItem.Factory = this.Factory;
        wItem.BusinessUnit = this.BusinessUnit;
        wItem.WorkShop = this.WorkShop;
        wItem.Line = this.Line;
        wItem.Creator = this.Creator;
        return wItem;
    }
	public int ID {
		return ID;
	}
	public void setID(int iD) {
		ID = iD;
	}
	public int getShiftID() {
		return ShiftID;
	}
	public void setShiftID(int shiftID) {
		ShiftID = shiftID;
	}
	public DateTime getCreateTime() {
		return CreateTime;
	}
	public void setCreateTime(DateTime createTime) {
		CreateTime = createTime;
	}
	public int getCreatorID() {
		return CreatorID;
	}
	public void setCreatorID(int creatorID) {
		CreatorID = creatorID;
	}
	public int getLineID() {
		return LineID;
	}
	public void setLineID(int lineID) {
		LineID = lineID;
	}
	public int getWorkShopID() {
		return WorkShopID;
	}
	public void setWorkShopID(int workShopID) {
		WorkShopID = workShopID;
	}
	public String getFactory() {
		return Factory;
	}
	public void setFactory(String factory) {
		Factory = factory;
	}
	public String getBusinessUnit() {
		return BusinessUnit;
	}
	public void setBusinessUnit(String businessUnit) {
		BusinessUnit = businessUnit;
	}
	public String getWorkShop() {
		return WorkShop;
	}
	public void setWorkShop(String workShop) {
		WorkShop = workShop;
	}
	public String getLine() {
		return Line;
	}
	public void setLine(String line) {
		Line = line;
	}
	public String getCreator() {
		return Creator;
	}
	public void setCreator(String creator) {
		Creator = creator;
	}
	public String getShiftName() {
		return ShiftName;
	}
	public void setShiftName(String shiftName) {
		ShiftName = shiftName;
	}
	public int getModuleID() {
		return ModuleID;
	}
	public void setModuleID(int moduleID) {
		ModuleID = moduleID;
	}
	public String getModuleName() {
		return ModuleName;
	}
	public void setModuleName(String moduleName) {
		ModuleName = moduleName;
	}
    
}
