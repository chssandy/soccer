/**
 * 文件名称：  PageBean.java
 * 文件版权:  LanTu Technologies Co., Ltd. Copyright 2014-2020,All rights reserved
 * 文件描述:  <描述>
 * 修改作者:  sandy
 * 修改时间:  2014-4-17
 * 跟踪单号:  <跟踪单号>
 * 修改单号:  <修改单号>
 * 修改内容:  <修改内容>
 */
package com.soccer.search;

import java.io.Serializable;

import com.soccer.common.constants.StaticVariables;

/**
 * @author sandy
 * @version V1.0, 2014-4-17
 */
public class Page implements Serializable
{
    private static final long serialVersionUID = -6038172639511642653L;
    
    /**
     * 分页开始位置
     */
    private int start;
    
    /**
     * 分页条数
     */
    private int rows = StaticVariables.DEFAULT_PAGESIZE;
    
    /**
     * 当前页码
     */
    private int page;
    
    /**
     * 总条数
     */
    private int rowCount;
    
    /**
     * 是否分页，1：是，0：否
     */
    private int havePage = 1;
    
    public int getStart()
    {
        this.start = rows * (page - 1);
        return start;
    }
    
    public void setStart(int start)
    {
        this.start = start;
    }
    
    public int getRows()
    {
        return rows;
    }
    
    public void setRows(int rows)
    {
        this.rows = rows;
    }
    
    public int getPage()
    {
        return page;
    }
    
    public void setPage(int page)
    {
        this.page = page;
    }
    
    public void setRowCount(int rowCount)
    {
        this.rowCount = rowCount;
    }
    
    public int getRowCount()
    {
        return rowCount;
    }
    
    public int getHavePage()
    {
        return havePage;
    }
    
    public void setHavePage(int havePage)
    {
        this.havePage = havePage;
    }
    
}
