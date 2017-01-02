<?php
use \GatewayWorker\Lib\Gateway;
use \GatewayWorker\Lib\Db;

/**
 * 主逻辑
 * 主要是处理 onConnect onMessage onClose 三个方法
 * onConnect 和 onClose 如果不需要可以不用实现并删除
 */
class Events
{
   /**
    * 当客户端发来消息时触发
    * @param int $client_id 连接id
    * @param mixed $message 具体消息
    */
   public static function onMessage($client_id, $data) {
       $message = json_decode($data, true);
       $message_type = $message['type'];
       switch($message_type) {
           case 'init':
               // 通知当前客户端初始化
               $init_message = array(
                   'message_type' => 'init',
                   'client_id'    => $client_id,
               );
               Gateway::sendToClient($client_id, json_encode($init_message));
               return;
           case 'hide':
           case 'online':
               $status_message = array(
                   'message_type' => $message_type,
                   'id'           => $_SESSION['id'],
               );
               $_SESSION['online'] = $message_type;
               Gateway::sendToAll(json_encode($status_message));
               return;
           case 'ping':
               return;
           default:
               echo "unknown message $data";
       }
   }
   
   /**
    * 当用户断开连接时触发
    * @param int $client_id 连接id
    */
   public static function onClose() {
       // 有可能多页面登录，没有全部下线
       if (isset($_SESSION['id']) && !Gateway::isUidOnline($_SESSION['id'])) {
           $logout_message = array(
               'message_type' => 'logout',
               'id'           => $_SESSION['id']
           );
           Gateway::sendToAll(json_encode($logout_message));
           Db::instance('laychat')->update('user')->cols(array('logout_timestamp'=>time(), 'status'=>'offline'))->where('uid = :uid')
               ->bindValue('uid',$_SESSION['id'])->query();
       }
   }
}

