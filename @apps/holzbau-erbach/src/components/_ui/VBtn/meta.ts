import type { PropType } from 'vue'
import { useColorProps, useSizeProps } from '../props'

export const useButtonProps = () => ({
  ...useColorProps(),
  ...useSizeProps(),
  variant: { type: String as PropType<'outlined' | 'tonal' | 'ghost'>, default: '' },
  value: { type: String, default: '' },
  icon: { type: String, default: '' },
  iconOnly: { type: Boolean, default: false },
  to: { type: String, default: '' },
  prependIcon: { type: String, default: '' },
  appendIcon: { type: String, default: '' },
  type: { type: String, default: 'button' },
  active: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
