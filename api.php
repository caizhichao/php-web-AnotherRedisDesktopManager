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
    $writeCommand = ['set'，'del','persist','expire','hset','call','lpush','rpush','sadd','hdel','rename','srem','zrem','zadd','lrem'];
    $readCommand = ['scan','info','type'，'ttl','hlen','hscan','get','exists','llen','lrange','sscan','zcard','scard','zrevrange'];

    if(!in_array($command, $writeCommand)
     || !in_array($command, $readCommand)){
         return 'no allow command=[' . $command . ']';
    }

    $redis->setOption(Redis::OPT_REPLY_LITERAL, 1);
    return $redis->rawCommand($command, ...$params);
  }
}

echo json_encode(Api::$func($body), JSON_UNESCAPED_UNICODE);
