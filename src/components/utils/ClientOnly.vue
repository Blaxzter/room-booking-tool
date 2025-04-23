<script lang="ts">
import { defineComponent, ref, onMounted, h } from 'vue'

export default defineComponent({
  name: 'ClientOnly',
  props: {
    placeholder: String,
    fallback: Object
  },
  setup(props, { slots }) {
    const isMounted = ref(false)
    
    onMounted(() => {
      isMounted.value = true
    })
    
    return () => {
      if (isMounted.value) {
        return slots.default ? slots.default() : null
      }
      
      // Priority: 1. slot placeholder, 2. fallback component, 3. placeholder text
      if (slots.placeholder) {
        return slots.placeholder()
      } else if (props.fallback) {
        return h(props.fallback)
      } else if (props.placeholder) {
        return h('span', props.placeholder)
      }
      
      return null
    }
  }
})
</script> 