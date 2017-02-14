<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>LayChat PHP聊天室源码 WebIM源码</title>
    <meta property="qc:admins" content="26422222473014677235251666547" />
    <link rel="stylesheet" href="static/layui/css/layui.css">
    <link rel="stylesheet" href="./static/css/base.css?v1">
    <script src="static/layui/layui.js?v2"></script>
    <script src="./static/js/json2.js"></script>
    <script src="./static/js/swfobject.js"></script>
    <script src="./static/js/web_socket.js"></script>
    <script src="./static/js/jquery.min.js"></script>
    <script src="./static/js/laychat.js"></script>
    <style>
        html{background-color: #D9D9D9;}
    </style>
</head>
<body>

<script type="text/javascript"
        src="http://qzonestyle.gtimg.cn/qzone/openapi/qc_loader.js"
        data-appid="101265487"
        data-redirecturi="http://laychat.workerman.net/qq_login.php"
        charset="utf-8">
</script>

<div class="main-box">
    <div class="desc">
        <h2>LayChat 聊天室</h2>
        <p class="content">
            <a href="http://layim.layui.com/" target="_blank">LayIM官方</a>
            与
            <a href="http://www.workerman.net" target="_blank">workerman官方</a>
            联合出品
        </p>
        <p>
            <a href="http://laychat.workerman.net/discuz/">Discuz插件版本</a> <a href="http://kf.workerman.net/">LayLive客服版</a>
        </p>
        <p class="qq_login">
            <span id="qqLoginBtn"></span>
        </p>
        <p class="qq_login">
            支持群聊、私聊、发表情、发图片、发文件、历史消息、<br>
            离线消息、消息提醒、在线状态设置、好友分组展示、换肤<br>
            兼容除IE6/7以外的所有浏览器<br>
            后端基于workerman开发，支持万人在线，支持分布式部署<br>
            消息存储为MySQL<br>
        </p>
    </div>

    <div class="auth-title">
        <fieldset><legend>获得授权</legend></fieldset>
    </div>
    <div class="auth-box">
        LayChat是WebIM的快速部署接入的解决方案，企业经过简单的操作即可接入自己的系统。
        LayChat致力于通过即时交互，拉近客户之间的距离。
        您可以通过授权的方式获得LayChat所有源码，一次授权终身有效。
        目前LayChat授权价格为2000人民币，授权内容包括LayIM源码授权及LayChat后端源码授权。
    </div>

    <div class="pay-box">
        <div class="item">
            <img src="http://www.workerman.net/img/alipay.png?123">
        </div>
        <div class="item">
            <img src="http://www.workerman.net/img/weixin.jpg">
        </div>
    </div>
    <div class="pay-desc">
        选择上面任意账号付款，付款后请发送邮件到 walkor@workerman.net，或者联系QQ:2202055656即可得到全部源码。<br>
        <b>注意事项：</b>您可以使用LayChat到任意平台，但不可二次包装出售。
    </div>
</div>


<script type="text/javascript">
    // QQ互联
    userinfo = {};
    QC.Login({
       btnId:"qqLoginBtn",    
       scope:"get_user_info",
       size: "A_L"
    }, function(reqData, opts){//登录成功
       QC.Login.getMe(function(openId, accessToken){
           // 这里是登录，设置session部分，如果
           userinfo['id'] = openId;
           userinfo['avatar'] = reqData.figureurl_qq_2;
           userinfo['sign']   = reqData.gender;
           userinfo['username'] = reqData.nickname;
           login(userinfo);


           laychat.address = 'ws://'+document.domain+':8282';
           laychat.open();
           var dom = document.getElementById(opts['btnId']),
           _logoutTemplate=[
               //头像
               '<span><img src="{figureurl}" class="logout_icon"/></span>',
               //昵称
               '<span>{nickname}</span>',
               //退出
               '<span><a href="javascript:QC.Login.signOut();">退出</a></span>'
           ].join("");
           dom && (dom.innerHTML = QC.String.format(_logoutTemplate, {
               nickname : QC.String.escHTML(reqData.nickname), //做xss过滤
               figureurl : reqData.figureurl_qq_1
           }));
       });
    }, function(opts){//注销成功
       location.reload();
    }
  );



function login(userinfo) {
    $.post("./login.php", userinfo, function(data){
        if(data.code == 0) {
            // 登录成功
        } else {
            alert(data.msg);
        }
    }, 'json');
}

</script>

<script>
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?d9e4e5b54dcf0b187e9333c041789810";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
</script>

</body>
</html>
