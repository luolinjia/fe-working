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
        var o = $(this),
            o_qty = o.length,
            index = [],
            time = [],
            qtys = [],
            //qty = o.find('img').length,
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
                    for (var k = 0, kSize = o_qty; k < kSize; k++) {
                        var itemO = $(o[k]);
                        index[k] = 1;
                        time[k] = undefined;
                        qtys[k] = $(o[k]).find('img').length;
                        _.renderCSS(itemO);
                        _.renderNavi(itemO, qtys[k]);
                        _.switchPic(itemO, index[k], k);
                        _.bindDotsClick(itemO, k);
                    }
                },
                getImgList: function (self, qty) {
                    var imgs = self.find('img:not(".navis img")'), list= [];
                    for (var i = 0, size = qty; i < size; i++) {
                        list.push($(imgs[i]).attr('src'));
                    }
                    return list;
                },
                renderCSS: function (self) {
                    self.css({'position':'relative'}).css(setting.size).find('img').css(setting.size);
                },
                renderNavi: function (self, qty) {
                    var itemWidth = (setting.size.width + 10) / (setting.number > 5 ? setting.number : 5),
                        list = [], imgList = _.getImgList(self, qty);
                    list.push('<ul>');
                    for (var i = 0, size = qty; i < size; i++) {
                        list.push('<li data-no="' + (i+1) + '">' + (setting.hasNumber ? i+1 : '') + '<img src="' + imgList[i] + '"/></li>');
                    }
                    list.push('</ul>');
                    var dom = '<div class="navis">' + list.join('') + '</div>';
                    self.append(dom);
                    $('.navis ul', self).css(CSS.naviUL);
                    $('.navis', self).find('li').css(CSS.naviLi).css({
                        'width': itemWidth - 10
                    });
                    $('.navis', self).find('li img').css({'width': itemWidth - 10 - 6});
                },
                switchPic: function (self, num, k) {
                    index[k] = num;
                    //$('li', o).css('background-color', setting.color).eq(index - 1).css('background-color', '').css('background-color', setting.hovercolor);
                    $('li img', self).css('border', '').eq(index[k] - 1).css('border', '3px solid red');
                    //$('li img', o).removeClass('hover').eq(index - 1).addClass('hover');
                    if (qtys[k] > 1) {
                        $('img:not(".navis img")', self).hide().stop(true, true).eq(index[k] - 1).fadeIn(500);
                        index[k] = index[k] + 1 > qtys[k] ? 1 : index[k] + 1;
                        if (setting.animation) {
                            time[k] = setTimeout(function () {
                                _.switchPic(self, index[k], k);
                            }, setting.time);
                        }
                    }

                },
                bindDotsClick: function (self, k) {
                    if (qtys[k] > 1) {
                        $('.navis li', self).hover(function () {
                            if (setting.animation) {
                                clearTimeout(time[k]);
                            }
                            var thiz = $(this), item = thiz.attr('data-no');
                            //$('li', o).css('background-color', setting.color).eq(item - 1).css('background-color', '').css('background-color', setting.hovercolor);
                            $('li img', self).css('border', '').eq(item - 1).css('border', '3px solid red');
                            //$('li img', o).removeClass('hover').eq(item - 1).addClass('hover');
                            $('img:not(".navis img")', self).hide().stop(true, true).eq(item - 1).fadeIn(500);
                        }, function () {
                            if (setting.animation) {
                                var thiz = $(this);
                                index[k] = thiz.attr('data-no') > (qtys[k] - 1) ? 1 : parseInt(thiz.attr('data-no')) + 1;
                                time[k] = setTimeout(function () {
                                    _.switchPic(self, index[k], k);
                                }, setting.time);
                            }
                        });
                    }
                }
            };

        //for (var m = 0; m < o_qty; m++) {
        //
        //    setting.push($.extend({
        //        position: 'bl',  //tl, tr, bl, br
        //        style: 'square', // square, round
        //        number: 5, // display the number regarding the small pictures. >= 5
        //        time: 2000,
        //        hasNumber: false,
        //        animation: false,
        //        //color: 'rebeccapurple',
        //        //hovercolor: '#6fcebb',
        //        size: {
        //            'width': 800,
        //            'height': 300
        //        }
        //    }, options));
        //
        //    setting = $.extend(setting, options);
        //    _.init();
        //}
        setting = $.extend(setting, options);
        _.init();
    };
})(jQuery);