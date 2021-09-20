const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const body = require("body-parser");
const multer = require("multer");
const app = express();
let Port = process.env.PORT || 8000;
const session = require("express-session");
const cokie = require("cookie-parser");
const url = require('url');  
const { Console } = require("console");
app.use(body.urlencoded({ extended: false }));
// ================================================================midel ware for folder==============
let pathh = path.join(__dirname, "../template", "views");
const static_path = path.join(__dirname, "../template/picandcss");
app.use(express.static(static_path));
app.set("view engine", "ejs");
app.set("views", pathh);
// ===========================================================================================

// ============================================================midelware for multer========================
// mulert function k kesy jai ga aur destiation chk kry ga 
const Storage = multer.diskStorage({
    destination: "../template/picandcss/upload",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

// ab middle ware 
const uploadss = multer({
    storage: Storage
}).single('file');

const mupload = multer({ storage: Storage });
const multiupload = mupload.fields([{ name: 'file1' }, { name: 'file2' }, { name: 'file3' }])


// ============================================================================================
app.use(cokie());
app.use(session({
    secret: "do something",
    key: "user_id",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))


// =======================================================================================
const DB='mongodb+srv://usama:usama@cluster0.kvona.mongodb.net/samiportfolio?retryWrites=true&w=majority';
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("connnection done");
    })
    .catch((err) => {
        console.log(err);
    })
const userschema = new mongoose.Schema({
    views:{
        type: String,
        unique: false
    },
    username: {
        type: String,
        unique: false
    },
    password: {
        type: String,
        unique: false
    },
    adminname: {
        type: String,
        unique: false
    },
    facebook: {
        type: String,
        unique: false
    },
    whatsapp: {
        type: String,
        unique: false
    },
    instgram: {
        type: String,
        unique: false
    },
    github: {
        type: String,
        unique: false
    },
    adminimage: {
        type: String,
        unique: false
    },
    project: {
        type: Array,
        properties: {
            items: {
                projectname: {
                    type: String,
                    unique: false
                },
                desc: {
                    type: String,
                    unique: false
                },
                link: {
                    type: String,
                    unique: false
                },
                plang: {
                    type: String,
                    unique: false
                },
                pimage: {
                    type: String,
                    unique: false
                }
            }
        }
    },
    topproject: {
        type: Array,
        properties: {
            items: {
                topprojectname: {
                    type: String,
                    unique: false
                },
                topprojectdesc: {
                    type: String,
                    unique: false
                },
                language: {
                    type: String,
                    unique: false
                },
                tlink: {
                    type: String,
                    unique: false
                },
                timage: {
                    type: String,
                    unique: false
                }

            }
        }
    },
    blogpost: {
        type: Array,
        properties: {
            items: {
                blogdate:{
                    type:String,
                    unique:false
                },
                blogname: {
                    type: String,
                    unique: false
                },
                blogdesc: {
                    type: String,
                    unique: false
                },
                blogimage: {
                    type: String,
                    unique: false
                },
                blogdesc1: {
                    type: String,
                    unique: false
                },
                blogimage1: {
                    type: String,
                    unique: false
                },
                blogdesc2: {
                    type: String,
                    unique: false
                },
                blogimage2: {
                    type: String,
                    unique: false
                }

            }
        }
    },
    contact: {
        type: Array,
        properties: {
            items: {
                cname: {
                    type: String,
                    unique: false
                },
                cemail: {
                    type: String,
                    unique: false
                },
                csubject: {
                    type: String,
                    unique: false
                },
                cmsg: {
                    type: String,
                    unique: false
                }
            }
        }
    }

})

const user_colection = new mongoose.model("portfolio", userschema);
// const data_collection=new mongoose.model("datacolection",dataschema);
// 
app.get("/home",async(req,res)=>{
    
    user_colection.find(function (err, projectdata) {
        const count_views=projectdata[0].views;
        let a = count_views;
console.log(++a);    
console.log(a);
const vupdate = async () => {
    try {
        const au = await user_colection.updateOne({ username: projectdata[0].username }, {
            $set: {
                views:a
            }
        })
    }

    catch (err) {
        console.log(err);
    }
}
vupdate ();
        if (err) {
            console.log(err);
        }
        else {
            res.render("home", {
                projectdata: projectdata
            });
        }
    })
})
app.get("/",async(req,res)=>{
    
    user_colection.find(function (err, projectdata) {
        console.log(projectdata[0].views);
        const count_views=projectdata[0].views;
        let a = count_views;
console.log(++a);    
console.log(a);
const vupdate = async () => {
    try {
        const au = await user_colection.updateOne({ username: projectdata[0].username }, {
            $set: {
                views:a
            }
        })
    }

    catch (err) {
        console.log(err);
    }
}
vupdate ();
        if (err) {
            console.log(err);
        }
        else {
            res.render("home", {
                projectdata: projectdata
            });
        }
    })
})

app.get("/login", (req, res) => {
    res.render("login",{
        usernotfound:req.query.a
    });
})

app.post("/login", async (req, res) => {
    let findadmin = await user_colection.findOne({ username: req.body.user, password: req.body.password });
    if (findadmin) {
        req.session.user = 1;
        req.session.user_colection = findadmin;
        user_colection.find({ username: req.session.user_colection.username }, function (err, projectdata) {
            if (err) {
                console.log(err);
            }
            else {
               
                res.redirect('/admin');

            }
        })
    }
    else {

        req.session.user = 0;
        res.redirect(url.format({
            pathname:"/login",
            query: {
               "a": 1
             }
          }));
      
    }
})

app.get("/setuserdata", (req, res) => {
    const sign = async () => {
        try {
            const signup = new user_colection({

                username: "sami",
                password: "1234",
                adminname: "Usama Abubakar",
                adminimage: "admin.png",
                views:0
            })
            const result = await signup.save();

        }
        catch (err) {
            console.log(err);
            res.send("by by 404 page");
        }
    }
    sign();

})
app.post("/setuserdata", uploadss, (req, res) => {

    if (req.session.user == 1) {
        if (req.file) {
            const adminupdate = async () => {
                try {
                    const au = await user_colection.updateOne({ username: req.session.user_colection.username }, {
                        $set: {
                            username: req.body.aname,
                            password: req.body.apassword,
                            adminname: req.body.admin,
                            adminimage: req.file.filename,
                            facebook:req.body.facebook,
                            instgram:req.body.instgram,
                            whatsapp:req.body.whatsapp,
                            github:req.body.github,
                        }
                    })
                }

                catch (err) {
                    console.log(err);
                }
            }
            adminupdate();
            user_colection.find({ username: 'sami' }, function (err, projectdata) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.redirect(url.format({
                        pathname:"/admin",
                        query: {
                           "datasuccess": 10
                         }
                      }));  
                  
                }
            })
        }
        else {

            const adminupdate = async () => {
                try {
                    const au = await user_colection.updateOne({ username: 'sami' }, {
                        $set: {
                            username: req.body.aname,
                            password: req.body.apassword,
                            adminname: req.body.admin,
                            facebook:req.body.facebook,
                            instgram:req.body.instgram,
                            whatsapp:req.body.whatsapp,
                            github:req.body.github,
                        }
                    })
                }

                catch (err) {
                    console.log(err);
                }
            }
            adminupdate();
            user_colection.find({ username: req.session.user_colection.username }, function (err, projectdata) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.redirect(url.format({
                        pathname:"/admin",
                        query: {
                           "datasuccess": 10
                         }
                      }));  
                  
                }
            })
        }
    }
    else {
        res.redirect("/login")
    }
})

