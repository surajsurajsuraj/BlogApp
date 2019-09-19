var express= require("express"),
mongoose = require("mongoose"),
methodOverride=require("method-override"),
expressSanitizer=require("express-sanitizer"),
bodyParser=require("body-parser"),
app=express();
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
	
mongoose.connect("mongodb://127.0.0.1/restful_blog_app",{useNewUrlParser: true});
	// .then(() => { // if all is ok we will be here
	// return server.start();
	// })
	// .catch(err => { // we will not be here...
	// console.error('App starting error:', err.stack);
	// process.exit(1);
	// });
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
	title:String,
	image: String,
	body: String,
	created:{type: Date, default: Date.now	}
});

var Blog=mongoose.model("Blog", blogSchema);

app.get("/",function(req,res){
	res.redirect("/blogs");
});
//INDEX ROUTE
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("ERROR");
		}
		else{
			res.render("index",{blogs:blogs});
		}
	})
})
//NEW ROUTE
app.get("/blogs/new",function(req,res){
	res.render("new");
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
	//create blog
console.log(req.body);	req.body.blog.body=req.sanitize(req.body.blog.body);
	console.log(req.body);	
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("new");
		}else{
			res.redirect("/blogs");
		}
	});
});
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog: foundBlog});
		}
	});
		
});
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit",{blog:foundBlog});
		}
	})
});
app.put("/blogs/:id",function(req,res){
	Blog.findOneAndUpdate(req.params.id,req.body.blog,function(err,UpdatedBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	})
});
app.listen(3000,function(){
	console.log("server started");
});