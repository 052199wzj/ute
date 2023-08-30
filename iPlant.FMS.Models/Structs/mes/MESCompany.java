package com.mes.server.service.po.mes;

import java.io.Serializable;
import java.util.DateTime;

public class MESCompany implements Serializable {

	private static final long serialVersionUID = 1L;
	
	public int ID= 0;

    public String Name= "";

    public String LinkMan= "";

    public String Phone= "";

    public int Grad= 0;

    public String Creator= "";

    public String Manager= "";

    public String Auditor= "";

    public DateTime CreateTime= DateTime.Now;

    public DateTime EditTime= DateTime.Now;

    public DateTime AuditTime= DateTime.Now;

    public int Status= 0;

    public int Active= 0;

    public String Key= "";
    
    public MESCompany()
    {
    	this.Name= "";
    	this.LinkMan= "";
    	this.Phone= "";
    	
    	this.Creator= "";
    	this.Manager= "";
    	this.Auditor= "";
    	this.Key= "";
    	
    	this.CreateTime= DateTime.Now;
    	this.EditTime= DateTime.Now;
    	this.AuditTime= DateTime.Now;
    }
}
