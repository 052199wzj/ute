package com.mes.server.service.po.mrp;

import java.io.Serializable;
import java.util.List;
import java.util.List;

public class MRPInstance implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	public int ID=0;      

    public List<MRPOrder> OrderList=new List<>();               //生产预测订单

    public MRPEntry Entry= new MRPEntry();                           //MRP计算条件

    public List<MRPOrderEntry> OrderEntryList=new List<>();     //MRP报告
    
    public MRPInstance()
    {
        this.ID = 0;
        this.OrderList =new List<>();
        this.Entry = new MRPEntry();
        this.OrderEntryList =new List<>();
    }
}
