var xxpage = (function($,page){
	
	"use strict";
	
	let _cachedPage = {},
		pages = [],
		current = {},
		$context = $("#context"),
		$hiddenFields = $("#hiddenFields"),
		needFix = true;
	
	const showKeys = function(){
		return {
			cached:Object.keys(_cachedPage),
			pages:pages.concat(),
			current: current
		}
	};
	
	const clear = function(){
		for(let prop of Object.keys(_cachedPage)){
			delete _cachedPage[prop]
		}
		pages.length = 0;
	};
	
	const go = function(url,param = {},cb){
		pages.push(current);
		cachePage(current.url);
		current = {url,param};
		loadFromURL(url,param,cb);
	};
	
	const back = function(fromCache,cb){
		if(!pages.length){
			console.log("未找到上级页面！");
			return;
		}
		current = pages.pop();
		needFix = false;
		if(fromCache){
			loadFromCache(current.url);
		}else{
			delete _cachedPage[current.url];
			loadFromURL(current.url,current.param,cb);
		}
	}
	
	const fix = function(current){
		if(needFix){
			pages.push(current);
			current = current;
		}
		needFix = true;
	}
	
	$context.on("click.page","[data-page]",function(e){
		let url = $(this).data("page");
		url && go(url);
		return false;
	});
	
	$context.on("click.page","[data-back]",function(e){
		let val = $(this).data("back");
		back(val !== "reload");
		return false;
	});
	
	$("#menuList").on("click.page","a[onclick]",function(e){
		clear();
		let strs,url;
		strs =  $(this).attr("onclick").match(/\((.+)\)/);
		url = strs[1].substr(0,strs[1].indexOf(",")).replace(/'/g,"");
		current = {url,param:{}}
	});

	function loadFromURL(url,param,cb){
		clearBody();
		param && params(param);
		$context.load(WEB_URL+url, function(res,status) {
			if(status === "error"){
				$context.load("404.html");
				$("#consoleName").html("页面丢失")
			}else{
				if(cb && typeof cb === "function"){
					cb.call(null,res);
				}
			}
		});
	}
	
	function loadFromCache(key,param,cb){
		clearBody();
		param && params(param);
		$context.append(_cachedPage[key].context || "");
		$hiddenFields.after(_cachedPage[key].tail || "");
		delete _cachedPage[key];
		if(cb && typeof cb === "function"){
			cb.call(null,res);
		}
	}

	function clearBody(){
		$hiddenFields.nextAll().not("#password_modify_div").remove();
		$context.children().off().remove();
	}
	
	function cachePage(key){
		let context,tail;
		context = $context.children().detach();
		tail = $hiddenFields.nextAll().detach();
		if(_cachedPage[key]){
			console.log("可能存在相同的key！");
		}
		_cachedPage[key] = {context,tail};
	}
	
//	function getKey(url){
//		return url.replace(/\\|\//g,".").replace(".html","").substr(1);
//	}
//	function generateUUID(){
//	    var d = new Date().getTime();
//	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//	        var r = (d + Math.random()*16)%16 | 0;
//	        d = Math.floor(d/16);
//	        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
//	    });
//	    return uuid;
//	}
		
	return {
		showKeys,
		clear,
		go,
		back,
		fix
	};

}(jQuery,xxpage || {}));