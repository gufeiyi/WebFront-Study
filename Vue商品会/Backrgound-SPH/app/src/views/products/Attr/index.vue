<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!-- 必须响应列表需要展示的数据  :data="attrList" -->
        <el-table style="width: 100%; margin-top: 20px" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag type="success" v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id"
                style="margin: 0px 20px">
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加属性 | 修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue"
          :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table style="width:100%; margin: 20px 0px;" border :data="attrInfo.attrValueList">
          <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
          <el-table-column label="属性值名称" width="width" prop="prop">
            <template slot-scope="{row,$index}">
              <el-input :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag"
                @blur="toLook(row)" @keyup.native.enter="toLook(row)"></el-input>
              <span v-else @click="toEdit(row, $index)" style="display: block;">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width" prop="prop">
            <template slot-scope="{row,$index}">
              <!-- 有版本问题：2.13.x是onConfirm   最新版本是confirm -->
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length < 1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      // flag:true, 不可以在这里写，不然所有的框框同时查看和编辑，每个row应该有自己的flag
      isShowTable: true, // 控制el-card的显示与隐藏
      // 新增属性|修改属性使用的对象
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [  // 属性值列表
          // {
          //   attrId:0, // 属于的属性名的id
          //   valueName:"", // 属性值
          // }
        ],
        categoryId: 0, // 三级分类的id ，不可以写this.category3Id，因为data里面的数据收集是无序的
        categoryLevel: 3, // 服务器需要区分是几级id，给三级id加属性
      }
    };
  },
  methods: {
    // 自定义事件的回调
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getAttrList();
      }
    },
    // 获取平台属性的数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值回调
    addAttrValue() {
      // attrId是数据库自己生成的。
      this.attrInfo.attrValueList.push({
        // 修改属性的时候已经把id复制过来了，但是新增的属性值是没有attrId的，也需要带上这个id。
        attrId: this.attrInfo.id,
        valueName: '',
        // 用于切换查看模式与编辑模式
        flag: true,
      });

      // 新增一条属性的时候，也需要自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      })
    },
    // 添加属性的回调
    addAttr() {
      this.isShowTable = false;
      // 清除数据
      this.attrInfo = {
        attrName: '', // 属性名
        attrValueList: [  // 属性值列表
          // {
          //   attrId:0, // 属于的属性名的id
          //   valueName:"", // 属性值
          // }
        ],
        // 此时可以收集三级分类的id，因为此时三级分类的id肯定有了
        categoryId: this.category3Id, // 三级分类的id ，
        categoryLevel: 3, // 服务器需要区分是几级id，给三级id加属性
      }
    },
    // 修改某一个属性
    updateAttr(row) {
      this.isShowTable = false;
      // this.attrInfo = row;
      // 不可以这样写，因为两个对象名指向一个数组
      // this.attrInfo = { ...row }
      // 也不可以这样写，因为浅拷贝被办法处理对象里面有数组，数组里面套对象，因此需要深拷贝来解决问题。
      this.attrInfo = cloneDeep(row);

      // 修改属性的时候，也要给相应的属性值元素加一个flag标记
      this.attrInfo.attrValueList.forEach(item => {
        // 不可以这样写，因为这样写加上的属性不是响应式的（数据改变视图不会改变）
        // item.flag = false;
        // 对象、属性名、属性值
        this.$set(item, 'flag', false);
      })
    },
    // 失去焦点，转换为查看模式
    toLook(row) {
      // 输入的属性值不能为空
      if (row.valueName.trim() == '') {
        this.$message('请你输入一个正常的属性值');
        return;
      }

      // 判断新增的值是否和原来的有重复
      // some方法可以遍历数组
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        // 和除去自己以外的其他元素比较
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });

      if (isRepat) {
        this.$message('新增属性值不可以和原有属性值重复！');
        return;
      };
      row.flag = false;
    },
    // 点击span的回调，变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      // 获取input节点，实现自动聚焦
      // 因为浏览器渲染界面是需要时间的，所以不可能一点击span立刻获取到节点
      // $nextTick，当节点渲染完毕之后，会执行一次
      this.$nextTick(() => {
        // 让input表单元素实现聚焦
        this.$refs[index].focus();
      })
    },

    // 气泡确认框删除事件
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },

    // 保存按钮的回调，把新的数据上传服务器
    async addOrUpdateAttr() {
      // 需要对用户提交的数据进行判断和处理
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        // 过滤掉属性值不为空的
        if (item.valueName != '') {
          delete item.flag;
          return true;
        }
      });

      // 向后台发请求
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.isShowTable = true;
        this.$message({
          type: 'success',
          message: '保存成功！'
        });
        this.getAttrList();
      } catch (error) {
        this.$message("保存失败！");
      }
    }
  },
};
</script>

<style scoped></style>