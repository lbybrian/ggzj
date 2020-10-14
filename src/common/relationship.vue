<template>
  <div v-if="isShow" ref="myContainer" class="containerArea"></div>
</template>

<script>
import cytoscape from "cytoscape";
import popper from "cytoscape-popper";
cytoscape.use(popper);

export default {
  name: "",
  beforeMount() {
    for (var k in this.dataObj) {
      this.data[k] = this.dataObj[k];
    }
    if (this.dataObj && this.dataObj.popper) {
      this.popperTip.callback = this.dataObj.popper;
    }
  },
  data() {
    return {
      isShow: true,
      popperTip: "",
      data: {
        nodes: [
          {
            id: "1",
            label: "节点1",
            classes: ["test"]
          },
          {
            id: "2",
            label: "节点2",
            classes: ["test"]
          },
          {
            id: "3",
            label: "节点3",
          },
        ],
        edges: [
          {
            id: "1-2",
            label: "线1-2",
            source: "1",
            target: "2"
            
          },
          {
            id: "1-3",
            label: "线1-3",
            source: "1",
            target: "3",
          },
          {
            id: "3-2",
            label: "线3-2",
            source: "3",
            target: "5",
          },
        ],
        map: {
          id: "id",
          label: "label",
          source: "source",
          target: "target",
          image: "image",
        },
        layout: {
          name: "grid"
        },
        labelSelector: {
          node: {
            label: "data(label)",
          },
          edge: {
            label: "data(label)",
          },
        },
        idSelector: {
          1: {
            "background-color": "red"
          }
        },
        classSelector: {
          test: {
            'border-width': 4,
            'border-color': 'green'
          }
        },
        style: [],
        option: {
          minZoom: 0.2,
          maxZoom: 2,
        },
      },
    };
  },
  mounted() {
    this.$nextTick(function () {
      this.initChart();
    });
  },
  methods: {
     updateData(newObj) {
      this.isShow = false;
      this.$nextTick(function () {
        this._updateData(newObj);
        this.isShow = true;
        this.$nextTick(function(){
          this.initChart();
        })
        
      });
    },
    _updateData(newObj) {
      for (var k in newObj) {
        this.$set(this.data, k, newObj[k]);
      }
    },
    initElements() {
      this.param.elements = [];
      var idMap = {};
      for (var i = 0; i < this.data.nodes.length; i++) {
        var tData = this.data.nodes[i];
        if (this.data.map) {
          for (var k in this.data.map) {
            if (this.data.map[k] && tData[this.data.map[k]] !== undefined) {
              tData[k] = tData[this.data.map[k]];
            }
          }
        }
        if (tData.id) {
          idMap[tData.id] = tData;
          var item = {
            data: tData,
          };
          this.param.elements.push(item);
        }
      }
      for (var i = 0; i < this.data.edges.length; i++) {
        var tData = this.data.edges[i];
        if (this.data.map) {
          for (var k in this.data.map) {
            if (this.data.map[k]) {
              tData[k] = tData[this.data.map[k]] || this.data.map[k];
            }
          }
        }
        if (tData.target && tData.source) {
          if (!idMap[tData.target]) {
            var node = {
              data: {
                id: tData.target,
              },
            };
            idMap[tData.target] = node;
            this.param.elements.push(node);
          }
          if (!idMap[tData.source]) {
            var node = {
              data: {
                id: tData.source,
              },
            };
            idMap[tData.source] = node;
            this.param.elements.push(node);
          }
          var item = {
            data: tData,
          };
          this.param.elements.push(item);
        }
      }
    },
    initStyle() {
      this.param.style = [];
      for (var k in this.data.labelSelector) {
        var item = {
          selector: k,
          style: this.data.labelSelector[k],
        };
        this.param.style.push(item);
      }
      for (var k in this.data.idSelector) {
        var item = {
          selector: "#" + k,
          style: this.data.idSelector[k],
        };
        this.param.style.push(item);
      }
      for (var k in this.data.classSelector) {
        var item = {
          selector: "." + k,
          style: this.data.classSelector[k],
        };
        this.param.style.push(item);
      }
      if (this.data.style && this.data.style.length > 0) {
        this.param.style = this.param.style.concat(this.data.style);
      }
    },
    initChart() {
      this.param = this.param || {};
      this.param.container = this.$refs.myContainer;
      this.param.layout = this.data.layout;
      for (var k in this.data.option) {
        this.param[k] = this.data.option[k];
      }
      this.initStyle();
      this.initElements();
      this.cy = cytoscape(this.param);
      var _self = this;

      var popperUpdate = function () {
        _self.popperUpdate();
      };

      this.cy.on("click", function (e) {
        var currentNode = e.target;
        _self.$emit("click", currentNode, _self);
        if (currentNode.length === 1 && currentNode.data()) {
          _self.$emit("click-element", currentNode.data(), currentNode, _self);
          currentNode.off("position");
          currentNode.on("position", popperUpdate);
        }
      });
      this.cy.on("mouseover", function (e) {
        var currentNode = e.target;
        if (currentNode.length === 1 && currentNode.data()) {
          _self.popperRemove();
          currentNode.off("position");
          currentNode.on("position", popperUpdate);
          _self.$emit("hover-element", currentNode.data(), currentNode, _self);
        } else {
          _self.popperRemove();
        }
        // mouseover
        _self.$emit("mouseover", currentNode, _self);
      });
      this.cy.on("mouseout", function (e) {
        var currentNode = e.target;
        _self.$emit("mouseout", currentNode, _self);
      });

      this.cy.on("pan zoom resize", popperUpdate);
    },
    popperUpdate() {
      if (this.popperTip && this.popperTip.scheduleUpdate) {
        this.popperTip.scheduleUpdate();
      }
    },
    popperRemove() {
      if (
        this.popperTip &&
        this.popperTip.destroy &&
        this.popperTip.popper.parentNode
      ) {
        this.popperTip.destroy();
        this.popperTip.popper.parentNode.removeChild(this.popperTip.popper);
      }
    },
  },
  created() {},
  props: {
    dataObj: Object
  },
};
</script>

<style scoped>
.containerArea {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
}
</style>
