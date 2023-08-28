import dayjs from 'dayjs'
import 'dayjs/locale/de'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { type UserModule } from '~/types'

export const install: UserModule = () => {
  dayjs.locale('de')
  dayjs.extend(LocalizedFormat)
}
