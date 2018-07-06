/**
 * 文 件 名:  LoginController.java
 * 描    述:  <描述>
 * 创 建 人:  sandy
 * 创建时间:  2018年05月29日
 * 修改内容:  <修改内容>
 */
package com.soccer.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.soccer.common.BaseController;
import com.soccer.common.exception.SysException;
import com.soccer.pojo.DetailsBean;
import com.soccer.search.DetailsSearch;
import com.soccer.service.DetailsService;

/**
 * <pre>
 * 数据处理
 * </pre>
 * 
 * @author  sandy
 * @data  2018年05月29日
 */
@Controller
public class DetailsController extends BaseController
{
	@Autowired
    private DetailsService detailsService;
    
    @RequestMapping(value = "/details/info")
    @ResponseBody
    public Map<String, Object> detailsInfo(DetailsSearch search) throws SysException
    {
    	List<Map<String, String>> templist = new ArrayList<Map<String,String>>();
    	
    	if(!StringUtils.isEmpty(search.getX())&&!StringUtils.isEmpty(search.getY())){
    		
    		String[] xArr = search.getX().split(",",-1);
    		String[] yArr = search.getY().split(",",-1);
    		for(int i = 0; i< xArr.length; i++){
    			Map<String, String> map = new HashMap<String, String>();
    		    map.put("x", xArr[i]);
    		    map.put("y", yArr[i]);
    			templist.add(map);
    		}
    		search.setTemplist(templist);
    	}
    	search.setHavePage(0);
    	int count = detailsService.getDetailsCount(search);
    	search.setRowCount(count);
        List<DetailsBean> list =null;
        if (count > 0)
        {
            list = detailsService.getDetailsList(search);
        }
        return buildResult(doPage(count, list, search));
    }
    
}
