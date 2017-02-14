/**
 * Created by Administrator on 2016/12/19.
 */
//网站弹窗
function layerNotice(){
    if(!getCookie('layerNoticeShow')){
        var layerNoticeInfo = {
            'label':pangu.myParam.identify,
            'display_where':2,
            'strike':1
        };
        postDataWithoutToken('layer-notice',layerNoticeInfo,function(res){
            $('#loader-box').hide();
            console.log(res);
            if(res.status==1){
                setCookie('layerNoticeShow',1);
                $('.layer-notice .notice-box img').attr('src',pangu.config.imgHost+res.data.img);
                $('.layer-notice').show();
                $('#notice-close').click(function(){
                    $(this).parents('.layer-notice').hide();
                });
            }
        });
    }
}

//首页轮播
function promotionSlide(){
    jQuery("#promotion-con-slide").slide(
        {mainCell:".bd ul",autoPlay:true,trigger:"click",interTime:3000}
    );
}

//公告滚动
function announcementFn(){
    //从后台获取最新公告信息
    postDataWithoutToken('scroll-notice',{'label':pangu.myParam.identify},function(res){
        console.log(res);
        $('#loader-box').hide();
        if(res.status==1){
            //公告的内容
            $('.ann-title').html(res.data.title+'<span>  | '+res.data.start_date.split(' ')[0]+'</span>');
            $('.ann-content .announcement-scroll li').html(res.data.detail);
            //详情的内容
            $('.announcement-detail .title').html(res.data.title+'<span>  | '+res.data.start_date.split(' ')[0]+'</span>');
            $('.announcement-detail .ann-content').html(res.data.detail);

            //左右滚动
            //seamScrollLeft($('.announcement-scroll'),4);

            //上下滚动
            //jQuery(".ann-content").slide({mainCell:".bd ul",effect:"topLoop",autoPlay:true,trigger:"click",delayTime:3000,interTime:6000}); //用轮播插件
            autoScrollTop(".ann-content"); //自己封装的

            //点击出现详情
            $('.announcement-l').click(function(){
                openContent('公告详情',$('.announcement-detail'));
            });
        }
    });
}

//首页显示游戏平台
/*function indexShowGames(typeIndex,posIndex){
    showGamePlatform(typeIndex,function(res){
        //console.log(res);
        $('#loader-box').hide();
        var gameLists = res.data.list;
        var targetUl = $('.game-contain .bd>ul').eq(posIndex),
            gameListsUl = targetUl.find('.game-list-ul');
        //清空游戏平台列表
        gameListsUl.html('');
        //体育
        if(posIndex==0){
            for(var i=0;i<gameLists.length;i++){
                var sportLi1 = '<li class="sport-game-item1"><a href="javascript:void(0)" class="openfastTransfer">'+gameLists[i].name+'</a></li>';
                var sportLi2 = '<li class="sport-game-item2"><a href="javascript:void(0)" class="openfastTransfer">'+gameLists[i].name+'</a></li>';
                if(i%2==0){
                    gameListsUl.append(sportLi1);
                }else{
                    gameListsUl.append(sportLi2);
                }
            }
            openfastTransfer();
        }else{
            for(var j=0;j<gameLists.length;j++){
                var gameLi = '<li><a href="javascript:void(0)" class="openfastTransfer">'+gameLists[j].name+'</a></li>';
                gameListsUl.append(gameLi);
            }
            openfastTransfer();
        }
    });
}*/

//首页tab切换
function contentTabSlide(){
    jQuery("#tab-slide").slide({startFun:function(i,c){
        /*console.log(i,c);
        if(i==0){
            //体育 type=1
            indexShowGames(1,i);
        }else if(i==1){
            //真人 type=3
            indexShowGames(3,i);
        }else if(i==2){
            //电子 type=4
            indexShowGames(4,i);
        }else{
            //彩票 type=2
            indexShowGames(2,i);
        }*/

    }});
}

//右下角公告推送
function messgeFromRightBottom(){
   if(getCookie('rightBottomMessage')!=1){
       messagePush('最新公告','commonHtml/latestNews.html');
       setCookie('rightBottomMessage',1);
   }
}

$(document).ready(function(){
    layerNotice();
    promotionSlide();
    announcementFn();
    contentTabSlide();
    messgeFromRightBottom();
});


