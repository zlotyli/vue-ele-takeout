<template>
  <div class="city">
    <div class="search_wrap">
      <div class="search">
        <i class="fa fa-search"></i>
        <input type="text" placeholder="输入城市名" v-model="city_val">
      </div>
      <button @click="$router.push({name:'address',params:{city:city}})">取消</button>
    </div>
    <div style="height:100%" v-if="searchList.length === 0">
      <div class="location">
        <Location @clickaddress="selectCity({name:city})" :address="city"/>
      </div>
      <Alphabet :cityInfo="cityInfo" :keys="keys" ref="allcity" @select-city="selectCity"/>
    </div>
    <div class="search_list" v-else>
      <ul>
        <li v-for="(item,index) in searchList" :key="index" @click="selectCity(item)">{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Location from 'components/Location';
import Alphabet from 'components/Alphabet';
export default {
  name:'City',
  data(){
    return {
      city_val:'',
      cityInfo:null,
      keys:[],
      // 只获取到所有城市名
      allCities:[],
      searchList:[]
    };
  },
  computed:{
    city(){
      return this.$store.getters.location.addressComponent.city || 
              this.$store.getters.location.addressComponent.province;
    }
  },
  components:{
    Location,
    Alphabet
  },
  created(){
    this.getCityInfo();
  },
  watch:{
    // 观测输入框中的值，用显示对应的城市列表
    city_val(){
      // console.log(this.city_val);
      this.searchCity();
    }
  },
  methods:{
    getCityInfo(){
      // 请求城市数据
      this.$axios("/api/posts/cities")
        .then(res=>{
          // console.log(res.data);
          this.cityInfo = res.data;
          // 处理keys--将key单独封装到一个数组中
          this.keys = Object.keys(res.data);
          // hotcities这个key需要移除掉
          this.keys.pop();
          // keys排序
          this.keys.sort();

          // 请求完数据后进行滚动优化
          this.$nextTick(()=>{
            this.$refs.allcity.initScroll();
          })
          
          // 存储所有城市用于搜索过滤
          this.keys.forEach(key=>{
            this.cityInfo[key].forEach(city=>{
              this.allCities.push(city);
            })
          })
          // console.log(this.allCities);

        })
        .catch(err=>{
          console.log(err);
        })
    },
    selectCity(city){
      // console.log(city);
      this.$router.push({name:"address",params:{city:city.name}});
    },
    // 显示搜索框中对应的城市
    searchCity(){
      if(!this.city_val){
        // 如果搜索框为空
        this.searchList = [];
      }else{
        // 根据输入框的关键字来检索城市，并存到searchList数组中
        this.searchList = this.allCities.filter(item=>{
          return item.name.indexOf(this.city_val) !== -1;
        })
        // console.log(this.searchList);
      }
    }
  }
}
</script>

<style scoped>
.city {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding-top: 45px;
}
.search_wrap {
  position: fixed;
  top: 0;
  height: 45px;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 3px 16px;
  display: flex;
  justify-content: space-between;
}
.search {
  background-color: #eee;
  border-radius: 10px;
  line-height: 40px;
  width: 85%;
  box-sizing: border-box;
  padding: 0 16px;
}
.search input {
  background: #eee;
  outline: none;
  border: none;
  margin-left: 5px;
}
.search_wrap button {
  outline: none;
  color: #009eef;
  font-weight: 600;
}

.location {
  background: #fff;
  padding: 8px 16px;
  height: 65px;
  box-sizing: border-box;
}

.search_list {
  background: #fff;
  padding: 5px 16px;
}
.search_list li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>