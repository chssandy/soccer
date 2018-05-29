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

}
