<template>
  <div class="address">
    <Header title="选择收货地址" :isLeft="true"/>
    <div class="city_search">
      <div class="search">
        <span class="city" @click="$router.push('/city')">
          {{city}}
          <i class="fa fa-angle-down"></i>
        </span>
        <i class="fa fa-search"></i>
        <input type="text" v-model="search_val" placeholder="小区/写字楼/学校等">
      </div>
      <Location @clickaddress="selectAddress" :address="address"/>
    </div>
    <div class="area">
      <ul class="area_list" v-for="(item,index) in areaList" :key="index">
        <li @click="selectAddress(item)">
          <h4>{{item.name}}</h4>
          <p>{{item.district}}{{item.address}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Header from 'components/Header';
import Location from 'components/Location'
export default {
  name:'Address',
  data(){
    return {
      city:'',//当前的城市
      search_val:'',
      areaList:[]
    }
  },
  components:{
    Header,
    Location
  },

  computed:{
    // 传递address值给对应的组件
    address(){
      return this.$store.getters.location.formattedAddress;
    }
  },
  watch:{
    search_val() {
      this.searchPlace();
    }
  },
  methods:{
    // 获取输入后下拉的地点表
    searchPlace(){
      const self = this;
      // console.log(this.search_val);
      AMap.plugin('AMap.Autocomplete', function(){
        // 实例化Autocomplete
        var autoOptions = {
          //city 限定城市，默认全国
          city: self.city
        }
        var autoComplete= new AMap.Autocomplete(autoOptions);
        autoComplete.search(self.search_val, function(status, result) {
          // 搜索成功时，result即是对应的匹配数据
          // console.log(result);
          self.areaList = result.tips;
        })
      })
    },
    // 点击地点表后更新当前地址并回退到上一层
    selectAddress(item){
      // 设置地址
      if(item){
        this.$store.dispatch('setAddress',item.district+item.address+item.name);
      }else{
        this.$store.dispatch('setAddress',this.address);
      }
      // 转跳路由到home
      this.$router.push('/home');
    }
  },
  beforeRouteEnter(to,from,next){
    // console.log(to.params.city);
    next((vm)=>{//vm代表进入后的vue实例，不能通过this
      vm.city = to.params.city;//通过路由中的params的city来赋值该组件的city
    })
  }
}
</script>

<style scoped>
.address{
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding-top: 45px;
}

.city_search {
  background-color: #fff;
  padding: 10px 20px;
  color: #333;
}

.search {
  background-color: #eee;
  height: 40px;
  border-radius: 10px;
  box-sizing: border-box;
  line-height: 40px;
}
.search .city {
  padding: 0 10px;
}
.city i {
  margin-right: 10px;
}
.search input {
  margin-left: 5px;
  background-color: #eee;
  outline: none;
  border: none;
}

.area {
  margin-top: 16px;
  background: #fff;
}
.area li {
  border-bottom: 1px solid #eee;
  padding: 8px 16px;
  color: #aaa;
}
.area li h4 {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}
</style>