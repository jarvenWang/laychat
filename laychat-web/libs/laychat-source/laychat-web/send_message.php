<?php
use Lib\Db;
require_once __DIR__ . '/__init.php';
_session_start();
if (!isset($_SESSION['laychat'])) {
    exit_json(array(
        'code' => 400,
        'msg'  => '请登录'
    ));
}

$data = $_POST['data'];
$from = $_SESSION['laychat']['id'];
$to   = $data['to']['id'];
$type = $data['to']['type'];

$message_data = array(
    'username' => $_SESSION['laychat']['username'],
    'avatar'   => $_SESSION['laychat']['avatar'],
    'id'       => $type === 'friend' ? $from : $to,
    'type'     => $type,
    'content'  => htmlspecialchars($data['mine']['content']),
    'timestamp'=> time()*1000,
    'from_id'  => $from,
);

$chat_message = array(
    'message_type' => 'chatMessage',
    'data' => $message_data
);

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

$db = Db::instance('laychat');
$last_insert_id = $db->insert('message')->cols(array(
    'from'      => $from,
    'to'        => $to,
    'data'      => json_encode($message_data),
    'timestamp' => time(),
    'type'      => $type,
))->query();

$code = $last_insert_id ? 0 : 500;
exit_json(array('code'=>$code));


