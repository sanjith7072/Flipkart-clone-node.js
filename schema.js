// schema.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mobile_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const detailSchema = new mongoose.Schema({
  // ... your schema fields
  
    name: String,
    review: String,
    price: String,
    offer: String,
    warranty: String,
    delivery: String,
    ram: String,
    ramsize: String,
    display: String,
    camera: String,
    battery: String,
    seller: String,
    description: String,
    modelnumber: String,
    modelname: String,
    color: String,
    browsetype: String,
    simtype: String,
    touchscreen: String,
    otg: String,
    photoUrls: [String],
    cart: {type :String,
           default: '0',
         },
    wishlist: {type:String,
               default: '0',
             },
    hybridsimslot: String,
    inthebox: String,
    sarvalue: String,
    order: {type :String,
            default: '0',
          },
}, { collection: 'product_details' });

const Detail = mongoose.model('Detail', detailSchema);

module.exports = Detail;
