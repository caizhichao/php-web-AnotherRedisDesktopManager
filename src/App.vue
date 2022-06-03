<template>
  <div id="app">
    <WebRedisViewerMain></WebRedisViewerMain>
  </div>
</template>

<script>
import WebRedisViewerMain from './components/WebRedisViewer/WebRedisViewerMain';

export default {
  name: 'App',
  components: { WebRedisViewerMain },
};
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
