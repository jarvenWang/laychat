<?php
use Lib\Db;
use Lib\GatewayApi;

require_once __DIR__ . '/__init.php';
_session_start();

if (!isset($_SESSION['laychat'])) {
    exit_json(array(
        'code'=> '400',
        'msg' => '请登录',
    ));
}

if (empty($_POST)) {
    exit_json(array(
        'code'=> '400',
        'msg' => '缺少参数',
    ));
}

$laychat_session = $_SESSION['laychat'];

$id        = $laychat_session['id'];
$username  = $laychat_session['username'];
$sign      = $laychat_session['sign'];
$avatar    = $laychat_session['avatar'];
$client_id = $_POST['client_id'];

// 将client_id与uid绑定
Gateway::bindUid($client_id, $id);
// 给client_id设置Gateway的session
Gateway::updateSession($client_id, $laychat_session);
// 让当前客户端加入群组101
Gateway::joinGroup($client_id, 101);

$_SESSION['laychat']['client_id']  = $client_id;

// 通知所有客户端添加一个好友到面板，如果已经存在，则会设置为上线
$reg_message = array('message_type'=>'addList', 'data'=>array(
    'type'     => 'friend',
    'username' => $username,
    'avatar'   => $avatar,
    'id'       => $id,
    'sign'     => $sign,
    'groupid'  => 1
));
Gateway::sendToAll(json_encode($reg_message), null, $client_id);

$db = Db::instance('laychat');
$logout_timestamp = $db->select('logout_timestamp')->from('user')->where('uid = :uid')->bindValue('uid', $id)->limit(1)->single();

if (!$logout_timestamp) {
    $timestamp = time();
    $db->insert('user')->cols(array(
        'uid',
        'username',
        'sign',
        'sex',
        'avatar',
        'reg_timestamp',
        'logout_timestamp',
    ))->bindValues(array(
        'uid'              => $id,
        'username'         => $username,
        'sign'             => $sign,
        'sex'              => $sign,
        'avatar'           => $avatar,
        'reg_timestamp'    => date('Y-m-d H:i:s'),
        'logout_timestamp' => $timestamp,
    ))->query();
} else {
    $unread_message = $db->select('data')->from('message')->where(array('(`to` = :to OR `to` = 101)', 'timestamp>' . $logout_timestamp))->bindValue('to', $id)->limit(500)->column();
    $db->update('user')->col('logout_timestamp', time())->where('uid = :uid')->bindValue('uid', $id)->limit(1)->query();
}
if(empty($unread_message)) {
    $unread_message = array();
}

exit_json(array('code'=>0, 'unread_message' => $unread_message));