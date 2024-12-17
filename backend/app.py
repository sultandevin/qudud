import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import nltk
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from newspaper import Article
import warnings

warnings.filterwarnings('ignore')
nltk.download('punkt', quiet=True)

app = Flask(__name__)
CORS(app)

def scrape_articles():
    urls = [
        'https://www.webmd.com/smoking-cessation/ss/slideshow-13-best-quit-smoking-tips-ever',
        'https://www.mayoclinic.org/healthy-lifestyle/quit-smoking/in-depth/nicotine-craving/art-20045454',
        'https://www.quit.org.au/'
    ]

    corpus = ""
    for url in urls:
        try:
            article = Article(url)
            article.download()
            article.parse()
            article.nlp()
            corpus += article.text + "\n\n"
        except Exception as e:
            print(f"Error fetching {url}: {str(e)}")
            continue

    return corpus if corpus else "Unable to fetch articles. Using default responses."

def greeting_response(text):
    text = text.lower()
    bot_greetings = ['heyyo', 'hi! how can i assist you today?', 'hello', 'hey', 'hola', 'sugeng rawuh']
    user_greetings = ['hey', 'hi', 'hello', 'greetings', 'wassup', 'halo']

    for word in text.split():
        if word in user_greetings:
            return random.choice(bot_greetings)

def personalized_motivation(user_data):
    craving_level = int(user_data['craving_level'])
    mood = user_data['mood'].lower()
    reason_to_quit = user_data['reason_to_quit']

    messages = []

    if craving_level > 7:
        messages.append("Stay strong! These intense cravings are temporary. Try deep breathing or distracting yourself with another activity.")
    else:
        messages.append("Great! Your cravings seem manageable. Keep up the effort!")

    if mood in ['stressed', 'bored']:
        messages.append("Feeling stressed or bored? Try light exercise, reading a book, or listening to music to distract yourself.")

    messages.append(f"Remember your main reason: '{reason_to_quit}'. Stay focused and believe in yourself to reach your goal!")

    return "\n".join(messages)

def craving_tips():
    tips = [
        "Drinking a glass of water can help reduce cravings.",
        "Distract yourself by going for a walk or doing light exercise.",
        "Try meditation or deep breathing for 5 minutes.",
        "Chew sugar-free gum to replace the habit of smoking.",
        "Remember your reason for quitting. It will help you stay focused."
    ]
    return random.choice(tips)

def index_sort(list_var):
    length = len(list_var)
    list_index = list(range(0, length))

    x = list_var
    for i in range(length):
        for j in range(length):
            if x[list_index[i]] > x[list_index[j]]:
                temp = list_index[i]
                list_index[i] = list_index[j]
                list_index[j] = temp

    return list_index

class ChatbotSession:
    def __init__(self):
        self.corpus = scrape_articles()
        self.sentence_list = nltk.sent_tokenize(self.corpus)
        self.user_data = {}

    def bot_response(self, user_input):
        user_input = user_input.lower()
        self.sentence_list.append(user_input)
        bot_response = ''

        # Check for greetings
        greeting = greeting_response(user_input)
        if greeting:
            return greeting

        # Check for specific keywords
        if "motivation" in user_input:
            return personalized_motivation(self.user_data)
        elif "craving" in user_input:
            return craving_tips()
        elif "exit" in user_input:
            return "Thank you for using Qudud. Stay strong and believe in yourself!"

        cm = CountVectorizer().fit_transform(self.sentence_list)
        similarity_scores = cosine_similarity(cm[-1], cm)
        similarity_scores_list = similarity_scores.flatten()
        index = index_sort(similarity_scores_list)
        index = index[1:]
        response_flag = 0

        j = 0
        for i in range(len(index)):
            if similarity_scores_list[index[i]] > 0.0:
                bot_response = bot_response + ' ' + self.sentence_list[index[i]]
                response_flag = 1
                j = j + 1
                if j > 2:
                    break

        if response_flag == 0:
            bot_response = bot_response + ' ' + "I apologize, I don't understand."

        self.sentence_list.remove(user_input)

        return bot_response

chatbot_session = ChatbotSession()

@app.route('/initialize', methods=['POST'])
def initialize_session():
    data = request.json
    chatbot_session.user_data = {
        "smoking_frequency": str(max(0, int(data.get('smoking_frequency', 10)))),
        "craving_level": str(max(1, min(10, int(data.get('craving_level', 5))))),
        "mood": data.get('mood', 'neutral'),
        "reason_to_quit": data.get('reason_to_quit', 'health')
    }
    return jsonify({"message": "Session initialized", "user_data": chatbot_session.user_data})

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message', '')
    response = chatbot_session.bot_response(user_input)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True, port=5000)