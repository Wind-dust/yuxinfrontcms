<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>金融管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加银行</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加银行</el-button>
  </div>

    <v-screen :screen="screenQuery" @query="onQuery" ></v-screen>

    <el-table :data="admin_bank" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="abbrev" label="银行英文缩写名" ></el-table-column>
      <el-table-column  prop="bank_name" label="银行全称" ></el-table-column>
      <el-table-column  prop="icon_img" label="银行图标" >
        <template slot-scope="scope">
          <img :src="scope.row.icon_img" width="40"  class="head_pic"/>
        </template>
      </el-table-column>
      <el-table-column  prop="bg_img" label="银行背景图片" >
        <template slot-scope="scope">
          <img :src="scope.row.bg_img" width="40"  class="head_pic"/>
        </template>
      </el-table-column>
      <el-table-column  prop="status" label="状态" >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="statusChange(scope.row.id,scope.row.status)" :active-value="1" :inactive-value="2"></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作"  width="350">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getAdminBankInfo(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :num='num' :total="total"></v-pagination>

    <v-card name='支持银行' width="120" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

  </div>
</template>

<script>
import vScreen from '../../component/screen'
import vPagination from '../../component/pagination'
import vCard from '../../component/card'
export default {
  data(){
    return {
      num:1,
      cardStatus:false,
      ruleForm:{},
      rules:['abbrev','bank_name',],
      ruleType:{
        'abbrev':{
          type:'input',
          label:'银行英文缩写名',
          placeholder:'请输入银行英文缩写名'
        },
        'bank_name':{
          type:'input',
          label:'银行全称',
          placeholder:'请输入银行全称'
        },
        'icon_img':{
          type:'image',
          label:'银行图标',
        },
        'bg_img':{
          type:'image',
          label:'银行背景图',
        },
        'status':{
          type:'select',
          label:'状态',
          placeholder:'请选择(默认停用)',
          option:[{
            value: 1,
            label: '启用'
          }, {
              value: 2,
              label: '停用'
          }]
        },
      },
      screen:{
        page:1,
        page_num:10
      },
      screenQuery:[{
        ref:'abbrev',
        label:'银行英文缩写名',
        placeholder:'请输入银行英文缩写名',
        type:'input',
        content:'',
      },{
        ref:'bank_name',
        label:'银行全称',
        type:'input',
        content:'',
        placeholder:'请输入银行全称'
      },{
        ref:'status',
        label:'状态',
        type:'select',
        content:'',
        option:[{
            value: '',
            label: '全部'
        }, {
            value: 1,
            label: '启用'
        }, {
            value: 2,
            label: '停用'
        }]
      }],
      admin_bank:[],
      admin_bankId:'',
      total:0
    }
  },
  components:{
      vScreen,
      vPagination,
      vCard
  },
  mounted(){
    this.getAdminBank()
  },
  methods: {
    showCard(){
      this.ruleForm = {}
      this.cardStatus = true
    },
    hideCard(){
      this.cardStatus = false
    },
    statusChange(id,status){
      let that =this;
      that.$request({
        data: {
          id:id,
          status:status
        },
        url: 'admin/editAdminBank',
        success(res){
          that.getAdminBank()
        }
      })
    },
    sumbit(data){
      data.ruleForm.id ? this.editAdminBank(data.ruleForm) : this.addAdminBank(data.ruleForm)
    },
    addAdminBank(data){
      let that =this;
      that.$request({
        data: data,
        url: 'admin/addAdminBank',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getAdminBank()
          that.cardStatus = false
        }
      })
    },
    editAdminBank(data){
      let that =this;
      that.$request({
        data: data,
        url: 'admin/editAdminBank',
        form:3,
        success(res){
          that.ruleForm = {}
          that.getAdminBank()
          that.cardStatus = false
        }
      })
    },
    onQuery(screen){
      this.extend(this.screen,screen);
      this.screen.page = 1;
      this.num++;
      this.getAdminBank();
    },
    extend(target, options) {
        for (name in options) {
            target[name] = options[name];
        }
        return target;
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getAdminBank()
    },
    getAdminBankInfo(id){
      let that =this;
      that.$request({
        data: {
          id:id
        },
        url: 'admin/getAdminBank',
        success(res){
          that.ruleForm = res.admin_bank || {}
          that.cardStatus = true
        }
      })
    },
    getAdminBank(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'admin/getAdminBank',
        success(res){
          that.admin_bank = res.admin_bank
          that.total = res.total || 0;
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
