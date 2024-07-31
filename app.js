const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => { });

app.post('/prompts', (req, res) => {
    const runPromt = async () => {

        const userPrompt = req.body;
        console.log(userPrompt);

        const prompt = `I created a website of blessings,
          I want you to give me back 3 answers to the following request: ${userPromt}
          return the response in a parsable JSON format like follows:
         {
         "1":"...",
         "2":"...",
         "3":"..."
         }`;
        const response = await openai.createCompletion({
            model: "gpt-3.5-turbo",
            prompt: prompt,
            max_tokens: 100,
        });
        const parseableJSONresponse = response.data.choices[0];
        let parseResponse;
        try {
            parseResponse = JSON.parse(parseableJSONresponse);
        } catch (error) {
        }
        return { parseResponse };
    }
    runPromt()
        .then(({ parseResponse }) => {
            if (Object.keys(parseResponse).length > 0) {
                res.statusCode = 200;
                res.send(parseResponse);
            }
            else {
                res.statusCode = 404;
                res.send(error);
            }
        }
        )
});

app.listen(process.env.PORT, (req, res) => {
    console.log(`listen in port ${process.env.PORT}`);
})