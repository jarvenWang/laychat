//获取验证码
function getClientCode(){
    putWithOutData('make',function(res){
        $('#loader-box').hide();
        if(res.status==1){
            localStorage.client_code = res.data.list.client_code;
            var codeImg = '<img src='+res.data.list.url+'?v='+Math.random()+'>';
            $('.login-modal .client-code').html(codeImg);
        }
    });
}
/***************************头部************************/
function header(){
    $('.site-nav').load('main/header.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            $('.site-nav').html(responseText);
            //显示当前时间(美东地区)
            moment.locale('en'); // default the locale to English
            var localLocale='';
            setInterval(function(){
                //localLocale = moment().utc().format("dddd, MMMM Do YYYY, h:mm:ss");
                localLocale = moment().utc().utcOffset(120).format("dddd, MMMM Do YYYY, h:mm:ss");  //America/Los_Angeles
                $('.update-date').html(localLocale+' GMT+0800 (CST)');
            },1000);

            //登录状态下显示用户名 余额等信息
            if(pangu.myData.username){
                $('.before-login').hide();
                $('.site-nav-login b').html(pangu.myData.username);
                $('.user-account').html(pangu.myData.balance);
                $('.after-login').show();
            }else{
                $('.before-login').show();
                $('.after-login').hide();
            }
            //打开登录框
            $('#login-enter').click(function(){
                //stopBubble();
                getClientCode();
                $('#login-box').show();
            });
            //刷新验证码
            $('.login-modal .client-code').click(function(){
                getClientCode();
            });
            //关闭登录框
            $('#login-close').click(function(){
                $('#login-box').hide();
            });
            //$('#login-box').click(function(){
            //    stopBubble();
            //});
            //$('body').click(function(){
            //    $('#login-box').hide();
            //});

            //登录
            function loginFn(){
                var login1 = $("input[name^='login-username']"),
                    login2 = $("input[name^='login-password']"),
                    login3 = $("input[name^='login-textCode']"),
                    loginErr = $('.login-modal .form-item-err');
                loginErr.text('');
                inputOnFocus(login1,loginErr);
                inputOnFocus(login2,loginErr);
                inputOnFocus(login3,loginErr);
                if(login1.val()==''){
                    loginErr.show(function(){
                        loginErr.text('请输入用户名');
                    });
                    return
                }
                //用户名：4-12位数字或者字母组合
                if(!/^[a-zA-Z0-9_]{4,12}$/.test(login1.val().replace(/(\s*$)/g,""))){
                    loginErr.text('请输入4-12位字母、数字组成的用户名！');
                    login1.val('');
                    login2.val('');
                    login3.val('');
                    return
                }
                if(login2.val()==''){
                    loginErr.show(function(){
                        loginErr.text('请输入密码');
                    });
                    return
                }
                //密码：6-20位数字和字母组合
                if(!/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/.test(login2.val())){
                    loginErr.text('请输入6-20位的字母和数字组合的密码！');
                    login2.val('');
                    login3.val('');
                    return
                }
                if(login3.val()==''){
                    loginErr.show(function(){
                        loginErr.text('请输入验证码');
                    });
                    return
                }
                loginInfo = {
                    'username':login1.val().replace(/(\s*$)/g,""),
                    'password':login2.val(),
                    'code': login3.val(),
                    'client_code':localStorage.client_code
                };
                putData('user-login',loginInfo,function(res){
                    $('#loader-box').hide();
                    console.log(res);
                    if(res.status==1){
                        successLayer(res.msg,function(){
                            login1.val('');
                            login2.val('');
                            login3.val('');
                            localStorage.token = res.data.list.token;
                            //var userData = JSON.stringify(res.data.list.list);
                            //setCookieWithTime('userInfo',userData,1);
                            $('#login-box').hide(60,function(){
                                window.location.reload();
                            });
                        });
                    }else{
                        if(res.code!='5009'){
                            login1.val('');
                            login2.val('');
                        }
                        login3.val('');
                        getClientCode();
                        loginErr.text(res.msg);
                    }
                });
            }
            $('#login').click(function(){
                loginFn();
            });
            $("body").keydown(function() {
                if (event.keyCode == "13") {  //keyCode=13是回车键
                    loginFn();
                }
            });

            //忘记密码
            $('#forgot-password').click(function(){
                $('#login-box').hide();
                var findPassword = $('.findPassword');
                if(findPassword.length==0){
                    var findPasswordBox = '<div class="findPassword"></div>';
                    $('body').append(findPasswordBox);
                    findPassword = $('.findPassword');
                }

                findPassword.load('main/findPassword.html',function (responseText, textStatus, XMLHttpRequest){
                    if(textStatus == 'success'){
                        findPassword.html(responseText);
                        findPassword.show();
                        $('#shade').show();
                        //关闭忘记密码框
                        $('.close-findPassword').click(function(){
                            findPassword.css('display','none');
                            $('#shade').hide();
                        });
                        //客服
                        $('.find-modal-content1 .online-service').click(function(){
                            serviceSystem();
                        });
                        //输入用户名后显示验证方式状态
                        function textTypeStatus(index){
                            var targetLi = $('.security-issue ul li').eq(index);
                            targetLi.find('.security-ico-bg').addClass('security-ico-active');
                            targetLi.find('.hint').html('已绑定');
                        }
                        //第一步，验证用户名是否存在
                        $('#choose-textType').click(function(){
                            postInfo = {};
                            var nameTest = $('#userNameTest'),
                                userNameErr = $('.userNameTest-err');
                            userNameErr.text('');
                            inputOnFocus(nameTest,userNameErr);
                            if( nameTest.val()==''){
                                userNameErr.text('请输入用户名');
                                return
                            }
                            //用户名：4-12位数字或者字母组合
                            if(!/^[a-zA-Z0-9_]{4,12}$/.test(nameTest.val().replace(/(\s*$)/g,""))){
                                userNameErr.text('请输入4-12位字母、数字组成的用户名！');
                                nameTest.val('');
                                return
                            }
                            postInfo = {
                                'username':nameTest.val()
                            };
                            postDataWithoutToken('user-exist',postInfo,function(res1){
                                $('#loader-box').hide();
                                console.log(res1);
                                var userExistData = res1.data.list;
                                var testStatusNum = 0;
                                if(res1.status==1){
                                    var existedUserName = nameTest.val();
                                    successLayer(res1.msg,function(){
                                        nameTest.val('');
                                        $('#find-password1').hide();
                                        if(userExistData.safe_question){
                                            textTypeStatus(0);
                                            testStatusNum++;
                                        }
                                        if(userExistData.mobile){
                                            textTypeStatus(1);
                                            testStatusNum++;
                                        }
                                        if(userExistData.email){
                                            textTypeStatus(2);
                                            testStatusNum++;
                                        }
                                        if(userExistData.pay_password){
                                            textTypeStatus(3);
                                            testStatusNum++;
                                        }
                                        $('#find-password2').show();
                                        if(testStatusNum==0){
                                            $('.find-modal-content1 .security-issue-no').show();
                                        }
                                        chooseTestType(existedUserName);
                                    });
                                }else{
                                    nameTest.val('');
                                    userNameErr.text(res1.msg);
                                }
                            });
                        });
                        //第二步，选择验证方式
                        function chooseTestType(userName){
                            $('.security-issue .security-open .security-ico-active').click(function(){
                                var type = $(this).parents('li').find('.security-type').html();
                                $('.find-modal-content1').hide(60,function(){
                                    $('.find-modal-content2').show();
                                    $('.find-modal-setup ul li').eq(1).addClass('find-modal-setup-active').siblings('.find-modal-setup ul li').removeClass('find-modal-setup-active');
                                    $('.find-modal-setup ul li').eq(0).find('.right-arrow1').css({
                                        'border-top':'18px #a72d31 solid',
                                        'border-bottom':'18px #a72d31 solid'
                                    });
                                    if(type=='安全问题'){
                                        form.render();
                                        $('.find-modal-content2 form').eq(0).show().siblings('.find-modal-content2 form').hide();
                                        //提交安全问题信息验证
                                        $('#find-by-safeQuestion').click(function(){
                                            putInfo = {};
                                            var findBySafeQuestion1 = $(".layui-select-title input"),
                                                findBySafeQuestion2 = $("#find-answer");
                                            var findErrMsg1 = $('.findType1-err');
                                            findErrMsg1.text('');
                                            inputOnFocus(findBySafeQuestion2,findErrMsg1);
                                            if(findBySafeQuestion2.val()==''){
                                                findErrMsg1.text('请输入答案！');
                                                return
                                            }
                                            putInfo = {
                                                'username':userName,
                                                'type':2,
                                                'safe_question':[findBySafeQuestion1.val(),findBySafeQuestion2.val()]
                                            };
                                            console.log(putInfo);
                                            checkTestInfo(putInfo,userName,function(message){
                                                findBySafeQuestion2.val('');
                                                findErrMsg1.text(message);
                                            });
                                        });
                                    }
                                    //功能未添加
                                    if(type=='手机'){
                                        $('.find-modal-content2 form').eq(1).show().siblings('.find-modal-content2 form').hide();
                                        //提交手机号码验证
                                        $('#find-by-mobile').click(function(){
                                            putInfo = {};
                                            var findByMobile1 = $("#find-mobile"),
                                                findByMobile2 = $("#find-verifycode");
                                            var findErrMsg2 = $('.findType2-err');
                                            findErrMsg2.text('');
                                            inputOnFocus(findByMobile1,findErrMsg2);
                                            inputOnFocus(findByMobile2,findErrMsg2);
                                            if(findByMobile1.val()==''){
                                                findErrMsg2.text('请输入手机号码！');
                                                return
                                            }
                                            if(!/^1\d{10}$/.test(findByMobile1.val())){
                                                findErrMsg2.text('请输入符合规范的手机号码！');
                                                findByMobile1.val('');
                                                return
                                            }
                                            //if(findByMobile2.val()==''){
                                            //    findErrMsg2.text('请输入验证码！');
                                            //    return
                                            //}
                                            putInfo = {
                                                'username':userName
                                            };
                                            /*checkTestInfo(putInfo,userName,function(message){
                                                findByMobile1.val('');
                                                findByMobile2.val('');
                                                findErrMsg2.text(message);
                                            });*/
                                        });
                                    }
                                    //功能未添加
                                    if(type=='邮箱'){
                                        $('.find-modal-content2 form').eq(2).show().siblings('.find-modal-content2 form').hide();
                                        //提交邮箱验证
                                        $('#find-by-email').click(function(){
                                            putInfo = {};
                                            var findByEmail = $("#find-email");
                                            var findErrMsg3 = $('.findType3-err');
                                            findErrMsg3.text('');
                                            inputOnFocus(findByEmail,findErrMsg3);
                                            if(findByEmail.val()==''){
                                                findErrMsg3.text('请输入绑定邮箱！');
                                                return
                                            }
                                            if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(findByEmail.val())){
                                                findErrMsg3.text('请输入符合规范的邮箱！');
                                                findByEmail.val('');
                                                return
                                            }
                                            putInfo = {
                                                'username':userName
                                            };
                                            /*checkTestInfo(putInfo,userName,function(message){
                                                 findByEmail.val('');
                                                 findErrMsg3.text(message);
                                             });*/
                                        });
                                    }
                                    if(type=='资金密码'){
                                        $('.find-modal-content2 form').eq(3).show().siblings('.find-modal-content2 form').hide();
                                        //提交资金密码验证
                                        $('#find-by-payPassword').click(function(){
                                            putInfo = {};
                                            var findByPayPassword = $("#find-payPassword");
                                            var findErrMsg4 = $('.findType4-err');
                                            findErrMsg4.text('');
                                            inputOnFocus(findByPayPassword,findErrMsg4);
                                            if(findByPayPassword.val()==''){
                                                findErrMsg4.text('请输入资金密码！');
                                                return
                                            }
                                            if(!/^[a-zA-Z0-9_]{6,20}$/.test(findByPayPassword.val())){
                                                findErrMsg4.text('请输入6-20位的数字、字母组合的密码！');
                                                findByPayPassword.val('');
                                                return
                                            }
                                            putInfo = {
                                                'username':userName,
                                                'type':1,
                                                'pay_password':findByPayPassword.val()
                                            };
                                            checkTestInfo(putInfo,userName,function(message){
                                                findByPayPassword.val('');
                                                findErrMsg4.text(message);
                                            });
                                        });
                                    }
                                });

                            })
                        }
                        //第三步，重置密码
                        function checkTestInfo(info,userName,noStatusFn){
                            putData('check-input',info,function(res2){
                                console.log(res2);
                                $('#loader-box').hide();
                                if(res2.status==1){
                                    successLayer(res2.msg,function(){
                                        $('.find-modal-content2').hide(60,function(){
                                            $('.find-modal-content3').show();
                                            $('.find-modal-setup ul li').eq(2).addClass('find-modal-setup-active').siblings('.find-modal-setup ul li').removeClass('find-modal-setup-active');
                                            $('.find-modal-setup ul li').eq(0).find('.right-arrow1').css({
                                                'border-top':'18px transparent solid',
                                                'border-bottom':'18px transparent solid'
                                            });
                                            $('.find-modal-setup ul li').eq(1).find('.right-arrow1').css({
                                                'border-top':'18px #a72d31 solid',
                                                'border-bottom':'18px #a72d31 solid'
                                            });
                                            $('#reset-password').click(function(){
                                                putInfo = {};
                                                var resetPassword1 = $("#set-new-password"),
                                                    resetPassword2 = $("#comfirm-new-password");
                                                var resetErrMsg = $('.resetPassword-err');
                                                resetErrMsg.text('');
                                                inputOnFocus(resetPassword1,resetErrMsg);
                                                inputOnFocus(resetPassword2,resetErrMsg);
                                                if(resetPassword1.val()==''){
                                                    resetErrMsg.text('请输入新密码！');
                                                    return
                                                }
                                                if(resetPassword2.val()==''){
                                                    resetErrMsg.text('请输入确认新密码！');
                                                    return
                                                }
                                                if(! /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/.test(resetPassword1.val())){
                                                    resetErrMsg.text('请输入6-20位的字母和数字组合的密码！');
                                                    resetPassword1.val('');
                                                    resetPassword2.val('');
                                                    return
                                                }
                                                if(resetPassword1.val()!=resetPassword2.val()){
                                                    resetErrMsg.text('新密码与确认新密码不一致！');
                                                    resetPassword1.val('');
                                                    resetPassword2.val('');
                                                    return
                                                }
                                                for(var k in info){
                                                    putInfo[k] = info[k];
                                                }
                                                putInfo.new_password=resetPassword1.val();
                                                function putNewPassword(){
                                                    putInfo.reseller_id = parseInt(localStorage.resellerId);
                                                    console.log(putInfo);
                                                    if(putInfo.pay_password){
                                                        if(putInfo.pay_password==putInfo.new_password){
                                                            resetErrMsg.text('登录密码与资金密码不能一致！');
                                                            resetPassword1.val('');
                                                            resetPassword2.val('');
                                                            return
                                                        }
                                                    }
                                                    putData('edit-password',putInfo,function(res3){
                                                        $('#loader-box').hide();
                                                        console.log(res3);
                                                        if(res3.status==1){
                                                            successLayer(res3.msg,function(){
                                                                //关闭忘记密码框
                                                                findPassword.css('display','none');
                                                                $('#shade').hide();
                                                                //打开登录框
                                                                getClientCode();
                                                                $('#login-box').show();
                                                            })
                                                        }else{
                                                            resetPassword1.val('');
                                                            resetPassword2.val('');
                                                            resetErrMsg.text(res3.msg);
                                                        }
                                                    });
                                                }
                                                if(localStorage.reseller_id){
                                                    putNewPassword();
                                                }else{
                                                    getResellerId(function(){
                                                        putNewPassword();
                                                    });
                                                }
                                            });
                                        });
                                    });
                                }else{
                                    noStatusFn(res2.msg);
                                }
                            });
                        }
                    }
                });
            });

            //退出
            $('.logoff').click(function(){
                //localStorage.clear();
                localStorage.removeItem('token');
                window.location.reload();
            })
        }
    });
}

