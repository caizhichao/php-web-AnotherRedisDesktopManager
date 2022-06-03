<?php

$func = $_REQUEST['func'];
$body = json_decode(file_get_contents('php://input'), true);

class Api
{
  // 下发前端web展示的可访问redis链接列表
  static function connections()
  {
    return [
      ['key' => '1', 'connectionName' => '测试连接']
    ];
  }

  static function redisInvoke($body)
  {
    $command = $body['command'];
    $params = $body['params'];

    // 可以根据这里的客户端转发上来的链接信息判断怎么连接指定redis
    $connConfig = $body['connConfig'];
    $redis = new Redis();
    $redis->connect('127.0.0.1');

    switch ($command) {
      case 'scan':
      case 'info':
      case 'type':
      case 'ttl':
      case 'set':
      case 'del':
      case 'persist':
      case 'expire':
      case 'hlen':
      case 'hscan':
      case 'hset':
      case 'get':
      case 'exists':
      case 'call':
      case 'lpush':
      case 'llen':
      case 'lrange':
      case 'rpush':
      case 'sadd':
      case 'hdel':
      case 'rename':
      case 'sscan':
      case 'zcard':
      case 'scard':
      case 'srem':
      case 'zrem':
      case 'zadd':
      case 'lrem':
      case 'zrevrange':
        break;
      default:
        return 'no allow command=[' . $command . ']';
    }
    $redis->setOption(Redis::OPT_REPLY_LITERAL, 1);
    return $redis->rawCommand($command, ...$params);
  }
}

echo json_encode(Api::$func($body), JSON_UNESCAPED_UNICODE);
