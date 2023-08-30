package com.mes.server.service.po.sfc;

import java.io.Serializable; 

import com.mes.server.service.po.aps.APSMaterial;

public class SFCMaterial implements Serializable {
	private static final long serialVersionUID = 1L;

	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0; // ID
	// [DataMember(Name = "OrderID", Order = 1)]
	public int OrderID = 0; // 订单ID
	// [DataMember(Name = "GradeID", Order = 2)]
	public int GradeID = 0; // 层级ID
	// [DataMember(Name = "MaterialID", Order = 3)]
	public int MaterialID = 0; // 物料ID
	// [DataMember(Name = "MaterialNo", Order = 4)]
	public String MaterialNo=""; // 物料编码
	// [DataMember(Name = "MaterialName", Order = 5)]
	public String MaterialName=""; // 物料名称
	// [DataMember(Name = "LineID", Order = 6)]
	public int LineID = 0; // 产线ID
	// [DataMember(Name = "PartID", Order = 7)]
	public int PartID = 0; // 工段ID
	// [DataMember(Name = "PartPointID", Order = 8)]
	public int PartPointID = 0; // 工序ID
	// [DataMember(Name = "FQTYDemand", Order = 9)]
	public float FQTYDemand=0.0f; // 需求量
	// [DataMember(Name = "FQTYOnSite", Order = 10)]
	public float FQTYOnSite=0.0f; // 线上库存
	// [DataMember(Name = "FQTYMargin", Order = 11)]
	public float FQTYMargin=0.0f; // 物料缺口
	// [DataMember(Name = "UnitText", Order = 12)]
	public String UnitText=""; // 物料单位
	// [DataMember(Name = "UnitID", Order = 13)]
	public int UnitID = 0;
	// [DataMember(Name = "TypeID", Order = 14)]
	public int TypeID = 0; // 01:自制件|02:外购件|04:委外件
	// [DataMember(Name = "TaskLineID", Order = 15)]
	public int TaskLineID = 0; // 产线任务ID
	// [DataMember(Name = "ShiftID", Order = 16)]
	public int ShiftID = 0; // 班次ID
	// [DataMember(Name = "PlanerID", Order = 17)]
	public int PlanerID = 0; // 计划员
	// [DataMember(Name = "LineName", Order = 18)]
	public String LineName=""; // 产线
	// [DataMember(Name = "PartName", Order = 19)]
	public String PartName=""; // 工段
	// [DataMember(Name = "PartPointName", Order = 20)]
	public String PartPointName=""; // 工序
	// [DataMember(Name = "OrderNo", Order = 21)]
	public String OrderNo=""; // 订单ID
	// [DataMember(Name = "ProductNo", Order = 22)]
	public String ProductNo=""; // 产品规格
	
	public String PlanerName=""; // 计划员
	// [DataMember(Name = "TaskPartID", Order = 23)]
	public int TaskPartID = 0; // 工段任务ID
	// [DataMember(Name = "TaskStepID", Order = 24)]
	public int TaskStepID = 0; // 工序任务ID
	// [DataMember(Name = "PartOrderID", Order = 25)]
	public int PartOrderID = 0; // 工段任务ID
	// [DataMember(Name = "StepOrderID", Order = 26)]
	public int StepOrderID = 0; // 工段任务ID

	public SFCMaterial() {

		this.ID = 0;
		this.OrderID = 0;
		this.GradeID=0;
		this.MaterialID=0;
		this.TaskLineID = 0;
		
		this.TaskPartID = 0;
		this.LineID = 0;
		this.PartID = 0;
		this.PartPointID = 0;
		this.FQTYDemand = 0;
		
		this.FQTYOnSite = 0;
		this.FQTYMargin = 0;
		this.ShiftID = 0;
		this.UnitID = 0;
		this.TypeID=0;
		
		this.TaskStepID = 0;
		this.PlanerID = 0;
		this.PartOrderID = 0;
		this.StepOrderID = 0;


		this.OrderNo = "";
		this.ProductNo = "";
		this.LineName = "";
		this.PartName = "";
		this.PartPointName = "";
		
		this.MaterialNo = "";
		this.MaterialName = "";
		this.PlanerName = "";
		this.UnitText="";
	}

	public SFCMaterial(APSMaterial wItem) {
		this.OrderID = wItem.OrderID;
		this.GradeID = wItem.GradeID;
		this.MaterialID = wItem.MaterialID;
		this.MaterialNo = wItem.MaterialNo;
		this.MaterialName = wItem.MaterialName;
		this.LineID = wItem.LineID;
		this.PartID = wItem.PartID;
		this.PartPointID = wItem.PartPointID;
		this.FQTYDemand = wItem.FQTYDemand;
		this.TypeID = wItem.TypeID;
		this.UnitID = wItem.UnitID;
	}
	public SFCMaterial(int wMaterialID, String wMaterialNo, String wMaterialName, float wFQTY) {
		this.MaterialID = wMaterialID;
		this.MaterialNo = wMaterialNo;
		this.MaterialName = wMaterialName;
		this.FQTYDemand = wFQTY;
	}
}
