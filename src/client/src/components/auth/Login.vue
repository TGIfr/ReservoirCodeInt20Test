<template lang="pug">
  b-modal.modal(
  v-if="isNotLogged",
  :active.sync="UI.isShown",
  scroll="keep",
  animation="zoom-out",
  width="400px")
    b-loading(:active="UI.isLoading")
    div.box.has-text-centered
      figure.avatar
        img.avatar-image(v-if="isInvalidEmail" src="/static/img/user.png", width="140px", alt="")
      h3.title.has-text-grey Login
      p.subtitle.has-text-grey Please login to proceed.
      form.has-text-left
        input-text(label="email", ref="email",placeholder="Your email",:rules="{required:true, email:true}", icon="email", type="email")
        input-text(label="password", ref="password",placeholder="Your password", :rules="{required:true}",icon="lock", :reveal="true", type="password")
      br
      a.button.is-block.is-info.is-medium(@click="loginHandler()") Login
      hr
      p.has-text-grey.is-size-6
      a(@click.register="register") Sign Up
      span &nbsp;·&nbsp;
      router-link(:to="{name:'ConfirmMail'}")
        a(@click.stop="toggle") Confirm email
</template>

<script>
  import InputText from '%/elements/InputText';
  import MessageMixin from '@messages-mixin';
  import AuthMixin from '@auth-mixin';
  import {EventBus} from "@eventBus";

  export default {
    mixins: [AuthMixin, MessageMixin],
    name: "login",
    components: {
      InputText
    },
    data () {
      return {
        UI: {
          isShown: false,
          isLoading: false
        }
      }
    },
    methods: {
      register () {
        EventBus.$emit('register');
        this.toggle();
      },
      loadStart () {
        this.UI.isLoading = true;
      },
      loadEnd () {
        this.UI.isLoading = false;
      },
      isValidCredentials () {
        return (!this.$refs.email || this.$refs.email.isValid) && (!this.$refs.password || this.$refs.password.isValid);
      },
      toggle () {
        this.UI.isShown = !this.UI.isShown;
      },
      async loginHandler () {
        if (this.isValidCredentials()) {
          if (await this.login(this.credentials)) {
            this.UI.isShown = false;
          }
        } else {
          this.showErrorBox("Looks like, there are some problems with your input");
        }
      },
      addEventHandlers () {
        EventBus.$on('load-login-start', this.loadStart);
        EventBus.$on('load-login-end', this.loadEnd);
      },
      removeEventHandlers () {
        EventBus.$off('load-login-start', this.loadStart);
        EventBus.$off('load-login-end', this.loadEnd);
      },
    },
    mounted () {
      this.addEventHandlers();
    },
    beforeDestroy () {
      this.removeEventHandlers();
    },
    computed: {
      isInvalidEmail () {
        return !(this.$refs.email && this.$refs.email.data);
      },
      credentials () {
        return {
          email: this.$refs.email.data,
          password: this.$refs.password.data
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "~material-colors/dist/colors";

  .ripple {
    color: $md-amber-200;
  }

  .avatar {
    margin-top: -70px;
  }

  .avatar-image {
    background-color: white;
    border-radius: 50%;
    border: 5px white solid;
    box-sizing: content-box;
    box-shadow: 0 2px 3px rgba(10, 10, 10, .1), 0 0 0 1px rgba(10, 10, 10, .1);
  }

  .box {
    margin-top: 70px;
  }

  .ripple {
    color: $md-light-blue-900;
  }

  .modal {
    z-index: 1000;
  }
</style>
