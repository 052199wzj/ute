package com.mes.server.service.po.mss;

import java.io.Serializable;
import java.util.List;
import java.util.DateTime;
import java.util.List;

import com.mes.server.service.po.cfg.CFGItem;

/**
 * 部件类型
 * @author ShrisJava
 *
 */
public class MSSPartType implements Serializable {
	private static final long serialVersionUID = 1L;

	public int ID = 0;

	public String Code = "";

	public String Name = ""; 
	   
	public int EditorID = 0;

	public String Editor = "";

	public DateTime EditTime = DateTime.Now;
	
	public List<CFGItem> SupplierList = new List<CFGItem>();

	public int Active = 0;

	public int ID {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getCode() {
		return Code;
	}

	public void setCode(String code) {
		Code = code;
	}

	public String getName() {
		return Name;
	}

	public void setName(String name) {
		Name = name;
	}

	public int getEditorID() {
		return EditorID;
	}

	public void setEditorID(int editorID) {
		EditorID = editorID;
	}

	public String getEditor() {
		return Editor;
	}

	public void setEditor(String editor) {
		Editor = editor;
	}

	public DateTime getEditTime() {
		return EditTime;
	}

	public void setEditTime(DateTime editTime) {
		EditTime = editTime;
	}

	public int getActive() {
		return Active;
	}

	public void setActive(int active) {
		Active = active;
	}

	public List<CFGItem> getSupplierList() {
		return SupplierList;
	}

	public void setSupplierList(List<CFGItem> supplierList) {
		SupplierList = supplierList;
	}
	 
}
