/**
 * Created by Administrator on 2016/12/18.
 */
/******************安全中心设置与修改************************/

/********登录密码***********/
//提交修改登录密码信息
function loginwordChangeApplyFn(){
    $('#loginwordChange-apply').click(function(){
        postInfo = {};
        var loginwordChange1 = $("input[name^='oldPassword']"),
            loginwordChangeMsg1 = loginwordChange1.next('span'),
            loginwordChange2 = $("input[name^='newPassword']"),
            loginwordChangeMsg2 = loginwordChange2.next('span'),
            loginwordChange3 = $("input[name^='comfirm_newPassword']"),
            loginwordChangeMsg3 = loginwordChange3.next('span');
        inputOnFocus(loginwordChange1,loginwordChangeMsg1);
        inputOnFocus(loginwordChange2,loginwordChangeMsg2);
        inputOnFocus(loginwordChange3,loginwordChangeMsg3);
        if(loginwordChange1.val()==''){
            //alertMsg('请输入原始登录密码！');
            loginwordChangeMsg1.text('请输入原始登录密码！');
            return
        }
        if(! /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/.test(loginwordChange1.val())){
            //alertMsg('请输入6-20位的字母和数字组合的密码！');
            loginwordChangeMsg1.text('请输入6-20位的字母和数字组合的密码！');
            loginwordChange1.val('');
            loginwordChange2.val('');
            loginwordChange3.val('');
            return
        }
        if(loginwordChange2.val()==''){
            //alertMsg('请输入新登录密码！');
            loginwordChangeMsg2.text('请输入新登录密码！');
            return
        }
        if(! /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/.test(loginwordChange2.val())){
            //alertMsg('请输入6-20位的字母和数字组合的密码！');
            loginwordChangeMsg2.text('请输入6-20位的字母和数字组合的密码！');
            loginwordChange2.val('');
            loginwordChange3.val('');
            return
        }
        if(loginwordChange3.val()==''){
            //alertMsg('请输入确认新登录密码！');
            loginwordChangeMsg3.text('请输入确认新登录密码！');
            return
        }
        if(loginwordChange2.val()!=loginwordChange3.val()){
            //alertMsg('新登录密码与确认新密码不一致！');
            loginwordChangeMsg3.text('新登录密码与确认新密码不一致！');
            loginwordChange3.val('');
            return
        }
        if(loginwordChange1.val()==loginwordChange2.val()){
            //alertMsg('新密码与原登录密码一致！');
            loginwordChangeMsg2.text('新密码与原登录密码一致！');
            loginwordChange2.val('');
            loginwordChange3.val('');
            return
        }

        postInfo = {
            'oldpassword':loginwordChange1.val(),
            'newpassword':loginwordChange2.val(),
            'token':localStorage.token
        };
        postData('set-password',postInfo,function(res){
            $('#loader-box').hide();
            console.log(res);
            alertMsg(res.msg,function(){
                loginwordChange1.val('');
                loginwordChange2.val('');
                loginwordChange3.val('');
                if(res.status==1){
                    layer.closeAll();
                }
            });
        });
    });
}
//修改登录密码
function loginwordChangeFn(){
    var loginwordChange = $('#loginwordChange');
    if(loginwordChange.length==0){
        var loginwordChangeBox = '<div class="main-modal" id="loginwordChange" style="display: none;"></div>';
        $('body').append(loginwordChangeBox);
        loginwordChange = $('#loginwordChange');
    }

    loginwordChange.load('common/loginword_change.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            loginwordChange.html(responseText);
            openContent('修改登录密码',loginwordChange);
            loginwordChangeApplyFn();
        }
    });
}

