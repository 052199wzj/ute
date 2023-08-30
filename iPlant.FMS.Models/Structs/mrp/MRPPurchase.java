package com.mes.server.service.po.mrp;

import java.io.Serializable;
import java.util.DateTime;

public class MRPPurchase implements Serializable {

	private static final long serialVersionUID = 1L;
	
	public int ID=0;                  //ID

    public int MRPID=0;               //MRPID

    public int MaterialID=0;          //物料ID

    public String MaterialNo="";       //物料编码

    public String MaterialName="";     //物料名称

    public int UnitID=0;              //物料单位ID

    public float MarginFQTY=0.0f;        //净需求量

    public float OrderFQTY=0.0f;         //采购量

    public float Price=0.0f;             //采购单价

    public float Money=0.0f;             //采购金额

    public DateTime DemandTime= DateTime.Now;     //需求时间

    public DateTime OrderTime= DateTime.Now;      //下单时间

    public int SupplierID=0;          //供应商ID

    public String SupplierName="";     //供应商

    public int Status=0;             //状态(0:初始状态，1：审核；2.下单，3.到货入库，4.入库异常，5.超时)

    public int SafeMode=0;            //工厂保障|供应商保障（继承物料信息属性）

    public String UnitText="";         //物料单位

    public int StockID=0;             //默认仓库ID

    public DateTime PredictTime= DateTime.Now;    //预计到货时间

    public DateTime ArrivalTime= DateTime.Now;    //实际到货时间
    
    public MRPPurchase()
    {
        this.DemandTime = DateTime.Now;
        this.OrderTime = DateTime.Now;
        this.PredictTime = DateTime.Now;
        this.ArrivalTime = DateTime.Now;
    }
    public MRPPurchase(MRPMaterial wMaterial)
    {
        this.MRPID = 0;
        this.MaterialID = wMaterial.MaterialID;
        this.MaterialNo = wMaterial.MaterialNo;
        this.MaterialName = wMaterial.MaterialName;
        this.UnitID = wMaterial.UnitID;
        this.UnitText = wMaterial.UnitText;
        this.SafeMode = wMaterial.SafeMode;
        this.MarginFQTY = wMaterial.MarginFQTY;
        this.StockID = wMaterial.StockID;
        this.SupplierID = wMaterial.SupplierID;
        this.SupplierName = wMaterial.SupplierName;

        this.DemandTime = wMaterial.DemandStartTime;
        this.DemandTime = DateTime.Now;
        this.OrderTime = DateTime.Now;
        this.PredictTime = DateTime.Now;
        this.ArrivalTime = DateTime.Now;
    }
}
