<?php
use Lib\Db;
use Lib\GatewayApi;

require_once __DIR__ . '/__init.php';
_session_start();

if (empty($_POST)) {
    exit_json(array(
        'code'=> '400',
        'msg' => '缺少参数',
    ));
}

$id        = $_POST['id'];
$username  = htmlspecialchars($_POST['username']);
$sign      = $_POST['sign'];
$avatar    = $_POST['avatar'];

// 设置个laychat的session
$_SESSION['laychat'] = array(
    'id'       => $id,
    'username' => $username,
    'sign'     => $sign,
    'avatar'   => $avatar
);

exit_json(array('code'=>0));