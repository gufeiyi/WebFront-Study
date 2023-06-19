<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input placeholder="规格描述" type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="forminner" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="(attr) in attrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue) in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="forminner" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr) in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.saleAttrIdAndSaleAttrValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%;" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column prop="" label="label" width="80" type="selection"></el-table-column>
          <el-table-column prop="" label="图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px;">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="primary" v-if="row.isDefault == 0" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      // 存储图片的信息
      spuImageList: [],
      // 存储销售属性
      spuSaleAttrList: [],
      // 存储平台属性的数据
      attrInfoList: [],
      // 收集sku的数据传给后台
      skuInfo: {
        // 第一类: 数据收集：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,

        // 第二类: 数据收集：数据双向绑定
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",

        // 第三类: 需要写代码收集
        // 默认图片
        skuDefaultImg: "",
        // 收集图片的字段
        skuImageList: [],
        // 销售属性
        skuSaleAttrValueList: [],
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId:0,
          //   valueId:0,
          // }
        ],

      },
      spu: {},
      // 收集图片的字段
      imageList: [],
    }
  },
  methods: {
    // 获取SkuForm的数据
    async getData(category1Id, category2Id, spu) {
      // 收集父组件给予的数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;

      // 获取图片数据
      let resultImage = await this.$API.sku.reqSpuImageList(spu.id);
      if (resultImage.code == 200) {
        let list = resultImage.data;
        list.forEach(item => {
          // 给resultImage加上是否设置默认的字段
          // 0 代表设置默认，1代表默认
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }

      // 获取销售属性
      let resultSale = await this.$API.sku.reqSpuSaleAttrList(spu.id);
      if (resultSale.code == 200) {
        this.spuSaleAttrList = resultSale.data;
      }

      // 获取平台属性的数据
      let resultInfo = await this.$API.sku.reqAttrInfoList(category1Id, category2Id, spu.category3Id);
      if (resultInfo.code == 200) {
        this.attrInfoList = resultInfo.data;
      }
    },

    // table表格复选框按钮的事件
    handleSelectionChange(imageList) {
      // 不能直接给上传服务器的字段skuInfo.skuImageList，因为缺少isDefault字段
      // 不能赋值给spuImageList，因为这个是用来展示的，赋值之后就只剩下勾选的图片了
      this.imageList = imageList;
    },

    // 设置默认的回调
    changeDefault(row) {
      this.spuImageList.forEach(item => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },

    // 取消按钮的回调
    cancel() {
      this.$emit('changeScenes', 0);
      // 清除数据
      Object.assign(this._data, this.$options.data());
    },

    // 保存按钮的回调
    async save() {
      // attrInfoList是收集到的数据，但是形式不对 11:22 => {attrId:11,valueId:22}
      // spuSaleAttrList是收集到的数据，但是形式不对 11:22 => {saleAttrId:11,saleAttrValueId:22}
      // 新建数组收集所有处理好的对象
      let arr = [];
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
      attrInfoList.forEach(item => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          let obj = { attrId, valueId };
          arr.push(obj);
        }
      });
      skuInfo.skuAttrValueList = arr;

      // 方法2
      // prev是上一次的计算结果
      // item是遍历到的当前对象
      // reduce函数里面传两个{函数体},{prev的初始值，如果不传入初始值，默认是数组第一位}
      // skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item)=>{
      //   if(item.attrIdAndValueId){
      //     const [attrId,valueId] = item.attrIdAndValueId.split(':');
      //     prev.push({attrId,valueId});
      //   }
      //   return prev;
      // },[]);
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdAndSaleAttrValueId) {
          const [saleAttrId, saleAttrValueId] = item.saleAttrIdAndSaleAttrValueId.split(':');
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      skuInfo.skuImageList = imageList.map(item=>{
        return {
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgList:item.id,
        }
      });
      let result = await this.$API.sku.reqAddSku(skuInfo);
      if(result.code == 200){
        this.$message({
          type:'success',
          message:'添加SKU成功'
        });
        this.$emit('changeScenes', 0);
      }
    }
  },
}
</script>

<style scoped></style>