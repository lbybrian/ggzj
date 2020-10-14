<template>
  <div class="containerArea">
    <el-table
      v-if="isShow"
      :data="_dataObj.data"
      ref="dataTableItem"
      :height="_dataObj.height"
      :max-height="_dataObj.maxHeight"
      :stripe="_dataObj.stripe || false"
      :border="_dataObj.border || false"
      :empty-text="_dataObj.emptyText || '暂无数据'"
      :fit="_dataObj.fit === undefined ? true : _dataObj.fit"
      :highlight-current-row="_dataObj.heightCurrentRow"
      :show-header="_dataObj.showHeader === undefined ? true : _dataObj.showHeader"
      @selection-change="handleSelectionChange"
      @cell-click="dealCellClick"
      @sort-change="dealSortChange"
      style="width: 100%"
    >
      <el-table-column
        v-if="_dataObj.withSelection"
        type="selection"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column
        v-if="_dataObj.withIndex"
        type="index"
        align="center"
      ></el-table-column>
      <slot v-for="d in _dataObj.header">
        <el-table-column
          :sortable="d.sortable"
          :align="d.align"
          :prop="d.prop"
          :label="d.label"
          :fixed="d.fixed"
          :header-align="d.headerAlign || d.align"
          :width="d.width"
          :index="d.index"
          :min-width="d.minWidth"
          :show-overflow-tooltip="d.showOverflowTooltip"
          :class-name="d.className"
          :resizable="d.resizable"
        >
          <template slot-scope="scope">
            <slot v-if="!!d.buttons">
              <slot v-for="t in d.buttons">
                <el-button
                  @click="
                    dealClickButton(
                      t.eventName || t.label,
                      scope.row,
                      scope.$index
                    )
                  "
                  v-if="
                    !t.condition ||
                    (t.condition.constructor.name === 'Array' &&
                      t.condition.indexOf(scope.row[d.prop]) !== -1) ||
                    (t.condition.constructor.name === 'String' &&
                      t.condition === scope.row[d.prop])
                  "
                  :type="t.type || 'text'"
                  :class="t.class"
                  :size="t.size || 'small'"
                >
                  {{ t.text }}
                </el-button>
              </slot>
            </slot>
            <slot v-else>
              <span v-if="!d.style" :prop="d.prop">{{
                scope.row[d.prop]
              }}</span>
              <div v-else="!!d.style" :prop="d.prop" :style="d.style">
                <span :prop="d.prop">{{ scope.row[d.prop] }}</span>
              </div>
            </slot>
          </template>
        </el-table-column>
      </slot>
    </el-table>
    <slot v-if="!!_dataObj.page">
      <el-pagination
        :style="_dataObj.style || 'margin-top: 10px;'"
        :page-size="_dataObj.page.pageSize || 20"
        :page-sizes="_dataObj.page.sizes || [10, 20, 50, 100]"
        :pager-count="5"
        :current-page="_dataObj.page.currentPage"
        :page-count="_dataObj.page.count || 1"
        :layout="_dataObj.page.layout || 'prev, pager, next, sizes'"
        :total="_dataObj.page.total || 1000"
        @size-change="dealSizeChange"
        @current-change="dealPageChange"
      ></el-pagination>
    </slot>
  </div>
</template>

<script>
export default {
  name: "",
  beforeMount() {
    if (this.dataObj) {
      this._dataObj = this.dataObj;
    }
  },

  data() {
    return {
      isShow: true,
      _dataObj: {
        withSelection: true,
        withIndex: true,
        header: [
          {
            prop: "date",
            label: "日期",
            width: "180",

          },
          {
            prop: "name",
            label: "姓名",
            width: "180",
            align: "center",
          },
          {
            prop: "address",
            label: "地址",
          },
        ],
        data: [
          {
            date: "2020-02-21",
            name: "刘文津",
            address: "三义庙2号院",
          },
          {
            date: "2020-02-22",
            name: "刘文津",
            address: "三义庙2号院",
          },
        ],
        page: {
          sizes: [20, 50, 100, 200],
          count: 1,
          layout: "prev, pager, next",
          total: 200,
        },
      },
    };
  },
  watch: {},
  mounted() {
    this.tableItem = this.$refs.dataTableItem;
  },
  methods: {
    updateData(newObj) {
      this.isShow = false;
      this.$nextTick(function () {
        this._updateData(newObj);
        this.isShow = true;
      });
    },
    _updateData(newObj) {
      for (var k in newObj) {
        this.$set(this._dataObj, k, newObj[k]);
      }
    },
    clearSelection() {
      this.tableItem.clearSelection();
    },
    setCurrentRow(row) {
      this.tableItem.setCurrentRow(row);
    },
    toggleRowSelection(row, selected) {
      this.tableItem.toggleRowSelection(row, selected);
    },
    clearSort() {
      this.tableItem.clearSort();
    },
    handleSelectionChange(val) {
      this._dataObj.selected = val;
      this.$emit("selection-change", val);
    },
    dealSizeChange(val) {
      this._dataObj.page.size = val;
      this.$emit("size-change", this._dataObj.page.current, val);
    },
    dealPageChange(val) {
      this._dataObj.page.current = val;
      this.$emit("page-change", val, this.$refs.dataTableItem.size);
    },
    dealCellClick(row, column, cell, event) {
      this.$emit("cell-click", row, column, cell, event);
    },
    dealClickButton(eventName, row, index) {
      this.$emit("button-click", eventName, row, index);
    },
    dealSortChange(param) {
      this.$emit("sort-change", param);
    },
  },
  created() {},
  props: {
    dataObj: Object,
  },
};
</script>

<style scoped>
.containerArea {
  width: 100%;
  height: 100%;
}
</style>
