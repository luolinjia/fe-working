/**
 * Scroll pictures.
 * @project: https://github.com/luolinjia/fe-working/tree/gh-pages/jquery-picScroll
 * @auth: Karl Luo(360512239@qq.com)
 * @dependence jQuery
 * @usage:
 * <div id="testBox">
 *    <img src="img/1.jpg"/>
 *    <img src="img/2.jpg"/>
 *    <img src="img/3.jpg"/>
 *    <img src="img/4.jpg"/>
 * </div>
 *
 * $('#testBox').picScroll({
 *      size: {height: 300, width: 800}, // show the img size, this is required.
 *      number: 5,  // the navigation number (>=5)
 *      animation: false,   // the navigation animation switch
 *      time: 2000,  // the time every scrolling
 *      hasNumber: false  // whether showing number, the default value is false
 * });
 **/
(function ($) {
    $.fn.picScroll = function (options) {
        var index = 1,
            time,
            o = $(this),
            qty = o.find('img').length,
            CSS = {
                naviUL: {
                    'position': 'absolute',
                    'width': '100%',
                    'z-index': 2,
                    'white-space': 'nowrap',
                    'overflow': 'hidden',
                    'margin': 0,
                    'padding': 0
                },
                naviLi: {
                    'display': 'inline-block',
                    'text-align': 'center',
                    'margin-right': '10px',
                    'margin-top': '5px',
                    'cursor': 'pointer',
                    'font-size': '0px',
                    'vertical-align': 'middle'
                }
            },
            setting = {
                position: 'bl',  //tl, tr, bl, br
                style: 'square', // square, round
                number: 5, // display the number regarding the small pictures. >= 5
                time: 2000,
                hasNumber: false,
                animation: false,
                //color: 'rebeccapurple',
                //hovercolor: '#6fcebb',
                size: {
                    'width': 800,
                    'height': 300
                }
            },
            _ = {
                init: function () {
                    _.renderCSS();
                    _.renderNavi();
                    _.switchPic(index);
                    _.bindHover();
                },
                getImgList: function () {
                    var imgs = o.find('img:not("#navis img")'), list= [];
                    for (var i = 0, size = qty; i < size; i++) {
                        list.push($(imgs[i]).attr('src'));
                    }
                    return list;
                },
                renderCSS: function () {
                    o.css({'position':'relative'}).css(setting.size).find('img').css(setting.size);
                },
                renderNavi: function () {
                    var itemWidth = (setting.size.width + 10) / (setting.number > 5 ? setting.number : 5),
                        list = [], imgList = _.getImgList();
                    list.push('<ul>');
                    for (var i = 0, size = qty; i < size; i++) {
                        list.push('<li data-no="' + (i+1) + '">' + (setting.hasNumber ? i+1 : '') + '<img src="' + imgList[i] + '"/></li>');
                    }
                    list.push('</ul>');
                    var dom = '<div id="navis">' + list.join('') + '</div>';
                    o.append(dom);
                    $('#navis ul').css(CSS.naviUL);
                    $('#navis').find('li').css(CSS.naviLi).css({
                        'width': itemWidth - 10
                    });
                    $('#navis').find('li img').css({'width': itemWidth - 10 - 6});
                },
                switchPic: function (num) {
                    index = num;
                    //$('li', o).css('background-color', setting.color).eq(index - 1).css('background-color', '').css('background-color', setting.hovercolor);
                    $('li img', o).css('border', '').eq(index - 1).css('border', '3px solid red');
                    //$('li img', o).removeClass('hover').eq(index - 1).addClass('hover');
                    $('img:not("#navis img")', o).hide().stop(true, true).eq(index - 1).fadeIn(500);
                    index = index + 1 > qty ? 1 : index + 1;
                    if (setting.animation) {
                        time = setTimeout(function () {
                            _.switchPic(index);
                        }, setting.time);
                    }
                },
                bindHover: function () {
                    $('li', $('#navis')).hover(function () {
                        if (setting.animation) {
                            clearTimeout(time);
                        }
                        var thiz = $(this), item = thiz.attr('data-no');
                        //$('li', o).css('background-color', setting.color).eq(item - 1).css('background-color', '').css('background-color', setting.hovercolor);
                        $('li img', o).css('border', '').eq(item - 1).css('border', '3px solid red');
                        //$('li img', o).removeClass('hover').eq(item - 1).addClass('hover');
                        $('img:not("#navis img")', o).hide().stop(true, true).eq(item - 1).fadeIn(500);
                    }, function () {
                        if (setting.animation) {
                            var thiz = $(this);
                            index = thiz.attr('data-no') > (qty - 1) ? 1 : parseInt(thiz.attr('data-no')) + 1;
                            time = setTimeout(function () {
                                _.switchPic(index);
                            }, setting.time);
                        }
                    });
                }
            };

        setting = $.extend(setting, options);
        _.init();
    };
})(jQuery);