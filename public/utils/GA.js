import ReactGA from 'react-ga4'

export const initGA = () => {
    ReactGA.initialize('G-3SF2GKZV3L')
}

export const logPageView = () => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname })
}

export const GAclickEvent = (category, label) => {
    ReactGA.event({
        category: category,
        action: 'click',
        label: label,
    })
}