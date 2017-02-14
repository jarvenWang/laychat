<?php
require_once __DIR__ . '/__init.php';
_session_start();
if (!isset($_SESSION['laychat'])) {
    exit_json(array(
        'code' => 400,
        'msg'  => '请登录'
    ));
}

$code = 0;
$upload_img_path = $file_name = $msg = "";
if (empty($_FILES)) {
    $code = 400;
    $msg = "没找到文件";
} else {
    $file_name = PHP_SAPI === 'cli' ? $_FILES[0]['file_name'] : $_FILES['file']['name'];
    $extension_name = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    $upload_img_path = '/static/upload/files/'.bin2hex(pack('N', time()).pack('n', rand(1,65535))).'.'.$extension_name;
    $forbidden_ext_names = array('php', 'php5', 'app', 'jsp', 'html', 'htm');
    if (in_array($extension_name, $forbidden_ext_names)) {
        $code = 401;
        $msg = "上传文件非法";
    } else {
        // workerman的webserver上传
        if (PHP_SAPI === 'cli') {
            if (!file_put_contents(__DIR__ . $upload_img_path ,$_FILES[0]['file_data'])) {
                $code = 500;
                $msg = "保存文件失败";
            }
        // apache或者php-fpm
        } elseif (!move_uploaded_file($_FILES['file']['tmp_name'], __DIR__ . $upload_img_path)) {
            $code = 500;
            $msg = "保存文件失败";
        }
    }
}
$scheme = empty($_SERVER['HTTPS']) ? 'http://' : 'https://';
$src = $scheme.$_SERVER['HTTP_HOST'].$upload_img_path;
?>
{
    "code": <?php echo $code;?>
    ,"msg": "<?php echo $msg;?>"
    ,"data": {
        "src": "<?php echo $src?>"
        ,"name": "<?php echo $file_name;?>"
    }
}