/***************************页脚************************/
function footer(){
    $('.footer').load('main/footer.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            $('.footer').html(responseText);
            //跳到about.html
            $('.footer-text li').click(function(){
                setCookie('aboutLink', $(this).index());
            })
        }
    });
}

/***************************右边栏************************/
function rightBar(){
    var rightBarBox = '<div class="right-bar"></div>';
    $('body').append(rightBarBox);

    var rightBar = $('.right-bar');
    rightBar.load('main/right_bar.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            rightBar.html(responseText);
            //鼠标悬停效果
            var timer = null;
            $('.tab-item-hasTips').hover(function(){
                $(this).css('background-color','#cf2f2f');
                var tabItemTips = $(this).next('.tab-item-tips');
                timer = setTimeout(function () {
                    tabItemTips.show(80,function(){
                        $(this).css({
                            'opacity': '1',
                            'right': '35px',
                            'transition':'all .3s ease-out'
                        });
                    });
                },200);
            },function(){
                clearTimeout(timer);
                $(this).css('background-color','#0d0d0d');
                $(this).next('.tab-item-tips').css({
                    'opacity': '0',
                    'right': '80px',
                    'transition':'all .3s ease-out'
                },function(){
                    $(this).hide();
                });
            });

            //展开右边栏   我的账户  红利
            function rightBarOpenFn(thisBar){
                var rightBarTitle = thisBar.next('.tab-item-tips').find('span').text();
                var rightBarContent = $('.right-bar-plugins > div');
                var oldIndex = getCookie('tabOpenText');
                if(oldIndex == rightBarTitle){
                    if(rightBar.css('right')=="-235px"){
                        rightBar.animate({'right':'0'},'swing');
                    }else{
                        rightBar.animate({'right':'-235px'},'swing');
                    }
                    setCookie('tabOpenText',rightBarTitle);
                }else{
                    rightBar.animate({'right':'0'},'swing');
                    setCookie('tabOpenText',rightBarTitle);
                }

                rightBarContent.removeClass('animated bounceInUp');
                rightBarContent.hide();
                if(rightBarTitle == '我的帐户'){
                    $('.my-account').show(10,function(){
                        $(this).addClass('animated bounceInUp');
                        //个人信息展示
                        $('.right-bar-user-info-r').find('p').eq(0).html(pangu.myData.username);
                        //手机
                        if(pangu.myData.mobile){
                            $('.user-safe-state1').html('<i class="icon-mobile"></i><i class="icon-check-fill2"></i>');
                        }else{
                            $('.user-safe-state1').html('<i class="icon-mobile"></i></i>');
                        }
                        //邮箱
                        if(pangu.myData.email){
                            $('.user-safe-state2').html('<i class="icon-email"></i><i class="icon-check-fill2"></i>');
                        }else{
                            $('.user-safe-state2').html('<i class="icon-email"></i></i>');
                        }
                        //实名认证
                        if(pangu.myData.name){
                            $('.user-safe-state3').html('<i class="icon-userinfo2"></i><i class="icon-check-fill2"></i>');
                        }else{
                            $('.user-safe-state3').html('<i class="icon-userinfo2"></i></i>');
                        }
                        //密保问题
                        if(pangu.myData.safe_question){
                            $('.user-safe-state4').html('<i class="icon-lock"></i><i class="icon-check-fill2"></i>');
                        }else{
                            $('.user-safe-state4').html('<i class="icon-lock"></i></i>');
                        }
                    });
                }else if(rightBarTitle == '红利'){
                    $('.my-bonus').show(10,function(){
                        $(this).addClass('animated bounceInUp');
                        //滚动条
                        var bonusScroll = $('#my-bonus-scroll');
                        var bonusHeight = $(window).height()-55+20;
                        bonusScroll.css({
                            'height':bonusHeight+'px',
                            'overflow':'auto'
                        });
                        bonusScroll.mCustomScrollbar({
                            autoHideScrollbar:true,
                            theme:"light-thin"
                        });

                    });
                }
            }

            //右边栏关闭
            $('.right-bar-close').click(function(){
                rightBar.animate({'right':'-235px'},'swing');
            });

            //我的账户
            $('#open-myAccount').click(function(){
                if(pangu.myData.username && localStorage.token){
                    rightBarOpenFn($('#open-myAccount'));
                }else{
                    promptBox('您还没有登录！','立即登录',function(index){
                        if(pangu.myData.username && !localStorage.token){
                            window.location.reload();
                        }
                        layer.close(index);
                        getClientCode();
                        $('#login-box').show();
                    })
                }
            });

            //充值
            $('#open-myRecharge').click(function(){
                if(pangu.myData.username && localStorage.token){
                    localStorage.accountManageLink=0;
                    window.open('userCenter/accountManage.html');
                }else{
                    promptBox('您还没有登录！','立即登录',function(index){
                        if(pangu.myData.username && !localStorage.token){
                            window.location.reload();
                        }
                        layer.close(index);
                        getClientCode();
                        $('#login-box').show();
                    })
                }
            });

            //红利
            $('#open-myBonus').click(function(){
                if(pangu.myData.username && localStorage.token){
                    rightBarOpenFn($('#open-myBonus'));
                }else{
                    promptBox('您还没有登录！','立即登录',function(index){
                        if(pangu.myData.username && !localStorage.token){
                            window.location.reload();
                        }
                        layer.close(index);
                        getClientCode();
                        $('#login-box').show();
                    })
                }
            });

            //客服
            $('.right-bar-tab-item .online-service').click(function(){
                serviceSystem();
            });

            //消息(如果有未读消息，显示小圆点)
            if(pangu.myData.username && localStorage.token){
                postData('sms-unread',{'token':localStorage.token},function(res){
                    $('#loader-box').hide();
                    if(res.status==1){
                        if(res.data>0){
                            $('#open-myInfo').html('<i class="icon-message2"></i><div class="new-message"></div>');
                        }
                    }
                });
            }
            $('#open-myInfo').click(function(){
                if(pangu.myData.username && localStorage.token){
                    window.open('userCenter/news.html');
                }else{
                    promptBox('您还没有登录！','立即登录',function(index){
                        if(pangu.myData.username && !localStorage.token){
                            window.location.reload();
                        }
                        layer.close(index);
                        getClientCode();
                        $('#login-box').show();
                    })
                }
            });

            //app二维码
            var tipsQrcoder = $('.tab-item-tips-qrcoder');
            tipsQrcoder.hide();
            //只在首页显示二维码
            if(window.location.href.indexOf('index')!=-1 && getCookie('tipsQrcoderShow')!=1 ){
                tipsQrcoder.show();
                setCookie('tipsQrcoderShow',1);
            }
            $('.tab-item-qrcoder').click(function(){
                if(tipsQrcoder.css('display')=='block'){
                    tipsQrcoder.hide();
                }else{
                    tipsQrcoder.show();
                }
            });
        }
    });
}