/********邮箱***********/
//邮箱激活
function mailSensitize(mailVal){
    getData('send?token='+localStorage.token+'&email='+mailVal,function(res){
        $('#loader-box').hide();
        if(res.status==1){
            //关闭邮箱验证弹框
            layer.closeAll();
            //打开激活码
            var mailSensitize = $('#mailSensitize');
            if(mailSensitize.length==0){
                var mailSensitizeBox = '<div class="main-modal" id="mailSensitize" style="display: none;"></div>';
                $('body').append(mailSensitizeBox);
                mailSensitize = $('#mailSensitize');
            }
            mailSensitize.load('common/mail_sensitize.html',function (responseText, textStatus, XMLHttpRequest){
                if(textStatus == 'success'){
                    mailSensitize.html(responseText);
                    $('.mail-active-box .session-mail').html(mailVal);
                    $('.mail-active-box .goto-email a').attr('href','http://mail.'+mailVal.split('@')[1]);
                    openContent('请激活账号',mailSensitize);
                    $('.mail-active-box .send-again').click(function(){
                        getData('send?token='+localStorage.token+'&email='+mailVal,function(data){
                            $('#loader-box').hide();
                            if(data.status==1){
                                successLayer('发送成功！');
                            }
                        })
                    })
                }
            });
        }
    });
}
//提交邮箱认证信息
function mailSetApplyFn(){
    $('#mailSet-apply').click(function(){
        var mailSet1 = $("input[name^='mail']"),
            mailSetMsg1 = mailSet1.next('span'),
            mailSet2 = $("input[name^='comfirm_mail']"),
            mailSetMsg2 = mailSet2.next('span');
        inputOnFocus(mailSet1,mailSetMsg1);
        inputOnFocus(mailSet2,mailSetMsg2);
        if(mailSet1.val()==''){
            //alertMsg('请输入绑定邮箱！');
            mailSetMsg1.text('请输入绑定邮箱！');
            return
        }
        if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(mailSet1.val())){
            //alertMsg('请输入符合规范的邮箱！');
            mailSetMsg1.text('请输入符合规范的邮箱！');
            mailSet1.val('');
            mailSet2.val('');
            return
        }
        if(mailSet2.val()==''){
            //alertMsg('请输入确认邮箱！');
            mailSetMsg2.text('请输入确认邮箱！');
            return
        }
        if(mailSet1.val()!=mailSet2.val()){
            //alertMsg('邮箱与确认邮箱不一致！');
            mailSetMsg2.text('邮箱与确认邮箱不一致！');
            mailSet2.val('');
            return
        }
        mailSensitize(mailSet1.val());
    });
}
//邮箱认证
function mailSetFn(){
    var mailSet = $('#mailSet');
    if(mailSet.length==0){
        var mailSetBox = '<div class="main-modal" id="mailSet" style="display: none;"></div>';
        $('body').append(mailSetBox);
        mailSet = $('#mailSet');
    }

    mailSet.load('common/mail_set.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            mailSet.html(responseText);
            openContent('邮箱认证',mailSet,function(){
                layer.closeAll();
            });
            mailSetApplyFn();
        }
    });
}
//提交修改邮箱信息
function mailChangeApplyFn(){
    $('#mailChange-apply').click(function(){
        postInfo = {};
        var mailChange1 = $("input[name^='newMail']"),
            mailChangeMsg1 = mailChange1.next('span'),
            mailChange2 = $("input[name^='comfirm_newMail']"),
            mailChangeMsg2 = mailChange2.next('span');
        inputOnFocus(mailChange1,mailChangeMsg1);
        inputOnFocus(mailChange2,mailChangeMsg2);
        if(mailChange1.val()==''){
            //alertMsg('请输入新邮箱！');
            mailChangeMsg1.text('请输入新邮箱！');
            return
        }
        if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(mailChange1.val())){
            //alertMsg('请输入符合规范的邮箱！');
            mailChangeMsg1.text('请输入符合规范的邮箱！');
            mailChange1.val('');
            mailChange2.val('');
            return
        }
        if(mailChange2.val()==''){
            //alertMsg('请输入确认新邮箱！');
            mailChangeMsg2.text('请输入确认新邮箱！');
            return
        }
        if(mailChange1.val()!=mailChange2.val()){
            //alertMsg('新邮箱与确认新邮箱不一致！');
            mailChangeMsg2.text('新邮箱与确认新邮箱不一致！');
            mailChange2.val('');
            return
        }
        mailSensitize(mailChange1.val());
    })
}
//修改邮箱
function mailChangeFn(){
    var mailChange = $('#mailChange');
    if(mailChange.length==0){
        var mailChangeBox = '<div class="main-modal" id="mailChange" style="display: none;"></div>';
        $('body').append(mailChangeBox);
        mailChange = $('#mailChange');
    }

    mailChange.load('common/mail_change.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            mailChange.html(responseText);
            openContent('修改邮箱',mailChange);
            mailChangeApplyFn();
        }
    });
}

