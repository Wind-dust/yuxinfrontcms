<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>下载中心</el-breadcrumb-item>
        <el-breadcrumb-item>下载管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加下载物品</el-button>
    </div>

    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="100"></el-table-column>
      <el-table-column prop="image_path" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.image_path" width="40" class="head_pic"/>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="order" label="排序"></el-table-column>
      <el-table-column prop="jump_content" label="跳转内容"></el-table-column>
      <el-table-column prop="_type" label="类型"></el-table-column>
      <el-table-column prop="content" label="简介"></el-table-column>
      <!--<el-table-column  prop="status" label="状态" >-->
      <!--<template slot-scope="scope">-->
      <!--<el-switch v-model="scope.row.status" @change="statusChange(scope.row.id,scope.row.status)" :active-value="1" :inactive-value="2"></el-switch>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getOneInfo(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :num='num' :total="total" :page="page"></v-pagination>

    <v-card name='添加案例' width="110" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules"
            @sumbit="sumbit" @hideCard="hideCard"></v-card>

  </div>
</template>

<script>
  import vScreen from '../../component/screen'
  import vPagination from '../../component/pagination'
  import vCard from '../../component/card'

  export default {
    data() {
      return {
        list: [],
        num: 1,
        cardStatus: false,
        ruleForm: {},
        rules: ['title', 'image_path','content'],
        ruleType: {
          'title': {
            type: 'input',
            label: '标题',
            placeholder: '请输入标题'
          },
          'jump_content': {
            type: 'input',
            label: '跳转内容',
            placeholder: '跳转内容'
          },
          'order': {
            type: 'input',
            label: '排序',
            placeholder: '排序'
          },
          'type': {
            type: 'select',
            label: '类型',
            placeholder: '请选择',
            option: [
              {
                value: 1,
                label: '服务类'
              },
              {
                value: 2,
                label: '行业平台'
              }, {
                value: 3,
                label: '验证码'
              },
              {
                value: 4,
                label: '综合SMS平台'
              }
            ]
          },
          'image_path': {
            type: 'image',
            label: '图片',
            placeholder: '请上传图片'
          },
          'content': {
            type: 'input',
            label: '简介',
            inpType: 'textarea',
            placeholder: "请输入简介"
          }
        },
        screen: {
          page: 1,
          page_num: 10
        },
        page: 1,
        total: 0
      }
    },
    components: {
      vScreen,
      vPagination,
      vCard
    },
    mounted() {
      this.screen.page = parseInt(localStorage.getItem("goodList")) || 1
      this.page = this.screen.page
      this.getDownload()
    },
    methods: {
      getDownload() {
        let that = this
        that.$request({
          url: 'downloadcenter/getDownloadCenter',
          success(res) {
            that.list = that.disDownload(res.DownloadCenter)
          }
        })
      },
      getOneInfo(id) {
        let that = this
        that.$request({
          url: 'downloadcenter/getDownloadCenter',
          data: {id},
          success(res) {
            that.ruleForm = res.DownloadCenter || {}
            that.cardStatus = true
          }
        })
      },
      disDownload(data) {
        for (let i = 0; i < data.length; i++) {
          let text = ''
          switch (parseInt(data[i].type)) {
            case 1:
              text = '服务类';
              break;
            case 2:
              text = '行业平台';
              break;
            case 3:
              text = '验证码';
              break;
            case 4:
              text = '综合SMS平台';
              break;
          }
          data[i]._type = text
        }
        return data
      },
      showCard() {
        this.ruleForm = {}
        this.cardStatus = true
      },
      hideCard() {
        this.cardStatus = false
      },
      sumbit(data) {
        this.ruleForm.id ? this.edit(data) : this.add(data)
      },
      add(data) {
        let that = this
        that.$request({
          url: 'downloadcenter/addDownloadCenter',
          data: data.ruleForm,
          form: 1,
          success(res) {
            that.cardStatus = false
            that.ruleForm = {}
            that.getDownload()
          }
        })
      },
      edit(data) {
        let that = this
        that.$request({
          url: 'downloadcenter/updateDownloadCenter',
          data: data.ruleForm,
          form: 3,
          success(res) {
            that.ruleForm = {}
            that.getDownload()
            that.cardStatus = false
          }
        })
      },
      pageChange(obj) {
        this.screen.page = obj.page
      },
    }
  }
</script>

<style scoped>
</style>
