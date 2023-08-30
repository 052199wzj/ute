package com.mes.server.service.po.mss;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

public class MSSSpotTask implements Serializable {

	private static final long serialVersionUID = 1L;

	public int ID = 0;

	/**
	 * 点检项类型
	 */
	public int TypeID = 0;

	/**
	 * 工位任务ID 需要存储
	 */
	public int TaskPartID = 0;

	/**
	 * 工序任务ID 需要存储
	 */
	public int TaskStepID = 0;

	/**
	 * 订单号 需要存储
	 */
	public int OrderID = 0;

	/**
	 * WBS号 关联查询或直接存储
	 */
	public String WBSNo = "";

	/**
	 * 车号 关联查询或直接存储
	 */
	public String PartNo = "";

	/**
	 * 路线ID 需要存储
	 */
	public int RouteID = 0;

	/**
	 * 路线工序ID 需要存储
	 */
	public int RoutePartPointID = 0;

	/**
	 * 路线工序编号 关联查询或直接存储
	 */
	public String RoutePartPointCode = "";

	/**
	 * 产线
	 */
	public int LineID = 0;

	/**
	 * 产品规格
	 */
	public int ProductID = 0;

	/**
	 * 客户
	 */
	public int CustomerID = 0;

	/**
	 * 工位
	 */
	public int PartID = 0;

	/**
	 * 工序
	 */
	public int PartPointID = 0;

	public String Line = "";
	public String ProductNo = "";
	public String CustomerName = "";
	public String PartName = "";
	public String PartPointName = "";

	public List<Int32> OperatorIDList = new List<Int32>();

	public String OperatorName = "";

	public DateTime EndTime = DateTime.Now;

	public DateTime StartTime = DateTime.Now;

	public DateTime ActiveTime = DateTime.Now;

	public int TaskStatus = 0;

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getLineID() {
		return LineID;
	}

	public void setLineID(int lineID) {
		LineID = lineID;
	}

	public int getProductID() {
		return ProductID;
	}

	public void setProductID(int productID) {
		ProductID = productID;
	}

	public int getCustomerID() {
		return CustomerID;
	}

	public void setCustomerID(int customerID) {
		CustomerID = customerID;
	}

	public int getPartID() {
		return PartID;
	}

	public void setPartID(int partID) {
		PartID = partID;
	}

	public int getPartPointID() {
		return PartPointID;
	}

	public void setPartPointID(int partPointID) {
		PartPointID = partPointID;
	}

	public String getLine() {
		return Line;
	}

	public void setLine(String line) {
		Line = line;
	}

	public String getProductNo() {
		return ProductNo;
	}

	public void setProductNo(String productNo) {
		ProductNo = productNo;
	}

	public String getCustomerName() {
		return CustomerName;
	}

	public void setCustomerName(String customerName) {
		CustomerName = customerName;
	}

	public String getPartName() {
		return PartName;
	}

	public void setPartName(String partName) {
		PartName = partName;
	}

	public String getPartPointName() {
		return PartPointName;
	}

	public void setPartPointName(String partPointName) {
		PartPointName = partPointName;
	}

	public int getRouteID() {
		return RouteID;
	}

	public void setRouteID(int routeID) {
		RouteID = routeID;
	}

	public int getRoutePartPointID() {
		return RoutePartPointID;
	}

	public void setRoutePartPointID(int routePartPointID) {
		RoutePartPointID = routePartPointID;
	}

	public String getRoutePartPointCode() {
		return RoutePartPointCode;
	}

	public void setRoutePartPointCode(String routePartPointCode) {
		RoutePartPointCode = routePartPointCode;
	}

	public int getTaskPartID() {
		return TaskPartID;
	}

	public void setTaskPartID(int taskPartID) {
		TaskPartID = taskPartID;
	}

	public int getOrderID() {
		return OrderID;
	}

	public void setOrderID(int orderID) {
		OrderID = orderID;
	}

	public String getWBSNo() {
		return WBSNo;
	}

	public void setWBSNo(String wBSNo) {
		WBSNo = wBSNo;
	}

	public String getPartNo() {
		return PartNo;
	}

	public void setPartNo(String partNo) {
		PartNo = partNo;
	}

	public List<Int32> getOperatorIDList() {
		return OperatorIDList;
	}

	public void setOperatorIDList(List<Int32> operatorIDList) {
		OperatorIDList = operatorIDList;
	}

	public String getOperatorName() {
		return OperatorName;
	}

	public void setOperatorName(String operatorName) {
		OperatorName = operatorName;
	}

	public DateTime getEndTime() {
		return EndTime;
	}

	public void setEndTime(DateTime endTime) {
		EndTime = endTime;
	}

	public DateTime getStartTime() {
		return StartTime;
	}

	public void setStartTime(DateTime startTime) {
		StartTime = startTime;
	}
 

	public int getTaskStatus() {
		return TaskStatus;
	}

	public void setTaskStatus(int taskStatus) {
		TaskStatus = taskStatus;
	}

	public int getTaskStepID() {
		return TaskStepID;
	}

	public void setTaskStepID(int taskStepID) {
		TaskStepID = taskStepID;
	}
}
