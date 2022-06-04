<template>
  <div>
    <!-- </textarea> -->
    <el-input ref='textInput' :disabled='disabled' type='textarea' :value="contentDisplay" @input='inputContent'>
    </el-input>
  </div>
</template>

<script type="text/javascript">
export default {
  data() {
    return {
      confirmChange: false,
      contentDisplay: '',
    };
  },
  props: ['content', 'contentVisible', 'disabled'],
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
      this.contentDisplay = this.content.toString();
    },
    getContent() {
      // not changed
      if (!this.contentVisible && !this.confirmChange) {
        return this.content;
      }

      const content = this.$refs.textInput.$refs.textarea.value;
      return Buffer.from(content);
    },
    inputContent(value) {
      // visible content do nothing
      if (this.contentVisible) {
        this.contentDisplay = value;
        return;
      }

      // confirmed change content
      if (this.confirmChange) {
        this.contentDisplay = value;
        return;
      }

      this.$confirm(this.$t('message.confirm_modify_unvisible_content'))
        .then(_ => this.confirmChange = true)
        .catch((_) => {
          // recovery the input value
          this.$refs.textInput.$refs.textarea.value = this.contentDisplay;
        });
    },
  },
};
</script>
