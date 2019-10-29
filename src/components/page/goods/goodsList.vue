<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品库</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加商品</el-button>
  </div>

    <v-screen :screen="screenQuery" @query="onQuery" ></v-screen>

    <el-table :data="goodslist" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="100"></el-table-column>
      <el-table-column  prop="image" label="图片" >
        <template slot-scope="scope">
          <img :src="scope.row.image" width="40"  class="head_pic"/>
        </template>
      </el-table-column>
      <el-table-column  prop="goods_name" label="商品名称" ></el-table-column>
      <el-table-column  prop="subtitle" label="商品标题" ></el-table-column>
      <el-table-column  prop="supplier" label="前端供应商名称" ></el-table-column>
      <el-table-column  prop="supplier_title" label="后端供应商名称" ></el-table-column>
      <el-table-column  prop="cate" label="分类名称" ></el-table-column>
      <el-table-column  prop="goods_type_text" label="商品类型" ></el-table-column>
      <el-table-column  prop="target_users_text" label="适用人群" ></el-table-column>
      <el-table-column  prop="status" label="状态" >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="statusChange(scope.row.id,scope.row.status)" :active-value="1" :inactive-value="2"></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="gogoodslInfo(scope.row.id,scope.row.goods_type)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :num='num' :total="total" :page="page"></v-pagination>

    <v-card name='添加商品基本信息' width="110" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

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
      rules:['goods_name','supplier_id','cate_id','image','goods_type'],
      ruleType:{
        'goods_name':{
          type:'input',
          label:'商品名称',
          placeholder:'请输入商品名称'
        },
        'subtitle':{
          type:'input',
          inpType:'textarea',
          label:'商品标题',
          placeholder:'请输入商品标题'
        },
        'supplier_id':{
          type:'select',
          label:'供应商',
          placeholder:'请选择供应商',
          filterable:true,
          val:'id',
          lab:'name',
          option:[]
        },
        'cate_id':{
          type:'cascader',
          label:'三级分类',
          placeholder:'请选择三级分类',
          props:{
            value:'id',
            label:'type_name',
            children:'_child',
            emitPath:false
          },
          option:[]
        },
        'goods_type':{
          type:'select',
          label:'商品类型',
          placeholder:'请选择商品类型',
          option:[{
            value:1,
            label:'普通商品'
          },{
            value:2,
            label:'虚拟商品'
          }]
        },
        // 'sheet_id':{
        //   type:'select',
        //   label:'表格模板',
        //   placeholder:'请选择表格模板',
        //   val:'id',
        //   lab:'name',
        //   option:[]
        // },
        'target_users':{
          type:'select',
          label:'适用人群',
          placeholder:'请选择适用人群',
          option:[{
            value:1,
            label:'全部'
          },{
            value:2,
            label:'钻石及以上'
          },{
            value:3,
            label:'创业店主及以上'
          },{
            value:4,
            label:'合伙人及以上'
          }]
        },
        'giving_rights':{
          type:'select',
          label:'商品赠送权益',
          placeholder:'请选择商品赠送权益',
          option:[{
            value:1,
            label:'不赠送'
          },{
            value:2,
            label:'钻石'
          }]
        },
        'image':{
          type:'image',
          label:'产品标题图',
          placeholder:'请上传图片'
        },
        'share_image':{
          type:'image',
          label:'商品分享标题图'
        }
      },
      screen:{
        page:1,
        page_num:10
      },
      page:1,
      screenQuery:[{
        ref:'goods_name',
        label:'商品名称',
        placeholder:'请输入商品名称',
        type:'input',
        content:'',
      },{
        ref:'supplier_name',
        label:'前端供应商名称',
        type:'input',
        content:'',
        placeholder:'请输入前端供应商名称'
      },{
        ref:'supplier_title',
        label:'后端供应商名称',
        type:'input',
        content:'',
        placeholder:'请输入后端供应商名称'
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
            label: '已上架'
        }, {
            value: 2,
            label: '已下架'
        }]
      }],
      target_users_json:{
        1:'全部',
        2:'钻石及以上',
        3:'创业店主及以上',
        4:'合伙人及以上',
      },
      goods_type_json:{
        1:'普通商品',
        2:'虚拟商品'
      },
      goodslist:[],
      total:0
    }
  },
  components:{
      vScreen,
      vPagination,
      vCard
  },
  mounted(){
    // this.screen.page = parseInt(localStorage.getItem("goodList")) || 1
    // this.page = this.screen.page
    this.getgoodslist()
    this.getAllSuppliers()
    this.getAllCateList()
    // this.getSheet()
  },
  methods: {
    getAllSuppliers(){
      let that =this;
      that.$request({
        url: 'suppliers/getsuppliersall',
        success(res){
          that.ruleType['supplier_id'].option = res.data || []
        }
      })
    },
    getAllCateList(){
      let that =this;
      that.$request({
        url: 'category/allCateList',
        success(res){
          that.ruleType['cate_id'].option = res.data || []
        }
      })
    },
    getSheet(){
      let that =this;
      that.$request({
        data:{pageNum:1000},
        url: 'goods/getSheet',
        success(res){
          that.ruleType['sheet_id'].option = res.sheetlist || []
        }
      })
    },
    gogoodslInfo(id,type){
      this.$router.push({ path: '/goodsList/goodDetails', query:{
        id:id,
        goods_type:type
      } })
    },
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
          type:status
        },
        form:3,
        url: 'goods/updowngoods',
        error(){
          that.getgoodslist()
        }
      })
    },
    sumbit(data){
      let that =this;
      that.$request({
        data: data.ruleForm,
        url: 'goods/saveaddgoods',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getgoodslist()
          that.cardStatus = false
        }
      })
    },
    sumbit(data){
      let that =this;
      that.$request({
        data: data.ruleForm,
        url: 'goods/saveaddgoods',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getgoodslist()
          that.cardStatus = false
        }
      })
    },
    onQuery(screen){
      this.extend(this.screen,screen);
      this.screen.page = 1;
      // localStorage.setItem("goodList",1)
      this.num++
      this.getgoodslist();
    },
    extend(target, options) {
        for (name in options) {
            target[name] = options[name];
        }
        return target;
    },
    pageChange(obj){
        this.screen.page = obj.page
        // localStorage.setItem("goodList", obj.page)
        this.getgoodslist()
    },
    getgoodslist(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'goods/getgoodslist',
        success(res){
          that.goodslist = !res.data? [] : res.data.map(val=>{
            val.target_users_text = that.target_users_json[val.target_users]
            val.goods_type_text = that.goods_type_json[val.goods_type]
            return val
          })
          that.total = res.total || 0;
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
