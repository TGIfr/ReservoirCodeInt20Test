<template lang="pug">
  div.container
    b-loading(:active="UI.isLoading")
    section.hero.is-info.welcome.is-small(v-if="!$route.params.id")
      div.hero-body
        h2.is-size-5 Hello, {{isLogged()?$store.state.user.email:'guest'}}.
        h2.is-size-6 Here you can view info about selected meme
    div(v-else).container
      section.hero.is-success.is-small(v-if="meme")
        div.hero-body
          h2.title.is-size-3(v-html="meme.title")
      hr
      div.columns(v-if="meme")
        div.column.is-6
          figure.image.meme-image-container
            img.meme-image(v-if="isImage", :src="meme.content", alt="Meme's image")
            video(v-else, controls)
              source(:src="meme.content", )
              | Your browser does not support HTML5 video.
        div.column.is-6
          div.card
            div.card-header
              div.card-header-title.title Info
            div.card-content
              div.content
                p.control(v-if="isAdmin()")
                  button.button.is-danger(@click.stop="remove")
                    b-icon(icon="delete")
                    span Delete
                b-taglist(attached)
                  b-tag(type="is-black") Rating
                  b-tag(type="is-info") {{rating}}
                p.subtitle.is-6 Added at
                  b
                    time(:datetime="meme.added") {{added}}
                b-input(size="is-medium", :value="meme.content", type="textarea", readonly)

</template>


<script>
  import MessageMixin from '@messages-mixin';
  import AuthMixin from '@auth-mixin';
  import {EventBus} from "@eventBus";
  import MemeMixin from '@meme-mixin';

  export default {
    mixins: [AuthMixin, MessageMixin, MemeMixin],
    name: "MemeInfo",
    data () {
      return {
        meme: null,
        UI: {
          isLoading: true
        }
      }
    },
    computed: {
      isImage () {
        return this.meme && this.meme.content.match(/.+(gif|jpg|jpeg|raw|png)/)
      },
      rating () {
        return Number(this.meme.rating).toFixed(2);
      },
      added () {
        return (new Date(this.meme.added)).toLocaleString();
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
        EventBus.$on('load-meme-start', this.loadStart);
        EventBus.$on('load-meme-end', this.loadEnd);
      },
      removeEventHandlers () {
        EventBus.$off('load-meme-start', this.loadStart);
        EventBus.$off('load-meme-end', this.loadEnd);
      },
      async loadMemeHandle (to) {
        if (!this.$route.params.id) {
          this.showErrorBox("No id of meme found")
        } else {
          this.meme = await this.loadMeme(to.params.id);
        }
      },
    },
    beforeDestroy () {
      this.removeEventHandlers();
    },
    beforeRouteUpdate (to, from, next) {
      this.loadMemeHandle(to);
    },
    mounted () {
      this.addEventHandlers()
      this.loadMemeHandle(this.$route);
    }
  }
</script>

<style scoped>
  .meme-image {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: 0px;
  }

  .meme-image-container {
    margin: auto;
    max-width: 600px;
  }

</style>