app.get("/admin", (req, res) => {
    if (req.session.user == 1) {
        user_colection.find({ username: req.session.user_colection.username }, function (err, projectdata) {
            if (err) {
                console.log(err);
            }
            else {
                res.render("admin", {
                    projectdata: projectdata,
                   projectinsert:req.query.p,
                   topprojectinsert:req.query.tp,
                   bloginsert:req.query.binsert,
                   datasuccess:req.query.datasuccess
                });
            }
        })
    }
    else {
        res.redirect('/login')
    }

})

app.get("/project", (req, res) => {
 
  if(req.session.user==1){
    user_colection.find({ username: req.session.user_colection.username }, function (err, projectdata) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("project", {
                projectdata: projectdata,
                editproject:req.query.ep,
                delproject:req.query.dp
            });
        }
    })
  }
  else{
      res.redirect('/login')
  }

})
app.post("/insertproject", uploadss, async (req, res) => {

  if(req.session.user==1){
    const inserdata = async () => {
        try {
            const data = await user_colection.updateOne({username:req.session.user_colection.username }, {
                $push: {
                    project: {
                        projectname: req.body.name,
                        desc: req.body.desc,
                        link: req.body.link,
                        plang:req.body.plang
                    }
                }
            })
        }
        catch (err) {
            console.log(err);
        }
    }
    inserdata();
    user_colection.find({ username: req.session.user_colection.username }, function (err, projectdata) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect(url.format({
                pathname:"/admin",
                query: {
                   "p": 1
                 }
              }));      
        }
    })
  }
  else{
    res.redirect("/login")
  }

})
app.post("/projectedit", (req, res) => {
    if(req.session.user==1){
        const projectedt = async () => {
            try {
                let updat = await user_colection.updateOne({ username: req.session.user_colection.username ,  "project.projectname": req.session.user_colection.project[req.body.pid].projectname, "project.desc": req.session.user_colection.project[req.body.pid].desc ,"project.link": req.session.user_colection.project[req.body.pid].link,"project.plang": req.session.user_colection.project[req.body.pid].plang},{
                    $set: {
                        "project.$.projectname": req.body.pname,
                        "project.$.desc": req.body.pdesc,
                        "project.$.link": req.body.plink,
                        "project.$.plang": req.body.plang
                    }
                })
            }
            catch (err) {
                console.log(err)
            }
        }
        projectedt();
        res.redirect(url.format({
            pathname:"/project",
            query: {
               "ep": 1
             }
          })); 
    
    }
    else{
        res.redirect('/login')
      
    }
    

})

