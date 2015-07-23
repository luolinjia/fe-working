/**
 * MultiSlider
 * @auth: Karl Luo(360512239@qq.com)
 * @dependence jQuery
 * @createDate 07-22-2015
 * @usage:
 * <div class="all"></div>
 *
 * $('.all').multislider({
 *      banners: [{name: '', link: ''}, {name: '', link: ''}],      // banners is required!!!!
 *      width: 1920,                // the default width value
 *      dots: true,                 // display the dots under of it.
 *		number: false,              // display the number regarding dots.
 *		color: '#e6e6e6',           // set the default color for the dots' background-color
 *		verticalDuring: 1000,       // the time of animation regarding the transition vertical
 *		highlight: '#e63939',       // highlight the dots' background-color
 *		aDuring: 3500,              // set the total animation time
 *		aBack: true,                // set whether you need to animate something after showing the right to left.
 * 		aDirection: 'RTL'           // 'RTL' right to left; 'LTR' left to right
 * });
 **/
(function($){
    $.fn.multislider = function (options) {
        var index = 1, flag = 1,
            time,
            o = $(this),
            qty = 0,
            CSS = {
                RTL: {
                    'z-index': 1,
                    'width': 0,
                    'right': 0,
                    'left': 'auto'
                },
                LTR: {
                    'z-index': 1,
                    'width': 0,
                    'right': 'auto',
                    'left': 0
                }
            },
            settings = {
                width: 1920,
                dots: true,
                number: false,
                color: '#e6e6e6',
                highlight: '#e63939',
                verticalDuring: 1000,
                aDuring: 3500,
                aBack: true,
                aDirection: 'RTL'
            }, _ = {
                init: function () {
                    qty = settings.banners.length;
                    _.renderMainLayout();
                    settings.dots ? _.renderNaviLi() : '';
                    _.excuteAfterLoaded();
                },
                excuteAfterLoaded: function () {
                    var dom = '<div class="loading"><div class="spin"><img src="img/loading.png" class="icon-spin5 animate-spin"/>loading...</div></div>', defereds = [];
                    o.prepend(dom).find('img').each(function () {
                        var dfd = $.Deferred();
                        $(this).bind('load', function () {
                            dfd.resolve();
                        }).bind('error', function (e) {
                            console.log('图片路径出错！或者网络问题！');
                        });
                        if (this.complete) {
                            setTimeout(function () {
                                dfd.resolve();
                            }, 1000);
                        }
                        defereds.push(dfd);
                    });
                    $.when.apply(null, defereds).done(function () {
                        o.find('.loading').remove();
                        _.expendWidth(index);
                        settings.dots ? _.bindHover() : '';
                    });
                },
                renderMainLayout: function () {
                    var list = [];
                    for (var i = 0, size = qty; i < size; i++) {
                        var item = settings.banners[i], mBanner = typeof(item['name']) === 'string' ? item['name'] : item['name']['step1'];
                        list.push('<div class="outer"><div class="inner">' + (settings.aBack ? '<img src="' + mBanner + '" alt=""/>' : '<a href="' + item.link + '"><img src="' + mBanner + '" alt=""/></a>') + '</div>' + (settings.aBack ? '<a href="' + item.link + '" class="inner-slider"><div class="inner-slider-img"><img src="' + item['name']['step2'] + '" /></div><button>' + item['name']['step2label'] + '</button></a><div class="inner-line"><img src="' + item['name']['step3'] + '" alt=""/></div>' : '') + '</div>');
                    }
                    o.append(list.join(''));
                },
                renderNaviLi: function () {
                    var list = [];
                    for (var i = 0, size = qty; i < size; i++) {
                        list.push('<li data-no="' + (i + 1) + '">' + (settings.number ? i+1 : '') + '</li>');
                    }
                    var dom = '<ol class="banner-icon">' + list.join('') + '</ol>';
                    o.append(dom);
                },
                setNaviLi: function (num) {
                    $('li', $('.banner-icon', o)).css('background-color', settings.color).eq(num).css('background-color', '').css('background-color', settings.highlight);
                },
                expendWidth: function (num) {
                    index = num;
                    settings.dots ? _.setNaviLi(num - 1) : '';
                    _.bgAnimate();

                },
                initBanner: function () {
                    var os = $('.outer', o).find('.inner'), osLine = $('.outer', o).find('.inner-line'), bannerList = o.find('.outer');
                    bannerList.css(CSS[settings.aDirection]).stop(true, true);
                    os.css({'width': settings.width});
                    osLine.css({'width': settings.width});
                },
                bindHover: function () {
                    $('li', $('.banner-icon', o)).click(function () {
                        clearTimeout(time);
                        var thiz = $(this), item = thiz.attr('data-no'), bannerList = o.find('.outer');
                        _.initBanner();
                        _.setNaviLi(item - 1);
                        bannerList.eq(index - 2).css({'width': '100%', 'z-index': 2}).stop(true, true);
                        _.animation(item - 1);
                        index = thiz.attr('data-no') > (qty - 1) ? 1 : parseInt(thiz.attr('data-no')) + 1;
                        time = setTimeout(function () {
                            _.expendWidth(index);
                        }, settings.aDuring);
                    });
                },
                bgAnimate: function () {
                    var os = $('.outer', o).find('.inner'), osLine = $('.outer', o).find('.inner-line'), ios = os.parent();
                    _.initBanner();
                    if (settings.aDirection === 'RTL') {
                        os.css({'right': 0}); osLine.css({'right': 0});
                    } else {
                        os.css({'left': 0}); osLine.css({'left': 0});
                    }
                    if (index === 1 && flag === 1) {
                        ios.eq(0).css({'width': '100%'});
                    } else {
                        ios.eq(index - 2).css({'width': '100%'});
                    }
                    _.animation(index - 1);

                    index = index + 1 > qty ? 1 : index + 1;
                    flag ++;
                    time = setTimeout(function() {
                        _.expendWidth(index);
                    }, settings.aDuring);
                },
                animation: function (num) {
                    o.find('.outer').eq(num)
                        .css({'z-index': 3})
                        .stop(true, true)
                        .animate({width: '100%'}, settings.verticalDuring)
                        .find('.inner img')
                        .css({'width': settings.width * 1.25, 'left': -150, 'top': -20})
                        .stop(true, true)
                        .animate({
                            width: settings.width,
                            left: '+=150',
                            top: '+=20'
                        }, settings.verticalDuring, settings.aBack ? _.animationBack : '');
                },
                animationBack: function () {
                    var innerSlider = $('.inner-slider', o), outer = $(this).parents('.outer');
                    innerSlider.removeClass('visible');
                    outer.find('.inner-slider').addClass('visible');
                    outer.find('.inner-line').addClass('animate-line');
                    setTimeout(function () {
                        outer.find('.inner-line').removeClass('animate-line');
                    }, settings.aDuring);
                }
            };

        settings = $.extend(settings, options);
        _.init();
    };
})(jQuery);