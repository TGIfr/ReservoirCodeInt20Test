<template lang="pug">
  div.container(v-if="isLogged()")
    b-loading(:active="UI.isLoading")
    div.columns.is-tablet
      div.column.is-10-desktop.is-offset-1-desktop
        section.hero.is-info.welcome.is-small
          div.hero-body
            div.container
              h1.is-size-5 Hello, {{$store.state.user.email}}.
              h2.is-size-6 I hope you are having a great day!
              h2.is-size-4 Pick up the best meme
        hr
        div.columns.is-touch.is-multiline
          div.column.is-12
            a.button.is-info.extended.is-outlined(:class="{'is-loading':UI.isLoading}", :disabled="UI.isLoading", @click="loadMemeHandle") Skip
          template(v-if="memeLeft&& memeRight")
            div.column.is-6
              a.hoverable-card(@click.stop="vote(memeLeft)", :disable="UI.isLoading")
                meme-card(ref="meme-left", :meme="memeLeft")
            div.column.is-6
              a.hoverable-card(@click.stop="vote(memeRight)",:disable="UI.isLoading")
                meme-card(ref="meme-right",:meme="memeRight")
  div.hero(v-else)
    div.hero-body.container
      div.notification.is-danger
        h1.is-size-1
          b-icon(size="is-large",icon="alert-decagram")
          span Attention
        p.is-size-4 You need to log in, if you wish to continue
</template>

<script>
  import MessageMixin from '@messages-mixin';
  import AuthMixin from '@auth-mixin';
  import {EventBus} from "@eventBus";
  import MemeCard from '%/memes/MemeCard';
  import MemeMixin from '@meme-mixin';

  export default {
    mixins: [AuthMixin, MessageMixin, MemeMixin],
    name: "MemePicker",
    data () {
      return {
        memeLeft: null,
        memeRight: null,
        UI: {
          isLoading: false
        }
      }
    },
    components: {
      MemeCard
    },
    methods: {
      async vote (winner) {
        this.voteForBestMeme(winner, winner == this.memeLeft ? this.memeRight : this.memeLeft);
        await this.loadMemeHandle();
      },
      async loadMemeHandle () {
        let result = await this.load2RandomMeme();
        if (result) {
          this.memeLeft = result[0];
          this.memeRight = result[1];
        }
      },
      loadStart () {
        this.UI.isLoading = true;
      },
      loadEnd () {
        this.UI.isLoading = false;
      },
      addEventHandlers () {
        EventBus.$on('load-meme-random-start', this.loadStart);
        EventBus.$on('load-meme-random-end', this.loadEnd);
      },
      removeEventHandlers () {
        EventBus.$off('load-meme-random-start', this.loadStart);
        EventBus.$off('load-meme-random-end', this.loadEnd);
      },
    },
    mounted () {
      this.addEventHandlers();
      this.loadMemeHandle();
    },
     beforeDestroy () {
      this.removeEventHandlers();
    },
  }
</script>

<style scoped lang="scss">
  .hoverable-card {
    transition: transform, box-shadow 0.4s;
    :hover {
      transform: scale(1.01, 1.01);
      box-shadow: 0px 2.5px 5px rgba(1, 4, 4, 0.4);
    }
  }

  .hoverable-card * {
    :hover {
      transform: none;
      box-shadow: none;
    }
  }
</style>
