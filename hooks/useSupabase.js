import { useState, useCallback } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

const useSupabase = () => {
    const [ isLoading, setIsLoading ] = useState(true)
    const [ data, setData ] = useState(null)
    const [ error, setError ] = useState(null)
    const router = useRouter()
    const GET = useCallback(async (from, select) => {
        setIsLoading(true)
        const { data, error } = await supabase.from(from).select(select)
        setData(data)
        setError(error)
        setIsLoading(false)
        if (error) throw error
    }, [])
    const GET_EVENT_TOTAL = useCallback(async (abortSignal) => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('site_statistics')
                .select('events_created')
                .eq('id', 'global')
                .abortSignal(abortSignal)
                .single()

            if (error) throw error
            setData(data.events_created)
            setError(null)
        } catch (eventTotalError) {
            if (abortSignal.aborted) return
            setError(eventTotalError)
        } finally {
            if (!abortSignal.aborted) setIsLoading(false)
        }
    }, [])
    const GET_BY_ID = useCallback(async (from, id) => {
        setIsLoading(true)
        const { data, error } = await supabase.from(from).select().eq('id', id)
        setData(data)
        setError(error)
        setIsLoading(false)
        if (error) throw error
    }, [])
    const POST = useCallback(async (from, upsert) => {
        setIsLoading(true)
        const { data, error } = await supabase.from(from).upsert(upsert).select()
        setData(data)
        setError(error)
        setIsLoading(false)
        if (error) throw error
        if (!error && data) router.push(`/events/${data[ 0 ].id}`)
    }, [])
    const POST_USER_TIME = useCallback(async (eventId, update) => {
        setIsLoading(true)
        const { data: dataFound, error: errorFound } = await supabase
            .from('events')
            .select('users')
            .eq('id', eventId)
            .single()

        if (!errorFound && update.user) {
            if (dataFound.users && dataFound.users.some(u => u?.user === update.user)) {
                const { data, error } = await supabase
                    .from('events')
                    .update({
                        users: dataFound.users.map(u => {
                            if (u.user === update.user) return update
                            else return u
                        })
                    })
                    .eq('id', eventId)
                    .select()
                // setData(data)
                setError(error)
                setIsLoading(false)
                if (error) throw error
            } else {
                const { data, error } = await supabase
                    .from('events')
                    .update({
                        users: dataFound.users ? [ ...dataFound.users, update ] : [ update ]
                    })
                    .eq('id', eventId)
                    .select()
                // setData(data)
                setError(error)
                setIsLoading(false)
                if (error) throw error
            }
        }
    }, [])

    const SUBSCRIBE = useCallback(async (from, callback, id) => {
        supabase
            .channel('schema-db-changes')
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: from,
                    filter: `id=eq.${id}`,
                },
                payload => {
                    callback(payload.new?.users)
                })
            .subscribe()
    }, [])


    return { GET, GET_EVENT_TOTAL, GET_BY_ID, POST, POST_USER_TIME, SUBSCRIBE, isLoading, setIsLoading, data, error }
}

export default useSupabase
