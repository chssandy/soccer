
var xx_map = xx_map||{};
function initMap(){
    xx_map.initMap();
}
(function(xx_map){
       "use strict";
        var map = null,
        	marker = null,
        	noop = function(){},
        	cityName = null,
        	spotInfo = null,
        	_eventHandler = null,
        	_opt={
            		container:"xx_map_container",
            		eventHandler:{
            			click:noop,
            			dragend:noop
            		}
    			};
        
        xx_map.getMap =function(options){
        	$.extend(_opt,options);
        	cityName = _opt.cityName;
        	spotInfo = _opt.spotInfo;
        	_eventHandler = _opt.eventHandler
        	appendScript();
        };
        
       //异步加载地图插件
        function appendScript(){
        	var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "http://webapi.amap.com/maps?v=1.3&key=d3d21d57b15d57661984c11ea094e185&callback=initMap";
            document.body.appendChild(script);
        }
        
        xx_map.initMap = function(){
            map = new AMap.Map(_opt.container,{
                rotateEnable:true,
                dragEnable:true,
                resizeEnable:true,
                zoomEnable:true,
                //二维地图显示视口
                view: new AMap.View2D({
                    //center:new AMap.LngLat(104.083, 30.686),//地图中心点
                    zoom:13 //地图显示的缩放级别
                })
            });
            //地图中添加地图操作ToolBar插件
            map.plugin(["AMap.ToolBar"],function(){
                var toolBar = new AMap.ToolBar(); //设置地位标记为自定义标记
                map.addControl(toolBar);
            });
//            this.addMouseTool();
            this.addClickListener();
            
            cityName && xx_map.setCity(cityName);
//          添加执行点
            if(spotInfo){
                var lnglat  = spotInfo.split(",");
                this.addmarker(lnglat[0],lnglat[1]);
                map.setFitView();
            }
            xx_map.map = map;
        };

        xx_map.placeSearch = function(options,callback){
            AMap.service(["AMap.PlaceSearch"], function() {
               var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                    pageSize:20,
                    pageIndex:1,
                    city:options.cityName //城市
                });

                var cb = function(status, result){
                    if(callback && typeof callback==="function"){
                        callback(status,result);
                    }
                };
                //关键字查询
                placeSearch.search(options.name, cb);
            });
        };

        xx_map.autoComplete = function(options,callback){
            AMap.service(["AMap.Autocomplete"], function() {
                var auto = new AMap.Autocomplete({ //构造地点查询类
                    city:options.cityName //城市
                });

                var cb = function(status, result){
                    if(callback && typeof callback==="function"){
                        callback(status,result);
                    }
                };
                //关键字查询
                auto.search(options.name, cb);
            });
        };

        xx_map.clearMap = function(){
            map.clearMap();
        };
        
        xx_map.addClickListener=function(){
            //为地图注册click事件获取鼠标点击处的经纬度坐标
            xx_map.clickListener = AMap.event.addListener(map,'click',_markerEventHandler);
        };
        
      //添加marker
        xx_map.addmarker = function(lng,lat) {
            try{
                marker.setMap(null);
            }
            catch(e){

            }
             marker = new AMap.Marker({
                position:new AMap.LngLat(lng,lat),
                draggable:true, //点标记可拖拽
                cursor:'move',  //鼠标悬停点标记时的鼠标样式
                raiseOnDrag:true//鼠标拖拽点标记时开启点标记离开地图的效果
            });
            AMap.event.addListener(marker,"dragend",_markerEventHandler);
            marker.setMap(map);
        };

        //添加查询结果marker
        xx_map.addResultMarker = function(i,d) {
           var marker = new AMap.Marker({
                map: map,
                position:[d.location.getLng(),d.location.getLat()],
                icon:"http://webapi.amap.com/images/"+(i+1)+".png",
                title: d.name
            });
            AMap.event.addListener(marker,'click',_markerEventHandler);
        };
        
        xx_map.removeListener=function(listener){
            try{
               AMap.event.removeListener(listener);
            }catch(e){
                console.log(e);
            }
        };

        //设置地图城市信息 并设置值到隐藏域
        xx_map.setCity =function(cityName){
            if(!!map && cityName) {
                map.clearMap();
                map.setCity(cityName);
                map.setZoom("12");
            }
        };

        xx_map.mgeocoder = function(lng,lat,callback){
            //加载地理编码插件
            var MGeocoder;
            AMap.service(["AMap.Geocoder"], function() {
                MGeocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: "all"
                });
                //逆地理编码
                MGeocoder.getAddress(new AMap.LngLat(lng,lat),function(status, result){
                	 if(status === 'complete' && result.info === 'OK'){
                     	if(callback && typeof callback === "function"){
                     		callback.call(result,result.regeocode.formattedAddress,lng,lat);
                     	}
                     }
                });
            });
        }
        
        function _markerEventHandler(e){
        	var type,lng,lat,cb;
        	if(e){
        		type = e.type,lng = e.lnglat.lng,lat = e.lnglat.lat;
        		switch(type){
	        		case "click":
	    				xx_map.addmarker(lng,lat);
			            break;
	    			case "dragend" : break;
					default:break;
        		}
        	}
        	cb = _eventHandler[type];
        	if(cb && typeof cb==="function")
        		cb.call(this,lng,lat,e)
        }
        
})(xx_map);

