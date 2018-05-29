//var SERVER_URL = "http://manager.91xianxia.com";
//var WEB_URL = "http://manager.91xianxia.com";
var SERVER_URL = "http://www.xianxia.com:8080/soccer";
var WEB_URL = "http://www.xianxia.com:8080/soccer";

(function($) {

  // 备份jquery的ajax方法
  var _ajax = $.ajax;

  // 重写jquery的ajax方法
  $.ajax = function(opt) {
    // 备份opt中error和success方法
    var fn = {
      error: function(XMLHttpRequest, textStatus, errorThrown) {},
      success: function(data, textStatus) {},
      timeoutErr: function() {}
    };
    if (opt.error) {
      fn.error = opt.error;
    }
    if (opt.success) {
      fn.success = opt.success;
    }


    // 扩展增强处理
    var _opt = $.extend(opt, {
      cache: false,
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        fn.error(XMLHttpRequest, textStatus, errorThrown);
      },
      success: function(msg, textStatus) {
        if (this.url.indexOf('www.xianxia.com') > 0) {
          // if (this.url.indexOf('admin.91xianxia.com') > 0) {
          if (msg == undefined) {
            location.href = "./404.html";
            return false;
          }

          if ($.type(msg) == 'string' && msg.match("^\{(.+:.+,*){1,}\}$")) {
            msg = $.parseJSON(msg);
          }

          if ($.isPlainObject(msg)) {
            if (msg.resultCode == 10) {
              msg = msg.data;
            } else if (msg.resultCode == 10001) {
              location.href = "./login.html";
              return false;
            } else if (msg.resultCode == 10002) {
              var context = $("#context");
              if (context.size() > 0) {
                $("#context").load(WEB_URL + '/noauth.html');
              }
              return false;
            }
          }
        }

        fn.success(msg, textStatus);
      }
    });
    return _ajax(_opt);
  };
})(jQuery);


jQuery.addThumbImage = function(img_url, tar, width, height) {
  reset = function(img) {
    var dialog_w = width;
    var dialog_h = height;
    var showWidth, showHeight;
    var scale_h, scale_w;

    scale_h = img.height / dialog_h;
    scale_w = img.width / dialog_w;

    if (scale_h > 1 || scale_w > 1) {
      if (scale_h > scale_w) {
        showWidth = img.width / scale_h;
        showHeight = dialog_h;
      } else {
        showHeight = img.height / scale_w;
        showWidth = dialog_w;
      }
    } else if (scale_h <= 1 && scale_w <= 1) {
      if (scale_h > scale_w) {
        showWidth = img.width / scale_h;
        showHeight = img.height / scale_h;
      } else {
        showHeight = img.height / scale_w;
        showWidth = img.width / scale_w;
      }
    } else {
      showWidth = img.width;
      showHeight = img.height;
    }
    tar.prop('height', showHeight);
    tar.prop('width', showWidth);
    tar.prop('src', img_url);
  };

  var img = new Image();
  try {
    img.src = img_url;
    if (img.complete) {
      reset(img);
      return;
    }

    img.onerror = function() {
      console.log('load img fail');
      tar.prop('height', width);
      tar.prop('width', height);
      tar.prop('src', img_url);
    };

    img.onload = function() {
      reset(img);
    };

  } catch (err) {
    console.log('load img fail');
    tar.prop('height', width);
    tar.prop('width', height);
    tar.prop('src', img_url);
  }

};


