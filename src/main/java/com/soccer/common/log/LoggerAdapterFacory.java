/**
 * 2018-05-29 14:34
 * @author sandy
 */
package com.soccer.common.log;

import com.soccer.common.log.impl.Log4jLogger;

/**
 * 日志对象工厂
 * 
 * @author sandy
 */
public class LoggerAdapterFacory
{
    @SuppressWarnings("rawtypes")
    public static LoggerAdapter getLoggerAdapter(Class clazz)
    {
        return new Log4jLogger(clazz);
    }
}
