from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from chat import get_response
from deep_translator import GoogleTranslator

app = Flask(__name__)
CORS(app)


user_language = None

@app.route('/', methods=['GET'])
def index_get():
    return render_template('base.html')

@app.route('/set_language', methods=['POST'])
def set_language():
    global user_language
    language = request.get_json().get("language", "").strip()

    if not language:
        return jsonify({"error": "The 'language' field is required!"}), 400

    user_language = language
    return jsonify({"message": f"Language set to {user_language}."})

@app.route('/predict', methods=['POST'])
def predict():
    if not user_language:
        return jsonify({"error": "Language is not set! Please set the language first."}), 400

    text = request.get_json().get("message", "").strip()

    if not text:
        return jsonify({"error": "The 'message' field is required!"}), 400

    try:
        # Translate input to English
        translated_input = GoogleTranslator(source=user_language, target='en').translate(text)
        print(f"Translated input to English: {translated_input}")

        # Get chatbot response in English
        response_in_english = get_response(translated_input)
        print(f"Chatbot response in English: {response_in_english}")

        if not response_in_english:
            return jsonify({"error": "Chatbot response is empty!"}), 500

        # Translate response back to the original language
        translated_response = GoogleTranslator(source='en', target=user_language).translate(response_in_english)
        print(f"Translated response: {translated_response}")

        if not translated_response:
            return jsonify({"error": "Translation of chatbot response failed!"}), 500

        # Return final response
        message = {"answer": translated_response}
        return jsonify(message)

    except Exception as e:
        # Handle any errors
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
