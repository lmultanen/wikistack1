const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack'
    ,{logging: false}
);

const Page = db.define('page', {
    title: {type: Sequelize.STRING, allowNull: false},
    slug: {type: Sequelize.STRING, allowNull: false},
    content: {type: Sequelize.TEXT, allowNull: false},
    status: {type: Sequelize.ENUM('open', 'closed')}}
    , 
    {
        hooks: {
            beforeValidate: (page, options) => {
                let newTitle = page.title;
                page.slug = newTitle.replace(/\s+/g,'_').replace(/\W/g, '');
                // page.slug = 'helloworld';
            }
        }
})

// Page.addHook('beforeValidate', (page,options) => {
//     page.slug = 'test';
// })

const User = db.define('user', {
    name: {type: Sequelize.STRING, allowNull: false, unique: true},
    email: {type: Sequelize.STRING, allowNull: false, unique: true,
        validate: {isEmail: true}}
})

Page.belongsTo(User, { as: 'author' })


module.exports = {
  db, Page, User
};