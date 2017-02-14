/**
 * Created by Administrator on 2016/12/24.
 */
function userInfoModalOpen(){
    //安全设置
    var safeInfoSetDiv = $('.safeInfo-set .user-info-list-m>div');
    var safeInfoSetNum = 0;
    for(var i=0;i<stateArr.length;i++){
        safeInfoSetDiv.eq(i).find('span').hide();
        if(stateArr[i] ==0){
            safeInfoSetNum++;
            safeInfoSetDiv.eq(i).find('span').eq(0).show();
        }else{
            safeInfoSetDiv.eq(i).find('span').eq(1).show();
        }
    }
    if(safeInfoSetNum==0){
        $('.safeInfo-set .user-info-list-r').html('已设置');
    }
    $('.safeInfo-set-open').click(function(){
        for(var i=0;i<stateArr.length;i++){
           if(stateArr[i] ==0){
               if(i==0){
                   promptBox('请设置手机号码！','立即设置',function(){
                       phoneSetFn();
                   });
                   return;
               }else if(i==1){
                   promptBox('请设置邮箱！','立即设置',function(){
                       mailSetFn();
                   });
                   return;
               }else{
                   promptBox('请实名认证！','立即认证',function(){
                       nameTestFn();
                   });
                   return;
               }
           }
        }
    });

    var userInfoArr = [];   //定义一个表示真实姓名，邮箱，手机，QQ，生日，登录密码，资金密码状态的数组(数据从后台获取，转化为数组)
    userInfoArr[0] = pangu.myData.name ? 1:0;
    userInfoArr[1] = pangu.myData.email ? 1:0;
    userInfoArr[2] = pangu.myData.mobile ? 1:0;
    userInfoArr[3] = pangu.myData.qq_number ? 1:0;
    userInfoArr[4] = pangu.myData.birthday ? 1:0;
    userInfoArr[5] = 1;
    userInfoArr[6] = pangu.myData.pay_password ? 1:0;
    var userInfoLi = $('.user-info-list ul li');
    for(var j=0;j<userInfoArr.length;j++){
        userInfoLi.eq(j+1).find('.user-info-list-m').find('span').hide();
        userInfoLi.eq(j+1).find('.user-info-list-r').find('a').hide();
        if(userInfoArr[j] == 0){
            userInfoLi.eq(j+1).find('.user-info-list-m').find('span').eq(0).show();
            userInfoLi.eq(j+1).find('.user-info-list-r').find('a').eq(0).show();
        }else{
            userInfoLi.eq(j+1).find('.user-info-list-m').find('span').eq(1).show();
            userInfoLi.eq(j+1).find('.user-info-list-r').find('a').eq(1).show();
        }
    }
    if(pangu.myData.name){
        $('.name-item .user-info-list-m em').html(nameShow(pangu.myData.name));
    }
    if(pangu.myData.birthday){
        $('.birthday-item .user-info-list-m em').html(strToDate(pangu.myData.birthday));
    }
    if(pangu.myData.qq_number){
        $('.qq-item .user-info-list-m').find('span').eq(1).html(ellipsis(pangu.myData.qq_number));
    }
    if(pangu.myData.email){
        $('.email-item .user-info-list-m').find('span').eq(1).html(ellipsis1(pangu.myData.email));
    }
    if(pangu.myData.mobile){
        $('.mobile-item .user-info-list-m').find('span').eq(1).html(ellipsis(pangu.myData.mobile));
    }

    //邮箱
    $('.mail-change-open').click(function(){
        mailChangeFn();
    });

    //手机
    $('.phone-delete-open').click(function(){
        phoneDeleteFn();
    });

    //QQ号码
    $('.QQ-set-open').click(function(){
        QQsetFn();
    });

    //登录密码
    $('.logoin-change-open').click(function(){
        loginwordChangeFn();
    });

    //资金密码
    $('.payword-set-open').click(function(){
        paywordSetFn();
    });
    $('.payword-change-open').click(function(){
        paywordChangeFn();
    })
}

$(document).ready(function(){
    getUserInfo(function(){
        //公用函数
        rightHeader();
        accountManageLink();
        getUnreadNum();
        /***账号信息***/
        userInfoModalOpen();
    },function(){
        //沒有登录提示框
        alertMsg('请先登录！',function(){
            window.location.href= '../index.html';
        });
    });
});