app.get("/projectdelete/:id", async (req, res) => {
    if(req.session.user==1){
    const projectdel = async () => {
        try {
            const pd = await user_colection.updateOne({ username: req.session.user_colection.username }, {
                $pull: {
                    project: {
                        projectname: req.session.user_colection.project[req.params.id].projectname,
                        desc:req.session.user_colection.project[req.params.id].desc,
                        link: req.session.user_colection.project[req.params.id].link,
                        plang: req.session.user_colection.project[req.params.id].plang
                    }
                }
            })
        }
        catch (err) {
            console.log(err)
        }
    }
    projectdel();
    res.redirect(url.format({
        pathname:"/project",
        query: {
           "dp": 2
         }
      })); 
    }
    else{
        res.redirect('/login')
    }
})
app.get("/topproject", (req, res) => {
   
    if(req.session.user==1){
        user_colection.find({username:req.session.user_colection.username},function (err, projectdata) {
            
                res.render("topproject", {
                    projectdata: projectdata,
                    edittopproject: req.query.edittp,
                    deletetopproject: req.query.deltp
                });
        })
    }
    else{
        res.redirect('/login')
    }
})
app.post("/topproject", uploadss, async (req, res) => {
    if(req.session.user==1){
        console.log(req.file.filename);
    console.log(req.body.desc1);
    const insertopdata = async () => {
        try {
            const data = await user_colection.updateOne({ username: req.session.user_colection.username }, {
                $push: {
                    topproject: {
                        topprojectname: req.body.name1,
                        topprojectdesc: req.body.desc1,
                        language: req.body.lang,
                        tlink:req.body.link1,
                        timage: req.file.filename
                    }
                }
            })
        }
        catch (err) {
            console.log(err);
        }
    }
    insertopdata();
    res.redirect(url.format({
        pathname:"/admin",
        query: {
           "tp": 3
         }
      })); 

    }
    else{
        res.redirect('/login');
    }
})

