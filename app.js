const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ebayAuth = require('./ebay_oauth_token');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000; 

var path = require('path');        

app.use(cors());



app.use(express.static(path.join(__dirname, 'dist/hw3')));


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/hw3/index.html'));
});



app.get('/search-ebay', async (req, res) => {
  try {
    const item = req.query;
    console.log("/search-ebay item: ",item);

    const fixedParams = {
      'OPERATION-NAME': 'findItemsAdvanced',
          'SERVICE-VERSION': '1.0.0',
          'SECURITY-APPNAME': 'ChiTingH-firstApp-PRD-672bbdc3d-c7a8127b',
          'RESPONSE-DATA-FORMAT': 'JSON',
          'paginationInput.entriesPerPage': 50,
          'REST-PAYLOAD': '',
    };

    const dynamicParams = {
      keywords: item.keyword,
      buyerPostalCode: item.locationOption === 'other' ? item.otherLocation : item.zipCode,
      'outputSelector(0)': 'SellerInfo',
      'outputSelector(1)': 'StoreInfo',
      'itemFilter(0).name': 'MaxDistance',
      'itemFilter(0).value': item.distance,
      'itemFilter(1).name': 'FreeShippingOnly',
      'itemFilter(1).value': item.freeShipping === 'true' ? 'true' : 'false',
      'itemFilter(2).name': 'LocalPickupOnly',
      'itemFilter(2).value': item.localPickup === 'true' ? 'true' : 'false',
      'itemFilter(3).name': 'HideDuplicateItems',
      'itemFilter(3).value': 'true'
    }
    var condition = {};
    if(item.New==='true' || item.Used==='true' || item.Unspecified==='true'){
      condition['itemFilter(4).name'] = 'Condition';
      var len = item.conditions.length;
      console.log("len: ", len);
      for(var i = 1; i < len; i++){
        condition[`itemFilter(4).value(${i})`] = item.conditions[i];
        console.log("condition: ", condition);
      }
    }

    var categoryId = {};
    if(item.category !== 'All Categories'){
      categoryId = {'categoryId': item.category};
      console.log("categoryId: ", categoryId);
    }

    const ebayResponse = await axios.get(
      'https://svcs.ebay.com/services/search/FindingService/v1',
      {
        params: {...fixedParams, ...dynamicParams, ...condition, ...categoryId},
      }
    );
    //'categoryId': '58058',
    console.log("params:", ebayResponse);
    const ebayData = ebayResponse.data;
    console.log("ebayData: ", ebayData);
    //res.json(ebayData);
    const ebayResult = processEbayData(ebayData);
    //console.log(ebayResult);
    res.json(ebayResult);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching eBay data.' });
  }
});


app.get('/search-ebay-example', async (req, res) => {
  try {
    const ebayResponse = await axios.get(
      'https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=ChiTingH-firstApp-PRD-672bbdc3d-c7a8127b&RESPONSE-DATA-FORMAT=JSON&paginationInput.entriesPerPage=50&REST-PAYLOAD=&keywords=lego&buyerPostalCode=90037&itemFilter(0).name=MaxDistance&itemFilter(0).value=100000&itemFilter(1).name=FreeShippingOnly&itemFilter(1).value=true&itemFilter(2).name=LocalPickupOnly&itemFilter(2).value=true&itemFilter(3).name=HideDuplicateItems&itemFilter(3).value=true&itemFilter(4).name=Condition&itemFilter(4).value(0)=New&itemFilter(4).value(1)=Used&itemFilter(4).value(2)=Unspecified&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo'
    );

    const ebayData = ebayResponse.data;
    res.json(ebayData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching eBay data.' });
  }
});


// get single item's details
const client_id = 'ChiTingH-firstApp-PRD-672bbdc3d-c7a8127b';
const client_secret = 'PRD-72bbdc3d30b3-d3b3-4e67-a244-f131';
const oauthToken = new ebayAuth(client_id, client_secret);

app.get('/get-single-item/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const id = '132961484706';

  const accessToken = await oauthToken.getApplicationToken();

  try {
    const ebayResponse = await axios.get(
      'https://open.api.ebay.com/shopping',
      {
        params: {
          callname: 'GetSingleItem',
          responseencoding: 'JSON',
          appid: client_id,
          siteid: 0,
          version: 967,
          ItemID: itemId ,
          IncludeSelector: 'Description,Details,ItemSpecifics',
        },
        headers: {
          'X-EBAY-API-IAF-TOKEN': accessToken,
        }
      }
    );

    const ebayData = ebayResponse.data;
    // console.log("ebayResponse: " + ebayResponse);
    // console.log("ebayData: " + ebayData);

    const ebayResult = processEbaySingleItemData(ebayData);
    //console.log(ebayResult);
    res.json(ebayResult);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching eBay data.' });
  }
});


