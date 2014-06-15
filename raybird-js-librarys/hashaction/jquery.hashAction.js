/**
 * 簡易 jQuery function base plugin 
 * @author raybird
 */
$(function($, window) {
	
	// scope config
	var baseConfig = {
		
			loadPage: {
				hashWatch:false, // loadPage 的監視是否啟用 hashWatch 標記
				urls: [],		 // 用來 loadPage 存放資源路徑
				domMapping: {}	 // 用來記錄 url 作用的 dom
			},
		
	};
	
	if( typeof String.prototype.startsWith != 'function' ){
		//判斷字串開頭是否為指定的字
		//回傳: bool
		String.prototype.startsWith = function(prefix)
		{
			return (this.substr(0, prefix.length) === prefix);
		};		
	}
	
	if( typeof String.prototype.endsWith != 'function' ){
		//判斷字串結尾是否為指定的字
		//回傳: bool
		String.prototype.endsWith = function(suffix)
		{
			return (this.substr(this.length - suffix.length) === suffix);
		};
	}

	if( typeof String.prototype.contains != 'function' ){
		
		//判斷字串是否包含指定的字
		//回傳: bool
		String.prototype.contains = function(txt)
		{
			return (this.indexOf(txt) >= 0);
		};
	}
	
	
	/**
	 * 利用 hash 的變動 來達到 ajax 更新畫面。
	 * usage:
	 * data-url="要 load 的資源"
	 * 例如:
	 * <ul>
	 * 	<li class="js-load" data-url="test/test"></li>
	 * 	<li class="js-load" data-url="test/test/123"></li>
	 * </ul>
	 * 
	 * <script>
	 * 	var options = {
	 * 		targetView = $("#main"),
	 *  }
	 * 	$(".js-load").loadPage(options);
	 * 
	 * </scrip>	
	 * 
	 * @param actionPage 要載入資訊
	 * @param targetView 要載入 html 結果的 jQuery 物件
	 * @param 載入完畢呼叫的 callback
	 */
	$.fn.loadPage = function ( settings ){
		var _defaultSettings = {
				version: "0.2.0",				// 版本
				actionPage : "",				// 要動作的頁面
		        callback: function () {},		// 執行完畢要另外執行的 callback
		        targetView: $("#page-wrapper"),	// 目標更新頁面
		        tokenFlag: "#~",				// url 顯示區隔 time token 的hash標記
		        bind: 'click',
		    },
		_settings = $.extend(_defaultSettings, settings),
		
		// private 的含式可把初始邏輯都放在宇此處
		_init = function() {
			// 單獨取得每個操縱 dom
			var $this = $(this);
			
			// 避免重複加入事件綁定
			if($this.hasClass("in-loadPage"))
				return;
			else
				$this.addClass("in-loadPage");
			
			var token,
			urlPath = $this.attr('data-url'),
			url = _settings.actionPage+urlPath;
			
			
			// 檢查 targetView
			_settings.targetView = (typeof _settings.targetView === 'string')?$("#"+_settings.targetView):_settings.targetView,
			
			baseConfig.loadPage.domMapping[urlPath] = _settings.targetView;
					
			// 紀錄
			baseConfig.loadPage.urls.push(urlPath);
			
			$this
			.bind(_setting.bind, function(e){
				e.preventDefault();
				token = new Date().getTime();
				location.hash = url+_settings.tokenFlag+token; // 加上 timestamp 讓每次 click 都能觸動 hash 的更新
				_settings.callback();
			});
	    };
	    
	    // 啟動監視 hash 載頁面機制，只啟動一次
	    if( baseConfig.loadPage.hashWatch != true ){
	    	// 監視 hash 的變動來載入畫面，主要是要搭配 loadPage 進行配合
	    	$(window).on('hashchange', function () { 
	    		var hash = window.location.hash.slice(1); 
	    		urlPath = hash.split(_settings.tokenFlag)[0];
	    		// 檢查 hash 是否在紀錄裡
	    		if($.inArray(urlPath, baseConfig.loadPage.urls)!= -1){
	    			
	    			// 對作用的 dom 載入 view
	    			baseConfig.loadPage.domMapping[urlPath].load(urlPath);
//	    			_settings.targetView.load(urlPath);	    			
	    		}
	    	});
	    	// 關閉標記
	    	baseConfig.loadPage.hashWatch = true;
	    }
	    
	    return this.each(_init);
	};
	
}(jQuery, window));