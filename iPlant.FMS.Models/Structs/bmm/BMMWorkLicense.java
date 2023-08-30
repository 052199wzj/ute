package com.mes.server.service.po.bmm;

import java.io.Serializable;
import java.util.List;
import java.util.Dictionary;
import java.util.List;
import java.util.Dictionary;

/**
 * 同步 PLM工厂结构时
 * @author ShrisJava
 *
 */
public class BMMWorkLicense implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public String GroupNo = "";

	public String GroupName = "";

	public List<BMMWorkLicense> WorkLicenseList = new List<>();

	public Dictionary<String, Int32> WorkLicenseNameList = new Dictionary<>();

	public BMMWorkLicense() {
	}

}
