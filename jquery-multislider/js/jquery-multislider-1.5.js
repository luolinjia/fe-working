/**
 * MultiSlider
 * @auth: Karl Luo(360512239@qq.com)
 * @dependence jQuery
 * @createDate 08-03-2015
 * @updateDate 01-19-2017
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
            time, size = 0,
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
                dots: !0,
                number: !1,
                color: 'rgba(0,0,0,.2)',
                highlight: '#e63939',
                activeColor: 'rgba(0,0,0,.5)',
                dotWidth: '20px',
                activeWidth: '60px',
                verticalDuring: 1e3,
                aDuring: 3500,
                aBack: !0,
                aDirection: 'RTL'
            }, _ = {
                /**
                 * init the widget
                 */
                init: function () {
                    qty = settings.banners.length;
                    _.renderMainLayout();
                    _.excuteAfterLoaded();
                },
                /**
                 * check whether all images has loaded
                 */
                excuteAfterLoaded: function () {
                    var dom = '<div class="loading"><div class="spin"><div class="load"><span></span><span></span><span></span></div></div></div>',
                        deferreds = [];

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
                            }, 1e3);
                        }
                        deferreds.push(dfd);
                    });

                    $.when.apply(null, deferreds).done(function () {
                        settings.dots ? _.renderNaviLi() : '';
                        size = deferreds.length;
                        o.find('.loading').remove();
                        _.startAnimation(index);
                        _.bindHoverImage();
                        settings.dots ? _.bindDotsClick() : '';
                    });
                },
                /**
                 * render the main banner layout
                 */
                renderMainLayout: function () {
                    var list = [];
                    for (var i = 0, size = qty; i < size; i++) {
                        var item = settings.banners[i], mBanner = typeof(item['name']) === 'string' ? item['name'] : item['name']['step1'];
                        list.push('<div class="outer"><div class="inner">' + ((settings.aBack && item['name']['step2label']) ? '<img src="' + mBanner + '" alt=""/>' : '<a href="' + item.link + '" target="' + (item.target || '') +'"><img src="' + mBanner + '" alt=""/></a>') + '</div>' + (settings.aBack && item['name']['step2label'] ? '<a target="'+ (item.target || '') +'" href="' + item.link + '" class="inner-slider"><div class="inner-slider-img"><img src="' + item['name']['step2'] + '" /></div>' + (item['name']['step2label'] ? ('<button>' + item['name']['step2label'] + '</button>') : '') + '</a>' + ((item['name']['step3'] !== undefined && item['name']['step3'] !== '') && item['name']['step2label'] ? '<div class="inner-line"><img src="' + item['name']['step3'] + '" alt=""/></div>' : '') : '') + '</div>');
                    }
                    o.append(list.join(''));
                },
                /**
                 * render the dots
                 */
                renderNaviLi: function () {
                    var list = [];
                    for (var i = 0, size = qty; i < size; i++) {
                        list.push('<li data-no="' + (i + 1) + '">' + (settings.number ? i+1 : '') + '</li>');
                    }
                    var dom = '<div class="ol-div"><ol class="banner-icon">' + list.join('') + '</ol></div>';
                    o.append(dom);
                },
                /**
                 * set the dots style color
                 * @num {int}
                 */
                setNaviLi: function (num) {
                    $('li', $('.banner-icon', o))
                        .css({'background-color': settings.color, 'width': settings.dotWidth})
                        .eq(num).css('background-color', '')
                        .css({'background-color': settings.activeColor, 'width': settings.activeWidth});
                },
                /**
                 * execute the animation
                 * @num {int}
                 */
                startAnimation: function (num) {
                    index = num;
                    settings.dots ? _.setNaviLi(num - 1) : '';
                    _.bgAnimate();
                },
                /**
                 * init the banner css
                 */
                initBanner: function () {
                    var os = $('.outer', o).find('.inner'),
                        osLine = $('.outer', o).find('.inner-line'),
                        bannerList = o.find('.outer');

                    bannerList.css(CSS[settings.aDirection]).stop(true, true);
                    os.css({'width': settings.width});
                    osLine.css({'width': settings.width});
                },
                /**
                 * click the dots and show the clicked one.
                 */
                bindDotsClick: function () {
                    var clickFlag = 0;
                    $('li', $('.banner-icon', o)).click(function () {
                        if (clickFlag === 0) {
                            clickFlag = 1;
                            clearTimeout(time);
                            var thiz = $(this),
                                item = thiz.attr('data-no'),
                                bannerList = o.find('.outer');

                            _.initBanner();
                            _.setNaviLi(item - 1);
                            bannerList.eq(index - 2).css({'width': '100%', 'z-index': 2}).stop(true, true);
                            _.animation(item - 1);
                            index = thiz.attr('data-no') > (qty - 1) ? 1 : parseInt(thiz.attr('data-no')) + 1;
                            time = setTimeout(function () {
                                _.startAnimation(index);
                            }, settings.aDuring);
                            setTimeout(function(){clickFlag = 0;}, 1000);
                        }
                    });
                },
                /**
                 * hover the banners, show the current one and stop animation.
                 */
                bindHoverImage: function () {
                    $('.outer').off('mouseover').on('mouseover', function () {
                        clearTimeout(time);
                    }).off('mouseleave').on('mouseleave', function () {
                        time = setTimeout(function () {
                            _.startAnimation(index);
                        }, settings.aDuring);
                    });
                },
                /**
                 * Calculate the offset of images.
                 * @returns {number}
                 */
                getImgOffset: function () {
                    var currentWidth = o.parent().innerWidth(),
                        imgWidth = $('.inner', o).find('img').innerWidth(),
                        result = parseInt(imgWidth) - parseInt(currentWidth);
                    return  result > 0 ? result / 2 : 0;
                },
                /**
                 * the detail animation
                 */
                bgAnimate: function () {
                    var os = $('.outer', o).find('.inner'),
                        osLine = $('.outer', o).find('.inner-line'),
                        ios = os.parent();

                    _.initBanner();
                    var offsetWidth = _.getImgOffset();

                    if (size === 1) {
                        os.css({'right': -offsetWidth});
                        ios.eq(0).css({'width': '100%'});
                    } else {
                        if (settings.aDirection === 'RTL') {
                            os.css({'right': -offsetWidth}); osLine.css({'right': -offsetWidth});
                        } else {
                            os.css({'left': -offsetWidth}); osLine.css({'left': -offsetWidth});
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
                            _.startAnimation(index);
                        }, settings.aDuring);
                    }
                },
                /**
                 * set the animation css
                 * @num {int}
                 */
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
                        }, settings.verticalDuring, settings.aBack ? _.animationCallBack : '');
                },
                /**
                 * animation callback
                 */
                animationCallBack: function () {
                    var innerSlider = $('.inner-slider', o),
                        outer = $(this).parents('.outer');

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
