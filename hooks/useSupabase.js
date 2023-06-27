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

    const SUBSCRIBE = useCallback(async (from, key, value) => {
        supabase
            .channel('any')
            .on('postgres_changes', { event: '*', schema: 'public', table: from, }, payload => {
                console.log('Change received!', payload)
            })
            .subscribe()
    }, [])


    return { GET, GET_BY_ID, POST, POST_USER_TIME, SUBSCRIBE, isLoading, data, error }
}

export default useSupabase