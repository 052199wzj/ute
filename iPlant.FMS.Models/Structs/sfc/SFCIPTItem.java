package com.mes.server.service.po.sfc;

import java.io.Serializable;

public class SFCIPTItem implements Serializable {
	private static final long serialVersionUID = 1L;
	
	public int ID=0;

    public int ParentID=0;           //检验表单ID

    public int ItemID=0;             //参数ID

    public String ItemText="";        //参数文本

    public float ItemValue=0.0f;        //参数值
    
    public SFCIPTItem()
    {
    	this.ID=0;
        this.ParentID = 0;
        this.ItemID = 0;
        this.ItemText = "";
        this.ItemValue=0.0f;
    }
}
