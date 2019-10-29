<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品表格列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加表格模板</el-button>
    </div>

    <el-table :data="tabbleList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="50"></el-table-column>
      <el-table-column prop="name" label="表格名称" width="100"></el-table-column>
      <el-table-column prop="options" label="模板列表"></el-table-column>
      <el-table-column prop="create_time" width="200" label="创建时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getSheetInfo(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :num='num' :total="total" :page="page"></v-pagination>

    <v-card name='添加商品表格模板' width="110" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm"
            :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

  </div>
</template>

<script>

  import vPagination from '../../component/pagination'
  import vCard from '../../component/card'

  export default {
    data() {
      return {
        num: 1,
        cardStatus: false,
        ruleForm: {},
        rules: ['name', 'options'],
        ruleType: {
          'name': {
            type: 'input',
            label: '表格名称',
            placeholder: '请输入表格名称'
          },
          'options': {
            type: 'select',
            label: '表格模板列表',
            placeholder: '请选择表格模板',
            multiple: true,
            val: 'id',
            lab: 'title',
            option: []
          }
        },
        screen: {
          page: 1,
          page_num: 10
        },
        page: 1,
        tabbleList: [],
        total: 0
      }
    },
    components: {
      vPagination,
      vCard
    },
    mounted() {
      this.getTabbleList()
      this.getTemplate()
    },
    methods: {
      showCard() {
        this.ruleForm = {}
        this.cardStatus = true
      },
      hideCard() {
        this.cardStatus = false
      },
      getTemplate() {
        this.$request({
          url: 'goods/getSheetOption',
          success: (res) => {
            this.ruleType['options'].option = res.options || []
          }
        })
      },
      sumbit(data = {}) {
        data.ruleForm.options = data.ruleForm.options.join(',')
        data.ruleForm.id ? this.editSheet(data.ruleForm) : this.addSheet(data.ruleForm)
      },
      editSheet(ruleForm) {
        this.$request({
          data: ruleForm,
          url: 'goods/editSheet',
          form: 3,
          success: (res) => {
            this.ruleForm = {}
            this.getTabbleList()
            this.cardStatus = false
          },

        })
      },
      addSheet(ruleForm) {
        this.$request({
          data: ruleForm,
          url: 'goods/addSheet',
          form: 1,
          success: (res) => {
            this.ruleForm = {}
            this.getTabbleList()
            this.cardStatus = false
          }
        })
      },
      getSheetInfo(id) {
        this.$request({
          data: {
            id: id
          },
          url: 'goods/getSheetInfo',
          success: (res) => {
            res.sheet.options = res.sheet.options.map((val) => {
              return val.id
            })
            this.ruleForm = res.sheet
            this.cardStatus = true
          }
        })
      },
      pageChange(obj) {
        this.screen.page = obj.page
        this.getTabbleList()
      },
      getTabbleList() {
        let that = this;
        that.$request({
          data: that.screen,
          url: 'goods/getSheet',
          success(res) {
            that.tabbleList = res.sheetlist
            that.total = res.total || 0;
          }
        })
      }
    }
  }
</script>

<style scoped>
</style>
