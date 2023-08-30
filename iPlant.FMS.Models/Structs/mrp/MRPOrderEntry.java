package com.mes.server.service.po.mrp;

import java.io.Serializable; 
import java.util.List;
import java.util.List;

import com.mes.server.service.mesenum.MRPOrderType;
import com.mes.server.service.utils.StringUtils;

public class MRPOrderEntry implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public int OrderID = 0; // 生产订单ID

	public String OrderNo = ""; // 生产订单号

	public int Type = 0; // 订单类型

	public String MRPNo = ""; // MRPNo(父节点)

	public int ParentID = 0; // 上级物料需求ID

	public int GradeID = 0; // 层级ID

	public List<MRPMaterial> MaterialList = new List<>(); // MRP物料需求

	public List<MRPPurchase> PurchaseList = new List<>(); // 采购建议

	public List<MRPProduct> ProductList = new List<>(); // 生产建议

	public List<MRPProduct> OutProductList = new List<>(); // 委外生产建议

	public List<MRPException> ExceptionList = new List<>(); // 错误报告

	public List<MRPException> MessageList = new List<>(); // 消息报告

	public List<MRPOrderEntry> SonEntryList = new List<>(); // 子项实体

	public int EntryID = 0;

	public MRPOrderEntry() {
		this.MaterialList = new List<>();
		this.PurchaseList = new List<>();
		this.ProductList = new List<>();
		this.OutProductList = new List<>();
		this.ExceptionList = new List<>();
		this.MessageList = new List<>();
		this.SonEntryList = new List<>();
	}

	public MRPOrderEntry(MRPOrder wOrder) {
		this.OrderID = wOrder.OrderID;
		this.OrderNo = wOrder.OrderNo;
		this.Type = wOrder.Type;
		// Step01:合法性检查（停产、最小加工数量、开工日期、BOMID）
		switch (MRPOrderType.getEnumType(wOrder.Type)) {
		case SaleOrder:
			this.MRPNo = StringUtils.Format("MRPS{0}", String.format("%08d", this.OrderID));
			this.ParentID = 0;
			break;
		case FactoryOrder:
			this.MRPNo = StringUtils.Format("MRPF{0}", String.format("%08d", this.OrderID));
			this.ParentID = 0;
			break;
		case MRPOrder:
			this.MRPNo = wOrder.MRPNo;
			this.ParentID = 0;
			break;
		default:
			break;
		}
		this.MaterialList = new List<>();
		this.PurchaseList = new List<>();
		this.ProductList = new List<>();
		this.OutProductList = new List<>();
		this.ExceptionList = new List<>();
		this.MessageList = new List<>();
		this.SonEntryList = new List<>();
	}
}
