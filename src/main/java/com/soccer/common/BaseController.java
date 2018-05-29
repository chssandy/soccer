/**
 * 文 件 名:  BaseController.java
 * 描    述:  <描述>
 * 创 建 人:  sandy
 * 创建时间:  2014-7-30
 * 修改内容:  <修改内容>
 */
package com.soccer.common;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.soccer.search.Page;

/**
 * <pre>
 * </pre>
 * 
 * @author  sandy
 * @data  2018-05-29
 */
public class BaseController
{
    public static final String ERROR_PAGE = "error/error";
    
    public static final String UNKNOWNEXCEPTION = "请求失败";
    
    public static final String PARAMSVALIDFAIL = "参数错误！";
    
    public static final int RESULT_CODE_OK = 0;
    
    public static final int RESULT_CODE_FAIL = 1;
    
    protected Map<String, Object> buildResult()
    {
        return buildReturnMap(10, null);
    }
    
    protected Map<String, Object> buildResult(Object obj)
    {
        return buildReturnMap(10, obj);
    }
    
    protected Map<String, Object> buildReturnMap(int resultCode, Object retData)
    {
        Map<String, Object> jsonMap = new HashMap<String, Object>();
        jsonMap.put("resultCode", Integer.valueOf(resultCode));
        jsonMap.put("data", retData);
        return jsonMap;
    }
    
    protected Map<String, Object> doPage(int count,List<?> list,Page search){
    	Map<String, Object> dataMap = new HashMap<String, Object>();
    	 if (count > 0)
         {
             // 序号、昵称、手机号、支付宝账户、支付宝实名、提现金额、账户余额、申请日期、操作
             dataMap.put("total", count % search.getRows() == 0 ? count / search.getRows() : count / search.getRows() + 1);
             dataMap.put("records", count);
             dataMap.put("rows", list);
         }
         else
         {
             dataMap.put("total", 0);
             dataMap.put("records", 0);
             dataMap.put("rows", "");
         }
    	 dataMap.put("page", search.getPage());
		 return dataMap;
    }
}