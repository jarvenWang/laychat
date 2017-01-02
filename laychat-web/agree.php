<?php
/**
 * 同意好友申请或者加群申请
 */
use Lib\Db;

require_once __DIR__ . '/__init.php';
_session_start();

if (!isset($_SESSION['laychat'])) {
    exit_json(array(
        'code' => 400,
        'msg'  => '请登录'
    ));
}

// db实例
$db = Db::instance('laychat');

// 当前登录用户uid
$uid         = $_SESSION['laychat']['id'];
// agree/refuse 同意or拒绝
$result      = $_POST['result'];
// add_friend_group 表的主键id，用来从申请表add_friend_group中查找对应信息
$id          = (int)$_POST['id'];

try {
    // 查找申请表中记录是否存在
    $apply_info = $db->select('*')->from('add_friend_group')
        ->where('id=:id AND to_uid=:to_uid')
        ->bindValues(array(
            'id'       => $id,
            'to_uid'   => $uid
        ))->limit(1)->row();
    if (!$apply_info) {
        exit_json(array('code'=> 404, 'msg' => '记录不存在'));
    }

    // 类型 friend/group  好友申请/群组申请
    $type     = $apply_info['type'];
    // 群组id，群组申请时才有值
    $group_id = $apply_info['group_id'];
    // 发起者uid
    $from_uid = $apply_info['from_uid'];


    // 同意加好友
    if ($type === 'friend') {
        // 判断是否已经是好友
        $is_friend = $db->select('uid')->from('friends')
            ->where('uid=:uid AND friend_uid=:friend_uid')
            ->bindValues(array(
                'uid' => $uid,
                'friend_uid' => $from_uid
            ))->single();

        // 判断用户是否存在
        $user_info = $db->select('*')->from('user')
            ->where('uid=:uid')
            ->bindValue('uid', $from_uid)->limit(1)->row();
        if (!$user_info) {
            exit_json(array('code'=>404, 'msg'=>'用户不存在'));
        }

        // 同意好友申请
        if ($result === 'agree' && !$is_friend) {
            // 插入好友记录
            $db->insert('friends')->cols(array(
                'uid',
                'friend_uid'
            ))->bindValues(array(
                'uid' => $uid,
                'friend_uid' => $from_uid
            ))->query();
            // 双向好友，两条记录
            $db->insert('friends')->cols(array(
                'uid',
                'friend_uid'
            ))->bindValues(array(
                'uid' => $from_uid,
                'friend_uid' => $uid
            ))->query();
        }
    // 同意加群
    } elseif($type === 'group') {
        // 群是否存在
        $group_info = $db->select('*')->from('group')
            ->where('gid=:group_id AND creator=:creator')
            ->bindValues(array(
                'group_id' => $group_id,
                'creator'  => $uid
            ))->row();

        if (!$group_info) {
            exit_json(array('code'=>400, 'msg'=>'群组不存在'));
        }

        // 是否已经在群里
        $in_group = $db->select('uid')->from('group_members')
            ->where('uid=:uid AND gid=:gid')
            ->bindValues(array(
                'uid' => $from_uid,
                'gid' => $group_id
            ))->single();
        // 没在群里则群成员表增加一条记录
        if ($result === 'agree' && !$in_group) {
            // 加入群成员
            $db->insert('group_members')->cols(array(
                'gid',
                'uid'
            ))->bindValues(array(
                'gid' => $group_id,
                'uid' => $from_uid
            ))->query();
        }
    }
    $agree = $result === 'agree' ? 1 : 2;
    // 更改好友申请表对应记录
    $db->update('add_friend_group')->cols(array('agree' => $agree, 'time' => time()))
        ->where('id=:id AND from_uid=:from_uid AND to_uid=:to_uid')
        ->bindValues(array(
            'id'       => $id,
            'from_uid' => $from_uid,
            'to_uid'   => $uid
        ))
        ->query();
} catch (\Exception $e) {
    // mysql发生错误时
    return exit_json(array('code' => 500, 'msg' => $e->getMessage()));
}

// 给对方浏览器发送一个加好友操作，并发送系统消息提示
if ($type === 'friend' && !$is_friend) {
    // 通知对方客户端添加一个好友到面板
    $add_list_message = array('message_type'=>'addList', 'data'=>array(
        'type'     => 'friend',
        'username' => $_SESSION['laychat']['username'],
        'avatar'   => $_SESSION['laychat']['avatar'],
        'id'       => $uid,
        'sign'     => $_SESSION['laychat']['sign'],
        'groupid'  => 1 // 到默认分组1
    ));
    // 给对方客户端发消息，添加一个好友到面板
    Gateway::sendToUid($from_uid, json_encode($add_list_message));
    // 给对方发系统消息提示
    Gateway::sendToUid($from_uid, json_encode(array('message_type'=>'msgbox', 'count'=>'新消息')));

    // 通知自己的客户端添加一个好友到面板
    $add_list_message = array('message_type'=>'addList', 'data'=>array(
        'type'     => 'friend',
        'username' => $user_info['username'],
        'avatar'   => $user_info['avatar'],
        'id'       => $from_uid,
        'sign'     => $user_info['sign'],
        'groupid'  => 1 // 到默认分组1
    ));
    // 给对方客户端发消息，添加一个好友到面板
    Gateway::sendToUid($uid, json_encode($add_list_message));

// 给对方浏览器发送一个加群操作，并发送系统消息提示
} else if($type === 'group' && !$in_group) {
    // 通知客户端添加一个好友到面板
    $add_list_message = array('message_type'=>'addList', 'data'=>array(
        'type'     => 'group',
        'avatar'   => $group_info['avatar'],
        'groupname'=> $group_info['groupname'],
        'id'       => $group_id
    ));
    // 给对方客户端发消息，添加一个群组到面板
    Gateway::sendToUid($from_uid, json_encode($add_list_message));

    // 给对方发系统消息提示
    Gateway::sendToUid($from_uid, json_encode(array('message_type'=>'msgbox', 'count'=>'新消息')));

    // 获得对方uid的所有client_id，加入群组，这样就可以收到该群组的消息了
    $all_client_ids = Gateway::getClientIdByUid($from_uid);
    foreach($all_client_ids as $client_id) {
        Gateway::joinGroup($client_id, $group_id);
    }
}

exit_json(array('code'=>0));