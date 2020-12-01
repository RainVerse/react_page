from flask import Flask
from flask_cors import CORS
from modules.apis import apis
from modules.web_pages import web_pages

app = Flask(__name__)

app.register_blueprint(apis, url_prefix='/apis')
app.register_blueprint(web_pages)
CORS(app, supports_credentials=True)
if __name__ == '__main__':
    print("server start")
    app.run('127.0.0.1', port=5000, debug=True)
    # app.run('0.0.0.0', port=5000, debug=True)
