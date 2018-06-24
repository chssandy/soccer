/**
 * 文 件 名:  LoginController.java
 * 描    述:  <描述>
 * 创 建 人:  sandy
 * 创建时间:  2018年05月29日
 * 修改内容:  <修改内容>
 */
package com.soccer.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.soccer.common.BaseController;
import com.soccer.common.exception.SysException;
import com.soccer.pojo.LiveScoreBean;
import com.soccer.search.LiveScoreSearch;
import com.soccer.service.LiveScoreService;

/**
 * <pre>
 * 数据处理
 * </pre>
 * 
 * @author  sandy
 * @data  2018年05月29日
 */
@Controller
public class LiveScoreController extends BaseController
{
	@Autowired
    private LiveScoreService liveScoreService;
    
    @RequestMapping(value = "/live/score")
    @ResponseBody
    public Map<String, Object> LiveScore(LiveScoreSearch search) throws SysException
    {
    	search.setIs_resolved(1);
    	int count = liveScoreService.getCount(search);
        List<LiveScoreBean> list =null;
        if (count > 0)
        {
            list = liveScoreService.getList(search);
        }
        return buildResult(doPage(count, list, search));
    }
    
    //根據比賽id獲取信息
    @RequestMapping(value = "/live/score/info")
    @ResponseBody
    public Map<String, Object> getLiveScoreById(HttpServletRequest request, String id) throws SysException
    {
        Map<String, Object> map = new HashMap<String, Object>();
        if (StringUtils.isEmpty(id))
        {
            map.put("result", "error_input");
            return buildResult(map);
        }
        LiveScoreBean bean = liveScoreService.getLiveScoreById(id);
        map.put("result", "success");
        map.put("info", bean);
        return buildResult(map);
    }
    
    
    @RequestMapping(value = "/wash/data")
    @ResponseBody
    public Map<String, Object> WashData(LiveScoreSearch search) throws SysException
    {
    	search.setPage(1);
    	search.setHavePage(1);
    	search.setRows(100);
    	search.setIs_resolved(0);
    	liveScoreService.washData(search);
        return buildResult();
    }
}
