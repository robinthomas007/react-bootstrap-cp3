import React, { useState, useRef, useEffect } from 'react';

const ImagePopup = ({ screenshot }) => {
    const [canvas, setCanvas] = useState(null);
    const [context, setContext] = useState(null);
    const [startX, setStartX] = useState(null);
    const [startY, setStartY] = useState(null);
    const [endX, setEndX] = useState(null);
    const [endY, setEndY] = useState(null);
    const [comments, setComments] = useState('');
    const [start, setStart] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const canvasRef = useRef(null);
    const imageRef = useRef(null); // Add a ref for the image

    useEffect(() => {
        const canvasElement = canvasRef.current;
        const canvasContext = canvasElement.getContext('2d');
        setCanvas(canvasElement);
        setContext(canvasContext);

        const image = new Image();
        image.src = screenshot;
        image.onload = () => {
            imageRef.current = image; // Store the image in the ref
            canvasContext.drawImage(image, 0, 0, canvas.width, canvas.height);
            setImageUrl(screenshot);
        };
    }, [screenshot]);

    const handleMouseDown = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        setStartX(offsetX);
        setStartY(offsetY);
        setStart(true)
    };

    const handleMouseUp = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        setEndX(offsetX);
        setEndY(offsetY);
        setStart(false)
    };

    const handleMouseMove = (e) => {
        if (startX !== null && startY !== null && start) {
            const { offsetX, offsetY } = e.nativeEvent;
            setEndX(offsetX);
            setEndY(offsetY);
            drawRectangle(startX, startY, offsetX, offsetY);
        }
    };

    const drawRectangle = (x1, y1, x2, y2) => {
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height); // Use imageRef.current
            context.strokeStyle = 'red';
            context.lineWidth = 2;
            context.strokeRect(x1, y1, x2 - x1, y2 - y1);
        }
    };

    const handleSave = () => {
        if (canvas && context && startX !== null && startY !== null) {
            drawRectangle(startX, startY, endX, endY);

            // Create a new canvas with the selected area
            const selectedWidth = Math.abs(endX - startX);
            const selectedHeight = Math.abs(endY - startY);
            const newCanvas = document.createElement('canvas');
            newCanvas.width = canvas.width;
            newCanvas.height = canvas.height;
            const newContext = newCanvas.getContext('2d');

            // Draw the original image onto the new canvas
            newContext.drawImage(imageRef.current, 0, 0, newCanvas.width, newCanvas.height);

            // Draw the drawn rectangle onto the new canvas
            newContext.strokeStyle = 'red';
            newContext.lineWidth = 2;
            newContext.strokeRect(startX, startY, selectedWidth, selectedHeight);

            // Update the image source with the new canvas
            setImageUrl(newCanvas.toDataURL());

            // Display comments
            setComments('User comments here...');
        }
    };

    return (
        <div className="popup">
            <h1>canvas</h1>
            <canvas
                ref={canvasRef}
                width={1300}
                height={600}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}

            />


            <img src={imageUrl} alt="Original" style={{ display: 'none' }} />

            <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
            />
            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default ImagePopup;
