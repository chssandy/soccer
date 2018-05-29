(function($,win,un){
	"use strict";
	
	var _cachedParams = "_cachedParams",
		searchContent = "search_content",
		params = store.get(_cachedParams),
		page;
	
	var $search = $("#"+searchContent), $grid = $($search.data("grid")),grid_dfd =$grid.data("grid_dfd");
	
	if(params){
		$search.find("input,select").each(function(index,ele){
			var $this = $(this),_def;
			if($this.is("select")){
				_def = $this.data("select_def");
				$.when(_def).done(function(){
					$this.val(params[ele.name] || "-1");
				});
			}else{
				$this.val(params[ele.name]);
			}
		});
		
		page = params["page"] || 1;
		delete params.page;
		
		$.when(grid_dfd).done(function(status){
			$grid.setGridParam({postData: params,
				page:page
			}).trigger("reloadGrid");
		});
		
		store.remove(_cachedParams);
	}
	
	$("#context").off("click.history").on("click.history","[data-link]",function(e){
		store.set(_cachedParams,$grid.getGridParam('postData'));
	});
	
	
})(jQuery,window);