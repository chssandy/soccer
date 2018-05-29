package com.soccer.common.utils;

import java.util.Properties;

/**
 * 
 * 获取资源文件中的属性值
 * 
 */
public final class PropertiesUtil
{
    
    /**
     * 资源属性
     */
    private static Properties configProperties;
    
    public static void loadConfigProperties(final Properties props)
    {
        configProperties = props;
    }
    
    /**
     * 
     * 获取属性值
     * @param key 属性key
     * @return
     */
    public static String getProperty(final String key)
    {
        return PropertiesUtil.configProperties.getProperty(key);
    }
    
}
