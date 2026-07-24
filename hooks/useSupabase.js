import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const useSupabase = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const GET = useCallback(async (from, select) => {
    setIsLoading(true);
    const { data, error } = await supabase.from(from).select(select);
    setData(data);
    setError(error);
    setIsLoading(false);
    if (error) throw error;
  }, []);
  const GET_EVENT_TOTAL = useCallback(async (abortSignal) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_statistics")
        .select("events_created")
        .eq("id", "global")
        .abortSignal(abortSignal)
        .single();

      if (error) throw error;
      setData(data.events_created);
      setError(null);
    } catch (eventTotalError) {
      if (abortSignal.aborted) return;
      setError(eventTotalError);
    } finally {
      if (!abortSignal.aborted) setIsLoading(false);
    }
  }, []);
  const GET_BY_ID = useCallback(async (from, id) => {
    setIsLoading(true);
    const { data, error } = await supabase.from(from).select().eq("id", id);
    setData(data);
    setError(error);
    setIsLoading(false);
    if (error) throw error;
  }, []);
  const POST = useCallback(async (from, upsert) => {
    setIsLoading(true);
    const { data: createdEvent, error: createEventError } = await supabase
      .from(from)
      .upsert(upsert)
      .select("id")
      .single();
    setError(createEventError);
    setIsLoading(false);
    if (createEventError) throw createEventError;
    if (createdEvent) router.push(`/events/${createdEvent.id}`);
  }, [router]);
  const POST_USER_TIME = useCallback(async (eventId, update) => {
    if (!update.user) return;

    const { data: dataFound, error: errorFound } = await supabase
      .from("events")
      .select("users")
      .eq("id", eventId)
      .single();

    if (!errorFound && update.user) {
      if (
        dataFound.users &&
        dataFound.users.some((u) => u?.user === update.user)
      ) {
        const { error: updateEventError } = await supabase
          .from("events")
          .update({
            users: dataFound.users.map((u) => {
              if (u.user === update.user) return update;
              else return u;
            }),
          })
          .eq("id", eventId);
        setError(updateEventError);
        if (updateEventError) throw updateEventError;
      } else {
        const { error: updateEventError } = await supabase
          .from("events")
          .update({
            users: dataFound.users ? [...dataFound.users, update] : [update],
          })
          .eq("id", eventId);
        setError(updateEventError);
        if (updateEventError) throw updateEventError;
      }
    }
  }, []);

  const subscribeToEventUsers = useCallback((eventId, onUsersChange) => {
    const abortController = new AbortController();
    let realtimeUpdateCount = 0;

    const fetchCurrentEventUsers = async () => {
      const realtimeUpdateCountBeforeFetch = realtimeUpdateCount;
      const { data: currentEvent, error: currentEventError } = await supabase
        .from("events")
        .select("users")
        .eq("id", eventId)
        .abortSignal(abortController.signal)
        .single();

      if (abortController.signal.aborted || currentEventError) return;
      if (realtimeUpdateCount !== realtimeUpdateCountBeforeFetch) return;
      onUsersChange(currentEvent.users);
    };

    const channel = supabase
      .channel(`event-${eventId}-users`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "events",
          filter: `id=eq.${eventId}`,
        },
        (payload) => {
          realtimeUpdateCount += 1;
          onUsersChange(payload.new?.users);
        },
      )
      .subscribe((subscriptionStatus) => {
        if (subscriptionStatus === "SUBSCRIBED") fetchCurrentEventUsers();
      });

    return () => {
      abortController.abort();
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    GET,
    GET_EVENT_TOTAL,
    GET_BY_ID,
    POST,
    POST_USER_TIME,
    subscribeToEventUsers,
    isLoading,
    setIsLoading,
    data,
    error,
  };
};

export default useSupabase;
