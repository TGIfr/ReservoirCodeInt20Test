<template lang="pug">
  header
    nav.navbar.is-white(role="navigation" aria-label="main navigation")
      div.container
        div.navbar-brand
          p.navbar-item.brand-text Int20Test
          a.navbar-burger.burger.round-percent-50(data-target="menu", ref="burger", @click="showAllMenu()")
            span
            span
            span
        div#menu.navbar-menu(ref="menu")
          div.navbar-start
            header-link(v-for="(link, i) in links", :key="i", :link="link",
            v-if="!('condition' in link) || link.condition()")

</template>

<script>
  import links from '%/elements/header-links/index';
  import HeaderLink from '%/elements/header-links/HeaderLink'

  export default {
    components: {
      HeaderLink
    },
    name: "app-header",
    data () {
      return {
        UI: {
          isShown: true
        },
        links
      }
    },
    methods: {
      showAllMenu: function () {
        let burger = this.$refs.burger;
        let menu = this.$refs.menu;
        burger.classList.toggle('is-active');
        menu.classList.toggle('is-active');
      },
    }
  }
</script>

<style scoped>

</style>