/********实名认证***********/
//提交实名认证信息
function nameTestApplyFn(){
    $('#nameTest-apply').click(function(){
        postInfo = {};
        var genderVal=0;
        var nameTest1 = $("input[name^='reaName']"),
            nameTestMsg1 = nameTest1.next('span'),
            nameTest2 = $("input[name^='sex']:checked"),
            nameTest3 = $("input[name^='birthday']"),
            nameTestMsg3 = nameTest3.next('span');
        inputOnFocus(nameTest1,nameTestMsg1);
        inputOnFocus(nameTest3,nameTestMsg3);
        if(nameTest1.val()==''){
            //alertMsg('请输入真实姓名！');
            nameTestMsg1.text('请输入真实姓名！');
            return
        }
        if(nameTest3.val()==''){
            //alertMsg('请选择出生日期！');
            nameTestMsg3.text('请选择出生日期！');
            return
        }
        if(nameTest2.val()=='男'){
            genderVal = 1;
        }else{
            genderVal = 2;
        }
        postInfo = {
            'name':nameTest1.val(),
            'gender':genderVal,
            'birthday':nameTest3.val().split('-').join(''),
            'token':localStorage.token
        };
        console.log(postInfo);
        postData('auth-name',postInfo,function(res){
            $('#loader-box').hide();
            console.log(res);
            alertMsg(res.msg,function(){
                nameTest1.val('');
                nameTest2.val('');
                nameTest3.val('');
                if(res.status==1){
                    window.location.reload();
                }
            });
        });
    });
}
//实名认证
function nameTestFn(){
    var nameTest = $('#nameTest');
    if(nameTest.length==0){
        var nameTestBox = '<div class="main-modal" id="nameTest" style="display: none;"></div>';
        $('body').append(nameTestBox);
        nameTest = $('#nameTest');
    }

    nameTest.load('common/name_test.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            nameTest.html(responseText);
            form.render();
            dateSelect();
            openContent('实名认证',nameTest,function(){
                layer.closeAll();
            });
            nameTestApplyFn();
        }
    });
}
//提现前提条件-实名认证
function nameTestFn1(){
    var nameTest = $('#nameTest');
    if(nameTest.length==0){
        var nameTestBox = '<div class="main-modal" id="nameTest" style="display: none;"></div>';
        $('body').append(nameTestBox);
        nameTest = $('#nameTest');
    }

    nameTest.load('common/name_test.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            nameTest.html(responseText);
            form.render();
            openContent('实名认证',nameTest,function(index){
                layer.close(index);
                window.location.href = "memberCenter.html";
            });
            nameTestApplyFn();
        }
    });
}

