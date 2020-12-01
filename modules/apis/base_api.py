from . import apis
from pynput.mouse import Button, Controller
from flask import request
import json
from start import app


@apis.route('/command', methods=['POST'])
def control_command():
    if not request.form:
        return 'fail'
    style = request.form['style']
    x = request.form['x']
    y = request.form['y']
    app.logger.warning(style + x + y)
    mouse = Controller()
    app.logger.warning('The current pointer position is {0}'.format(mouse.position))
    mouse.position = (int(x), int(y))
    mouse.click(Button.left)
    app.logger.warning('mouse clicked at {0}'.format(mouse.position))
    return '1'
