<template>
  <div>
    <el-container direction="vertical" class="key-tab-container">
      <!-- key info -->
      <el-input></el-input>
      <KeyHeader
        ref="keyHeader"
        :client='client'
        :redisKey="redisKey"
        :keyType="keyType"
        @refreshContent='refreshContent'
        @dumpCommand='dumpCommand'
        :hotKeyScope='hotKeyScope'
        class="key-header-info">
      </KeyHeader>

      <!-- key content -->
      <component
        ref="keyContent"
        :is="componentName"
        :client='client'
        :redisKey="redisKey"
        :hotKeyScope='hotKeyScope'
        class="key-content-container">
      </component>
    </el-container>
  </div>
</template>

<script>
import KeyHeader from './KeyHeader';
import KeyContentString from './KeyContentString';
import KeyContentHash from './KeyContentHash';
import KeyContentSet from './KeyContentSet';
import KeyContentZset from './KeyContentZset';
import KeyContentList from './KeyContentList';
import KeyContentStream from './KeyContentStream';
import KeyContentReJson from './KeyContentReJson';

export default {
  data() {
    return {};
  },
  props: ['client', 'redisKey', 'keyType', 'hotKeyScope'],
  components: {
    KeyHeader,
    KeyContentString,
    KeyContentHash,
    KeyContentSet,
    KeyContentZset,
    KeyContentList,
    KeyContentStream,
    KeyContentReJson,
  },
  computed: {
    componentName() {
      return this.getComponentNameByType(this.keyType);
    },
  },
  methods: {
    update() {
      this.$forceUpdate();
    },
    getComponentNameByType(keyType) {
      const map = {
        string: 'KeyContentString',
        hash: 'KeyContentHash',
        zset: 'KeyContentZset',
        set: 'KeyContentSet',
        list: 'KeyContentList',
        stream: 'KeyContentStream',
        stream: 'KeyContentStream',
        'ReJSON-RL': 'KeyContentReJson',
      };

      if (map[keyType]) {
        return map[keyType];
      }
      // type not support, such as bf

      this.$message.error(this.$t('message.key_type_not_support'));
      return '';
    },
    refreshContent() {
      this.client.exists(this.redisKey).then((reply) => {
        if (!reply) {
          return this.$message.error(this.$t('message.key_not_exists'));
        }

        this.$refs.keyContent && this.$refs.keyContent.initShow();
      }).catch((e) => {
        this.$message.error(`Exists Error: ${e.message}`);
      });
    },
    dumpCommand() {
      this.$refs.keyContent && this.$refs.keyContent.dumpCommand();
    },
  },
};
</script>

<style type="text/css">
  .key-tab-container {
    /*padding-left: 5px;*/
  }
  .key-header-info {
    margin-top: 15px;
  }
  .key-content-container {
    margin-top: 15px;
  }
  .key-detail-filter-value {
    width: 60%;
    height: 24px;
    padding: 0 5px;
  }

  /*tooltip in table width limit*/
  .el-tooltip__popper {
    max-width: 50%;
  }

  .content-more-container {
    text-align: center;
    margin-top: 10px;
  }
  .content-more-container .content-more-btn {
    width: 95%;
  }
</style>