/********资金密码***********/
//提交绑定资金密码信息
function paywordSetApplyFn(){
    $('#paywordSet-apply').click(function(){
        postInfo = {};
        var paywordSet1 = $("input[name^='loginword']"),
            paywordSetMsg1 = paywordSet1.next('span'),
            paywordSet2 = $('#payword_set'),
            paywordSetMsg2 = paywordSet2.next('span'),
            paywordSet3 = $("input[name^='comfirm_payword']"),
            paywordSetMsg3 = paywordSet3.next('span');
        inputOnFocus(paywordSet1,paywordSetMsg1);
        inputOnFocus(paywordSet2,paywordSetMsg2);
        inputOnFocus(paywordSet3,paywordSetMsg3);
        if(paywordSet1.val()==''){
            //alertMsg('请输入登录密码！');
            paywordSetMsg1.text('请输入登录密码！');
            return
        }
        if(!/^[a-zA-Z0-9_]{6,20}$/.test(paywordSet1.val())){
            //alertMsg('请输入6-20位的字母和数字组合的密码！');
            paywordSetMsg1.text('请输入6-20位的数字、字母组合的密码！');
            paywordSet1.val('');
            paywordSet2.val('');
            paywordSet3.val('');
            return
        }
        if(paywordSet2.val()==''){
            //alertMsg('请输入资金密码！');
            paywordSetMsg2.text('请输入资金密码！');
            return
        }
        if(!/^[a-zA-Z0-9_]{6,20}$/.test(paywordSet2.val())){
            //alertMsg('请输入6-20位的数字或者字母组合的密码！');
            paywordSetMsg2.text('请输入6-20位的数字、字母组合的密码！');
            paywordSet2.val('');
            paywordSet3.val('');
            return
        }
        if(paywordSet3.val()==''){
            //alertMsg('请输入确认资金密码！');
            paywordSetMsg3.text('请输入确认资金密码！');
            return
        }
        if(paywordSet2.val()!=paywordSet3.val()){
            //alertMsg('资金密码与确认资金密码不一致！');
            paywordSetMsg3.text('资金密码与确认资金密码不一致！');
            paywordSet3.val('');
            return
        }
        if(paywordSet1.val()==paywordSet2.val()){
            //alertMsg('登录密码与资金密码不能一致！');
            paywordSetMsg2.text('登录密码与资金密码不能一致！');
            paywordSet2.val('');
            paywordSet3.val('');
            return
        }
        postInfo = {
            'password':paywordSet1.val(),
            'pay_password':paywordSet2.val(),
            'token':localStorage.token
        };
        console.log(postInfo);
        postData('set-paypassword',postInfo,function(res){
            $('#loader-box').hide();
            console.log(res);
            alertMsg(res.msg,function(){
                paywordSet1.val('');
                paywordSet2.val('');
                paywordSet3.val('');
                if(res.status==1){
                    //window.location.reload();
                    //安全中心
                    if($('.safe-box')){
                        var safeBoxPayword = $('.safe-box ul li:nth-child(5) .safe-info div');
                        safeBoxPayword.hide();
                        safeBoxPayword.eq(1).show();
                    }
                    //账号信息
                    if($('.user-info-list')){
                        var userinfoListPayword = $('.user-info-list .payword-item .user-info-list-r a');
                        userinfoListPayword.hide();
                        userinfoListPayword.eq(1).show();
                    }
                    layer.closeAll();
                }
            });
        });
    });
}
//绑定资金密码
function paywordSetFn(){
    var paywordSet = $('#paywordSet');
    if(paywordSet.length==0){
        var paywordSetBox = '<div class="main-modal" id="paywordSet" style="display: none;"></div>';
        $('body').append(paywordSetBox);
        paywordSet = $('#paywordSet');
    }

    paywordSet.load('common/payword_set.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            paywordSet.html(responseText);
            openContent('绑定资金密码',paywordSet);
            paywordSetApplyFn();
        }
    });
}
//提现前提条件-绑定资金密码
function paywordSetFn1(){
    var paywordSet = $('#paywordSet');
    if(paywordSet.length==0){
        var paywordSetBox = '<div class="main-modal" id="paywordSet" style="display: none;"></div>';
        $('body').append(paywordSetBox);
        paywordSet = $('#paywordSet');
    }

    paywordSet.load('common/payword_set.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            paywordSet.html(responseText);
            openContent('绑定资金密码',paywordSet,function(index){
                layer.close(index);
                window.location.href = "memberCenter.html";
            });
            paywordSetApplyFn();
        }
    });
}