app.post("/topprojectedit",uploadss, (req, res) => {
    console.log(req.body.tpname);
    if(req.session.user==1){
        if(req.file){
            const topprjectedt = async () => {
                try {
                    let topupdat = await user_colection.updateOne({ username: req.session.user_colection.username ,  "topproject.topprojectname": req.session.user_colection.topproject[req.body.tpid].topprojectname, "topproject.topprojectdesc": req.session.user_colection.topproject[req.body.tpid].topprojectdesc ,"topproject.language": req.session.user_colection.topproject[req.body.tpid].language , "topproject.tlink": req.session.user_colection.topproject[req.body.tpid].tlink, "topproject.timage": req.session.user_colection.topproject[req.body.tpid].timage}, {
                        $set: {
                            "topproject.$.topprojectname": req.body.tpname,
                            "topproject.$.topprojectdesc": req.body.tpdesc,
                            "topproject.$.language": req.body.tplang,
                            "topproject.$.tlink": req.body.tplink,
                            "topproject.$.timage": req.file.filename
                        }
                    })
                }
                catch (err) {
                    console.log(err)
                }
            }
            topprjectedt();
            res.redirect(url.format({
                pathname:"/topproject",
                query: {
                   "edittp": 4
                 }
              }));  
        
        }
        else{
            const topprjectedt = async () => {
                try {
                    let topupdat = await user_colection.updateOne({ username: req.session.user_colection.username ,  "topproject.topprojectname": req.session.user_colection.topproject[req.body.tpid].topprojectname, "topproject.topprojectdesc": req.session.user_colection.topproject[req.body.tpid].topprojectdesc ,"topproject.language": req.session.user_colection.topproject[req.body.tpid].language , "topproject.tlink": req.session.user_colection.topproject[req.body.tpid].tlink}, {
                        $set: {
                            "topproject.$.topprojectname": req.body.tpname,
                            "topproject.$.topprojectdesc": req.body.tpdesc,
                            "topproject.$.language": req.body.tplang,
                            "topproject.$.tlink": req.body.tplink,
                        }
                    })
                }
                catch (err) {
                    console.log(err)
                }
            }
            topprjectedt();
            res.redirect(url.format({
                pathname:"/topproject",
                query: {
                   "edittp": 4
                 }
              })); 
        
        }
    }
    else{
        res.redirect('/login')
      
    }
    

})


app.get("/topprojectdelete/:id", async (req, res) => {
    if(req.session.user==1){
        console.log(req.session.user_colection.username);
        console.log(req.params.id);
    const topprojectdel = async () => {
        try {
            const pd = await user_colection.updateOne({ username: req.session.user_colection.username }, {
                $pull: {
                    topproject: {
                        topprojectname: req.session.user_colection.topproject[req.params.id].topprojectname,
                        topprojectdesc: req.session.user_colection.topproject[req.params.id].topprojectdesc,
                        language: req.session.user_colection.topproject[req.params.id].language,
                        tlink: req.session.user_colection.topproject[req.params.id].tlink,
                        timage: req.session.user_colection.topproject[req.params.id].timage,

                    }
                }
            })
        }
        catch (err) {
            console.log(err)
        }
    }
    topprojectdel();
    res.redirect(url.format({
        pathname:"/topproject",
        query: {
           "deltp": 5
         }
      })); 
    }
    else{
        res.redirect('/login')
    }
})


