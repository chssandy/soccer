/**
 * com.soccer.search/MatchInfoSearch.java
 * chs_sandy
 * 下午4:05:04
 */
package com.soccer.search;

import java.util.HashMap;

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
	
	private HashMap<String, String> xy;

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

	public HashMap<String, String> getXy() {
		return xy;
	}

	public void setXy(HashMap<String, String> xy) {
		this.xy = xy;
	}

}
