package com.soccer.common.utils;

import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.util.StringUtils;

import com.soccer.common.exception.SysException;
import com.soccer.dao.DetailsDao;
import com.soccer.dao.LiveScoreDao;
import com.soccer.pojo.DetailsBean;
import com.soccer.pojo.LiveScoreBean;
import com.soccer.search.LiveScoreSearch;

/**
 * 
 * html解析
 * 
 */
public final class HtmlParserUtil
{
    public static String parser(String live_score_id,String htmlStr,String type,LiveScoreDao liveScoreDao,DetailsDao detailsDao) {  
    	try {  
    		Document doc1 = Jsoup.parse(htmlStr);
    		Elements trs = doc1.getElementsByTag("tr");
    		for(Element tr : trs) {
    			DetailsBean bean = new DetailsBean();
    			bean.setLive_score_id(live_score_id);
    			if("#E9F1FA".equals(tr.attr("bgColor")))
    				continue;
    			System.out.println(tr);
    			Elements tds = tr.children();
    			int i= 0;
    			for(Element td : tds) {
    				if("3".equals(td.attr("colspan"))){
    					bean.setX("0");
    					bean.setQ("0");
    					bean.setY("0");
    					bean.setAttribute("1");
    					break;
					}else{
						i += 1;
					}
    				
    				switch(i){
    			        case 1:
    			        	if(StringUtils.isEmpty(td.text())){
    			        		bean.setT("-1");
    			        	}else{
	    			        	if(Float.parseFloat(td.text())>= 61)
	    			        		bean.setAttribute("1");
	    			        	bean.setT(td.text());
    			        	}
    			            break;
    			        case 2:
    			        	bean.setS(td.text());
    			            break;
    			        case 3:
    			        	if(!StringUtils.isEmpty(td.text())){
	    			        	if(Float.parseFloat(td.text())<= 0)
	    			        		bean.setAttribute("1");
	    			        	bean.setX(td.text());
    			        	}
    			            break;
    			        case 4:
    			        	bean.setQ(td.text());
    			            break;
    			        case 5:
    			        	if(!StringUtils.isEmpty(td.text())){
	    			        	if(Float.parseFloat(td.text())<= 0)
	    			        		bean.setAttribute("1");
	    			        	bean.setY(td.text());
    			        	}
    			            break;
			        }
    				System.out.println(td.text());
    			}
    			switch (type) {
					case "full":
						detailsDao.addFullDetails(bean);
						break;
					case "half":
						detailsDao.addHalfTimeDetails(bean);
						
						break;
				}
    		}
			LiveScoreBean lsBean = new LiveScoreBean();
			lsBean.setId(live_score_id);
			lsBean.setIs_resolved("1");
			liveScoreDao.resolveLiveScore(lsBean);
    		
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
        return null;  
	}  
    
    
    public static void main(String[] args){
    	LiveScoreDao liveScoreDao = new LiveScoreDao() {
			
			@Override
			public boolean resolveLiveScore(LiveScoreBean bean) throws SysException {
				// TODO Auto-generated method stub
				return false;
			}
			
			@Override
			public List<LiveScoreBean> getList(LiveScoreSearch search) throws SysException {
				// TODO Auto-generated method stub
				return null;
			}
			
			@Override
			public int getCount(LiveScoreSearch search) throws SysException {
				// TODO Auto-generated method stub
				return 0;
			}
		};
		
		DetailsDao detailsDao = new DetailsDao() {
			
			@Override
			public int addHalfTimeDetails(DetailsBean bean) throws SysException {
				// TODO Auto-generated method stub
				return 0;
			}
			
			@Override
			public int addFullDetails(DetailsBean bean) throws SysException {
				// TODO Auto-generated method stub
				return 0;
			}
		};
    	String ss ="<TABLE cellSpacing=1 cellPadding=0 width=450 align=center bgColor=#AFC7E2 border=0 class=font13>"
    				+"<TR align=center bgColor=#E9F1FA height=22>"
    				+"<TD width=30><b><FONT color=#282828>时间</FONT></b></TD>"
    				+"<TD width=30><b><FONT color=#282828>比分</FONT></b></TD>"
    				+"<TD width=95><b><FONT color=#282828>大球</FONT></b></TD>"
    				+"<TD width=100><b><FONT color=#282828>盘口</FONT></b></TD>"
    				+"<TD width=95><b><FONT color=#282828>小球</FONT></b></TD>"
    				+"<TD width=60><FONT color=#282828><B>变化时间</B></FONT></TD>"
    				+"<TD><B>状态</B></TD>"
    				+"<TD>状态3333</TD>"
    				+"</TR>"
    				+"</TABLE>";
    	parser("1",ss,"full",liveScoreDao,detailsDao);
    }
    
}
