import type { PropType } from 'vue'

export const useColorProps = () => ({
  color: { type: String as PropType<'default' | 'primary' | 'info' | 'success' | 'warning' | 'danger' | string>, default: 'default' },
})

export const useSizeProps = () => ({
  size: { type: String as PropType<'sm' | 'lg'>, default: '' },
})
