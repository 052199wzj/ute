package com.mes.server.service.po.elg;

import java.io.Serializable;
import java.util.List;
import java.util.List;

public class ELGCatalog implements Serializable {
	/**
	 * 序列号
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 目录ID
	 */
	public int CatalogID;

	/**
	 * 目录或文件名称
	 */
	public String CatalogName = "";

	/**
	 * 是否是目录
	 */
	public boolean IsCatalog = true;

	/**
	 * 文件路径
	 */
	public String FilePath = "";

	/**
	 * 目录的子项集合
	 */
	public List<ELGCatalog> SubCatalogList = new List<ELGCatalog>();

	public String getFilePath() {
		return FilePath;
	}

	public void setFilePath(String filePath) {
		FilePath = filePath;
	}

	public int getCatalogID() {
		return CatalogID;
	}

	public void setCatalogID(int catalogID) {
		CatalogID = catalogID;
	}

	public String getCatalogName() {
		return CatalogName;
	}

	public void setCatalogName(String catalogName) {
		CatalogName = catalogName;
	}

	public boolean isIsCatalog() {
		return IsCatalog;
	}

	public void setIsCatalog(boolean isCatalog) {
		IsCatalog = isCatalog;
	}

	public List<ELGCatalog> getwSubCatalogList() {
		return SubCatalogList;
	}

	public void setwSubCatalogList(List<ELGCatalog> wSubCatalogList) {
		this.SubCatalogList = wSubCatalogList;
	}
}
