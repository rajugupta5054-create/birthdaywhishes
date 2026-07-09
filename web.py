from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__, static_folder='.')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/greet', methods=['POST'])
def greet():
    data = request.get_json()
    name = data.get('name', '')
    
    # Using the logic from your original script
    n = "Happy "  
    s = "Birthday "
    c = "to You, " 
    
    # Creating the full message
    full_message = n + s + c + name
    
    return jsonify({'message': full_message})

if __name__ == '__main__':
    print("Starting server... Open http://127.0.0.1:5000 in your browser!")
    app.run(debug=True, port=5000)
