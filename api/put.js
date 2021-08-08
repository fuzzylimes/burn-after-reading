const { v4:uuidv4 } = require('uuid');
const Client = require('./lib/client');
const crypt = require('./lib/crypt');
const secret = process.env.CRYPT || '';

const maxNotes = 20;

/**
 * Saves a new note into the database
 * @param {object} req 
 * @param {object} res 
 * @return id of saved note
 */
module.exports = async (req, res) => {
    // check if secret is set
    if (secret === '') {
        console.error("Missing required env variables...");
        process.exit(1);
    }
    // Check for body
    const { body } = req;
    if (!body) {
        res.status(400);
        res.send({Message: 'Invalid body'});
        return;
    }
    if (!body.message) {
        res.status(400);
        res.send({ Message: 'Invalid body' });
        return;
    }
    const client = new Client();

    // Get senders ip
    const ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.socket.remoteAddress;
    
    // Check that they can create another note
    const next = await canCreate(client, ip);
    if (!next) {
        await client.close()
        res.status(418);
        res.send();
        return;
    }

    // build message body
    const key = crypt.getFromB64(secret);
    const encode = crypt.encrypt(body.message, key);
    const id = uuidv4();
    const payload = {
        _id: id,
        ip,
        message: encode.toString('base64'),
        createdAt: new Date()
    }

    // Add the note to DB
    try {
        await addNote(client, payload);    
    } catch (err) {
        console.error(err);
        res.status(500);
        res.send({ Message: 'Something went wrong'});
        return;
    }

    res.send({id});
}

/**
 * Check to see whether or not a user can create another note in db, based on ip
 * @param {object} client mongoDB client object
 * @param {string} ip user IP address
 * @return {boolean} whether user can create another note
 */
async function canCreate(client, ip) {
    try {
        await client.connect();
        const database = client.db(process.env.MONGO_DB);
        const collection = database.collection('notes');
        const query = { ip: ip };
        const count = await collection.countDocuments(query);
        if (count >= maxNotes) {
            return false;
        }
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

/**
 * Add new note to database
 * @param {object} client mongoDB client object
 * @param {object} note payload object
 */
async function addNote(client, note) {
    try {
        await client.connect();
        const database = client.db(process.env.MONGO_DB);
        const collection = database.collection('notes');
        await collection.insertOne(note);
    } finally {
        await client.close();
    }
}