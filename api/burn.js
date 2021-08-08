const Client = require('./lib/client');
const crypt = require('./lib/crypt');
const { isValidUuid } = require('./lib/helpers');
const secret = process.env.CRYPT || '';

/**
 * Retrieves a stored message and deletes it from the database
 * @param {object} req 
 * @param {object} res 
 * @return {object} stored message
 */
module.exports = async (req, res) => {
    // check if secret is set
    if (secret === '') {
        console.error("Missing required env variables...");
        process.exit(1);
    }

    // handle query parameters
    const { noteId } = req.query;
    if (!noteId || !isValidUuid(noteId)) {
        res.status(400);
        res.send({ Message: "invalid query" });
        return;
    }

    const client = new Client();
    let data;
    try {
        data = await getData(client, noteId);
    } catch(err) {
        console.error(err);
        res.status(500);
        res.send({ Message: "Error retrieving note"});
        return;
    };
    
    // decode data.Message
    const key = crypt.getFromB64(secret);
    const decrypted = crypt.decrypt(crypt.getFromB64(data.message), key);

    res.send({ data: decrypted.toString() });
}

/**
 * Collects and burns a note from the DB
 * @param {object} client mongoDB connection object
 * @param {string} noteId note to be collected
 * @return {object} mongoDB data object
 */
async function getData(client, noteId) {
    try {
        await client.connect();
        const database = client.db(process.env.MONGO_DB);
        const collection = database.collection('notes');
        const query = { _id: noteId };
        const note = await collection.findOne(query);
        if (!note) {
            throw new Error('Couldn\'t find record');
        }
        const result = await collection.deleteOne(query);
        if (result.deletedCount !== 1) {
            throw new Error('Could not delete record');
        }
        return note;
    } finally {
        await client.close();
    }
}