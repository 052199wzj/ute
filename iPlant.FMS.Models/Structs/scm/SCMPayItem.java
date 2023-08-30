package com.mes.server.service.po.scm;

import java.io.Serializable;
import java.util.DateTime;

public class SCMPayItem implements Serializable {
	private static final long serialVersionUID = 1L;
	
	public int ID = 0;

    public int OrderID = 0;
 
    public String OrderNo="";
    
    public int SupplierID = 0;
  
    public String SupplierName="";
  
    public String SupplierCode="";
  
    public float Money=0.0f;
   
    public int UnitID = 0;
   
    public int OperatorID = 0;        //申请人
   
    public String Operator="";       //申请人
   
    public DateTime ApplyTime= DateTime.Now;    //申请时间
  
    public int AuditorID = 0;         //审核人
    
    public String Auditor="";        //审核人
  
    public DateTime AuditTime= DateTime.Now;    //审核时间
   
    public int PayerID = 0;           //付款人
 
    public String Payer="";          //付款人
   
    public DateTime PayTime= DateTime.Now;      //付款时间
    
    public int Status = 0;
   
    public String ApplyText="";
  
    public String TaxCode="";
   
    public String UnitText="";
   
    public String StatusText="";
  
    public int MaterialID = 0;
   
    public String MaterialNo="";
    
    public String MaterialName="";
    
    public SCMPayItem()
    {
    	this.ID = 0;
		this.OrderID = 0;
		this.SupplierID = 0;
		this.UnitID = 0;
		this.MaterialID = 0;
		
		this.OperatorID = 0;
		this.AuditorID = 0;
		this.PayerID = 0;
		this.Status = 0;
		this.Money=0.0f;

		this.Operator = "";
		this.Auditor = "";
		this.Payer = "";
		
		this.ApplyText = "";
		this.TaxCode = "";
		this.UnitText = "";
		this.StatusText = "";
		
		this.OrderNo = "";
		this.SupplierName = "";
		this.SupplierCode = "";
		this.MaterialNo = "";
		this.MaterialName = "";
		
        this.ApplyTime = DateTime.Now;
        this.AuditTime = DateTime.Now;
        this.PayTime = DateTime.Now;
    }
}
