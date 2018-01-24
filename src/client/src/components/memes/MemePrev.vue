<template lang="pug">
  div
    b-loading(:active.sync="UI.isLoading")
    div.card
      div.card-image
        router-link(:to="{name:'MemeInfo',params:{id:meme._id}}")
          figure.logo-image-container
            img.logo-image(v-if="isImage", :src="meme.content", alt="Meme's image")
            video(v-else, controls,  width="320" height="240")
              source(:src="meme.content", )
              | Your browser does not support HTML5 video.
        div.card-content
          div.content
            p.subtitle.is-6(v-html= "meme.title")
            b-field( grouped)
              p.control(v-if="isAdmin()")
                button.button.is-danger(@click.stop="remove")
                  b-icon(icon="delete")
                  span Delete
              b-taglist(attached)
                b-tag(type="is-black") Rating
                b-tag(type="is-info") {{rating}}
</template>


<script>
  import MessageMixin from '@messages-mixin';
  import AuthMixin from '@auth-mixin';
  import {EventBus} from "@eventBus";
  import MemeMixin from '@meme-mixin';
  import BLoading from "buefy/src/components/loading/Loading";

  export default {
    components: {BLoading},
    mixins: [AuthMixin, MessageMixin, MemeMixin],
    name: "MemePrev",
    data () {
      return {
        UI: {
          isLoading: false
        }
      }
    },
    props: {
      "meme": {
        type: Object,
        required: true
      }
    },
    methods:{
      async remove () {
        if (!this.meme._id) {
          this.showErrorBox("No id of meme found")
        } else {
          if (await this.deleteMeme(this.meme._id)) {
            this.$emit('removed',this.meme._id)
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

    },
    computed: {
      isImage () {
        return this.meme && this.meme.content.match(/.+(gif|jpg|jpeg|raw|png)/)
      },
      rating () {
        return Number(this.meme.rating).toFixed(2);
      }
    },
    beforeDestroy () {
      this.removeEventHandlers();
    },
    mounted () {
      this.addEventHandlers()
    }
  }
</script>

<style scoped>
  .logo-image {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: 0px;
  }

  .logo-image-container {
    margin: auto;
    height: 256px;
  }
</style>
