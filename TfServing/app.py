import json
import tensorflow as tf
import numpy as np
from flask import Flask, request, jsonify

# Load the .keras model
model = tf.keras.models.load_model('dynamicModel.keras')
actions = ['hallo', 'wiegehtesdir', 'tschüss', 'ich', 'du', 'wir']

app = Flask(__name__)


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print(f"Received request: {data}")
        if 'instances' not in data:
            return jsonify({'error': 'no instances key found'}), 400

        data_reshaped = np.reshape(data['instances'], (-1, 30, 1662))
        input_tensor = tf.convert_to_tensor(data_reshaped)
        # Print input shape
        print(f"Input shape: {input_tensor.shape}")

        # Perform prediction
        predictions = model(input_tensor)
        prediction_list = predictions.numpy().tolist()
        print(f"Predictions: {prediction_list}")

        response = {
            'classes': actions,
            'probabilities': prediction_list
        }
        return jsonify(response)
    except json.JSONDecodeError:
        error_msg = {'error': 'Invalid JSON format'}
        print(f"JSON Error: {error_msg}")
        return jsonify(error_msg), 400
    except tf.errors.InvalidArgumentError as e:
        error_msg = {'error': f'Invalid model input: {str(e)}'}
        print(f"TensorFlow Error: {error_msg}")
        return jsonify(error_msg), 400
    except Exception as e:
        error_msg = {'error': str(e)}
        print(f"Error: {error_msg}")
        return jsonify(error_msg), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8501)
