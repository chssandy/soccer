/**
 * com.soccer.service.impl/MatchInfoServiceImpl.java
 * chs_sandy
 * 2018-05-29 下午4:17:05
 */
package com.soccer.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.soccer.common.exception.SysException;
import com.soccer.dao.MatchInfoDao;
import com.soccer.pojo.MatchInfoBean;
import com.soccer.search.MatchInfoSearch;
import com.soccer.service.MatchInfoService;

/**
 * @author chs_sandy
 *
 */
public class MatchInfoServiceImpl implements MatchInfoService{

	@Autowired
    private MatchInfoDao matchInfoDao;
	
	@Override
	public int getCount(MatchInfoSearch search) throws SysException {
		return matchInfoDao.getCount(search);
	}

	@Override
	public List<MatchInfoBean> getList(MatchInfoSearch search) throws SysException {
		return matchInfoDao.getList(search);
	}

}
