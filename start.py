from flask import Flask
from modules.apis import apis
from modules.web_pages import web_pages

app = Flask(__name__)

app.register_blueprint(apis, url_prefix='/apis')
app.register_blueprint(web_pages)
if __name__ == '__main__':
    print("server start")
    app.run('0.0.0.0', port=5000, debug=True)