app.get('/search-similar', async (req, res) => {
  const {itemId} = req.query;
  //console.log("itemId: " + itemId);
  const id = '126149531088';
  //404568883033
  //'394884844909'
  //'132961484706'
  try {
    const ebayResponse = await axios.get(
      'https://svcs.ebay.com/MerchandisingService',
      {
        params: {
          'OPERATION-NAME': 'getSimilarItems',
          'SERVICE-NAME': 'MerchandisingService',
          'SERVICE-VERSION': '1.1.0',
          'CONSUMER-ID' : 'ChiTingH-firstApp-PRD-672bbdc3d-c7a8127b',
          'RESPONSE-DATA-FORMAT': 'JSON',
          'REST-PAYLOAD': '',
          'itemId' : itemId,
          'maxResults' : 20,
        },
      }
    );
    const ebayData = ebayResponse.data;
    //console.log(ebayData);
    //res.json(ebayData);

    //const ebayResult = processEbayData(ebayData);
    //console.log(ebayResult);
    const ebayResult = processSearchSimilarData(ebayData);
    res.json(ebayResult);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching eBay data.' });
  }
});

function processSearchSimilarData(ebayData) {
  const itemRecommendations = ebayData.getSimilarItemsResponse?.itemRecommendations;

  if (!itemRecommendations) {
    return [];
  }

  const items = itemRecommendations.item?.map(item => {
    const productName = item.title || null;
    const productImage = item.imageURL || null;
    const price = item.buyItNowPrice ? item.buyItNowPrice.__value__ : null;
    const shippingCost = item.shippingCost ? item.shippingCost.__value__ : null;
    const daysLeftMatch = item.timeLeft.match(/P(\d+)D/);
    const daysLeft = daysLeftMatch ? daysLeftMatch[1] : null;
    const itemURL = item.viewItemURL || null;

    return {
      productName,
      productImage,
      price,
      shippingCost,
      daysLeft,
      itemURL,
    };
  }) || [];

  return items;
}


function processEbaySingleItemData(ebayData) {
  const item = ebayData.Item;
//console.log("item: " + ebayData);
  if (!item) {
    return null; 
  }


  const title = item.Title;
  const itemURL = item.ViewItemURLForNaturalSearch;
  const itemId = item.ItemID;
  const description = item.Description;
  const productImages = item.PictureURL;
  const price = item.CurrentPrice.Value;
  const location = item.Location;
  const itemSpecifics = item.ItemSpecifics.NameValueList.map(item => ({
  name: item.Name,
  value: item.Value[0]
}));


  const result = {
    Title: title,
    ItemID: itemId,
    itemURL: itemURL,
    productImages: productImages,
    Description: description,
    productImages: productImages,
    Price: price,
    Location: location,
    ItemSpecifics: itemSpecifics,
    // Include other extracted details
  };

  return result;
}



