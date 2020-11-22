const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Category = require('../models/category-model');



exports.getAllCategories = async (req, res, next) => {
  let categories;
  try {
    categories = await Category.find({});
  } catch (err) {
    const error = new HttpError(
      'Fetching categories failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({categories: categories.map(category => category.toObject({ getters: true }))});
};


exports.categoryById=(req, res, next,id)=>{
  Category.findById(id).exec((err,category)=>{
    if(err||!category){
      const error = new HttpError(
        'CategorynotFound',
        400
      );
      return next(error);
    }
    req.category=category;
    next();
  });
}



exports.read=(req,res)=>{
  return res.json(req.category);
}



exports.remove=(req,res)=>{
  let category =req.category;
  category.remove((err,deletedCategory)=>{
    if(err){
      const error = new HttpError(
        'Category deletion unsuccessful',
        400
      );
      return next(error);
    }
    res.json({message:"Category Deleted"})
  })
}


exports.create = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
    //const { name } = req.body;
    const category = new Category(req.body);
    try {
      await category.save();
    } catch (err) {
      const error = new HttpError(
        'Category creation failed, please try again.',
        500
      );
      return next(error);
    }  
  
    res.status(201).json({name: req.body.name});
  };
  
  
exports.update = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  //const { name } = req.body;
  const category = req.category;
  category=_.extend(product,fields);
  try {
    await category.save();
  } catch (err) {
    const error = new HttpError(
      'Category updation failed, please try again.',
      500
    );
    return next(error);
  }  

  res.status(201).json({name: req.body.name});
};
  
 