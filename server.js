/******************************************************************************** 
*  WEB322 – Assignment 03 
*  
*  I declare that this assignment is my own work in accordance with Seneca's 
*  Academic Integrity Policy: 
*  
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html 
*  
*  Name: Kalash Munjal Student ID: 174199216 Date: 2023-03-22
* 
*  Published URL: 
* 
********************************************************************************/ 

const legoData = require("./public/js/legoSets");
const express = require('express'); 
const path = require('path');
const app = express(); 
const HTTP_PORT = process.env.PORT || 8080; 

legoData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
    })
    .catch(err => {
        console.log(err.message);
    });

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get(['/', '/home', '/home.html'], (req, res) => {
    try {
        res.render("home");
    } catch (err) {
        res.status(404).send(err);
    }
    
});
app.get(['/about', '/about.html'], (req, res) => {
    try {
        res.render("about");
    } catch (err) {
        res.status(404).send(err);
    }
    
});
app.get('/lego/sets/', (req, res) => {

    const theme = req.query.theme;

    if(theme)
    {
        legoData.getSetsByTheme(theme)
            .then(data => {
                res.render("sets", {sets: data})
            })
            .catch((err) => {
                res.status(404).render("404", {message: "Unable to find requested sets."});
            })
    } else {
        legoData.getAllSets()
        .then(data => {
            res.render("sets", {sets: data});
        })
        .catch((err) => {
            res.status(404).send(err.message);
        });
    }
});
app.get('/lego/sets/:num?', (req, res) => {
    const num = req.params.num
    legoData.getSetByNum(num)
        .then(data => {
            res.render("set", {set: data});
        })
        .catch((err) => {
            res.status(404).render("404", {message: "Unable to find requested set."});
        });
});
app.get('*', (req,res) => {
    try {
        res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
    } catch (err) {
        res.status(404).send(err.message);
    }
})
