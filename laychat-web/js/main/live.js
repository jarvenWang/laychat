/**
 * Created by Administrator on 2017/1/8.
 */
//显示游戏平台  真人 type=3
function liveGamePlatform(){
    showGamePlatform(3,function(res){
        $('#loader-box').hide();
        var liveLists = res.data.list;
        var liveBox = $('.list-right-content ul');
        //清空真人游戏平台列表
        liveBox.html('');
        for(var i=0;i<liveLists.length;i++){
            var liveLi = '<li><a href="#"><div class="live-game-img live-game'+(i+1)+'"></div><div class="live-game-name"><h4>'+liveLists[i].name+'</h4><p>真人发牌 视觉盛宴</p></div><div class="live-game-play"><i class="icon-down2"></i> 立即游戏</div></a></li>';
            liveBox.append(liveLi);
        }
        openfastTransfer();
    });
}


$(document).ready(function(){
    //liveGamePlatform();
});