<template>
  <div class="toggler" @click="changeStatus">
    <div class="toggle-track"></div>
    <div
      class="slider"
      :style="{
        transform: toggleStyle.transform,
        backgroundColor: toggleStyle.background
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, watch } from 'vue'

export default defineComponent({
  name: 'ObToggle',
  props: {
    status: Boolean
  },
  emits: ['changeStatus'],
  setup(props, { emit }) {
    const { status } = props

    onMounted(() => {
      changeTransform()
    })

    const toggleStyle = reactive({
      transform: '',
      background: ''
    })
    let toggleStatus = status

    const changeStatus = () => {
      toggleStatus = !toggleStatus
      changeTransform()
      emit('changeStatus', toggleStatus)
    }

    const changeTransform = () => {
      const transform = toggleStatus ? '18px' : '0'
      toggleStyle.transform = `translateX(${transform})`
      const backgroundColor = toggleStatus ? '#6e40c9' : 'white'
      toggleStyle.background = backgroundColor
    }

    watch(() => props.status, (newStatus) => {
      toggleStatus = newStatus
      changeTransform()
    })

    return {
      toggleStyle,
      changeStatus
    }
  }
})
</script>

<style lang="scss" scoped>
.toggler {
  @apply relative;
  width: 40px;
  height: 22px;
  background-color: var(--background-primary);
  border-radius: 24px;
  border: 3px solid rgba(110, 64, 201, 0.35);
  box-sizing: border-box;
  transition: background-color 250ms ease;
}
.slider {
  top: -6px;
  left: -6px;
  width: 28px;
  height: 28px;
  background-color: white;
  border-radius: 50%;
  transition: all 250ms cubic-bezier(0.4, 0.03, 0, 1) 0s;
  @apply absolute shadow-lg;
}
</style>
