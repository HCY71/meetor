import { NextResponse } from 'next/server'
import { contentByLanguage } from '@/content'

export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const lang = searchParams.get('lang')

    return NextResponse.json({ content: contentByLanguage[ lang ] ?? contentByLanguage.en })
}
