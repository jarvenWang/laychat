/**
 * Created by Administrator on 2016/12/21.
 */
var reg1 = $("#reg-username"),
    reg2_1 = $("#reg-password"),
    reg2_2 = $("#reg-password1"),
    reg3 = $('#reg-code'),
    reg4_1 = $('#reg-pay_password'),
    reg4_2 = $('#reg-pay_password1'),
    reg5 = $(".safe-question-select .layui-anim-upbit .layui-this"),  //安全问题选择框（text）
    reg6 = $('#reg-answer'),
    reg7 = $('#reg-name'),
    reg8 = $('#reg-mobile'),
    reg9 = $('#reg-email'),
    reg10 = $('#reg-address'),
    regErr = $('.reg-box .form-item-err');
regErr.text('');
inputOnFocus(reg1,regErr);
inputOnFocus(reg2_1,regErr);
inputOnFocus(reg2_2,regErr);
inputOnFocus(reg3,regErr);
inputOnFocus(reg4_1,regErr);
inputOnFocus(reg4_2,regErr);
inputOnFocus(reg5,regErr);
inputOnFocus(reg6,regErr);
inputOnFocus(reg7,regErr);
inputOnFocus(reg8,regErr);
inputOnFocus(reg9,regErr);
inputOnFocus(reg10,regErr);

