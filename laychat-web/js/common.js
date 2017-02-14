/**
 * Created by Administrator on 2016/12/20.
 */
/**********配置全局变量**********/
window.pangu = {
    source:{	//本地开发环境
        //path:'./views/',
        apiHost:"http://43.251.231.178:8866/api/",         //服务器接口地址
        imgHost:"http://43.251.231.178/",         //图片地址
        //webSocketHost:"ws://192.168.220.132:4063",
        indexPath:'c=source#/',
        loginPath:'index.php?c=source&a=login'
    },
    develop:{	//测试服务器环境
        //path:'public/dist',                //测试服务图片，链接模板引用
        apiHost:"",
        imgHost:"",
        //webSocketHost:"ws://192.168.220.132:4063", //测试服 121.40.130.106:4063
        indexPath:'c=index#/',
        loginPath:'index.php?c=index&a=login'
    },
    production:{		//正式上线环境
        //path:'public/dist/',            //正式服务图片，链接模板引用
        apiHost:"",
        imgHost:"",
        //webSocketHost:"ws://120.27.128.165:4063", //线上服   121.40.189.16:4063
        indexPath:'c=index#/',
        loginPath:'index.php?c=index&a=login'
    },
    setConfig:function(){
        switch (window.location.host) {
            case "aa.aa.com": //生产环境
                this.config = this.production;
                break;
            case "bb.bb.com": //测试环境
                this.config = this.develop;
                break;
            default:  		         //本地前端开发环境
                this.config = this.source;
                break;
        }
    },
    config:{},      //存放全局配置路径
    myData:{},       //存放用户信息
    myParam:{}       //存放全局参数
};
pangu.setConfig();
pangu.myParam.identify= 'pg';

/**********cookie**********/
//设置cookie
function setCookie(name,value){
    document.cookie = name + "="+ escape (value);
}
//设置带时间的cookie
function setCookieWithTime(name,value,day){
    var exp = new Date();
    exp.setTime(exp.getTime() + day*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
//读取cookie
function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
//删除所有cookie
/* function clearCookie(){
     var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
     if (keys) {
         for (var i =  keys.length; i--;)
             document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
     }
 }*/
//删除某一个cookie
function removeCookie(cookieName){
    var cookies = document.cookie.split(";");//将所有cookie键值对通过分号分割为数组
    //循环遍历所有cookie键值对
    for (var i = 0; i < cookies.length; i++) {
        //有些cookie键值对前面会莫名其妙产生一个空格，将空格去掉
        if (cookies[i].indexOf(" ") == 0) {
            cookies[i] = cookies[i].substring(1);
        }
        //比较每个cookie的名称，找到要删除的那个cookie键值对
        if (cookies[i].indexOf(cookieName) == 0) {
            var exp = new Date();//获取客户端本地当前系统时间
            exp.setTime(exp.getTime() - 60 * 1000);//将exp设置为客户端本地时间1分钟以前，将exp赋值给cookie作为过期时间后，就表示该cookie已经过期了, 那么浏览器就会将其立刻删除掉
            document.cookie = cookies[i] + ";expires=" + exp.toUTCString();//设置要删除的cookie的过期时间，即在该cookie的键值对后面再添加一个expires键值对，并将上面的exp赋给expires作为值(注意expires的值必须为UTC或者GMT时间，不能用本地时间），那么浏览器就会将该cookie立刻删除掉
            //注意document.cookie的用法很巧妙，在对其进行赋值的时候是设置单个cookie的信息，但是获取document.cookie的值的时候是返回所有cookie的信息
            break;//要删除的cookie已经在客户端被删除掉，跳出循环
        }
    }
}


/**********数据请求与提交**********/
var loaderBox = '<div id="loader-box"></div>';
$('body').append(loaderBox);

var postInfo ={} ,putInfo ={} ,loginInfo ={} ,regInfo ={};
if(window.location.href.indexOf('userCenter')==-1 && window.location.href.indexOf('commonHtml')==-1){
    $('#loader-box').load('main/loader.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            $('#loader-box').html(responseText);
        }
    });
}else{
    $('#loader-box').load('../main/loader.html',function (responseText, textStatus, XMLHttpRequest){
        if(textStatus == 'success'){
            $('#loader-box').html(responseText);
        }
    });
}
//get
function getData(urlapi,sucFuc){
    jQuery.support.cors = true;
    $.ajax({
        url: pangu.config.apiHost+urlapi,
        type: 'GET',
        dataType: 'json',
        cache: false,
        beforeSend: function(){
            $('#loader-box').show();
        }, //加载执行方法
        success: sucFuc, //成功执行方法
        error: function(error){
            $('#loader-box').hide();
            console.log(error);
        }  //错误执行方法
    })
}
//get has errFn
function getDataAll(urlapi,sucFuc,errFn){
    jQuery.support.cors = true;
    $.ajax({
        url: pangu.config.apiHost+urlapi,
        type: 'GET',
        dataType: 'json',
        cache: false,
        beforeSend: function(){
            $('#loader-box').show();
        }, //加载执行方法
        success: sucFuc, //成功执行方法
        error: errFn
    })
}

