<?php
/**
 * 从add_friend_group表中读取消息，在消息盒子中展示
 *
 */
use Lib\Db;
require_once __DIR__ . '/__init.php';
_session_start();

// 判断是否初始化了laychat的session
if (!isset($_SESSION['laychat'])) {
    exit_json(array(
        'code' => 400,
        'msg'  => '请登录'
    ));
}

// 每页10条记录
$page_size = 10;

// 第几页
$page      = isset($_GET['page']) ? (int)$_GET['page'] : 1;

// 起始偏移
$start     = ($page - 1) * $page_size;

// 当前登录用户uid
$uid = $_SESSION['laychat']['id'];

// 数据库实例
$db = Db::instance('laychat');

try {
    // 读取对应页的数据
    $notice_data = $db->query("SELECT id, from_uid as `from`, to_uid, to_username, group_id, group_name, `type`, remark, agree, `time`, user
FROM  add_friend_group WHERE `to_uid`='$uid' OR (`from_uid`='$uid' AND `agree`>0) ORDER BY `time` DESC limit $start,$page_size");

    // 计算总条数
    $total_count = $db->single("SELECT COUNT(1)
FROM  add_friend_group WHERE `to_uid`='$uid' OR (`from_uid`='$uid' AND `agree`>0)");

    // 计算总页数
    $total_page = ceil($total_count/$page_size);

} catch (\Exception $e) {
    exit_json(array(
        'code' => 500,
        'msg'  => $e->getMessage()
    ));
}

// 格式化数据，方便在消息盒子中展示
if($notice_data) {
    foreach($notice_data as $k=>$v) {
        $notice_data[$k]['agree'] = (int)$v['agree'];
        if ($v['to_uid'] == $uid) {
            if ($v['type'] == 'group') {
                $notice_data[$k]['content'] = '申请加入群 '.$v['group_name'];
            } else {
                $notice_data[$k]['content'] = '申请添加你为好友';
            }
        } else {
            if ($v['agree'] > 0) {
                $result = $v['agree'] == 1 ? '同意' : '<em>拒绝</em>';
                if ($v['type'] == 'group') {
                    $notice_data[$k]['content'] = "群 {$v['group_name']} 管理员{$result}了你的加群请求";
                } else {
                    $notice_data[$k]['content'] = "{$v['to_username']} {$result}了你的好友申请";
                }
                unset($notice_data[$k]['from']);
            } else {
                unset($notice_data[$k]);
            }
        }
        $notice_data[$k]['time'] = format_time($v['time']);
        $notice_data[$k]['user'] = json_decode($v['user'], true);
    }
}

exit_json(array(
    'code' => 0,
    'pages' => $total_page,
    'data' => $notice_data
));