<template>
  <el-dialog
    :title="param.title"
    :visible.sync="dialogVisible"
    :width="param.width"
    :before-close="handleClose"
    @opened="$emit('openDialog')"
  >
    <slot>Dialog内容区域</slot>
    <span v-if="param.withFooter" slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false; $emit('confirmDialog')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "",
  beforeMount() {
    this.param = this.config || this.param;
  },
  data() {
    return {
      dialogVisible: false,
      param: {
        title: "提示",
        width: "40%",
        withFooter: true,
      },
    };
  },
  methods: {
    close() {
      this.dialogVisible = false;
    },
    show() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.close();
    },
  },
  created() {},
  props: {
    config: Object,
  },
};
</script>

<style scoped>
.menuItemsArea {
  width: 100%;
  height: 100%;
}
</style>