//登录状态下显示用户信息,右边栏才能打开
function afterLoginShow(){
    getUserInfo(function(){
        header();
        rightBar();
        pgv_pvid = pangu.myData.username;
        layChatFn();
    },function(){
        header();
        rightBar();
        if(localStorage.ip){
            pgv_pvid = localStorage.ip;
            layChatFn();
        }else{
            getData('website-status',function(res){
                $('#loader-box').hide();
                if(res.status==1){
                    localStorage.ip = res.data.ip;
                    pgv_pvid = localStorage.ip;
                    layChatFn();
                }
            });
        }
    });
}


/***************************额度转换************************/
//额度转换框
function fastTransfer(gameRoof){
    var fastModalTransfer = $('.fast-modal-transfer');
    if(fastModalTransfer.length==0){
        var fastModalTransferBox = '<div class="fast-modal-transfer animated bounceInDown"></div>';
        $('body').append(fastModalTransferBox);
        fastModalTransfer = $('.fast-modal-transfer');
    }

    fastModalTransfer.load('main/fast_modal_transfer.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            fastModalTransfer.html(responseText);
            $('.fast-transfer-r h3').text(gameRoof);
            fastModalTransfer.show(function(){
                //关闭模态转化框
                $('.close-fastModalTransfer').click(function(){
                    fastModalTransfer.slideUp();
                });
                //直接进入游戏
                $('#enterGame').click(function(){
                    fastModalTransfer.slideUp();
                });
                //转入金额
                $('#game-enter').click(function(){
                    postInfo = {};
                    var transferAccountVal = $("#transfer-account").val();
                    if(transferAccountVal ==''){
                        alertMsg('请输入金额');
                        return
                    }
                    postInfo = {
                        'account':transferAccountVal
                    };
                    console.log(postInfo);
                    postData('api',postInfo,function(res){
                        $('#loader-box').hide();
                        console.log(res);
                        alertMsg(res.info);
                    });
                    $('#game-enter').hide();
                    $('#transfer-wait').show();
                })
            });
        }
    });
}
//打开额度转化框
function openfastTransfer(){
    $('.openfastTransfer').click(function(){
        var gameRoofText = $(this).text();
        fastTransfer(gameRoofText);
    });
}

