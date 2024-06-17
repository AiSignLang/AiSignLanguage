from flask import Flask, request, jsonify
import tensorflow as tf
from flask_cors import CORS


# Load the model
model = tf.keras.models.load_model("./SavedModel")

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    # Assuming the input is in the format {"instances": [...]}
    #Dont assume, check
    if 'instances' not in data:
        return jsonify({'error': 'no instances key found'})
    input_data = data['instances']

    # Prepare the input tensor
    input_tensor = tf.convert_to_tensor(input_data)

    # Perform prediction
    predictions = model.predict(input_tensor)

    # Convert predictions to a list (if needed)
    prediction_list = predictions.numpy().tolist()

    # Return the predictions as JSON
    return jsonify({'predictions': prediction_list})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8501)
