/**
 * Created by Administrator on 2017/1/8.
 */
//显示游戏平台  彩票 type=2
function lotteryGamePlatform(){
    showGamePlatform(2,function(res){
        $('#loader-box').hide();
        var lotteryLists = res.data.list;
        var lotteryBox = $('.lottery-game ul');
        //清空真人游戏平台列表
        lotteryBox.html('');
        for(var i=0;i<lotteryLists.length;i++){
            var lotteryLi ='<li><a href="#"><div class="lottery-game-img lottery-game1"></div><div class="lottery-game-name"><h4>'+lotteryLists[i].name+'</h4><div class="lottery-game-play">立即游戏</div></div></a><div class="lottery-game-rule"><a href="#">游戏规则</a></div></li>';
            lotteryBox.append(lotteryLi);
        }
        openfastTransfer();
    });
}


$(document).ready(function(){
    //lotteryGamePlatform();
});