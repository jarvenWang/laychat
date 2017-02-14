/**
 * Created by Administrator on 2016/12/22.
 */
//链接跳转
var linkAboutVal = getCookie('aboutLink');
console.log(linkAboutVal);
var tabLi = $('.about-left-menu ul li'),
    aboutContent = $('.about-box-r .about-content'),
    aboutTitleSpan = $('.about-title span');
function linkAbout(num){
    if(!num){
        num = 0;
    }
    var aboutTitle = tabLi.eq(num).find('a').text();
    tabLi.removeClass('about-left-menu-active');
    tabLi.eq(num).addClass('about-left-menu-active');
    aboutTitleSpan.text(aboutTitle);
    aboutContent.hide();
    aboutContent.eq(num).show();
}

//tab切换
function aboutTab(){
    tabLi.click(function(){
        var liIndex = $(this).index();
        var title = $(this).find('a').text();
        $(this).addClass('about-left-menu-active').siblings('.about-left-menu li').removeClass('about-left-menu-active');
        aboutTitleSpan.text(title);
        aboutContent.eq(liIndex).show().siblings('.about-content').hide();
    })
}

$(document).ready(function(){
    linkAbout(linkAboutVal);
    aboutTab();
});