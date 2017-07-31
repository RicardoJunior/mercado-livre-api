import BaseController from './base.controller';
import fetch from 'node-fetch';

class ProductsController extends BaseController {

  searchItemPrice = (data) => {
    const value = data.price;

    return {
      "currency": data.currency_id,
      "amount": Math.trunc(data.price),
      "decimals": data.price.toFixed(2).replace('.', '').replace(Math.trunc(data.price), '')
    };
  };

  searchItemModel = (data) => ({
    "id": data.id,
    "title": data.title,
    "price": data ? ([data]).map(this.searchItemPrice)[0] : { "currency": "", "amount": 0, "decimals": "" },
    "picture": data.thumbnail,
    "condition": data.condition,
    "free_shipping": data.shipping.free_shipping
  });

  searchCategorieModel = (data) => data.name;

  searchAvailableFilter = (data) => data.id === 'category';

  searchModel = (data) => {
    const categories = (data.available_filters.filter(this.searchAvailableFilter));

    if (categories.length === 0) {
      categories.push({
        values: []
      });
    }

    return {
      "author": {
        "name": "",
        "lastname": ""
      },
      "categories": categories[0].values.map(this.searchCategorieModel),
      "items": data.results.slice(0, 4).map(this.searchItemModel)
    };
  };

  /**
   * Get products by text search
   */
  search = async (req, res, next) => {
    try {
      const response = await fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${req.query.search}`);
      const data = await response.json();
      res.json([data].map(this.searchModel));
    } catch(err) {
      next(err);
    }
  }

  itemModel = (data) => ({
    "author": {
      "name": "",
      "lastname": ""
    },
    "item": {
      "id": data.id,
      "title": data.title,
      "price": {
        "currency": data.currency_id,
        "amount": Math.trunc(data.price),
        "decimals": data.price.toFixed(2).replace('.', '').replace(Math.trunc(data.price), '')
      },
      "picture": data.thumbnail,
      "condition": data.condition,
      "free_shipping": data.shipping.free_shipping,
      "sold_quantity": data.sold_quantity,
    },
  });

  searchForId = async (req, res, next) => {
    try {
      const response = await fetch(`https://api.mercadolibre.com/items/${req.params.id}`);
      const data = await response.json();
      
      const responseDescription = await fetch(`https://api.mercadolibre.com/items/${req.params.id}/descriptions`);
      const dataDescription = await responseDescription.json();

      const itemData = [data].map(this.itemModel);

      if (itemData[0]) {
        itemData[0].item.description = dataDescription[0] ? dataDescription[0].text : '';
      }

      res.json(itemData);
    } catch(err) {
      next(err);
    }
  }

  fetch = (req, res) => {
    res.json(req.post);
  }
}

export default new ProductsController();
