from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__, 
            static_url_path='',
            template_folder='.')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/cadastro')
def cadastro():
    return render_template('cadastro_empresa.html')

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path)

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
