<template lang="pug">
.page-wrapper-layout(:id="id")
  v-row#header-section.pt-6.pt-md-0(no-gutters)
    v-col(cols="12" md="6")
      slot(name="title" :title="pageTitle")
        v-btn.mb-2(
          v-if="!hideBackButton"
          icon
          @click="backward"
        )
          v-icon mdi-chevron-left
        h1.d-inline-block.mb-2.text-h5.text-md-h4.font-weight-bold {{ pageTitle }}
    v-col.text-right(v-if="$vuetify.breakpoint.mdAndUp" cols="12" md="6")
      slot(name="buttons")
  v-card#body-section.pa-3(rounded="lg" elevation="0")
      v-card-text
        v-row#filter-section
          slot(name="filter")
        v-row#contents-section
          v-col(cols="12")
            slot(name="content")
  #other-section(:class="hidePagination ? 'pb-14':''")
    v-row#pagination-wrapper.mt-2.mb-md-0(
      v-if="!hidePagination"
      :class="(totalPage > 1) || $vuetify.breakpoint.smAndDown ? 'mb-14' : 'mb-0'"
    )
      v-col(cols="12")
        Ui-Widget-Pagination(
          v-if="totalPage > 1"
          ref="pagination"
          :page-count="totalPage"
          @onChangePage="changePageTrigger"
        )
    v-bottom-navigation#bottom-navigation(v-if="$vuetify.breakpoint.smAndDown" fixed)
      .pa-2(style="width: 100%; height: 100%;")
        slot(name="mobile-navigation")
  slot(name="modals")
</template>

<script>
export default {
  name: 'MainLayout',
  props: {
    id: {
      default: 'page-layout',
      type: String
    },
    pageTitle: {
      default: 'Page Title',
      type: String
    },
    totalPage: {
      default: 0,
      type: Number
    },
    hidePagination: {
      default: false,
      type: Boolean
    },
    hideBackButton: {
      default: true,
      type: Boolean
    }
  },
  methods: {
    changePageTrigger (event) {
      this.$emit('changePage', event)
    },
    backward () {
      this.$router.back()
    }
  }
}
</script>
