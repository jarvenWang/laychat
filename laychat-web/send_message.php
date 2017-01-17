<?php
/**
 * 发送消息，消息可能是群消息或者私聊(好友)消息
 * 这里的逻辑已经写好是通用的业务逻辑，一般来说开发者不用关心
 * 格式参见 http://www.layui.com/doc/modules/layim.html#on 里的sendMessage事件
 */
use Lib\Db;
require_once __DIR__ . '/__init.php';
_session_start();
//{"username":"9563062630","avatar":"http:\/\/www.qqtouxiang.com\/d\/file\/nansheng\/2016-12-30\/ea31dbefa15cfb3060ad1381455f755f.jpg","id":"9563062630","type":"friend","content":"face[\u6655] ","timestamp":1483344589000,"from_id":"9563062630"}
if (!isset($_SESSION['laychat'])) {
    $cook=$_GET['IpAddress'];
    $db = Db::instance('laychat');

    $res = $db->query("select * from `user` where uid ='$cook'");
    $_SESSION['laychat'] = array(
        'id'       => $res[0]['uid'],
        'username' => $res[0]['username'],
        'sign'     => $res[0]['sign'],
        'avatar'   => $res[0]['avatar'],
    );
}
if (!isset($_SESSION['laychat'])) {
    exit_json(array(
        'code' => 400,
        'msg'  => '请登录'
    ));
}

// 聊天数据
$data = $_POST['data'];
// 发送者，也就是当前登录用户的id
$from = $_SESSION['laychat']['id'];
// 发送给谁
$to   = $data['to']['id'];
// 类型，私聊(friend)还是群组(group)
$type = $data['to']['type'];


// 消息格式
$message_data = array(
    'username' => $_SESSION['laychat']['username'],
    'avatar'   => $_SESSION['laychat']['avatar'],
    'id'       => $type === 'friend' ? $from : $to,
    'type'     => $type,
    'content'  => htmlspecialchars($data['mine']['content']),
    'timestamp'=> time()*1000,
    'from_id'  => $from,
);
//print_r($message_data);exit;
$chat_message = array(
    'message_type' => 'chatMessage',
    'data' => $message_data
);

// 根据类型走不同的接口发送
switch ($type) {
    // 私聊
    case 'friend':
        Gateway::sendToUid($to, json_encode($chat_message));
        break;
    // 群聊
    case 'group':
        Gateway::sendToGroup($to, json_encode($chat_message), $_SESSION['laychat']['client_id']);
        break;
}

// 记录消息到message表
$db = Db::instance('laychat');
$last_insert_id = $db->insert('message')->cols(array(
    'from'      => $from,
    'to'        => $to,
    'data'      => json_encode($message_data),
    'timestamp' => time(),
    'type'      => $type,
))->query();

// 返回json
$code = $last_insert_id ? 0 : 500;
exit_json(array('code'=>$code));


