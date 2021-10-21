require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require("mongoose")
const Document = require("./models/Document");

app.set('view engine','ejs');

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res) =>{
  const code = `Welcome to WasteBin!

Use the commands in the top right corner
to create a new file to share with others.`

	res.render('code-display',{
		code,
		language:'plaintext'
	})
})



app.get('/new',(req,res) =>{
	res.render('new-file')
})


app.post('/save', async(req,res) =>{
	const {value} = req.body;
	try {
		const doc = await Document.create({value});
		res.redirect(`/${doc.id}`)
	} catch(e) {
		res.render('new-file',{value})
	}
})


app.get('/:id', async(req,res) =>{
	const {id} = req.params;
	try{
		const doc = await Document.findById(id);
		res.render('code-display',{code:doc.value,id:id})
	}catch(e){
		res.redirect('/');
	}
})

app.get('/:id/duplicate',async(req,res) =>{
	const {id} = req.params;
	try{
		const doc = await Document.findById(id);
		res.render('new-file',{value:doc.value})
	}catch(e){
		res.redirect(`/${id}`);
	}	
})


mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}).then(()=>{
	console.log('connected to mongodb')
}).catch(err=>{
	console.log(err)
})


app.listen(3000);