import path from 'path'
import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'

export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const lang = searchParams.get('lang')
    const jsonDirectory = path.join(process.cwd(), 'json')
    //Read the json data file data.json
    const fileContents = await fs.readFile(jsonDirectory + `/${lang}.json`, 'utf8')

    return NextResponse.json({ content: JSON.parse(fileContents) })
}