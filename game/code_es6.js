/*
  --- Expert level ---
  8. After you display the result, display the next random question, so that the game never ends (Hint: write a function for this and call it right after displaying the result)
  9. Be careful: after Task 8, the game literally never ends. So include the option to quit the game if the user writes 'exit' instead of the answer. In this case, DON'T call the function from task 8.
  10. Track the user's score to make the game more fun! So each time an answer is correct, add 1 point to the score (Hint: I'm going to use the power of closures for this, but you don't have to, just do this with the tools you feel more comfortable at this point).
  11. Display the score in the console. Use yet another method for this.
*/

// request api
class Question {
    constructor(question, answers, correct) {
        this.question = question;
        this.answers = answers;
        this.correct = correct;
    }

    displayQuestion = () => {
        // show the question
        document.getElementById("question").innerHTML = this.question;

        // add elements to questions
        /* <li class="answerOption" onclick="nextQuestion(0, 1)">
             <input type="radio" class="radioCustomButton" name="radioGroup" value="Sony">
             <label class="radioCustomLabel" for="Sony">Amazing</label>
        </li> */

        document.getElementById('answers').innerHTML = '';

        this.answers.map((item, index) => {
            // create li element
            const li = document.createElement("li");
            li.setAttribute("class", "answerOption");

            // create input radio
            const input = document.createElement("input");
            input.setAttribute("type", "radio");
            input.setAttribute("class", "radioCustomButton");
            input.setAttribute("name", "radioGroup");
            input.setAttribute("id", index);
            input.setAttribute("value", index);

            // create label
            const label = document.createElement("label");
            label.setAttribute("class", "radioCustomLabel");
            label.setAttribute("for", index);
            label.appendChild(document.createTextNode(this.answers[index]));

            li.appendChild(input);
            li.appendChild(label);
            document.getElementById("answers").appendChild(li);
        });
    }

    checkAnswer = ans => {
        if (ans === this.correct) {
            document.getElementById("title").innerText = "Correct answer!";
            document.getElementById("header").setAttribute("style", "background-color: #007d04;");
            score.addScore();
        } else {
            document.getElementById("title").innerText = "Wrong answer. Try again :)";
            document.getElementById("header").setAttribute("style", "background-color: #8e0404;");
        }
        this.displayScore();
        // get answer

    }

    displayScore = () => {
        document.getElementById("score").innerText = score.getScore();
    }
}

function Score(sc) {
    let _sc = sc;
    this.addScore = () => {
        _sc++;
    };
    this.getScore = () => _sc;
}

let score = new Score(0);
const questions = [];

// get data from api
// convert data from api
loadQuestions = () => {
    fetch("https://us-central1-datamonkeys-a03bd.cloudfunctions.net/api/questions")
        .then((resp) => resp.json()) // Transform the data into json
        .then(data => {
            data.map(item => {
                questions.push(
                    new Question(
                        item.question,
                        item.answers,
                        parseInt(item.correctAnswer)
                    )
                );
            });
            nextQuestion();
        });
}

nextQuestion = () => {
    const n = Math.floor(Math.random() * questions.length);
    questions[n].displayQuestion();
    console.log(n);


    const validate = () => {
        const elements = document.getElementsByTagName("input");

        Object.keys(elements).map(function(key, index) {
        if (elements[index] && elements[index].checked) {
                questions[n].checkAnswer(parseInt(elements[index].value));
                console.log(n);
                document.getElementById("confirm").removeEventListener("click", validate);
                nextQuestion();
            }
        });
    };

    document.getElementById("confirm").addEventListener("click", validate);
}
