exports.homepage = async(req , res)=>{

        const locals = {
            title : "Home page",
            description :"Notes app using nodejs and express"
        }
    
        res.render('index' , {
            locals ,
            layout : '../views/layouts/front-page'
        });
    
}


exports.aboutpage = async(req , res)=>{

        const locals = {
            title : "About page",
            description :"Notes app using nodejs and express"
        }
    
        res.render('about' , {locals});
    
}