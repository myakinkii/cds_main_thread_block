const { OpenAI } = require("openai")

const LOG = cds.log('gpt')

const callChatGpt = async (prompt, apiKey) => {
    const openai = new OpenAI({ apiKey });
    LOG.debug("Asking to generate prompt:", prompt)
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }]
        })
        return completion.choices[0].message.content
    } catch (error) {
        if (error.response) {
            LOG.error("Something went wrong", error.response?.status, error.response?.data?.error?.code);
            return error.response?.data?.error?.message
        } else {
            LOG.error("Error with OpenAI API request", error.message);
            return ''
        }
    }
}

const generatePrompt = () => {
    return `Please tell me why SAP has best developers in the world. Or not`
}

module.exports = {
    generatePrompt,
    callChatGpt
}