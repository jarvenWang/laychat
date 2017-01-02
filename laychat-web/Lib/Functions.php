<?php
use Workerman\Protocols\Http;
// 兼容Workerman环境
function _session_start()
{
    if (PHP_SAPI === 'cli') {
        return Http::sessionStart();
    }
    session_start();
}

function _exit($data = '')
{
    if (PHP_SAPI === 'cli') {
        return Http::end($data);
    }
    exit($data);
}

function _json($data) {
    echo json_encode($data);
}

function exit_json($data) {
    _json($data);
    _exit();
}

function _header($val, $r = null, $c = null) {
    if (PHP_SAPI === 'cli') {
        return Http::header($val, $r, $c);
    }
    header($val, $r, $c);
}

function format_time($show_time){
    $now_time = time();
    $dur = $now_time - $show_time;
    $the_time = date('Y-m-d H:i:s', $show_time);
    if($dur < 0){
        return the_time;
    }else{
        if($dur < 60){
            return $dur.'秒前';
        }else{
            if($dur < 3600){
                return floor($dur/60).'分钟前';
            }else{
                if($dur < 86400){
                    return floor($dur/3600).'小时前';
                }else{
                    if($dur < 259200){//3天内
                        return floor($dur/86400).'天前';
                    }else{
                        return $the_time;
                    }
                }
            }
        }
    }
}