//获取验证码
function getRegClientCode(){
    putWithOutData('make',function(res){
        $('#loader-box').hide();
        console.log(res);
        if(res.status==1){
            localStorage.client_code = res.data.list.client_code;
            var codeImgReg = '<img src='+res.data.list.url+'?v='+Math.random()+'>';
            $('.reg-box .client-code').html(codeImgReg);
        }
    });
}
//提交表单
function regFormApply(list){
    $('#register').click(function(){
        regInfo ={};
        /*********表单验证*********/
        /***用户名(必填)***/
        if(reg1.val()==''){
            regErr.text('请输入用户名！');
            return
        }
        //4-12位数字或者字母组合
        if(!/^[a-zA-Z0-9_]{4,12}$/.test(reg1.val().replace(/(\s*$)/g,""))){
            regErr.text('请输入正确的用户名！');
            reg1.val('');
            reg2_1.val('');
            reg2_2.val('');
            return
        }
        regInfo.username = reg1.val().replace(/(\s*$)/g,"");

        /***登录密码(必填)***/
        if(reg2_1.val()==''){
            regErr.text('请输入密码！');
            return
        }
        //6-20位数字和者字母组合
        if(!/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/.test(reg2_1.val())){
            regErr.text('请输入6-20位的字母和数字组合的密码！');
            reg2_1.val('');
            reg2_2.val('');
            reg3.val('');
            return
        }
        if(reg2_2.val()==''){
            regErr.text('请输入确认密码！');
            return
        }
        if(reg2_1.val()!=reg2_2.val()){
            regErr.text('密码和确认密码不匹配！');
            reg2_2.val('');
            reg3.val('');
            return
        }
        regInfo.password = reg2_1.val();

        for(var j=0;j<list.length;j++){
            /***资金密码***/
            if(list[j].field_name=='pay_password'&& list[j].required=='1'){
                if(reg4_1.val()==''){
                    regErr.text('请输入资金密码！');
                    return
                }
                //6-20位数字或者字母组合
                if(!/^[a-zA-Z0-9_]{6,20}$/.test(reg4_1.val())){
                    regErr.text('请输入6-20位的字母、数字组合的密码！');
                    reg4.val('');
                    return
                }
                if(reg4_2.val()==''){
                    regErr.text('请输入确认资金密码！');
                    return
                }
                if(reg4_1.val()!=reg4_2.val()){
                    regErr.text('资金密码与确认资金密码不一致！');
                    reg4_2.val('');
                    return
                }
                //登录密码与资金密码不能设置一样
                if(reg2_1.val()==reg4_1.val()){
                    regErr.text('登录密码与资金密码不能一致！');
                    reg4_1.val('');
                    reg4_2.val('');
                    return
                }
                regInfo.pay_password = reg4_1.val();
            }else if(list[j].field_name=='pay_password'&& list[j].required=='0'){
                if(reg4_1.val()!=''){
                    //6-20位数字或者字母组合
                    if(!/^[a-zA-Z0-9_]{6,20}$/.test(reg4_1.val())){
                        regErr.text('请输入6-20位的字母、数字组合的密码！');
                        reg4.val('');
                        return
                    }
                    if(reg4_1.val()!=reg4_2.val()){
                        regErr.text('资金密码与确认资金密码不一致！');
                        reg4_2.val('');
                        return
                    }
                    //登录密码与资金密码不能设置一样
                    if(reg2_1.val()==reg4_1.val()){
                        regErr.text('登录密码与资金密码不能一致！');
                        reg4_1.val('');
                        reg4_2.val('');
                        return
                    }
                    regInfo.pay_password = reg4_1.val();
                }
            }

            /***安全问题***/
            if(list[j].field_name=='safe_question'&& list[j].required=='1'){
                if(reg5.length==0){
                    regErr.text('请选择安全问题！');
                    return
                }
                if(reg6.val()==''){
                    regErr.text('请输入答案！');
                    return
                }
                regInfo.safe_question = [reg5.text(),reg6.val()];
            }else if(list[j].field_name=='safe_question'&& list[j].required=='0'){
                if(reg5.length==1 && reg6.val()!=''){
                    regInfo.safe_question = [reg5.text(),reg6.val()];
                }
            }

            /***姓名***/
            if(list[j].field_name=='name'&& list[j].required=='1'){
                if(reg7.val()==''){
                    regErr.text('请输入姓名！');
                    return
                }
                regInfo.name = reg7.val();
            }else if(list[j].field_name=='name'&& list[j].required=='0'){
                if(reg7.val()!=''){
                    regInfo.name = reg7.val();
                }
            }

            /***手机***/
            if(list[j].field_name=='mobile'&& list[j].required=='1'){
                if(reg8.val()==''){
                    regErr.text('请输入手机号码！');
                    return
                }
                if(!/^1\d{10}$/.test(reg8.val())){
                    regErr.text('请输入符合规范的手机号码！');
                    reg8.val('');
                    return
                }
                regInfo.mobile = reg8.val();
            }else if(list[j].field_name=='mobile'&& list[j].required=='0'){
                if(reg8.val()!=''){
                    if(!/^1\d{10}$/.test(reg8.val())){
                        regErr.text('请输入符合规范的手机号码！');
                        reg8.val('');
                        return
                    }
                    regInfo.mobile = reg8.val();
                }
            }

            /***邮箱***/
            if(list[j].field_name=='email'&& list[j].required=='1'){
                if(reg9.val()==''){
                    regErr.text('请输入邮箱！');
                    return
                }
                if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(reg9.val())){
                    regErr.text('请输入符合规范的邮箱！');
                    reg9.val('');
                    return
                }
                regInfo.email = reg9.val();
            }else if(list[j].field_name=='email'&& list[j].required=='0'){
                if(reg9.val()!=''){
                    if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(reg9.val())){
                        regErr.text('请输入符合规范的邮箱！');
                        reg9.val('');
                        return
                    }
                    regInfo.email = reg9.val();
                }
            }

            /***地址***/
            if(list[j].field_name=='address'&& list[j].required=='1'){
                if(reg10.val()==''){
                    regErr.text('请输入居住地址！');
                    return
                }
                regInfo.address = reg10.val();
            }else if(list[j].field_name=='address'&& list[j].required=='0'){
                if(reg10.val()!=''){
                    regInfo.address = reg10.val();
                }
            }

            /***验证码(显示则必填)***/
            if(list[j].field_name=='code'&& list[j].required=='1'){
                if(reg3.val()==''){
                    regErr.text('请输入验证码！');
                    return
                }
                regInfo.code = reg3.val();
                regInfo.client_code = localStorage.client_code;
            }
        }
        console.log(regInfo);
        putData('user-register',regInfo,function(res){
             $('#loader-box').hide();
                 console.log(res);
                 if(res.status==1){
                     successLayer(res.msg,function(){
                         reg1.val('');
                         reg2_1.val('');
                         reg2_2.val('');
                         reg3.val('');
                         reg4_1.val('');
                         reg4_2.val('');
                         reg5.val('');
                         reg6.val('');
                         reg7.val('');
                         reg8.val('');
                         reg9.val('');
                         reg10.val('');
                     localStorage.token = res.data.list.token;
                     //var userDataReg = JSON.stringify(res.data.list.list);
                     //setCookieWithTime('userInfo',userDataReg,1);
                     askBox('请先完善信息','立即完善','暂不完善',function(){
                         window.location.href='index.html';
                         window.open('userCenter/userInfo.html');
                     },function(){
                         window.location.href='index.html';
                     });

                     });
                 }else{
                     if(res.code!='5009'){
                         reg1.val('');
                         reg2_1.val('');
                         reg2_2.val('');
                         reg4_1.val('');
                         reg4_2.val('');
                    }
                     reg3.val('');
                     getRegClientCode();
                     regErr.text(res.msg);
             }
         });
    });
}
//后台获取注册显示字段
function regFormShow(){
    getData('member-registration-field',function(res){
        console.log(res);
        if(res.status==1){
            if(res.data.is_close == 1){
                var regFormList = res.data.list;
                for(var i=0;i<regFormList.length;i++){
                    $('.register-'+regFormList[i].field_name).show();
                    if(regFormList[i].required=='1'){
                        $('.register-'+regFormList[i].field_name).find('.input-require').html('*');
                    }
                    if(regFormList[i].field_name=='code'){
                        getRegClientCode();
                        //刷新验证码
                        $('.reg-box .client-code').click(function(){
                            getRegClientCode();
                        });
                    }
                }
                openRegTips();
                regFormApply(regFormList);
            }else{
                $('.reg-box .main-form').html('注册功能暂时关闭，请谅解！');
            }
        }
    });
}

