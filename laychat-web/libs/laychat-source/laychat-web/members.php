<?php
require_once __DIR__ . '/__init.php';
_session_start();
if (!isset($_SESSION['laychat'])) {
    exit_json(array(
        'code' => 400,
        'msg'  => '请登录'
    ));
}

$online_group_members = Gateway::getClientSessionsByGroup($_GET['id']);
// 根据id去重
$all_list = array();
foreach($online_group_members as $info){
    $all_list[$info['id']] = $info;
}
$online_group_members = $all_list ? json_encode(array_values($all_list)) : '[]';
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
    ,"list": <?php echo $online_group_members;?>
  }
}