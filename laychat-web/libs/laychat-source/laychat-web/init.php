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

$mime_id = $_SESSION['laychat']['id'];
// 获取所有在线链接的session
$all_online_list = Gateway::getAllClientSessions();

// 根据id去重
$all_list = array();
foreach($all_online_list as $info){
    if (empty($info['id']) || $info['username'] === '未登录') {
        continue;
    }
    $info['status']        = 'online';
    $all_list[$info['id']] = $info;
}
$db = Db::instance('laychat');
$some_users = $db->select('*')->from('user')->limit(200)->query();
if ($some_users) {
    foreach($some_users as $info) {
        if (!isset($all_list[$info['uid']])) {
            $all_list[$info['uid']] = array(
                'id'       => $info['uid'],
                'avatar'   => $info['avatar'],
                'username' => $info['username'],
                'sign'     => $info['sign'],
                'status'   => 'hide'
            );
        }
    }
}

// 自己的信息
$mime_info = $_SESSION['laychat'];
$mime_info['status'] = 'online';
unset($all_list[$mime_id]);
$mime_info = json_encode($mime_info);
// 在线数
$count = count($all_list);
// 在线列表
$all_online_list = json_encode(array_values($all_list));
?>
{
    "code": 0,
    "msg": "",
    "data": {
        "mine": <?php echo $mime_info;?>
        ,"friend": [{
            "groupname": "workerman 好友"
            ,"id": 1
            ,"online": <?php echo $count;?>
            ,"list": <?php echo $all_online_list; ?>
        }]
        ,"group": [{
            "groupname": "workerman 官方群"
            ,"id": "101"
            ,"avatar": "http://www.workerman.net/img/workerman_logo.png"
        }]
    }
}
