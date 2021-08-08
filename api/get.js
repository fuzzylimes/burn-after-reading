const Client = require('./lib/client');
const { isValidUuid } = require('./lib/helpers');

/**
 * Checks whether or not a note already exists
 * @param {object} req 
 * @param {object} res 
 * @return 200 if note exists, 404 if not
 */
module.exports = async (req, res) => {
    const { noteId } = req.query;
    if (!noteId || !isValidUuid(noteId)) {
        res.status(400);
        res.send({ Message: "invalid query" });
        return;
    }

    const client = new Client();
    try {
        await checkRecord(client, noteId);
    } catch(err){
        console.error(err);
        res.status(404);
        res.send({ Message: "Note not found" });
        return;
    };

    res.send();
}

/**
 * Checks whether or not a note exists for a given ID
 * @param {object} client mongoDB connection object
 * @param {string} noteId note to be checked
 * @return {boolean} whether note exists
 */
async function checkRecord(client, noteId) {
    try {
        await client.connect();
        const database = client.db(process.env.MONGO_DB);
        const collection = database.collection('notes');
        const query = { _id: noteId };
        const count = await collection.countDocuments(query);
        if (count !== 1) {
            throw new Error('Not found');
        }
        return;
    } finally {
        await client.close();
    }
}