//post
function postData(api,data,sucFuc){
    jQuery.support.cors = true;
    $.ajax({
        url: pangu.config.apiHost+api+'?token='+localStorage.token,
        type: 'POST',
        dataType: 'json',
        data: data,
        cache: false,
        beforeSend: function(){
            $('#loader-box').show();
        }, //加载执行方法
        success: sucFuc, //成功执行方法
        error: function(error){
            $('#loader-box').hide();
            console.log(error);
        }  //错误执行方法

    })
}
//post without token
function postDataWithoutToken(api,data,sucFuc){
    jQuery.support.cors = true;
    $.ajax({
        url: pangu.config.apiHost+api,
        type: 'POST',
        dataType: 'json',
        data: data,
        cache: false,
        beforeSend: function(){
            $('#loader-box').show();
        }, //加载执行方法
        success: sucFuc, //成功执行方法
        error: function(error){
            $('#loader-box').hide();
            console.log(error);
        }  //错误执行方法
    })
}

//put
function putData(api,data,sucFuc){
    jQuery.support.cors = true;
    $.ajax({
        url: pangu.config.apiHost + api,
        type: 'PUT',
        dataType: 'json',
        data: data,
        cache: false,
        beforeSend: function(){
            $('#loader-box').show();
        }, //加载执行方法
        success: sucFuc, //成功执行方法
        error: function(error){
            $('#loader-box').hide();
            console.log(error);
        }  //错误执行方法

    })
}
//put without data
function putWithOutData(api,sucFuc){
    jQuery.support.cors = true;
    $.ajax({
        url: pangu.config.apiHost + api,
        type: 'PUT',
        dataType: 'json',
        cache: false,
        beforeSend: function(){
            $('#loader-box').show();
        }, //加载执行方法
        success: sucFuc, //成功执行方法
        error: function(error){
            $('#loader-box').hide();
            console.log(error);
        }  //错误执行方法

    })
}


/**********获取网站状态**********/
getData('website-status',function(res){
    $('#loader-box').hide();
    console.log(res);
    if(res.status==1){
        //网站关闭
        localStorage.ip = res.data.ip;
        if(res.data.close==1){
            alert(res.data.close_reason);
            if(window.location.href.indexOf('userCenter')==-1){
                window.location.href = 'commonHtml/wait.html';
            }else{
                window.location.href='../commonHtml/wait.html';
            }
        }
    }
});


/**********获取用户信息**********/
function getUserInfo(sucfn,errFn){
    if(localStorage.token){
        getDataAll('user-info?token='+localStorage.token,function(res){
            $('#loader-box').hide();
            console.log(res);
            if(res.status==1){
                pangu.myData = res.data;
                sucfn();
            }else{
                errFn();
            }
        },function(error){
            $('#loader-box').hide();
            console.log(error);
            errFn();
        });
    }else{
        errFn();
    }
}

