package com.soccer.common.sys;

import java.util.Properties;

import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;

import com.soccer.common.utils.PropertiesUtil;

/**
 * 
 * 加载配置文件
 * 
 * @author sandy
 * 
 */
public class PropertyConfigurer extends PropertyPlaceholderConfigurer
{
    @Override
    protected void processProperties(ConfigurableListableBeanFactory beanFactory, Properties props)
    {
        super.processProperties(beanFactory, props);
        PropertiesUtil.loadConfigProperties(props);
    }
}
