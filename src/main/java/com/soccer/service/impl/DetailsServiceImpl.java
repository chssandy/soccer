/**
 * com.soccer.service.impl/MatchInfoServiceImpl.java
 * chs_sandy
 * 2018-05-29 下午4:17:05
 */
package com.soccer.service.impl;

import java.util.Iterator;
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
		List<DetailsBean> list = null;
		if("0".equals(search.getType())){
			list = detailsDao.getFullDetailsList(search);
		}else{
			list = detailsDao.getHalfDetailsList(search);
		}
		if(list!=null){
			String tempRealid="",tempT="",tempX="",tempY="",tempHA="";
			int tempTAXI = 0, tempTAYI = 0,tempAXI = 0,tempAYI = 0,tempTHXI = 0,tempTHYI = 0,tempHXI = 0,tempHYI = 0; 
			//tempTAXI, tempTAYI,tempAXI,tempAYI,tempTHXI,tempTHYI,tempHXI,tempHYI ：
			//全盘时间最大的大球，小球数据行；全盘大小球最接近均值；半盘时间最大的大球，小球数据行，半盘最接近均值的数据行
			for(int i = 0; i<list.size();i++){
				DetailsBean bean = list.get(i);
				if(i==0){
					tempRealid = bean.getRealid();
					tempT = bean.getT();
					tempX = bean.getX();
					tempY = bean.getY();
					tempHA = bean.getHa();
				}else{
					if(tempRealid.equals(bean.getRealid()) && tempHA.equals(bean.getHa())){
						//TODO 组内比较,半场或全场比较
						if("h".equals(bean.getHa())){  //半场判最接近平均值的x，即为判定最小的x；半场判最接近平均值的y，即为判定最大的y
							if( Integer.valueOf(bean.getT()) > Integer.valueOf(tempT)){
								tempTHXI = i;
								tempTHYI = i;
								tempT = bean.getT();
							}
							if(Float.valueOf(tempX) > Float.valueOf(bean.getX())){
								tempX = bean.getX();  //当前的x更小，则更新tempX
								tempHXI = i;
							}
							if(Float.valueOf(tempY) < Float.valueOf(bean.getX())){
								tempY = bean.getY();  //当前的y更大，则更新tempX
								tempHYI = i;
							}
						}else{    //全场判最接近平均值的x，即为判定最大的x；全场判最接近平均值的y，即为判定最小的y
							if( Integer.valueOf(bean.getT()) > Integer.valueOf(tempT)){
								tempTAXI = i;
								tempTAYI = i;
								tempT = bean.getT();
							}
							if(Float.valueOf(tempX) < Float.valueOf(bean.getX())){
								tempX = bean.getX();  //当前的x更小，则更新tempX
								tempAXI = i;
							}
							if(Float.valueOf(tempY) > Float.valueOf(bean.getY())){
								tempY = bean.getY();  //当前的x更小，则更新tempX
								tempAYI = i;
							}
						}
					}else{
						list.get(tempTAXI).setLightEightX("1");
						list.get(tempTAYI).setLightEightY("1");
						list.get(tempAXI).setLightEightX("1");
						list.get(tempAYI).setLightEightY("1");
						list.get(tempTHXI).setLightEightX("1");
						list.get(tempTHYI).setLightEightY("1");
						list.get(tempHXI).setLightEightX("1");
						list.get(tempHYI).setLightEightY("1");
						
						list.get(tempTAXI).setLightSixX("1");
						list.get(tempAXI).setLightSixX("1");
						list.get(tempTHXI).setLightSixX("1");
						list.get(tempHXI).setLightSixX("1");
						
						if("a".equals(tempHA)){
							list.get(tempTAYI).setLightSixY("1");
							list.get(tempAYI).setLightSixY("1");
						}
						
					/*	list.get(tempTI).setLightSixX("1");
						list.get(tempXI).setLightEightX("1");
						list.get(tempXI).setLightSixX("1");
						list.get(tempTI).setLightEightY("1");
						list.get(tempYI).setLightEightY("1");
						if("a".equals(tempHA)){  //六点不需要半场小球的数据,只要全场的小球数据
							list.get(tempTI).setLightSixY("1");
							list.get(tempYI).setLightSixY("1");
						}*/
						//TODO 新启一组比较
						tempRealid = bean.getRealid();
						tempT = bean.getT();
						tempX = bean.getX();
						tempY = bean.getY();
						tempHA = bean.getHa();
						
						tempTAXI = i; 
						tempTAYI = i;
						tempAXI = i;
						tempAYI = i;
						tempTHXI = i;
						tempTHYI = i;
						tempHXI = i;
						tempHYI = i; 
					}
				}
			}
		}
		return list;
	}

}
