const Note = require('../models/Note');
const mongoose = require('mongoose');

/**
 * 
 * GET /
 * dashboard 
 * 
 */

exports.dashboard = async(req ,res)=>{

    let perPage =12 ;

    let page = req.query.page || 1;



    const locals = {
        title : "Dashboard",
        description :"Notes app using nodejs and express"
    }


    try {

        const notes = await Note.aggregate([
            {
            $sort : {
                updatedAt : -1 , // From last or newst to the first note
            }
        },
        {
            $match : {
                user : new mongoose.Types.ObjectId(req.user.id) // To get the note for the speciec user
            }
        },
        {
            $project : {
                title : {$substr :['$title' , 0 , 30]  },
                body : {$substr :['$body' , 0 , 100]  },
            }
        }
    ])
    .skip(perPage * page  - perPage) // To skip the number of notes you want
    .limit(perPage)
    .exec();

    const count = await Note.count();


        res.render('dashboard/index' , {
            userName : req.user.firstName,
            locals ,
            notes,
            layout : '../views/layouts/dashboard',
            current : page,
            pages : Math.ceil(count / perPage), 
            profileImage : req.user.profileImage,
        });
    } catch (error) {
        res.status(500).send("Internal server error");
    }

}

/**
 * GET /
 * View one Note
 */

exports.viewNote = async (req , res) => {
    
    try {

        const id = req.params.id; // get the id from the url

        const note = await Note.findById({_id : id}).where({
            user : req.user.id
        }).lean() // to get the notes only for the user who logged in 

        if(note){
            res.render('dashboard/view-note' , {
                noteID : req.params.id,
                note,
                layout : '../views/layouts/dashboard'
            });
        }else {
            res.send('Something went wrong');
        }
        
    } catch (error) {
        return res.status(404).send('Cannot view note')
    }

}

/**
 * PUT /
 * Update one Note
 */

exports.updateNote = async (req , res) => {

    try {
         await Note.findOneAndUpdate({ _id: req.params.id} , {
            title : req.body.title,
            body  : req.body.body,
            updatedAt : Date.now()
        }).where({user : req.user.id});
        

        res.redirect('/dashboard');

    } catch (error) {

        console.log(error)
        
    }


}
/**
 * DELETE /
 * Delete one Note
 */

exports.deleteNote = async (req , res) => {

    try {
       await Note.deleteOne({_id : req.params.id}).where({user : req.user.id});

       res.redirect('/dashboard');


    } catch (error) {

        console.log(error)
        
    }


}
/**
 * GET /
 * Add one Note
 */

exports.viewAddPage = async (req , res) => {
    res.render('dashboard/add-note' , {
        layout : '../views/layouts/dashboard'
    })
}
/**
 * GET /
 * Add one Note
 */

exports.addNote = async (req , res) => {
   try {
    req.body.user = req.user.id;
    await Note.create(req.body); // body is an object like this => {title : 'new title' , body : 'new body'}
    res.redirect('/dashboard');
   } catch (error) {
    console.log(error); 
   }
}
/**
 * GET /
 * search Notes page
 */

exports.search = async (req , res) => {
  try {
    res.render('dashboard/search' , {
        layout : '../views/layouts/dashboard',
        searchResult:"",
      });
  } catch (error) {
    console.log(error);
  }
}
/**
 * POST /
 * search in Notes
 */

exports.searchSubmit = async (req , res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g,"");

    const searchResult = await Note.find({
        $or : [
            {title :{ $regex : new RegExp(searchNoSpecialChar , "i")} },
            { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        ]
    }).where({user : req.user.id});

    res.render('dashboard/search' , {
        searchResult,
        layout : '../views/layouts/dashboard'
    })

  } catch (error) {
    console.log(error);
  }
}