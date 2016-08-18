/**
 * Created by Zhang on 2016/8/13.
 */
$(function () {
    function resizeRender(){
        $('.content').css('min-height', Math.max($(window).height() - 90 - 40, $('.menu').height()));
    }
    resizeRender();
    function openDialog(){
    	$('.designer-img').on('click',function(e){
    		e.preventDefault();
            var dialog = new ZY.Dialog({
                title: '', //窗口标题的html，如果不设置则无标题
                content: '<div class="designer-detail"><img src="img/team/designer1-dialog.jpg"><div class="designer-intro"><h3>景俊霖</h3><p class="duty">首席设计师</p><p>从业时间：5年设计</p><p>设计理念：在有限空间创造无限可能</p><p>擅长风格：欧式、现代、地中海、美式、等…</p><p>获得荣誉：建玛特设计大赛二等奖</p><p>代表作品：龙湖.紫云台、保利香槟花园、沿海.赛洛城、景瑞.御蓝湾、协信.新都汇、东原桐麓、中铁北美时光、同景等…</p><div class="works"><img src="img/team/works1.jpg"><img src="img/team/works2.jpg"><img src="img/team/works3.jpg"><img src="img/team/works4.jpg"></div></div></div>',
                //窗口内容的html，必须是html格式不能是无格式纯文本，如果不设置则无内容
                beforeClose: null, //调用close方法时执行的callback，如果此callback返回false则会阻止窗口的关闭
                showClose: true,
                showFooter: false,
                className: 'dialog-wrapper', //窗口最外层容器的类名
                cache: false, //是否缓存。若为false则close()的时候会remove掉对话框对应的dom元素
                width: '1185px' //窗口宽度，如不传递默认为40%
            });
    		// $('body').css('overflow','hidden');
    		dialog.open();
    		// $('.dialog-wrapper').css('margin-top','-143px');
    	});
    }
    openDialog();
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