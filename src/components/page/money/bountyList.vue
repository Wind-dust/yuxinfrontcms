<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>金融管理</el-breadcrumb-item>
        <el-breadcrumb-item>奖励金列表</el-breadcrumb-item>
      </el-breadcrumb>
  </div>

    <v-screen :screen="screenQuery" @query="onQuery" ></v-screen>

    <el-table :data="diamondvipNetPush" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="user.nick_name" label="boss名称" ></el-table-column>
      <el-table-column  label="统计类型" >
        <template slot-scope="">
          <div>钻石网推</div>
        </template>
      </el-table-column>
      <el-table-column  prop="count" label="统计数量" ></el-table-column>
      <el-table-column  prop="cost" label="金额" ></el-table-column>
      <el-table-column  prop="create_time" label="开始时间" ></el-table-column>
      <el-table-column  prop="update_time" label="最后更新时间" ></el-table-column>
      <el-table-column  prop="statusText" label="状态" ></el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :num='num' :total="total"></v-pagination>

  </div>
</template>

<script>
import vScreen from '../../component/screen'
import vPagination from '../../component/pagination'
export default {
  data(){
    return {
      num:1,
      screen:{
        page:1,
        page_num:10
      },
      screenQuery:[{
        ref:'status',
        label:'状态',
        type:'select',
        content:'',
        option:[{
            value: '',
            label: '全部'
        }, {
            value: 1,
            label: '待发放'
        }, {
            value: 2,
            label: '已经发放'
        }, {
            value: 3,
            label: '取消发放'
        }]
      }],
      diamondvipNetPush:[],
      total:0
    }
  },
  components:{
      vScreen,
      vPagination,
  },
  mounted(){
    this.getDiamondvipNetPush()
  },
  methods: {
    onQuery(screen){
      this.extend(this.screen,screen);
      this.screen.page = 1;
      this.num++;
      this.getDiamondvipNetPush();
    },
    extend(target, options) {
        for (name in options) {
            target[name] = options[name];
        }
        return target;
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getDiamondvipNetPush()
    },
    getDiamondvipNetPush(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'Rights/getDiamondvipNetPush',
        success(res){
          that.diamondvipNetPush = that.disNetPush(res.diamondvipNetPush)
          that.total = res.total || 0;
        }
      })
    },
    disNetPush(data = []) {
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
                text = '待发放'
                break;
            case 2:
                text = '已经发放'
                break;
            case 3:
                text = '取消发放'
                break;
        }
        return text
    },
  }
}
</script>

<style scoped>
</style>
