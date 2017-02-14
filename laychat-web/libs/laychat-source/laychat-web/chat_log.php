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

$id = $_GET['id'];
$hid = isset($_GET['hid']) ? (int)$_GET['hid'] : PHP_INT_MAX;
$type = isset($_GET['type']) ? $_GET['type'] : 'friend';
$view_type = isset($_GET['view_type']) ? $_GET['view_type'] : 'prev';
$operator = $view_type === 'prev' ? '<' : '>';
$order_by_asc = $view_type === 'prev' ? false : true;
$limit = 20;
$has_prev = false;
$has_next = false;
if($view_type === 'prev') {
    if (isset($_GET['hid'])) {
        $has_next = true;
    }
} else {
    $has_prev = true;
}

$pos = strpos($_SERVER['REQUEST_URI'], '?');
$chat_log_url = $pos ? substr($_SERVER['REQUEST_URI'], 0, $pos) : $_SERVER['REQUEST_URI'];

$history = array();

$db = Db::instance('laychat');

if ($type == 'friend') {
    $history_data = $db->select('`data`,`hid`')->from('message')->where(array(
        '((`to` = :to_me AND `from` = :from_him) OR (`to` = :to_him AND `from` = :from_me))',
        "hid $operator $hid"
    ))->orderByAsc(array('hid'), $order_by_asc)->bindValues(array(
        'to_me'    => $_SESSION['laychat']['id'],
        'from_him' => $id,
        'to_him'   => $id,
        'from_me'  => $_SESSION['laychat']['id']
    ))->limit($limit+1)->query();
} else {
    $history_data = $db->select('`data`,`hid`')->from('message')->where("`to` = :group_id AND hid $operator $hid")
        ->orderByAsc(array('hid'), $order_by_asc)->bindValue('group_id', $id)->limit($limit+1)->query();
}

if ($history_data) {
    if ($view_type === 'prev') {
        $history_data = array_reverse($history_data);
    }
    if (count($history_data) > $limit) {
        if ($view_type === 'prev') {
            $has_prev = true;
            unset($history_data[0]);
        } else {
            $has_next = true;
            unset($history_data[$limit]);
        }
    }

    reset($history_data);
    $first = current($history_data);
    $head_hid = $first['hid'];
    $last = end($history_data);
    $end_hid = $last['hid'];
    foreach ($history_data as $item) {
        $history[] = $item['data'];
    }
}
?>


<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>laychat聊天历史记录</title>
    <meta property="qc:admins" content="26422222473014677235251666547" />
    <link rel="stylesheet" href="static/layui/css/layui.css">
    <link rel="stylesheet" href="./static/css/base.css">
    <script src="./static/js/jquery.min.js"></script>
    <script src="static/layui/layui.js"></script>
    <style>
        body{overflow-x: hidden}
        .layui-layer {
            text-align: left;
        }
    </style>
</head>
<body>
<script>
    layui.use(['layim','laydate'], function(){
        var layim = layui.layim
            laydate = layui.laydate;
        var data = <?php echo json_encode($history);?>;
        var html = '';
        for(var key in data){
            var item = JSON.parse(data[key]);
            var sendtime = laydate.now(item.timestamp, "YYYY-MM-DD hh:mm:ss");
            html += '<li><div class="layim-chat-user"><img src="'+item.avatar+'"><cite>'+item.username+'<i>'+sendtime+'</i></cite></div><div class="layim-chat-text">'+layim.content(item.content)+'</div></li>';
        }
        $(".layim-chat-main ul").append(html);
    });
</script>
<div class="layim-chat layim-chat-friend">
    <div class="layim-chat-main" style="width:70%; height:100%">
        <ul>

        </ul>
    </div>
    <div class="history-page">
        <?php if($has_prev) {?>
            <a href="<?php echo $chat_log_url;?>?hid=<?php echo $head_hid;?>&view_type=prev&id=<?php echo $id;?>&type=<?php echo $type;?>">上一页</a>
        <?php } elseif($has_next) {?>
            上一页
        <?php }?>
        <?php if($has_next) {?>
            <a href="<?php echo $chat_log_url;?>?hid=<?php echo $end_hid;?>&view_type=next&id=<?php echo $id;?>&type=<?php echo $type;?>">下一页</a>
        <?php } elseif($has_prev) {?>
            下一页
        <?php }?>
    </div>
</div>
</body>


