/**
 * Created by Administrator on 2016/12/30.
 */
var pageNum = 0;
//获取第一页消息
function getFirstNews(){
    var newsPostInfo = {
        'token':localStorage.token,
        'num':10,
        'page':1,
        'label':pangu.myParam.identify
    };
    postData('member-sms',newsPostInfo,function(res){
        console.log(res);
        $('#loader-box').hide();
        if(res.status==1){
            pageNum = parseInt(res.count/10)+1;
            //显示分页
            showPageNews();
            if(pageNum>1){
                $('.page-box').show();
            }else{
                $('.page-box').hide();
            }
        }
    });
}

//点击分页显示当页数据
function showPageNews(){
    //显示分页
    console.log(pageNum);
    paginationShow(pageNum,function(obj){
        currPage = obj.curr;
        getNews(currPage);
    });
}

//获取每页消息
function getNews(page){
        var newsPostInfo = {
            'token':localStorage.token,
            'num':10,
            'page':page,
            'label':pangu.myParam.identify
        };
        postData('member-sms',newsPostInfo,function(res){
            console.log(res);
            $('#loader-box').hide();
            if(res.status==1){
                //显示消息列表
                showNewsLists(res.data);
                //点击显示详情
                showNewsdetail();
            }
        });
}

$(document).ready(function(){
    getUserInfo(function(){
        //公用函数
        rightHeader();
        accountManageLink();
        getUnreadNum();
        /***消息中心***/
        getFirstNews();
    },function(){
        //沒有登录提示框
        alertMsg('请先登录！',function(){
            window.location.href= '../index.html';
        });
    });
});