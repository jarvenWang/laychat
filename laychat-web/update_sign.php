<?php
/**
 * 此接口用来设置用户个性签名
 */
use Lib\Db;

require_once __DIR__ . '/__init.php';
_session_start();

// 判断用户是否设置过laychat的session
if (!isset($_SESSION['laychat'])) {
    exit_json(array(
        'code' => 400,
        'msg'  => '请登录'
    ));
}

// 判断是否传来sign个性签名
if (!isset($_POST['sign'])) {
    exit_json(array(
        'code'=> '400',
        'msg' => '缺少参数',
    ));
}

// 用户id
$id = $_SESSION['laychat']['id'];
// 个性签名
$sign   = htmlspecialchars($_POST['sign']);

$_SESSION['laychat']['sign'] = $sign;

$result = Db::instance('laychat')->update('user')->col('sign', $sign)->where('uid = :uid')->bindValue('uid', $id)->limit(1)->query();

$client_id_array = Gateway::getClientIdByUid($id);

exit_json(array('code'=>0));