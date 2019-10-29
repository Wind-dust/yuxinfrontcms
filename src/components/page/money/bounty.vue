<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>金融管理</el-breadcrumb-item>
        <el-breadcrumb-item>奖励金提现</el-breadcrumb-item>
      </el-breadcrumb>
  </div>

    <v-screen :screen="screenQuery" @query="onQuery" ></v-screen>

    <el-table :data="logTransfer" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="user_name" label="提现人名称" ></el-table-column>
      <el-table-column  prop="bank_mobile" label="手机号码" ></el-table-column>
      <el-table-column  prop="bank_name" label="开户银行" ></el-table-column>
      <el-table-column  prop="bank_card" width="170" label="银行卡号" ></el-table-column>
      <el-table-column  prop="money" label="提现金额" ></el-table-column>
      <el-table-column  prop="create_time" label="提现时间	" ></el-table-column>
      <el-table-column  prop="message" label="描述" ></el-table-column>
      <el-table-column  prop="statusText" label="状态" ></el-table-column>
      <el-table-column fixed="right" label="操作"  width="350">
        <template slot-scope="scope">
          <el-button type="primary" size="small" v-if="scope.row.status == 1"  @click="checkUserTransfer(scope.row.id,2)">审核通过</el-button>
          <el-button type="danger" v-if="scope.row.status == 1"  size="small" @click="showCard(scope.row.id)">审核不通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :num='num' :total="total"></v-pagination>

    <v-card name='提现' :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

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
      rules:['message'],
      ruleType:{
        'message':{
          type:'input',
          inpType:'textarea',
          label:'详细描述',
          placeholder:'请输入详细描述'
        }
      },
      screen:{
        page:1,
        stype:4,
        page_num:10
      },
      screenQuery:[{
        ref:'bank_card',
        label:'银行卡号',
        placeholder:'请输入银行卡号',
        type:'input',
        content:'',
      },{
        ref:'bank_mobile',
        label:'银行开户手机号',
        placeholder:'请输入银行开户手机号',
        type:'input',
        content:'',
      },{
        ref:'user_name',
        label:'银行开户人',
        type:'input',
        content:'',
        placeholder:'请输入银行开户人'
      }],
      logTransfer:[],
      logTransferId:'',
      total:0
    }
  },
  components:{
      vScreen,
      vPagination,
      vCard
  },
  mounted(){
    this.getLogTransfer()
  },
  methods: {
    showCard(id){
      this.logTransferId = id
      this.cardStatus = true
    },
    hideCard(){
      this.cardStatus = false
    },
    sumbit(data){
      this.checkUserTransfer(this.logTransferId,3,data.ruleForm.message)
    },
    checkUserTransfer(id, status,msg = ''){
      let that =this
      that.$request({
        data: {
          id: id,
          status: status,
          message: msg
        },
        form:4,
        url: 'admin/checkUserBountyTransfer',
        success(res){
          that.logTransferId = ''
          that.cardStatus = false
          that.getLogTransfer()
        }
      })
    },
    onQuery(screen){
      this.extend(this.screen,screen);
      this.screen.page = 1;
      this.num++
      this.getLogTransfer();
    },
    extend(target, options) {
        for (name in options) {
            target[name] = options[name];
        }
        return target;
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getLogTransfer()
    },
    getLogTransfer(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'admin/getLogTransfer',
        success(res){
          that.logTransfer = that.dislogTransfer(res.log_transfer)
          that.total = res.total || 0;
        }
      })
    },
    dislogTransfer(data = []) {
        let arr = data,
            len = arr.length
        for (let i = 0; i < len; i++) {
            arr[i].invoiceText = this.getInvoice(arr[i].invoice)
            arr[i].statusText = this.getStatus(arr[i].status)
        }
        return arr
    },
    getInvoice(n) {
        let text = ''
        switch (parseInt(n)) {
            case 1:
                text = '是'
                break;
            case 2:
                text = '否'
                break;
        }
        return text
    },
    getStatus(n) {
        let text = ''
        switch (parseInt(n)) {
            case 1:
                text = '待审核'
                break;
            case 2:
                text = '审核通过'
                break;
            case 3:
                text = '审核不通过'
                break;
        }
        return text
    }
  }
}
</script>

<style scoped>
</style>
