/**
 * com.soccer.dao.impl/MatchInfoDapImpl.java
 * chs_sandy
 * 下午4:07:10
 */
package com.soccer.dao.impl;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;

import com.soccer.common.exception.SysException;
import com.soccer.common.log.LoggerAdapter;
import com.soccer.common.log.LoggerAdapterFacory;
import com.soccer.dao.LiveScoreDao;
import com.soccer.pojo.LiveScoreBean;
import com.soccer.search.LiveScoreSearch;

/**
 * @author chs_sandy
 *
 */
public class LiveScoreDaoImpl implements LiveScoreDao{
	
	@Autowired
    private SqlSessionTemplate sqlSession;
    
    private static LoggerAdapter log = LoggerAdapterFacory.getLoggerAdapter(LiveScoreDaoImpl.class);
    
	@Override
	public int getCount(LiveScoreSearch search) throws SysException {
		int count = 0;
        try
        {
            count = sqlSession.selectOne("com.soccer.mybatis.livescore.getCount", search);
        }
        catch (DataAccessException e)
        {
            String msg = "查询比赛及时分数条数出错！";
            log.error(msg, e);
            throw new SysException(msg, e);
        }
        return count;
	}
	
	@Override
	public List<LiveScoreBean> getList(LiveScoreSearch search) throws SysException {
		List<LiveScoreBean> list = null;
        try
        {
            list = sqlSession.selectList("com.soccer.mybatis.livescore.getList", search);
        }
        catch (DataAccessException e)
        {
            String msg = "查询比赛即时分数出错！";
            log.error(msg, e);
            throw new SysException(msg, e);
        }
        return list;
	}

	@Override
	public boolean resolveLiveScore(LiveScoreBean bean) throws SysException {
		int affected;
        try
        {
            affected = sqlSession.update("com.soccer.mybatis.livescore.resolveLiveScore", bean);
        }
        catch (DataAccessException e)
        {
            String msg = "确认数据已解析出错！";
            log.error(msg, e);
            throw new SysException(msg, e);
        }
        return affected > 0 ? true : false;
	}

	@Override
	public LiveScoreBean getLiveScoreById(String id) throws SysException {
		try
        {
            return sqlSession.selectOne("com.soccer.mybatis.livescore.getLiveScoreById", id);
        }
        catch (DataAccessException e)
        {
            String msg = "查询比赛信息出错！";
            log.error(msg, e);
            throw new SysException(e);
        }
	}

}
