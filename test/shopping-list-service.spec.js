const ShoppingListService = require("../src/shopping-list-service");
const knex = require("knex");

describe(`Shopping List Service Object`, function() {
  let db;
  let testItem = [
    {
      id: 1,
      name: "Dog food",
      price: "5.99",
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      checked: false,
      category: "Breakfast"
    },
    {
      id: 2,
      name: "Cat food",
      price: "4.99",
      date_added: new Date("2028-01-22T16:28:32.615Z"),
      checked: true,
      category: "Lunch"
    },
    {
      id: 3,
      name: "Food",
      price: "10.99",
      date_added: new Date("2027-01-22T16:28:32.615Z"),
      checked: false,
      category: "Main"
    },
    {
      id: 4,
      name: "Scooby snacks",
      price: "0.99",
      date_added: new Date("2026-01-22T16:28:32.615Z"),
      checked: true,
      category: "Snack"
    }
  ];

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
  });

  afterEach(() => db("shopping_list").truncate());

  before(() => db("shopping_list").truncate());
  
  after(() => db.destroy());

  context(`If shopping_list has data`, () => {
    beforeEach(() => {
      return db.into("shopping_list").insert(testItem);
    });
    it(`getAllItems() resolves all Items from 'shopping_list' table`, () => {
      return ShoppingListService.getAllItems(db).then(actual => {
        expect(actual).to.eql(testItem);
      });
    });
    it(`getById() resolves an Item from 'shopping_list' table`, () => {
      const thirdId = 3;
      const thirdShoppingListItem = testItem[thirdId - 1];
      return ShoppingListService.getById(db, thirdId).then(actual => {
        expect(actual).to.eql({
          id: thirdId,
          name: thirdShoppingListItem.name,
          price: thirdShoppingListItem.price,
          date_added: thirdShoppingListItem.date_added,
          checked: thirdShoppingListItem.checked,
          category: thirdShoppingListItem.category
        });
      });
    });
    it(`deleteItem() removes an Item from the shopping_list table`, () => {
      const itemId = 2;
      return ShoppingListService.deleteItem(db, itemId)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          const expected = testItem.filter(item => item.id !== itemId);
          expect(allItems).to.eql(expected);
        });
    });
    it(`updateItem() updates an item from the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3;
      const newItemData = {
        name: "New Item Name",
        price: "2.99",
        date_added: new Date(),
        checked: true,
        category: "Lunch"
      };
      return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...newItemData
          });
        });
    });
  });
  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
        return ShoppingListService.getAllItems(db).then(actual => {
          expect(actual).to.eql([]);
        });
      });
      it(`insertItem() inserts an Item an resolves the new Item with an 'id'`, () => {
          const newItem = {
            name: "New Item Name",
            price: "2.99",
            date_added: new Date(),
            checked: true,
            category: "Lunch"
          };
          return ShoppingListService.insertItem(db, newItem).then(actual => {
              expect(actual).to.eql({
                id: 1,
                name: "New Item Name",
                price: "2.99",
                date_added: newItem.date_added,
                checked: true,
                category: "Lunch"
              });
          });
      });
  });
});