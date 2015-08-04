/**
 * Created by Karl on 2015/8/4.
 */
$(function () {
    var _index = {
        bindHoverForCloud: function () {
            var $cloud = $('.cloud', $('.c-function')), cloudforIE = $cloud.find('.cloud-info-forIE');
            $cloud.hover(function () {
                cloudforIE.find('img').addClass('hover');
                cloudforIE.find('.word').addClass('hover');
            }, function () {
                cloudforIE.find('img').removeClass('hover');
                cloudforIE.find('.word').removeClass('hover');
            });
            if (!+"\v1") { // tell whether it's the IE678
                cloudforIE.find('img').hide();
                cloudforIE.find('.word').hide();
            }
        },
        bindUnHoverForApp: function () {
            var $app = $('.app', $('.c-function')),
                flightPath = $('.inner .flight-path', $app),
                bgFlight = $('.bg-flight', $app),
                bgApp = $('.bg-app', $app),
                bgWord = $('.bg-word', $app),
                front = $('.front', $app),
                innerFront = $('.inner-front', $app);
            $app.mouseleave(function () {
                flightPath.removeClass('hover');
                if (!bgFlight.hasClass('unhover') && bgFlight.hasClass('hover')) {
                    bgFlight.addClass('unhover');
                }
                setTimeout(function () {
                    bgApp.addClass('hidden');
                }, 300);
                bgWord.removeClass('hover');
                front.removeClass('hover');
                innerFront.removeClass('hover');
                //bgApp.removeClass('hover');
            }).mouseenter(function () {
                flightPath.addClass('hover');
                if (!bgFlight.hasClass('hover')) {
                    bgFlight.addClass('hover');
                    setTimeout(function () {
                        bgFlight.css('opacity', 1);
                    }, 500);
                }
                bgApp.removeClass('hidden');
                bgWord.addClass('hover');
                front.addClass('hover');
                innerFront.addClass('hover');
            });

            /* ¼àÌý±ä»»ÊÂ¼þ! */
            var animationEvent = whichAnimationEvent();
            animationEvent && bgFlight[0].addEventListener(animationEvent, function() {
                if (bgFlight.hasClass('hover') && bgFlight.hasClass('unhover')) {
                    setTimeout(function () {
                        bgFlight.animate({opacity: 0}, 300, function () {
                            bgFlight.removeClass('hover unhover');
                        });
                    }, 300);
                }
            });
        },
        bindHoverForData: function () {
            var $data = $('.data', $('.c-function')), word = $('.data-word', $data);
            $data.mouseenter(function () {
                word.addClass('hover');
            }).mouseleave(function () {
                word.removeClass('hover');
            });
        }
    };

    _index.bindHoverForCloud();
    _index.bindUnHoverForApp();
    _index.bindHoverForData();

    /* Ì½²âä¯ÀÀÆ÷ÖÖÀà */
    function whichAnimationEvent(){
        var t;
        var el = document.createElement('fakeelement');
        var animations = {
            'animation':'animationend',
            'OAnimation':'oAnimationEnd',
            'MozAnimation':'animationend',
            'WebkitAnimation':'webkitAnimationEnd'
        };

        for(t in animations){
            if( el.style[t] !== undefined ){
                return animations[t];
            }
        }
    }
});