from flask import Flask, request

app = Flask(__name__)

@app.route('/webhook', methods=['GET'])
def verify():
    mode = request.args.get('hub.mode')
    token = request.args.get('hub.verify_token')
    challenge = request.args.get('hub.challenge')

    if mode == 'subscribe' and token == '123456':
        return {'hub.challenge': challenge}, 200
    else:   
        return 'Verification failed', 403

if __name__ == '__main__':
    app.run(port=4000)
