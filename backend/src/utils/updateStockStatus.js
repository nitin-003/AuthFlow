
module.exports = function updateStockStatus(product){
  if(product.quantity <= 0){
    product.status = "OUT_OF_STOCK";
  } 
  else if(product.quantity <= product.minStockLevel){
    product.status = "LOW_STOCK";
  } 
  else{
    product.status = "IN_STOCK";
  }
};


