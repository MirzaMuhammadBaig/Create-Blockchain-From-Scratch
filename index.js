const { json } = require("body-parser");
const bodyParser = require("body-parser");
const { response } = require("express");
const express = require("express");
const request = require("request");
const Blockchain = require("./blockchain");
const PubSub = require("./publishsubscribe");
const default_port = 3000;
let peer_port;
const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

const ROOT_NODE_ADDRESS = `http://localhost:${default_port}`;
setTimeout(() => pubsub.broadcastChain(), 1000);

app.use(bodyParser.json());

app.get("/api/blocks", (req, res) => {
    res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
    const { data } = req.body;

    blockchain.addBlock({ data });
    pubsub.broadcastChain();
    res.redirect("/api/blocks");
});

const synChains = () => {
    request(
        { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
        (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const rootChain = JSON.parse(body);
                blockchain.replaceChain(rootChain);
            }
        }
    );
};

if (process.env.GENERATE_PEER_PORT === "true") {
    peer_port = default_port + Math.ceil(Math.random() * 1000);
}

const port = peer_port || default_port;

app.listen(port, () => {
    console.log(`Running on this port:${port}`);
    synChains();
});
