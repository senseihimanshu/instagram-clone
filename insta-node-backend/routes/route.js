const controller=require('../controllers');
module.exports=(app) => {
   
       
         app.post("/login",controller.loginSignup.checkUserAuthentication);
         app.post("/signup",controller.loginSignup.createUser);
         app.get("/user",controller.user.show);
         app.put("/user/:id",controller.user.update);
         app.delete("/user/:id",controller.user.deleteAccount);
         app.post("/upload",controller.post.createNewPost);
         app.post("/upload",controller.post.showAll);
         app.post("/upload/:id",controller.post.show);
         

}