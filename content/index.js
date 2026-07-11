import { validate } from "./validate"

import aboutSchema from "./about/schema"
import aboutEn from "./about/en"
import aboutZhTw from "./about/zh-tw"
import homeSchema from "./home/schema"
import homeEn from "./home/en"
import homeZhTw from "./home/zh-tw"
import eventSchema from "./event/schema"
import eventEn from "./event/en"
import eventZhTw from "./event/zh-tw"
import notFoundSchema from "./notFound/schema"
import notFoundEn from "./notFound/en"
import notFoundZhTw from "./notFound/zh-tw"
import eventNotFoundSchema from "./eventNotFound/schema"
import eventNotFoundEn from "./eventNotFound/en"
import eventNotFoundZhTw from "./eventNotFound/zh-tw"
import globalSchema from "./global/schema"
import globalEn from "./global/en"
import globalZhTw from "./global/zh-tw"
import seoSchema from "./seo/schema"
import seoContent from "./seo/content"
import authorSchema from "./author/schema"
import authorContent from "./author/content"

const localizedSchemas = {
    about: aboutSchema,
    home: homeSchema,
    event: eventSchema,
    notFound: notFoundSchema,
    eventNotFound: eventNotFoundSchema,
    global: globalSchema,
}

// Each Language Ships The Same Sections And Both Are Validated Against The
// Same Schema, So A Field Missing From One Translation Fails The Dev Overlay
// And The Production Build With The Exact Field Path.
export const contentByLanguage = {
    "en": {
        about: aboutEn,
        home: homeEn,
        event: eventEn,
        notFound: notFoundEn,
        eventNotFound: eventNotFoundEn,
        global: globalEn,
    },
    "zh-tw": {
        about: aboutZhTw,
        home: homeZhTw,
        event: eventZhTw,
        notFound: notFoundZhTw,
        eventNotFound: eventNotFoundZhTw,
        global: globalZhTw,
    },
}

Object.entries(contentByLanguage).forEach(([ language, sections ]) =>
    Object.entries(localizedSchemas).forEach(([ sectionName, schema ]) =>
        validate(sections[ sectionName ], schema, `${language}.${sectionName}`)
    )
)

validate(seoContent, seoSchema, "seo")
validate(authorContent, authorSchema, "author")

export const seo = seoContent
export const author = authorContent
