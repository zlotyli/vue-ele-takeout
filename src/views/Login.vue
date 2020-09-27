<template>
  <div class="login">
    <div class="logo">
      <img src="~assets/logo.jpg" alt="">
    </div>
    <!-- 手机号 -->
    <input-group 
      ctype="number" 
      v-model="phone" 
      :cvalue="phone"
      cplaceholder="手机号" 
      :cbtnTitle="btnTitle" 
      :cdisabled="disabled" 
      :cerror="errors.phone"
      @btn-click="getVerifyCode"
    />
    <!-- 验证码 -->
    <input-group 
      ctype="number" 
      v-model="verifyCode" 
      :cvalue="verifyCode"
      cplaceholder="验证码" 
      :cerror="errors.code"
    />
    <!-- 用户服务协议 -->
    <div class="login_des">
      <p>
        新用户登录即自动注册，表示已同意
        <span>《用户服务协议》</span>
      </p>
    </div>
    <!-- 登录按钮 -->
    <div class="login_btn">
      <button :disabled="isClick" @click="handleLogin">登录</button>
    </div>
  </div>
</template>

<script>
import InputGroup from 'components/InputGroup';
export default {
  name:'login',
  data(){
    return{
      phone:'',
      verifyCode:'',
      errors:{},
      btnTitle:'获取验证码',
      disabled:false
    };
  },
  components:{
    InputGroup
  },
  computed:{
    isClick(){
      if(!this.phone||!this.verifyCode) return true;
      else return false;
    }
  },

  methods:{
    getVerifyCode(){
      if(this.validatePhone()){
        // 发送网络请求
        this.$axios.post('/api/posts/sms_send',{
          sid:'dd983a11aa4bdf6ce0f85b3d9dfd89cc',
          token:'c2f24721d702f5a88b352b9c5730b899',
          appid: '381f805c843840428c21e07fb6bddd79',
          templateid: '568319',
          phone:this.phone
        }).then(res=>{
          console.log(res);
          this.validateBtn();
        });
      }
    },
    validateBtn(){
      // 倒计时功能
      let time = 60;
      let timer = setInterval(()=>{
        if(time === 0){
          // 关闭倒计时
          clearInterval(timer);
          this.btnTitle = '获取验证码';
          this.disabled = false;
        }else{
          // 开启倒计时
          this.btnTitle = time+'秒后重试';
          this.disabled = true;
          time--;
        }
      },1000)

    },
    validatePhone(){
      // 验证手机号码是否为空/手机号码是否格式正确
      if(!this.phone){
        this.errors = {
          phone:'手机号码不能为空'
        };
        return false;
      }else if(!/^1[345678]\d{9}$/.test(this.phone)){
        this.errors = {
          phone:'请填写正确的手机号码'
        }
        return false;
      }else{
        this.errors = {};
        return true;
      }
    },
    handleLogin(){
      // 取消错误提醒
      this.errors = {};
      // 发送请求
      this.$axios.post('/api/posts/sms_back',{
        phone:this.phone,
        code:this.verifyCode
      })
      .then(res=>{
        console.log(res);
        // 检验成功 设置登录状态并转跳到/
        localStorage.setItem('ele_login',true);
        this.$router.push('/');
      })
      .catch((err)=>{
        // 返回错误信息
        this.errors = {
          code:err.response.data.msg
        }
      })
    }
  }
}
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  background: #fff;
}
.logo{
  text-align: center;
}
.logo img {
  width: 150px;
}
.text_group,
.login_des,
.login_btn {
  margin-top: 20px;
}
.login_des {
  color: #aaa;
  line-height: 22px;
}
.login_des span {
  color: #4d90fe;
}
.login_btn button {
  width: 100%;
  height: 40px;
  background-color: #48ca38;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  border: none;
  outline: none;
}
.login_btn button[disabled] {
  background-color: #8bda81;
}
</style>