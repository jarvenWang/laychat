<?php
/**
 * 添加好友申请或者群组申请接口
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

// db
$db           = Db::instance('laychat');
// friend/group 好友/群组
$type         = $_POST['type'];

// 发送者，也就是当前登录用户的id
$uid          = $_SESSION['laychat']['id'];
// 用户id
$to_uid       = $_POST['uid'];
$to_username  = '';

// 附言
$remark       = htmlspecialchars($_POST['remark']);
// 申请的群id
$group_id     = $_POST['group_id'];
$group_name   = '';

// 不能自己加自己
if($type == 'friend' && $to_uid == $uid) {
    exit_json(array('code'=>400, 'msg'=>'不能加自己为好友'));
}

try {
    // 查找好友用户的名字或者群组所有者的名字
    $to_username = $db->select('username')
        ->from('user')->where('uid=:uid')
        ->bindValue('uid', $to_uid)->limit(1)->single();
    if (false === $to_username) {
        exit_json(array('code'=>404, 'msg'=>'用户不存在'));
    }

    // 如果是加群
    if ($type == 'group') {
        // 判断群组是否存在
        $group_name = $db->select('groupname')
            ->from('group')->where('creator=:uid AND gid=:gid'
            )->bindValues(array(
                'uid' => $to_uid,
                'gid' => $group_id
            ))->limit(1)->single();
        if (false === $group_name) {
            exit_json(array('code'=>404, 'msg'=>'群组不存在'));
        }
        // 判断是否已经是群成员
        $in_group = $db->select('uid')->from('group_members')
            ->where('uid=:uid AND gid=:gid')
            ->bindValues(array(
                'uid' => $uid,
                'gid' => $group_id
            ))->single();
        if ($in_group) {
            exit_json(array('code' => '400', 'msg' => '您已经是该群的成员'));
        }
    } else {
        // 判断是否已经是好友
        if ($db->select('uid')->from('friends')
            ->where('uid=:uid AND friend_uid=:friend_uid')
            ->bindValues(array(
                'uid' => $uid,
                'friend_uid' => $to_uid
            ))->single()
        ) {
            return exit_json(array('code' => 501, 'msg' => '已经是好友'));
        }
    }

    // 如果有一样的未处理的申请记录，则更新那条记录的时间戳，不重复添加申请记录
    $update_ret = $db->update('add_friend_group')
        ->cols(array(
            'time' => time(),
            'remark' => $remark)
        )->where('from_uid=:from_uid AND to_uid=:to_uid AND group_id=:group_id AND type=:type AND agree=0')
        ->bindValues(array(
            'from_uid' => $uid,
            'to_uid'   => $to_uid,
            'group_id' => $group_id,
            'type'     => $type
        ))->query();

    // 如果没有一样的未处理的申请记录，则插入一条申请记录
    if(!$update_ret) {
        $db->insert('add_friend_group')->cols(array(
            'from_uid',
            'to_uid',
            'to_username',
            'group_id',
            'group_name',
            'type',
            'remark',
            'agree',
            'time',
            'user'
        ))->bindValues(array(
            'from_uid'    => $uid,
            'to_uid'      => $to_uid,
            'to_username' => $to_username,
            'group_id'    => $group_id,
            'group_name'  => $group_name,
            'type'        => $type,
            'remark'      => $remark,
            'agree'       => 0,
            'time'        => time(),
            'user'        => json_encode($_SESSION['laychat'])
        ))->query();
    }
} catch (\Exception $e) {
    return exit_json(array('code'=>500, 'msg'=>$e->getMessage()));
}

// 提示新消息
Gateway::sendToUid($to_uid, json_encode(array('message_type'=>'msgbox', 'count'=>'新消息')));

exit_json(array('code'=>0));