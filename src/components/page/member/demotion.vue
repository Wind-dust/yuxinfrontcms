<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员降级</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">降级</el-button>
  </div>

    <el-table :data="admin_bank" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="uid" label="降级的uid" ></el-table-column>
      <el-table-column  prop="user_identityText" label="降级后的身份" ></el-table-column>
      <el-table-column  prop="boss_uid" label="降级后的上级boss" >
      </el-table-column>
      <el-table-column  prop="content" label="	降级原因描述" >
      </el-table-column>
      <el-table-column  prop="create_time" label="创建时间" >
      </el-table-column>
      <el-table-column fixed="right" label="操作"  width="350">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.order_list.length > 0" size="small" @click="lookList(scope.row.order_list)">查看未完成订单</el-button>
          <el-button type="primary" v-if="scope.row.uid_list.length > 0" size="small" @click="lookList(scope.row.uid_list)">可获收益会员列表</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :total="total"></v-pagination>
    
    <div class="cen-card" v-if="listLook">
      <el-card class="box-card" >
        <div slot="header" class="clearfix">
            <span>信息查看</span>
          </div>
        <el-form label-width="0px" >
          <el-form-item   >
            <div class="infoList">
            <span class="li" v-for="(v,k) in list" :key="k">{{v}}</span>
            </div>
          </el-form-item>
          <el-form-item class="flex-cen">
            <el-button  @click="hidelistLook('updateMenu')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <v-card name='会员降级' width="100" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

  </div>
</template>

<script>
import {getIdentity} from '../../../assets/js/common'
import vPagination from '../../component/pagination'
import vCard from '../../component/card'
export default {
  data(){
    return {
      cardStatus:false,
      ruleForm:{},
      rules:['mobile','user_identity',],
      ruleType:{
        'mobile':{
          type:'number',
          label:'用户手机号',
          placeholder:'请输入用户手机号'
        },
        'user_identity':{
          type:'select',
          label:'降级后身份',
          placeholder:'请选择降级后身份',
          option:[{
            value: 1,
            label: '普通会员'
          }, {
            value: 2,
            label: '钻石会员'
          }]
        },
        'content':{
          type:'input',
          inpType:'textarea',
          label:'降级原因',
          placeholder:'请输入降级原因'
        }
      },
      screen:{
        page:1,
        page_num:10
      },
      admin_bank:[],
      listLook:false,
      list:[],
      total:0
    }
  },
  components:{
      vPagination,
      vCard
  },
  mounted(){
    this.getUserdemotionlist()
  },
  methods: {
    showCard(){
      this.ruleForm = {}
      this.cardStatus = true
    },
    hideCard(){
      this.cardStatus = false
    },
    lookList(data){
      this.list = data
      this.listLook = true
    },
    hidelistLook(){
      this.listLook = false
    },
    sumbit(data){
      let that =this;
      that.$request({
        data: data.ruleForm,
        url: 'user/userdemotion',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getUserdemotionlist()
          that.cardStatus = false
        }
      })
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getUserdemotionlist()
    },
    getUserdemotionlist(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'user/userdemotionlist',
        success(res){
          that.admin_bank = that.disUserdemotionlist(res.data)
          that.total = res.total || 0;
        }
      })
    },
    disUserdemotionlist(data = []) {
        let arr = data,
            len = arr.length
        for (let i = 0; i < len; i++) {
            arr[i].user_identityText = getIdentity(arr[i].after_identity)
        }
        return arr
    }
  }
}
</script>

<style scoped>
.infoList{
  width: 100%;
  max-height: 700px;
  overflow: auto;
}
.infoList .li{
  display: inline-block;
  float: left;
  padding: 0 10px;
  line-height: 28px;
  font-size: 16px;
  cursor: pointer;
}
.infoList .li:hover{
  color: #409EFF;
}
</style>
