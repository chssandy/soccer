/**
 * com.soccer.dao.impl/DetailsDaoImpl.java
 * chs_sandy
 * 下午5:52:11
 */
package com.soccer.dao.impl;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;

import com.soccer.common.exception.SysException;
import com.soccer.common.log.LoggerAdapter;
import com.soccer.common.log.LoggerAdapterFacory;
import com.soccer.dao.DetailsDao;
import com.soccer.pojo.DetailsBean;
import com.soccer.search.DetailsSearch;

/**
 * @author chs_sandy
 *
 */
public class DetailsDaoImpl implements DetailsDao {

	@Autowired
    private SqlSessionTemplate sqlSession;
    
    private static LoggerAdapter log = LoggerAdapterFacory.getLoggerAdapter(DetailsDaoImpl.class);
    
	@Override
	public int addFullDetails(DetailsBean bean) throws SysException {
		try
        {
            return sqlSession.insert("com.soccer.mybatis.details.addFullDetails", bean);
        }
        catch (DataAccessException e)
        {
            String msg = "保存全场详情信息出错！";
            log.error(msg, e);
            throw new SysException(e);
        }
	}

	@Override
	public int addHalfTimeDetails(DetailsBean bean) throws SysException {
		try
        {
            return sqlSession.insert("com.soccer.mybatis.details.addHalfTimeDetails", bean);
        }
        catch (DataAccessException e)
        {
            String msg = "保存半场详情出错！";
            log.error(msg, e);
            throw new SysException(e);
        }
	}
	
	@Override
	public int getFullDetailsCount(DetailsSearch search) throws SysException {
		int count = 0;
        try
        {
            count = sqlSession.selectOne("com.soccer.mybatis.details.getFullDetailsCount", search);
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
	public List<DetailsBean> getFullDetailsList(DetailsSearch search) throws SysException {
		List<DetailsBean> list = null;
        try
        {
            list = sqlSession.selectList("com.soccer.mybatis.details.getFullDetailsList", search);
        }
        catch (DataAccessException e)
        {
            String msg = "查询比赛详情出错！";
            log.error(msg, e);
            throw new SysException(msg, e);
        }
        return list;
	}
	
	@Override
	public int getHalfDetailsCount(DetailsSearch search) throws SysException {
		int count = 0;
        try
        {
            count = sqlSession.selectOne("com.soccer.mybatis.details.getHalfDetailsCount", search);
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
	public List<DetailsBean> getHalfDetailsList(DetailsSearch search) throws SysException {
		List<DetailsBean> list = null;
        try
        {
            list = sqlSession.selectList("com.soccer.mybatis.details.getHalfDetailsList", search);
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
