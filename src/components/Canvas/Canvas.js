import React, { useRef, useEffect, useState } from "react";
import useCanvasEvents from "./useCanvasEvents";

function Canvas(props) {
  // useRef is used so the component doesnt rerender during the drawing
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { canvasEvents, addCanvasEvent, clearCanvasEvents } = useCanvasEvents();

  useEffect(() => {
    //initializing values
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth / 2}px`;
    canvas.style.height = `${window.innerHeight / 2}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  console.log(props.is_creator);

  //when the mouse is clicked and held it will start drawing
  const startDrawing = ({ nativeEvent }) => {
    if (props.is_creator) {
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      addCanvasEvent(nativeEvent);
      setIsDrawing(true);
    } else {
      return;
    }
  };

  //when the mouse is finished clicking it will stop the drawing
  const finishDrawing = ({ nativeEvent }) => {
    if (props.is_creator) {
      contextRef.current.closePath();
      setIsDrawing(false);
      props.socket.emit("finish drawing", { lobby: props.lobby, canvasEvents });
      clearCanvasEvents();
    }
  };

  //when the mouse is being dragged while clicking
  const draw = ({ nativeEvent }) => {
    if (props.is_creator) {
      if (!isDrawing) {
        return;
      }
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
      addCanvasEvent(nativeEvent);
    }
  };

  props.socket.on("emit draw finish", (data) => {
    if (!data.canvasEvents.length) return;
    const [firstEvent] = data.canvasEvents.splice(0, 1);

    contextRef.current.beginPath();
    contextRef.current.moveTo(firstEvent.offsetX, firstEvent.offsetY);
    data.canvasEvents.forEach((e) => {
      contextRef.current.lineTo(e.offsetX, e.offsetY);
      contextRef.current.stroke();
    });
    contextRef.current.closePath();
  });

  return (
    <div>
      <canvas
        className="whiteboard"
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </div>
  );
}

export default Canvas;
