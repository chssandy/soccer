/**
 * 2014-03-20 11:16
 */
package com.soccer.common.log.impl;

import org.apache.log4j.Logger;

import com.soccer.common.log.LoggerAdapter;


/**
 * 实现log4j日志框架的对接
 * 
 * @author hj
 */
public class Log4jLogger implements LoggerAdapter
{
    /**
     * log4j 对象
     */
    private Logger logger;
    
    @SuppressWarnings("rawtypes")
    public Log4jLogger(Class clazz)
    {
        this.logger = Logger.getLogger(clazz);
    }
    
    @Override
    public void info(String msg)
    {
        if (logger.isInfoEnabled())
        {
            logger.info(msg);
        }
    }
    
    @Override
    public void info(Throwable ex)
    {
        if (logger.isInfoEnabled())
        {
            logger.info(ex.getMessage(), ex);
        }
    }
    
    @Override
    public void info(String msg, Throwable ex)
    {
        if (logger.isInfoEnabled())
        {
            logger.info(msg, ex);
        }
    }
    
    @Override
    public void debug(String msg, Throwable ex)
    {
        if (logger.isDebugEnabled())
        {
            logger.debug(msg, ex);
        }
    }
    
    @Override
    public void debug(String msg)
    {
        if (logger.isDebugEnabled())
        {
            logger.debug(msg);
        }
    }
    
    @Override
    public void debug(Throwable ex)
    {
        if (logger.isDebugEnabled())
        {
            logger.debug(ex.getMessage(), ex);
        }
    }
    
    @Override
    public void error(String msg, Throwable ex)
    {
        logger.error(msg, ex);
    }
    
    @Override
    public void error(String msg)
    {
        logger.error(msg);
    }
    
    @Override
    public void error(Throwable ex)
    {
        logger.error(ex.getMessage(), ex);
    }
    
    @Override
    public void warn(String msg)
    {
        logger.warn(msg);
    }
    
    @Override
    public void warn(Throwable ex)
    {
        logger.warn(ex.getMessage(), ex);
    }
    
    @Override
    public void warn(String msg, Throwable ex)
    {
        logger.warn(msg, ex);
    }
}
