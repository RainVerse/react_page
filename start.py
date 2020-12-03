from flask import Flask
from flask_cors import CORS
from modules.apis.base_api import apis
from modules.web_pages.index_page import web_pages
from config import Config

app = Flask(__name__)
app.register_blueprint(apis, url_prefix='/apis')
app.register_blueprint(web_pages)
app.config.from_object(Config)
CORS(app, supports_credentials=True)
if __name__ == '__main__':
    print("server start")
    app.run('127.0.0.1', port=5000, debug=True)
    # app.run('0.0.0.0', port=5000, debug=True)
