/**
 * com.soccer.service.impl/MatchInfoService.java
 * chs_sandy
 * 2018-05-29 下午4:15:48
 */
package com.soccer.service;

import java.util.List;

import com.soccer.common.exception.SysException;
import com.soccer.pojo.DetailsBean;
import com.soccer.search.DetailsSearch;

/**
 * @author chs_sandy
 *
 */
public interface DetailsService {
	/**
     * 查询比赛详情条数
     * @param search search 查询条件
     * @return 总数据数
     * @throws SysException [参数说明]
     * @author sandy 2018年05月29日 下午4:19:58
     */
    int getDetailsCount(DetailsSearch search) throws SysException;
    
	/**
     * 查询比赛详情
     * @param search 查询条件
     * @return
     * @throws SysException [参数说明]
     * @author sandy 2018年05月29日 下午4:19:58
     */
    List<DetailsBean> getDetailsList(DetailsSearch search) throws SysException;
}
