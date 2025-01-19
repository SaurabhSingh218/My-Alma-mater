class Chatbox {
    constructor() {
        this.args = {
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            languageSelect: document.querySelector('#language'),
            setLanguageButton: document.querySelector('#set-language-btn')
        };

        this.messages = [];
        this.language = null;
    }

    display() {
        const { chatBox, sendButton, setLanguageButton } = this.args;

        chatBox.classList.add('chatbox--active');

        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        setLanguageButton.addEventListener('click', () => this.setLanguage());

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }

    setLanguage() {
        this.language = this.args.languageSelect.value;

        fetch('https://my-alma-mater.onrender.com/set_language', {
            method: 'POST',
            body: JSON.stringify({ language: this.language }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    onSendButton(chatBox) {
        var textField = chatBox.querySelector('input');
        let text1 = textField.value;
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 };
        this.messages.push(msg1);

        fetch('https://my-alma-mater.onrender.com/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(r => r.json())
        .then(r => {
            let msg2 = { name: "Sam", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatBox);
            textField.value = '';
        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatBox);
            textField.value = '';
        });
    }

    updateChatText(chatBox) {
        var html = '';
        this.messages.slice().reverse().forEach(function (item) {
            if (item.name === "Sam") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
            }
        });

        const chatMessage = chatBox.querySelector('.chatbox__messages');
        chatMessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.display();
