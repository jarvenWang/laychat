/**
 * Created by Administrator on 2016/12/19.
 */
//额度转换
function openTransferModal(){
    $('.fast-transfer-open').click(function(){
        var transferName = $(this).parents('li').find('span').text();
        $('.fast-transfer-l h3').text(transferName);
        openContent('额度转换',$('.fast-modal-transfer'))
    });
    //切换转换对象
    var transformBoxDiv = $('.transform-box>div');
    transformBoxDiv.eq(1).click(function(){
        $('.transform-box').addClass('animated rotateIn');
        setTimeout(function(){
            $('.transform-box').removeClass('animated rotateIn');
            if(transformBoxDiv.eq(0).attr('class')== 'transform-box-l'){
                transformBoxDiv.eq(0).attr('class', 'transform-box-r');
                transformBoxDiv.eq(2).attr('class', 'transform-box-l');
            }else{
                transformBoxDiv.eq(0).attr('class', 'transform-box-l');
                transformBoxDiv.eq(2).attr('class', 'transform-box-r');
            }
        },500)

    });
    //转入金额
    $('#transfer-sure').click(function(){
        postInfo = {};
        var transferAccount = $("#transfer-account"),
            transferAccountMsg = transferAccount.next('span'),
            transferFrom = $(".transform-box-l .layui-select-title input"),
            transferTo = $(".transform-box-r .layui-select-title input");
        inputOnFocus(transferAccount,transferAccountMsg);
        if(transferAccount.val() ==''){
            //alertMsg('请输入转账金额');
            transferAccountMsg.text('请输入转账金额');
            return
        }
        if(transferAccount.val() <100){
            //alertMsg('最低转账金额100元');
            transferAccountMsg.text('最低转账金额100元');
            return
        }
        postInfo = {
            'account':transferAccount.val(),
            'from':transferFrom.val(),
            'to':transferTo.val()
        };
        console.log(postInfo);
        postData('api',postInfo,function(res){
            $('#loader-box').hide();
            console.log(res);
            alertMsg(res.msg,function(){
                transferAccount.val();
            });
        });
    })
}


//跳转到充值提现页面
function goAccountManage(){
    $('.goTo-recharge').click(function(){
        localStorage.accountManageLink=0;
        window.location.href = 'accountManage.html';
    });
    $('.goTo-withdraw').click(function(){
        localStorage.accountManageLink=1;
        window.location.href = 'accountManage.html';
    })
}

//获取最近五条消息
function getLatestNews(){
    var newsPostInfo = {
        'token':localStorage.token,
        'num':10,
        'page':1
    };
    postData('member-sms',newsPostInfo,function(res){
        console.log(res);
        $('#loader-box').hide();
        if(res.status==1){
            var latestNews = [];
            if(res.data.length<=5){
                latestNews = res.data;
            }else{
                latestNews = res.data.slice(0,5);
            }
            //显示消息列表
            showNewsLists(latestNews);
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
        /***会员中心***/
        $('.user-balance').html('￥'+pangu.myData.balance.toFixed(2));
        openTransferModal();
        goAccountManage();
        getLatestNews();
    },function(){
        //沒有登录提示框
        alertMsg('请先登录！',function(){
            window.location.href= '../index.html';
        });
    });
});