function processEbayData(ebayData) {
  const findItemsResponse = ebayData.findItemsAdvancedResponse || [];
  const searchResult = findItemsResponse[0]?.searchResult || [];
  const items = searchResult[0]?.item || [];
  if(items.length === 0){
    console.log("items.length === 0");
    return null;
  }


  const results = ebayData.findItemsAdvancedResponse[0].searchResult[0].item;
  console.log("results: ", results);
  // shipping information
  const shippingCosts = [];
  const shippingLocations = [];
  const handlingTimes = [];
  const expeditedShipping = [];
  const oneDayShipping = [];
  const returnAccepted = [];

  //seller Infomation
  const feedbackScores = [];
  const popularities = [];
  const feedbackRatingStars = [];
  const topRatedSellers = [];
  const storeNames = [];
  const storeURLs = [];


  const processedData = results.map((item, index) => {
    const galleryURL = item.galleryURL[0];
    const title = item.title[0];
    const currentPrice = item.sellingStatus[0].currentPrice[0].__value__;
    const cost = parseFloat(item.shippingInfo[0].shippingServiceCost[0].__value__);
    const postalCode = item.postalCode[0];
    const itemId = item.itemId[0];


    //shipping Infomation
    const shippingInfo = item.shippingInfo[0];
    const shippingCost = shippingInfo.shippingServiceCost[0]?.__value__ || null;
    shippingCosts.push(shippingCost);
    const shipToLocations = shippingInfo.shipToLocations[0] || null;
    shippingLocations.push(shipToLocations);
    const handlingTime = shippingInfo.handlingTime && shippingInfo.handlingTime[0] || null;
    handlingTimes.push(handlingTime);
    const isExpeditedShipping = shippingInfo.expeditedShipping[0] === 'true';
    expeditedShipping.push(isExpeditedShipping);
    const isOneDayShipping = shippingInfo.oneDayShippingAvailable[0] === 'true';
    oneDayShipping.push(isOneDayShipping);
    const isReturnAccepted = item.returnsAccepted[0] === 'true';
    returnAccepted.push(isReturnAccepted);


    //seller Infomation
    const sellerInfo = item.sellerInfo[0];
    const storeInfo = item.storeInfo?.[0];
    const feedbackScore = sellerInfo?.feedbackScore[0] || null;
    feedbackScores.push(feedbackScore);
    const popularitie = sellerInfo?.positiveFeedbackPercent[0] || null;
    popularities.push(popularitie);
    const feedbackRatingStar = sellerInfo?.feedbackRatingStar[0] || null;
    feedbackRatingStars.push(feedbackRatingStar);
    const topRatedSeller = sellerInfo?.topRatedSeller[0] || null;
    topRatedSellers.push(topRatedSeller);
    const storeName = storeInfo?.storeName[0] || null;
    storeNames.push(storeName);
    const storeURL = storeInfo?.storeURL[0] || null;
    storeURLs.push(storeURL);

    let shipping = 'N/A';
    if (cost === 0.0) {
      shipping = 'Free Shipping';
    } else if (!isNaN(cost)) {
      shipping = `$${cost.toFixed(2)}`;
    }

    return {
      Index: index + 1,
      Image: galleryURL,
      Title: title,
      Price: currentPrice,
      Shipping: shipping,
      Zip: postalCode,
      itemId: itemId,
      shippingInfo:{
        shippingCost: shippingCost,
        shipToLocations: shipToLocations,
        handlingTime: handlingTime,
        isExpeditedShipping: isExpeditedShipping,
        isOneDayShipping: isOneDayShipping,
        isReturnAccepted: isReturnAccepted,
      },
      sellerInfo:{
        feedbackScore: feedbackScore,
        popularitie: popularitie,
        feedbackRatingStar: feedbackRatingStar,
        topRatedSeller: topRatedSeller,
        storeName: storeName,
        storeURL: storeURL,
      },
    };
  });

  return processedData;
}

app.get('/search-google', async (req, res) => {
  try {
    const {keyword} = req.query;
    //console.log("keyword: ",{keyword});
    const googleResponse = await axios.get(
      'https://www.googleapis.com/customsearch/v1',
      {
        params: {
          q: keyword,
          cx: '13a31e04146824fa6',
          imgSize: 'huge',
          imgType: 'photo',
          num: 8,
          searchType: 'image',
          key: 'AIzaSyDamY_OjcqDSqWimU_2JqTw7gVwjW-9Hog',
        },
      }
    );

    const googleData = googleResponse.data;
    const thumbnailLinks = googleData.items.map(item => item.image.thumbnailLink);

    res.json({ thumbnailLinks });
  } catch (error) {
    console.error('Error:', error);
    if (error.response && error.response.data) {
      console.error('Google API Error Response:', error.response.data);
    }
    res.status(500).json({ error: 'An error occurred while fetching Google data.' });
  }

});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


// database

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dafdafdaf0411:f2lyXxTT4lzxldXL@cluster0.g0ieevi.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    await client.db("HW3").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    //console.log("Closing the connection");
    //await client.close();
  }
}
run().catch(console.dir);

const myDB = client.db("HW3");
const myColl = myDB.collection("favorites");
const { ObjectId } = require('mongodb');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/post-wish-list', async (req, res) => {
  try {
    const data = req.body;
    console.log("data: ", data);
    const result = await myColl.insertOne(data);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    res.status(200).json({ _id: result.insertedId });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while inserting data into the database.' });
  }
});


app.get('/get-wish-list', async (req, res) => {
  try {
    const data = await myColl.find({}).toArray();
    console.log("get-wish-list data: ", data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching data from the database.' });
  }
});

app.delete('/delete-wish-list-item/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log("itemId: ", itemId);
    const objectId = new ObjectId(itemId);
    console.log("itemId objectId: ", objectId);
    const result = await myColl.deleteOne({ _id: objectId });
    console.log(`Deleted ${result.deletedCount} item(s).`);
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while deleting data from the database.' });
  }
});


/*

“How to create MongoDB connection in node.js” prompt (10 line). ChatGPT, 4 Sep. version, OpenAI, 11/1/2023, chat.openai.com/chat.

*/