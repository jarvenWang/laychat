/**
 * LayChat云服务
 * laychat.workerman.net
 */
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
//var allcookies = document.cookie;
var pgv_pvid = getCookie('IpAddress');
alert(pgv_pvid);
// if(!pgv_pvid){
//     var timestamp = (new Date()).valueOf()+Math.random()*9999;
//     document.cookie="PHPSESSID="+timestamp;
// }


var WEB_SOCKET_SWF_LOCATION = "http://43.251.231.178:8086/static/swf/WebSocketMain.swf";
var WEB_SOCKET_DEBUG = true;
var WEB_SOCKET_SUPPRESS_CROSS_DOMAIN_SWF_ERROR = true;

var laychat = {
    appName           : 'LayChat',
    initUrl           : 'http://43.251.231.178:8086/init.php?PHPSESSID='+pgv_pvid,         // 初始化好友列表和群组接口，这个接口返回个json，格式见
    sendMessageUrl    : 'http://43.251.231.178:8086/send_message.php?PHPSESSID='+pgv_pvid, // 发消息接口
    membersUrl        : 'http://43.251.231.178:8086/members.php?PHPSESSID='+pgv_pvid,
    uploadImageUrl    : 'http://43.251.231.178:8086/upload_img.php?PHPSESSID='+pgv_pvid,
    uploadFileUrl     : 'http://43.251.231.178:8086/upload_file.php?PHPSESSID='+pgv_pvid,
    chatLogUrl        : 'http://43.251.231.178:8086/chat_log.php?PHPSESSID='+pgv_pvid,
    bindUrl           : 'http://43.251.231.178:8086/bind.php?PHPSESSID='+pgv_pvid,
    updateSignUrl     : 'http://43.251.231.178:8086/update_sign.php?PHPSESSID='+pgv_pvid,
    msgBoxUrl         : 'http://43.251.231.178:8086/msg_box.php?PHPSESSID='+pgv_pvid,
    agreeUrl          : 'http://43.251.231.178:8086/agree.php?PHPSESSID='+pgv_pvid,
    getNoticeUrl      : 'http://43.251.231.178:8086/get_notice.php?PHPSESSID='+pgv_pvid,
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
            console.info(e);
            var msg = JSON.parse(e.data);
            // 如果layim还没有初始化就收到消息则忽略（init消息除外）
            if(!msg.message_type || (msg.message_type != 'init' && !layui.layim)) return;
            switch(msg.message_type) {
                // 初始化im
                case 'init':
                    laychat.jq.post(laychat.bindUrl, {client_id: msg.client_id}, function(data){
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
        }
        laychat.socket.onclose = laychat.connectWorkerman;
    },
    sendHeartbeat : function() {
        if(this.socket && this.socket.readyState == 1) {
            this.socket.send(JSON.stringify({type :'ping'}));
        }
    },
    initIM : function(data){
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

                ,msgbox: laychat.msgBoxUrl+(laychat.msgBoxUrl.indexOf('?') == -1 ? '?' : '&')+'getNoticeUrl='+encodeURI(laychat.getNoticeUrl)+'&agreeUrl='+encodeURI(laychat.agreeUrl)

                //聊天记录地址
                ,chatLog: laychat.chatLogUrl

                ,find: laychat.findUrl

                ,copyright: false //是否授权

                ,title: laychat.appName

                ,min: laychat.setMin
            });

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