import Vue from 'vue';
import { Readable } from 'stream';
import util from './util';
import vue from './main';
import { writeCMD } from './commands';


export class Event {
  constructor() {
    this.eventHub = new Vue();
    this.on = (...event) => {
      this.eventHub.$on(...event);
    };
    this.off = (...event) => {
      this.eventHub.$off(...event);
    };
    this.once = (...event) => {
      this.eventHub.$once(...event);
    };
    this.emit = (...event) => {
      this.eventHub.$emit(...event);
    };
  }
}

const WebApi = {};


export class WebApiScanStream extends Readable {
  constructor(opt) {
    super(opt);
    this.opt = opt;
    this._redisCursor = '0';
    this._redisDrained = false;
  }

  _read() {
    if (this._redisDrained) {
      this.push(null);
      return;
    }
    const args = [this._redisCursor];
    if (this.opt.key) {
      args.unshift(this.opt.key);
    }
    if (this.opt.match) {
      args.push('MATCH', this.opt.match);
    }
    if (this.opt.type) {
      args.push('TYPE', this.opt.type);
    }
    if (this.opt.count) {
      args.push('COUNT', String(this.opt.count));
    }
    this.opt.redis[this.opt.command](args)
      .then((res) => {
        // if (err) {
        //   this.emit('error', err);
        //   return;
        // }
        this._redisCursor = res[0] instanceof Buffer ? res[0].toString() : res[0];
        if (this._redisCursor === '0') {
          this._redisDrained = true;
        }
        res[1].map((it, index) => res[1][index] = Buffer.from(it));
        this.push(res[1]);
      });
  }

  close() {
    this._redisDrained = true;
  }
}


export class WebApiRedisClient extends Event {
  constructor(configCopy) {
    super();
    this.options = configCopy;
    this.status = 'ready';
  }

  /**
   * redis 原生命令开始
   */
  async config(action, param) {
    switch (action) {
      case 'get':
        switch (param) {
          case 'databases':
            return 16;
          default:
            return null;
        }
      default:
        return null;
    }
  }

  info() {
    return WebApi.redisInvoke(this.options, 'info');
  }

  nodes(nodeName) {
    return [this];
  }

  scan(args) {
    return WebApi.redisInvoke(this.options, 'scan', ...args);
  }

  sscan(args) {
    return WebApi.redisInvoke(this.options, 'sscan', ...args);
  }


  hscan(args) {
    return WebApi.redisInvoke(this.options, 'hscan', ...args);
  }


  type(key) {
    return WebApi.redisInvoke(this.options, 'type', key);
  }


  ttl(key) {
    return WebApi.redisInvoke(this.options, 'ttl', key);
  }

  hlen(key) {
    return WebApi.redisInvoke(this.options, 'hlen', key);
  }

  hset(key, ...args) {
    return WebApi.redisInvoke(this.options, 'hset', key, ...args);
  }

  srem(key, ...args) {
    return WebApi.redisInvoke(this.options, 'srem', key, ...args);
  }

  set(key, ...args) {
    return WebApi.redisInvoke(this.options, 'set', key, ...args);
  }

  zadd(key, ...args) {
    return WebApi.redisInvoke(this.options, 'zadd', key, ...args);
  }

  del(key, ...args) {
    return WebApi.redisInvoke(this.options, 'del', key, ...args);
  }

  persist(key, ...args) {
    return WebApi.redisInvoke(this.options, 'persist', key, ...args);
  }

  expire(key, ...args) {
    return WebApi.redisInvoke(this.options, 'expire', key, ...args);
  }

  call(key, ...args) {
    return WebApi.redisInvoke(this.options, 'call', key, ...args);
  }

  lpush(key, ...args) {
    return WebApi.redisInvoke(this.options, 'lpush', key, ...args);
  }

  llen(key, ...args) {
    return WebApi.redisInvoke(this.options, 'llen', key, ...args);
  }

  rpush(key, ...args) {
    return WebApi.redisInvoke(this.options, 'rpush', key, ...args);
  }

  sadd(key, ...args) {
    return WebApi.redisInvoke(this.options, 'sadd', key, ...args);
  }

  hdel(key, ...args) {
    return WebApi.redisInvoke(this.options, 'hdel', key, ...args);
  }

  rename(key, ...args) {
    return WebApi.redisInvoke(this.options, 'rename', key, ...args);
  }

  scard(key, ...args) {
    return WebApi.redisInvoke(this.options, 'scard', key, ...args);
  }

  zcard(key, ...args) {
    return WebApi.redisInvoke(this.options, 'zcard', key, ...args);
  }

  zrem(key, ...args) {
    return WebApi.redisInvoke(this.options, 'zrem', key, ...args);
  }

  lrem(key, ...args) {
    return WebApi.redisInvoke(this.options, 'lrem', key, ...args);
  }

  exists(key) {
    return WebApi.redisInvoke(this.options, 'exists', key);
  }


  /**
   * redis 原生命令结束
   */

  async getBuffer(key) {
    const r = await WebApi.redisInvoke(this.options, 'get', key);
    return Buffer.from(r);
  }

  async lrangeBuffer(args) {
    const r = await WebApi.redisInvoke(this.options, 'lrange', ...args);
    r.forEach((it, idx) => {
      r[idx] = Buffer.from(it);
    });
    return r;
  }

  async zrevrangeBuffer(args) {
    const r = await WebApi.redisInvoke(this.options, 'zrevrange', ...args);
    r.forEach((it, idx) => {
      r[idx] = Buffer.from(it);
    });
    return r;
  }

  scanBufferStream(scanOption) {
    return this.__scanPackage('scan', scanOption);
  }

  sscanBufferStream(key, scanOption) {
    return this.__scanPackage('sscan', key, scanOption);
  }

  hscanBufferStream(key, scanOption) {
    return this.__scanPackage('hscan', key, scanOption);
  }

  __scanPackage(command, key, options) {
    if (command === 'scan' || command === 'scanBuffer') {
      options = key;
      key = null;
    }
    return new WebApiScanStream(Object.assign({
      objectMode: true,
      key,
      redis: this,
      command,
    }, options));
  }
}


WebApi.connections = async function () {
  const r1 = await fetch('/api.php?func=connections');
  return r1.json();
};

WebApi.getRedisClient = function (configCopy) {
  return new WebApiRedisClient(configCopy);
};
WebApi.redisInvoke = async function (connConfig, command, ...params) {
  params.map((it, index) => {
    params[index] = util.bufToString(it);
  });
  if (connConfig.connectionReadOnly && writeCMD[command.toUpperCase()]) {
    throw new Error('You are in readonly mode! Unable to execute write command!');
  }
  const start = performance.now();
  const r1 = await fetch('/api.php?func=redisInvoke', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      command,
      params,
      connConfig,
    }),
  });
  const text = await r1.text();
  console.log('tag:redisInvoke', command, params, text);
  const cost = performance.now() - start;
  const record = {
    time: new Date(),
    connectionName: connConfig.connectionName,
    command: {
      name: command,
      args: params,
    },
    cost,
  };
  vue.$bus.$emit('commandLog', record);
  return JSON.parse(text);
};


export default WebApi;
