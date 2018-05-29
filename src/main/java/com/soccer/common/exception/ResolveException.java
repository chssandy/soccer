/*
 * 文 件 名:  Exception.java
 * 描    述:  自定义异常
 * 创 建 人:  sandy
 * 创建时间:  2015年4月20日
 * 修改内容:  <修改内容>
 */
package com.soccer.common.exception;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;

import com.alibaba.fastjson.JSONObject;
import com.soccer.common.constants.ExceptionConstants;

/**
 * 自定义异常
 * 
 * @author  sandy		
 * @data  2018年5月29日
 */
public class ResolveException extends SimpleMappingExceptionResolver
{
    private static Logger log = LoggerFactory.getLogger(ResolveException.class);
    
    protected ModelAndView doResolveException(HttpServletRequest request, HttpServletResponse response, Object handler,
            SysException ex)
    {
        try
        {
            PrintWriter writer = response.getWriter();
            JSONObject json = new JSONObject();
            if (ex instanceof SysException)
            {
                // 业务异常
                SysException ae = (SysException)ex;
                json.put("resultCode", ae.getErrorCode());
            }
            else
            {
                json.put("resultCode", ExceptionConstants.ERROR_SYS);
            }
            writer.print(json);
            writer.flush();
            writer.close();
        }
        catch (IOException e)
        {
            log.error("请求出现异常！", e);
        }
        return null;
    }
}
