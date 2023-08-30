package com.mes.server.service.po.mss;

import java.io.Serializable;
import java.util.List;
import java.util.List;
import java.util.stream.Collectors;

public class MSSMaterialGroup implements Serializable {
	/**
	 * 物料组信息
	 */
	private static final long serialVersionUID = 1L;

	public MSSMaterialGroup() {
		// TODO Auto-generated constructor stub
	}

	public int ID;// 物料组ID
	public String Name;// 物料组名称
	public String Code;// 物料组代码
	public int PrevID;// 上级物料组ID
	public String PrevName;// 上级组ID全称
	public String GroupFullID;
	public int Active = 0;

	public int ERPID = 0;

	public List<MSSMaterial> MaterialList = new List<MSSMaterial>();

	public List<MSSMaterialGroup> SonList = new List<MSSMaterialGroup>();

	public static List<MSSMaterialGroup> ListToTree(List<MSSMaterialGroup> wList) {
		List<MSSMaterialGroup> wTree = new List<MSSMaterialGroup>();

		wTree = wList.stream().filter(p -> p.PrevID <= 0).collect(Collectors.toList());
		for (MSSMaterialGroup mssMaterialGroup : wTree) {
			ListToTree(mssMaterialGroup, wList);
		}

		return wTree;
	}

	public static List<MSSMaterialGroup> ListToTree(List<MSSMaterialGroup> wList, int wHasMaterial) {
		List<MSSMaterialGroup> wTree = new List<MSSMaterialGroup>();

		wTree = wList.stream().filter(p -> p.PrevID <= 0).collect(Collectors.toList());
		for (MSSMaterialGroup mssMaterialGroup : wTree) {
			ListToTree(mssMaterialGroup, wList, wHasMaterial);
		}
		if (wHasMaterial == 1) {
			wTree.RemoveAll(p -> (p.SonList == null || p.SonList.Count <= 0)
					&& (p.MaterialList == null || p.MaterialList.Count <= 0));
		}

		return wTree;
	}

	private static void ListToTree(MSSMaterialGroup wGroup, List<MSSMaterialGroup> wList, int wHasMaterial) {

		wGroup.SonList = wList.stream().filter(p -> p.PrevID == wGroup.ID).collect(Collectors.toList());

		if (wGroup.SonList == null)
			wGroup.SonList = new List<MSSMaterialGroup>();

		if (wGroup.SonList.Count <= 0)
			return;

		for (MSSMaterialGroup mssMaterialGroup : wGroup.SonList) {
			ListToTree(mssMaterialGroup, wList,wHasMaterial);
			 
		}

		if (wHasMaterial == 1) {
			wGroup.SonList.RemoveAll(p -> (p.SonList == null || p.SonList.Count <= 0)
					&& (p.MaterialList == null || p.MaterialList.Count <= 0));
		}
	}

	private static void ListToTree(MSSMaterialGroup wGroup, List<MSSMaterialGroup> wList) {

		wGroup.SonList = wList.stream().filter(p -> p.PrevID == wGroup.ID).collect(Collectors.toList());

		if (wGroup.SonList == null)
			wGroup.SonList = new List<MSSMaterialGroup>();

		for (MSSMaterialGroup mssMaterialGroup : wGroup.SonList) {
			ListToTree(mssMaterialGroup, wList);
		}
	}

	public static List<MSSMaterialGroup> TreeToList(List<MSSMaterialGroup> wTree) {
		List<MSSMaterialGroup> wList = new List<MSSMaterialGroup>();

		for (MSSMaterialGroup mssMaterialGroup : wTree) {
			wList.Add(mssMaterialGroup);
			if (mssMaterialGroup.SonList == null || mssMaterialGroup.SonList.Count <= 0)
				continue;
			wList.addAll(TreeToList(mssMaterialGroup.SonList));
			mssMaterialGroup.SonList.clear();
		}
		return wList;
	}

	public String getGroupFullID() {
		return GroupFullID;
	}

	public void setGroupFullID(String groupFullID) {
		GroupFullID = groupFullID;
	}

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public String getCode() {
		return Code;
	}

	public void setCode(String code) {
		Code = code;
	}

	public int getPrevID() {
		return PrevID;
	}

	public void setPrevID(int prevID) {
		PrevID = prevID;
	}

	public String getPrevName() {
		return PrevName;
	}

	public void setPrevName(String prevName) {
		PrevName = prevName;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

}
