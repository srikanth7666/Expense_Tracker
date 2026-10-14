const express=require('express');
const {getExpenses,CreateExpenses,getElementbyId,updateExpense,deleteExpense}=require('../controllers/expensecontroller');
const router=express.Router();

router.get('/', (req, res, next) => {
    console.log("🔥 ROUTE HIT");
    getExpenses(req, res, next);
});
router.post('/',CreateExpenses);
router.get('/:id',getElementbyId);
router.patch('/:id',updateExpense);
router.delete('/:id',deleteExpense);
module.exports=router;