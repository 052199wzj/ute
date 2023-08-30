package com.mes.server.service.po.exc.define;

/**
 *  申请单状态
 * @author ShrisJava
 *
 */ 
public enum EXCApplyStatus {
	/**
     *    默认
    */ 
    
    Default(0, "默认"),
    /** 
     *  待审核
    */  
    
    Waiting(1, "待审核"),
    /** 
     *  已撤销
    */  
    
    Cancel(2, "已撤销"),
    /** 
     *  已审核
    */  
    
    Audit(3, "已审核"),
    /**
     * 已驳回
    */ 
    
    Reject(4, "已驳回"),
    /** 
     *  已确认
    */  
    
    Confirm(5, "已确认");

	private int value;
	private String lable;

	private EXCApplyStatus(int value, String lable) {
		this.value = value;
		this.lable = lable;
	}

	/**
	 * 通过 value 的数值获取枚举实例
	 *
	 * @param val
	 * @return
	 */
	public static EXCApplyStatus getEnumType(int val) {
		for (EXCApplyStatus type : EXCApplyStatus.values()) {
			if (type.getValue() == val) {
				return type;
			}
		}
		return Default;
	}

	public int getValue() {
		return value;
	}

	public String getLable() {
		return lable;
	}

}
