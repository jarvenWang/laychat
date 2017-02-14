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
