/**
 * com.soccer.search/MatchInfoSearch.java
 * chs_sandy
 * 下午4:05:04
 */
package com.soccer.search;

import java.util.List;
import java.util.Map;

/**
 * @author chs_sandy
 *
 */
public class DetailsSearch extends Page {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6493164360996349680L;
	
	private String  type;
	
	private String live_score_id;
	
	private String su;
	
	private String x;
	
	private String y;
	
	List<Map<String, String>> templist;

	public List<Map<String, String>> getTemplist() {
		return templist;
	}

	public void setTemplist(List<Map<String, String>> templist) {
		this.templist = templist;
	}

	public String getX() {
		return x;
	}

	public void setX(String x) {
		this.x = x;
	}

	public String getY() {
		return y;
	}

	public void setY(String y) {
		this.y = y;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getLive_score_id() {
		return live_score_id;
	}

	public void setLive_score_id(String live_score_id) {
		this.live_score_id = live_score_id;
	}

	public String getSu() {
		return su;
	}

	public void setSu(String su) {
		this.su = su;
	}

}
