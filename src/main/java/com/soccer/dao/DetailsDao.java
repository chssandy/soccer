/**
 * com.soccer.dao/MatchInfoDao.java
 * chs_sandy
 * 下午4:06:36
 */
package com.soccer.dao;

import com.soccer.common.exception.SysException;
import com.soccer.pojo.DetailsBean;

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
	
   
}
