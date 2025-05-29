<template>
  <Toggle :status="defaultStatus" @changeStatus="handleChange">
    <svg
      :style="{ fill: svg.fill, margin: svg.margin }"
      aria-hidden="true"
      width="18"
      height="18"
      :viewBox=svg.viewBox
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        :d=svg.d
      ></path>
      <circle v-if="!isDark" fill="#FFAC33" cx="18" cy="18" r="10"></circle>
    </svg>
  </Toggle>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from 'vue'
import Toggle from './Toggle.vue'
import { useAppStore } from '@/stores/app'

export default defineComponent({
  name: 'ObThemeToggle',
  components: {
    Toggle
  },
  setup() {
    const appStore = useAppStore()
    const defaultStatus = appStore.theme === 'theme-dark' ? true : false
    const sun = 'M16 2s0-2 2-2s2 2 2 2v2s0 2-2 2s-2-2-2-2V2zm18 14s2 0 2 2s-2 2-2 2h-2s-2 0-2-2s2-2 2-2h2zM4 16s2 0 2 2s-2 2-2 2H2s-2 0-2-2s2-2 2-2h2zm5.121-8.707s1.414 1.414 0 2.828s-2.828 0-2.828 0L4.878 8.708s-1.414-1.414 0-2.829c1.415-1.414 2.829 0 2.829 0l1.414 1.414zm21 21s1.414 1.414 0 2.828s-2.828 0-2.828 0l-1.414-1.414s-1.414-1.414 0-2.828s2.828 0 2.828 0l1.414 1.414zm-.413-18.172s-1.414 1.414-2.828 0s0-2.828 0-2.828l1.414-1.414s1.414-1.414 2.828 0s0 2.828 0 2.828l-1.414 1.414zm-21 21s-1.414 1.414-2.828 0s0-2.828 0-2.828l1.414-1.414s1.414-1.414 2.828 0s0 2.828 0 2.828l-1.414 1.414zM16 32s0-2 2-2s2 2 2 2v2s0 2-2 2s-2-2-2-2v-2z';
    const moon = 'M611.370667 167.082667a445.013333 445.013333 0 0 1-38.4 161.834666 477.781333 477.781333 0 0 1-244.736 244.394667 445.141333 445.141333 0 0 1-161.109334 38.058667 85.077333 85.077333 0 0 0-65.066666 135.722666A462.08 462.08 0 1 0 747.093333 102.058667a85.077333 85.077333 0 0 0-135.722666 65.024z';
    let d = sun;

    const svgStyle = reactive({
      margin: '5px',
      fill: defaultStatus ? 'yellow' : '#FFAC33',
      viewBox: defaultStatus ? '0 0 1024 1024' : '0 0 36 36',
      d: defaultStatus ? moon : sun,
    })

    const handleChange = (status: boolean) => {
      appStore.toggleTheme(status)
    }
    
    watch(() => appStore.theme, (newTheme) => {
      svgStyle.fill = newTheme === 'theme-dark' ? 'yellow' : '#FFAC33'
      svgStyle.viewBox = newTheme === 'theme-dark' ? '0 0 1024 1024' : '0 0 36 36'
      svgStyle.d = newTheme === 'theme-dark' ? moon : sun
    })

    return {
      svg: computed(() => svgStyle),
      handleChange,
      defaultStatus,
      isDark: computed(() => appStore.theme === 'theme-dark')
    }
  }
})
</script>

<style lang="scss" scoped></style>
