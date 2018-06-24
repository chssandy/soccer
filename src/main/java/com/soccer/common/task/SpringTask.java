/**
 * 文 件 名:  SpringTask.java
 * 描    述:  定时任务
 * 创 建 人:  sandy
 * 创建时间:  2015年6月15日
 * 修改内容:  <修改内容>
 */
package com.soccer.common.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.soccer.common.exception.SysException;
import com.soccer.common.log.LoggerAdapter;
import com.soccer.common.log.LoggerAdapterFacory;
import com.soccer.search.LiveScoreSearch;
import com.soccer.service.LiveScoreService;

/**
 * 定时任务类
 * 
 * @author sandy
 * @date 2015年6月15日
 * 
 */
@Component
public class SpringTask
{
	@Autowired
    private LiveScoreService liveScoreService;
	
    private static LoggerAdapter log = LoggerAdapterFacory.getLoggerAdapter(SpringTask.class);
    
    /**
     * 每日凌晨三点 执行用户信用计算
     * @throws JohnMediaException
     */
    @Scheduled(cron = "0 0 3 * * ?")
    public void executeCreditCaculation() throws SysException
    {
        log.info("执行用户信用计算!");
        //        log.info("处理打款超过48小时数据!");
        //        balanceDao.doAlipayFailed();
    }
    
    /**
     * 每日凌晨2点 执行易发布状态修改
     * @throws JohnMediaException
     */
	@Scheduled(cron = "0 0 0 * * ?")
	public void fixYFBExecuteStatus() throws SysException {
		log.info("执行易发布状态修改!");
	}
    
    
    /**
     * 每隔一分钟更新任务状态
     * @throws JohnMediaException
     */
    @Scheduled(cron = "0 0/1 * * * ?")
    public void fixTaskStatus() throws SysException
    {
//    	System.out.println("=========================================================================================");
//    	LiveScoreSearch search = new LiveScoreSearch();
//    	search.setPage(1);
//    	search.setHavePage(1);
//    	search.setRows(100);
//    	search.setIs_resolved(0);
//    	liveScoreService.washData(search);
    }
    
}