//注册(用户名 密码 验证码)
/*function register(){
    $('#register').click(function(){
        var reg1 = $("#reg-username"),
            reg2 = $("#reg-password"),
            reg3 = $("#reg-comfirmPassword"),
            reg4 = $('#reg-code'),
            regErr = $('.reg-box .form-item-err');
        regErr.text('');
        inputOnFocus(reg1,regErr);
        inputOnFocus(reg2,regErr);
        inputOnFocus(reg3,regErr);
        inputOnFocus(reg4,regErr);
        /!*********表单验证*********!/
        //用户名：
        if(reg1.val()==''){
            regErr.text('请输入用户名！');
            return
        }
        //4-12位数字或者字母组合
        if(!/^[a-zA-Z0-9_]{4,12}$/.test(reg1.val())){
            regErr.text('请输入4-12位字母、数字组成的用户名！');
            reg1.val('');
            reg2.val('');
            reg3.val('');
            reg4.val('');
            return
        }
        //登录密码：
        if(reg2.val()==''){
            regErr.text('请输入密码！');
            return
        }
        //6-20位数字和者字母组合
        if(!/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/.test(reg2.val())){
            regErr.text('请输入6-20位的字母和数字组合的密码！');
            reg2.val('');
            reg3.val('');
            reg4.val('');
            return
        }
        if(reg3.val()==''){
            regErr.text('请输入确认密码！');
            return
        }
        if(reg2.val()!=reg3.val()){
            regErr.text('密码和确认密码不匹配！');
            reg3.val('');
            reg4.val('');
            return
        }
        //验证码：
        if(reg4.val()==''){
            regErr.text('请输入验证码！');
            return
        }
        regInfo = {
            'username':reg1.val(),
            'password':reg2.val(),
            'code': reg4.val(),
            'client_code':localStorage.client_code
        };
        putData('user-register',regInfo,function(res){
            $('#loader-box').hide();
            console.log(res);
            if(res.status==1){
                successLayer(res.msg,function(){
                    reg1.val('');
                    reg2.val('');
                    reg3.val('');
                    reg4.val('');
                    localStorage.token = res.data.list.token;
                    //var userDataReg = JSON.stringify(res.data.list.list);
                    //setCookieWithTime('userInfo',userDataReg,1);
                    askBox('请先完善信息','立即完善','暂不完善',function(){
                        window.location.href='index.html';
                        window.open('userCenter/userInfo.html');
                    },function(){
                        window.location.href='index.html';
                    });

                });
            }else{
                if(res.code!='5009'){
                    reg1.val('');
                    reg2.val('');
                    reg3.val('');
                }
                reg4.val('');
                getRegClientCode();
                regErr.text(res.msg);
            }
        });
    });
}*/

function openRegTips(){
    $('#user-agreement-open').click(function(){
        openContent('用户协议和隐私条款',$('#user-agreement'));
    })
}

$(document).ready(function(){
    regFormShow();
});