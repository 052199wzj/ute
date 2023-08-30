package com.mes.server.service.po.qms;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class QMSMaterialCheck implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	 public int ID=0;                        //内部ID
 
     public int OrderID=0;                   //采购订单ID
 
     public int MaterialID=0;                //工段任务ID
 
     public String MaterialNo="";             //物料号
   
     public String MaterialName="";            //物料名称
 
     public String Specification="";          //规格型号
 
     public int StockID=0;                  //仓库ID
 
     public int ReceiverID=0;               //收料
 
     public int InspectorID=0;              //检验员

     public int StockManID=0;               //仓库员
  
     public DateTime ReceiveTime= DateTime.Now;         //收料时刻
 
     public DateTime InspectTime= DateTime.Now;         //检验时刻
 
     public DateTime InStockTime= DateTime.Now;         //入库时刻
  
     public float FQTY=0.0f;                   //来料数量
 
     public float FQTYGood=0.0f;               //合格数
  
     public float FQTYBad=0.0f;                //不合格数

     public float FQTYInStock=0.0f;            //入库数量
  
     public int Status=0;                  //单据状态
  
     public String Remark="";                 //备注信息
   
     public int SupplierID=0;               //供应商ID
 
     public String BatchNo="";                //批次号
 
     public List<QMSCheckItem> PackageItemList= new List<>();        //外观检验
  
     public List<QMSCheckItem> ParaItemList= new List<>();           //参数检验
   
     public boolean CheckResult=false;             //判定结果
 
     public int Disposal=0;                 //处置方法
 
     public int FormID=0;                 //表单ID
  
     public int CheckVersionID=0;           //表单版本ID
  
     public int EntryID=0;                 //采购订单实体ID

  
     public String ProjectName="";            //项目名称

     public float FQTYSize=0.0f;               //尺寸数量
  
     public float FQTYPackage=0.0f;            //外观数量
  
     public String CheckScheme="";            //检验方案
  
     public String CheckLevel="";            //检验水平
   
     public boolean SecondCheck=false;            //二次检验
   
     public boolean Emergency=false;              //是否紧急件
  
     public String SubpartVersion="";        //子件版本号
     //辅助字段
  
     public String OrderNo="";              //采购订单编码
   
  
     public String InspectorName="";        //检验员
   
     public String ReceiverkName="";        //收料员
   
     public String StockManName="";         //入库员
    
     public String LocationList="";         //入库可选仓位列表
   
     public String SupplierBatchNo="";      //供应商批次号
   
     public String SupplierName="";         //供应商名称

     public String DrawingNo="";            //图纸号
     
     public QMSMaterialCheck()
     {
         this.ProjectName = "";
         this.CheckScheme = "";
         this.CheckLevel = "";
         this.SubpartVersion = "";
         this.PackageItemList= new List<>();
         this.ParaItemList = new List<>();
         this.InspectTime = DateTime.Now;
         this.ReceiveTime= DateTime.Now;
         this.InStockTime = DateTime.Now;
         this.InspectorName = "";
         this.ReceiverkName = "";
         this.StockManName = "";
         this.Remark = "";
         this.MaterialNo = "";
         this.MaterialName = "";
         this.Specification = "";
         this.LocationList = "";
     }

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getOrderID() {
		return OrderID;
	}

	public void setOrderID(int orderID) {
		OrderID = orderID;
	}

	public int getMaterialID() {
		return MaterialID;
	}

	public void setMaterialID(int materialID) {
		MaterialID = materialID;
	}

	public String getMaterialNo() {
		return MaterialNo;
	}

	public void setMaterialNo(String materialNo) {
		MaterialNo = materialNo;
	}

	public String getMaterialName() {
		return MaterialName;
	}

	public void setMaterialName(String materialName) {
		MaterialName = materialName;
	}

	public String getSpecification() {
		return Specification;
	}

	public void setSpecification(String specification) {
		Specification = specification;
	}

	public int getStockID() {
		return StockID;
	}

	public void setStockID(int stockID) {
		StockID = stockID;
	}

	public int getReceiverID() {
		return ReceiverID;
	}

	public void setReceiverID(int receiverID) {
		ReceiverID = receiverID;
	}

	public int getInspectorID() {
		return InspectorID;
	}

	public void setInspectorID(int inspectorID) {
		InspectorID = inspectorID;
	}

	public int getStockManID() {
		return StockManID;
	}

	public void setStockManID(int stockManID) {
		StockManID = stockManID;
	}

	public DateTime getReceiveTime() {
		return ReceiveTime;
	}

	public void setReceiveTime(DateTime receiveTime) {
		ReceiveTime = receiveTime;
	}

	public DateTime getInspectTime() {
		return InspectTime;
	}

	public void setInspectTime(DateTime inspectTime) {
		InspectTime = inspectTime;
	}

	public DateTime getInStockTime() {
		return InStockTime;
	}

	public void setInStockTime(DateTime inStockTime) {
		InStockTime = inStockTime;
	}

	public float getFQTY() {
		return FQTY;
	}

	public void setFQTY(float fQTY) {
		FQTY = fQTY;
	}

	public float getFQTYGood() {
		return FQTYGood;
	}

	public void setFQTYGood(float fQTYGood) {
		FQTYGood = fQTYGood;
	}

	public float getFQTYBad() {
		return FQTYBad;
	}

	public void setFQTYBad(float fQTYBad) {
		FQTYBad = fQTYBad;
	}

	public float getFQTYInStock() {
		return FQTYInStock;
	}

	public void setFQTYInStock(float fQTYInStock) {
		FQTYInStock = fQTYInStock;
	}

	public int getStatus() {
		return Status;
	}

	public void setStatus(int status) {
		Status = status;
	}

	public String getRemark() {
		return Remark;
	}

	public void setRemark(String remark) {
		Remark = remark;
	}

	public int getSupplierID() {
		return SupplierID;
	}

	public void setSupplierID(int supplierID) {
		SupplierID = supplierID;
	}

	public String getBatchNo() {
		return BatchNo;
	}

	public void setBatchNo(String batchNo) {
		BatchNo = batchNo;
	}

	public List<QMSCheckItem> getPackageItemList() {
		return PackageItemList;
	}

	public void setPackageItemList(List<QMSCheckItem> packageItemList) {
		PackageItemList = packageItemList;
	}

	public List<QMSCheckItem> getParaItemList() {
		return ParaItemList;
	}

	public void setParaItemList(List<QMSCheckItem> paraItemList) {
		ParaItemList = paraItemList;
	}

	public boolean isCheckResult() {
		return CheckResult;
	}

	public void setCheckResult(boolean checkResult) {
		CheckResult = checkResult;
	}

	public int getDisposal() {
		return Disposal;
	}

	public void setDisposal(int disposal) {
		Disposal = disposal;
	}

	public int getFormID() {
		return FormID;
	}

	public void setFormID(int formID) {
		FormID = formID;
	}

	public int getCheckVersionID() {
		return CheckVersionID;
	}

	public void setCheckVersionID(int checkVersionID) {
		CheckVersionID = checkVersionID;
	}

	public int getEntryID() {
		return EntryID;
	}

	public void setEntryID(int entryID) {
		EntryID = entryID;
	}

	public String getProjectName() {
		return ProjectName;
	}

	public void setProjectName(String projectName) {
		ProjectName = projectName;
	}

	public float getFQTYSize() {
		return FQTYSize;
	}

	public void setFQTYSize(float fQTYSize) {
		FQTYSize = fQTYSize;
	}

	public float getFQTYPackage() {
		return FQTYPackage;
	}

	public void setFQTYPackage(float fQTYPackage) {
		FQTYPackage = fQTYPackage;
	}

	public String getCheckScheme() {
		return CheckScheme;
	}

	public void setCheckScheme(String checkScheme) {
		CheckScheme = checkScheme;
	}

	public String getCheckLevel() {
		return CheckLevel;
	}

	public void setCheckLevel(String checkLevel) {
		CheckLevel = checkLevel;
	}

	public boolean isSecondCheck() {
		return SecondCheck;
	}

	public void setSecondCheck(boolean secondCheck) {
		SecondCheck = secondCheck;
	}

	public boolean isEmergency() {
		return Emergency;
	}

	public void setEmergency(boolean emergency) {
		Emergency = emergency;
	}

	public String getSubpartVersion() {
		return SubpartVersion;
	}

	public void setSubpartVersion(String subpartVersion) {
		SubpartVersion = subpartVersion;
	}

	public String getOrderNo() {
		return OrderNo;
	}

	public void setOrderNo(String orderNo) {
		OrderNo = orderNo;
	}

	public String getInspectorName() {
		return InspectorName;
	}

	public void setInspectorName(String inspectorName) {
		InspectorName = inspectorName;
	}

	public String getReceiverkName() {
		return ReceiverkName;
	}

	public void setReceiverkName(String receiverkName) {
		ReceiverkName = receiverkName;
	}

	public String getStockManName() {
		return StockManName;
	}

	public void setStockManName(String stockManName) {
		StockManName = stockManName;
	}

	public String getLocationList() {
		return LocationList;
	}

	public void setLocationList(String locationList) {
		LocationList = locationList;
	}

	public String getSupplierBatchNo() {
		return SupplierBatchNo;
	}

	public void setSupplierBatchNo(String supplierBatchNo) {
		SupplierBatchNo = supplierBatchNo;
	}

	public String getSupplierName() {
		return SupplierName;
	}

	public void setSupplierName(String supplierName) {
		SupplierName = supplierName;
	}

	public String getDrawingNo() {
		return DrawingNo;
	}

	public void setDrawingNo(String drawingNo) {
		DrawingNo = drawingNo;
	}
}
