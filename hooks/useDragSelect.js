'use client'

const useDragSelect = () => {

    const onMove = ({ store: { changed: { added, removed } } }, handler) => {
        handler(prev => {
            const next = new Set(prev)

            added.map(a => a.id).forEach(id => next.add(id))
            removed.map(r => r.id).forEach(id => next.delete(id))
            return [ ...next ]
        })
    }

    return { onMove }
}

export default useDragSelect