/***************************两侧浮动框************************/
function floatPopover(){
    var floatPopoverBox = '<div class="float-popover"></div>';
    $('body').append(floatPopoverBox);

    $('.float-popover').load('main/float_popover.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            $('.float-popover').html(responseText);
            //右侧浮动框打开与关闭
            var floatPopoverR = $('.float-popover-r');
            $('.float-popover-close').click(function(){
                if(floatPopoverR.css('right')=="-90px"){
                    floatPopoverR.animate({'right':'35px'},'swing');
                }else{
                    floatPopoverR.animate({'right':'-90px'},'swing');
                }
            });
            $('.float-popover-menu .online-service').click(function(){
                serviceSystem();
            });
        }
    });
}

/***************************底部浮动框************************/
function footerPopover(){
    var footerPopoverBox = '<div class="footer-popover"></div>';
    $('body').append(footerPopoverBox);

    $('.footer-popover').load('main/footer_popover.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            $('.footer-popover').html(responseText);
            var footerPopoverBox = $('.footer-popover-box');
            var btnGoRight = $('.button-go-right');
            footerPopoverBox.css('right','110%');
            btnGoRight.css('left','-15px');
            //只在首页显示底部浮动框
            if(window.location.href.indexOf('index')!=-1 && getCookie('footerPopoverShow')!=1 ){
                footerPopoverBox.css('right','0');
                btnGoRight.css('left','-55px');
                setCookie('footerPopoverShow',1);
            }
            //底部底部浮动框 打开与关闭
            $('#footer-active-close').click(function(){
                $(this).fadeOut();
                footerPopoverBox.animate({'right':'110%'},800,'swing',function(){
                    btnGoRight.animate({'left':'-15px'},200,'swing')
                });
            });
            btnGoRight.click(function(){
                $(this).animate({'left':'-55px'},200,'swing',function(){
                    footerPopoverBox.animate({'right':'0'},800,'swing');
                    $('#footer-active-close').fadeIn();
                });
            })
        }
    });
}

