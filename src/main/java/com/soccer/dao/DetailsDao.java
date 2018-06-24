/**
 * com.soccer.dao/MatchInfoDao.java
 * chs_sandy
 * 下午4:06:36
 */
package com.soccer.dao;

import java.util.List;

import com.soccer.common.exception.SysException;
import com.soccer.pojo.DetailsBean;
import com.soccer.search.DetailsSearch;

/**
 * @author chs_sandy
 *
 */
public interface DetailsDao {
	
	/**
     * <pre>
     * 添加全场详情信息
     * </pre> 
     * @param bannerBean
     * @return
     * @throws SysException [参数说明]
     * @author sandy 2018年05月29日 下午4:19:58
     */
	int addFullDetails(DetailsBean bean) throws SysException;
	
	/**
     * <pre>
     * 添加半场详情信息
     * </pre> 
     * @param bannerBean
     * @return
     * @throws SysException [参数说明]
     * @author sandy 2018年05月29日 下午4:19:58
     */
	int addHalfTimeDetails(DetailsBean bean) throws SysException;
	
	
	/**
     * 查询比赛详情条数
     * @param search search 查询条件
     * @return 总数据数
     * @throws SysException [参数说明]
     * @author sandy 2018年05月29日 下午4:19:58
     */
    int getFullDetailsCount(DetailsSearch search) throws SysException;
    
	/**
     * 查询比赛详情
     * @param search 查询条件
     * @return
     * @throws SysException [参数说明]
     * @author sandy 2018年05月29日 下午4:19:58
     */
    List<DetailsBean> getFullDetailsList(DetailsSearch search) throws SysException;
    
    
	/**
     * 查询比赛详情条数
     * @param search search 查询条件
     * @return 总数据数
     * @throws SysException [参数说明]
     * @author sandy 2018年05月29日 下午4:19:58
     */
    int getHalfDetailsCount(DetailsSearch search) throws SysException;
    
	/**
     * 查询比赛详情
     * @param search 查询条件
     * @return
     * @throws SysException [参数说明]
     * @author sandy 2018年05月29日 下午4:19:58
     */
    List<DetailsBean> getHalfDetailsList(DetailsSearch search) throws SysException;
    
    
   
}
