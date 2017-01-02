<?php
/**
 * 创建群组接口
 */
use Lib\Db;

require_once __DIR__ . '/__init.php';
_session_start();

if (!isset($_SESSION['laychat'])) {
    exit_json(array(
        'code' => 400,
        'msg'  => 'login please'
    ));
}

// 当前登录者的uid
$uid = $_SESSION['laychat']['id'];

// 有POST数据
if ($_POST) {
    // db
    $db = Db::instance('laychat');
    // friend/group 好友/群组
    $group_name = htmlspecialchars($_POST['groupname']);
    // 群组图标
    $avatar = htmlspecialchars($_POST['avatar']);
    // 创建者
    $creator = $_SESSION['laychat']['id'];
    // 群组表插入一条记录
    $gid = $db->insert('group')
        ->cols(array('groupname', 'avatar', 'creator', 'timestamp'))
        ->bindValues(array(
            'groupname' => $group_name,
            'avatar'    => $avatar,
            'creator'   => $creator,
            'timestamp' => time()
        ))->query();
    // 群组成员插入自己
    $db->insert('group_members')->cols(array(
        'gid',
        'uid'
    ))->bindValues(array(
        'gid' => $gid,
        'uid' => $uid
    ))->query();

    // 给自己浏览器发个操作请求，添加一个群组
    $add_list_message = array('message_type'=>'addList', 'data'=>array(
        'type'     => 'group',
        'avatar'   => $avatar,
        'groupname'=> $group_name,
        'id'       => $gid
    ));
    // 添加一个群组到面板
    Gateway::sendToUid($uid, json_encode($add_list_message));

    // 获得该用户所有client_id，加入群组，这样就可以收到该群组的消息了
    $all_client_ids = Gateway::getClientIdByUid($uid);
    foreach($all_client_ids as $client_id) {
        Gateway::joinGroup($client_id, $gid);
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>群组创建页面</title>
    <link rel="stylesheet" href="./static/css/base.css?v1">
    <script src="./static/js/jquery.min.js"></script>
    <style>
        html{background-color: #D9D9D9;line-height: 180%}

    </style>
</head>
<body>

<div class="main-box">
    <div class="desc">
        <h2>LayChat创建群组</h2>

        <?php if(empty($_POST)) {?>
            <div>
                <form method="post">
                    群组名：<input type="text" id="groupname" name="groupname"><br><br>
                    群图标：<input type="text" id="avatar" name="avatar"><br><br>
                    <input type="submit" type="button" value="创建" ">
                </form>
            </div>
        <?php } else {?>
            <b>创建群组成功</b><br>
            群图标：<img src="<?php echo $avatar;?>" style="width:60px"><br>
            群名称：<?php echo $group_name;?>
        <?php }?>
</body>
</html>