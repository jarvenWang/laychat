/**
 * Created by Administrator on 2016/12/22.
 */
$(document).ready(function(){
    getUserInfo(function(){
        //公用函数
        rightHeader();
        accountManageLink();
        getUnreadNum();
    },function(){
        //沒有登录提示框
        alertMsg('请先登录！',function(){
            window.location.href= '../index.html';
        });
    });
});