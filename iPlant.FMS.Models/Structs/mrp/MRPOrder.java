package com.mes.server.service.po.mrp;

import java.io.Serializable;
import java.util.DateTime;

import com.mes.server.service.mesenum.MRPOrderType;

public class MRPOrder implements Serializable {
	private static final long serialVersionUID = 1L;
	
	public int ID=0;                  //订单ID

    public int MRPID=0;               //MRPID

    public int OrderID=0;             //OrderID

    public String OrderNo="";          //OrderNo

    public int Type=0;                //1：销售订单；2.预测订单;3.MRP订单 

    public int MaterialID=0;          //物料ID

    public String MaterialNo="";       //物料编码

    public String MaterialName="";     //物料名称

    public String BOMType="";         //BOM类型

    public int BOMID=0;               //BOMID

    public String BOMNo="";            //BOMNo

    public float FQTY=0.0f;             //按供应商|按仓库|按采购时间(采购订单合并方式)

    public DateTime DemandStartTime= DateTime.Now;  //需求开始时间

    public DateTime DemandEndTime= DateTime.Now;    //需求截至时间

    public int WorkShopID=0;            //生产车间ID

    public String WorkShopText="";      //生产车间

    public int LineID=0;                //生产产线ID

    public int PartID=0;               //工序段ID

    public String PartName="";             //工序段

    public String MRPNo="";             //MRPNo(父节点)

    public int GradeID=0;             //层级
    
    public MRPOrder()
    {
        this.DemandStartTime = DateTime.Now;
        this.DemandEndTime = DateTime.Now;
    }
    public MRPOrder(MRPMaterial wMaterial)
    {
        this.Type = (int)MRPOrderType.MRPOrder();
        this.MaterialID = wMaterial.MaterialID;
        this.MaterialNo = wMaterial.MaterialNo;
        this.MaterialName = wMaterial.MaterialName;
        this.FQTY = wMaterial.DemandFQTY;

        this.WorkShopID = wMaterial.WorkShopID;
        this.LineID = wMaterial.LineID;

        this.DemandStartTime = wMaterial.DemandStartTime;
        this.DemandEndTime = wMaterial.DemandEndTime;
    }
}
