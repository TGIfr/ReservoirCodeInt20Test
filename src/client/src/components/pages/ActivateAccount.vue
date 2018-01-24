<template lang="pug">
  section.hero.is-info.is-fullheight
    b-loading(:active="UI.isLoading")
    div.hero-body
      div.container.has-text-centered
        div.column.is-6.is-offset-3.content
          p.title Your account now is activating
</template>

<script>
  import MessageMixin from '@messages-mixin';
  import AuthMixin from '@auth-mixin';
  import {EventBus} from "@eventBus";

  export default {
    mixins: [AuthMixin, MessageMixin],
    name: "activate-account",
    data () {
      return {
        UI: {
          isShown: true,
          isLoading: false
        }
      }
    },
    methods: {
      loadStart () {
        this.UI.isLoading = true;
      },
      loadEnd () {
        this.UI.isLoading = false;
      },
      addEventHandlers () {
        EventBus.$on('load-activate-start', this.loadStart);
        EventBus.$on('load-activate-end', this.loadEnd);
      },
      removeEventHandlers () {
        EventBus.$off('load-activate-start', this.loadStart);
        EventBus.$off('load-activate-end', this.loadEnd);
      },
      async handleActivate () {
        if (await this.sendActivationCode({token:this.token})) {
          this.$router.push({name: 'Index'});
          EventBus.$emit(login);
        }
      }
    },
    computed: {
      credentials () {
        return {
          email: this.$refs.email.data
        }
      }
    },
    props: [],
    async beforeRouteUpdate (to, from) {
      this.token = to.params.token || "";
      await this.handleActivate();
    },
    async mounted () {
      this.token = this.$route.params.token || "";
      await this.handleActivate();
    }
  }
</script>

<style scoped>

</style>
