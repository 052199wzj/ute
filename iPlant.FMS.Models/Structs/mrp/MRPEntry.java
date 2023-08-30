package com.mes.server.service.po.mrp;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

import com.mes.server.service.mesenum.MRPMergeMode;
import com.mes.server.service.mesenum.MRPProduceMode;

public class MRPEntry implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	public int ID=0;                //计算方式：逐阶套算|直接计算

    public boolean IsMRP=false;            //已分析过的单据不分析

    public int MergeMode=0;         //按供应商|按仓库|按采购时间(采购订单合并方式)

    public int BOMGrade=0;          //计算BOM层级

    public int ProduceMode=0;        //1：并行生产;2:循序生产；

    public int LineMode=0;           //连线模式(1:连线模式；2：混合模式；3：离散模式)

    public String MRPNo="";           //MRP编号

    public int OperatorID=0;         //操作员

    public String Operator="";        //操作员

    public int AuditorID=0;         //审核员

    public String Auditor="";         //审核员

    public int Status=0;             //状态

    public DateTime SubmitTime= DateTime.Now;    //提交时刻

    public DateTime AuditTime= DateTime.Now;      //审核时刻

    public List<MRPStock> StockList=new List<>();//仓库信息
    
    public MRPEntry()
    {
        this.StockList =new List<>();
        this.SubmitTime = DateTime.Now; 
        this.AuditTime = DateTime.Now; 
        this.IsMRP = true;
        this.MergeMode = (int)MRPMergeMode.Supplier();
        this.BOMGrade = 0;
        this.ProduceMode = (int)MRPProduceMode.Sequence();
    }
}
