<template>
  <div class="text_group">
    <!-- 组件结构 -->
    <!-- 组件容器 -->
    <div class="input_group" :class="{'is-invalid':cerror}">
      <!-- 输入框 -->
      <input 
        :type="ctype" 
        :value="cvalue" 
        :placeholder="cplaceholder" 
        :name="cname" 
        @input="$emit('input',$event.target.value)"
      >
      <!-- 输入框后面的按钮 -->
      <button v-if="cbtnTitle" :disabled="cdisabled" @click="$emit('btn-click')">{{cbtnTitle}}</button>
    </div>
    <!-- 错误提醒 -->
    <div v-if="cerror" class="invalid-feedback">{{cerror}}</div>
  </div>
</template>

<script>
export default {
  name:'inputGroup',
  props:{
    ctype:{
      type: String,
      default: 'text'
    },
    cvalue: String,
    cplaceholder: String,
    cname: String,
    cbtnTitle: String,
    cdisabled: Boolean,
    cerror: String
  }
}
</script>

<style scoped>
.input_group {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.input_group input {
  height: 100%;
  width: 60%;
  outline: none;
}
.input_group button {
  border: none;
  outline: none;
  background: #fff;
}
.input_group button[disabled] {
  color: #aaa;
}
.is-invalid {
  border: 1px solid red;
}
.invalid-feedback {
  color: red;
  padding-top: 5px;
}
</style>