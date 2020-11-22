const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Product = require('../models/product-model');
const formidable = require('formidable');
const _ =require('lodash');
var fs = require('fs');



exports.productById=(req, res, next,id)=>{
  Product.findById(id).exec((err,product)=>{
    if(err||!product){
      const error = new HttpError(
        'ProductnotFound',
        400
      );
      return next(error);
    }
    req.product=product;
    next();
  });
}




exports.read=(req,res)=>{
  req.product.photo=undefined;
  return res.json(req.product);
}




exports.remove=(req,res)=>{
  let product =req.product;
  product.remove((err,deletedProduct)=>{
    if(err){
      const error = new HttpError(
        'Product deletion unsuccessful',
        400
      );
      return next(error);
    }
    res.json({message:"Product Deleted"})
  })
}



exports.create = (req, res,next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions=true
    form.parse(req,(err,fields,files)=>{
      if(err){
        return next(
          new HttpError('Image could ot Uploaded', 422)
        );
      }

      const {name,description,price,category,quatity}=fields
      if(!name||!description||!price||!category||!quatity){
        return(
          new HttpError('All Fields are required', 422)
        );
      }

      let product=new Product(fields);

      if(files.photo){
        if(files.photo.size>1000000){
          return next(
            new HttpError('Image should less tha 1m', 422)
          );
        }
        product.photo.data=fs.readFileSync(files.photo.path)
        product.photo.contentType=files.photo.type
      }

      product.save((err,result)=>{
        if(err){
          return next(
            new HttpError('could not Save', 422)
          );
        }
        res.json(result);
      });
    });

  };



exports.update = (req, res,next) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions=true
  form.parse(req,(err,fields,files)=>{
    if(err){
      return next(
        new HttpError('Image could ot Uploaded', 422)
      );
    }
    const {name,description,price,category,quatity}=fields
    if(!name||!description||!price||!category||!quatity){
      return(
        new HttpError('All Fields are required', 422)
      );
    }
    let product=req.product;
    product=_.extend(product,fields);
    if(files.photo){
      if(files.photo.size>1000000){
        return next(
          new HttpError('Image should less tha 1m', 422)
        );
      }
      product.photo.data=fs.readFileSync(files.photo.path)
      product.photo.contentType=files.photo.type
    }
    product.save((err,result)=>{
      if(err){
        return next(
          new HttpError('could not Save', 422)
        );
      }
      res.json(result);
    });
  });
};



exports.list = (req, res,next) => {
  let order = req.query.order ? req.query.order : 'asc'
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
  let limit = req.query.limit ? parseInt(req.query.limit) : 100

  Product.find()
    .select("-photo")
    .populate('category')
    .sort([[sortBy,order]])
    .limit(limit)
    .exec((err,products)=>{
      if(err){
        return next(
          new HttpError('Products ot foud', 422)
        );
      }
      res.json(products)
    })
}



exports.listRelated=(req, res,next) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  Product.find({_id:{$ne:req.product},category:req.product.category})
  .limit(limit)
  .populate('category','_id name')
  .exec((err,products)=>{
    if(err){
      return next(
        new HttpError('Products not foud', 422)
      );
    }
    res.json(products)
  })
}


exports.listCategories=(req, res,next) => {
  Product.distinct("category",{},(err,categories)=>{
    if(err){
      return next(
        new HttpError('Categories not foud', 422)
      );
    }
    res.json(categories);
  })
}




exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
      if (req.body.filters[key].length > 0) {
          if (key === "price") {
              // gte -  greater than price [0-10]
              // lte - less than
              findArgs[key] = {
                  $gte: req.body.filters[key][0],
                  $lte: req.body.filters[key][1]
              };
          } else {
              findArgs[key] = req.body.filters[key];
          }
      }
  }

  Product.find(findArgs)
      .select("-photo")
      .populate("category")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, data) => {
          if (err) {
            return(
              new HttpError('Products not foud', 422)
            );
          }
          res.json({
              size: data.length,
              data
          });
      });
};



exports.getPhoto=(req, res,next)=>{
  if(req.product.photo.data){
    res.set('Content-Type',req.product.photo.contentType)
    return res.send(req.product.photo.data)
  }
  next();
}





exports.decreaseQuantity = (req, res, next) => {
  let bulkOps = req.body.order.products.map(item => {
      return {
          updateOne: {
              filter: { _id: item._id },
              update: { $inc: { quantity: -item.count, sold: +item.count } }
          }
      };
  });

  Product.bulkWrite(bulkOps, {}, (error, products) => {
      if (error) {
          return res.status(400).json({
              error: 'Could not update product'
          });
      }
      next();
  });
};

