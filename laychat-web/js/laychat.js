/**
 * Created by Administrator on 2017/2/7.
 */
/**
 * LayChat云服务
 * laychat.workerman.net
 */
var pgv_pvid;
var pgv_pvid_username;
var laychat = {};
var local = 'http://43.251.231.178:8086';//http://43.251.231.178:8086
//var local = 'http://43.251.231.178:8086';//http://i.project.com:999

/*getUserInfo(function(){
    pgv_pvid = pangu.myData.username;
    layChatFn();
},function(){
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
});*/
/*if(!pgv_pvid){
    var timestamp = (new Date()).valueOf()+Math.random()*9999;
    document.cookie="PHPSESSID="+timestamp;
}else{
    pgv_pvid = getCookie('PHPSESSID');
}*/

var WEB_SOCKET_SWF_LOCATION = local+"/static/swf/WebSocketMain.swf";
var WEB_SOCKET_DEBUG = true;
var WEB_SOCKET_SUPPRESS_CROSS_DOMAIN_SWF_ERROR = true;

function layChatFn(){
    laychat = {
        appName           : 'LayChat',
        initUrl           : local+'/init.php?PHPSESSID='+pgv_pvid,         // 初始化好友列表和群组接口，这个接口返回个json，格式见
        sendMessageUrl    : local+'/send_message.php?PHPSESSID='+pgv_pvid, // 发消息接口
        membersUrl        : local+'/members.php?PHPSESSID='+pgv_pvid,
        uploadImageUrl    : local+'/upload_img.php?PHPSESSID='+pgv_pvid,
        uploadFileUrl     : local+'/upload_file.php?PHPSESSID='+pgv_pvid,
        chatLogUrl        : local+'/chat_log.php?PHPSESSID='+pgv_pvid,
        bindUrl           : local+'/bind.php?PHPSESSID='+pgv_pvid,
        updateSignUrl     : local+'/update_sign.php?PHPSESSID='+pgv_pvid,
        msgBoxUrl         : local+'/msg_box.php?PHPSESSID='+pgv_pvid,
        agreeUrl          : local+'/agree.php?PHPSESSID='+pgv_pvid,
        getNoticeUrl      : local+'/get_notice.php?PHPSESSID='+pgv_pvid,
        address           : 'ws://'+document.domain+':8282',
        setMin            : false,
        findUrl           : false,
        userInfo          : null,
        inited            : false,
        socket            : null,
        jq                : null,
        open              : function() {
            if(this.isIE6or7()) return;
            if(!this.jq) this.jq = $;
            this.connectWorkerman();
        },
        isIE6or7 : function(){
            var b = document.createElement('b');
            b.innerHTML = '<!--[if IE 5]><i></i><![endif]--><!--[if IE 6]><i></i><![endif]--><!--[if IE 7]><i></i><![endif]-->';
            return b.getElementsByTagName('i').length === 1;
        },
        connectWorkerman : function() {
            laychat.socket        = new WebSocket(laychat.address);
            laychat.socket.onopen = function(){
                laychat.socket.send(JSON.stringify({type: 'init'}));
            };

            laychat.socket.onmessage = function(e){
                //console.info(e);
                var msg = JSON.parse(e.data);
                // 如果layim还没有初始化就收到消息则忽略（init消息除外）
                if(!msg.message_type || (msg.message_type != 'init' && !layui.layim)) return;
                switch(msg.message_type) {
                    // 初始化im
                    case 'init':
                        laychat.jq.post(laychat.bindUrl, {client_id: msg.client_id}, function(data){
                            console.log(data);
                            if(data.code == 0) {
                                laychat.initIM(data);
                            } else {
                                alert('laychat服务端返回失败：' + data.msg);
                            }
                        }, 'json');
                        return;
                    // 添加一个用户到好友列表
                    case 'addList':
                        if(laychat.jq('#layim-friend'+msg.data.id).length == 0 && laychat.userInfo && laychat.userInfo['id'] != msg.data.id){
                            return layui.layim.addList(msg.data);
                        }
                        if (msg.data.type == 'friend') {
                            layui.layim.setFriendStatus(msg.data.id, 'online');
                        }
                        return;
                    // 收到一个消息
                    case 'chatMessage':
                        if(msg.data.type == 'group') {
                            if(msg.data.from_id != laychat.userInfo.id){
                                layui.layim.getMessage(msg.data);
                            }
                        }else if(laychat.userInfo.id != msg.data.id){
                            if(laychat.userInfo.id==undefined){
                                laychat.userInfo.id= getCookie('PHPSESSID');
                            }

                            layui.layim.getMessage(msg.data);
                        }
                        return;
                    case 'msgbox':
                        layui.layim.msgbox(msg.count);
                        return;
                    // 退出
                    case 'logout':
                    // 隐身
                    case 'hide':
                        return layui.layim.setFriendStatus(msg.id, 'offline');
                    // 上线
                    case 'online':
                        return layui.layim.setFriendStatus(msg.id, 'online');
                }
            };
            laychat.socket.onclose = laychat.connectWorkerman;
        },
        sendHeartbeat : function() {
            if(this.socket && this.socket.readyState == 1) {
                this.socket.send(JSON.stringify({type :'ping'}));
            }
        },
        initIM : function(data){
            console.log(data);
            var unread_msg_tips = function(data){
                // 离线消息
                for(var key in data.unread_message){
                    layui.layim.getMessage(JSON.parse(data.unread_message[key]));
                }
                if (data.unread_notice_count) {
                    // 设置消息盒子未读计数
                    layui.layim.msgbox(data.unread_notice_count);
                }
                return;
            };
            // layim已经初始化了，则只提示未读消息
            if(this.inited) {
                return unread_msg_tips(data);
            }
            this.inited = true;
            // 心跳数据，用来保持长链接，避免socket链接长时间不通讯被路由节点防火墙关闭
            setInterval('laychat.sendHeartbeat()', 12000);

            layui.use('layim', function(layim){
               /* layim.config({
                    //初始化接口
                    init: {
                        url: laychat.initUrl
                    }

                    //查看群员接口
                    ,members: {
                        url: laychat.membersUrl
                    }

                    // 上传图片
                    ,uploadImage: {
                        url: laychat.uploadImageUrl
                    }

                    // 上传文件
                    ,uploadFile: {
                        url: laychat.uploadFileUrl
                    }

                    ,msgbox: laychat.msgBoxUrl+(laychat.msgBoxUrl.indexOf('?') == -1 ? '?' : '&')+'getNoticeUrl='+encodeURI(laychat.getNoticeUrl)+'&agreeUrl='+encodeURI(laychat.agreeUrl)

                    //聊天记录地址
                    ,chatLog: laychat.chatLogUrl

                    ,find: laychat.findUrl

                    ,copyright: false //是否授权

                    ,title: laychat.appName  //自定义主面板最小化时的标题

                    ,min: laychat.setMin //是否始终最小化主面板，默认false

                });*/

                //监听发送消息
                layim.on('sendMessage', function(data){
                    console.info(data);
                    laychat.jq.post(laychat.sendMessageUrl, { data: data} , function(data){
                        if(data.code != 0) {
                            layui.layer.msg(data.msg, {time: 7000});
                        }
                    }, 'json');
                });

                //监听在线状态的切换事件
                layim.on('online', function(data){
                    laychat.socket.send(JSON.stringify({type: data}));
                });

                //更改个性签名
                layim.on('sign', function(value){
                    laychat.jq.post(laychat.updateSignUrl, {sign: value} , function(data){
                        if(data.code != 0) {
                            layui.layer.msg(data.msg, {time: 7000});
                        }
                    }, 'json');
                });

                //layim建立就绪
                layim.on('ready', function(res){
                    laychat.userInfo = layim.cache().mine;
                    // 离线消息
                    return unread_msg_tips(data);
                });

            });
        }
    };

    //如果登录 显示用户名
    laychat.open();
}

