/*
  Update the hook to perform 

  - Whenever a product is updated, check if product's quantity is updated to zero
  - Check if product's suppliers have auto_order set to true
  - If yes, create order for this supplier and add the product to the order.
  - Set the order status as "created"

*/

export default ({action}, context) => {
  const { services, getSchema } = context;
  const { ItemsService, RelationsService } = services;

  action('product.items.update', async (input, {accountability}) => {
    // check the updated product quantity
    if(input.payload.quantity !== 0) return input;

    const serviceContext = {
      schema: await getSchema(),
      accountability
    }
    // set up services 
      const productService = new ItemsService('product', serviceContext);

      const supplierService = new ItemsService("supplier", serviceContext)

      const orderService = new ItemsService("order", serviceContext)

      
      const updatedItem =  await productService.readOne(input.keys[0], {
        fields: ['supplier.*']
      })

      const supplier = await supplierService.readOne(updatedItem.supplier[0].supplier_id, {
        fields: ['auto_order']
      })

      // verify auto order
      if(supplier.auto_order){
        const relationsService = await new RelationsService(serviceContext);

        // let relationship = await relationsService.readOne("order", "products");

      //   if(relationship){
      //   relationship = await relationsService.createOne({
      //     collection: 'order_product',
      //     field: 'product_id',
      //     related_collection: 'order',
      //   })
      // }

      // create new order
         const newOrder =await orderService.createOne({
          supplier: updatedItem.supplier[0].supplier_id,
          // products: [relationship.meta.id],
          status: 'created'
        })
       

        console.log(newOrder);
      }
            
      
  });


};