//提交修改资金密码信息
function paywordChangeApplyFn(){
    $('#paywordChange-apply').click(function(){
        postInfo = {};
        var paywordChange1 = $("input[name^='oldPayword']"),
            paywordChangeMsg1 = paywordChange1.next('span'),
            paywordChange2 = $("input[name^='newPayword']"),
            paywordChangeMsg2 = paywordChange2.next('span'),
            paywordChange3 = $("input[name^='comfirm_newPayword']"),
            paywordChangeMsg3 = paywordChange3.next('span');
        inputOnFocus(paywordChange1, paywordChangeMsg1);
        inputOnFocus(paywordChange2, paywordChangeMsg2);
        inputOnFocus(paywordChange3, paywordChangeMsg3);
        if(paywordChange1.val()==''){
            //alertMsg('请输入原始资金密码！');
            paywordChangeMsg1.text('请输入原始资金密码！');
            return
        }
        if(!/^[a-zA-Z0-9_]{6,20}$/.test(paywordChange1.val())){
            //alertMsg('请输入6-20位的数字或者字母组合的密码！');
            paywordChangeMsg1.text('请输入6-20位的数字、字母组合的密码！');
            paywordChange1.val('');
            paywordChange2.val('');
            paywordChange3.val('');
            return
        }
        if(paywordChange2.val()==''){
            //alertMsg('请输入新资金密码！');
            paywordChangeMsg2.text('请输入新资金密码！');
            return
        }
        if(!/^[a-zA-Z0-9_]{6,20}$/.test(paywordChange2.val())){
            //alertMsg('请输入6-20位的数字或者字母组合的密码！');
            paywordChangeMsg2.text('请输入6-20位的数字、字母组合的密码！');
            paywordChange2.val('');
            paywordChange3.val('');
            return
        }
        if(paywordChange3.val()==''){
            //alertMsg('请输入确认资金密码！');
            paywordChangeMsg3.text('请输入确认资金密码！');
            return
        }
        if(paywordChange2.val()!=paywordChange3.val()){
            //alertMsg('资金密码与确认资金密码不一致！');
            paywordChangeMsg3.text('资金密码与确认资金密码不一致！');
            paywordChange3.val('');
            return
        }
        if(paywordChange1.val()==paywordChange2.val()){
            //alertMsg('原资金密码与新资金密码一致！');
            paywordChangeMsg2.text('原资金密码与新资金密码一致！');
            paywordChange2.val('');
            paywordChange3.val('');
            return
        }
        postInfo = {
            'oldpay_password':paywordChange1.val(),
            'newpay_password':paywordChange2.val(),
            'token':localStorage.token
        };
        console.log(postInfo);
        postData('re-paypassword',postInfo,function(res){
            $('#loader-box').hide();
            console.log(res);
            alertMsg(res.msg,function(){
                paywordChange1.val('');
                paywordChange2.val('');
                paywordChange3.val('');
                if(res.status==1){
                    layer.closeAll();
                }
            });
        });
    })
}
//修改资金密码
function paywordChangeFn(){
    var paywordChange = $('#paywordChange');
    if(paywordChange.length==0){
        var paywordChangeBox = '<div class="main-modal" id="paywordChange" style="display: none;"></div>';
        $('body').append(paywordChangeBox);
        paywordChange = $('#paywordChange');
    }

    paywordChange.load('common/payword_change.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            paywordChange.html(responseText);
            openContent('修改资金密码',paywordChange);
            paywordChangeApplyFn();
        }
    });
}

