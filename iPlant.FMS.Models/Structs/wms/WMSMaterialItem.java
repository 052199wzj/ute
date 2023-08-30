package com.mes.server.service.po.wms;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class WMSMaterialItem implements Serializable {
	private static final long serialVersionUID = 1L;
	// [DataMember(Name = "ID", Order = 0)]
	public int ID = 0;
	// [DataMember(Name = "TaskMaterialID", Order = 1)]
	public int TaskMaterialID = 0;
	// [DataMember(Name = "FQTYPL", Order = 2)]
	public float FQTYPL;
	// [DataMember(Name = "FQTYLL", Order = 3)]
	public float FQTYLL;
	// [DataMember(Name = "PLOperatorID", Order = 4)]
	public int PLOperatorID = 0;
	// [DataMember(Name = "LLOperatorID", Order = 5)]
	public int LLOperatorID = 0;
	// [DataMember(Name = "PLTime", Order = 6)]
	public DateTime PLTime = DateTime.Now; // 配料
	// [DataMember(Name = "LLTime", Order = 7)]
	public DateTime LLTime = DateTime.Now; // 领料
	// [DataMember(Name = "SLTime", Order = 8)]
	public DateTime SLTime = DateTime.Now; // 送料
	// [DataMember(Name = "FeedBoxID", Order = 9)]
	public String FeedBoxID = "";
	// [DataMember(Name = "Status", Order = 10)]
	public int Status = 0;
	// [DataMember(Name = "LocationList", Order = 11)]
	public List<WMSMaterialItemLocation> LocationList = new List<>(); // 物料仓位取料分录实体
	// [DataMember(Name = "WorkShopName", Order = 12)]
	public String WorkShopName = "";
	// [DataMember(Name = "LineName", Order = 13)]
	public String LineName = "";
	// [DataMember(Name = "PartName", Order = 14)]
	public String PartName = "";
	// [DataMember(Name = "PartPointName", Order = 15)]
	public String PartPointName = "";

	// [DataMember(Name = "PLOperatorName", Order = 16)]
	public String PLOperatorName = "";
	// [DataMember(Name = "LLOperatorName", Order = 17)]
	public String LLOperatorName = "";
	// [DataMember(Name = "MaterialMode", Order = 18)]
	public int MaterialMode = 0;
	// [DataMember(Name = "MaterialNo", Order = 19)]
	public String MaterialNo = "";
	// [DataMember(Name = "MaterialName", Order = 20)]
	public String MaterialName = "";
	// [DataMember(Name = "MaterialID", Order = 21)]
	public int MaterialID = 0;

	public WMSMaterialItem() {
		this.ID = 0;
		this.TaskMaterialID = 0;
		this.FQTYPL = 0.0f;
		this.FQTYLL = 0.0f;
		this.PLOperatorID = 0;
		this.LLOperatorID = 0;
		this.PLTime = DateTime.Now;
		this.SLTime = DateTime.Now;
		this.LLTime = DateTime.Now;
		this.FeedBoxID = "";
		this.Status = 0;

		this.FeedBoxID = "";

		this.WorkShopName = "";
		this.LineName = "";
		this.PartName = "";
		this.PartPointName = "";
		this.PLOperatorName = "";
		this.LLOperatorName = "";
		this.MaterialMode = 0;
		this.MaterialNo = "";
		this.MaterialName = "";
		this.LocationList = new List<>();
	}
}
