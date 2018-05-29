/**
 * com.soccer.dao.impl/DetailsDaoImpl.java
 * chs_sandy
 * 下午5:52:11
 */
package com.soccer.dao.impl;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;

import com.soccer.common.exception.SysException;
import com.soccer.common.log.LoggerAdapter;
import com.soccer.common.log.LoggerAdapterFacory;
import com.soccer.dao.DetailsDao;
import com.soccer.pojo.DetailsBean;

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

}