/********手机号***********/
//提交绑定手机信息
function phoneSetApplyFn(){
    $('#phoneSet-apply').click(function(){
        postInfo = {};
        var phoneSet1 = $("input[name^='phone']"),
            phoneSetMsg1 = phoneSet1.next('span'),
            phoneSet2 = $("#phone_testNum"),
            phoneSetMsg2 = phoneSet2.next('span');
        inputOnFocus(phoneSet1,phoneSetMsg1);
        inputOnFocus(phoneSet2,phoneSetMsg2);
        if(phoneSet1.val()==''){
            //alertMsg('请输入手机号码！');
            phoneSetMsg1.text('请输入手机号码！');
            return
        }
        if(!/^1\d{10}$/.test(phoneSet1.val())){
            //alertMsg('请输入符合规范的手机号码！');
            phoneSetMsg1.text('请输入符合规范的手机号码！');
            phoneSet1.val('');
            return
        }
        /*if(phoneSet2.val()==''){
            //alertMsg('请输入验证码！');
            phoneSetMsg2.text('请输入验证码！');
            return
        }*/
        postInfo = {
            'mobile':phoneSet1.val(),
            'token':localStorage.token
        };
        console.log(postInfo);
        postData('mobile-bind',postInfo,function(res){
            $('#loader-box').hide();
            console.log(res);
            alertMsg(res.msg,function(){
                phoneSet1.val('');
                phoneSet2.val('');
                if(res.status==1){
                    window.location.reload();
                }
            });
        });
    })
}
//绑定手机号
function phoneSetFn(){
    var phoneSet = $('#phoneSet');
    if(phoneSet.length==0){
        var phoneSetBox = '<div class="main-modal" id="phoneSet" style="display: none;"></div>';
        $('body').append(phoneSetBox);
        phoneSet = $('#phoneSet');
    }

    phoneSet.load('common/phone_set.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            phoneSet.html(responseText);
            openContent('绑定手机号',phoneSet,function(){
                layer.closeAll();
            });
            phoneSetApplyFn();
        }
    });
}

//提交更改绑定手机信息
function phoneDeleteApplyFn(){
    $('#phoneDelete-apply').click(function(){
        postInfo = {};
        var  phoneDelete = $("input[name^='newphone_testNum']");
        //if(phoneDelete.val()==''){
        //    alertMsg('请输入验证码！');
        //    return
        //}
        postInfo = {
            'token':localStorage.token
        };
        console.log(postInfo);
        postData('drop-mobile',postInfo,function(res){
            $('#loader-box').hide();
            console.log(res);
            alertMsg(res.msg,function(){
                phoneDelete.val('');
                if(res.status==1){
                    window.location.reload();
                }
            });
        });
    })
}
//解绑手机号
function phoneDeleteFn(){
    var phoneDelete = $('#phoneDelete');
    if(phoneDelete.length==0){
        var phoneDeleteBox = '<div class="main-modal" id="phoneDelete" style="display: none;"></div>';
        $('body').append(phoneDeleteBox);
        phoneDelete = $('#phoneDelete');
    }

    phoneDelete.load('common/phone_delete.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            phoneDelete.html(responseText);
            if(localStorage.mobile){
                $('.main-form-item-mobile').html(localStorage.mobile);
            }else if(pangu.myData.mobile){
                $('.main-form-item-mobile').html(ellipsis(pangu.myData.mobile));
            }
            openContent('解绑手机号码',phoneDelete);
            phoneDeleteApplyFn();
        }
    });
}

/********QQ号***********/
//提交QQ绑定信息
function QQsetApplyFn(){
    $('#QQset-apply').click(function(){
        postInfo = {};
        var QQset = $("input[name^='qq']"),
            QQsetMsg = QQset.next('span');
        inputOnFocus(QQset,QQsetMsg);
        if(QQset.val()==''){
            //alertMsg('请输入QQ号！');
            QQsetMsg.text('请输入QQ号！');
            return
        }
        if(!/^[1-9][0-9]{4,14}$/.test(QQset.val())){
            //alertMsg('请输入符合规范的QQ号码！');
            QQsetMsg.text('请输入符合规范的QQ号码！');
            QQset.val('');
            return
        }
        postInfo = {
            'qq_number':QQset.val(),
            'token':localStorage.token
        };
        console.log(postInfo);
        postData('qq-bind',postInfo,function(res){
            $('#loader-box').hide();
            console.log(res);
            alertMsg(res.msg,function(){
                QQset.val('');
                if(res.status==1){
                    //window.location.reload();
                    //账号信息
                    var userinfoListPayword1 = $('.user-info-list .payword-item .user-info-list-m span');
                    var userinfoListPayword2 = $('.user-info-list .payword-item .user-info-list-r a');
                    userinfoListPayword1.hide();
                    userinfoListPayword2.hide();
                    userinfoListPayword1.eq(1).show();
                    userinfoListPayword2.eq(1).show();
                    layer.closeAll();
                }
            });
        });
    });
}
//绑定QQ号
function QQsetFn(){
    var QQset = $('#QQset');
    if(QQset.length==0){
        var QQsetBox = '<div class="main-modal" id="QQset" style="display: none;"></div>';
        $('body').append(QQsetBox);
        QQset = $('#QQset');
    }

    QQset.load('common/QQ_set.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            QQset.html(responseText);
            openContent('绑定QQ',QQset);
            QQsetApplyFn();
        }
    });
}

