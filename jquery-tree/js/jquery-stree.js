/**
 * jQuery simple tree
 * @auth: Karl Luo(360512239@qq.com)
 * @dependence jQuery
 * @createDate 09-03-2015
 * @usage:
 * <div class="all"></div>
 *
 **/
(function($){
    $.fn.stree = function (options) {
		var settings = {

			}, _ = {
				renderEachLayout: function (data) {
					var  list = [], i = 0, size = data.length;
					list.push('<ul>');
					for (; i < size; i++) {
						var item = data[i], dom = '';
						if (undefined !== item.children) {
							dom = '<li><div><a href="#" class="icon-keyboard_arrow_down"></a><a>' + item['label'] + '</a></div>' + _.renderEachLayout(item.children) + '</li>';
						} else {
							dom = '<li><div><a href="' + item['link'] + '">' + item['label'] + '</a></div></li>';
						}
						list.push(dom);
					}
					list.push('</ul>');
					return list.join('');
				}
			};

        settings = $.extend(settings, options);
        _.init();
    };
})(jQuery);