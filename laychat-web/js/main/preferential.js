/**
 * Created by Administrator on 2016/12/22.
 */

function preferentialTab(){
    $('.preferential-tab li').click(function(){
        var liIndex = $(this).index();
        var lineLeft = parseInt(80*liIndex);
        $(this).addClass('preferential-tab-active').siblings('.preferential-tab li').removeClass('preferential-tab-active');
        $('.line-slider').animate({'left':lineLeft+'px'},400,'swing');
        $('.preferential-box ul').eq(liIndex).fadeIn(200).siblings('.preferential-box ul').fadeOut(80);
    })
}

$(document).ready(function(){
    preferentialTab();
});