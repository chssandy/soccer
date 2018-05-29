/*
 * 文 件 名:  Exception.java
 * 描    述:  自定义异常
 * 创 建 人:  sandy
 * 创建时间:  2015年4月20日
 * 修改内容:  <修改内容>
 */
package com.soccer.common.exception;

import com.soccer.common.constants.ExceptionConstants;

/**
 * 自定义异常
 * 
 * @author  sandy		
 * @data  2018年4月20日
 */
public class SysException extends Exception
{
    private static final long serialVersionUID = 800263098528696897L;
    
    private long errorCode = ExceptionConstants.ERROR_SYS;
    
    /**
     * 根据异常编号构造异常
     * @param errorCode
     * @throws SysException 
     */
    public SysException(long errorCode)
    {
        super();
        this.errorCode = errorCode;
    }
    
    public SysException(String msg)
    {
        super(msg);
    }
    
    public SysException(String msg, Throwable ex)
    {
        super(msg, ex);
    }
    
    public SysException(Throwable ex)
    {
        super(ex);
    }
    
    public long getErrorCode()
    {
        return errorCode;
    }
    
    public void setErrorCode(long errorCode)
    {
        this.errorCode = errorCode;
    }
    
    /**
    * 屏蔽异常堆栈
    */
    public Throwable fillInStackTrace()
    {
        return null;
    }
}
