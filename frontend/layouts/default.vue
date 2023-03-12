<template>
  <div class="h-screen" :class="{'dark' : theme === 'dark', 'light': theme === 'light'}">
    <div class="w-full h-full  bg-white text-black dark:bg-[#2E3235] dark:text-white">
      <div class="flex flex-col h-full">
        <Header 
          class="flex-none" 
          :theme="theme" 
          :login="login" 
          :loading="loading"
          :token="token"
          @changeTheme="changeTheme($event)" 
          @requestToken="requestToken()" 
          @logout="logout()" />
        <Nuxt :theme="theme" style="flex: 1 1 auto;" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Default',
  data(){
    const theme = localStorage.theme ? localStorage.theme : 'dark'
    return {
      theme,
      clientG: null,
      url: 'https://www.googleapis.com/oauth2/v3/userinfo?access_token=',
      login: false,
      loading: false,
      token: ''
    }
  },
  async mounted(){
    this.checkLogin()
    this.clientG = google.accounts.oauth2.initTokenClient({
      client_id: this.$config.gClientID,
      scope: ['https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile'].join(' '),
      callback: async (data) => {
        this.loading = true
        try {
          const d = await this.$axios.$get(this.url+data.access_token)
          localStorage.setItem('email', d.email)
          const e = await this.$axios.$post(this.$config.base_url + 'check-session', {
            access_token: data.access_token,
            email: d.email
          })
          this.login = e.data[0].login
          this.token = e.data[0].token
        } catch (error) {
          alert("Seomthing went wrong! can't login to your account.")
        }
        this.loading = false
      }
    })
  },
  methods: {
    async checkLogin(){
      this.loading = true
      if(localStorage.getItem('email')) {
        
        const d = await this.$axios.$post(this.$config.base_url+'check-login', {
          email: localStorage.getItem('email')
        })
        this.login = d.error ? false : d.data[0].login
        this.token = d.data[0].token
      } else {
        this.login = false
      }
      this.loading = false
    },
    changeTheme(theme){
      this.theme = theme,
      localStorage.setItem('theme', theme)
    },
    requestToken(){
      this.clientG.requestAccessToken();
    },
    async logout(){
      console.log('logout')
      await localStorage.removeItem('email')
      await this.checkLogin()
    }
  }
}
</script>

<style>

</style>