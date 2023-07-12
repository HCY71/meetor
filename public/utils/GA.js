import ReactGA from 'react-ga'

export const initGA = () => {
    ReactGA.initialize('G-3SF2GKZV3L')
}

export const logPageView = () => {
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
}