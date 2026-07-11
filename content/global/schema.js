const globalSchema = {
    button: {
        submit: "string",
        back: "string",
        auto: "string",
        close: "string",
        donate: "string",
        logout: "string",
    },
    weekdays: "string[]",
    settings: {
        title: "string",
        theme: "string",
        language: "string",
        weekStart: {
            title: "string",
            sun: "string",
            mon: "string",
        },
        timeFormat: "string",
        about: "string",
    },
    toast: {
        loading: "string",
        success: "string",
        saved: "string",
        error: "string",
        linkCopied: "string",
        nameFirst: "string",
        emptyForm: "string",
        selectPast: "string",
    },
    donateAlert: {
        title: "string",
        content: "string",
    },
    updates: {
        timezone: {
            title: "string",
            content: "string",
        },
        close: "string",
    },
    panel: {
        dates: "string",
        days: "string",
        yourTime: "string",
        groupTime: "string",
    },
    timeTable: {
        available: "string",
        at: "string",
        all: "string",
    },
    footer: {
        title: "string",
    },
    tips: {
        dragSelect: "string",
        hoverToShow: "string",
        tapToShow: "string",
        forMore: "string?",
        allDay: "string",
    },
}

export default globalSchema
