import json
import tensorflow as tf
import numpy as np
import asyncio
import websockets

# Load the .keras model
model = tf.keras.models.load_model('dynamicModel.keras')

actions = ['hallo', 'wiegehtesdir', 'tschüss', 'ich', 'du', 'wir']


async def handle_client_connection(websocket, path):
    print(f'New connection from {websocket.remote_address}')
    try:
        request = await websocket.recv()
        print(f"Received request: Request")
        # Parse the JSON request
        data = json.loads(request)
        if 'instances' not in data:
            response = json.dumps({'error': 'no instances key found'})
            if websocket.open:  # Check if the connection is still open
                await websocket.send(response)
            return

        data_reshaped = np.reshape(data['instances'], (-1, 30, 1662))
        input_tensor = tf.convert_to_tensor(data_reshaped)
        #print input shape
        # Perform prediction
        predictions = model(input_tensor)
        prediction_list = predictions.numpy().tolist()
        print(f"Predictions: {prediction_list}")

        # Send the response
        response = json.dumps(
            {
                'classes': actions,
                'probabilities': prediction_list
            }
        )
        if websocket.open:  # Check if the connection is still open
            await websocket.send(response)
    except Exception as e:
        response = json.dumps({'error': str(e)})
        print(f"Error: {response}")
        if websocket.open:  # Check if the connection is still open
            await websocket.send(response)


async def main():
    async with websockets.serve(handle_client_connection, "localhost", 8501):
        print("Server started at ws://localhost:8501")
        await asyncio.Future()  # Run forever


if __name__ == '__main__':
    asyncio.run(main())
