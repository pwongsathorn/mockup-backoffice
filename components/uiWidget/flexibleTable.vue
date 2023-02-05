<template lang="pug">
.flexible-table-wrapper
  v-list.overflow-hidden.rounded-lg.py-0(v-if="$vuetify.breakpoint.mdAndUp" :elevation="elevation" :outlined="outlined")
    //- Header ----------------
    v-list-item.rounded-t-lg
      v-list-item-content
        v-layout.font-weight-bold.d-flex.justify-space-between
          template(v-for="header in headers")
            v-flex.header-items.text-subtitle-2.px-2.mb-0(
              tag="div"
              :style="`width: ${ !header.width ? 'auto' : header.width }`"
              :class="`text-${header.align}`"
            )
              span(:class="`text-center ${header.truncate? 'text-truncate':''}`") {{ header.text }}
              //- v-icon(@click="sortBy('')")
    v-divider
    //- Loading handler ----------------
    slot(v-if="loading" name="loader")
      template(v-for="skeleton in 3")
        v-list-item
          v-list-item-content
              v-layout.text-center.grey--text.d-flex.justify-space-between.align-center
                template(v-for="(sktheader, sktIndex) in headers")
                  v-flex.px-2.loader.flex-grow-1.text-right(
                    :key="`${skeleton}-${sktIndex}`"
                    :style="`width: ${ !sktheader.width ? 'auto' : sktheader.width }`"
                  )
                    v-skeleton-loader(:class="`${skeletonAligns(sktheader.align)}`" tile max-width='64' height='32' type='text' )
        v-divider(v-if="skeleton !== 3")
    //- No Data handler ----------------
    v-list-item(v-else-if="!items || items.length === 0")
      v-list-item-content
        .text-center.grey--text.d-flex.justify-center.align-center
            span {{ noDataText }}
    //- List Items ----------------
    template(
      v-if="items && !loading"
      v-for="(item, itemIndex) in items"
    )
      v-hover(
        :key="`item-${itemIndex}`"
        v-slot="{ hover }"
      )
        v-list-item(:class="itemColor(hover, itemIndex)")
          v-list-item-content
            v-layout.grey--text.text--darken-2.d-flex.justify-space-between.align-center
              template(v-for="(header,headerIndex) in headers")
                v-flex.items.px-2.mb-0(
                  tag="div"
                  :class="`${header.truncate ? 'text-truncate': ''} ${aligns(header.align)}`"
                  :style="`width: ${ !header.width ? 'auto' : header.width }`"
                )
                  slot(:name="header.value" :item="item" :index="itemIndex" :hover="hover")
                    span.value {{ item[header.value] }}
      v-divider(v-if="itemIndex + 1 !== items.length")
  //- Mobile Case ----------------
  v-card(v-else :elevation="elevation" :outlined="outlined")
    v-card-text(v-if="loading")
      template(v-for="mSkt in 3")
        v-skeleton-loader(
          type="list-item-three-line"
        )
        v-divider(v-if="mSkt !== 3")
    v-card-text(v-else-if="!items || items && items.length < 1")
      p.text-center.mb-0 {{ noDataText }}
    template(
      v-else
      v-for="(item, itemIndex) in items"
    )
      v-card-text
        v-layout
        template(v-for="(header,headerIndex) in headers")
          v-flex.items.my-3(
            v-if="!header.hideDataOnMobile"
            tag="div"
            :style="`width: ${ !header.mobileWidth ? 'auto' : header.mobileWidth }`"
          )
            span.font-weight-bold.mr-2(v-if="!header.hideHeaderOnMobile") {{ header.text }} :
            slot(:name="header.value" :item="item" :index="itemIndex")
              span.grey--text.text--darken-2 {{ item[header.value] }}
      v-divider(v-if="itemIndex + 1 !== items.length")
  //- Mobile Loader
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    elevation: {
      type: Number,
      default: 0
    },
    outlined: {
      type: Boolean,
      default: false
    },
    striped: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: null
    },
    headers: {
      type: Array,
      default: null
    },
    groupBy: {
      type: String,
      default: 'Item'
    },
    noDataText: {
      type: String,
      default: 'ไม่มีข้อมูล'
    }
  },
  computed: {
    // --- map Groupings -------
    // ---!!! no UI handler !!!-------
    groupItems () {
      if (this.items && this.items.length > 0) {
        const grouped = this.items.map((each) => {
          if (!each[this.groupBy]) {
            return {
              ...each,
              [this.groupBy]: 'อื่นๆ'
            }
          } else {
            return each
          }
        }).reduce((prev, cur) => ({
          ...prev,
          [cur[this.groupBy]]: (prev[cur[this.groupBy]] || []).concat(cur)
        }), {})
        return grouped
      } else {
        return []
      }
    }
  },
  methods: {
    itemColor (hoverState, index) {
      if (!hoverState) {
        if (this.striped) {
          if ((index % 2 === 0)) {
            return ''
          } else {
            return 'grey lighten-4'
          }
        } else {
          return ''
        }
      } else {
        return 'grey lighten-2'
      }
    },
    aligns (key) {
      switch (key) {
        case 'left':
          return 'text-left'
        case 'right':
          return 'text-right'
        case 'center':
          return 'text-center'
        default:
          return ''
      }
    },
    skeletonAligns (key) {
      switch (key) {
        case 'left':
          return 'mr-auto'
        case 'right':
          return 'ml-auto'
        case 'center':
          return 'mx-auto'
        default:
          return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flexible-table-wrapper {
  // height: 100%;
  .header-items, .items {
    cursor: default;
  }
}
</style>
