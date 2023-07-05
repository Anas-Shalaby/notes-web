const router = require("express").Router();
const dashboardController = require('../controllers/dashboardController');
const {isLoggedIn} = require('../middleware/checkAuth');
/**
 * Dashboard Routes
 */

router.get('/dashboard' , isLoggedIn ,dashboardController.dashboard);
router.get('/dashboard/item/:id' , isLoggedIn ,dashboardController.viewNote);
router.put('/dashboard/item/:id' , isLoggedIn ,dashboardController.updateNote); 
router.delete('/dashboard/item-delete/:id' , isLoggedIn ,dashboardController.deleteNote); 
router.get('/dashboard/add' , isLoggedIn ,dashboardController.viewAddPage); 
router.post('/dashboard/add' , isLoggedIn ,dashboardController.addNote); 
router.get('/dashboard/search' , isLoggedIn ,dashboardController.search); 
router.post('/dashboard/search' , isLoggedIn ,dashboardController.searchSubmit); 

module.exports = router;