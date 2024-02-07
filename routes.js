// routes.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const admin = require('./firebase'); // Import Firebase setup
const { app, upload } = require('./middleware');
const Detail = require('./schema'); // Import Mongoose schema/model
const router = express.Router();

// ... Other routes ...
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.post('/individual/mobile', upload.array('photoUrls', 4), async (req, res) => {
  try {
    const { name, review, price, offer, warranty, delivery, ram, ramsize, display, camera, battery, seller, description, modelnumber, modelname, color, browsetype, simtype, touchscreen, otg, cart, inthebox, hybridsimslot, sarvalue } = req.body;

    // Check if image files were uploaded
    const photoUrls = req.files;

    if (!photoUrls || photoUrls.length === 0) {
      return res.status(400).json({ error: 'At least one photoUrl is required' });
    }

    // You can now upload each photo and get the URLs (assuming you have the `uploadImageToFirebase` function)
    const uploadedPhotoUrls = await Promise.all(photoUrls.map(uploadImageToFirebase));

    const detail = new Detail({
      name,
      review,
      price,
      offer,
      warranty,
      delivery,
      ram,
      ramsize,
      display,
      camera,
      battery,
      seller,
      description,
      modelnumber,
      modelname,
      color,
      browsetype,
      simtype,
      touchscreen,
      otg,
      inthebox,
      hybridsimslot,
      sarvalue,
      photoUrls: uploadedPhotoUrls,
    });

    const savedDetail = await detail.save();
    res.status(201).json(savedDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

 //firebase:
async function uploadImageToFirebase(file) {
  const bucket = admin.storage().bucket();
  const fileBuffer = file.buffer;

  const fileName = `images/${Date.now()}_${file.originalname}`;
  const fileRef = bucket.file(fileName);

  const options = {
    destination: fileRef,
    metadata: {
      contentType: file.mimetype,
    },
  };

  await fileRef.save(fileBuffer, options);

  // Get the public URL of the uploaded file
  const [url] = await fileRef.getSignedUrl({ action: 'read', expires: '01-01-2030' });

  return url;
}
//get.product
router.get('/individual/mobile', async (req, res) => {
  try {
    // Use the Detail model to fetch all mobile items
    const mobileList = await Detail.find();

    if (!mobileList || mobileList.length === 0) {
      return res.status(404).json({ error: 'No mobile items found' });
    }

    res.status(200).json(mobileList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//get.product_id
router.get('/individual/mobile/:id', async (req, res) => {
  try {
    const mobileId = req.params.id;

    // Use the Detail model to find the mobile by ID
    const mobile = await Detail.findById(mobileId);

    if (!mobile) {
      return res.status(404).json({ error: 'Mobile not found' });
    }

    res.status(200).json(mobile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  return res.send("Hello world!");
});

router.put('/cart/:id', async (req, res) => {
  try {
    const { cart } = req.body;
    const { id } = req.params;

    console.log('Received PUT request with cart:', cart, 'and id:', id);

    if (cart === 0) {
      // If cart is 0, update the cart property to 1 for the specified ID
      const updatedDetail = await Detail.findByIdAndUpdate(
        id,
        { cart: 1 },
        { new: true } // Set new to true to return the modified document
      );

      if (!updatedDetail) {
        // If the document with the given ID is not found
        console.log('Mobile detail not found for id:', id);
        return res.status(404).json({ error: 'Mobile detail not found' });
      }

      console.log('Updated mobile detail:', updatedDetail);
      return res.status(200).json(updatedDetail);
    } else {
      // If cart is not 0, update the cart property to 0 for the specified ID
      const updatedDetail = await Detail.findByIdAndUpdate(
        id,
        { cart: 0 },
        { new: true } // Set new to true to return the modified document
      );

      if (!updatedDetail) {
        // If the document with the given ID is not found
        console.log('Mobile detail not found for id:', id);
        return res.status(404).json({ error: 'Mobile detail not found' });
      }

      console.log('Updated mobile detail:', updatedDetail);
      return res.status(200).json(updatedDetail);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/cart', async (req, res) => {
  try {
    // Assuming you have a Detail model
    const allCartDetails = await Detail.find({ cart: 1 }); // Find all documents with cart property set to 1

    if (!allCartDetails || allCartDetails.length === 0) {
      // If no cart details are found
      return res.status(404).json({ error: 'No cart details found' });
    }

    console.log('Fetched all cart details:', allCartDetails);
    return res.status(200).json(allCartDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/wishlist/:id', async (req, res) => {
  try {
    const { wishlist } = req.body;
    const { id } = req.params;

    console.log('Received PUT request with wishlist:', wishlist, 'and id:', id);

    if (wishlist === 0) {
      // If wishlist is 0, update the wishlist property to 1 for the specified ID
      const updatedDetail = await Detail.findByIdAndUpdate(
        id,
        { wishlist: 1 },
        { new: true }
      );

      if (!updatedDetail) {
        console.log('Mobile detail not found for id:', id);
        return res.status(404).json({ error: 'Mobile detail not found' });
      }

      console.log('Updated mobile detail:', updatedDetail);
      return res.status(200).json(updatedDetail);
    } else {
      // If wishlist is not 0, update the wishlist property to 0 for the specified ID
      const updatedDetail = await Detail.findByIdAndUpdate(
        id,
        { wishlist: 0 },
        { new: true }
      );

      if (!updatedDetail) {
        console.log('Mobile detail not found for id:', id);
        return res.status(404).json({ error: 'Mobile detail not found' });
      }

      console.log('Updated mobile detail:', updatedDetail);
      return res.status(200).json(updatedDetail);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/wishlist', async (req, res) => {
  try {
     // Assuming you have a Detail model
     const allWishlistDetails = await Detail.find({ wishlist: 1 }); // Find all documents with wishlist property set to 1

     if (!allWishlistDetails || allWishlistDetails.length === 0) {
       // If no wishlist details are found
       return res.status(404).json({ error: 'No wishlist details found' });
     }

    console.log('Fetched all wishlist details:', allWishlistDetails);
     return res.status(200).json(allWishlistDetails);
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Internal Server Error' });
   }
 });

router.put('/order/:id', async (req, res) => {
  try {
    const { order } = req.body;
    const { id } = req.params;

    console.log('Received PUT request with order:', order, 'and id:', id);

    if (order === 0) {
      // If order is 0, update the order property to 1 for the specified ID
      const updatedDetail = await Detail.findByIdAndUpdate(
        id,
        { order: 1 },
        { new: true }
      );

      if (!updatedDetail) {
        console.log('Mobile detail not found for id:', id);
        return res.status(404).json({ error: 'Mobile detail not found' });
      }

      console.log('Updated mobile detail:', updatedDetail);
      return res.status(200).json(updatedDetail);
    } else {
      // If order is not 0, update the order property to 0 for the specified ID
      const updatedDetail = await Detail.findByIdAndUpdate(
        id,
        { order: 0 },
        { new: true }
      );

      if (!updatedDetail) {
        console.log('Mobile detail not found for id:', id);
        return res.status(404).json({ error: 'Mobile detail not found' });
      }

      console.log('Updated mobile detail:', updatedDetail);
      return res.status(200).json(updatedDetail);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/orders', async (req, res) => {
  try {
    // Assuming you have a model called 'Detail' for orders
    const order = await Detail.find({order:1}); // Assuming Detail is the model for orders

    if (!order) {
      return res.status(404).json({ error: 'No orders found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// ... Other routes ...

module.exports = router;