//判断是否启用cookie
/*if (navigator.cookieEnabled){
    //获取用户基本信息
    if(localStorage.token){
        if(getCookie('userInfo')){
            pangu.myData = JSON.parse(getCookie('userInfo'));
            console.log(pangu.myData);
        }else{
            localStorage.clear();
        }
    }else{
        removeCookie('userInfo');
        pangu.myData = {};
    }
}else{
    console.log(false);
}*/

/**********获取商家id**********/
function getResellerId(sucFn){
    putWithOutData('get-reseller',function(res){
        $('#loader-box').hide();
        console.log(res);
        if(res.status==1){
            localStorage.resellerId = res.data.list.reseller_id;
            sucFn();
        }
    });
}


//提示信息
function alertMsg(message,closeFn){
    layui.use('layer', function(){
        var layer1 = layui.layer;
        layer1.confirm(message, {
            title:'提示',
            area: '300px',
            //shadeClose: true,
            btn: '确认', //按钮
            end:closeFn
        });
    });
}
//询问框
function askBox(msg,btn1,btn2,btn1Fn,btn2Fn){
    layui.use('layer', function(){
        var layer2 = layui.layer;
        layer2.confirm(msg, {
            title:'提示',
            area: '300px',
            btn: [btn1,btn2] //按钮
        }, btn1Fn,btn2Fn)
    });
}
//打开页面
function openContent(title,content,closeFn){
    layui.config({
        skin: 'demo-class'
    });
    layui.use('layer', function(){
        var layer3 = layui.layer;
        layer3.open({
            skin: 'demo-class',
            type: 1,
            title:title,//标题
            area: '624px', //宽高
            content: content, //内容
            cancel:closeFn
        });
    });
}
//右下角消息推送
function messagePush(title,content){
    layui.config({
        skin: 'demo-class'
    });
    layui.use('layer', function(){
        var layer4 = layui.layer;
        layer4.open({
            skin: 'demo-class',
            type: 2,
            title:title,
            closeBtn: 1, //显示关闭按钮
            shade: 0,
            area: ['340px', '215px'],
            offset: 'rb', //右下角弹出
            time: 5000, //5秒后自动关闭
            anim: 2,
            content: content //iframe的url，no代表不显示滚动条
        });
    });
}
//引导提示信息
function promptBox(message,btn,sureFn,cancelFn){
    layui.use('layer', function(){
        var layer5 = layui.layer;
        layer5.confirm(message, {
            title:'提示',
            btn: btn , //按钮
            area: '300px',
            cancel: cancelFn
        }, sureFn);
    });
}
//登录注册成功提示层
function successLayer(msg,endFn){
    layui.config({
        skin: 'demo-class-msg'
    });
    layui.use('layer', function(){
        var layer6 = layui.layer;
        layer6.msg(msg,{
            skin: 'demo-class-msg',
            time:300,
            end:endFn
        });
    });
}
//tips层
function tipsShow(msg,target){
    layui.use('layer', function(){
        var layer7 = layui.layer;
        layer7.tips(msg, target,{
            time:1000,
            tips:[2,'#6cb873']
        });
    });
}


/**********时间选择框**********/
function dateSelect(){
    layui.use('laydate', function(){
        var laydate = layui.laydate;
        //开始和结束两个选择框
        var start = {
            format: 'YYYY-MM-DD hh:mm:ss'
            //,max: '2099-06-16 23:59:59'
            ,istime: true
            ,istoday: false
            ,choose: function(datas){
                end.min = datas; //开始日选好后，重置结束日的最小日期
                end.start = datas; //将结束日的初始值设定为开始日
            }
        };
        var end = {
            format: 'YYYY-MM-DD hh:mm:ss'
            //,max: '2099-06-16 23:59:59'
            ,istime: true
            ,istoday: false
            ,choose: function(datas){
                start.max = datas; //结束日选好后，重置开始日的最大日期
            }
        };
        $('#datetimepickerFrom').click(function(){
            start.elem = this;
            laydate(start);
        });
        $('#datetimepickerTo').click(function(){
            end.elem = this;
            laydate(end);
        });

        //单个选择框
        var time = {
            format: 'YYYY-MM-DD hh:mm:ss'
            ,istime: true
            ,istoday: false
        };
        $('#datetimepicker').click(function(){
            time.elem = this;
            laydate(time);
        });

        //年月日选择框
        var dateTime = {
            format: 'YYYY-MM-DD'
            ,istoday: false
        };
        $('#datepicker').click(function(){
            dateTime.elem = this;
            laydate(dateTime);
        });
    });
}

