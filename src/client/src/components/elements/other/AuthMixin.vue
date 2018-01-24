<script>
  import AuthAPI from '#/Auth';
  import MessageMixin from '@messages-mixin';
  import {EventBus} from "@eventBus";

  export default {
    mixins: {
      MessageMixin
    },
    methods: {
      async checkTimeOfTokens () {
        if (this.isNotLogged()) return;
        // console.log(0)
        //check is access token are valid
        if (await this.isValidAccessToken()) {
          return;
        }
        // console.log(1)
        //check is refresh token are valid
        if (!await this.isValidRefreshToken()) {
          // console.log('refresh token expired')
          this.logout();
          return;
        }
        // console.log(2)
        await this.updateAccessToken();
      },
      async updateAccessToken () {
        // update access token
        try {
          const response = await AuthAPI.updateAccessToken();
          if (response.data.success) {
            this.$store.dispatch('setToken_access', response.data.tokens.access);
          } else {
            this.logout();
          }
        } catch (err) {
          this.logout();
        }
      },
      async isValidRefreshToken () {
        try {
          const response = await AuthAPI.checkTokenRefresh();
          // console.log(response.data)
          return response.data.success;
        } catch (err) {
          return false;
        }
      },
      async isValidAccessToken () {
        try {
          const response = await AuthAPI.checkTokenAccess();
          return response.data.success;
        } catch (err) {
          return false;
        }
      },
      logout () {
        this.$store.dispatch('setToken_access', null);
        this.$store.dispatch('setToken_refresh', null);
        this.$store.dispatch('setUser', null);
      },
      async fullLogout () {
        this.$store.dispatch('setToken_access', null);
        this.$store.dispatch('setToken_refresh', null);
        this.$store.dispatch('setUser', null);
        try {
          await AuthAPI.fullLogout();
        } catch (e) {

        }
      },
      isLogged () {
        return this.$store.getters.isLogged();
      },
      isAdmin () {
        return this.isLogged() && this.$store.state.user.role=='admin';
      },
      isNotLogged () {
        return !this.isLogged();
      },
      async login (credentials) {
        EventBus.$emit('load-login-start');
        let result = false;
        try {
          const response = await AuthAPI.login(this.credentials);
          if (response.data.success) {
            this.$store.dispatch('setToken_access', response.data.tokens.access);
            this.$store.dispatch('setToken_refresh', response.data.tokens.refresh);
            this.$store.dispatch('setUser', response.data.user);
            this.showSuccessBox(`Hello, ${response.data.user.email}`);
            result = true;
          } else {
            this.showErrorBox(response.data.message);
          }
        } catch (err) {
          this.showErrorBox(err.response.status == 401 ? "Invalid credentials" : err.response.data.message || err.message);
        }
        EventBus.$emit('load-login-end');
        return result;
      },
      async register (credentials) {
        EventBus.$emit('load-register-start');
        let result = false;
        try {
          const response = await AuthAPI.register(this.credentials);
          if (response.data.success) {
            result = true;
          } else {
            this.showErrorBox(response.message)
          }
        } catch (err) {
          this.showErrorBox(err.response.status == 401 ? "Invalid credentials" : err.response.data.message || err.message);
        }
        EventBus.$emit('load-register-end');
        return result;
      },
      async sendActivationCode (credentials) {
        EventBus.$emit('load-activate-start');
        let result = false;
        try {
          const response = await AuthAPI.sendActivationCode(credentials);
          if (response.data.success) {
            this.UI.isShown = false;
            this.showSuccessBox(`Your account was successful activated. You can login now`);
            result = true;
          } else {
            this.showErrorBox(response.message)
          }
        } catch (err) {
          this.showErrorBox(err.response.data.message || err.message);
        }
        EventBus.$emit('load-activate-end');
        return result;
      },
      async sendActivationCodeAgain (credentials) {
        EventBus.$emit('load-confirm-start');
        let result = false;
        try {
          const response = await AuthAPI.sendActivationCodeAgain(this.credentials);
          if (response.data.success) {
            this.UI.isShown = false;
            this.showSuccessBox(`Mail was send again to '${credentials.email}'`);
            result = true;
          } else {
            this.showErrorBox(response.message)
          }
        } catch (err) {
          this.showErrorBox(err.response.status == 401 ? "Invalid credentials" : err.response.data.message || err.message);
        }
        EventBus.$emit('load-confirm-end');
        return result;
      }
    },
  }
</script>
