const express = require('express');
const fetch = require('node-fetch');
const { promisify } = require('util');

// Import the model
const BookmarkModel = require('../../model/bookmark');
const verifyToken = require('../auth/auth');
const client = require('../../database/redis');

const router = express.Router();

// Promisify some methods for redis process
const existsAsync = promisify(client.exists).bind(client);
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

router.get('/', (req, res) => {
    res.status(200).send({
        message: 'Bookmark API is running!'
    });
});

/** *
 * This is a search function
* @route GET /api/bookmark/search
* @param no param
* @type public
* @return send the search result
*/
router.get('/search', async (req, res) => {
    const query = req.query.query;
    try{
        // Check the existence in redis db
        const reply = await existsAsync(query);
        if (reply === 1) { // If exist, return cache data
            console.log(`Query '${query}' exists`);
            const value = await getAsync(query);
            res.status(200).json(JSON.parse(value));
        } else { // If not exist, save in redis and search with googlebook api
            console.log(`Query '${query}' does not exist`);
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
            const data = await response.json();
            await setAsync(query, JSON.stringify(data), 'EX', 1800);
            console.log(`Value '${data}' set for key '${query}'`);
            return res.status(200).json(data);
        }
    } catch(err) {
        // If error is occurred in searching, return error
        console.error('Error in redis', err);
        return res.status(400).send({
            message: 'Error in redis database'
        });
    }
});

/** *
 * This is a bookmark list function
* @route GET /api/bookmark/list
* @param no param
* @type private
* @return send the bookmark list of user
*/
router.get('/list', verifyToken, async (req, res) => {
    const userId = req.user.email;

    try {
        // Find the books which has same user id
        const bookmarks = await BookmarkModel.findAll({ where: {user_id: userId} });
        if(bookmarks) {
            res.json(bookmarks); // send the bookmark list
        }
    } catch (error) {
        // If error is occurred in listing, send error message
        console.log('Error listing Bookmark', error);
        res.status(500).send({
            message: 'Error listing Bookmarks'
        });
    }
});

/** *
 * This is a add function in bookmark
* @route POST /api/bookmark/add
* @param book_id, title, author, link
* @type private
* @return send the adding result
*/
router.post('/add', verifyToken, async (req, res) => {
    const user_id = req.user.email;
    const {book_id, title, author, link} = req.body;

    try {
        // Check the multiple bookmark exist
        const existBookmark = await BookmarkModel.findOne( {where: {id: book_id}} );
        if(existBookmark) {
            return res.status(400).send({
                message: 'Bookmark already exists'
            });
        }

        // If multiple bookmark is not existed, create a bookmark
        await BookmarkModel.create({
            user_id,
            id: book_id,
            title,
            author,
            link
        });

        // If bookmark is added, send the success message
        console.log('Bookmark is added');
        res.status(200).send({
            message: 'Bookmark is added'
        });
    } catch (error) {
        // If error was occurred, send the error message
        console.log('Bookmark adding error', error);
        res.status(500).send({
            message: 'Bookmark adding error'
        });
    }
});

/** *
 * This is a delete function in bookmark
* @route DELETE /api/bookmark/remove/:id
* @param book_id
* @type private
* @return send the delete result of bookmark
*/
router.delete('/remove/:id', verifyToken, async (req, res) => {
    const bookmarkId = req.params.id;
    const userId = req.user.email;

    try {
        // remove the item in bookmark list
        await BookmarkModel.destroy({ where: { id: bookmarkId, user_id: userId } });
        console.log('Bookmark removed');
        res.status(200).send('Bookmark is removed');
    } catch (error) {
        // If error is occurred in removing, send error
        console.error('Bookmark removal failed:', error);
        res.status(400).send('Bookmark removal failed');
    }
});

module.exports = router;
