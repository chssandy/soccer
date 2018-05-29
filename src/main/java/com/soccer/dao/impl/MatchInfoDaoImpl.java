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
import com.soccer.dao.MatchInfoDao;
import com.soccer.pojo.MatchInfoBean;
import com.soccer.search.MatchInfoSearch;

/**
 * @author chs_sandy
 *
 */
public class MatchInfoDaoImpl implements MatchInfoDao{
	
	@Autowired
    private SqlSessionTemplate sqlSession;
    
    private static LoggerAdapter log = LoggerAdapterFacory.getLoggerAdapter(MatchInfoDaoImpl.class);
    
	@Override
	public int getCount(MatchInfoSearch search) throws SysException {
		int count = 0;
        try
        {
            count = sqlSession.selectOne("com.soccer.mybatis.matchinfo.getCount", search);
        }
        catch (DataAccessException e)
        {
            String msg = "查询比赛详情条数出错！";
            log.error(msg, e);
            throw new SysException(msg, e);
        }
        return count;
	}
	
	@Override
	public List<MatchInfoBean> getList(MatchInfoSearch search) throws SysException {
		List<MatchInfoBean> list = null;
        try
        {
            list = sqlSession.selectList("com.soccer.mybatis.matchinfo.getList", search);
        }
        catch (DataAccessException e)
        {
            String msg = "查询比赛详情出错！";
            log.error(msg, e);
            throw new SysException(msg, e);
        }
        return list;
	}

}
