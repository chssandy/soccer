/**
 * com.soccer.service.impl/MatchInfoServiceImpl.java
 * chs_sandy
 * 2018-05-29 下午4:17:05
 */
package com.soccer.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.soccer.common.exception.SysException;
import com.soccer.common.utils.HtmlParserUtil;
import com.soccer.dao.DetailsDao;
import com.soccer.dao.LiveScoreDao;
import com.soccer.pojo.LiveScoreBean;
import com.soccer.search.LiveScoreSearch;
import com.soccer.service.LiveScoreService;

/**
 * @author chs_sandy
 *
 */
public class LiveScoreServiceImpl implements LiveScoreService{

	@Autowired
    private LiveScoreDao liveScoreDao;
	
	@Autowired
    private DetailsDao detailsDao;
	
	@Override
	public int getCount(LiveScoreSearch search) throws SysException {
		return liveScoreDao.getCount(search);
	}

	@Override
	public List<LiveScoreBean> getList(LiveScoreSearch search) throws SysException {
		return liveScoreDao.getList(search);
	}

	@Override
	public void washData(LiveScoreSearch search) throws SysException {
		List<LiveScoreBean> list = liveScoreDao.getList(search);
		for(LiveScoreBean liveScoreBean : list){
			String live_score_id = liveScoreBean.getId();
			String full_details = liveScoreBean.getFull_details();
			String half_time_details = liveScoreBean.getHalf_time_details();
			HtmlParserUtil.parser(live_score_id,full_details,"full",liveScoreDao,detailsDao);
			HtmlParserUtil.parser(live_score_id,half_time_details,"half",liveScoreDao,detailsDao);
		}
	}

}
