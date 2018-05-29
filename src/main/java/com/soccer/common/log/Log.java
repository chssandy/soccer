/**
 * 文 件 名:  Log.java
 * 描    述:  <描述>
 * 创 建 人:  pfma
 * 创建时间:  2014年8月4日
 * 修改内容:  <修改内容>
 */
package com.soccer.common.log;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * <pre>
 * dao层注解日志实现自定义注解
 * </pre>
 * 
 * @author  pfma
 * @data  2014年8月4日
 */
@Documented
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Inherited
public @interface Log
{
    /**
     * <pre>
     * 执行的sql
     * </pre> 
     * @return [参数说明]
     * @author pfma 2014年8月4日 上午10:30:53
     */
    public String sqlStr();
    
    /**
     * <pre>
     * 执行的参数
     * </pre> 
     * @return [参数说明]
     * @author pfma 2014年8月4日 上午10:31:07
     */
    //public String parames();
}
