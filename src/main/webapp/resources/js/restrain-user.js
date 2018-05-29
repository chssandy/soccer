"use strict";
(function($,un) {
	var _opt = {
			selector:"#restrain_user",
			initData:{}
	},
		def=null;
	
	var initFn= {
			getRemoteGroupData:function(){
				return $.get(SERVER_URL+"/public/group",function(data){
					var tempArr = [];
					tempArr.push("<option value='-1'>请选择</option>");
					if(data && data.rows){
						$.each(data.rows,function(i,ele){
							tempArr.push("<option value='"+ele.group_id+"'>"+ele.group_name+"</option>");
						});
						$("#groupList").empty().html(tempArr.join(""));
					}
				});
			},
			restarinCheck:function(evt){
				$("#ruv").toggle();
			},
			restrainTypeCheck:function(e){
				var target = $(this).data("target");
				$(target).show().siblings("div.rt").hide();
			},
			init:function(){
				var d = _opt.initData;
				if( !!d && !$.isEmptyObject(d)){
					$("#restrainUser").click();
					if(d.sex !== un && d.sex !== '' && d.sex !== null){
						$("#restrainUserDiv").find("input[data-target='#restrainUserElementsDiv']").click();
						$("#restrainUserElementsDiv").find("input[type='radio'][value='"+d.sex+"']").prop("checked",true);
					}else if(d.group_id !== un && d.group_id !== '' && d.group_id !== null){
						$.when(def).done(function(){
							$("#groupList").val(d.group_id);
						});
					}
				}
				
			}
	};
	var RestrainUser = (function(){
		function RestrainUser(options) { //构造函数
			$.extend(_opt,options);
			$(_opt.selector).empty().html(temp);
			def =initFn.getRemoteGroupData();
			$("#restrainUser").click(initFn.restarinCheck);
			$("#restrainUserDiv").on("click","input[type='radio']",initFn.restrainTypeCheck);
			initFn.init();
		}
	    return RestrainUser;	
	})();
	window.RestrainUser = RestrainUser;
})(jQuery);


var temp = "<label class='col-lg-1 col-md-2 control-label'>可见人员控制:</label>"
				+"<div class='col-lg-6 col-md-8' id='restrainUserInfoDiv'>"
				+"<label class=' inline'><input  type='checkbox' class='ace ace-switch ace-switch-5' id='restrainUser' /><span class='lbl'></span>"
				+"</label>"
				+"</div>"
				+"<div id='ruv' style='display:none'>"
				+"<div class='form-group col-lg-12 col-md-12' id='restrainUserDiv' style='float:left;white-space: nowrap;'>"
				+"<label class='col-lg-1 col-md-4 control-label'>" 
				+"<input type='radio' class='ace' checked name='restrain_user' value='0' data-target='#restrainGroupDiv' ><span class='lbl'>按群组</span>"
				+"</label>"
				+"<label class='col-lg-1 col-md-4 control-label'>"
				+"<input type='radio'  class='ace' name='restrain_user' value='1' data-target='#restrainUserElementsDiv' >"
				+"<span class='lbl'>按会员属性</span>"
				+"</label>"
				+"</div>"
				
				+"<div class='form-group col-lg-12 col-md-12 rt'  id='restrainGroupDiv'>"
				+"<label class='col-lg-1 col-md-2 control-label'>组名:</label>"
				+"<div class='col-lg-3 col-md-4'>"
				+"<select  class='form-control' id='groupList' name='group_id'>"
				+"</select>"
				+"</div>"
				+"</div>"
				
				+"<div class='form-group col-lg-12 col-md-12 rt'  id='restrainUserElementsDiv' style='display:none'>"
				+"<label class='col-lg-1 col-md-2 control-label'>性别:</label>"
				+"<label class='col-lg-1 col-md-2 '>"
				+"<input type='radio' checked class='ace' name='sex' value='' >"
				+"<span class='lbl'>不限</span>"
				+"</label>"
				+"<label class='col-lg-1 col-md-2 '>"
				+"<input type='radio' class='ace' name='sex' value='0'>"
				+"<span class='lbl'>男</span>"
				+"</label>"
				+"<label class='col-lg-1 col-md-2 '>"
				+"<input type='radio' class='ace' name='sex' value='1'>"
				+"<span class='lbl'>女</span>"
				+"</label>"
				+"</div>"
				+"</div>";



function getRestrainUser()
{
	var obj = {};
	if($("#restrainUser").prop("checked")){
		var restrain_user = $('#restrainUserDiv input[name="restrain_user"]:checked ').val(); 
		if(restrain_user==0){
			obj.group_id = $('#restrainGroupDiv select[name="group_id"]').val();
		}else if(restrain_user ==1){
			if($('#restrainUserElementsDiv input[name="sex"]:checked').val()!=''){
				obj.sex = $('#restrainUserElementsDiv input[name="sex"]:checked').val();
			}
		}
	}
	return obj;
}