<?php
/**
 * 此接口用于返回某个群组成员信息
 * 数据格式见 http://www.layui.com/doc/modules/layim.html#members
 * laychat里面默认使用群组在线用户信息
 * 如果你的现有项目有群组数据，可以复用现有项目中国的数据
 *
 */
require_once __DIR__ . '/__init.php';
use Lib\Db;
_session_start();
if (!isset($_SESSION['laychat'])) {
    exit_json(array(
        'code' => 400,
        'msg'  => '请登录'
    ));
}

$db            = Db::instance('laychat');
$group_members = array();
$uid_array     = $db->select('uid')->from('group_members')->where('gid=:gid')->bindValue('gid', (int)$_GET['id'])->column();
if ($uid_array) {
    $group_members = $db->query("SELECT * FROM `user` WHERE uid IN ('" . implode("','", $uid_array) . "')");
}
$group_members = json_encode($group_members);
?>
{
  "code": 0
  ,"msg": ""
  ,"data": {
    "owner": {
      "username": "贤心"
      ,"id": "100001"
      ,"avatar": "http://tp1.sinaimg.cn/1571889140/180/40030060651/1"
      ,"sign": "这些都是测试数据，实际使用请严格按照该格式返回"
    }
    ,"list": <?php echo $group_members;?>
  }
}