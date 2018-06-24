/**
 * com.soccer.service.impl/MatchInfoService.java
 * chs_sandy
 * 2018-05-29 下午4:15:48
 */
package com.soccer.service;

import java.util.List;

import com.soccer.common.exception.SysException;
import com.soccer.pojo.LiveScoreBean;
import com.soccer.search.LiveScoreSearch;

/**
 * @author chs_sandy
 *
 */
public interface LiveScoreService {
	/**
     * 查询比赛即时分数条数
     * @param search search 查询条件
     * @return 总数据数
     * @throws SysException [参数说明]
     * @author sandy 2018年05月29日 下午4:19:58
     */
    int getCount(LiveScoreSearch search) throws SysException;
    
	/**
     * 查询比赛即时分数
     * @param search 查询条件
     * @return
     * @throws SysException [参数说明]
     * @author sandy 2018年05月29日 下午4:19:58
     */
    List<LiveScoreBean> getList(LiveScoreSearch search) throws SysException;
    
    /**
     * 查询比赛信息
     * @param id 查询条件
     * @return
     * @throws SysException [参数说明]
     * @author sandy 2018年05月29日 下午4:19:58
     */
    LiveScoreBean getLiveScoreById(String id) throws SysException;
    
    /**
     * 解析全场详情和半场详情
     * @param search 查询条件
     * @return
     * @throws SysException [参数说明]
     * @author sandy 2018年05月29日 下午4:19:58
     */
    void washData(LiveScoreSearch search) throws SysException;
    
}
