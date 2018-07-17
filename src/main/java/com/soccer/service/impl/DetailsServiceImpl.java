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
		List<DetailsBean> list = null;
		if("0".equals(search.getType())){
			list = detailsDao.getFullDetailsList(search);
		}else{
			list = detailsDao.getHalfDetailsList(search);
		}
		if(list!=null && search.getIsselect()!=null && "1".equals(search.getIsselect())){
			list = filter(list);
		}
		if(list!=null){
			list = signSixEight(list);
		}
		return list;
	}
	
	
	public List<DetailsBean> filter(List<DetailsBean> list){
		String tempRealid="",tempT="",tempX="";
		
		for(int i = 0;i<list.size();i++){
			DetailsBean bean = list.get(i);
			if(i==0){
				tempRealid = bean.getRealid();
				tempT = bean.getT();
				tempX = bean.getX();
			}else{
				if(tempRealid.equals(bean.getRealid()) && Integer.valueOf(bean.getT()) < Integer.valueOf(tempT) && Float.valueOf(bean.getX()) > Float.valueOf(tempX)) {
					//相同实盘下，时间递减的情况下，只保留x也递减的数据
					list.remove(bean);
					i--;
					
				}else{
					tempRealid = bean.getRealid();
					tempT = bean.getT();
					tempX = bean.getX();
				}
			}
		}
		return list;
	}
	
	public List<DetailsBean> signSixEight(List<DetailsBean> list){

		String tempRealid="",tempT="",tempHA="";
		
		Float tempY = null,temp_x_av = null,temp_y_av = null;   
		    //临时y   临时x-av   临时y-av
		int x_new = 0, y_new = 0,y_max =0,x_min_abs = 0,x_min = 0,      y_min_abs=0,      y_min=0;
		   //x最近的行，        y最近的行；  y最大的行            x最接近av的行             x高于av最接近的行          y最接近av的行                        y高于av最接近的行
		
//		int tempTAXI = 0, tempTAYI = 0,tempAXI = 0,tempAYI = 0,tempTHXI = 0,tempTHYI = 0,tempHXI = 0,tempHYI = 0; 
		//tempTAXI, tempTAYI,tempAXI,tempAYI,tempTHXI,tempTHYI,tempHXI,tempHYI ：
		//全盘时间最大的大球，小球数据行；全盘大小球最接近均值；半盘时间最大的大球，小球数据行，半盘最接近均值的数据行
		for(int i = 0; i<list.size();i++){
			DetailsBean bean = list.get(i);
			if(i==0){
				tempRealid = bean.getRealid();
				tempT = bean.getT();
				tempY = Float.valueOf(bean.getY());
				temp_x_av = Float.valueOf(bean.getX()) - Float.valueOf(bean.getAv()) ;
				temp_y_av = Float.valueOf(bean.getY()) - Float.valueOf(bean.getAv()) ;
				tempHA = bean.getHa();
			}else{
				if(tempRealid.equals(bean.getRealid()) && tempHA.equals(bean.getHa())){
					//TODO 组内比较,半场或全场比较
					if("h".equals(bean.getHa())){  //半盘判最接近平均值的x，绝对值最小；半盘判最接近平均值的y，即绝对值最小
						if( Integer.valueOf(bean.getT()) > Integer.valueOf(tempT)){  //半盘取x最近的值（6点，8点）；取y最近的值（8点）
							x_new = i;
							y_new = i;
							tempT = bean.getT();
						}
						if(Math.abs(temp_x_av) >  Math.abs(Float.valueOf(bean.getX()) - Float.valueOf(bean.getAv())) ){
							temp_x_av = Float.valueOf(bean.getX()) - Float.valueOf(bean.getAv()) ;  //当前的abs(x-av)更小，则更新tempX,tempAV
							x_min_abs = i;
						}
						if(Math.abs(temp_y_av) >  Math.abs(Float.valueOf(bean.getY()) - Float.valueOf(bean.getAv())) ){
							temp_y_av = Float.valueOf(bean.getY()) - Float.valueOf(bean.getAv()) ;  //当前的abs(y-av)更小，则更新tempY,tempAV
							y_min_abs = i;
						}
					}else{    //全盘判最接近平均值的x，且x大于av；全盘判最接近平均值的y，且y大于av
						if( Integer.valueOf(bean.getT()) > Integer.valueOf(tempT)){ //全盘取x最近的值（6点，8点）
							x_new = i;
							tempT = bean.getT();
						}
						if( Float.valueOf(bean.getY()) > tempY){ //全盘取y最大的值
							y_max = i;
							tempY = Float.valueOf(bean.getY());
						}
						//半盘取y最大的值（6点，8点） 
						if( Float.valueOf(bean.getX()) > Float.valueOf(bean.getAv()) ){
							if(temp_x_av < 0 || temp_x_av > (Float.valueOf(bean.getX()) - Float.valueOf(bean.getAv()))){
								temp_x_av = Float.valueOf(bean.getX()) - Float.valueOf(bean.getAv());  //当前的x大于av且x-av 最小，则更新tempX
								x_min = i;
							}
						}
						if(Float.valueOf(bean.getY()) > Float.valueOf(bean.getAv())){
							if(temp_y_av<0 || temp_y_av > (Float.valueOf(bean.getY()) - Float.valueOf(bean.getAv()))){
								temp_y_av = Float.valueOf(bean.getY()) - Float.valueOf(bean.getAv()); 
								y_min = i;
							}
						}
					}
				}else{
					if("a".equals(tempHA)){
						list.get(x_new).setLightEightX("1");
						list.get(x_min).setLightEightX("1");
						list.get(y_max).setLightEightY("1");
						list.get(y_min).setLightEightY("1");
						
						list.get(x_new).setLightSixX("1");
						list.get(x_min).setLightSixX("1");
						list.get(y_max).setLightSixY("1");
						list.get(y_min).setLightSixY("1");
					}else{
						list.get(x_new).setLightEightX("1");
						list.get(x_min_abs).setLightEightX("1");
						list.get(y_new).setLightEightY("1");
						list.get(y_min_abs).setLightEightY("1");
						
						list.get(x_new).setLightSixX("1");
						list.get(x_min_abs).setLightSixX("1");
					}
					//TODO 新启一组比较
					tempRealid = bean.getRealid();
					tempT = bean.getT();
					tempY = Float.valueOf(bean.getY());
					temp_x_av = Float.valueOf(bean.getX()) - Float.valueOf(bean.getAv()) ;
					temp_y_av = Float.valueOf(bean.getY()) - Float.valueOf(bean.getAv()) ;
					tempHA = bean.getHa();
					
					
					x_new = i;
					y_new = i;
					y_max = i;
					x_min_abs = i;
					x_min = i;
					y_min_abs= i;
					y_min=i;
					
				}
			}
		}
		if("a".equals(tempHA)){
			list.get(x_new).setLightEightX("1");
			list.get(x_min).setLightEightX("1");
			list.get(y_max).setLightEightY("1");
			list.get(y_min).setLightEightY("1");
			
			list.get(x_new).setLightSixX("1");
			list.get(x_min).setLightSixX("1");
			list.get(y_max).setLightSixY("1");
			list.get(y_min).setLightSixY("1");
		}else{
			list.get(x_new).setLightEightX("1");
			list.get(x_min_abs).setLightEightX("1");
			list.get(y_new).setLightEightY("1");
			list.get(y_min_abs).setLightEightY("1");
			
			list.get(x_new).setLightSixX("1");
			list.get(x_min_abs).setLightSixX("1");
		}
		return list;
	}

}
