require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

function searchProductName(searchTerm) {
    knexInstance
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(res => {
        console.log(res)
    })
}

searchProductName('')
function paginatedProducts(page) {
    const productsPerPage = 10
    const offset = productsPerPage * (page - 1)
    knexInstance
    .select('*')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(res => {
        console.log(res)
    })
}

paginatedProducts(3)
function itemsAddedByDate(daysAgo) {
    knexInstance
    .select('*')
    .from('shopping_list')
    .where('date_added', '>', knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
    .then(res => {
        console.log(res)
    })
}

itemsAddedByDate(12)

function totalCost() {
    knexInstance
    .select('category')
    .from('shopping_list')
    .groupBy('category')
    .sum('price')
    .then(res => {
        console.log(res)
    })
}

totalCost()