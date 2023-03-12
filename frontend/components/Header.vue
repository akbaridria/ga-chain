<template>
<div>
  <!-- desktop header  -->
  <div class="items-center justify-between px-5 py-4 border-b-[1px] dark:border-gray-600 hidden lg:flex">
    <div class="text-2xl font-bold flex items-center gap-x-2"> 
      <img src="/logo ga-chain.png" class="w-[2rem]" alt="lgoo ga-chain" /> 
      <div>GA-CHAIN </div>
    </div>
    <div >
      <template v-if="loading">
       <div  class="animate-pulse">
        <div class="w-[300px] max-w-[100%] h-[1.5rem] bg-gray-300 rounded-md dark:bg-zinc-800"></div>
      </div>
      </template>
      <template v-else>
      <div class=" flex items-center gap-x-2 text-sm" v-if="!loading && !login">
        <div @click="$emit('requestToken')" class="flex items-center gap-x-1 cursor-pointer border-b-2">sign in with <ion-icon name="logo-google"></ion-icon></div> get the key and query our data using our <span class="px-2 py-1 bg-blue-600 rounded-xl text-white">API</span> <span></span>
      </div>
      <div v-if="!loading && login" class="flex bg-gray-300 dark:bg-zinc-800 px-2 py-2 items-center gap-x-2 rounded-md text-sm">
        <div>API Key</div>
        <div id="key" class="opacity-50">{{ token }}</div>
        <div class="group cursor-pointer relative" @click="copyText('key')">
          <ion-icon  name="copy-outline"></ion-icon>
          <div class="absolute shadow-md px-2 py-1 rounded-md bg-gray-100 dark:bg-zinc-700 hidden group-hover:block">
            {{ textCopy }}
          </div>
        </div>
      </div>
      </template>
    </div>
    <div class="flex items-center gap-x-4 cursor-pointer">
      <!-- <a class="flex items-center gap-x-1 font-bold text-sm hover:underline" href="/" ><ion-icon name="code-slash-outline"></ion-icon> Playground</a>  -->
      <a class="flex items-center gap-x-1 text-sm hover:underline" href="https://github.com/akbaridria/ga-chain" target="_blank"><ion-icon name="logo-github"></ion-icon> Github</a>      
      <a class="flex items-center gap-x-1 text-sm hover:underline" href="https://ga-chain.gitbook.io/ga-chain/introduction/what-is-ga-chain" target="_blank"><ion-icon name="document-text-outline"></ion-icon> Documentation</a>
      <div v-if="login" @click="$emit('logout')" class="flex items-center gap-x-1 text-sm hover:underline">
        <ion-icon name="log-out-outline"></ion-icon> logout
      </div>
      <div class="flex items-center">
        <div class="flex items-center p-1 rounded-full hover:bg-gray-300/50" @click="$emit('changeTheme', 'light')" v-if="theme === 'dark'">
          <ion-icon name="sunny-outline"></ion-icon>
        </div>
        <div class="flex items-center p-1 rounded-full hover:bg-gray-300/50" @click="$emit('changeTheme', 'dark')" v-else>
          <ion-icon name="moon-outline"></ion-icon>
        </div>
      </div>
    </div>
  </div>
  <!-- mobile header  -->
  <div class="flex items-center justify-between px-5 py-4 lg:hidden">
    <div class="text-2xl font-bold flex items-center gap-x-2"> 
      <img src="/logo ga-chain.png" class="w-[2rem]" alt="lgoo ga-chain" /> 
      <div>GA-CHAIN </div>
    </div>
    <div @click="activeMobile = !activeMobile" class="flex items-center text-xl cursor-pointer">
      <ion-icon name="menu-outline"></ion-icon>
    </div>
  </div>
  <div :class="{'left-[0%]' : activeMobile }" class="fixed shadow-md h-screen top-0 w-full max-w-[400px] bg-white dark:bg-[#2E3235] z-10 transition-all left-[-100%] lg:hidden">
    <div class="flex flex-col px-5 py-4 gap-6">
      <div class="flex items-center justify-between w-full lg:hidden">
        <div class="text-2xl font-bold flex items-center gap-x-2"> 
          <img src="/logo ga-chain.png" class="w-[2rem]" alt="lgoo ga-chain" /> 
          <div>GA-CHAIN </div>
        </div>
        <div @click="activeMobile = !activeMobile" class="flex items-center text-xl cursor-pointer">
          <ion-icon name="close-outline"></ion-icon>
        </div>
      </div>
      <div>
        <hr class="border-0 h-[0.5px] bg-gray-300 dark:bg-gray-600">
      </div>
      <div class="flex flex-col justify-center gap-6">
        <a class="flex items-center gap-x-2  hover:underline" href="https://github.com/akbaridria/ga-chain" target="_blank"><ion-icon name="logo-github"></ion-icon> Github</a>
        <a class="flex items-center gap-x-2  hover:underline" href="https://ga-chain.gitbook.io/ga-chain/introduction/what-is-ga-chain" target="_blank"><ion-icon name="document-text-outline"></ion-icon> Documentation</a>
        <div class="flex items-center cursor-pointer">
          <div class="flex items-center gap-x-2 rounded-full" @click="$emit('changeTheme', 'light')" v-if="theme === 'dark'">
            <ion-icon name="sunny-outline"></ion-icon> Light
          </div>
          <div class="flex items-center gap-x-2 rounded-full" @click="$emit('changeTheme', 'dark')" v-else>
            <ion-icon name="moon-outline"></ion-icon> Dark
          </div>
        </div>
      </div>
      <div>
        <hr class="border-0 h-[0.5px] bg-gray-300 dark:bg-gray-600">
      </div>
       <div class="text-sm">
        Access our data with our <span class="px-2 py-1 bg-blue-600 rounded-xl text-white">free api</span> <span><a class="underline" href="https://ga-chain.gitbook.io/ga-chain/integration/api" target="_blank">here</a></span>
       </div>
    </div>
    
  </div>
</div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    theme: {
      type: String,
      required: true
    },
    login: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  },
  data(){
    return {
      activeMobile: false,
      textCopy: 'Copy'
    }
  },
  methods: {
    copyText(id){
      const range = document.createRange();
      range.selectNode(document.getElementById(id));
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
      this.textCopy = 'Copied!'
      setTimeout(() => {
        this.textCopy = 'Copy'
      }, 1000);
    }
  }
}
</script>

<style>

</style>