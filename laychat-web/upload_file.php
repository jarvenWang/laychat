<?php
/**
 * 上传文件接口。通用的接口，开发者不用关注
 * 返回数据格式参见 http://www.layui.com/doc/modules/layim.html#uploadFile
 */
date_default_timezone_set('PRC');
header('Access-Control-Allow-Origin:*');
header("Access-Control-Allow-Methods: POST, GET");
require_once __DIR__ . '/__init.php';
_session_start();
if (!isset($_SESSION['laychat'])) {
    exit_json(array(
        'code' => 400,
        'msg'  => '请登录'
    ));
}

// 返回码，用来通知前端成功还是失败
$code = 0;
// 上传路径 文件名 错误信息(如果有的话)
$upload_img_path = $file_name = $msg = "";
// 没找到文件
if (empty($_FILES)) {
    $code = 400;
    $msg = "没找到文件";
} else {
    // 如果是workerman运行的webserver，则使用$_FILES[0]['file_name']作为文件名，apache/php-fpm是用$_FILES['file']['name']。
    $file_name = PHP_SAPI === 'cli' ? $_FILES[0]['file_name'] : $_FILES['file']['name'];
    // 获得后缀名
    $extension_name = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    // 计算上传路径
    $upload_img_path = '/static/upload/files/'.bin2hex(pack('N', time()).pack('n', rand(1,65535))).'.'.$extension_name;
    // 为了安全，禁止这些文件上传
    $forbidden_ext_names = array('php', 'php5', 'app', 'jsp', 'html', 'htm');
    // 检查文件后缀是否属于禁止上传的后缀
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
// 判断是否是https协议
$scheme = empty($_SERVER['HTTPS']) ? 'http://' : 'https://';
// 获得url的path路径
$url_path = substr($_SERVER['REQUEST_URI'], 0, strrpos($_SERVER['REQUEST_URI'], '/'));
$url_path = $url_path ? $url_path : '';
// 文件下载的url路径
$src = $scheme.$_SERVER['HTTP_HOST'].$url_path.$upload_img_path;
?>
{
    "code": <?php echo $code;?>
    ,"msg": "<?php echo $msg;?>"
    ,"data": {
        "src": "<?php echo $src?>"
        ,"name": "<?php echo $file_name;?>"
    }
}
