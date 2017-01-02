<?php
/**
 * 通知弹窗显示页面
 * 此文件是各种项目通用的，一般不需要更改即可使用。
 *
 */
use Lib\Db;
require_once __DIR__ . '/__init.php';
_session_start();

$db = Db::instance('laychat');

// 当前登录用户uid
$uid = $_SESSION['laychat']['id'];

// 获取好友申请群组申请等通知的url
$get_notice_url = urldecode($_GET['getNoticeUrl']);

// 同意/拒绝好友申请群组申请的url
$agree_url = urldecode($_GET['agreeUrl']);

// 设置消息盒子读取时间戳
$db->update('user')->col('reg_timestamp', time())->where('uid=:uid')->bindValue('uid', $uid)->query();

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>消息盒子</title>

    <link rel="stylesheet" href="/laychat-web/static/layui/css/layui.css">
    <style>
        .layim-msgbox{margin: 15px;}
        .layim-msgbox li{position: relative; margin-bottom: 10px; padding: 0 130px 10px 60px; padding-bottom: 10px; line-height: 22px; border-bottom: 1px dotted #e2e2e2;}
        .layim-msgbox .layim-msgbox-tips{margin: 0; padding: 10px 0; border: none; text-align: center; color: #999;}
        .layim-msgbox .layim-msgbox-system{padding: 0 10px 10px 10px;}
        .layim-msgbox li p span{padding-left: 5px; color: #999;}
        .layim-msgbox li p em{font-style: normal; color: #FF5722;}

        .layim-msgbox-avatar{position: absolute; left: 0; top: 0; width: 50px; height: 50px;}
        .layim-msgbox-user{padding-top: 5px;}
        .layim-msgbox-content{margin-top: 3px;}
        .layim-msgbox .layui-btn-small{padding: 0 15px; margin-left: 5px;}
        .layim-msgbox-btn{position: absolute; right: 0; top: 12px; color: #999;}
    </style>
</head>
<body>

<ul class="layim-msgbox" id="LAY_view"></ul>

<textarea title="消息模版" id="LAY_tpl" style="display:none;">
{{# layui.each(d.data, function(index, item){
  if(item.from){ }}
    <li data-uid="{{ item.from }}" data-groupid="{{ item.group_id }}" data-id="{{ item.id }}" data-type="{{ item.type }}">
        <a href="/u/{{ item.from }}/" target="_blank">
            <img src="{{ item.user.avatar }}" class="layui-circle layim-msgbox-avatar">
        </a>
        <p class="layim-msgbox-user">
            <a href="/u/{{ item.from }}/" target="_blank">{{ item.user.username||'' }}</a>
            <span>{{ item.time }}</span>
        </p>
        <p class="layim-msgbox-content">
            {{ item.content }}
            <span>{{ item.remark ? '附言: '+item.remark : '' }}</span>
        </p>
        <p class="layim-msgbox-btn">
            {{# if(!item.agree){ }}
                <button class="layui-btn layui-btn-small" data-type="agree">同意</button>
                <button class="layui-btn layui-btn-small layui-btn-primary" data-type="refuse">拒绝</button>
            {{# } else if(item.agree == 1) { }}
                已同意
            {{# } else { }}
                <em>已拒绝</em>
            {{# } }}
        </p>
    </li>
  {{# } else { }}
    <li class="layim-msgbox-system">
        <p><em>系统：</em>{{ item.content }}<span>{{ item.time }}</span></p>
    </li>
  {{# }
}); }}
</textarea>


<script src="./static/layui/layui.js"></script>
<script>
    layui.use(['layim', 'flow'], function(){
        var layim = layui.layim
            ,layer = layui.layer
            ,laytpl = layui.laytpl
            ,$ = layui.jquery
            ,flow = layui.flow;

        var cache = {}; //用于临时记录请求到的数据

        //请求消息
        var renderMsg = function(page, callback){

            $.get('<?php echo $get_notice_url;?>', {
                page: page || 1
            }, function(res){

                res = JSON.parse(res);

                if(res.code != 0){
                    return layer.msg(res.msg);
                }

                //记录来源用户信息
                layui.each(res.data, function(index, item){
                    cache[item.from] = item.user;
                });

                callback && callback(res.data, res.pages);
            });
        };

        //消息信息流
        flow.load({
            elem: '#LAY_view' //流加载容器
            ,done: function(page, next){ //加载下一页
                renderMsg(page, function(data, pages){
                    var html = laytpl(LAY_tpl.value).render({
                        data: data
                        ,page: page
                    });
                    next(html, page < pages);
                });
            }
        });

        //操作
        var active = {
            //同意
            agree: function(othis){
                var li = othis.parents('li')
                    ,uid = li.data('uid')
                    ,group_id = li.data('groupid')
                    ,id = li.data('id')
                    ,type = li.data('type')
                    ,user = cache[uid];

                //选择分组
                parent.layui.layim.setFriendGroup({
                    type: type
                    ,username: user.username
                    ,avatar: user.avatar
                    ,group: parent.layui.layim.cache().friend //获取好友分组数据
                    ,submit: function(group, index){

                        // 同意，向后台发送请求处理
                         $.post('<?php echo $agree_url;?>', {
                             uid: uid //对方用户ID
                             ,group_id: group_id //群组
                             ,group: group //我设定的好友分组
                             ,result: 'agree'
                             ,id: id
                             ,type : type

                         }, function(res){
                             res = JSON.parse(res);
                             if(res.code != 0) {
                                 return layer.msg(res.msg);
                             }

                             parent.layer.close(index);
                             othis.parent().html('已同意');
                         });
                    }
                });
            }

            //拒绝
            ,refuse: function(othis){
                var li = othis.parents('li')
                    ,uid = li.data('uid')
                    ,id = li.data('id');

                layer.confirm('确定拒绝吗？', function(index){
                    $.post('<?php echo $agree_url;?>', {
                        uid: uid //对方用户ID
                        ,id: id
                        ,result:'refuse'
                    }, function(res){
                        res = JSON.parse(res);
                        if(res.code != 0){
                            return layer.msg(res.msg);
                        }
                        layer.close(index);
                        othis.parent().html('<em>已拒绝</em>');
                    });
                });
            }
        };

        $('body').on('click', '.layui-btn', function(){
            var othis = $(this), type = othis.data('type');
            active[type] ? active[type].call(this, othis) : '';
        });
    });
</script>
</body>
</html>