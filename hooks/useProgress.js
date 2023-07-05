import { useNavigationEvent } from './useNavigationEvent'

import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false })

export const useProgress = () => {
    useNavigationEvent(NProgress.start, NProgress.done)
}
