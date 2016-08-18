/**
 * Created by Karl on 2016/8/10.
 */
$(function () {
    function resizeRender(){
       $('.content').css('min-height', Math.max($(window).height() - 90 - 40, $('.menu').height()));
    }
    resizeRender();

    var imgs = {
        'fr': [
            'img/case/topFrance.jpg',
            'img/case/topFrance1.jpg',
            'img/case/topFrance2.jpg',
            'img/case/topFrance3.jpg',
            'img/case/topFrance4.jpg'
        ],
        'am': [
            'img/case/topAmerica.jpg',
            'img/case/topAmerica2.jpg',
            'img/case/topAmerica3.jpg',
            'img/case/topAmerica4.jpg',
            'img/case/topAmerica5.jpg',
            'img/case/topAmerica6.jpg',
            'img/case/topAmerica7.jpg',
            'img/case/topAmerica8.jpg'
        ],
        'ch': [
            'img/case/topChinese.jpg',
            'img/case/topChinese2.jpg',
            'img/case/topChinese3.jpg',
            'img/case/topChinese4.jpg',
            'img/case/topChinese5.jpg',
            'img/case/topChinese6.jpg',
            'img/case/topChinese7.jpg',
            'img/case/topChinese8.jpg'
        ]
    };

    var $topLis = $('.c-top-li');
    $topLis.hover(function () {
        $(this).addClass('hover');
    }, function () {
        $(this).removeClass('hover');
    });

    $topLis.on('click', function () {
        var thiz = $(this), flag = thiz.data('type'), dom = renderDom(flag);
        var dialog = new ZY.Dialog({
            title: '', //窗口标题的html，如果不设置则无标题
            content: dom,
            //窗口内容的html，必须是html格式不能是无格式纯文本，如果不设置则无内容
            beforeClose: null, //调用close方法时执行的callback，如果此callback返回false则会阻止窗口的关闭
            showClose: true,
            showFooter: false,
            className: '', //窗口最外层容器的类名
            cache: false, //是否缓存。若为false则close()的时候会remove掉对话框对应的dom元素
            width: '1040px' //窗口宽度，如不传递默认为40%
        });
        dialog.open();
    });
    function renderDom(flag) {
        var list = [];
        for (var i = 0, size = imgs[flag].length; i < size; i++) {
            var item = imgs[flag];
            list.push('<img src="' + item[i] + '" />');
        }
        return list.join('');
    }
    $('.icon-wechat').on('click', function () {
        var dialog = new ZY.Dialog({
            title: '', //窗口标题的html，如果不设置则无标题
            content: '<div><img src="img/wechat.png" /></div>',
            //窗口内容的html，必须是html格式不能是无格式纯文本，如果不设置则无内容
            beforeClose: null, //调用close方法时执行的callback，如果此callback返回false则会阻止窗口的关闭
            showClose: true,
            showFooter: false,
            className: '', //窗口最外层容器的类名
            cache: false, //是否缓存。若为false则close()的时候会remove掉对话框对应的dom元素
            width: '311px' //窗口宽度，如不传递默认为40%
        });
        dialog.open();
    });
});