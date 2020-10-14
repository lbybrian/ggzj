<template>
  <div class="containerArea">
    <codemirror ref="mycode" @changes="dealChange" :value="code" :options="cmOptions" class="code"></codemirror>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/theme/ambiance.css";
import "codemirror/theme/material.css";
import "codemirror/theme/icecoder.css";
require("codemirror/mode/javascript/javascript");
require("codemirror/addon/fold/foldcode.js");
require("codemirror/addon/fold/foldgutter.js");
require("codemirror/addon/fold/brace-fold.js");
require("codemirror/addon/fold/xml-fold.js");
require("codemirror/addon/fold/indent-fold.js");
require("codemirror/addon/fold/comment-fold.js");
var beautify = require("js-beautify").js;

export default {
  name: "",
  components: {
    codemirror,
  },
  beforeMount() {
    var temp = this.cmOptions;
    if (this.codeView) {
      this.cmOptions = this.codeView;
      for (var k in temp) {
        if (this.cmOptions[k] === undefined) {
          this.cmOptions[k] = temp[k];
        }
      }
    }
  },
  computed: {
    current() {
      return beautify(this.code);
    },
  },
  data() {
    return {
      code: "",
      cmOptions: {
        mode: "application/json",
        lineNumbers: true,
        readOnly: false,
      },
    };
  },
  methods: {
    dealChange(v) {
      this.code = v.getValue();
    },
    getValue() {

    }
  },
  created() {},
  props: {
    codeView: Object,
  },
};
</script>

<style scoped>
.containerArea {
  width: 100%;
  height: 100%;
  border-top: solid 1px #ddd;
  border-left: solid 1px #ddd;
  box-shadow: 1px 1px 1px #ddd;
}

.CodeMirror {
  border: 1px solid #eee;
  height: 100%;
}

.CodeMirror-scroll {
  height: auto;
  overflow-y: hidden;
  overflow-x: auto;
}
</style>