app.get("/blogg",(req,res)=>{
    let today = new Date().toLocaleDateString();
    user_colection.find(function (err, projectdata){
        const admnname=projectdata[0].username;
    user_colection.find({usernmae:admnname},function(err,projectdata){
        if(err){
            console.log(err);
        }
        else{
            res.render("blog",{
                projectdata:projectdata,
                id:req.session.id1
            })
        }
    })
})
})
app.get("/blogbox/:id",(req,res)=>{
    const idd=req.params.id
    user_colection.find(function (err, projectdata){
        const admnname=projectdata[0].username;
    user_colection.find({username:admnname},function(err,projectdata){
        console.log(projectdata[0].blogpost[req.params.id].blogname);
       if(err){
           console.log(err)
       }
       else{
           req.session.id1=idd;
        res.redirect('/blogg');
       }
    })
  
})
})
app.get("/blogpost", (req, res) => {
    if(req.session.user==1){
        user_colection.find({username:req.session.user_colection.username},function (err, projectdata) {
            if (err) {
                console.log(err);
            }
            else {
                res.render("blogpost", {
                    projectdata: projectdata,
                    editblog:req.query.bedit,
                    delblog:req.query.bdel
                });
    
            }
        })
    }
    else{
        res.redirect('/login');
    }
})
app.post("/blogpost", multiupload, async (req, res) => {
   if(req.session.user==1){
        if(req.files){
            const inserblogdata = async () => {
                try {
                    const blogdata = await user_colection.updateOne({ username: req.session.user_colection.username }, {
                        $push: {
                            blogpost: {
                                blogdate: new Date().toLocaleDateString(),
                                blogname: req.body.bbname1,
                                blogdesc: req.body.bbdesc1,
                                blogimage: `upload/${req.files.file1[0].filename}`,
                                blogdesc1: req.body.bbdesc2,
                                blogimage1:`upload/${req.files.file2[0].filename}`,
                                blogdesc2: req.body.bbdesc3,
                                blogimage2: `upload/${req.files.file3[0].filename}`
                            }
                        }
                    })
                }
                catch (err) {
                    console.log(err);
                }
            }
            inserblogdata();
            res.redirect(url.format({
                pathname:"/admin",
                query: {
                   "binsert": 6
                 }
              })); 
        }
        else{
            const inserblogdata = async () => {
                try {
                    const blogdata = await user_colection.updateOne({ username: req.session.user_colection.username }, {
                        $push: {
                            blogpost: {
                                blogdate: new Date().toLocaleDateString(),
                                blogname: req.body.bbname1,
                                blogdesc: req.body.bbdesc1,
                                blogdesc1: req.body.bbdesc2,
                                blogdesc2: req.body.bbdesc3,
                            }
                        }
                    })
                    
                }

                catch (err) {
                    console.log(err);
                }
            }
            inserblogdata();
            res.redirect(url.format({
                pathname:"/admin",
                query: {
                   "binsert": 6
                 }
              })); 
        }
        
    
   }
   else{
    res.redirect('/login')
   }
})

