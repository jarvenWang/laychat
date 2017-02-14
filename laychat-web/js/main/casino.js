/**
 * Created by Administrator on 2016/12/21.
 */
//轮播
function casinoSlide(){
    jQuery("#casino-slideTop").slide({mainCell:".bd ul",autoPage:true,effect:"topLoop",autoPlay:true,trigger:"click"});
    jQuery("#casino-slide").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"leftLoop",autoPlay:true,vis:3,trigger:"click"});
}

//显示游戏平台  电子 type=4
function casinoGamePlatform(){
    showGamePlatform(4,function(res){
        $('#loader-box').hide();
        var casinoLists = res.data.list;
        var casinoTopBox = $('.casino-tab ul'),
            casinoLeftBox = $('.casino-left-bar ul');
        //清空真人游戏平台列表
        casinoTopBox.html('');
        casinoLeftBox.html('');
        for(var i=0;i<casinoLists.length;i++){
            var casinoTopLi = ' <li><div class="casino-game-ico"><i class="icon-xtd"></i></div><p><a href="javascript:void(0)" class="casino-game-name"> '+casinoLists[i].name+'</a></p></li>';
            casinoTopBox.append(casinoTopLi);
            var casinoLeftLi = ' <li><span href="javascript:void(0)"><div class="casino-game-ico-small"><i class="icon-xtd"></i><span class="casino-game-name" style="display: none;"> '+casinoLists[i].name+'</span></div></a></li>';
            casinoLeftBox.append(casinoLeftLi);
        }
        casinoTab();
    });
}

//显示各平台下游戏
function showCasinoGameList(gameName){
    console.log(gameName);
    var urlToken = localStorage.token ? localStorage.token :'';
    var url = 'game-platform-detail?label='+pangu.myParam.identify+'&name='+gameName+'&token='+urlToken;
    getData(url,function(res){
        $('#loader-box').hide();
        console.log(res);
        var casinoGameUl = $('.casino-game-list ul');
    });
}


//tab菜单切换
function casinoTab(){
    $('.casino-left-bar li:first').addClass('casino-left-bar-active');
    $('.casino-tab li').click(function(){
        var liIndex1 = $(this).index();
        var thisGameName1 = $.trim($(this).find('.casino-game-name').text());
        var lineLeft1 = parseInt(125*liIndex1+10+21*liIndex1);
        $('.line-slider').animate({'left':lineLeft1+'px'},500,'swing');
        $('.casino-left-bar li').eq(liIndex1).addClass('casino-left-bar-active').siblings('.casino-left-bar li').removeClass('casino-left-bar-active');
        showCasinoGameList(thisGameName1);
    });
    $('.casino-left-bar li').click(function(){
        var liIndex2 = $(this).index();
        var thisGameName2 = $.trim($(this).find('.casino-game-name').text());
        var lineLeft2 = parseInt(125*liIndex2+10+21*liIndex2);
        $(this).addClass('casino-left-bar-active').siblings('.casino-left-bar li').removeClass('casino-left-bar-active');
        $('.line-slider').animate({'left':lineLeft2+'px'},500,'swing');
        showCasinoGameList(thisGameName2);
    })
}

//分页显示数据
function casinoPage(){
    paginationShow(10,function(obj){
        console.log(obj);
    })
}

//左侧tab滚动到一定位置固定
var bodyWidth = parseInt($('body').width());
var fixedLeft = (bodyWidth-1170)/2-52;
function leftBarPosition(){
    var top = $(document).scrollTop();
    if (top >= 603) {
        $('.casino-left-bar').css({
            'position': 'fixed',
            'left':fixedLeft+'px',
            'top':'0'
        });
    } else {
        $('.casino-left-bar').css({
            'position': 'absolute',
            'left':'-52px',
            'top':'77px'
        });
    }
}
function leftBarScroll(){
    $(document).scroll(function () {
        leftBarPosition();
    });
}
//改变窗口尺寸 左侧tab改变位置
function leftBarScrollWithResize(){
    window.onresize = function(){
        bodyWidth = parseInt($('body').width());
        fixedLeft = (bodyWidth-1170)/2-52;
        leftBarPosition();
        leftBarScroll();
    };
}


$(document).ready(function(){
    casinoSlide();
    //casinoGamePlatform();
    casinoTab();
    casinoPage();
    leftBarScroll();
    leftBarScrollWithResize();
});