/**
 * com.soccer.search/MatchInfoSearch.java
 * chs_sandy
 * 下午4:05:04
 */
package com.soccer.search;

/**
 * @author chs_sandy
 *
 */
public class LiveScoreSearch extends Page {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6493164360996349680L;
	
	/**
     * 是否解析，1：已解析，0：未解析
     */
    private int is_resolved = 1;
    
    private String event_date;
    
    private String league_name;
    
    private String home_team;
    
    private String away_team;


	public String getLeague_name() {
		return league_name;
	}

	public void setLeague_name(String league_name) {
		this.league_name = league_name;
	}

	public String getHome_team() {
		return home_team;
	}

	public void setHome_team(String home_team) {
		this.home_team = home_team;
	}

	public String getAway_team() {
		return away_team;
	}

	public void setAway_team(String away_team) {
		this.away_team = away_team;
	}

	/**
	 * @return the is_resolved
	 */
	public int getIs_resolved() {
		return is_resolved;
	}

	/**
	 * @param is_resolved the is_resolved to set
	 */
	public void setIs_resolved(int is_resolved) {
		this.is_resolved = is_resolved;
	}

	public String getEvent_date() {
		return event_date;
	}

	public void setEvent_date(String event_date) {
		this.event_date = event_date;
	}

}
