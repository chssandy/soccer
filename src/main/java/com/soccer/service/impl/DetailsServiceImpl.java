/**
 * com.soccer.service.impl/MatchInfoServiceImpl.java
 * chs_sandy
 * 2018-05-29 下午4:17:05
 */
package com.soccer.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.soccer.common.exception.SysException;
import com.soccer.dao.DetailsDao;
import com.soccer.pojo.DetailsBean;
import com.soccer.search.DetailsSearch;
import com.soccer.service.DetailsService;

/**
 * @author chs_sandy
 *
 */
public class DetailsServiceImpl implements DetailsService{

	@Autowired
    private DetailsDao detailsDao;
	
	@Override
	public int getDetailsCount(DetailsSearch search) throws SysException {
		if("0".equals(search.getType())){
			return detailsDao.getFullDetailsCount(search);
		}else{
			return detailsDao.getHalfDetailsCount(search);
		}
		
	}

	@Override
	public List<DetailsBean> getDetailsList(DetailsSearch search) throws SysException {
		if("0".equals(search.getType())){
			return detailsDao.getFullDetailsList(search);
		}else{
			return detailsDao.getHalfDetailsList(search);
		}
	}

}
