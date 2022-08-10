const router = require('express').Router();
const layout = require('../views/layout');
const { addPage, wikiPage, main } = require('../views')
const { Page, User } = require("../models")

router.get('/', async (req,res,next) => {
    try {
        let pages = await Page.findAll();
        res.send(main(pages));
    } catch (error) {
        next(error);
    }
})

router.post('/', async (req,res,next) => {
    let title = req.body.title;
    let content = req.body['page-content'];
    // console.log("logging req.body", req.body)
    try {
        const [user, created] = await User.findOrCreate({
            where: {
                name: req.body.author,
                email: req.body.email
            }
        });
        const page = await Page.create( {
            title: title,
            content: content
        });
        let slug = page.slug;
        await page.setAuthor(user);
        res.redirect(`/wiki/${slug}`)
    } catch (error) {
        next(error);
    }
})

router.get('/add', (req,res,next)=> {
    try {
        res.send(addPage())
    } catch (error) {
        next(error)
    }
})

router.get('/:slug', async (req,res,next) => {
    try {
        const page = await Page.findOne({
            where: {
                slug: req.params.slug
            }
        });
        let authorName = await page.getAuthor();
        res.send(wikiPage(page, authorName));
    } catch (error) {next(error)}
})

module.exports = router;