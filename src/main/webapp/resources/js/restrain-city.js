"use strict";
(function($,un) {
	var _opt = {
			selector:"#restrain_city",
			initData:{}
	},
	def=null;
	
	var initFn= {
			restarinCheck:function(evt){
				$("#restrainCityDiv").toggle();
			},
			restrainTypeCheck:function(e){
				var target = $(this).data("target");
				$(target).hide();
			},
			init:function(){
				var d = _opt.initData;
				if( !!d && !$.isEmptyObject(d))
				{
					var tree = $.fn.zTree.getZTreeObj('restrainCityTree');
					setTimeout(function (){
						 var flag = true;
						 $.each(d.cities, function(i, val){
							 	if(val.city_code=='14200000000'){
							 		flag = false;
							 	}else{
									var treeNode = tree.getNodeByParam('id', val.city_code);
									tree.checkNode(treeNode, true, true);
									//tree.checkNode(treeNode, true, treeNode.level == 0 ? false : true);
							 	}
							})
						if(flag){
							$("#restrainCity").click();
						}
					}, 1000);
				}
			}
	};
	var RestrainCity = (function(){
		function RestrainCity(options) { //构造函数
			$.extend(_opt,options);
			$(_opt.selector).empty().html(cityTemp);
			$.fn.zTree.init($("#restrainCityTree"), setting, null);
			$("#restrainCity").click(initFn.restarinCheck);
			initFn.init();
		}
	    return RestrainCity;	
	})();
	window.RestrainCity = RestrainCity;
})(jQuery);


var setting = {
	check: {
		enable: true,
		chkboxType: { "Y": "ps", "N": "ps" }
	},
	view: {
		showIcon: false
	},
	async: {
		enable: true,
		url: SERVER_URL + '/public/city/cityTree',
		dataFilter: function(treeId, parentNode, responseData) {
			var tree = $.fn.zTree.getZTreeObj(treeId);
			$.each(responseData.root, function(i, val) {
				tree.addNodes(null, {
					id: val.province_code,
					name: val.province_name,
					city_level: val.city_level
				});
			});
			$.each(responseData.children, function(i, val) {
				var father = tree.getNodeByParam('id', val.province_code);
				tree.addNodes(father, {
					id: val.city_code,
					name: val.city_name,
					city_level: val.city_level
				},
				true);
			})
		},
		dataType: 'json'
	},
	callback: {
		beforeClick: function(treeId, treeNode, clickFlag) {
			this.getZTreeObj(treeId).checkNode(treeNode, !treeNode.checked, true);
		}
	}
};

var cityTemp = "<label class='col-lg-1 col-md-2 control-label'>可见城市:</label>"
				+"<div class='col-lg-2 col-md-2' ><label class='inline'>"
				+"<input  type='checkbox' class='ace ace-switch ace-switch-5' id='restrainCity' data-target='#restrainCityDiv'/>"
				+"<span class='lbl'></span></label>"
				+"</div>"
				+"<div class='form-group col-lg-11 col-md-11 rt'  id='restrainCityDiv' style='display:none'>"
				+"<div class='zTreeDemoBackground left'>"
				+"<ul id='restrainCityTree' name='cities' class='ztree'></ul>"
				+"</div>"
				+"</div>";



function getNode(nodes)
{
	
	var obj = [];
	if($("#restrainCity").prop("checked")){
		for(var i=0;i<nodes.length;i++)
		{
			var cityObj = {};
			if(nodes[i].isParent)
			{//本身是父节点,并且是全选的父节点 则不管子节点
				if(nodes[i].getCheckStatus().half)
				{//半选父节点
					//$("#message").append("--"+nodes[i].name+"是半选父节点。 不存储<br>");
				}else
				{//全选节点(本身是父节点) 查看他的父节点是不是全选
					var parent = nodes[i].getParentNode();
					if(parent==null){//本身父节点为空 表示是全选根节点 应该存储
						//$("#message").append("----<span style='color:red;'>"+nodes[i].name+"</span>是全选父节点。 父节点为空，表示是全选根节点 应该存储 <br>");
						cityObj.city_code = nodes[i].id;
						cityObj.city_level = nodes[i].city_level;
						obj.push(cityObj);
					}else
					{//判断父节点不为空
						if(!parent.getCheckStatus().half){
							//$("#message").append("------"+nodes[i].name+"是全选父节点。 父节点是"+parent.name+", 父节点不是半选 不存储 本节点<br>");
						}else{
							//$("#message").append("------<span style='color:red;'>"+nodes[i].name+"</span>是全选父节点。 父节点是"+parent.name+", 父节点半选 存储 本节点（自己是全选父节点）<br>");
							cityObj.city_code = nodes[i].id;
							cityObj.city_level = nodes[i].city_level;
							obj.push(cityObj);
							/*var childs = nodes[i].children;
							if(childs){//获得所有子节点
								for(var j=0;j<childs.length;j++){
									childIds += " id="+childs[j].id+" name="+childs[j].name;
								}
							}*/
						}
					}
				}
			}else{//本身是叶子节点 父节点选中，则不存 父节点半选或者不选 则存下来
				var parent = nodes[i].getParentNode();
				if(parent==null){//全选叶子节点 父节点为空 即只有一个根节点 保存
					//$("#message").append("--<span style='color:red;'>"+nodes[i].name+"</span>是全选叶子节点。 父节点为空，即只有一个根节点 保存 <br>");
					cityObj.city_code = nodes[i].id;
					cityObj.city_level = nodes[i].city_level;
					obj.push(cityObj);
				}else{//全选叶子节点 有父节点
					if(parent.getCheckStatus().half){//父节点半选 存储
						//$("#message").append("----<span style='color:red;'>"+nodes[i].name+"</span>是全选叶子节点。 父节点是"+parent.name+"父节点半选 存储本节点 <br>");
						cityObj.city_code = nodes[i].id;
						cityObj.city_level = nodes[i].city_level;
						obj.push(cityObj);
					}else{//父节点全选 不存储
						//$("#message").append("----"+nodes[i].name+"是全选叶子节点。 父节点是"+parent.name+"父节点全选 不存储 <br>");
					}
				}
			}
		}
	}
	if(obj.length==0){
		var cityObj1= {};
		cityObj1.city_code = 14200000000;
		cityObj1.city_level = 2;
		obj.push(cityObj1);
	}
	return obj;
}