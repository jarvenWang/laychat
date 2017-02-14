/**
 * Created by Administrator on 2016/12/26.
 */
/**
 * Created by Administrator on 2016/12/24.
 */
function safeModalOpen(){
    var safeArr = [];   //定义一个表示实名验证，手机，邮箱认证，安全问题，资金密码，登录密码状态的数组(数据从后台获取，转化为数组)
    safeArr[0] = pangu.myData.name ? 1:0;
    safeArr[1] = pangu.myData.mobile ? 1:0;
    safeArr[2] = pangu.myData.email ? 1:0;
    safeArr[3] = pangu.myData.safe_question ? 1:0;
    safeArr[4] = pangu.myData.pay_password ? 1:0;
    safeArr[5] = 1;
    var safeLi = $('.safe-box ul li');
    for(var j=0;j<safeArr.length;j++){
        safeLi.eq(j).find('.safe-info').find('div').hide();
        if(safeArr[j] ==0){
            safeLi.eq(j).find('.safe-info').find('div').eq(0).show();
        }else{
            safeLi.eq(j).find('.safe-info').find('div').eq(1).show();
        }
    }

    //手机
    $('.phone-delete-open').click(function(){
        phoneDeleteFn();
    });

    //邮箱
    $('.mail-change-open').click(function(){
        mailChangeFn();
    });

    //安全问题
    $('.safe-question-open').click(function(){
        safeQuestionFn();
    });

    //资金密码
    $('.payword-set-open').click(function(){
        paywordSetFn();
    });
    $('.payword-change-open').click(function(){
        paywordChangeFn()
    });

    //登录密码
    $('.logoin-change-open').click(function(){
        loginwordChangeFn();
    });
}


$(document).ready(function(){
    getUserInfo(function(){
        //公用函数
        rightHeader();
        accountManageLink();
        getUnreadNum();
        /***安全中心***/
        safeModalOpen();
    },function(){
        //沒有登录提示框
        alertMsg('请先登录！',function(){
            window.location.href= '../index.html';
        });
    });
});