/**
 * Created by Karl on 2016/8/10.
 */
$(function () {
    function resizeRender(){
       $('.content').css('min-height', Math.max($(window).height() - 90 - 40, $('.menu').height()));
    }
    resizeRender();
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