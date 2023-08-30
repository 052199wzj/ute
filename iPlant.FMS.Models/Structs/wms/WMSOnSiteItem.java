package com.mes.server.service.po.wms;

import java.io.Serializable;
import java.util.DateTime;

public class WMSOnSiteItem implements Serializable {
	private static final long serialVersionUID = 1L;
	//[DataMember(Name = "ID", Order = 0)]
	        public int ID= 0;
	        //[DataMember(Name = "LineID", Order = 1)]
	        public int LineID= 0;
	        //[DataMember(Name = "PartID", Order = 2)]
	        public int PartID= 0;
	        //[DataMember(Name = "PartPointID", Order = 3)]
	        public int PartPointID= 0;
	        //[DataMember(Name = "StationID", Order = 4)]
	        public int StationID= 0;
	        //[DataMember(Name = "MaterialNo", Order = 5)]
	        public String MaterialNo= "";
	        //[DataMember(Name = "MaterialName", Order = 6)]
	        public String MaterialName= "";
	        //[DataMember(Name = "FQTYOutStock", Order = 7)]
	        public float FQTYOutStock= 0.0f;
	        //[DataMember(Name = "FQTYInStock", Order = 8)]
	        public float FQTYInStock= 0.0f;
	        //[DataMember(Name = "FQTYOnSite", Order = 9)]
	        public float FQTYOnSite= 0.0f;
	        //[DataMember(Name = "FQTYInventroy", Order = 10)]
	        public float FQTYInventroy= 0.0f;
	        //[DataMember(Name = "OperatorID", Order = 11)]
	        public int OperatorID= 0;
	        //[DataMember(Name = "InventroyTime", Order = 12)]
	        public DateTime InventroyTime= DateTime.Now;
	        //[DataMember(Name = "SubmitTime", Order = 13)]
	        public DateTime SubmitTime= DateTime.Now;
	        //[DataMember(Name = "LineName", Order = 14)]
	        public String LineName= "";
	        //[DataMember(Name = "PartName", Order = 15)]
	        public String PartName= "";
	        //[DataMember(Name = "PartPointName", Order = 16)]
	        public String PartPointName= "";
	        //[DataMember(Name = "StationName", Order = 17)]
	        public String StationName= "";
	        //[DataMember(Name = "OperatorName", Order = 18)]
	        public String OperatorName= "";
	        //[DataMember(Name = "SourceID", Order = 19)]
	        public int SourceID= 0;
	        //[DataMember(Name = "Status", Order = 20)]
	        public int Status= 0;

	        public WMSOnSiteItem() 
	        {
	        	this.ID= 0;
	        	this.LineID= 0;
	        	this.PartID= 0;
	        	this.PartPointID= 0;
	        	this.StationID= 0;
	        	this.OperatorID= 0;
	        	this.FQTYOutStock= 0.0f;
	        	this.FQTYInStock= 0.0f;
	        	this.FQTYOnSite= 0.0f;
	        	this.FQTYInventroy= 0.0f;
	            this.MaterialName = "";
	            this.MaterialNo = "";
	            this.LineName = "";
	            this.PartName = "";
	            this.PartPointName = "";
	            this.StationName = "";
	            this.OperatorName = "";
	            this.InventroyTime = DateTime.Now;
	            this.SubmitTime = DateTime.Now;
	            this.SourceID= 0;
	            this.Status= 0;
	        }
}
