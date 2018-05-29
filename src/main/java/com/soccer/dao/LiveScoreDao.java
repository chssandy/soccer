/**
 * com.soccer.dao/MatchInfoDao.java
 * chs_sandy
 * 下午4:06:36
 */
package com.soccer.dao;

import java.util.List;

import com.soccer.common.exception.SysException;
import com.soccer.pojo.LiveScoreBean;
import com.soccer.search.LiveScoreSearch;

/**
 * @author chs_sandy
 *
 */
public interface LiveScoreDao {
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
     * 确认数据已解析
     * @param bean 要确认的数据
     * @return true：修改成功；false：修改失败
     * @throws SysException [参数说明]
     * @author sandy 2018年05月29日 下午4:19:58
     */
    boolean resolveLiveScore(LiveScoreBean bean) throws SysException;
   
}
