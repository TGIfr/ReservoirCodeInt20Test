<template lang="pug">
  div.container
    b-loading(:active="UI.isLoading")
    section.hero.is-info.welcome.is-small(v-if="isLogged()")
      div.hero-body
        h1.is-size-5 Hello, {{$store.state.user.email}}.
        h2.is-size-6 Here you can view all memes
    hr
    b-pagination(
    :total="total",
    :current.sync="page",
    order="is-centered",
    :per-page="perPage")
    br
    div.columns.is-multiline
      div.column.is-6-tablet.is-4-desktop.is-3-fullhd(v-for="meme in memes", :key="meme._id")
        meme-card(:meme="meme", @removed="loadMemesHandle")
    b-pagination(
    :total="total",
    :current.sync="page",
    order="is-centered",
    :per-page="perPage")
    br
</template>
<script>
  import MessageMixin from '@messages-mixin';
  import AuthMixin from '@auth-mixin';
  import {EventBus} from "@eventBus";
  import MemeCard from '%/memes/MemePrev';
  import MemeMixin from '@meme-mixin';

  export default {
    components: {MemeCard},
    mixins: [AuthMixin, MessageMixin, MemeMixin],
    name: "MemesView",
    data () {
      return {
        page: 1,
        perPage: 20,
        total: 1,
        memes: [],
        UI: {
          isLoading: false
        }
      }
    },
    methods: {
      async remove () {
        if (!this.$route.params.id) {
          this.showErrorBox("No id of meme found")
        } else {
          if (await this.deleteMeme(this.$route.params.id)) {
            this.$router.push({name: "MemesView"})
          }
        }
      },
      loadStart () {
        this.UI.isLoading = true;
      },
      loadEnd () {
        this.UI.isLoading = false;
      },
      addEventHandlers () {
        EventBus.$on('load-memes-start', this.loadStart);
        EventBus.$on('load-memes-end', this.loadEnd);
      },
      removeEventHandlers () {
        EventBus.$off('load-memes-start', this.loadStart);
        EventBus.$off('load-memes-end', this.loadEnd);
      },
      async loadMemesHandle () {
        let result = await this.loadMemes({page: this.page, sort: this.sort, limit: this.limit});
        this.memes = result.items;
        this.page = result.page;
        this.total = result.total;
      },
      handleURLQuery (query) {
        this.sort = query.sort || "title";
        this.page = Math.max(Number(query.page) || 1);
        this.loadMemesHandle();
      }
    },
    watch: {
      page () {
        let query = {
          page: this.page,
          sort: this.sort,
        }
        this.$router.push({name: "MemesView", query: query})
      }
    },
    beforeDestroy () {
      this.removeEventHandlers();
    },
    beforeRouteUpdate (to, from, next) {
      this.handleURLQuery(to.query);
    },
    computed: {},
    props: [],
    mounted () {
      this.addEventHandlers()
      this.handleURLQuery(this.$route.query);
    }

  }
</script>
<style scoped lang="scss">
</style>
