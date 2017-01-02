<?php
/**
 * 此登录接口目的就是设置session
 * 实际项目中可以直接复用已有登录逻辑，在已有的登录逻辑中加个session即可。
 * 复用现有项目的登录逻辑，则这个文件可以删掉。
 *
$_SESSION['laychat'] = array(
'id'       => $id,
'username' => $username,
'sign'     => $sign,
'avatar'   => $avatar
);
 *
 */
use Lib\Db;

require_once __DIR__ . '/__init.php';
_session_start();

if (empty($_POST)) {
    exit_json(array(
        'code'=> '400',
        'msg' => '缺少参数',
    ));
}

$db = Db::instance('laychat');

// 用户id
$id        = $_POST['id'];
// 名字
$username  = htmlspecialchars($_POST['username']);

// 头像
$avatar    = $_POST['avatar'];

// 个性签名
$user_info = $db->select('*')->from('user')->where('uid = :uid')->bindValue('uid', $id)->limit(1)->row();
$sign      = $user_info ? $user_info['sign'] : $_POST['sign'];

/*
 * 为了方便演示
 * 如果没有用户信息就给用户表插入一条,
 * 并随机分配一些好友
 * 如果你的系统有自己的注册逻辑，这里的代码可以删掉
 */
if (!$user_info) {
    $timestamp = time();
    $db->insert('user')->cols(array(
        'uid',
        'username',
        'sign',
        'sex',
        'avatar',
        'logout_timestamp',
        'reg_timestamp',
    ))->bindValues(array(
        'uid'              => $id,
        'username'         => $username,
        'sign'             => $sign,
        'sex'              => '男',// 男或者女
        'avatar'           => $avatar,
        'logout_timestamp' => $timestamp,
        'reg_timestamp'    => time(),
    ))->query();

    /*
    // 随机分配一些好友。
    $some_user_id = $db->select('uid')->from('user')->orderByASC(array('logout_timestamp'), false)->limit(5)->column();
    if ($some_user_id) {
        $values = array();
        foreach($some_user_id as $uid) {
            if ($uid === $id) continue;
            $values[] = "('$id', '$uid'), ('$uid', '$id')";
        }
        $db->query('insert into friends (uid, friend_uid) values'.implode(',', $values));
    }

    // 为了方便测试，所有用户固定加入群组1
    $db->insert('group_members')->cols(array(
        'gid',
        'uid'
    ))->bindValues(array(
        'gid' => 1,
        'uid' => $id
    ))->query();
    */
}

// ＝＝＝＝这个接口主最终目的就是设置这个session＝＝＝＝
$_SESSION['laychat'] = array(
    'id'       => $id,
    'username' => $username,
    'sign'     => $sign,
    'avatar'   => $avatar
);
print_r($_SESSION);exit;
exit_json(array('code'=>0));