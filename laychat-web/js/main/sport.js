/**
 * Created by Administrator on 2017/1/8.
 */
//显示游戏平台  体育 type=1
function sportGamePlatform(){
    showGamePlatform(1,function(res){
        $('#loader-box').hide();
        var sportLists = res.data.list;
        var sportBox = $('.main-sport-bg ul');
        //清空体育游戏平台列表
        sportBox.html('');
        for(var i=0;i<sportLists.length;i++){
            var sportLi = '<li><a href="javascript:void(0)" class="sport-game1 openfastTransfer">'+sportLists[i].name+'</a></li>';
            sportBox.append(sportLi);
        }
        openfastTransfer();
    });
}


$(document).ready(function(){
    //sportGamePlatform();
});