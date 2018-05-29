/**
 * 文 件 名:  LoginController.java
 * 描    述:  <描述>
 * 创 建 人:  sandy
 * 创建时间:  2018年05月29日
 * 修改内容:  <修改内容>
 */
package com.soccer.action;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.soccer.common.BaseController;
import com.soccer.common.exception.SysException;
import com.soccer.pojo.MatchInfoBean;
import com.soccer.search.MatchInfoSearch;
import com.soccer.service.MatchInfoService;

/**
 * <pre>
 * 数据处理
 * </pre>
 * 
 * @author  sandy
 * @data  2018年05月29日
 */
@Controller
public class MatchInfoController extends BaseController
{
	@Autowired
    private MatchInfoService matchInfoService;
    
    @RequestMapping(value = "/match/info")
    @ResponseBody
    public Map<String, Object> login(MatchInfoSearch search) throws SysException
    {
    	int count = matchInfoService.getCount(search);
        List<MatchInfoBean> list =null;
        if (count > 0)
        {
            list = matchInfoService.getList(search);
        }
        return buildResult(doPage(count, list, search));
    }
    
}
