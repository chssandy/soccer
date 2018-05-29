/**
 * 文 件 名:  ExceptionConstants.java
 * 描    述:  异常编号统一约定
 * 创 建 人:  sandy
 * 创建时间:  2015年05月19日
 * 修改内容:  <修改内容>
 */
package com.soccer.common.constants;

/**
 * 系统错误类型：10000
 * 用户相关信息：20000
 * 任务相关信息：30000
 */
public class ExceptionConstants
{
	/**
     * 强制提示升级
     */
    public static int FORCE_SYS_UPLOAD = 999;
    
    /**
     * 系统错误
     */
    public static int ERROR_SYS = 10000;
    
    /**
     * 请先登录
     */
    public static int ERROR_LOGIN_FIRST = 10001;
    
    /**
     * 权限不够
     */
    public static int ERROR_LIMITED_AUTHORITY = 10002;
    
    /**
    * 参数错误
    */
    public static final long ERROR_INPUT_PARAM = 10003;
    
    /**
    * 登录失败
    */
    public static final long ERROR_LOGIN_FAIL = 10004;
    
    /**
     * 该用户已存在，手机已被注册
     */
    public static int MESSAGE_USER_EXIST = 20000;
    
    /**
     * 该用户不存在
     */
    public static int MESSAGE_USER_NOTEXIST = 20001;
    
    /**
     * 验证码错误
     */
    public static int MESSAGE_IDENTIFY_CODE_ERROR = 20002;
    
    /**
     * 任务过期
     */
    public static int MESSAGE_TASK_OUT_OF_DATE = 30000;
    
    /**
     * 您今日的短信下发已经超过3条，请明日再试。
     */
    public static int MESSAGE_MSG_OVER = 40000;
    
    /**
     * 短信发送失败，请重试。
     */
    public static int MESSAGE_MSG_ERROR = 40001;
    
}
