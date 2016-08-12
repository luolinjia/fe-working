/**
 * Created by Karl on 2016/8/10.
 */
$(function () {
    function resizeRender(){
       $('.content').css('min-height', Math.max($(window).height() - 90 - 40, $('.menu').height()));
    }
    resizeRender();

    var $topLis = $('.c-top-li');
    $topLis.hover(function () {
        $(this).addClass('hover');
    }, function () {
        $(this).removeClass('hover');
    });

});