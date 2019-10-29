<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>金融管理</el-breadcrumb-item>
        <el-breadcrumb-item>卡包</el-breadcrumb-item>
      </el-breadcrumb>
  </div>

    <v-screen :screen="screenQuery" @query="onQuery" ></v-screen>

    <el-table :data="userBank" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="users.nick_name" label="合伙人" ></el-table-column>
      <el-table-column  prop="users.mobile" label="手机号码(注册预留)" ></el-table-column>
      <el-table-column  prop="user_name" label="真实姓名" ></el-table-column>
      <el-table-column  prop="bank_card" width="170" label="银行卡号" ></el-table-column>
      <el-table-column  prop="admin_bank.bank_name" label="开户银行" ></el-table-column>
      <el-table-column  prop="bank_add"  label="开户支行" ></el-table-column>
      <el-table-column  prop="bank_mobile" label="手机号" ></el-table-column>
      <el-table-column  prop="statusText" label="状态" ></el-table-column>
      <el-table-column  prop="message" label="描述" ></el-table-column>
      <el-table-column fixed="right" label="操作"  width="350">
        <template slot-scope="scope">
          <el-button type="primary" size="small" v-if="scope.row.status == 1"  @click="checkUserBank(scope.row.id,4)">进行处理</el-button>
          <el-button type="primary" size="small" v-if="scope.row.status == 4"  @click="checkUserBank(scope.row.id,2)">审核通过</el-button>
          <el-button type="danger" v-if="scope.row.status == 4"  size="small" @click="showCard(scope.row.id)">审核不通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :num='num' :total="total"></v-pagination>

    <div class="cen-card" v-if="card">
      <el-card class="box-card" >
        <div slot="header" class="clearfix">
            <span>组管理</span>
          </div>
        <el-form label-width="80px" :model="errCard" ref="errCard" >
          <el-form-item  label="驳回选项" prop="group_name">
            <el-select class="select" v-for="(v,k) in options" :key="k"  v-model="errCard[v]" placeholder="请选择">
              <el-option v-for="item in errOption" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <i class="el-icon-plus" v-show="options.length < 4" @click="addOption"></i>
            <i class="el-icon-minus" v-show="options.length >1" @click="redOption"></i>
          </el-form-item>
          <el-form-item  label="描述">
            <el-input type="textarea" v-model="errCard.message"  placeholder="请输入描述"></el-input>
          </el-form-item>
          <el-form-item class="flex-cen">
            <el-button  type="primary" @click="sumbit()">确定</el-button>
            <el-button  @click="hideCard(false)">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

  </div>
</template>

<script>
import vScreen from '../../component/screen'
import vPagination from '../../component/pagination'
export default {
  data(){
    return {
      num:1,
      card:false,
      errCard:{},
      options:['1'],
      screen:{},
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
            label: '待处理'
        }, {
            value: 2,
            label: '启用(审核通过'
        }, {
            value: 3,
            label: '停用'
        }, {
            value: 4,
            label: '已处理'
        }, {
            value: 5,
            label: '审核不通过'
        }]
      }],
      errOption:[{
            value: 'bank_mobile',
            label: '手机号码'
        }, {
            value: 'user_name',
            label: '真实姓名'
        }, {
            value: 'bank_card',
            label: '银行卡号'
        }, {
            value: 'bank_add',
            label: '开户支行'
        }],
      userBank:[],
      cardId:'',
      total:0
    }
  },
  components:{
      vScreen,
      vPagination
  },
  mounted(){
    this.getUserBank()
  },
  methods: {
    addOption(){
      this.options.push(this.options.length+1)
    },
    redOption(){
      this.options.pop();
    },
    showCard(id){
      this.cardId = id
      this.card = true
    },
    hideCard(){
      this.card = false
    },
    sumbit(){
      let error_fields = '',len=this.options.length;
      for(let i=0;i<len;i++){
        error_fields += this.errCard[i+1] + ','
      }
      error_fields = error_fields.replace(/,$/gi, "");
      this.errCard.error_fields = error_fields
      this.checkUserBank(this.cardId,5)
    },
    checkUserBank(id, status){
      let that =this
      that.$request({
        data: {
          id: id,
          status: status,
          message: that.errCard.message || '',
          error_fields: that.errCard.error_fields || ''
        },
        form:4,
        url: 'admin/checkUserBank',
        success(res){
          that.cardId = ''
          that.card = false
          that.getUserBank()
        }
      })
    },
    onQuery(screen){
      this.screen = screen
      this.screen.page = 1
      this.num++;
      this.getUserBank()
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getUserBank()
    },
    getUserBank(){
      let that =this
      that.screen.page_num = 10
      that.$request({
        data: that.screen,
        url: 'admin/getUserBank',
        success(res){
          that.userBank = that.disUserBank(res.userbank)
          that.total = res.total || 0;
        }
      })
    },
    disUserBank(data = []) {
        let arr = data,
            len = arr.length
        for (let i = 0; i < len; i++) {
            arr[i].statusText = this.getStatus(arr[i].status)
        }
        return arr
    },
    getStatus(n) {
        let text = ''
        switch (parseInt(n)) {
            case 1:
                text = '待处理'
                break;
            case 2:
                text = '启用(审核通过)'
                break;
            case 3:
                text = '停用'
                break;
            case 4:
                text = '已处理'
                break;
            case 5:
                text = '审核不通过'
                break;
        }
        return text
    },
  }
}
</script>

<style scoped>
.el-icon-plus,
.el-icon-minus{
  margin-left: 10px;
  font-size: 18px;
  color:#e82f28;
  cursor: pointer;
}
.select{
  margin-top: 5px;
}
</style>
