<template>
  <div class="flex flex-col mt-10">
    <div class="post-header">
      <!-- <Breadcrumbs :current="t(pageType)" /> -->
      <div class="flex flex-row gap-8">
        <h1 v-if="categoryTitle" class="post-title text-white uppercase">
          <span class="opacity-60">
            <SvgIcon icon-class="category" stroke="white" />
          </span>
          {{ categoryTitle }}
        </h1>
        <h1 v-if="tagTitle" class="post-title text-white uppercase">
          <span class="opacity-60">
            <SvgIcon icon-class="tag" stroke="white" />
          </span>
          {{ tagTitle }}
        </h1>
      </div>
    </div>
    <div class="main-grid">
      <div class="relative">
        <transition name="fade-slide-y" mode="out-in">
          <div v-show="isEmpty" class="post-html flex flex-col items-center">
            <h1>{{ t('settings.no-search-result') }}</h1>
            <SvgIcon icon-class="empty-search" style="font-size: 35rem" />
          </div>
        </transition>
        <div class="flex flex-col relative">
          <ul class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <template v-if="isLoading">
              <li v-for="n in 3" :key="n">
                <ArticleCard :data="{}" />
              </li>
            </template>
            <template v-else>
              <li v-for="post in posts.data" :key="post.slug">
                <ArticleCard :data="post" />
              </li>
            </template>
          </ul>

          <Paginator :pageSize="pagination.pageSize" :pageTotal="pagination.pageTotal" :page="pagination.page"
            @pageChange="pageChangeHandler" />
        </div>
      </div>
      <div>
        <Sidebar>
          <div class="sidebar-box flex flex-col gap-8">
            <CategoryBox :sidebar-box="false" :active-category="categoryTitle" />
            <TagBox :sidebar-box="false" :active-tag="tagTitle" />
          </div>
        </Sidebar>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  onUnmounted,
  ref,
  watch
} from 'vue'
import { useI18n } from 'vue-i18n'
import { Sidebar, TagBox, CategoryBox } from '@/components/Sidebar'
import Paginator from '@/components/Paginator.vue'
import { ArticleCard } from '@/components/ArticleCard'
import { SpecificPostsList } from '@/models/Post.class'
import { useRoute } from 'vue-router'
import { useTagStore } from '@/stores/tag'
import { usePostStore } from '@/stores/post'
import { useMetaStore } from '@/stores/meta'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { isEmpty } from '@/utils'

export default defineComponent({
  name: 'ArResult',
  components: {
    Sidebar,
    TagBox,
    Paginator,
    ArticleCard,
    CategoryBox,
    SvgIcon
  },
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const tagStore = useTagStore()
    const postStore = usePostStore()
    const metaStore = useMetaStore()
    const pageType = ref('search')

    const isFetched = ref(false)
    const posts = ref(new SpecificPostsList())
    const pagination = ref({
      pageSize: 6,
      pageTotal: 0,
      page: 1
    })
    const queryTagKey = 'aurora-query-tag'
    const queryCategoryKey = 'aurora-query-category'
    const queryTag = ref()
    const queryCategory = ref()
    const currentOption = ref('');

    const initPage = (page: number = 1) => {

      queryCategory.value = ''
      queryTag.value = ''
      const { tag, category } = route.query

      queryCategory.value = category
      queryTag.value = tag

      if (isEmpty(queryTag.value) && isEmpty(queryCategory.value)) {
        tagStore.fetchAllTags().then(response => {
          if (response.length > 0) {
            queryTag.value = response[0].slug;
            currentOption.value = queryTag.value
            fetchPostByTag(page);
            scrollToTop();
          }
        })
      } else if (!isEmpty(queryTag.value) && !isEmpty(queryCategory.value)) {
        queryCategory.value = ''
        currentOption.value = queryTag.value
        fetchPostByTag(page);
        scrollToTop();
      } else if (!isEmpty(queryTag.value)) {
        currentOption.value = queryTag.value
        fetchPostByTag(page);
        scrollToTop();
        return;
      } else if (!isEmpty(queryCategory.value)) {
        currentOption.value = queryCategory.value
        fetchPostByCategory(page);
        scrollToTop();
      }

    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      metaStore.setTitle('search');
    }

    const fetchPostByTag = (page: number) => {
      isFetched.value = false
      postStore.fetchPostsByTag(queryTag.value, page, pagination.value.pageSize).then(response => {
        isFetched.value = true
        posts.value = response
        pagination.value.pageTotal = response.total
      })
    }

    const fetchPostByCategory = (page: number) => {
      isFetched.value = false
      postStore.fetchPostsByCategory(queryCategory.value, page, pagination.value.pageSize).then(response => {
        isFetched.value = true
        posts.value = response
        pagination.value.pageTotal = response.total
      })
    }

    const pageChangeHandler = (page: number) => {
      if (currentOption.value === queryTag.value || currentOption.value === queryCategory.value) {
        if (page === pagination.value.page) {
          return
        } else {
          pagination.value.page = page
          initPage(page)
        }
      } else {
        pagination.value.page = page
        initPage(page)
      }
      
    }

    watch(
      () => route.query,
      () => {
        pagination.value.page = 1;
        initPage()
      }
    )

    onBeforeMount(() => {
      initPage()
    })

    onUnmounted(() => {
      localStorage.removeItem(queryTagKey)
      localStorage.removeItem(queryCategoryKey)
    })

    return {
      isLoading: computed(() => !isFetched.value),
      isEmpty: computed(() => posts.value.data.length === 0 && isFetched.value),
      categoryTitle: computed(() => queryCategory.value),
      tagTitle: computed(() => queryTag.value),
      posts,
      pageType,
      pagination,
      pageChangeHandler,
      t
    }
  }
})
</script>

<style lang="scss" scoped></style>