/**********分页**********/
function paginationShow(num,pageFn){
    layui.use('laypage', function(){
        var laypage = layui.laypage;
        laypage({
            cont: 'pagination'
            ,pages: num
            //,skip: true  //不显示跳到第几页
            //调用分页
            ,jump: pageFn
        });
    });
}

/**********客服系统LayChat云服务**********/
/*//var pgv_pvid = getCookie('PHPSESSID');
function layimSystem(){
    //获取客服列表
    putData('get-custom',{'reseller_id':parseInt(localStorage.resellerId)},function(res){
        $('#loader-box').hide();
        console.log(res);
        if(res.status==1){
            pgv_pvid = res.data.ip;
            var chatServicers = res.data.list;
            //如果登录 显示用户名
            if(pangu.myData.username && localStorage.token){
                pgv_pvid = pangu.myData.username;
                layimSystemConfig(chatServicers);
            }else{
                getUserInfo(function(){
                    pgv_pvid = pangu.myData.username;
                    layimSystemConfig(chatServicers);
                },function(){
                    //pgv_pvid = getCookie('PHPSESSID');
                    layimSystemConfig(chatServicers);
                });
            }
        }
    });

}

function layimSystemConfig(list){
    layui.use('layim', function(){
         var layim = layui.layim;
         //基础配置
             layim.config({
                 //brief: true //是否简约模式（如果true则不显示主面板）
                 init: {
                 mine: {
                 "username": pgv_pvid //我的昵称
                 ,"id": pgv_pvid //我的ID
                 ,"status": "online" //在线状态 online：在线、hide：隐身
                 ,"sign": "在深邃的编码世界，做一枚轻盈的纸飞机" //我的签名
                 ,"avatar": "http://www.qqtouxiang.com/d/file/nansheng/2016-12-30/ea31dbefa15cfb3060ad1381455f755f.jpg" //我的头像
                 }
                 } //获取主面板列表信息，下文会做进一步介绍

             });

             for(var c=0;c<list.length;c++){
                 layim.chat({
                     name: list[c].username
                     ,type: 'friend'
                     ,avatar: 'http://www.qqtouxiang.com/d/file/meinv/2016-11-21/4132ca331e437c340d835361ef419139.jpg'
                     ,id: list[c].username
                     ,sign:list[c].username
                 });
             }

             // layim.chat({
             //    name: '客服一'
             //    ,type: 'friend'
             //    ,avatar: 'http://www.qqtouxiang.com/d/file/meinv/2016-11-21/4132ca331e437c340d835361ef419139.jpg'
             //    ,id: '客服一'
             //    ,sign:'客服一'
             // });
             // layim.chat({
             //    name: '客服二'
             //    ,type: 'friend'
             //    ,avatar: 'http://www.qqtouxiang.com/d/file/meinv/2016-11-21/4132ca331e437c340d835361ef419139.jpg'
             //    ,id: '客服二'
             //    ,sign:'客服二'
             // });

        //layim.setChatMin(); //收缩聊天面板

    });


}

//如果没有用户id，获取用户id
function serviceSystem(){
    if(localStorage.resellerId){
        layimSystem();
    }else{
        getResellerId(function(){
            layimSystem();
        });
    }
}

if(getCookie('showChat')){
    laychat.setMin = true;
    //layim.setChatMin();
}*/


/**********form表单**********/
var form;
layui.use('form', function(){
    form = layui.form();
});


