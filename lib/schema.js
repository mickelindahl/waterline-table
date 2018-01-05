"Created by Mikael Lindahl on 2018-01-01"

"use strict"

const Joi = require('joi');

let data = {

    collections:Joi.object().required().description('Waterline collection'),
    datastores: Joi.object().required().description('Waterline datastores')

}


module.exports={
   all:Joi.object({

       collections:data.collections,
       datastores:data.datastores

   }),
   single:Joi.object({
       collections:data.collections,
       datastores:data.datastores,
       table:Joi.string().required().description('Table name ')

   })
}  ;