/***************************中间内容************************/
//显示对应游戏平台
function showGamePlatform(typeNum,showFn){
    var urlToken = localStorage.token ? localStorage.token :'';
    var url = 'game-platform-game?label='+pangu.myParam.identify+'&platform_type='+typeNum+'&token='+urlToken;
    getData(url,showFn);
}

//显示二级菜单
function showSubNavFn(){
    var subNavTimer = null;
    //体育
    /*showGamePlatform(1,function(res){
        $('#loader-box').hide();
        var sportNavLists = res.data.list;
        var sportNavBox = $('.main-nav-item2 .sport-category');
        //清空体育游戏平台列表
        sportNavBox.html('');
        for(var i=0;i<sportNavLists.length;i++){
            var sportNavLi1 = '<li class="sport-cate1"><a href="javascript:void(0)" class="openfastTransfer">'+sportNavLists[i].game_name+'</a></li>';
            var sportNavLi2 = '<li class="sport-cate2"><a href="javascript:void(0)" class="openfastTransfer">'+sportNavLists[i].game_name+'</a></li>';
            if(i%2==0){
                sportNavBox.append(sportNavLi1);
            }else{
                sportNavBox.append(sportNavLi2);
            }
        }
        openfastTransfer();
    });
    //真人
    showGamePlatform(3,function(res){
        console.log(res);
        $('#loader-box').hide();
    });*/
    $('.hasSubNav').hover(function(){
        var thisSubNav = $(this).find('.sub-nav');
        subNavTimer = setTimeout(function(){
            thisSubNav.show(300);
        },200);
    },function(){
        clearTimeout(subNavTimer);
        $(this).find('.sub-nav').hide(300);
    });
}

/***************************其他函数************************/
//回到顶部按钮
function goTopFn(){
    var goTopBox = '<div class="button-go-top" style="display: none;"><i class="icon-up"></i></div>';
    $('body').append(goTopBox);
    $(document).scroll(function () {
        var top = $(document).scrollTop();
        if (top >= 200) {
            $(".button-go-top").show();
        } else {
            $(".button-go-top").hide();
        }
    });
    $('.button-go-top').click(function(){
        $('body').animate({ scrollTop: 0 }, 500);
    });
}


$(document).ready(function () {
    afterLoginShow();
    footer();
    openfastTransfer();
    floatPopover();
    footerPopover();
    showSubNavFn();
    goTopFn();
});