/********安全问题***********/
//提交安全问题信息
function safeQuestionApplyFn(){
    $('#safeQuestion-apply').click(function(){
        postInfo = {};
        var safeQuestion1 = $(".safe-question-select .layui-anim-upbit .layui-this"),
            safeQuestion2 = $("input[name^='answer']"),
            safeQuestionMsg2 = safeQuestion2.next('span');
        inputOnFocus(safeQuestion2,safeQuestionMsg2);
        if(safeQuestion1.length==0){
            //alertMsg('请选择安全问题！');
            safeQuestionMsg2.text('请选择安全问题！');
            safeQuestion2.val('');
            return
        }
        if(safeQuestion2.val()==''){
            //alertMsg('请输入答案！');
            safeQuestionMsg2.text('请输入答案！');
            return
        }
        postInfo = {
            'question':safeQuestion1.text(),
            'answer':safeQuestion2.val(),
            'token':localStorage.token
        };
        console.log(postInfo);
        postData('safe-question',postInfo,function(res){
            $('#loader-box').hide();
            console.log(res);
            alertMsg(res.msg,function(){
                safeQuestion2.val('');
                if(res.status==1){
                    //window.location.reload();
                    //安全中心
                    var safeBoxSafeQuestion = $('.safe-box ul li:nth-child(4) .safe-info div');
                    safeBoxSafeQuestion.hide();
                    safeBoxSafeQuestion.eq(1).show();
                    layer.closeAll();
                }
            });
        });
    });
}
//绑定安全问题
function safeQuestionFn(){
    var safeQuestion = $('#safeQuestion');
    if(safeQuestion.length==0){
        var safeQuestionBox = '<div class="main-modal" id="safeQuestion" style="display: none;"></div>';
        $('body').append(safeQuestionBox);
        safeQuestion = $('#safeQuestion');
    }

    safeQuestion.load('common/safe_question.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            safeQuestion.html(responseText);
            form.render();
            openContent('安全问题',safeQuestion);
            safeQuestionApplyFn();
        }
    });
}


/******************公共内容区************************/
var stateArr = [];//定义一个表示手机，邮箱，实名认证状态的数组

