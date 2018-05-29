;(function($,un){
    "use strict";
    var noop = function(){},
        opt = {
            onInput:noop,
            onSelect:function(e,id,value){ //选择回调函数
                this.el.val(value);
            },
            choice_delete: noop,
            onFocus:un, //获得焦点回调
            icon_class:"icon-map-marker", //查询结果icon
            kv_map:{key:"result_id",value:"result_value"}, //结果 key-value
            mutiple:false, //是否多选
            maxHeight:300,
            error_tip:"无相关搜索结果，请尝试其他关键字！"  //无结果时展示的信息
        };


    function Banner(element,options){
        var o = $.extend({},opt,options);
        this.init(element,o);
    }

    Banner.prototype = {
        constructor: Banner,
        init:function(element,options){
            var that = this,
                container;
            that.options = options;
            that.el = element;
            that.searchText = "";
            element.attr("autocomplete","off");// 防止浏览器自动提示

            if(options.onFocus){ //获得焦点
                element.on("focus.searchBanner" ,function(e){
                	e.stopPropagation();
                    that.searchText = $.trim(this.value); //搜索词
                    if(typeof options.onFocus==="function"){
                        options.onFocus.call(that,e);
                    }
                });
            }
            element.on("input.searchBanner propertychange.searchBanner",function(e){ //注册用户输入事件
                that.searchText = $.trim(this.value); //搜索词
                that.inputTimer&&clearTimeout(that.inputTimer); //防止多次请求
                that.inputTimer = setTimeout(function(){
                    if(typeof options.onInput ==="function"){
                        options.onInput.call(that,e);
                    }
                },600);
            });

            container =  that.resultContainer = $('<div class="expand-box" style="display: none"></div>')
            									.css({"max-height":options.maxHeight+"px"}).insertAfter(element);
            if(options.mutiple){
                element.wrap("<div class='muti_container'><ul class='muti_choices'><li class='search_field'></li></ul></div>");
                element.addClass("search_input");
                that.el.closest(".muti_container").on("click","i.fa-close", $.proxy(that.onChoiceRemove,that));
                that.el.closest(".muti_container").on("click",function(e){
                    that.el.focus();
                });
            }
        	container.wrap("<div class='expand-wrapper'></div>");
            container.on("click","div", $.proxy(that.onSelect,that));
        },
        onChoiceRemove:function(e){ //删除多选中的选项
            var $this = $(e.currentTarget),
                search_id = $this.data("search_id"),
                that = this;
            e.stopPropagation();
            $this.closest("li.search_choice").remove();
            if(typeof that.options.choice_delete ==="function"){
                that.options.choice_delete.call(that,search_id,$this.text());
            }
        },
        onSelect:function(e){ //选择下拉选项回调函数
            var $this = $(e.currentTarget),
                that = this,
                search_txt = $.trim($this.text()),
                search_id =$this.data("result_id"),
                index = $this.data("index");
            if(that.options.mutiple){ //多选 则添加选项
                that.fillMutiple(search_id,search_txt);
            }
            if(typeof that.options.onSelect==="function"){
                that.options.onSelect.call(that,e,search_id,search_txt,index,that.datasource);
            }
            that.resultContainer.css("display","none");
        },
        fillMutiple:function(search_id,search_txt){
            var that = this;
            var search_choice = $("<li class='search_choice'></li>").html(search_txt+"<i class='fa fa-close'></i>").data("search_id",search_id);
            that.el.val("").closest("ul.muti_choices").find("li.search_field").before(search_choice);
        },
        render:function(source){ // 渲染返回结果至下拉框
            var that=this,
                reg = new RegExp(that.searchText.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"),'m'),//特殊符号转义
                resultHmtl = $(),
                result,
                i= 0,
                resultWrapper =  $("<div class='expand-result'></div>");
            that.datasource = source;
            if(source && typeof source !=="string" && source.length && source[0]){
                for(; i<source.length; i++){
                    var key = source[i][that.options.kv_map.key],value=source[i][that.options.kv_map.value] || "";
                    result = resultWrapper.clone().data("result_id",key).data("index",i).
                    	attr("title",value).
                        append("<i class='"+that.options.icon_class+"'></i>&nbsp;").
                        append( (value).replace(reg,"<strong>"+that.searchText+"</strong>"));
                    resultHmtl = resultHmtl.add(result);
                }
            }else{
                resultHmtl= resultHmtl.add(resultWrapper.append('<span class="result-warning">'+that.options.error_tip+'</span>'));
            }
            that.resultContainer.empty().append(resultHmtl).css("display","block");
            $(document).off("click.searchBanner").on("click.searchBanner",function(e){
            	var $this = $(e.target);
            	if($this.closest("div.expand-wrapper").length === 0 && !$this.is(that.el)){
            		that.hide();
            	}
            });
        },
        remove:function(){ //删除对象 清空dom元素和缓存对象
            var that = this;
            that.removeData("searchBanner").off(".searchBanner"); //删除当前对象
            $(document).off("click.searchBanner");
            that.resultContainer.off().remove();    //删除容器
        },
        hide: function(){ //隐藏结果框
            this.resultContainer.css("display","none");
            $(document).off("click.searchBanner");
        }
    };

    $.fn.searchBanner = function(options,args){
        var dataKey = "searchBanner";

        return this.each(function(){
            var $this = $(this);
            var instance = $this.data(dataKey);
            if(!instance){
                $this.data(dataKey, (instance = new Banner($this,options))); //dom元素中缓存该控件对象
            }
            if(typeof options ==="string"){ // 调用控件方法
                if(typeof instance[options] ==="function"){
                    instance[options](args);
                }
            }
        });
    };

})(jQuery);