app.post("/blogedit",multiupload, (req, res) => {
    if(req.session.user==1){
        if(req.files){
            const blogedit = async () => {
                try {
                    let blogupdate1 = await user_colection.updateOne({ username: req.session.user_colection.username ,  "blogpost.blogname": req.session.user_colection.blogpost[req.body.bid].blogname, "blogpost.blogimage": req.session.user_colection.blogpost[req.body.bid].blogimage, "blogpost.blogdesc": req.session.user_colection.blogpost[req.body.bid].blogdesc, "blogpost.blogimage1": req.session.user_colection.blogpost[req.body.bid].blogimage1, "blogpost.blogdesc1": req.session.user_colection.blogpost[req.body.bid].blogdesc1,"blogpost.blogimage2": req.session.user_colection.blogpost[req.body.bid].blogimage2, "blogpost.blogdesc2": req.session.user_colection.blogpost[req.body.bid].blogdesc2 }, {
                        $set: {
                            "blogpost.$.blogname": req.body.bbname,
                            "blogpost.$.blogdesc": req.body.bdesc,
                            "blogpost.$.blogimage":  `upload/${req.files.file1[0].filename}`,
                            "blogpost.$.blogdesc1": req.body.bdesc1,
                            "blogpost.$.blogimage1": `upload/${req.files.file2[0].filename}`,
                            "blogpost.$.blogdesc2": req.body.bdesc2,
                            "blogpost.$.blogimage2":  `upload/${req.files.file3[0].filename}`,
                            
                        }
                    })
                }
                catch (err) {
                    console.log(err)
                }
            }
            blogedit();
            res.redirect(url.format({
                pathname:"/blogpost",
                query: {
                   "bedit": 7
                 }
              })); 
        
        }
        else{
            const blogedit1 = async () => {
                try {
                    let blogupdate = await user_colection.updateOne({ username: req.session.user_colection.username ,  "blogpost.blogname": req.session.user_colection.blogpost[req.body.bid].blogname, "blogpost.blogdesc": req.session.user_colection.blogpost[req.body.bid].blogdesc, "blogpost.blogdesc1": req.session.user_colection.blogpost[req.body.bid].blogdesc1, "blogpost.blogdesc2": req.session.user_colection.blogpost[req.body.bid].blogdesc2 }, {
                        $set: {
                            "blogpost.$.blogname": req.body.bname,
                            "blogpost.$.blogdesc": req.body.bdesc,
                            "blogpost.$.blogdesc1": req.body.bdesc1,
                            "blogpost.$.blogdesc2": req.body.bdesc2
                        }
                    })
                }
                catch (err) {
                    console.log(err)
                }
            }
            blogedit1();
            res.redirect(url.format({
                pathname:"/blogpost",
                query: {
                   "bedit": 7
                 }
              })); 
        
        }
    }
    else{
        res.redirect("login")
      
    }
    

})
app.get("/blogdelete/:id", async (req, res) => {
    if(req.session.user==1){
        console.log(req.params.id);
    const blogdel = async () => {
        try {
            const pd = await user_colection.updateOne({ username: req.session.user_colection.username }, {
                $pull: {
                    blogpost: {
                        blogname: req.session.user_colection.blogpost[req.params.id].blogname,
                        blogdesc: req.session.user_colection.blogpost[req.params.id].blogdesc,
                        blogimage: req.session.user_colection.blogpost[req.params.id].blogimage,
                        blogdesc1: req.session.user_colection.blogpost[req.params.id].blogdesc1,
                        blogimage1: req.session.user_colection.blogpost[req.params.id].blogimage1,
                        blogdesc2: req.session.user_colection.blogpost[req.params.id].blogdesc2,
                        blogimage2: req.session.user_colection.blogpost[req.params.id].blogiamge2,

                    }
                }
            })
        }
        catch (err) {
            console.log(err)
        }
    }
    blogdel();
    res.redirect(url.format({
        pathname:"/blogpost",
        query: {
           "bdel": 8
         }
      })); 
    }
    else{
        res.redirect('/login')
    }
})

app.get("/contactwithadminformm",(req,res)=>{
   if(req.session.user){
    user_colection.find(function (err, projectdata){
    res.render("contactpage",{
        projectdata:projectdata
    })
    })
   }
   else{
    res.redirect('/login');
   }
})
app.get("/contactwithadminformmdelete/:id", async (req, res) => {
    console.log(req.params.id);
    if(req.session.user==1){
    const contactdel = async () => {
        try {
            const cd= await user_colection.updateOne({ username: req.session.user_colection.username }, {
                $pull: {
                    contact: {
                        cname: req.session.user_colection.contact[req.params.id].cname,
                        cemail:req.session.user_colection.contact[req.params.id].cemail,
                        csubject: req.session.user_colection.contact[req.params.id].csubject,
                        cmsg: req.session.user_colection.contact[req.params.id].cmsg
                    }
                }
            })
        }
        catch (err) {
            console.log(err)
        }
    }
    contactdel();
        res.redirect('/contactwithadminformm')
    }
    else{
        res.redirect('/login')
    }
})
app.get("/contact",(req,res)=>{
    res.render("home")
})
app.post("/contact",(req,res)=>{
    user_colection.find(function (err, projectdata){
    const admnname=projectdata[0].username;
        const inserdata = async () => {
            try {
                const data = await user_colection.updateOne({admnname}, {
                    $push: {
                        contact: {
                            cname: req.body.cname,
                            cemail: req.body.cemail,
                            csubject: req.body.csubject,
                            cmsg:req.body.cmsg
                        }
                    }
                })
            }
            catch (err) {
                console.log(err);
            }
        }
        inserdata();
       res.redirect("/home");
    }) 
})


app.get("/logout", (req, res) => {
    if (req.session.user == 1) {
        req.session.user = 0;
        res.redirect('/login')
    }
    else {
       res.redirect('/login');
    }
})

app.listen(Port, () => {
    console.log(`Listing on Port ${Port}`);
})