package com.mes.server.service.po.aps;

import java.io.Serializable;
import java.util.DateTime;

public class APSMaterial implements Serializable {
	private static final long serialVersionUID = 1L;
	// [DataMember(Name = "ID", Order = 0)]
	public int ID=0; // ID
	// [DataMember(Name = "OrderID", Order = 1)]
	public int OrderID=0; // 订单ID
	// [DataMember(Name = "GradeID", Order = 2)]
	public int GradeID=0; // 层级ID
	// [DataMember(Name = "MaterialID", Order = 3)]
	public int MaterialID=0; // 物料ID
	// [DataMember(Name = "MaterialNo", Order = 4)]
	public String MaterialNo= ""; // 物料编码
	// [DataMember(Name = "MaterialName", Order = 5)]
	public String MaterialName= "";// 物料名称
	// [DataMember(Name = "LineID", Order = 6)]
	public int LineID=0; // 产线ID
	// [DataMember(Name = "PartID", Order = 7)]
	public int PartID=0; // 工段ID
	// [DataMember(Name = "PartPointID", Order = 8)]
	public int PartPointID=0; // 工序ID
	// [DataMember(Name = "FQTYShift", Order = 9)]
	public float FQTYShift = 0.0f; // 需求量
	// [DataMember(Name = "FQTYDemand", Order = 10)]
	public float FQTYDemand = 0.0f; // 需求量
	// [DataMember(Name = "FQTYAvailable", Order = 11)]
	public float FQTYAvailable = 0.0f; // 可用量
	// [DataMember(Name = "FQTYMargin", Order = 12)]
	public float FQTYMargin = 0.0f; // 净需求量

	// [DataMember(Name = "FQTYStock", Order = 13)]
	public float FQTYStock = 0.0f; // 当前库存量
	// [DataMember(Name = "FQTYOnBuy", Order = 14)]
	public float FQTYOnBuy = 0.0f; // 采购在订量
	// [DataMember(Name = "FQTYOnFactory", Order = 15)]
	public float FQTYOnFactory = 0.0f; // 在制订量
	// [DataMember(Name = "FQTYOnSale", Order = 16)]
	public float FQTYOnSale = 0.0f; // 销售在订量
	// [DataMember(Name = "UnitText", Order = 17)]
	public String UnitText= ""; // 物料单位
	// [DataMember(Name = "SubmitTime", Order = 18)]
	public DateTime SubmitTime= DateTime.Now; // 需求提交日期
	// [DataMember(Name = "UnitID", Order = 19)]
	public int UnitID=0;
	// [DataMember(Name = "TypeID", Order = 20)]
	public int TypeID=0; // 01:自制件|02:外购件|04:委外件
	// [DataMember(Name = "TaskLineID", Order = 21)]
	public int TaskLineID=0; // 产线任务ID
	// [DataMember(Name = "ShiftID", Order = 22)]
	public int ShiftID=0; // 班次ID
	// [DataMember(Name = "PlanerID", Order = 23)]
	public int PlanerID=0; // 计划员
	// [DataMember(Name = "LineName", Order = 24)]
	public String LineName= ""; // 产线
	// [DataMember(Name = "PartName", Order = 25)]
	public String PartName= ""; // 工段
	// [DataMember(Name = "PartPointName", Order = 26)]
	public String PartPointName= ""; // 工序
	// [DataMember(Name = "OrderNo", Order = 27)]
	public String OrderNo= ""; // 订单ID
	// [DataMember(Name = "ProductNo", Order = 28)]
	public String ProductNo= ""; // 产品规格
	// [DataMember(Name = "TaskPartID", Order = 21)]
	public int TaskPartID=0; // 工段任务ID
	// [DataMember(Name = "TaskStepID", Order = 22)]
	public int TaskStepID=0; // 工序任务ID

	public APSMaterial() {
		this.ID = 0;
		this.OrderID = 0;
		this.GradeID=0;
		this.MaterialID=0;
		this.TaskLineID = 0;
		
		this.TaskPartID = 0;
		this.LineID = 0;
		this.PartID = 0;
		this.PartPointID = 0;
		
		this.FQTYDemand = 0.0f;
		this.FQTYAvailable = 0.0f;
		this.FQTYMargin = 0.0f;
		this.FQTYStock = 0.0f;
		this.FQTYOnBuy = 0.0f;
		this.FQTYOnFactory = 0.0f;
		this.FQTYOnSale = 0.0f;
		
		this.ShiftID = 0;
		this.UnitID = 0;
		this.TypeID=0;
		
		this.TaskStepID = 0;
		this.PlanerID = 0;
		this.OrderNo = "";
		this.ProductNo = "";
		this.LineName = "";
		this.PartName = "";
		this.PartPointName = "";
		
		this.MaterialNo = "";
		this.MaterialName = "";
		this.UnitText="";
		this.SubmitTime = DateTime.Now;
	}

	public APSMaterial(int wMaterialID, String wMaterialNo, String wMaterialName, float wFQTY) {
		this.ID = 0;
		this.OrderID = 0;
		this.GradeID=0;
		this.MaterialID=0;
		this.TaskLineID = 0;
		
		this.TaskPartID = 0;
		this.LineID = 0;
		this.PartID = 0;
		this.PartPointID = 0;
		
		this.FQTYDemand = 0.0f;
		this.FQTYAvailable = 0.0f;
		this.FQTYMargin = 0.0f;
		this.FQTYStock = 0.0f;
		this.FQTYOnBuy = 0.0f;
		this.FQTYOnFactory = 0.0f;
		this.FQTYOnSale = 0.0f;
		
		this.ShiftID = 0;
		this.UnitID = 0;
		this.TypeID=0;
		
		this.TaskStepID = 0;
		this.PlanerID = 0;
		this.OrderNo = "";
		this.ProductNo = "";
		this.LineName = "";
		this.PartName = "";
		this.PartPointName = "";
		
		this.MaterialNo = "";
		this.MaterialName = "";
		this.UnitText="";
		this.SubmitTime = DateTime.Now;
		
		this.MaterialID = wMaterialID;
		this.MaterialNo = wMaterialNo;
		this.MaterialName = wMaterialName;
		this.FQTYDemand = wFQTY;
	}
}
