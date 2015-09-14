/**
 * jQuery simple select
 * @auth: Karl Luo(360512239@qq.com)
 * @gitHub: https://github.com/luolinjia/fe-working/tree/gh-pages/select
 * @dependence jQuery
 * @createDate 09-03-2015
 * @usage:
 * <div class="all">
 * 		<select>...</select>
 * </div>
 *
 * $('select').iselect();
 *
 **/
(function($){
	$.fn.iselect = function (options) {
		var $input = $(this),
			settings = {
				icon: 'icon-keyboard_arrow_down',
				hasRedirect: false,
				hasSearch: false,
				searchIcon: '',
				searchData: {
					url: '',
					data: {}
				}
			}, _ = {
				init: function () {
					var i = 0, size = $input.length;
					for (; i < size; i++) {
						_.wrapSelect($($input[i]));
					}
				},
				wrapSelect: function (self) {
					// get the select value
					var selectList = $('option', self).map(function () {
						var thiz = $(this), _key = thiz.attr('value'), _url = thiz.attr('data-url'), _val = thiz.text(), _isSelected = !!thiz.attr('selected');
						return _key + '_*' + _url + '_*' + _val + '_*' + _isSelected;
					}), i = 0, size = selectList.length, list = [], defaultKey = '', defaultVal = '';

					for (; i < size; i++) {
						var item = selectList[i].split('_*'), key = item[0], url = item[1], val = item[2], isSelected = item[3];
						if ('true' === isSelected) {
							defaultKey = key;
							defaultVal = val;
						} else {
							if (i === 0) {
								defaultVal = val;
							}
						}
						list.push('<li data-val="' + key + '" ' + ('true' === isSelected ? 'selected' : '') + '><a href="' + ('undefined' !== url ? url : 'javascript:;') + '">' + val + '</a></li>');
					}

					self.wrap('<div class="i-select"></div>').parent().prepend('<span>' + defaultVal + '</span><i class="' + settings.icon + '"></i><ul>' + (settings.hasSearch ? '<div class="search"><input type="text"/>' + (settings.searchIcon === '' ? '' : '<i class="' + settings.icon + '"></i>') + '</div>' : '') + list.join('') + '</ul>');
					self.addClass('for-select').parent().css('width', self.outerWidth());

					_.bindEvents(self.parent(), defaultKey);
				},
				bindEvents: function (self, defaultKey) {
					var lis = $('li', self), $select = $('select', self);

					self.hover(function () {
						$(this).find('ul').stop().slideDown(200);
					}, function () {
						$(this).find('ul').stop().slideUp(200);
					});

					// set default value for the select
					if ('' === defaultKey) {
						$(lis[0]).addClass('selected');
						$select.find('option:first').attr('selected', 'selected');
					} else {
						lis.each(function () {
							$(this).attr('data-val') === defaultKey ? $(this).addClass('selected') : '';
						});
						$select.find('option[value="' + defaultKey + '"]').attr('selected', 'selected');
					}

					lis.on('click', function () {
						var thiz = $(this), key = thiz.attr('data-val'), value = thiz.text();
						$('span', self).text(value);
						lis.removeClass('selected');
						thiz.addClass('selected');
						$select.find('option').removeAttr('selected');
						$select.val(key).find('option[value="' + key + '"]').attr('selected', 'selected');
						thiz.parent().fadeOut(100);
					});
				}
			};

		settings = $.extend(settings, options);
		_.init();
	};
})(jQuery);