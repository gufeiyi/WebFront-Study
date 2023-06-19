<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option :label="tm.tmName" :value="tm.id" v-for="tm in tradeMarkList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="4" placeholder="SPU描述" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 
          图片预览时的回调：:on-preview="handlePictureCardPreview"
          删除图片时的回调：:on-remove="handleRemove"
          图片的类型：list-type="picture-card"照片墙
          file-list: 照片墙需要展示的数据【数组：数组里面必须有name、url属性】
         -->
        <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card"
          :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="spuImageList"
          :on-success="handleSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attr">
          <el-option :label="unSelect.name" :value="`${unSelect.id}:${unSelect.name}`"
            v-for="(unSelect) in unSelectSaleAttr" :key="unSelect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" style="margin-left: 20px" :disabled="!attr"
          @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%; margin-top: 20px" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="80">
          </el-table-column>
          <el-table-column label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag :key="tag.id" v-for="(tag, index) in row.spuSaleAttrValueList" closable :disable-transitions="false"
                @close="handleClose(row, index)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput"
                size="small" @blur="handleInputConfirm(row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // 修改的时候，可以直接把数据赋值给spu
      // 但是添加的时候，就是个纯对象，所以需要初始化属性值
      spu: {
        // 三级分类的id
        category3Id: 0,
        // spu的描述
        description: "",
        // spu的名称
        spuName: "",
        // 品牌的id
        tmId: '',
        // spu图片的列表
        spuImageList: [],
        // 平台售卖属性的收集
        spuSaleAttrList: [],
      }, //spu的信息
      tradeMarkList: [], //品牌列表
      spuImageList: [], // 获取spu图片的数据
      saleAttrList: [], // 平台全部销售属性
      attr: "", // 未选择的销售属性的id和name
    };
  },
  methods: {
    // 取消的回调
    cancel(){
      this.$emit('changeScene',{scene:0,flag:''});
      // 清除数据
      // Object.assign 可以合并对象
      // this._data，可以操作data当中的响应式数据
      // this.$options.data()是初始化的配置对象,都是空对象或者空数组。
      // console.log('options',this.$options.data());
      // console.log('_data',this._data);
      Object.assign(this._data,this.$options.data());
    },
    // 点击添加SPU按钮时，发请求
    async addSpuData(category3Id) {
      // 收集SPU三级分类的id
      this.spu.category3Id = category3Id;
      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }

      // 获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 向后台提交修改的数据
    async addOrUpdateSpu() {
      // 直接上传的图片包含name、url字段，但是传给后台的字段必须有imageName、imageUrl
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      // 发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message({
          type: 'success',
          message: '保存成功',
        });
        this.$emit('changeScene', {scene:0,flag:this.spu.id?'修改':'添加'});
      }
      // 清除数据
      Object.assign(this._data,this.$options.data());
    },
    // 删除属性值的回调
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    // el-input失去焦点以及按回车的回调
    handleInputConfirm(row) {
      // 把收集到的数据丢进spuSaleAttrValueList里面
      const { baseSaleAttrId, inputValue } = row;

      // 新增的销售属性值的名称不能为空
      if (inputValue.trim() == '') {
        this.$message('属性值不能为空');
        return;
      }

      // 新增的销售属性值不能和前面的重复
      // 不能用 == 因为 空串也是相等的
      let result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName != inputValue);
      if (!result) {
        this.$message('属性值不能和前面的属性值重复');
        return;
      }
      // 后台需要的字段：baseSaleAttrId、saleAttrValueName
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      // 显示添加
      row.inputVisible = false;
    },
    // 点击添加新的销售属性值的回调
    addSaleAttrValue(row) {
      // 挂载在销售属性上的响应式数据inputVisible来控制添加和输入框的显示与隐藏
      // 显示输入框
      this.$set(row, 'inputVisible', true);
      // 收集输入框里的数据,第三个数据是初始值
      this.$set(row, 'inputValue', '');

    },
    // 添加销售属性的点击事件
    addSaleAttr() {
      // 把收集到的销售属性信息，放到列表里面
      // attr--->spu.spuSaleAttrList
      // 后台需要的销售属性对象{baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
      const [baseSaleAttrId, saleAttrName] = this.attr.split(':');
      let newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      // 清空下拉框的数据
      this.attr = '';
    },
    // 图片上传成功的回调
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    // 点击照片墙的删除时会触发
    handleRemove(file, fileList) {
      // file：删除的那张图片
      // fileList：剩余其他的图片
      this.spuImageList = fileList;
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      // 控制预览图对话框的显示与隐藏
      this.dialogVisible = true;
    },
    // 初始化SpuForm
    async initSpuData(spu) {
      // 获取spu信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }

      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }

      // 获取spu图片的信息
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }

      // 获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
  },
  computed: {
    unSelectSaleAttr() {
      // 整个平台的销售属性 saleAttrList
      // 当前spu拥有的销售属性 spu.spuSaleAttrList
      // 要求 ：过滤出 当前spu未拥有的销售属性  saleAttrList - spu.spuSaleAttrList

      // filter会过滤出为true的对象
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    }
  }
};
</script>

<style>
.el-tag+.el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}</style>