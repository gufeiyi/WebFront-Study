<template>
  <div>
    <el-card style="margin: 20px 0;">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 分三部分进行切换 -->
      <div v-show="scene == 0">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px;" @click="addSpu"
          :disabled="!category3Id">添加SPU</el-button>
        <el-table style="width: 100%;" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku"
                @click="addSku(row)"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu"
                @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表"
                @click="handler(row)"></hint-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="text-align: center;" :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit"
          layout="prev,pager,next,jumper,->,sizes,total" :total="total" @current-change="getSpuList"
          @size-change="handleSizeChange">

        </el-pagination>
      </div>
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"></SpuForm>
      <SkuForm v-show="scene == 2" @changeScenes="changeScenes" ref="sku"></SkuForm>

      <!-- 弹出的对话框 -->
      <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
        <el-table :data="skuList" style="width: 100%;" border v-loading="loading">
          <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
          <el-table-column prop="price" label="价格" width="width"></el-table-column>
          <el-table-column prop="weight" label="重量" width="width"></el-table-column>
          <el-table-column label="默认图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.skuDefaultImg" alt="" style="width: 100px; height: 100px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import SpuForm from './SpuForm';
import SkuForm from './SkuForm';
export default {
  name: 'Spu',
  components: {
    SpuForm,
    SkuForm
  },
  data() {
    return {
      // 三级分类的id
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 控制三级联动的可操作
      page: 1, // 分页器当前第几页
      limit: 3, // 每页几条数据
      records: [], // spu列表的数据
      total: 0, // 分页器一共需要展示数据的条数
      scene: 0, // 0 SPU列表数据   1 添加SPU|修改SPU   2 添加SKU
      dialogTableVisible: false, // 弹出的对话框
      spu:{}, // 点击的spu的信息
      skuList:[], // 点击的spu的sku列表的信息
      loading:true,
    }
  },
  methods: {
    // 对话框关闭前的回调
    close(done){
      this.loading = true;
      this.skuList = [];
      // 关闭对话框
      done();
    },
    // 查看sku列表的回调
    async handler(spu) {
      this.dialogTableVisible = true;
      this.spu = spu;
      // 获取sku列表的数据进行展示
      let result = await this.$API.sku.reqSkuList(spu.id);
      if ( result.code == 200 ){
        this.skuList = result.data;
        // 隐藏loading
        // loading问题：
        // 1、loading只会展示一次
        // 2、快速切换的时候，会显示上一次的数据
        this.loading = false;
      }
    },
    // 添加sku的回调
    addSku(row) {
      this.scene = 2;
      // 让子组件发请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    // 删除spu按钮的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({
          type: 'success',
          message: '删除成功！'
        });
        // 如果spu的个数>1 ,证明还有数据，停留在当前页，如果spu的个数< 1 ,证明没数据了，回到上一页
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = '';
        this.category3Id = '';
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = '';
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    // 获取spu列表数据
    // spu是商品的分类
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 点击第几页的回调函数
    // handleCurrentChange(page){
    //   this.page = page;
    //   this.getSpuList();
    // }

    // 分页器展示条数发生变化的回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 添加Spu的回调
    addSpu() {
      this.scene = 1;
      // 通知子组件发请求
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改Spu的回调
    updateSpu(row) {
      this.scene = 1;
      // 获取子组件SpuForm
      this.$refs.spu.initSpuData(row);
    },
    // spuform自定义事件的回调
    changeScene({ scene, flag }) {
      this.scene = scene;
      if (flag == '修改') {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },

    // skuform自定义事件的回调
    changeScenes(scene) {
      this.scene = scene;
    }
  },
}
</script>

<style scoped></style>