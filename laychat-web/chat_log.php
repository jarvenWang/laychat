<?php
/**
 * 从message表中查询历史消息记录
 * 此文件是各种项目通用的，一般不需要更改即可使用。
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

// 对方的id，可能是uid，也可能是群组id
$id   = $_GET['id'];
// 起始消息id
$hid  = isset($_GET['hid']) ? (int)$_GET['hid'] : PHP_INT_MAX;
// 消息类型，如果好友或者群组消息（两种消息共用message表）
$type = isset($_GET['type']) ? $_GET['type'] : 'friend';
// 查看类型，是上一页还是下一页
$view_type = isset($_GET['view_type']) ? $_GET['view_type'] : 'prev';
// 根据消息类型设置查询语句的运算符
$operator = $view_type === 'prev' ? '<' : '>';
// 根据消息类型设置查询语句的排序方式
$order_by_asc = $view_type === 'prev' ? false : true;
// 每页20条数据
$limit = 20;
// 是否有上一页
$has_prev = false;
// 是否有下一页
$has_next = false;
if($view_type === 'prev') {
    if (isset($_GET['hid'])) {
        $has_next = true;
    }
} else {
    $has_prev = true;
}

// 获得本接口url地址，用于拼接上一页 下一页链接的url
$pos = strpos($_SERVER['REQUEST_URI'], '?');
$chat_log_url = $pos ? substr($_SERVER['REQUEST_URI'], 0, $pos) : $_SERVER['REQUEST_URI'];

// 用来存储历史消息数据
$history = array();

// 数据库
$db = Db::instance('laychat');

// 如果是查询好友历史消息(查询limit+1条，用来判断上一页或者下一页是否有数据，从而决定是否显示上一页 下一页)
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
// 查询群组历史消息
} else {
    $history_data = $db->select('`data`,`hid`')->from('message')->where("`to` = :group_id AND hid $operator $hid")
        ->orderByAsc(array('hid'), $order_by_asc)->bindValue('group_id', $id)->limit($limit+1)->query();
}

// 有历史消息的话
if ($history_data) {
    // 如果是上一页，则需要反转下数组顺序
    if ($view_type === 'prev') {
        $history_data = array_reverse($history_data);
    }

    // 数据条数大于limit
    if (count($history_data) > $limit) {
        // 说明上一页还有数据，显示上一页的链接
        if ($view_type === 'prev') {
            $has_prev = true;
            unset($history_data[0]);
        // 说明下一页还有数据，显示下一页的链接
        } else {
            $has_next = true;
            unset($history_data[$limit]);
        }
    }

    // reset将数组当前指针重置到第一条消息，找到本次消息数据中首尾消息id，用来方便下次上一页下一页查找
    reset($history_data);
    $first = current($history_data);
    $head_hid = $first['hid'];
    $last = end($history_data);
    $end_hid = $last['hid'];
    // 格式化数据
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
    <link rel="stylesheet" href="/laychat-web/static/layui/css/layui.css">
    <link rel="stylesheet" href="/laychat-web/static/css/base.css">
    <script src="/laychat-web/static/js/jquery.min.js"></script>
    <script src="/laychat-web/static/layui/layui.js"></script>
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
<style>
    body{overflow-x: hidden}
    .layui-layer {
        text-align: left;
    }
    .layim-chat {
        display: block;
    }
</style>
</body>