//右侧头部
function rightHeader(){
    stateArr[0] = pangu.myData.mobile ? 1:0;
    stateArr[1] = pangu.myData.email ? 1:0;
    stateArr[2] = pangu.myData.name ? 1:0;
    $('.main-r-hd').load('common/right_header.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            $('.main-r-hd').html(responseText);
            if(pangu.myData.username){
                $('.user-info h3 span').html(pangu.myData.username);
            }
            if(pangu.myData.last_login_address || pangu.myData.last_login_at){
                if(pangu.myData.last_login_address){
                    $('.user-info p span.last-position').html(pangu.myData.last_login_address);
                }
                if(pangu.myData.last_login_at){
                    $('.user-info p span.last-time').html(pangu.myData.last_login_at);
                }
            } else{
                $('.user-info p').html('欢迎您！');
            }
            //用户安全状态-图标
            var timerState = null,
                userSafeLiIndex = 0,
                stateVal = 0;
            $('.user-safe-state li').hover(function(){
                userSafeLiIndex = $(this).index();
                stateVal = stateArr[userSafeLiIndex];
                var thisMessage =  $(this).find('.safe-state-message'+stateVal);
                timerState = setTimeout(function () {
                    thisMessage.show();
                },200);
            },function(){
                clearTimeout(timerState);
                $(this).find('.safe-state-message').hide();
            });

            //用户安全状态-文字显示与隐藏
            var userSafeA = $('.user-safe-text a'),
                userNotSafeNum = 0;
            for(var i=0;i<stateArr.length;i++){
                if(stateArr[i]==0){
                    userSafeA.eq(i).show();
                }else{
                    userSafeA.eq(i).hide();
                    userNotSafeNum++;
                }
            }
            if(userNotSafeNum==3){
                $('.user-safe-text').hide();
            }
            //绑定手机
            $('.phone-set-open').click(function(){
                phoneSetFn();
            });
            //邮箱认证
            $('.mail-set-open').click(function(){
                mailSetFn();
            });
            //实名认证
            $('.name-test-open').click(function(){
                nameTestFn();
            });

            //退出登录
            $('.logoff').click(function(){
                //localStorage.clear();
                localStorage.removeItem('token');
                setTimeout(function(){
                    window.close();
                },1000);

            });
        }
    });
}

//资金管理处页面默认跳转充值页面
function accountManageLink(){
    $('.hasLSubNav').click(function(){
        localStorage.accountManageLink=0;
        window.location.href = 'accountManage.html'
    })
}

var currPage = 1;
//获取未读信息个数
function getUnreadNum(){
    if(localStorage.token){
        postData('sms-unread',{'token':localStorage.token},function(res){
            $('#loader-box').hide();
            console.log(res);
            if(res.status==1){
                var newDot = $('.main-l-nav ul li').eq(3).find('a');
                if(res.data>0){
                    newDot.append('<div class="new-dot">'+res.data+'</div>');
                }else{
                    newDot.html('<i class="icon-message"></i> <span>消息中心 </span>');
                }
            }
        });
    }
}

//显示消息列表
function showNewsLists(newsData){
    var liHtml = '';
    for(var i=0;i<newsData.length;i++){
        if(newsData[i].status==0){
            newsData[i].statusText = '未读'
        }else{
            newsData[i].statusText = '已读'
        }
        newsData[i].date = monthDayShow(newsData[i].created_at);
        liHtml += '<li><i class="news-id" style="display: none;">'+newsData[i].id+'</i><span class="news-status">[ '+newsData[i].statusText+' ]</span> <span class="news-title">'+newsData[i].title+' </span> <span>'+newsData[i].date+'</span></li>'
    }
    $('.message-box-list ul').html(liHtml);
}

//点击消息弹窗显示详情
function showNewsdetail(){
    $('.message-box-list li .news-title').click(function(){
        var newsTitle = $(this).text(),
            newsId = $(this).parent('li').find('.news-id').text(),
            newsStatus = $(this).parent('li').find('.news-status').text();
        var newsDetailPostinfo = {
            'token':localStorage.token,
            'id':newsId
        };
        postData('sms-detail',newsDetailPostinfo,function(res){
            $('#loader-box').hide();
            console.log(res);
            if(res.status==1){
                var detailHtml = '<div class="news-detail">'+res.data.content+'</div>';
                openContent(newsTitle,detailHtml,function(){
                    //如果开始是未读状态，刷新页面
                    if(newsStatus == '[ 未读 ]'){
                        //刷新未读条目
                        getUnreadNum();
                        //刷新消息中心列表
                        if(window.location.href.indexOf('news')!=-1){
                            getNews(currPage);
                        }
                        //刷新会员中心列表
                        if(window.location.href.indexOf('memberCenter')!=-1){
                            getLatestNews();
                        }
                    }
                });
            }
        });
    });
}


$(document).ready(function(){
    dateSelect();
});