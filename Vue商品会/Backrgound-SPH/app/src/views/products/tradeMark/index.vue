<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px" @click="showDialog">添加</el-button>
    <!-- 

      表格组件
      data: 表格组件将来需要展示的数据------数组类型
      border: 给表格添加边框
      
      column属性
      label: 显示标题
      width: 对应列的宽度
      align: 标题的对齐方式

      注意：elementUI当中的table组件，展示的数据是以一列一列进行展示数据
      prop: 对应列的字段名
   -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width" align="center">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width" align="center">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 

      分页器：
      当前第几页，数据总条数，每一页显示条数，连续页码数
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"

      current-page: 代表的是当前第几页
      total: 代表分页器一共需要展示数据条数
      page-size: 代表的是每一页需要展示多少条数据
      page-sizes: 代表可以设置每一页展示多少条数据
      layout: 可以实现分页器布局
      pager-count: 展示页码的数量。如果设置是9，连续页码展示为7

     -->
    <el-pagination style="margin-top: 20px; text-align: center;" :current-page="page" :total="total" :page-size="limit"
      :page-sizes="[3, 5, 10]" :pager-count="7" @current-change="getPageList" @size-change="handleSizeChange"
      layout="prev, pager, next,jumper,->,sizes,total">
    </el-pagination>
    <!-- 
      对话框
      :visible.sync 控制对话框的显示与隐藏
     -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!-- 
        form表单
        :model属性：这个属性会把表单的数据收集到对应的对象身上，表单验证也需要这个属性
       -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" label-width="100px" prop="logoUrl">
          <!-- 

            上传图片
            action:图片上传的地址
            :on-success:图片上传成功会执行一次
            :before-upload：图片上传之前会执行一次
           -->
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    var validateTmName = (rule, value, callback) => {
      // 自定义校验规则
      if (value.length < 2 || value.length > 8) {
        callback(new Error("品牌名称的长度需要在2-8之间！"));
      } else {
        // 放行
        callback();
      }
    };
    return {
      // 代表分页器第几页
      page: 1,
      // 当前页数展示的数据条数
      limit: 3,
      // 总共数据条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 对话框显示与隐藏控制的属性
      dialogFormVisible: false,
      // 上传图片使用的属性
      imageUrl: "",
      // 收集品牌信息
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证的规则
      rules: {
        // 品牌名称的验证规则，注意，必须和要验证的字段名称一致
        tmName: [
          // required必须要输入，前面会带有*
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2到10个字符", trigger: "change" },
          { validator: validateTmName, trigger: "change" },
        ],
        // 品牌logo的验证规则
        logoUrl: [{ required: true, message: "请选择品牌的图片" }],
      },
    };
  },
  mounted() {
    // 请求获取列表数据
    // console.log(this.$API);
    this.getPageList();
  },
  methods: {
    // 获取列表数据函数
    async getPageList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },

    // 修改当前页数之后，再调数据
    handleCurrentChange(pager) {
      this.page = pager;
      this.getPageList();
    },

    // 当分页器某一页需要展示数据条数发生变化的时候会被触发
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    // 点击添加品牌的按钮
    showDialog() {
      this.dialogFormVisible = true;
      // 清理数据
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
    },

    // 修改某一个品牌
    updateTradeMark(row) {
      // row： 当前用户选中这个品牌的信息。
      // console.log(row);

      this.dialogFormVisible = true;
      // 赋值数据
      // 不能这样写，因为不是纯覆盖，修改的时候就不会有id
      // this.tmForm = {
      //   tmName:row.tmName,
      //   logoUrl:row.logoUrl,
      // }
      // 需要用浅拷贝，因为直接赋值会直接影响tmForm的值，因为双向绑定，页面的数据就发生变化了
      // （这个效果不是我们想要的，我们希取消之后页面的数据还是原来的样子）
      this.tmForm = { ...row };
    },

    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res直接是服务器返回的数据
      // file是服务器返回的数据还有图片的相关数据做了一个打包

      // 收集品牌Logo的数据，之后会上传给服务器

      this.tmForm.logoUrl = res.data;
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加或者是修改品牌
    addOrUpdateTradeMark() {
      // 当表单验证字段都通过了，再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false;
          let result = await this.$API.trademark.reqAddUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            // 弹出信息
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log("error submit!");
          return false;
        }
      });
    },
    // 删除品牌的操作
    deleteTradeMark(row) {
      this.$confirm(`你确定删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 当用户点击确定按钮时会触发
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          // 如果删除成功
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 再次获取数据列表并且停留在当前页
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
          }
        })
        .catch(() => {
          // 当用户点击取消按钮时会触发
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>