//Importing 
import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import dataSchema from "./dataSchema.js"
import useragent from "useragent"


// User's info
const usercountry = "India";
let useros = "Other"
let userbrowser = "Other"


//App Config
const app = express();
const port = process.env.PORT || 9000;


//Middlewares
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


//Database Config
const connectionurl = "mongodb+srv://Arpit:F3j4oG9LfmHJ4Bqm@cluster0.kd2rp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(connectionurl);
const db = mongoose.connection;
db.once("open", () => { console.log("DB is Connected Successfully !!") });

//Routes

//Home
app.get("/", (req, res) => {
    res.render("login", { shorturl: "", accessdata: "" });
    var agent = useragent.parse(req.headers['user-agent']);
       
    
        console.log(agent.toJSON());
        


});



// Accessing Shorten URL
app.get("/myapp/:id", (req, res) => {
    dataSchema.findOne({ shortenurl: "https://myurl-shortener-app.herokuapp.com/myapp/" + req.params.id }, async (err, data) => {

        var agent = useragent.parse(req.headers['user-agent']);
       
    
        userbrowser = agent.toJSON().family;
        useros = agent.toJSON().os.family;


        await dataSchema.updateOne({ shortenurl: "https://myurl-shortener-app.herokuapp.com/myapp/" + req.params.id },
            {
                visits: data.visits + 1,
                countries: { ...data.countries, [usercountry]: (data.countries[usercountry] === undefined ? 0 : data.countries[usercountry]) + 1 },
                browsers: { ...data.browsers, [userbrowser]: (data.browsers[userbrowser] === undefined ? 0 : data.browsers[userbrowser]) + 1 },
                os: { ...data.os, [useros]: (data.os[useros] === undefined ? 0 : data.os[useros]) + 1 },

            }
        );
        res.redirect(data.actualurl);
    })

})



//  Details - Shorten URL
app.get("/data/:id", (req, res) => {
    dataSchema.findOne({ shortenurl: "https://myurl-shortener-app.herokuapp.com/myapp/" + req.params.id }, (err, data) => {


        res.render("mychart", { datacoming: data });

    })

});



// User requesting To get Short URL
app.post("/", (req, res) => {

    const longurl = req.body.longurl;

    var agent = useragent.parse(req.headers['user-agent']);
    agent.toJSON()

    userbrowser = agent.toJSON().family;
    useros = agent.toJSON().os.family;

    //Generating 5 chr. String
    var result = (Math.random() + 1).toString(36).substring(7);


    var newData = new dataSchema(
        {
            shortenurl: "https://myurl-shortener-app.herokuapp.com/myapp/" + result,
            actualurl: longurl,
            visits: 1,
            countries: { [usercountry]: 1 },
            browsers: { [userbrowser]: 1 },
            os: { [useros]: 1 }
        }

    );


    newData.save(function (err, data) {
        if (err)
            console.log(error);


    });
    res.render("login", { shorturl: "https://myurl-shortener-app.herokuapp.com/myapp/" + result, accessdata: "https://myurl-shortener-app.herokuapp.com/data/" + result });
})



//Listeners
app.listen(port, () => { console.log("Server Started on port 9000") });