//表单获取焦点清空提示信息
function inputOnFocus(target,msgbx){
    target.focus(function(){
        msgbx.text('');
    });
}


/**********遮罩层**********/
var shadeBox = '<div id="shade"></div>';
$('body').append(shadeBox);


/**********无缝滚动**********/
function seamScrollLeft(target,speed){
    var scrollTimer = null,
        oldLeft = 0,
        newLeft = 0;
    function scrollLeftFn(){
        scrollTimer = setInterval(function(){
            var targetWidth =parseInt(target.css('width'));
            oldLeft = parseInt(target.css('left'));
            newLeft = oldLeft-speed;
            if(newLeft<-targetWidth){
                newLeft = 970;
            }
            target.css('left',newLeft+'px');
        },200);
    }
    scrollLeftFn();
    target.hover(function(){
        clearInterval(scrollTimer);
    },function(){
        scrollLeftFn();
    });
}

/**********单行文字向上滚动**********/
function autoScrollTop(obj){
    var ulHtml = $(obj).find("ul").html();
    $(obj).find("ul").html(ulHtml+ulHtml);

    var ulBox = $(obj).find("ul");
    var scrollTimer = null,
        ulTopVal= 0,
        ulHeight=parseInt(ulBox.height());
    function moveTop(){
        ulTopVal = parseInt(ulBox.css('top'));
        if(ulTopVal <= -ulHeight+25){
            ulBox.css('top','0px');
        }else{
            ulBox.animate({
                top:ulTopVal-25+'px'
            },500);
        }
    }
    function start(){
        scrollTimer = setInterval(moveTop,3000);
    }
    start();
    $(obj).hover(function(){
        clearInterval(scrollTimer);
    },function(){
        start();
    })
}


/**********左右漂浮广告*********/
function floatAd(target){
    $(document).scroll(function () {
        target.animate({'top': $(document).scrollTop() + window.innerHeight/2 - target.height()/2 },30);
    });
}


/**********公用函数**********/
//时间格式转换
function strToDate(birth){
    var oDate = birth.toString();
    return oDate.slice(0,4)+'/'+oDate.slice(4,6)+'/'+oDate.slice(6,8);
}

//QQ 手机号码  中间用***替代
function ellipsis(str){
    var oStr = str.toString();
    return oStr.slice(0,3)+'****'+oStr.slice(-2);
}
//邮箱  中间用***替代
function ellipsis1(email){
    var oEmail = email.toString();
    return oEmail.split('@')[0].slice(0,2)+'****@'+oEmail.split('@')[1];
}
//姓名  显示姓
function nameShow(name){
    var oName = name.toString();
    return oName.slice(0,1)+ new String('*',(oName.length-1));
}
//日期2017-01-04 08:14:03    显示01/04
function monthDayShow(dateTime){
    var oDateTime = dateTime.toString();
    var arr1 = oDateTime.split(' ')[0];
    var arr1_2 = arr1.split('-');
    return arr1_2[1]+'/'+arr1_2[2];
}

//得到事件
function getEvent(){
    if(window.event)    {return window.event;}
    func=getEvent.caller;
    while(func!=null){
        var arg0=func.arguments[0];
        if(arg0){
            if((arg0.constructor==Event || arg0.constructor ==MouseEvent
                || arg0.constructor==KeyboardEvent)
                ||(typeof(arg0)=="object" && arg0.preventDefault
                && arg0.stopPropagation)){
                return arg0;
            }
        }
        func=func.caller;
    }
    return null;
}
//阻止冒泡
function stopBubble() {
    var e=getEvent();
    if(window.event){
        //e.returnValue=false;//阻止自身行为
        e.cancelBubble=true;//阻止冒泡
    }else if(e.preventDefault){
        //e.preventDefault();//阻止自身行为
        e.stopPropagation();//阻止冒泡
    }
}

//补位函数
function twoNum(num){
    var newNum;
    if(num<10){
        newNum = '0'+num;
    } else{
        newNum = num;
    }
    return newNum;
}


