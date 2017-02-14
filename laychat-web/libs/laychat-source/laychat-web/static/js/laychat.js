/**
 * LayChat云服务
 * laychat.workerman.net
 */

var WEB_SOCKET_SWF_LOCATION = "http://s.workerman.net/dz/swf/WebSocketMain.swf";
var WEB_SOCKET_DEBUG = true;
var WEB_SOCKET_SUPPRESS_CROSS_DOMAIN_SWF_ERROR = true;

var laychat = {
    appName           : 'LayChat',
    initUrl           : './init.php',         // 初始化好友列表和群组接口，这个接口返回个json，格式见
    sendMessageUrl    : './send_message.php', // 发消息接口
    membersUrl        : './members.php',
    uploadImageUrl    : './upload_img.php',
    uploadFileUrl     : './upload_file.php',
    chatLogUrl        : './chat_log.php',
    bindUrl           : './bind.php',
    address           : 'ws://'+document.domain+':8282',
    setMin            : false,
    findUrl           : false,
    userInfo          : null,
    inited            : false,
    socket            : null,
    jq                : null,
    open              : function() {
        if(this.isIE6or7()) return;
        if(!this.jq) this.jq = jQuery.noConflict();
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
            var msg = JSON.parse(e.data);
            switch(msg.message_type) {
                // 初始化im
                case 'init':
                    laychat.jq.post(laychat.bindUrl, {client_id: msg.client_id}, function(data){
                        if(data.code == 0) {
                            laychat.initIM(data.unread_message);
                        } else {
                            console.log('laychat服务端返回失败：' + data.msg);
                        }
                    }, 'json');
                    return;
                // 添加一个用户到好友列表
                case 'addList':
                    if(laychat.jq('#layim-friend'+msg.data.id).length == 0 && laychat.userInfo && laychat.userInfo['id'] != msg.data.id){
                        return layui.layim.addList(msg.data);
                    }
                    laychat.changeOnlineStatus(msg.data.id, 'online');
                    return;
                // 收到一个消息
                case 'chatMessage':
                    if(msg.data.type == 'group')
                    {
                        if(msg.data.from_id != laychat.userInfo.id){
                            layui.layim.getMessage(msg.data);
                        }
                    }else if(laychat.userInfo.id != msg.data.id){
                        layui.layim.getMessage(msg.data);
                    }
                    return;
                // 退出
                case 'logout':
                // 隐身
                case 'hide':
                // 上线
                case 'online':
                    var status = msg.message_type;
                    laychat.changeOnlineStatus(msg.id, status);
                    return;
            }
        }
        laychat.socket.onclose = laychat.connectWorkerman;
    },
    sendHeartbeat : function() {
        if(this.socket && this.socket.readyState == 1) {
            this.socket.send(JSON.stringify({type :'ping'}));
        }
    },
    changeOnlineStatus : function(id, status){
        if (status == 'hide' || status == 'logout') {
            return laychat.jq('#layim-friend'+id+' img').css({
                "-webkit-filter": "grayscale(100%)",
                "-moz-filter": "grayscale(100%)",
                "-ms-filter": "grayscale(100%)",
                "-o-filter": "grayscale(100%)",
                "filter": "grayscale(100%)",
                "filter": "gray"
            });
        }
        laychat.jq('#layim-friend'+id+' img').removeAttr('style');
    },
    initIM : function(unread_message){
        if(this.inited) {
            // 离线消息
            for(var key in unread_message){
                layui.layim.getMessage(JSON.parse(unread_message[key]));
            }
            return;
        }
        this.inited = true;
        setInterval('laychat.sendHeartbeat()', 20000);
        layui.use('layim', function(layim){
            layim.config({
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

                //聊天记录地址
                ,chatLog: laychat.chatLogUrl

                ,find: laychat.findUrl

                ,copyright: false //是否授权

                ,title: laychat.appName

                ,min: laychat.setMin
            });

            //监听发送消息
            layim.on('sendMessage', function(data){
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

            //layim建立就绪
            layim.on('ready', function(res){
                laychat.userInfo = layim.cache().mine;
                // 离线消息
                for(var key in unread_message){
                    layim.getMessage(JSON.parse(unread_message[key]));
                }
                // 将不在线的置为下线
                var friend_list = res.friend[0].list;
                for(var key in friend_list) {
                    var user_id = friend_list[key].id;
                    laychat.changeOnlineStatus(user_id, friend_list[key]['status']);
                }
            });
        });
    }
};