<?php
/**
 * 此接口返回的数据用于用户初始化聊天面板，
 * 格式参考 http://www.layui.com/doc/modules/layim.html#init
 *
 * 此接口返回一段json格式的数据，包括当前用户信息、当前用户的好友列表、当前用户加入的群组列表(这里写死的是101)
 *
 * 这里返回的用户信息包含了用户id，这个用户id一定要在bind.php利用Gateway::bindUid绑定，
 * 否则通过Gateway::sendToUid给这个uid发送的数据无法收到
 *
 * 这里面返回的群组信息中包含了群组id，群组id一定要在bind.php利用Gateway::joinGroup加入到群组，
 * 否则该用户无法收到这个群组的消息
 *
 */
use Lib\Db;
require_once __DIR__ . '/__init.php';
_session_start();
if (!isset($_SESSION['laychat'])) {
    if (!isset($_GET['PHPSESSID'])){
        exit_json(array(
            'code' => 400,
            'msg'  => '请登录'
        ));
    }else{
        $cook=$_GET['PHPSESSID'];
        $_SESSION['laychat']=array(
            'id'=>$cook,
            'username'=>$cook,
            'sign'=>'用户',
            'avatar'=>'http://www.qqtouxiang.com/d/file/nansheng/2016-12-30/ea31dbefa15cfb3060ad1381455f755f.jpg',
        );
    }

}



$db = Db::instance('laychat');

// 当前登录用户的id
$mime_id = $_SESSION['laychat']['id'];
// 登录者信息，这个session信息可以在你现有系统登录时设置，格式见login.php
$mime_info = $_SESSION['laychat'];
$mime_info['status'] = 'online';
$mime_info = json_encode($mime_info);
// 设置当前用户在线
$db->update('user')->col('status', 'online')->where('uid=:uid')->bindValue('uid', $mime_id)->limit(1)->query();

//if(isset($_GET['PHPSESSID'])){
//   eixt;
//}
// 读取好友列表数据
$friend_list = $db->query("SELECT `user`.uid as id, `user`.username, `user`.avatar, `user`.sign, `user`.status FROM `friends` LEFT JOIN `user` on `friends`.friend_uid=`user`.uid where friends.uid='$mime_id' order by status asc");
$friend_list = $friend_list ? $friend_list : array();
// 好友数量
$count = count($friend_list);
// 好友列表数据
$friend_list = json_encode(array_values($friend_list));

// 获取该用户加入的群组数据
$group_list = $db->query("SELECT `group`.gid AS id, `group`.groupname, `group`.avatar FROM `group_members` LEFT JOIN `group` on group_members.gid=`group`.gid WHERE uid='$mime_id'");
$group_list = $group_list ? json_encode($group_list) : '[]';
if (isset($_GET['PHPSESSID'])){
    return false;
}
?>
{
    "code": 0,
    "msg": "",
    "data": {
        "mine": <?php echo $mime_info;?>
        ,"friend": [{
            "groupname": "好友"
            ,"id": 1
            ,"online": <?php echo $count;?>
            ,"list": <?php echo $friend_list; ?>
        }]
        ,"group": <?php echo $group_list;?>
    }
}