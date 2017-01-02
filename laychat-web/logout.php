<?php
/**
 * 此登录接口目的就是设置session
 * 实际项目中可以直接复用已有登录逻辑，在已有的登录逻辑中加个session即可。
 * 复用现有项目的登录逻辑，则这个文件可以删掉。
 *
$_SESSION['laychat'] = array(
'id'       => $id,
'username' => $username,
'sign'     => $sign,
'avatar'   => $avatar
);
 *
 */
use Lib\Db;

require_once __DIR__ . '/__init.php';
_session_start();

unset($_SESSION['laychat']);
_header('Location: ./index.php');