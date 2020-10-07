import {useState} from 'react'

const useCanvasEvents = () => {

    const [canvasEvents, setCanvasEvents] = useState([])

    const addCanvasEvent = (nativeEvent) =>{
        const {offsetX, offsetY} = nativeEvent

        setCanvasEvents(prev => [...prev, {offsetX, offsetY}]) 
    }

    const clearCanvasEvents = () => {
        setCanvasEvents([])
    }

    return{
        canvasEvents, addCanvasEvent, clearCanvasEvents
    }
}

export default useCanvasEvents