$.startWith = function(str, tar) {
  if (!str && str != '' && !tar && tar != '' && str.length > tar.length) {
    var end = tar.length;
    if (str.substr(0, end) == tar) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

$.endWith = function(str, tar) {
  if (!str && str != '' && !tar && tar != '' && str.length > tar.length) {
    var _le = tar.length;
    var _st = str.length - _le;
    if (str.substring(_st, str.length) == tar) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

$.cookie = function(name, value, options) {
  if (typeof value != 'undefined') { // name and value given, set cookie
    options = options || {};
    if (value === null) {
      value = '';
      options.expires = -1;
    }
    var expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
      var date;
      if (typeof options.expires == 'number') {
        date = new Date();
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
      } else {
        date = options.expires;
      }
      expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
    }
    var path = options.path ? '; path=' + options.path : '';
    var domain = options.domain ? '; domain=' + options.domain : '';
    var secure = options.secure ? '; secure' : '';
    document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
  } else { // only name given, get cookie
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
};

function updatePagerIcons(table) {
  var replacement = {
    'ui-icon-seek-first': 'icon-double-angle-left bigger-140',
    'ui-icon-seek-prev': 'icon-angle-left bigger-140',
    'ui-icon-seek-next': 'icon-angle-right bigger-140',
    'ui-icon-seek-end': 'icon-double-angle-right bigger-140'
  };
  $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function() {
    var icon = $(this);
    var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
    if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
  });
}

$.fn.toggler = function(fn, fn2) {
  var args = arguments,
    guid = fn.guid || $.guid++,
    i = 0,
    toggler = function(event) {
      var lastToggle = ($._data(this, "lastToggle" + fn.guid) || 0) % i;
      $._data(this, "lastToggle" + fn.guid, lastToggle + 1);
      event.preventDefault();
      return args[lastToggle].apply(this, arguments) || false;
    };
  toggler.guid = guid;
  while (i < args.length) {
    args[i++].guid = guid;
  }
  return this.click(toggler);
};

(function($,w) {
	"use strict";
	 
	//"{0},{1},hehe".format("hello","world"); //hello,world,hehe
	  if (!String.prototype.format) {
	    String.prototype.format = function() {
	      var arg = arguments;
	      return this.replace(/\{(\d+)\}/g,
	        function(m, i) {
	          return arg[i];
	        });
	    };
	  }
	  // "   foo  ".trim() ==> "foo"
	  if(!String.prototype.trim) {
		  String.prototype.trim = function () {
		    return this.replace(/^\s+|\s+$/g,'');
		  };
		}
	  
	  //["adf","asdfd"].indexOf("adf") ==>  0
	  if(!Array.prototype.indexOf){
		  Array.prototype.indexOf = function( ele,fromIndex ){
			  var o = Object( this );
			  var len = o.length >>> 0;
			  var i = Number( fromIndex || 0 );
			  if( (i - parseFloat( i ) + 1) >= 0 ){
				  (i < 0) && (i += len);
				  for (; i < len; i++) {
	                if (i in o && o[i] === ele) {
	                        return i;
	                }
		        }
			  }
			  return -1;
		  };
	  }
	  
	 //将日期转换为特定字符串格式（如：yyyy-MM-DD hh:mm:ss）
	  if(!Date.prototype.format){
		  Date.prototype.format = function(fmt) { 
				 var o = { 
				   "M+" : this.getMonth()+1,                 //月份 
				   "d+" : this.getDate(),                    //日 
				   "h+" : this.getHours(),                   //小时 
				   "m+" : this.getMinutes(),                 //分 
				   "s+" : this.getSeconds(),                 //秒 
				   "q+" : Math.floor((this.getMonth()+3)/3), //季度 
				   "S"  : this.getMilliseconds()             //毫秒 
				 }; 
				 if(/(y+)/.test(fmt)) 
				   fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
				 for(var k in o) 
				   if(new RegExp("("+ k +")").test(fmt)) 
				 fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
				 return fmt; 
			};
	  }
	  
	  $.fn.extend({
	        fillwith:function(data,keys,template){
	        	var $this = this;
	        	if($this.length === 0)
	        		return $this;
	        	var t = template || "<option value='{0}'>{1}</option>",v,
	        	content = [];
	        	if($.isArray(keys) && $.isArray(data) && data.length >0){
        			content =$.map(data,function(ele,i){
	            		return String.prototype.format.apply(t,$.map(keys,function(key,index){
	            			return ele[key];
	            		}));
	            	});
	        	}
	        	if(this[0].type === "select-one"){
            		content.unshift("<option value='-1'>请选择</option>");
            	}
	        	$this.empty().html(content.join(""));
	        	if((v=$this.data("default"))){
	        		$this.val(v).trigger("change");
	        		$this.removeData("default");
	        	};
	        	return $this;
	        },
	        serializeObject:function(ignores,filters){
	        	
	        	var o = {},
	        		key,
	        		value,
	        		f,
	        		hasOwn = Object.prototype.hasOwnProperty;
	        	var a = this.serializeArray();
	        	$.each(a, function(i,e) {
	        		  key = e.name;	
	    			  if(!!filters && hasOwn.call(filters,key)){
	    				  f = filters[key];
	    				  if($.isFunction(f)){
	    					  f.call(this,e,i);
	    				  }
	    			  }
	    			  value = e.value || "";
	    			  if (hasOwn.call(o,key)) {
	  	    		      !$.isArray(o[key]) && (o[key]=[o[key]]); 
	  	    		      o[key].push(value);
	  	    		    } else {
	  	    		      o[key] = value;
	  	    		    }
	    		  });
	    		  return o;
		        }
	    });
	  
}(jQuery,window));

function formatTime(cellvalue, options, rowObject) {
	if (cellvalue != '' && cellvalue != undefined) {
		return cellvalue.substr(0, 16);
	} else {
		return '';
	}
}

function setAnswerForm(result,position){
	var $task_content = $(position);
	$task_content.empty();
	var temp_result,i=0,
	temp = " <div class='panel panel-info'><div class='panel-heading'><h3 class='panel-title'>t_title</h3></div><div class='panel-body'>t_content</div></div>";
	for(; i<result.length; i++){
        temp_result  =result[i];
        t = temp.replace("t_title",temp_result.label+"("+ (temp_result.required>0?"必答":"非必答")+")");
        r='';
        switch(temp_result.field_type){
            case 'text':
                r = temp_result.value || '';
                r = r.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
                break;
            case 'position':
                $task_content.append($(t).find("div.panel-body").addClass("t_position"+i).end());
                !function(index,lnglat){
                    geocoder(temp_result.value,function(d){
                    	if(d){
                    		$task_content.find("div.panel-body.t_position"+index).html(d.regeocode.formattedAddress+"("+lnglat+")")
                    	}else{
                    		$task_content.find("div.panel-body.t_position"+index).html(lnglat);
                    	}
                    });
                }(i,temp_result.value);
                break;
            case 'radio':
                if(temp_result.options){
                	var options = temp_result.options.split(',') ||[];
                    for(var j=0; j<options.length; j++){
                        r += "<input type='radio' "+ (temp_result.value === (j+"") ? 'checked ' :'') +" disabled>"+ (options[j] || "")+"&nbsp;&nbsp;&nbsp;";
                    }
                }
                break;
            case 'checkboxes' :
                if(temp_result.options){
                    var v = ","+temp_result.value+",";
                    var options = temp_result.options.split(',') ||[];
                    
                    for(var k=0; k<options.length; k++){
                        r += "<input type='checkbox' "+ (v.indexOf(','+k+',') >= 0 ? 'checked ': '') +" disabled>&nbsp;&nbsp;"+ (options[k] || "")+"&nbsp;&nbsp;&nbsp;";
                    }
                }
                break;
            case 'photo' :
                if (temp_result.value) {
                	var suffix = "";
                    r += '<div class="col-xs-12"><div class="row-fluid"><ul class="ace-thumbnails">';
                    $.each(temp_result.value.split(','), function(i, img) {
                    	if(img!=null && img!=""){
                    		suffix = "@4e_0o_1l_150h_272w_90q.src";
                    	}else{
                    		suffix = "";
                    		img = WEB_URL + "/resource/images/noAnswer.png";
                    	}
                        r += '<li style="width: 260px; height:150px;margin:0 10px;"><a href="' + img + '" target="_blank" data-rel="colorbox" class="cboxElement" style="text-align: center">' +
                             '<button style="border:0; padding: 0; width: 260px; height:150px"><img src="' + img + suffix + '" onerror="onerror=null;src=\''+WEB_URL+'/resource/images/errorAnswer.png\'" width="260px" height="150px"></button></a></li>';
                    });
                    r += '</div></div>';
                }
                break;
            case 'video' :
              r = '<video '+ (!!temp_result.value && "src="+temp_result.value)+ ' controls="controls" width="500px" height="300px">您的浏览器不支持 video 标签。</video>';
              break;
            case 'barcode':
            	r = temp_result.value || '';
                r = r.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
                break;
            case 'qrcode':
            	r = temp_result.value || '';
                r = r.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
                break;
            default:
            	break;
        }
        temp_result.field_type !=="position" &&  $task_content.append(t.replace("t_content",r));
	}
}

function geocoder(xy, callback) {
	try {
		var lng = xy.substr(0, xy.indexOf(','));
		var lat = xy.substring(xy.indexOf(',') + 1);
		if(lng && lat){
			var lnglatXY = new AMap.LngLat(lng, lat); //需转为地址描述的坐标
			//加载地理编码插件 
			var geocoder;
			AMap.service(["AMap.Geocoder"], function() {
				geocoder = new AMap.Geocoder({
					radius: 1000,
					extensions: "all"
				});
				//逆地理编码
				geocoder.getAddress(lnglatXY, function(status, result) {
					//取回逆地理编码结果
					if (status === 'complete' && result.info === 'OK') {
						callback(result);
					}else{
						callback('');
					}
				});
			});
		}else{
			callback('');
		}
	} catch (e) {
		callback('');
	}
}

function postFormData(url,params){    //提供全局导出功能，伪造form表单提交下载行为
	 var _form = $('#export_data_form');
     if (_form.size() < 1) {
    	 var _form=$("<form id='export_data_form'>");//定义一个form表单
    	 _form.attr("style","display:none");
    	 _form.attr("target","");
    	 _form.attr("method","post");
     } 
     _form.attr("action",url);
	$.each(params, function (key, value) {
        input = $("<input type='hidden'>");
        input.attr({ "name": key });
        input.val(value);
        _form.append(input);
    });
	$(document.body).append(_form);
	_form.submit();//表单提交。
}