<?php
/**
 *
 * 本接口用于将client_id与用户绑定(bindUid)，并加入特定的群组(joinGroup)
 * bindUid后就可以通过接口Gateway::sendToUid向uid发送数据(见send_message.php)
 * joinGroup后就可以收到对应群组的消息。用接口Gateway::sendToGroup向群组发送消息(见send_message.php)
 *
 * 本接口中写死了让所有用户加入101群组，101是随意定义的，你也可以定义成其它的值如 123、abc，
 * 如果你的现有系统有群组数据，可以使用你的群组数据。
 * 注意：加入的群组必须在init.php返回的json中有定义
 *
 */
use Lib\Db;

require_once __DIR__ . '/__init.php';
_session_start();
if(!isset($_SESSION['laychat'])){
    $cook=$_GET['PHPSESSID'];
    $_SESSION['laychat']=array(
        'id'=>$cook,
        'username'=>$cook,
        'sign'=>'用户',
        'avatar'=>'http://www.qqtouxiang.com/d/file/nansheng/2016-12-30/ea31dbefa15cfb3060ad1381455f755f.jpg',
    );

    $db = Db::instance('laychat');
    $res = $db->query("select * from `user` where uid ='$cook'");
    if(!$res){
        $db->insert('user')->cols(array(
            'uid',
            'username',
            'sign',
            'avatar',
            'reg_timestamp',
            'status',
        ))->bindValues(array(
            'uid'=>$cook,
            'username'=>$cook,
            'sign'=>'用户',
            'avatar'=>'http://www.qqtouxiang.com/d/file/nansheng/2016-12-30/ea31dbefa15cfb3060ad1381455f755f.jpg',
            'reg_timestamp'=>time(),
            'status'=>'online'
        ))->query();
    }
}



// 此session是在用户登录时设置的
if (!isset($_SESSION['laychat'])) {
    exit_json(array(
        'code'=> '400',
        'msg' => '请登录2',
    ));
}

// 要求post一个client_id
if (empty($_POST)) {
    exit_json(array(
        'code'=> '400',
        'msg' => '缺少参数',
    ));
}

// 放入临时变量方便使用
$laychat_session = $_SESSION['laychat'];

// 用户id 用户名 个性签名 头像等信息
$id        = $laychat_session['id'];
$username  = $laychat_session['username'];
$sign      = $laychat_session['sign'];
$avatar    = $laychat_session['avatar'];

// 获得要绑定的client_id，每个client_id对应一个socket链接
$client_id = $_POST['client_id'];

// 将client_id与uid绑定，通过Gateway::sendToUid给这个uid发消息(在send_message.php中有调用)
Gateway::bindUid($client_id, $id);
// 给client_id设置Gateway的session，方便通过Gateway::getClientSessionsByGroup获得某个群组所有在线用户信息(id 名字 头像等)
Gateway::updateSession($client_id, $laychat_session);

// 获取用户所在群组id
$db             = Db::instance('laychat');
$group_id_array = $db->select('gid')->from('group_members')->where('uid=:uid')->bindValue('uid',$id)->column();
if ($group_id_array) {
    foreach ($group_id_array as $gid) {
        // 让当前客户端加入群组
        Gateway::joinGroup($client_id, $gid);
    }
}

$_SESSION['laychat']['client_id']  = $client_id;

// 从数据库中读取这个uid用户的上次退出时间，通过与message表中的时间字段对比，得到这个用户的离线消息
$user_timestamp = $db->select(array('logout_timestamp', 'notice_read_timestamp'))->from('user')->where('uid = :uid')->bindValue('uid', $id)->limit(1)->row();

$unread_notice_count = 0;

// 这个用户没有退出时间
if ($user_timestamp) {
    $logout_timestamp      = $user_timestamp['logout_timestamp'];
    $notice_read_timestamp = $user_timestamp['notice_read_timestamp'];
    $groups = $group_id_array ? "'".implode("','", $group_id_array)."'" : -1;
    // 用户有退出时间，则查询message数据库，找出这个用户的所有时间大于$logout_timestamp的消息，这些消息是离线消息
    $unread_message = $db->select('data')->from('message')->where(array("(`to` = :to OR `to` in ($groups))", 'timestamp>' . $logout_timestamp))->bindValue('to', $id)->limit(500)->column();
    // 读取完毕后更新logout_timestamp，避免多页面时重复提示离线消息
    $db->update('user')->col('logout_timestamp', time())->where('uid = :uid')->bindValue('uid', $id)->limit(1)->query();

    // 获得消息盒子未读计数
    $unread_notice_count = $db->select('count(1)')
        ->from('add_friend_group')
        ->where('((to_uid=:to_uid AND `agree`=0) OR (from_uid=:from_uid AND `agree`>0)) AND time>:time')
        ->bindValues(array(
            'to_uid'   => $id,
            'from_uid' => $id,
            'time'     => $notice_read_timestamp
        ))->single();
}
if(empty($unread_message)) {
    $unread_message = array();
}

// 通知所有客户端当前用户上线
$online_message = array(
    'message_type' => 'online',
    'id'           => $id
);
Gateway::sendToAll(json_encode($online_message));

// 返回json数据
exit_json(array('code'=>0, 'unread_message' => $unread_message, 'unread_notice_count' => $unread_notice_count ? '新消息' : 0));