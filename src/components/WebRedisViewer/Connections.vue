<template>
  <div>
    <ConnectionWrapper
      v-for="item of connections"
      :key="item.key ? item.key : item.connectionName"
      :index="item.connectionName"
      :globalSettings="globalSettings"
      :config='item'>
    </ConnectionWrapper>

    <ScrollToTop parentNum='1' :posRight='false'></ScrollToTop>
  </div>
</template>

<script type="text/javascript">
import Sortable from 'sortablejs';
import ConnectionWrapper from './ConnectionWrapper';
import ScrollToTop from './ScrollToTop';


export default {
  data() {
    return {
      connections: [],
      globalSettings: this.$storage.getSetting(),
    };
  },
  components: { ConnectionWrapper, ScrollToTop },
  created() {
    this.$bus.$on('refreshConnections', () => {
      this.initConnections();
    });
    this.$bus.$on('reloadSettings', (settings) => {
      this.globalSettings = settings;
    });
  },
  methods: {
    async initConnections() {
      this.connections = await this.$webApi.connections();
    },
    sortOrder() {
      const dragWrapper = document.querySelector('.connections-list ');
      Sortable.create(dragWrapper, {
        handle: '.el-submenu__title',
        animation: 400,
        direction: 'vertical',
        onEnd: (e) => {
          const { newIndex } = e;
          const { oldIndex } = e;
          // change in connections
          const currentRow = this.connections.splice(oldIndex, 1)[0];
          this.connections.splice(newIndex, 0, currentRow);
          // store
          this.$storage.reOrderAndStore(this.connections);
        },
      });
    },
  },
  mounted() {
    this.initConnections();
    this.sortOrder();
  },
};
</script>
