const generateQuestion = () => {
    const difficulties = [
        { type: 'arithmetic', timeLimit: 10 },
        { type: 'algebra', timeLimit: 20 },
        { type: 'complex', timeLimit: 30 }
    ];

    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    let question, answer;

    switch (difficulty.type) {
        case 'arithmetic':
            const num1 = Math.floor(Math.random() * 100);
            const num2 = Math.floor(Math.random() * 100);
            const operators = ['+', '-', '*'];
            const operator = operators[Math.floor(Math.random() * operators.length)];
            question = `${num1} ${operator} ${num2}`;
            answer = eval(question);
            break;

        case 'algebra':
            const x = Math.floor(Math.random() * 10) + 1;
            const a = Math.floor(Math.random() * 5) + 1;
            const b = Math.floor(Math.random() * 20);
            question = `${a}x + ${b} = ${a * x + b}, what is x?`;
            answer = x;
            break;

        case 'complex':
            const base = Math.floor(Math.random() * 10) + 2;
            const exponent = Math.floor(Math.random() * 3) + 2;
            question = `${base}^${exponent} = ?`;
            answer = Math.pow(base, exponent);
            break;
    }

    return {
        question,
        answer,
        timeLimit: difficulty.timeLimit,
        type: difficulty.type
    };
};

const verifyAnswer = (userAnswer, correctAnswer) => {
    return Math.abs(parseFloat(userAnswer) - correctAnswer) < 0.001;
};

module.exports = { generateQuestion, verifyAnswer };
