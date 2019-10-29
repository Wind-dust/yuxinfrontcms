<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>金融管理</el-breadcrumb-item>
        <el-breadcrumb-item>开通boss</el-breadcrumb-item>
      </el-breadcrumb>
  </div>

    <v-screen :screen="screenQuery" @query="onQuery" ></v-screen>

    <el-table :data="shopApplyList" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="refe_uname" label="邀请人昵称" ></el-table-column>
      <el-table-column  prop="target_uname" label="被邀请人昵称" ></el-table-column>
      <el-table-column  prop="target_nickname" label="被邀请人姓名" ></el-table-column>
      <el-table-column  prop="target_sexText" label="被邀请人性别" ></el-table-column>
      <el-table-column  prop="target_mobile" label="被邀请人手机号" ></el-table-column>
      <el-table-column  prop="target_idcard" width="170" label="被邀请人身份证号" ></el-table-column>
      <el-table-column  prop="create_time" label="申请时间" ></el-table-column>
      <el-table-column  prop="statusText" label="状态" ></el-table-column>
      <el-table-column fixed="right" label="操作"  width="350">
        <template slot-scope="scope">
          <el-button type="primary" size="small" v-if="scope.row.status == 1"  @click="auditShopApply(scope.row.id,2)">财务审核通过</el-button>
          <el-button type="primary" size="small" v-if="scope.row.status == 2"  @click="auditManagerShopApply(scope.row.id,3)">经理审核通过</el-button>

          <el-button type="danger" v-if="scope.row.status == 1"  size="small" @click="auditShopApply(scope.row.id,4)">审核不通过</el-button>
          <el-button type="danger" v-if="scope.row.status == 2"  size="small" @click="auditManagerShopApply(scope.row.id,4)">审核不通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :num='num' :total="total"></v-pagination>

  </div>
</template>

<script>
import {getSexText, getShopApplyStatus} from '../../../assets/js/common'
import vScreen from '../../component/screen'
import vPagination from '../../component/pagination'
export default {
  data(){
    return {
      num:1,
      screen:{},
      screenQuery:[{
        ref:'refe_uname',
        label:'邀请人昵称',
        placeholder:'请输入邀请人昵称',
        type:'input',
        content:'',
      },{
        ref:'target_uname',
        label:'被邀请人昵称',
        placeholder:'请输入被邀请人昵称',
        type:'input',
        content:'',
      },{
        ref:'target_nickname',
        label:'被邀请人姓名',
        type:'input',
        content:'',
        placeholder:'请输入被邀请人姓名'
      },{
        ref:'target_sex',
        label:'被邀请人性别',
        type:'select',
        content:'',
        option:[{
            value: '',
            label: '全部'
        }, {
            value: 1,
            label: '男'
        }, {
            value: 2,
            label: '女'
        }]
      },{
        ref:'target_mobile',
        label:'被邀请人手机号',
        placeholder:'请输入被邀请人手机号',
        type:'input',
        content:'',
      },{
        ref:'target_idcard',
        label:'被邀请人身份证号',
        placeholder:'请输入被邀请人身份证号',
        type:'input',
        content:'',
      },{
        ref:'status',
        label:'申请进度',
        type:'select',
        content:'',
        option:[{
            value: '',
            label: '全部'
        }, {
            value: 1,
            label: '提交申请'
        }, {
            value: 2,
            label: '财务审核通过'
        }, {
            value: 3,
            label: '经理审核通过'
        }, {
            value: 4,
            label: '审核不通过'
        }]
      }],
      shopApplyList:[],
      total:0
    }
  },
  components:{
      vScreen,
      vPagination
  },
  mounted(){
    this.getShopApplyList()
  },
  methods: {
    onQuery(screen){
      this.screen = screen
      this.screen.page = 1
      this.num++
      this.getShopApplyList()
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getShopApplyList()
    },
    auditShopApply(id,status){
      let that =this
      that.$request({
        data: {
          id:id,
          status:status
        },
        form:4,
        url: 'Rights/auditShopApply',
        success(res){
          that.getShopApplyList()
        }
      })
    },
    auditManagerShopApply(id,status){
      let that =this
      that.$request({
        data: {
          id:id,
          status:status
        },
        form:4,
        url: 'Rights/auditManagerShopApply',
        success(res){
          that.getShopApplyList()
        }
      })
    },
    getShopApplyList(){
      let that =this
      that.screen.page_num = 10
      that.$request({
        data: that.screen,
        url: 'Rights/getShopApplyList',
        success(res){
          that.shopApplyList = that.disShopApplyList(res.data)
          that.total = res.total;
        }
      })
    },
    disShopApplyList(data = []) {
        let arr = data,
            len = arr.length
        for (let i = 0; i < len; i++) {
            arr[i].target_sexText = getSexText(arr[i].target_sex)
            arr[i].statusText = getShopApplyStatus(arr[i].status)
        }
        return arr
    },
  }
}
</script>

<style scoped>

</style>