/****客服系统****/
//var pgv_pvid = getCookie('PHPSESSID');
//获取客服列表
function layimSystem(){
    putData('get-custom',{'reseller_id':parseInt(localStorage.resellerId)},function(res){
        $('#loader-box').hide();
        console.log(res);
        if(res.status==1){
            setCookie('showChat',1);
            var chatServicers = res.data.list;
            //如果登录 显示用户名
            if(pangu.myData.username && localStorage.token){
                pgv_pvid = pangu.myData.username;
                pgv_pvid_username = pangu.myData.username;
                layimSystemConfig(chatServicers);
            }else{
                getUserInfo(function(){
                    pgv_pvid = pangu.myData.username;
                    pgv_pvid_username = pangu.myData.username;
                    layimSystemConfig(chatServicers);
                },function(){
                    pgv_pvid_username = '访客';
                    if(localStorage.ip){
                        pgv_pvid = localStorage.ip;
                        layimSystemConfig(chatServicers);
                    }else{
                        getData('website-status',function(res){
                            $('#loader-box').hide();
                            if(res.status==1){
                                localStorage.ip = res.data.ip;
                                pgv_pvid = localStorage.ip;
                                layimSystemConfig(chatServicers);
                            }
                        });
                    }
                });
            }

        }
    });

}
//客服系统配置
function layimSystemConfig(list){
    layui.use('layim', function(){
        var layim = layui.layim;
        //基础配置
        layim.config({
            init: {
                mine: {
                    "username": pgv_pvid_username //我的昵称
                    ,"id": pgv_pvid //我的ID
                    ,"status": "online" //在线状态 online：在线、hide：隐身
                    ,"sign": "在深邃的编码世界，做一枚轻盈的纸飞机" //我的签名
                    ,"avatar": "http://www.qqtouxiang.com/d/file/nansheng/2016-12-30/ea31dbefa15cfb3060ad1381455f755f.jpg" //我的头像
                }
            }
            ,brief: true //是否简约模式（若开启则不显示主面板）
            //,right: '100px' //主面板相对浏览器右侧距离
            //,minRight: '90px' //聊天面板最小化时相对浏览器右侧距离
            //,initSkin: '3.jpg' //1-5 设置初始背景
            //,skin: ['aaa.jpg'] //新增皮肤
            //,isfriend: false //是否开启好友
            //,isgroup: false //是否开启群组
            ,notice: true //是否开启桌面消息提醒，默认false
            //,voice: false //声音提醒，默认开启，声音文件为：default.wav

            // 上传图片
            ,uploadImage: {
                url: laychat.uploadImageUrl
            }

            // 上传文件
            ,uploadFile: {
                url: laychat.uploadFileUrl
            }

            ,msgbox: laychat.msgBoxUrl+(laychat.msgBoxUrl.indexOf('?') == -1 ? '?' : '&')+'getNoticeUrl='+encodeURI(laychat.getNoticeUrl)+'&agreeUrl='+encodeURI(laychat.agreeUrl)

            //聊天记录地址
            ,chatLog: laychat.chatLogUrl

            ,find: laychat.findUrl

            ,copyright: false //是否授权

            ,title: laychat.appName  //自定义主面板最小化时的标题

            ,min: laychat.setMin //是否始终最小化主面板，默认false

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
     });
}
//如果没有用户id，获取用户id
function serviceSystem(){
    console.log(pgv_pvid);
    if(localStorage.resellerId){
        layimSystem();
    }else{
        getResellerId(function(){
            layimSystem();
        });
    }
}

/****客服系统缩小版****/
/*//获取客服列表
function layimSystemMin(){
    putData('get-custom',{'reseller_id':parseInt(localStorage.resellerId)},function(res){
        $('#loader-box').hide();
        console.log(res);
        if(res.status==1){
            setCookie('showChat',1);
            var chatServicers = res.data.list;
            //如果登录 显示用户名
            getUserInfo(function(){
                pgv_pvid = pangu.myData.username;
                layimSystemConfigMin(chatServicers);
            },function(){
                if(localStorage.ip){
                    pgv_pvid = localStorage.ip;
                    layimSystemConfigMin(chatServicers);
                }else{
                    getData('website-status',function(res){
                        $('#loader-box').hide();
                        if(res.status==1){
                            localStorage.ip = res.data.ip;
                            pgv_pvid = localStorage.ip;
                            layimSystemConfigMin(chatServicers);
                        }
                    });
                }
            });
        }
    });

}
//客服系统配置
function layimSystemConfigMin(list){
    layui.use('layim', function(){
         var layim = layui.layim;
         //基础配置
        layim.config({
            init: {
                mine: {
                    "username": pgv_pvid //我的昵称
                    ,"id": pgv_pvid //我的ID
                    ,"status": "online" //在线状态 online：在线、hide：隐身
                    ,"sign": "在深邃的编码世界，做一枚轻盈的纸飞机" //我的签名
                    ,"avatar": "http://www.qqtouxiang.com/d/file/nansheng/2016-12-30/ea31dbefa15cfb3060ad1381455f755f.jpg" //我的头像
                }
            }
            ,brief: true //是否简约模式（若开启则不显示主面板）
            //,right: '100px' //主面板相对浏览器右侧距离
            //,minRight: '90px' //聊天面板最小化时相对浏览器右侧距离
            //,initSkin: '3.jpg' //1-5 设置初始背景
            //,skin: ['aaa.jpg'] //新增皮肤
            //,isfriend: false //是否开启好友
            //,isgroup: false //是否开启群组
            //,notice: true //是否开启桌面消息提醒，默认false
            //,voice: false //声音提醒，默认开启，声音文件为：default.wav
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

        layim.setChatMin();

     });


}
//如果没有用户id，获取用户id
function serviceSystemMin(){
    console.log(pgv_pvid);
    if(localStorage.resellerId){
        layimSystemMin();
    }else{
        getResellerId(function(){
            layimSystemMin();
        });
    }
}

if(getCookie('showChat')){
    serviceSystemMin();
}*/
