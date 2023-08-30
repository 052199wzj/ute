package com.mes.server.service.po.scm;

import java.io.Serializable;
import java.util.DateTime;

public class SCMLinkMan implements Serializable {
	
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public int SupplierID = 0;

	public String Name = "";

	public String Position = ""; // 职位

	public String WeiXin = "";

	public String MobilePhone = "";

	public String EMail = "";

	public int Grade = 0;

	public String GradeText = "";

	public String Description = "";

	public int CreatorID = 0;

	public int EditorID = 0;

	public String Creator = "";

	public String Editor = "";

	public DateTime CreateTime = DateTime.Now;

	public DateTime EditTime = DateTime.Now;

	public int Active = 0;

	public SCMLinkMan() {
		this.ID = 0;
		this.SupplierID = 0;
		this.Grade = 0;
		this.CreatorID = 0;
		this.EditorID = 0;
		this.Active = 0;

		this.Name = "";
		this.Position = "";
		this.WeiXin = "";
		this.MobilePhone = "";
		this.EMail = "";

		this.GradeText = "";
		this.Description = "";
		this.Creator = "";
		this.Editor = "";
		this.CreateTime = DateTime.Now;
	}
}
