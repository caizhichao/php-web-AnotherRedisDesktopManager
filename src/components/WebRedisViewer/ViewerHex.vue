<template>
  <div>
    <!-- </textarea> -->
    <el-input ref='textInput' :disabled='disabled' type='textarea' :value='contentDisplay' @input="inputContent"></el-input>
  </div>
</template>

<script type="text/javascript">
export default {
  props: ['content', 'contentVisible', 'disabled'],
  data() {
    return {
      contentDisplay: '',
    };
  },
  watch: {
    content() {
      this.initContentDisplay();
      // refresh
      // this.$nextTick(() => {
      //   this.$refs.textInput.$refs.textarea.value = this.contentDisplay;
      // });
    },
  },
  mounted() {
    this.initContentDisplay();
  },
  methods: {
    initContentDisplay() {
      this.contentDisplay = this.$util.bufToString(this.content);
    },
    getContent() {
      const content = this.$refs.textInput.$refs.textarea.value;
      return this.$util.xToBuffer(content);
    },
    inputContent(value) {
      this.contentDisplay = value;
    },
  },
};
</script>
