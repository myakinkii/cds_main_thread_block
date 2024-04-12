const { generatePrompt, callChatGpt } = require('./gpt-handler')
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

const MAKE_IT_BLOCK = !!process.env.MAKE_IT_BLOCK

// you can put this to server.js to test rest handler
/*
const { generatePrompt, callChatGpt } = require('./gpt-handler')
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
cds.on('bootstrap', app => {
    app.get('/gpt-rest/call', async (_, res) => {
        if (!OPENAI_API_KEY) return res.status(400).send('NO_OPEN_API_KEY')
        const content = await callChatGpt(generatePrompt(), OPENAI_API_KEY)
        res.status(200).send(content)
    })
})
*/

module.exports = cds.service.impl(async function () {
    this.on("call", async (req) => {
        
        if (!OPENAI_API_KEY) throw new Error('NO_OPEN_API_KEY')

        const { dummy } = cds.entities("gpt")
        const { id } = req.params[0] || {}
        // suppose we nee some props or any stuff from db
        if (MAKE_IT_BLOCK) await cds.read(dummy,{id}) // root tx, no COMMIT is done yet
        else await cds.tx(async (tx) => { tx.read(dummy,{id}) }) // own tx does BEGIN and COMMIT
        // but we don't know how to UNBLOCK draft case though
        
        // our actual slow call
        const text = await callChatGpt(generatePrompt(), OPENAI_API_KEY)

        // store results
        if (req.target) await cds.update(req.target, { id }).with({ text }) // bound action
        else await cds.create(dummy).entries({text}) // unbound action

        return text
         
    })
})